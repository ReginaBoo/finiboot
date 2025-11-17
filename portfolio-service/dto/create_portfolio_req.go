package dto

type CreatePortfolioRequest struct {
	Name string `json:"name" binding:"required"`
}
