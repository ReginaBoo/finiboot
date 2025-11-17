package models

import "time"

type PortfolioItem struct {
	ID           uint   `gorm:"primaryKey"`
	PortfolioID  uint   `gorm:"index; not null"`
	BondISIN     string `gorm:"bond_isin"`
	PurchaseDate time.Time
	SaleDate     time.Time
	TotalQty     int
	AveragePrice float64
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
