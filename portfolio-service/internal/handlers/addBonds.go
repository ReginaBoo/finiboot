package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"portfolio-service/dto"
	"portfolio-service/internal/db"
	"portfolio-service/internal/models"
	"time"

	"github.com/gin-gonic/gin"
)

func AddBondToPortfolio(c *gin.Context) {
	var req dto.AddBondReq

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
	}

	portfolioID := req.PortfolioID
	var portfolio models.Portfolio
	if err := db.DB.Where("id = ?", portfolioID).First(&portfolio).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cant find portfolio"})
		return
	}

	bondsURL := fmt.Sprintf("http://bonds-service:8002/bonds/%s", req.Isin)

	resp, err := http.Get(bondsURL)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bond not found"})
		return
	}

	var bond dto.BondResponse
	if err := json.NewDecoder(resp.Body).Decode(&bond); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode bonds-service response"})
		return
	}

	purchaseDate, err := time.Parse("2006-01-02", req.PurchaseDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "purchase_date must be YYYY-MM-DD"})
		return
	}

	saleDate, err := time.Parse("2006-01-02", req.SellDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "sell_date must be YYYY-MM-DD"})
		return
	}

	transaction := models.PortfolioTransaction{
		PortfolioID: req.PortfolioID,
		BondISIN:    req.Isin,
		Type:        "BUY",
		Quantity:    req.Quantity,
		Price:       bond.Nominal, // Пока цена = номинал (потом добавишь реальную)
		Date:        purchaseDate,
	}

	if err := db.DB.Create(&transaction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create transaction"})
		return
	}

	var item models.PortfolioItem

	item = models.PortfolioItem{
		PortfolioID:  req.PortfolioID,
		BondISIN:     req.Isin,
		TotalQty:     req.Quantity,
		AveragePrice: bond.Nominal,
		SaleDate:     saleDate,
	}
	// Решение: всегда проверяйте ошибки
	if err := db.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Bond added to portfolio",
		"bond":    bond.Name,
	})
}
