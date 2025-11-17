package models

import "time"

type PortfolioTransaction struct {
	ID          uint   `gorm:"primary key; not null"`
	PortfolioID uint   `gorm:"index; not null"`
	BondISIN    string `gorm:"index; not null"`
	Type        string
	Quantity    int
	Price       float64
	Date        time.Time
	CreatedAt   time.Time
}
