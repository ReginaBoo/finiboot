package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost       string
	DBPort       string
	DBUser       string
	DBPassword   string
	DBName       string
	AppPort      string
	TinkoffToken string
	SyncOnStart  bool
}

func LoadConfig() *Config {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println(".env file not find")
	}

	return &Config{
		DBHost:       os.Getenv("DB_HOST"),
		DBUser:       os.Getenv("DB_USER"),
		DBPassword:   os.Getenv("DB_PASSWORD"),
		DBPort:       os.Getenv("DB_PORT"),
		DBName:       os.Getenv("DB_NAME"),
		AppPort:      os.Getenv("APP_PORT"),
		TinkoffToken: os.Getenv("TINKOFF_API_TOKEN"),
		SyncOnStart:  os.Getenv("SYNC_ON_START") == "true",
	}
}

func CreateDsn(cfg *Config) string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName)
}
