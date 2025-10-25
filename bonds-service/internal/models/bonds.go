package models

import "time"

type Bond struct {
	ID              uint       `json:"id" gorm:"primaryKey"`
	ISIN            string     `json:"isin" gorm:"uniqueIndex;not null"` // Международный идентификатор ценной бумаги
	Name            string     `json:"name" gorm:"not null"`             // Название облигации
	Ticker          string     `json:"ticker"`                           // Короткое имя (тикер)
	FaceValue       float64    `json:"face_value"`                       // Номинальная стоимость (обычно 1000)
	Currency        string     `json:"currency" gorm:"default:RUB"`      // Валюта облигации
	CouponRate      float64    `json:"coupon_rate"`                      // Годовая ставка купона (%)
	CouponValue     float64    `json:"coupon_value"`                     // Размер купона в рублях
	CouponFrequency int        `json:"coupon_frequency"`                 // Кол-во выплат в год (например, 2, 4, 12)
	NextCouponDate  time.Time  `json:"next_coupon_date"`                 // Дата следующей выплаты
	MaturityDate    *time.Time `json:"maturity_date"`                    // Дата погашения
	IssueDate       *time.Time `json:"issue_date"`                       // Дата выпуска
	Issuer          string     `json:"issuer"`                           // Эмитент
	Type            string     `json:"type"`                             // Тип (корпоративная, гос., муниципальная)
	YieldToMaturity float64    `json:"ytm"`                              // Доходность к погашению (%)
	MarketPrice     float64    `json:"market_price"`                     // Текущая рыночная цена (% от номинала)
	Available       bool       `json:"available" gorm:"default:true"`    // Доступна ли для покупки
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}
