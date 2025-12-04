package handlers

import (
	"net/http"
	"portfolio-service/internal/db"
	"portfolio-service/internal/models"

	"github.com/gin-gonic/gin"
)

func GetPortfolioTransactions(c *gin.Context) {
	portfolioID := c.Query("id")

	var transactions []models.PortfolioTransaction
	query := db.DB.Where("portfolio_id = ?", portfolioID)

	if err := query.Find(&transactions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load transactions"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"transactions": transactions,
	})
}
