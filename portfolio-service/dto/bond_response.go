package dto

type BondResponse struct {
	ISIN     string      `json:"isin"`
	FIGI     string      `json:"figi"`
	Name     string      `json:"name"`
	Nominal  float64     `json:"nominal"`
	Currency string      `json:"currency"`
	Coupons  interface{} `json:"coupons"`
}
