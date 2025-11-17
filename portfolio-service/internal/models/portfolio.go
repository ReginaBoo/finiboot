package models

import "time"

type Portfolio struct {
	ID        uint   `gorm:"primary key; not null"`
	UserID    uint   `gorm:"index; not null"`
	Name      string `gorm:"not null"`
	CreatedAt time.Time
	UpdatedAt time.Time

	Items        []PortfolioItem
	Transactions []PortfolioTransaction
}

func (Portfolio) TableName() string {
	return "portfolio"
}
