package handlers

import (
	"bonds-service/internal/db"
	"bonds-service/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetBondsBatch(c *gin.Context) {
	var req struct {
		ISINs []string `json:"isins"`
	}

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	var bonds []models.Bond
	db.DB.Where("isin IN (?)", req.ISINs).Find(&bonds)

	c.JSON(http.StatusOK, bonds)
}
