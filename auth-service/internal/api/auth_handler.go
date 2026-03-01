package api

import (
	"auth-service/internal/dto"
	"auth-service/internal/service"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service *service.AuthService
}

func NewAuthHandler(s *service.AuthService) *AuthHandler {
	return &AuthHandler{service: s}
}

func (h *AuthHandler) SetupRoutes(router *gin.Engine) {
	router.POST("/register", h.Register)
	router.POST("/login", h.Login)
	router.POST("/refresh", h.RefreshToken)

	router.GET("/ping", h.Ping)
}

func (h *AuthHandler) Ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Auth service is running"})
}

func (h *AuthHandler) Register(c *gin.Context) {
	ctx := c.Request.Context()
	var request dto.RequestRegister

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	err := h.service.Register(ctx, request.Name, request.Email, request.Password)

	if err != nil {
		if strings.Contains(err.Error(), "user already exists") {
			c.JSON(http.StatusConflict, gin.H{"error": "User already registered"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
	})

}
func (h *AuthHandler) Login(c *gin.Context) {
	ctx := c.Request.Context()
	var request dto.RequestLogin
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		log.Printf("invalid request body: %v", err)
		return
	}

	name, accessToken, refreshToken, err := h.service.Login(ctx, request.Email, request.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		log.Printf("login failed: %v", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user":          name,
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})

}
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var request dto.RequestRefresh
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		log.Printf("invalid request body: %v", err)
		return
	}

	accessToken, err := h.service.RefreshToken(request.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		log.Printf("refresh token invalid: %v", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"access_token": accessToken})
}
