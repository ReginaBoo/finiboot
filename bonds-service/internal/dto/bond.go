package dto

import "bonds-service/internal/models"

type ResponseBonds struct {
	Content       []models.Bond `json:"content"`
	TotalPages    int           `json:"total_pages"`
	TotalElements int64         `json:"total_elements"`
	Size          int           `json:"size"`
	Number        int           `json:"number"`
}

type RequestBondBatch struct {
	ISINs []string `json:"isins"`
}

type BondFilters struct {
	Sector                string `form:"sector"`
	CouponQuantityPerYear int    `form:"coupon_quantity"`
	FloatingCouponFlag    *bool  `form:"floating_coupon"`
	AmortizationFlag      *bool  `form:"amortization"`
}
