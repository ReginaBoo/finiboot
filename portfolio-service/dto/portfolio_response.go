package dto

type PortfolioBond struct {
	ISIN         string `json:"isin"`
	Quantity     int    `json:"quantity"`
	PurchaseDate string `json:"purchase_date"`
	SaleDate     string `json:"sale_date,omitempty"`

	Name     string  `json:"name"`
	Nominal  float64 `json:"nominal"`
	Currency string  `json:"currency"`
}

type Portfolios struct {
	Id   uint   `json:"id"`
	Name string `json:"name"`
}
