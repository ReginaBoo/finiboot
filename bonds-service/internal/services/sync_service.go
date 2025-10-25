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
	"google.golang.org/protobuf/types/known/timestamppb"
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

// ShouldSyncOnStart проверяет, нужно ли синхронизировать при старте
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
		if err := s.createOrUpdateBond(bond); err != nil {
			log.Printf("Failed to sync bond %s: %v", bond.GetIsin(), err)
			continue
		}
		successCount++
	}
	var totalCount int64
	s.db.Model(&models.Bond{}).Count(&totalCount)

	log.Printf("Synchronization completed: %d/%d bonds processed, total in DB: %d",
		successCount, len(bonds), totalCount)

	return nil
}

func (s *SyncService) createOrUpdateBond(bond *pb.Bond) error {

	appBond := models.Bond{
		ISIN:            bond.Isin,
		Name:            bond.Name,
		Ticker:          bond.GetTicker(),
		FaceValue:       float64(bond.GetNominal().GetUnits()) + float64(bond.GetNominal().GetNano())/1e9,
		Currency:        bond.Currency,
		CouponFrequency: int(bond.GetCouponQuantityPerYear()),
		MaturityDate:    s.convertStateRegDate(bond.MaturityDate),
		IssueDate:       s.convertStateRegDate(bond.StateRegDate),
		Issuer:          bond.GetSector(),
		Type:            s.determineBondType(bond),
		Available:       bond.GetBuyAvailableFlag() && bond.GetSellAvailableFlag(),
	}

	return s.db.Where(models.Bond{ISIN: appBond.ISIN}).FirstOrCreate(&appBond).Error
}

func (s *SyncService) determineBondType(bond *pb.Bond) string {
	ticker := bond.GetTicker()
	country := bond.GetCountryOfRisk()

	if country == "RU" {
		if len(ticker) >= 2 && (ticker[:2] == "SU" || ticker[:2] == "RU") {
			return "government" // ОФЗ
		} else if len(ticker) >= 1 && ticker[0] == 'X' {
			return "municipal" // Муниципальные
		}
	}
	return "corporate" // Корпоративные
}

func (s *SyncService) convertStateRegDate(ts *timestamppb.Timestamp) *time.Time {
	if ts == nil {
		return nil // Если указатель nil, возвращаем nil
	}

	date := ts.AsTime()
	return &date
}
