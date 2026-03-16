package main

import (
	"bonds-service/internal/api"
	"bonds-service/internal/models"
	"bonds-service/internal/service"
	"context"
	"log"
	"os"
	"time"

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
	database, err := db.InitDB(cfg.CreateDsn())
	if err != nil {
		log.Fatalf("Cannot start server. %v", err)
	}

	if err := db.Migrate(database, &models.Bond{}, &models.Coupon{}); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	bondService := service.NewBondService(database)
	bondHandler := api.NewBondHandler(bondService)

	client, err := service.NewTBankClient()
	if err != nil {
		log.Fatalf("Cant create tbank client: %v", err)
	}

	syncService := service.NewSyncService(database, client)
	ctx := context.Background()

	worker := service.NewSyncWorker(syncService, 1*time.Hour)

	worker.Start(ctx)
	router := gin.Default()
	bondHandler.SetupRoutes(router)
	router.Run(":" + cfg.AppPort)
}
