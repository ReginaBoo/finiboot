package models

import "time"

type PortfolioItem struct {
	ID           uint   `gorm:"primaryKey"`
	UserID       uint   `gorm:"user_id"`
	BondISIN     string `gorm:"bond_isin"`
	PurchaseDate time.Time
	SaleDate     time.Time
	Quantity     int
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
