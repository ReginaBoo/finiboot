package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"portfolio-service/dto"
	"portfolio-service/internal/db"
	"portfolio-service/internal/models"

	"github.com/gin-gonic/gin"
)

func GetBondsPortfolio(c *gin.Context) {
	id := c.Query("id")

	var items []models.PortfolioItem
	if err := db.DB.Where("portfolio_id = ?", id).Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load portfolio"})
		return
	}

	if len(items) == 0 {
		c.JSON(http.StatusOK, []any{})
	}

	isins := make([]string, len(items))
	for i, v := range items {
		isins[i] = v.BondISIN
	}

	body, _ := json.Marshal(gin.H{"isins": isins})
	resp, err := http.Post("http://bonds-service:8002/bonds/batch", "application/json", bytes.NewBuffer(body))
	if err != nil || resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot fetch bonds"})
		return
	}
	defer resp.Body.Close()

	var bonds []dto.BondResponse
	if err := json.NewDecoder(resp.Body).Decode(&bonds); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode bonds"})
		return
	}
	m := make(map[string]dto.BondResponse)
	for _, b := range bonds {
		m[b.ISIN] = b
	}

	result := make([]dto.PortfolioBond, 0)

	for _, item := range items {
		bond := m[item.BondISIN]

		result = append(result, dto.PortfolioBond{
			ISIN:         item.BondISIN,
			Quantity:     item.Quantity,
			PurchaseDate: item.PurchaseDate.Format("2006-01-02"),
			SellDate:     item.SellDate.Format("2006-01-02"),
			Name:         bond.Name,
			Nominal:      bond.Nominal,
			Currency:     bond.Currency,
		})
	}

	c.JSON(http.StatusOK, result)
}
