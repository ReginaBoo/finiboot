package db

import (
	"context"
	"log"
	"portfolio-service/internal/config"
	"portfolio-service/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect(cfg *config.Config, dsn string) *pgxpool.Pool {
	pool, err := pgxpool.New(context.Background(), dsn)

	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Connected to PostgreSQL")

	return pool
}

func InitDB(dsn string) {
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed connect to database: %v", err)
	}

	err = DB.AutoMigrate(&models.Portfolio{}, &models.PortfolioItem{}, &models.PortfolioTransaction{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	log.Println("Migrated models")
}
