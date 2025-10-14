package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

func LoadJWT() string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println(".env file not find")
	}
	JwtSecret := os.Getenv("JWT_SECRET")
	return JwtSecret
}

const (
	AccessTokenTTL  = 15 * time.Minute
	RefreshTokenTTL = 7 * 24 * time.Hour
)
