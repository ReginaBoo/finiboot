package routes

import (
	"gateway/proxy"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(r *gin.Engine) {
	target := "http://auth-service:8001"

	r.Any("/auth/*path", func(ctx *gin.Context) {
		proxy.Forward(ctx, target)
	})
}
