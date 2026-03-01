package main

import (
	"auth-service/internal/api"
	"auth-service/internal/models"
	"auth-service/internal/service"
	"log"
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
	database, err := db.InitDB(cfg.CreateDsn())
	if err != nil {
		log.Fatalf("Cannot start server. %v", err)
	}

	if err := db.Migrate(database, &models.User{}); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	authService := service.NewAuthService(database)
	authHandler := api.NewAuthHandler(authService)

	router := gin.Default()
	authHandler.SetupRoutes(router)

	router.Run(":" + cfg.AppPort)
}
