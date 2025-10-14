package handlers

import (
	"auth-service/internal/db"
	"auth-service/internal/models"
	"auth-service/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type LoginInput struct {
	Email    *string `json:"email" binding:"required,email"`
	Password string  `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var input LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Fields are filled in incorrectly",
			"error":   err.Error()})

		return
	}

	var user models.User

	if err := db.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "User is not logged in",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Invalid password",
		})
		return
	}

	accessToken, err := utils.CreateAccessToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate Access token",
		})
		return
	}

	refreshToken, err := utils.CreateRefreshToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate Refresh token",
		})
		return
	}
	user.RefreshToken = refreshToken

	db.DB.Save(&user)
	c.JSON(http.StatusOK, gin.H{
		"user":          user.Name,
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})

}
