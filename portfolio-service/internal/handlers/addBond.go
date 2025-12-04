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

	sellDate, err := time.Parse("2006-01-02", req.SellDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "sell_date must be YYYY-MM-DD"})
		return
	}

	transaction := models.PortfolioTransaction{
		PortfolioID:  req.PortfolioID,
		BondISIN:     req.Isin,
		Quantity:     req.Quantity,
		Price:        bond.Nominal,
		PurchaseDate: purchaseDate,
		SellDate:     sellDate,
	}

	if err := db.DB.Create(&transaction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create transaction"})
		return
	}

	var item models.PortfolioItem
	tx := db.DB.Begin()

	err = tx.Where("portfolio_id = ? AND bond_isin = ?", req.PortfolioID, req.Isin).First(&item).Error

	if err != nil {

		item = models.PortfolioItem{
			PortfolioID:   req.PortfolioID,
			BondISIN:      req.Isin,
			TotalQuantity: req.Quantity,
			PurchaseDate:  purchaseDate,
			SellDate:      sellDate,
			AveragePrice:  bond.Nominal,
		}

		if err := tx.Create(&item).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create portfolio item"})
			return
		}
	} else {
		newQuantity := item.TotalQuantity + req.Quantity

		newAveragePrice := (item.AveragePrice*float64(item.TotalQuantity) +
			bond.Nominal*float64(req.Quantity)) / float64(newQuantity)

		if purchaseDate.Before(item.PurchaseDate) {
			item.PurchaseDate = purchaseDate
		}

		if sellDate.After(item.SellDate) {
			item.SellDate = sellDate
		}

		updates := map[string]interface{}{
			"total_quantity": newQuantity,
			"average_price":  newAveragePrice,
			"purchase_date":  item.PurchaseDate,
			"sell_date":      item.SellDate,
		}

		if err := tx.Model(&item).Updates(updates).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update portfolio item"})
			return
		}
	}

	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"message": "Bond added to portfolio",
		"bond":    bond.Name,
	})
}
