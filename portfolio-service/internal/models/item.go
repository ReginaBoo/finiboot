package models

import "time"

type PortfolioItem struct {
	ID           uint      `gorm:"primaryKey"`
	PortfolioID  uint      `gorm:"index; not null"`
	BondISIN     string    `gorm:"bond_isin"`
	PurchaseDate time.Time `json:"purchase_date" gorm:"type:date"`
	SellDate     time.Time `json:"sell_date" gorm:"type:date"`
	Quantity     int
	AveragePrice float64
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
