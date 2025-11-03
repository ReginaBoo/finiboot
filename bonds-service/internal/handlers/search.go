package handlers

import (
	"bonds-service/internal/db"
	"bonds-service/internal/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func SearchBonds(c *gin.Context) {
	query := strings.TrimSpace(c.Query("q"))

	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "query parameter 'q' is required"})
		return
	}

	var bonds []models.Bond
	search := "%" + query + "%"

	if err := db.DB.Where("LOWER(name) LIKE LOWER(?) OR LOWER(ticker) LIKE LOWER(?) OR LOWER(isin) LIKE LOWER(?)", search, search, search).
		Preload("Coupons").
		Limit(10).
		Find(&bonds).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to search bonds"})
		return
	}

	c.JSON(http.StatusOK, bonds)
}
