package api

import (
	"errors"
	"log"
	"net/http"
	"portfolio-service/internal/dto"
	"portfolio-service/internal/service"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/reginaboo/shared/middleware"
	"gorm.io/gorm"
)

type PortfolioHandler struct {
	service *service.PortfolioService
}

func NewPortfolioHandler(service *service.PortfolioService) *PortfolioHandler {
	return &PortfolioHandler{service: service}
}

func (h *PortfolioHandler) SetupRoutes(router *gin.Engine) {
	auth := router.Group("/")
	auth.Use(middleware.Authorization())

	auth.POST("/bond/add", h.AddBondToPortfolio)
	auth.GET("/bonds", h.GetBondsPortfolio)
	auth.GET("/portfolios", h.GetPortfolios)
	auth.POST("/create", h.CreatePortfolio)
	auth.DELETE("/delete/:id", h.DeletePortfolio)
	auth.GET("/transactions", h.GetPortfolioTransactions)

	router.GET("/ping", h.Ping)
}

func (h *PortfolioHandler) Ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Portfolio service is running"})
}

func (h *PortfolioHandler) AddBondToPortfolio(c *gin.Context) {
	var req dto.RequestAddBond

	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		log.Printf("bad request: %v", err)
		return
	}

	ctx := c.Request.Context()
	name, err := h.service.AddBondToPortfolio(ctx, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cant add to portfolio bond"})
		log.Printf("failed to add bond to portfolio: %v", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Bond added to portfolio",
		"bond":    name,
	})
}

func (h *PortfolioHandler) GetBondsPortfolio(c *gin.Context) {
	ctx := c.Request.Context()

	id, err := strconv.ParseUint(c.Query("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid portfolio ID"})
		return
	}

	portfolioBonds, err := h.service.GetBondsPortfolio(ctx, uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get bonds from portfolio"})
		log.Printf("failed to get portfolio bonds: %v", err)
		return
	}

	c.JSON(http.StatusOK, portfolioBonds)
}

func (h *PortfolioHandler) GetPortfolios(c *gin.Context) {
	ctx := c.Request.Context()
	userId, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorised"})
		return
	}

	portfolio, err := h.service.GetPortfolios(ctx, userId.(uint))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to load portfolios"})
		log.Printf("can't load portfolios: %v", err)
		return
	}
	c.JSON(http.StatusOK, portfolio)
}

func (h *PortfolioHandler) CreatePortfolio(c *gin.Context) {
	ctx := c.Request.Context()
	var request dto.RequestCreatePortfolio

	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid json"})
		return
	}
	userID, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}

	if err := h.service.CreatePortfolio(ctx, userID.(uint), request.Name); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cant create portfolio"})
		log.Printf("can't create portfolio: %v", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Portfolio created successfully"})
}

func (h *PortfolioHandler) DeletePortfolio(c *gin.Context) {
	ctx := c.Request.Context()
	portfolioIdStr := c.Param("id")

	portfolioId, err := strconv.ParseUint(portfolioIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid portfolio ID"})
		return
	}

	userID, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authorized"})
		return
	}

	if err := h.service.DeletePortfolio(ctx, userID.(uint), uint(portfolioId)); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Portfolio not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete portfolio"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Portfolio deleted successfully",
	})
}

func (h *PortfolioHandler) GetPortfolioTransactions(c *gin.Context) {
	ctx := c.Request.Context()
	portfolioIDStr := c.Query("id")
	portfolioID, err := strconv.ParseUint(portfolioIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid portfolio ID"})
		return
	}
	transactions, err := h.service.GetPortfolioTransactions(ctx, uint(portfolioID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load transactions"})
		log.Printf("failed to load transactions: %v", err)
		return
	}
	c.JSON(http.StatusOK, transactions)
}
