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
	router.POST("/batch", h.GetBondsBatch)

	router.GET("/", h.GetBonds)
	router.GET("/:isin", h.GetBondByISIN)
	router.GET("/ping", h.Ping)
	router.GET("/search", h.SearchBonds)
}

// Ping godoc
// @Summary      Проверка доступности сервиса
// @Description  Простой пинг для проверки работоспособности API
// @Tags         system
// @Produce      json
// @Success      200  {object}  map[string]string
// @Router       /ping [get]
func (h *BondHandler) Ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Bonds service is running"})
}

// GetBondByISIN godoc
// @Summary      Получить облигацию по ISIN
// @Description  Возвращает подробную информацию об облигации по её уникальному коду ISIN
// @Tags         bonds
// @Produce      json
// @Param        isin  path      string  true  "ISIN код (например, RU000A1038V6)"
// @Success      200   {object}  models.Bond
// @Failure      404   {object}  map[string]string "Облигация не найдена"
// @Failure      500   {object}  map[string]string "Ошибка сервера"
// @Router       /bonds/{isin} [get]
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

// GetBondsBatch godoc
// @Summary      Получить несколько облигаций сразу (Batch)
// @Description  Принимает массив ISIN и возвращает список найденных облигаций
// @Tags         bonds
// @Accept       json
// @Produce      json
// @Param        request  body      dto.RequestBondBatch  true  "Список ISIN кодов"
// @Success      200      {array}   models.Bond
// @Failure      400      {object}  map[string]string "Некорректный JSON"
// @Failure      500      {object}  map[string]string "Ошибка сервера"
// @Router       /bonds/batch [post]
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

// GetBonds godoc
// @Summary      Список всех облигаций
// @Description  Возвращает постраничный список всех доступных облигаций
// @Tags         bonds
// @Produce      json
// @Param        page  query     int  false  "Номер страницы (по умолчанию 0)"
// @Param        size  query     int  false  "Размер страницы (по умолчанию 10, макс 100)"
// @Success      200   {object}  dto.ResponseBonds
// @Failure      500   {object}  map[string]string "Ошибка сервера"
// @Router       /bonds [get]
func (h *BondHandler) GetBonds(c *gin.Context) {
	ctx := c.Request.Context()

	var filters dto.BondFilters
	if err := c.ShouldBindQuery(&filters); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid filters"})
		return
	}
	page, size := parsePagination(c)

	bonds, totalPages, totalElements, err := h.service.GetAllBonds(ctx, page, size, filters)
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

// SearchBonds godoc
// @Summary      Поиск облигаций
// @Description  Ищет облигации по названию или частичному совпадению
// @Tags         bonds
// @Produce      json
// @Param        q    query     string  true  "Поисковый запрос (минимум 1 символ)"
// @Success      200  {array}   models.Bond
// @Failure      400  {object}  map[string]string "Пустой запрос"
// @Failure      500  {object}  map[string]string "Ошибка сервера"
// @Router       /search [get]
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
