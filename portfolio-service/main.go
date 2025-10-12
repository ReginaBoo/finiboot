package main

import "github.com/gin-gonic/gin"

func main() {
	router := gin.Default()

	router.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "Portfolio service is running"})
	})
	router.Run(":" + "8003")
}
