package service

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"portfolio-service/internal/dto"
	"portfolio-service/internal/models"
	"time"

	"gorm.io/gorm"
)

type PortfolioService struct {
	db         *gorm.DB
	httpClient *http.Client
}

func NewPortfolioService(db *gorm.DB) *PortfolioService {
	return &PortfolioService{
		db:         db,
		httpClient: &http.Client{Timeout: 10 * time.Second},
	}
}

const bondsServiceURL = "http://bonds-service:8002"

func (s *PortfolioService) AddBondToPortfolio(ctx context.Context, request dto.RequestAddBond) (string, error) {
	purchaseDate, sellDate, err := parseDates(request.PurchaseDate, request.SellDate)
	if err != nil {
		return "", fmt.Errorf("invalid date format: %w", err)
	}

	if err := s.validatePortfolioExists(ctx, request.PortfolioID); err != nil {
		return "", fmt.Errorf("portfolio validation failed: %w", err)
	}

	bond, err := s.fetchBondInfo(ctx, request.Isin)
	if err != nil {
		return "", fmt.Errorf("failed to fetch bond %s: %w", request.Isin, err)
	}

	if err := s.createTransaction(ctx, request, bond.Nominal, purchaseDate, sellDate); err != nil {
		return "", fmt.Errorf("failed to create transaction: %w", err)
	}

	if err := s.upsertPortfolioItem(ctx, request, bond.Nominal, purchaseDate, sellDate); err != nil {
		return "", fmt.Errorf("failed to update portfolio item: %w", err)
	}

	return bond.Name, nil
}

func parseDates(purchase, sell string) (time.Time, time.Time, error) {
	purchaseDate, err := time.Parse("2006-01-02", purchase)
	if err != nil {
		return time.Time{}, time.Time{}, fmt.Errorf("purchase_date: %w", err)
	}

	sellDate, err := time.Parse("2006-01-02", sell)
	if err != nil {
		return time.Time{}, time.Time{}, fmt.Errorf("sell_date: %w", err)
	}

	return purchaseDate, sellDate, nil
}

func (s *PortfolioService) validatePortfolioExists(ctx context.Context, id uint) error {
	var count int64
	var portfolio models.Portfolio
	if err := s.db.WithContext(ctx).Model(&portfolio).Where("id = ?", id).Count(&count).Error; err != nil {
		return fmt.Errorf("db query failed: %w", err)
	}
	if count == 0 {
		return fmt.Errorf("portfolio %v not found", id)
	}
	return nil
}

func (s *PortfolioService) fetchBondInfo(ctx context.Context, isin string) (*dto.ResponseBond, error) {
	url := fmt.Sprintf("%s/bonds/%s", bondsServiceURL, isin)

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	response, err := s.httpClient.Do(request)
	if err != nil {
		return nil, fmt.Errorf("http request failed: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("bond service returned status %d", response.StatusCode)
	}

	var bond dto.ResponseBond
	if err := json.NewDecoder(response.Body).Decode(&bond); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &bond, nil
}

func (s *PortfolioService) createTransaction(ctx context.Context, request dto.RequestAddBond, nominal float64, purchaseDate, sellDate time.Time) error {
	transaction := models.PortfolioTransaction{
		PortfolioID:  request.PortfolioID,
		BondISIN:     request.Isin,
		Quantity:     request.Quantity,
		Price:        nominal,
		PurchaseDate: purchaseDate,
		SellDate:     sellDate,
	}

	return s.db.WithContext(ctx).Create(&transaction).Error
}

func (s *PortfolioService) upsertPortfolioItem(ctx context.Context, request dto.RequestAddBond, nominal float64, purchaseDate, sellDate time.Time) error {

	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var item models.PortfolioItem

		err := tx.Where("portfolio_id = ? AND bond_isin = ?", request.PortfolioID, request.Isin).First(&item).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return tx.Create(&models.PortfolioItem{
				PortfolioID:   request.PortfolioID,
				BondISIN:      request.Isin,
				TotalQuantity: request.Quantity,
				PurchaseDate:  purchaseDate,
				SellDate:      sellDate,
				AveragePrice:  nominal,
			}).Error
		} else if err != nil {
			return err
		}

		newQuantity := item.TotalQuantity + request.Quantity

		newAveragePrice := calculateWeightedAveragePrice(item.AveragePrice, float64(item.TotalQuantity),
			nominal, float64(request.Quantity))

		return tx.Model(&item).Updates(map[string]interface{}{
			"total_quantity": newQuantity,
			"average_price":  newAveragePrice,
			"purchase_date":  minTime(purchaseDate, item.PurchaseDate),
			"sell_date":      maxTime(sellDate, item.SellDate),
		}).Error

	})
}

func calculateWeightedAveragePrice(oldPrice, oldQty, newPrice, newQty float64) float64 {
	return (oldPrice*oldQty + newPrice*newQty) / (oldQty + newQty)
}

func minTime(a, b time.Time) time.Time {
	if a.Before(b) {
		return a
	}
	return b
}

func maxTime(a, b time.Time) time.Time {
	if a.After(b) {
		return a
	}
	return b
}

func (s *PortfolioService) GetPortfolioTransactions(ctx context.Context, id uint) ([]models.PortfolioTransaction, error) {
	var transactions []models.PortfolioTransaction
	query := s.db.WithContext(ctx).Where("portfolio_id = ?", id)
	if err := query.Find(&transactions).Error; err != nil {
		return nil, fmt.Errorf("can't fetch portfolio transactions: %w", err)
	}
	return transactions, nil
}

func (s *PortfolioService) GetPortfolios(ctx context.Context, id uint) ([]dto.ResponsePortfolios, error) {
	var portfolio []dto.ResponsePortfolios
	if err := s.db.WithContext(ctx).Table("portfolio").Where("user_id", id).Find(&portfolio).Error; err != nil {
		return nil, fmt.Errorf("Cant find portfolio: %w", err)
	}
	return portfolio, nil
}

func (s *PortfolioService) CreatePortfolio(ctx context.Context, id uint, name string) error {
	portfolio := models.Portfolio{
		Name:   name,
		UserID: id,
	}
	if err := s.db.WithContext(ctx).Create(&portfolio).Error; err != nil {
		return fmt.Errorf("can't create portfolio: %w", err)
	}
	return nil
}

func (s *PortfolioService) DeletePortfolio(ctx context.Context, id uint, portfolioId uint) error {
	return s.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("portfolio_id = ?", portfolioId).Delete(&models.PortfolioItem{}).Error; err != nil {
			return fmt.Errorf("failed to delete portfolio items: %w", err)
		}
		if err := tx.Where("portfolio_id = ?", portfolioId).Delete(&models.PortfolioTransaction{}).Error; err != nil {
			return fmt.Errorf("failed to delete portfolio transactions: %w", err)
		}

		result := tx.Where("id = ? AND user_id = ?", portfolioId, id).Delete(&models.Portfolio{})

		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}
		return nil
	})

}

func (s *PortfolioService) GetBondsPortfolio(ctx context.Context, id uint) ([]dto.ResponsePortfolioBond, error) {
	var items []models.PortfolioItem
	if err := s.db.WithContext(ctx).Where("portfolio_id = ?", id).Find(&items).Error; err != nil {
		return nil, fmt.Errorf("Cant fetch portfolio items: %w", err)
	}

	if len(items) == 0 {
		return []dto.ResponsePortfolioBond{}, nil
	}

	isins := make([]string, len(items))
	for i, v := range items {
		isins[i] = v.BondISIN
	}

	bonds, err := s.fetchBondsInPortfolio(ctx, isins)
	if err != nil {
		return nil, fmt.Errorf("can't fetch bonds in portfolio: %w", err)
	}

	m := make(map[string]dto.ResponsePortfolioBond)
	for _, b := range bonds {
		m[b.ISIN] = b
	}

	result := make([]dto.ResponsePortfolioBond, 0)

	for _, item := range items {
		bond := m[item.BondISIN]

		result = append(result, dto.ResponsePortfolioBond{
			ISIN:         item.BondISIN,
			Quantity:     item.TotalQuantity,
			PurchaseDate: item.PurchaseDate.Format("2006-01-02"),
			SellDate:     item.SellDate.Format("2006-01-02"),
			Name:         bond.Name,
			Nominal:      bond.Nominal,
			Currency:     bond.Currency,
		})
	}
	return result, nil
}

func (s *PortfolioService) fetchBondsInPortfolio(ctx context.Context, isins []string) ([]dto.ResponsePortfolioBond, error) {
	body, err := json.Marshal(map[string][]string{"isins": isins})
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	url := fmt.Sprintf("%s/bonds/batch", bondsServiceURL)
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	request.Header.Set("Content-Type", "application/json")

	response, err := s.httpClient.Do(request)
	if err != nil {
		return nil, fmt.Errorf("http request failed: %w", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("bonds-service returned status %d", response.StatusCode)
	}

	var bonds []dto.ResponsePortfolioBond
	if err := json.NewDecoder(response.Body).Decode(&bonds); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return bonds, nil
}
