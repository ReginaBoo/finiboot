package proxy

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Forward(ctx *gin.Context, targetBase string) {
	target := targetBase + ctx.Param("path")

	if ctx.Request.URL.RawQuery != "" {
		target += "?" + ctx.Request.URL.RawQuery
	}

	req, _ := http.NewRequest(ctx.Request.Method, target, ctx.Request.Body)
	req.Header = ctx.Request.Header

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to reach service"})

	}
	defer resp.Body.Close()

	for key, values := range resp.Header {
		for _, value := range values {
			ctx.Header(key, value)
		}
	}

	ctx.Status(resp.StatusCode)
	_, err = io.Copy(ctx.Writer, resp.Body)
	if err != nil {
		return
	}
}
