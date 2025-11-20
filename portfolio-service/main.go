package main

import (
	"portfolio-service/internal/config"
	"portfolio-service/internal/db"
	"portfolio-service/internal/handlers"
	"portfolio-service/internal/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()
	dsn := config.CreateDsn(cfg)

	pool := db.Connect(cfg, dsn)
	defer pool.Close()

	db.InitDB(dsn)
	router := gin.Default()

	auth := router.Group("/")
	auth.Use(middleware.Authorization())

	auth.POST("/bond/add", handlers.AddBondToPortfolio)
	auth.GET("/bonds", handlers.GetBondsPortfolio)
	auth.GET("/portfolios", handlers.GetPortfolios)
	auth.POST("/create", handlers.CreatePortfolio)
	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "Portfolio service is running"})
	})
	router.Run(":" + "8003")
}
