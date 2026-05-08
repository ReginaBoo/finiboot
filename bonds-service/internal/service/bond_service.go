package service

import (
	"bonds-service/internal/cache"
	"bonds-service/internal/dto"
	"bonds-service/internal/models"
	"bonds-service/internal/repository"
	"context"
	"fmt"
	"log"

	"gorm.io/gorm"
)

type BondRepository interface {
	FindAll(ctx context.Context, page, size int, filters dto.BondFilters) ([]models.Bond, int, int64, error)
}

type BondService struct {
	db    *gorm.DB
	cache *cache.PriceCache
	repo  BondRepository
}

func NewBondService(db *gorm.DB, priceCache *cache.PriceCache, repository *repository.BondRepository) *BondService {
	return &BondService{db: db, cache: priceCache, repo: repository}
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

func (s *BondService) GetAllBonds(ctx context.Context, page, size int, filters dto.BondFilters) ([]models.Bond, int, int64, error) {
	bonds, totalPages, totalElements, err := s.repo.FindAll(ctx, page, size, filters)
	if err != nil {
		return nil, 0, 0, err
	}

	for i := range bonds {
		price, err := s.cache.GetPrice(ctx, bonds[i].ISIN)
		if err != nil {
			// Если здесь будет много таких логов, значит ключи в Redis не совпадают с ISIN в базе
			log.Printf("CACHE MISS: No price for ISIN %s", bonds[i].ISIN)
		} else {
			log.Printf("CACHE HIT: Price for %s is %f", bonds[i].ISIN, price)
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

	for i := range bonds {
		price, err := s.cache.GetPrice(ctx, bonds[i].ISIN)
		if err == nil {
			bonds[i].LastPrice = price
		}
	}

	return bonds, nil
}
