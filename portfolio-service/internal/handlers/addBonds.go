package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"portfolio-service/internal/db"
	"portfolio-service/internal/models"
	"time"

	"github.com/gin-gonic/gin"
)

type AddBondReq struct {
	Isin         string `json:"isin"`
	Quantity     int    `json:"quantity"`
	PurchaseDate string `json:"purchase_date"`
	SellDate     string `json:"sell_date"`
}

type BondResponse struct {
	ID      uint        `json:"id"`
	ISIN    string      `json:"isin"`
	Name    string      `json:"name"`
	Nominal float64     `json:"nominal"`
	Coupons interface{} `json:"coupons"` // можно уточнить тип
}

func AddBondToPortfolio(c *gin.Context) {
	var req AddBondReq

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
	}

	userID, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}

	uid := userID.(uint)

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
	var bond BondResponse
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

	var existing models.PortfolioItem
	err = db.DB.Where("user_id = ? AND bond_isin = ?", uid, bond.ISIN).
		First(&existing).Error

	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Bond already exists in portfolio"})
		return
	}

	item := models.PortfolioItem{
		UserID:       uid,
		BondISIN:     bond.ISIN,
		Quantity:     req.Quantity,
		PurchaseDate: purchaseDate,
		SaleDate:     saleDate,
	}

	if err := db.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add bond to portfolio"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Bond added to portfolio",
		"bond":    bond.Name,
	})
}
