package service

import (
	"auth-service/internal/models"
	"auth-service/internal/utils"
	"context"
	"errors"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	db *gorm.DB
}

func NewAuthService(db *gorm.DB) *AuthService {
	return &AuthService{db: db}
}

func (s *AuthService) RefreshToken(refreshToken string) (string, error) {
	token, err := jwt.Parse(refreshToken, func(t *jwt.Token) (any, error) {
		return []byte(utils.LoadJWT()), nil
	})

	if err != nil || !token.Valid {
		return "", fmt.Errorf("invalid token: %w", err)
	}

	claims := token.Claims.(jwt.MapClaims)
	userIDFloat, ok := claims["userID"].(float64)
	if !ok {
		return "", fmt.Errorf("invalid token claims")
	}
	userID := uint(userIDFloat)

	newAccessToken, err := utils.CreateAccessToken(userID)
	if err != nil {
		return "", fmt.Errorf("failed to create access token: %w", err)
	}

	return newAccessToken, nil
}

func (s *AuthService) Login(ctx context.Context, email string, password string) (string, string, string, error) {
	var user models.User

	if err := s.db.WithContext(ctx).Where("email = ?", email).First(&user).Error; err != nil {
		return "", "", "", fmt.Errorf("user not found: %w", err)
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", "", "", fmt.Errorf("invalid password: %w", err)
	}

	accessToken, err := utils.CreateAccessToken(user.ID)
	if err != nil {
		return "", "", "", fmt.Errorf("failed to generate access token: %w", err)
	}

	refreshToken, err := utils.CreateRefreshToken(user.ID)
	if err != nil {
		return "", "", "", fmt.Errorf("failed to generate refresh token: %w", err)
	}

	user.RefreshToken = refreshToken
	if err := s.db.WithContext(ctx).Save(&user).Error; err != nil {
		return "", "", "", fmt.Errorf("failed to save refresh token: %w", err)
	}

	return user.Name, accessToken, refreshToken, nil
}

func (s *AuthService) Register(ctx context.Context, name string, email string, password string) error {
	var existing models.User
	var err error
	if err = s.db.WithContext(ctx).Where("email = ?", email).First(&existing).Error; err == nil {
		return fmt.Errorf("user already exists")
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return fmt.Errorf("db error: %w", err)
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	user := models.User{Name: name, Email: email, Password: string(hashedPassword)}

	if err := s.db.WithContext(ctx).Create(&user).Error; err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}
