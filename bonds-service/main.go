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

	// // Инициализируем сервис синхронизации
	// syncService := services.NewSyncService(db.DB)

	// // Синхронизация при старте, если нужно
	// if syncService.ShouldSyncOnStart() {
	// 	log.Println("Starting initial bonds synchronization...")
	// 	if err := syncService.SyncBondsFromTbank(); err != nil {
	// 		log.Printf("Initial sync failed: %v", err)
	// 	} else {
	// 		log.Println("Initial bonds synchronization completed")
	// 	}
	// }

	router := gin.Default()

	auth := router.Group("/")
	auth.Use(middleware.Authorization())

	auth.GET("/bonds", handlers.GetAllBonds)
	router.GET("/bonds/:isin", handlers.GetBondbyISIN)

	auth.GET("/search", handlers.SearchBonds)

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "Bonds service is running"})
	})

	router.Run(":" + cfg.AppPort)
}
