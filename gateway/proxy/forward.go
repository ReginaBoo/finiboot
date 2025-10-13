package proxy

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Forward(ctx *gin.Context, targetBase string) {
	target := targetBase + ctx.Param("path")

	req, _ := http.NewRequest(ctx.Request.Method, target, ctx.Request.Body)
	req.Header = ctx.Request.Header

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to reach service"})

	}
	defer resp.Body.Close()
	ctx.Status(resp.StatusCode)
	ctx.Header("Content-Type", resp.Header.Get("Content-Type"))
	ctx.Stream(func(w io.Writer) bool {
		_, _ = io.Copy(w, resp.Body)
		return false
	})
}
