package dto

import "time"

type ResponseBond struct {
	ISIN     string      `json:"isin"`
	FIGI     string      `json:"figi"`
	Name     string      `json:"name"`
	Nominal  float64     `json:"nominal"`
	Currency string      `json:"currency"`
	Coupons  interface{} `json:"coupons"`
}

type CouponAnalytics struct {
	Month  string  `json:"month"`
	Amount float64 `json:"amount"`
}

type BondPayment struct {
	Date   time.Time `json:"date"`
	Amount float64   `json:"amount"`
}
