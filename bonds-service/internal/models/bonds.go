package models

import "time"

type Bond struct {
	ID                    uint       `json:"bond_id" gorm:"primaryKey"`
	FIGI                  string     `json:"figi" gorm:"uniqueIndex;not null"`
	ISIN                  string     `json:"isin"`
	Ticker                string     `json:"ticker"`
	Name                  string     `json:"name"`
	Currency              string     `json:"currency"`
	Nominal               float64    `json:"nominal"`
	InitialNominal        float64    `json:"initial_nominal"`
	CouponQuantityPerYear int        `json:"coupon_quantity_per_year"`
	FloatingCouponFlag    bool       `json:"floating_coupon_flag"`
	PerpetualFlag         bool       `json:"perpertual_flag"`
	AmortizationFlag      bool       `json:"amortisation_flag"`
	BuyAvailableFlag      bool       `json:"buy_available_flag"`
	SellAvailableFlag     bool       `json:"sell_available_flag"`
	MaturityDate          *time.Time `json:"maturity_date"`
	PlacementDate         *time.Time `json:"placement_date"`
	StateRegDate          *time.Time `json:"state_reg_date"`
	Sector                string     `json:"sector"`
	CountryOfRiskName     string     `json:"country_of_risk_name"`
	BondType              string     `json:"bond_type"`
	CreatedAt             time.Time  `json:"created_at"`
	UpdatedAt             time.Time  `json:"updated_at"`

	Coupons []Coupon `gorm:"foreignKey:BondFIGI;references:FIGI"`
}
