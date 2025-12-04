package models

import "time"

type PortfolioTransaction struct {
	ID           uint      `json:"id" gorm:"primary key; not null"`
	PortfolioID  uint      `json:"portfolio_id" gorm:"index; not null"`
	BondISIN     string    `json:"bond_isin" gorm:"index; not null"`
	BondName     string    `json:"bond_name" gorm:"bond_name"`
	Quantity     int       `json:"quantity"`
	Price        float64   `json:"price"`
	PurchaseDate time.Time `json:"purchase_date" gorm:"type:date"`
	SellDate     time.Time `json:"sell_date" gorm:"type:date"`
	CreatedAt    time.Time `json:"created_at" gorm:"type:date"`
}
