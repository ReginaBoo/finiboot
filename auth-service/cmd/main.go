package main

import (
	"auth-service/internal/handlers"
	"auth-service/internal/models"
	"os"

	"github.com/reginaboo/shared/db"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/reginaboo/shared/config"
)

func main() {
	if os.Getenv("DB_HOST") == "" {
		_ = godotenv.Load(".env")
	}
	cfg := config.NewConfig()
	cfg.LoadConfig()

	db.InitDB(cfg.CreateDsn())
	db.Migrate(&models.User{})

	router := gin.Default()
	router.POST("/register", handlers.Register)
	router.POST("/login", handlers.Login)
	router.POST("/refresh", handlers.RefreshToken)

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "Auth service is running"})
	})
	router.Run(":" + cfg.AppPort)
}
