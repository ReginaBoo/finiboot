package handlers

import (
	"net/http"
	"portfolio-service/internal/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/reginaboo/shared/db"
	"gorm.io/gorm"
)

func Deleteportfolio(c *gin.Context) {
	portfolioIdStr := c.Param("id")

	portfolioId, err := strconv.ParseUint(portfolioIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID portfilio"})
	}
	userID, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}

	userID = userID.(uint)
	err = db.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("portfolio_id = ?", portfolioId).Delete(&models.PortfolioItem{}).Error; err != nil {
			return err
		}

		if err := tx.Where("portfolio_id = ?", portfolioId).Delete(&models.PortfolioTransaction{}).Error; err != nil {
			return err
		}

		result := tx.Where("id = ? AND user_id = ?", portfolioId, userID).Delete(&models.Portfolio{})

		if result.Error != nil {
			return err
		}

		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}
		return nil
	})

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Портфель не найден или доступ запрещен"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при удалении портфеля"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Портфель успешно удален",
	})
}
