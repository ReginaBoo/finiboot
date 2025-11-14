package routes

import (
	"gateway/proxy"

	"github.com/gin-gonic/gin"
)

func RegisterPortfolioRoutes(r *gin.Engine) {
	target := "http://portfolio-service:8003"

	r.Any("/api/portfolio/*path", func(ctx *gin.Context) {
		proxy.Forward(ctx, target)
	})
}
