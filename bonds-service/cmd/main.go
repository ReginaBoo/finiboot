package main

import (
	"bonds-service/internal/handlers"
	"bonds-service/internal/models"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/reginaboo/shared/config"
	"github.com/reginaboo/shared/db"
	"github.com/reginaboo/shared/middleware"
)

func main() {
	if os.Getenv("DB_HOST") == "" {
		_ = godotenv.Load(".env")
	}

	cfg := config.NewConfig()
	cfg.LoadConfig()

	db.InitDB(cfg.CreateDsn())
	db.Migrate(&models.Bond{}, &models.Coupon{})

	router := gin.Default()
	router.GET("/bonds/:isin", handlers.GetBondbyISIN)
	router.POST("/bonds/batch", handlers.GetBondsBatch)

	auth := router.Group("/")
	auth.Use(middleware.Authorization())

	auth.GET("/bonds", handlers.GetAllBonds)
	auth.GET("/search", handlers.SearchBonds)

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "Bonds service is running"})
	})

	router.Run(":" + cfg.AppPort)
}
