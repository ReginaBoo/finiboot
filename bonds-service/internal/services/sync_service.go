package services

import (
	"bonds-service/internal/models"
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/russianinvestments/invest-api-go-sdk/investgo"
	pb "github.com/russianinvestments/invest-api-go-sdk/proto"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gorm.io/gorm"
)

type SyncService struct {
	db *gorm.DB
}

func NewSyncService(db *gorm.DB) *SyncService {
	return &SyncService{
		db: db,
	}
}

func (s *SyncService) ShouldSyncOnStart() bool {
	syncOnStart := os.Getenv("SYNC_ON_START")
	return syncOnStart == "true"
}

func (s *SyncService) SyncBondsFromTbank() error {
	token := os.Getenv("TOKEN_API_TBANK")
	if token == "" {
		return fmt.Errorf("Tbank token not found")
	}

	config := investgo.Config{
		EndPoint: "invest-public-api.tinkoff.ru:443",
		Token:    token,
		AppName:  "bonds-service",
	}
	zapConfig := zap.NewDevelopmentConfig()
	zapConfig.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout(time.DateTime)
	zapConfig.EncoderConfig.TimeKey = "time"
	l, err := zapConfig.Build()
	logger := l.Sugar()
	defer func() {
		err := logger.Sync()
		if err != nil {
			log.Printf(err.Error())
		}
	}()
	if err != nil {
		log.Fatalf("logger creating error %v", err)
	}
	client, err := investgo.NewClient(context.Background(), config, logger)
	if err != nil {
		return err
	}
	defer client.Stop()

	instrumentsService := client.NewInstrumentsServiceClient()

	bondsResp, err := instrumentsService.Bonds(pb.InstrumentStatus_INSTRUMENT_STATUS_ALL)
	if err != nil {
		return err
	}

	bonds := bondsResp.GetInstruments()
	log.Printf("Retrieved %d bonds from Tinkoff API", len(bonds))

	successCount := 0
	for _, bond := range bonds {

		if moneyToFloat(bond.Nominal) == 0 || bond.Currency != "rub" || !bond.BuyAvailableFlag || !bond.SellAvailableFlag {
			continue
		}

		if err := s.createOrUpdateBond(bond); err != nil {
			log.Printf("Failed to sync bond %s: %v", bond.GetIsin(), err)
			continue
		}
		if err := s.syncCouponsForBond(instrumentsService, bond); err != nil {
			log.Printf("Failed to sync coupons for bond %s: %v", bond.Figi, err)
		}

		successCount++
	}
	var totalCount int64
	s.db.Model(&models.Bond{}).Count(&totalCount)

	log.Printf("Synchronization completed: %d/%d bonds processed, total in DB: %d",
		successCount, len(bonds), totalCount)

	return nil
}

func (s *SyncService) createOrUpdateBond(pbBond *pb.Bond) error {

	var maturityDate, placementDate, stateRegDate *time.Time

	if pbBond.MaturityDate != nil {
		t := pbBond.MaturityDate.AsTime()
		maturityDate = &t
	}
	if pbBond.PlacementDate != nil {
		t := pbBond.PlacementDate.AsTime()
		placementDate = &t
	}
	if pbBond.StateRegDate != nil {
		t := pbBond.StateRegDate.AsTime()
		stateRegDate = &t
	}

	bond := models.Bond{
		FIGI:                  pbBond.Figi,
		ISIN:                  pbBond.Isin,
		Ticker:                pbBond.Ticker,
		Name:                  pbBond.Name,
		Currency:              pbBond.Currency,
		Nominal:               moneyToFloat(pbBond.Nominal),
		InitialNominal:        moneyToFloat(pbBond.InitialNominal),
		CouponQuantityPerYear: int(pbBond.CouponQuantityPerYear),
		FloatingCouponFlag:    pbBond.FloatingCouponFlag,
		PerpetualFlag:         pbBond.PerpetualFlag,
		AmortizationFlag:      pbBond.AmortizationFlag,
		BuyAvailableFlag:      pbBond.BuyAvailableFlag,
		SellAvailableFlag:     pbBond.SellAvailableFlag,
		MaturityDate:          maturityDate,
		PlacementDate:         placementDate,
		StateRegDate:          stateRegDate,
		Sector:                pbBond.Sector,
		CountryOfRiskName:     pbBond.CountryOfRiskName,
		BondType:              pbBond.BondType.String(),
		UpdatedAt:             time.Now(),
	}

	// Проверяем, есть ли такая облигация
	var existing models.Bond

	if err := s.db.Where("figi = ?", bond.FIGI).Attrs(bond).FirstOrCreate(&existing).Error; err != nil {
		return fmt.Errorf("ошибка при сохранении облигации %s: %v", bond.FIGI, err)
	}

	return nil
}

func moneyToFloat(m *pb.MoneyValue) float64 {
	if m == nil {
		return 0
	}
	return float64(m.Units) + float64(m.Nano)/1e9
}

func (s *SyncService) syncCouponsForBond(instrumentsService *investgo.InstrumentsServiceClient, pbBond *pb.Bond) error {
	log.Printf("Синхронизация купонов для облигации: %s (%s)", pbBond.Name, pbBond.Figi)

	// Устанавливаем широкий диапазон дат, чтобы точно получить все купоны
	from := time.Unix(0, 0)            // с самого начала времён
	to := time.Now().AddDate(30, 0, 0) // +20 лет вперёд

	// Получаем купоны из API
	resp, err := instrumentsService.GetBondCoupons(pbBond.Figi, from, to)
	if err != nil {
		return fmt.Errorf("не удалось получить купоны для %s: %v", pbBond.Figi, err)
	}

	if resp.GetBondCouponsResponse == nil || len(resp.Events) == 0 {
		log.Printf("Нет купонов для %s (%s)", pbBond.Name, pbBond.Figi)
		return nil
	}

	for _, event := range resp.Events {
		coupon := models.Coupon{
			BondFIGI:     pbBond.Figi,
			CouponNumber: event.CouponNumber,
			CouponDate:   event.CouponDate.AsTime(),
			PayOneBond:   moneyToFloat(event.PayOneBond),
			CouponType:   event.CouponType.String(),
		}

		if event.CouponStartDate != nil {
			t := event.CouponStartDate.AsTime()
			coupon.CouponStart = &t
		}
		if event.CouponEndDate != nil {
			t := event.CouponEndDate.AsTime()
			coupon.CouponEnd = &t
		}
		coupon.CouponPeriod = event.CouponPeriod

		// Проверяем, существует ли уже этот купон
		// Создаём, если ещё нет
		var existing models.Coupon
		if err := s.db.Where("bond_figi = ? AND coupon_number = ?", coupon.BondFIGI, coupon.CouponNumber).
			Attrs(coupon).FirstOrCreate(&existing).Error; err != nil {
			return fmt.Errorf("ошибка при сохранении купона %s #%d: %v", coupon.BondFIGI, coupon.CouponNumber, err)
		}

		log.Printf(" Добавлен купон #%d для %s", coupon.CouponNumber, coupon.BondFIGI)
	}

	return nil
}
