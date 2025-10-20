package routes

import (
	"gateway/proxy"
	"os"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(r *gin.Engine) {
	target := "http://localhost:8001"

	if os.Getenv("IS_DOCKER") == "true" {
		target = "http://auth-service:8001"
	}

	r.Any("/auth/*path", func(ctx *gin.Context) {
		proxy.Forward(ctx, target)
	})
}
