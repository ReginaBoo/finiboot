package main

import (
	"gateway/routes"

	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.Default()

	routes.RegisterAurhRoutes(router)

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "Gateway service is running"})
	})
	router.Run(":8080")
}
