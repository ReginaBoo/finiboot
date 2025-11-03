package models

import "time"

type Coupon struct {
	ID           uint       `json:"coupon_id" gorm:"primaryKey"`
	BondFIGI     string     `json:"figi" gorm:"index;not null"`
	CouponNumber int64      `json:"coupon_number"`
	CouponDate   time.Time  `json:"coupon_date"`  // дата выплаты
	PayOneBond   float64    `json:"pay_one_bond"` // сумма выплаты на одну облигацию
	CouponType   string     `json:"coupon_type"`  // тип купона
	CouponStart  *time.Time `json:"coupon_start"`
	CouponEnd    *time.Time `json:"coupon_end"`
	CouponPeriod int32      `json:"coupin_period"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"update_at"`
}
