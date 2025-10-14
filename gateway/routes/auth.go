package routes

import (
	"gateway/proxy"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(r *gin.Engine) {
	r.Any("/auth/*path", func(ctx *gin.Context) {
		proxy.Forward(ctx, "http://auth-service:8001")
	})
}
