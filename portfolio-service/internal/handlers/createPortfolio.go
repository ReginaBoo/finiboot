package handlers

import (
	"net/http"
	"portfolio-service/dto"
	"portfolio-service/internal/db"
	"portfolio-service/internal/models"

	"github.com/gin-gonic/gin"
)

func CreatePortfolio(c *gin.Context) {
	var req dto.CreatePortfolioRequest

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid json"})
		return
	}

	userID, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}

	uid := userID.(uint)

	portfolio := models.Portfolio{
		Name:   req.Name,
		UserID: uid,
	}

	if err := db.DB.Create(&portfolio).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cant create portfolio"})
		return

	}

	c.JSON(http.StatusOK, gin.H{"message": "Portfolio created succesfully"})
}
