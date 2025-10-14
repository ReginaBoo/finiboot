package main

import (
	"auth-service/internal/config"
	"auth-service/internal/db"
	"auth-service/internal/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()
	dsn := config.CreateDsn(cfg)

	pool := db.Connect(cfg, dsn)
	defer pool.Close()

	db.InitDB(dsn)

	router := gin.Default()

	router.POST("/register", handlers.Register)
	router.POST("/login", handlers.Login)

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "Auth service is running"})
	})
	router.Run(":" + cfg.AppPort)
}
