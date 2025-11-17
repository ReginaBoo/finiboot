package dto

type AddBondReq struct {
	PortfolioID  uint   `json:"portfolio_id"`
	Isin         string `json:"isin"`
	Quantity     int    `json:"quantity"`
	PurchaseDate string `json:"purchase_date"`
	SellDate     string `json:"sell_date"`
}
