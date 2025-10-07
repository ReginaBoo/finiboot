package main

import (
	"auth-service/internal/config"
	"auth-service/internal/db"

	"github.com/gin-gonic/gin"
)

func main() {

	cfg := config.LoadConfig()
	pool := db.Connect(cfg)
	defer pool.Close()

	router := gin.Default()

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "Auth service is running"})
	})
	router.Run(":" + cfg.AppPort)
}
