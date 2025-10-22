package main

import (
	"bonds-service/internal/config"
	"bonds-service/internal/db"
	"bonds-service/internal/handlers"
	"bonds-service/internal/middleware"

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

	auth.GET("/bonds", handlers.AllBonds)

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "Bonds service is running"})
	})

	router.Run(":" + cfg.AppPort)
}
