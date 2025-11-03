package handlers

import (
	"bonds-service/internal/db"
	"bonds-service/internal/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type BondsResponse struct {
	Content       []models.Bond `json:"content"`
	TotalPages    int           `json:"total_pages"`
	TotalElements int64         `json:"total_elements"`
	Size          int           `json:"size"`
	Number        int           `json:"number"`
}

func AllBonds(c *gin.Context) {
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

	var totalElements int64

	if err := db.DB.Model(&models.Bond{}).Count(&totalElements).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error when counting bonds"})
		return
	}

	totalPages := int((totalElements + int64(size) - 1) / int64(size))

	var bonds []models.Bond
	offset := page * size
	if err := db.DB.Preload("Coupons").Offset(offset).Limit(size).Find(&bonds).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error when receiving the bonds"})
		return
	}

	response := BondsResponse{
		Content:       bonds,
		TotalPages:    totalPages,
		TotalElements: totalElements,
		Size:          size,
		Number:        page,
	}

	c.JSON(http.StatusOK, response)
}
