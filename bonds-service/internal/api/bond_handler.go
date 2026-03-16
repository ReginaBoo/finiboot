package api

import (
	"bonds-service/internal/dto"
	"bonds-service/internal/service"
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type BondHandler struct {
	service *service.BondService
}

func NewBondHandler(service *service.BondService) *BondHandler {
	return &BondHandler{service: service}
}

func (h *BondHandler) SetupRoutes(router *gin.Engine) {
	router.POST("/bonds/batch", h.GetBondsBatch)

	router.GET("/bonds", h.GetBonds)
	router.GET("/bonds/:isin", h.GetBondByISIN)
	router.GET("/ping", h.Ping)
	router.GET("/search", h.SearchBonds)
}

func (h *BondHandler) Ping(c *gin.Context) {

	c.JSON(http.StatusOK, gin.H{"message": "Bonds service is running"})
}

func (h *BondHandler) GetBondByISIN(c *gin.Context) {
	ctx := c.Request.Context()
	isin := c.Param("isin")
	bond, err := h.service.GetBondByISIN(ctx, isin)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Bond not found"})
			return
		}

		log.Printf("Failed to get bond %s: %v", isin, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bond"})
		return
	}

	c.JSON(http.StatusOK, bond)
}

func (h *BondHandler) GetBondsBatch(c *gin.Context) {
	ctx := c.Request.Context()
	var req dto.RequestBondBatch
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	bonds, err := h.service.GetBondsBatch(ctx, req)
	if err != nil {
		log.Printf("Failed to get bonds %v: %v", req.ISINs, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bonds"})
		return
	}

	c.JSON(http.StatusOK, bonds)
}

func (h *BondHandler) GetBonds(c *gin.Context) {
	ctx := c.Request.Context()
	page, size := parsePagination(c)

	bonds, totalPages, totalElements, err := h.service.GetAllBonds(ctx, page, size)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bonds"})
		return
	}

	response := dto.ResponseBonds{
		Content:       bonds,
		TotalPages:    totalPages,
		TotalElements: totalElements,
		Size:          size,
		Number:        page,
	}

	c.JSON(http.StatusOK, response)
}

func (h *BondHandler) SearchBonds(c *gin.Context) {
	ctx := c.Request.Context()
	query := strings.TrimSpace(c.Query("q"))

	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Query parameter 'q' is required"})
		return
	}

	bonds, err := h.service.SearchBonds(ctx, query)
	if err != nil {
		log.Printf("Failed to get bonds: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bonds"})
		return
	}

	c.JSON(http.StatusOK, bonds)
}

func parsePagination(c *gin.Context) (int, int) {
	pageStr := c.DefaultQuery("page", "0")
	sizeStr := c.DefaultQuery("size", "10")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 0 {
		page = 0
	}

	size, err := strconv.Atoi(sizeStr)
	if err != nil || size < 0 {
		size = 10
	}

	if size > 100 {
		size = 100
	}

	return page, size
}
