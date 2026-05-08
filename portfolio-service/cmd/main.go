package main

import (
	"log"
	"os"
	"portfolio-service/internal/api"
	"portfolio-service/internal/models"
	"portfolio-service/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/reginaboo/shared/config"
	"github.com/reginaboo/shared/db"
)

// @title           FiniBoot Portfolio Service API

// @host      localhost:8003
// @BasePath  /
// @query.collection.format multi
func main() {
	if os.Getenv("DB_HOST") == "" {
		_ = godotenv.Load(".env")
	}

	cfg := config.NewConfig()
	database, err := db.InitDB(cfg.CreateDsn())
	if err != nil {
		log.Fatalf("Cannot start server: %v", err)
	}
	if err := db.Migrate(database, &models.Portfolio{}, &models.PortfolioItem{}, &models.PortfolioTransaction{}); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	portfolioService := service.NewPortfolioService(database)
	portfolioHandler := api.NewPortfolioHandler(portfolioService)

	router := gin.Default()
	portfolioHandler.SetupRoutes(router)

	router.Run(":" + cfg.AppPort)
}
