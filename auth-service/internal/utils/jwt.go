package utils

import (
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

func CreateAccessToken(userId uint) (string, error) {
	claims := jwt.MapClaims{
		"userID": userId,
		"exp":    time.Now().Add(AccessTokenTTL).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(LoadJWT()))
}

func CreateRefreshToken(userId uint) (string, error) {
	claims := jwt.MapClaims{
		"userID": userId,
		"exp":    time.Now().Add(RefreshTokenTTL).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(LoadJWT()))
}

func LoadJWT() string {
	if os.Getenv("JWT_SECRET") == "" {
		err := godotenv.Load(".env")
		if err != nil {
			log.Println(".env file not find")
		}
	}

	return os.Getenv("JWT_SECRET")
}

const (
	AccessTokenTTL  = 15 * time.Minute
	RefreshTokenTTL = 7 * 24 * time.Hour
)
