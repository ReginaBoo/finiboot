package dto

type ResponsePortfolioBond struct {
	ISIN         string `json:"isin"`
	Quantity     int    `json:"quantity"`
	PurchaseDate string `json:"purchase_date"`
	SellDate     string `json:"sell_date,omitempty"`

	Name     string  `json:"name"`
	Nominal  float64 `json:"nominal"`
	Currency string  `json:"currency"`
}

type ResponsePortfolios struct {
	Id   uint   `json:"id"`
	Name string `json:"name"`
}
