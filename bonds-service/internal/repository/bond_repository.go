package repository

import (
	"context"
	"math"

	"bonds-service/internal/dto"
	"bonds-service/internal/models"

	"gorm.io/gorm"
)

type BondRepository struct {
	db *gorm.DB
}

func NewBondRepository(db *gorm.DB) *BondRepository {
	return &BondRepository{db: db}
}

func (r *BondRepository) FindAll(ctx context.Context, page, size int, filters dto.BondFilters) ([]models.Bond, int, int64, error) {
	var bonds []models.Bond
	var totalElements int64

	query := r.db.WithContext(ctx).Model(&models.Bond{})

	if filters.Sector != "" {
		query = query.Where("sector = ?", filters.Sector)
	}

	if filters.CouponQuantityPerYear > 0 {
		query = query.Where("coupon_quantity_per_year = ?", filters.CouponQuantityPerYear)
	}
	if filters.FloatingCouponFlag != nil {
		query = query.Where("floating_coupon_flag = ?", *filters.FloatingCouponFlag)
	}
	if filters.AmortizationFlag != nil {
		query = query.Where("amortization_flag = ?", *filters.AmortizationFlag)
	}

	if err := query.Count(&totalElements).Error; err != nil {
		return nil, 0, 0, err
	}

	offset := (page) * size
	err := query.Preload("Coupons").Offset(offset).Limit(size).Find(&bonds).Error

	totalPages := int(math.Ceil(float64(totalElements) / float64(size)))

	return bonds, totalPages, totalElements, err
}
