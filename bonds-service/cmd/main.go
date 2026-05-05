package main

import (
	"bonds-service/internal/api"
	"bonds-service/internal/cache"
	"bonds-service/internal/models"
	"bonds-service/internal/service"
	"context"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	_ "bonds-service/docs"

	"github.com/reginaboo/shared/config"
	"github.com/reginaboo/shared/db"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           FiniBoot Bonds Service API

// @host      localhost:8002
// @BasePath  /
// @query.collection.format multi
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

	priceCache := cache.NewPriceCache(cfg.RedisHost, cfg.RedisPort)

	bondService := service.NewBondService(database, priceCache)
	bondHandler := api.NewBondHandler(bondService)

	client, err := service.NewTBankClient()
	if err != nil {
		log.Fatalf("Cant create tbank client: %v", err)
	}

	syncService := service.NewSyncService(database, client, priceCache)
	ctx := context.Background()

	worker := service.NewSyncWorker(syncService)

	worker.Start(ctx)
	router := gin.Default()

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	bondHandler.SetupRoutes(router)
	router.Run(":" + cfg.AppPort)
}
