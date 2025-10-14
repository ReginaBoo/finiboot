package utils

import (
	"auth-service/internal/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func CreateAccessToken(userId uint) (string, error) {
	claims := jwt.MapClaims{
		"sub": userId,
		"exp": time.Now().Add(config.AccessTokenTTL).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.LoadJWT()))
}

func CreateRefreshToken(userId uint) (string, error) {
	claims := jwt.MapClaims{
		"sub": userId,
		"exp": time.Now().Add(config.RefreshTokenTTL).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.LoadJWT()))
}
