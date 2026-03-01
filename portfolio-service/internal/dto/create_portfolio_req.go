package dto

type RequestCreatePortfolio struct {
	Name string `json:"name" binding:"required"`
}
