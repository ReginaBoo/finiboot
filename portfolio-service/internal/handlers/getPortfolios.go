package handlers

import (
	"net/http"
	"portfolio-service/dto"

	"github.com/gin-gonic/gin"
	"github.com/reginaboo/shared/db"
)

func GetPortfolios(c *gin.Context) {
	userId, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorised"})
		return
	}

	uid := userId.(uint)

	var portfolio []dto.Portfolios
	if err := db.DB.Table("portfolio").Where("user_id", uid).Find(&portfolio).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cant load portfolios"})
		return
	}

	c.JSON(http.StatusOK, portfolio)
}
