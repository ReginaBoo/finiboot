package service

import (
	"bonds-service/internal/models"
	"fmt"
	"log"
	"time"

	"github.com/russianinvestments/invest-api-go-sdk/investgo"
	pb "github.com/russianinvestments/invest-api-go-sdk/proto"
	"gorm.io/gorm"
)

type SyncService struct {
	db     *gorm.DB
	client *investgo.Client
}

func NewSyncService(db *gorm.DB, client *investgo.Client) *SyncService {
	return &SyncService{
		db:     db,
		client: client,
	}
}

func (s *SyncService) SyncBondsFromTbank() error {

	instrumentsService := s.client.NewInstrumentsServiceClient()

	bondsResp, err := instrumentsService.Bonds(pb.InstrumentStatus_INSTRUMENT_STATUS_ALL)
	if err != nil {
		return err
	}

	bonds := bondsResp.GetInstruments()
	log.Printf("Retrieved %d bonds from Tinkoff API", len(bonds))

	successCount := 0

	for _, bond := range bonds {

		if !isValidBond(bond) {
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

	log.Printf(
		"Synchronization completed: %d/%d bonds processed, total in DB: %d",
		successCount,
		len(bonds),
		totalCount,
	)

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
	}

	var existing models.Bond
	err := s.db.Where("figi = ?", bond.FIGI).First(&existing).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return s.db.Create(&bond).Error
		}
		return err
	}

	bond.ID = existing.ID
	return s.db.Save(&bond).Error
}

func (s *SyncService) syncCouponsForBond(instrumentsService *investgo.InstrumentsServiceClient, pbBond *pb.Bond) error {
	log.Printf("Syncing coupons for a bond: %s (%s)", pbBond.Name, pbBond.Figi)

	from := time.Unix(0, 0)
	to := time.Now().AddDate(30, 0, 0)

	resp, err := instrumentsService.GetBondCoupons(pbBond.Figi, from, to)
	if err != nil {
		return fmt.Errorf("couldn't get coupons for %s: %v", pbBond.Figi, err)
	}

	if resp.GetBondCouponsResponse == nil || len(resp.Events) == 0 {
		log.Printf("There are no coupons for %s (%s)", pbBond.Name, pbBond.Figi)
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

		var existing models.Coupon
		err := s.db.Where("bond_figi = ? AND coupon_number = ?", coupon.BondFIGI, coupon.CouponNumber).
			First(&existing).Error

		if err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := s.db.Create(&coupon).Error; err != nil {
					return fmt.Errorf("Error creating coupon %s #%d: %v", coupon.BondFIGI, coupon.CouponNumber, err)
				}
				log.Printf("Coupon added #%d for %s", coupon.CouponNumber, coupon.BondFIGI)
				continue
			}
			return err
		}

		coupon.ID = existing.ID
		if err := s.db.Save(&coupon).Error; err != nil {
			return fmt.Errorf("Error updating coupon %s #%d: %v", coupon.BondFIGI, coupon.CouponNumber, err)
		}
		log.Printf("Coupon updated #%d for %s", coupon.CouponNumber, coupon.BondFIGI)
	}

	return nil
}

func isValidBond(bond *pb.Bond) bool {
	if moneyToFloat(bond.Nominal) == 0 {
		return false
	}

	if bond.Currency != "rub" {
		return false
	}

	if !bond.BuyAvailableFlag || !bond.SellAvailableFlag {
		return false
	}

	return true
}

func moneyToFloat(m *pb.MoneyValue) float64 {
	if m == nil {
		return 0
	}
	return float64(m.Units) + float64(m.Nano)/1e9
}
