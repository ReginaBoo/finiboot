package handlers

import (
	"auth-service/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type RefreshInput struct {
	RefreshToken string `json:"refresh_token"`
}

func RefreshToken(c *gin.Context) {
	var input RefreshInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	token, err := jwt.Parse(input.RefreshToken, func(t *jwt.Token) (any, error) {
		return []byte(utils.LoadJWT()), nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh token"})
		return
	}

	claims := token.Claims.(jwt.MapClaims)
	userID := uint(claims["userID"].(float64))
	newAccessToken, _ := utils.CreateAccessToken(userID)

	c.JSON(http.StatusOK, gin.H{"access_token": newAccessToken})
}
