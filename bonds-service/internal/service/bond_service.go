package service

import (
	"bonds-service/internal/cache"
	"bonds-service/internal/dto"
	"bonds-service/internal/models"
	"context"
	"fmt"

	"gorm.io/gorm"
)

type BondService struct {
	db    *gorm.DB
	cache *cache.PriceCache
}

func NewBondService(db *gorm.DB, priceCache *cache.PriceCache) *BondService {
	return &BondService{db: db, cache: priceCache}
}

func (s *BondService) GetBondByISIN(ctx context.Context, isin string) (*models.Bond, error) {
	var bond models.Bond
	if err := s.db.WithContext(ctx).Preload("Coupons").Where("isin = ?", isin).First(&bond).Error; err != nil {
		return nil, fmt.Errorf("failed to get bond %s: %w", isin, err)
	}

	cachedPrice, err := s.cache.GetPrice(ctx, isin)
	if err == nil {
		bond.LastPrice = cachedPrice
	}

	return &bond, nil
}

func (s *BondService) GetAllBonds(ctx context.Context, page, size int) ([]models.Bond, int, int64, error) {
	var totalElements int64
	if err := s.db.WithContext(ctx).Model(&models.Bond{}).Count(&totalElements).Error; err != nil {
		return nil, 0, 0, fmt.Errorf("error when counting bonds: %w", err)
	}

	totalPages := int((totalElements + int64(size) - 1) / int64(size))

	var bonds []models.Bond
	offset := page * size
	if err := s.db.Preload("Coupons").Offset(offset).Limit(size).Find(&bonds).Error; err != nil {
		return nil, 0, 0, fmt.Errorf("error when receiving the bonds: %w", err)
	}

	for i := range bonds {
		price, err := s.cache.GetPrice(ctx, bonds[i].ISIN)
		if err == nil {
			bonds[i].LastPrice = price
		}
	}

	return bonds, totalPages, totalElements, nil
}

func (s *BondService) GetBondsBatch(ctx context.Context, req dto.RequestBondBatch) ([]models.Bond, error) {
	if len(req.ISINs) == 0 {
		return []models.Bond{}, nil
	}

	var bonds []models.Bond
	if err := s.db.WithContext(ctx).Preload("Coupons").Where("isin IN ?", req.ISINs).Find(&bonds).Error; err != nil {
		return nil, fmt.Errorf("failed to get bonds: %w", err)
	}

	return bonds, nil
}

func (s *BondService) SearchBonds(ctx context.Context, query string) ([]models.Bond, error) {
	var bonds []models.Bond
	search := "%" + query + "%"

	if err := s.db.WithContext(ctx).Where("LOWER(name) LIKE LOWER(?) OR LOWER(ticker) LIKE LOWER(?) OR LOWER(isin) LIKE LOWER(?)", search, search, search).
		Preload("Coupons").
		Limit(100).
		Find(&bonds).Error; err != nil {
		return nil, fmt.Errorf("failed to search bonds from query \"%s\": %w", query, err)
	}

	return bonds, nil
}
