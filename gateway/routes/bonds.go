package routes

import (
	"gateway/proxy"

	"github.com/gin-gonic/gin"
)

func RegisterBondsRoutes(r *gin.Engine) {
	target := "http://bonds-service:8002"

	r.Any("/bonds/*path", func(ctx *gin.Context) {
		proxy.Forward(ctx, target)
	})
}
