package main

import (
	"os"
	"portfolio-service/internal/handlers"
	"portfolio-service/internal/models"

	"github.com/reginaboo/shared/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/reginaboo/shared/config"
	"github.com/reginaboo/shared/db"
)

func main() {
	if os.Getenv("DB_HOST") == "" {
		_ = godotenv.Load(".env")
	}

	cfg := config.NewConfig()
	cfg.LoadConfig()

	db.InitDB(cfg.CreateDsn())
	db.Migrate(&models.Portfolio{}, &models.PortfolioItem{}, &models.PortfolioTransaction{})

	router := gin.Default()
	auth := router.Group("/")
	auth.Use(middleware.Authorization())

	auth.POST("/bond/add", handlers.AddBondToPortfolio)
	auth.GET("/bonds", handlers.GetBondsPortfolio)
	auth.GET("/portfolios", handlers.GetPortfolios)
	auth.POST("/create", handlers.CreatePortfolio)
	auth.DELETE("/delete/:id", handlers.Deleteportfolio)
	auth.GET("/transactions", handlers.GetPortfolioTransactions)

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "Portfolio service is running"})
	})
	router.Run(":" + cfg.AppPort)
}
