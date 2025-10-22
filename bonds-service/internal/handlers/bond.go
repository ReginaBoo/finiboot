package handlers

import (
	"bonds-service/internal/db"
	"bonds-service/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AllBonds(c *gin.Context) {
	var bonds []models.Bond

	if err := db.DB.Find(&bonds).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error when receiving the bonds"})
		return
	}

	c.JSON(http.StatusOK, bonds)
}
