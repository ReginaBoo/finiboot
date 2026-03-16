package service

import (
	"context"
	"fmt"
	"os"

	"github.com/russianinvestments/invest-api-go-sdk/investgo"
	"go.uber.org/zap"
)

func NewTBankClient() (*investgo.Client, error) {
	token := os.Getenv("TOKEN_API_TBANK")
	if token == "" {
		return nil, fmt.Errorf("Tbank token not found")
	}

	config := investgo.Config{
		EndPoint: "invest-public-api.tinkoff.ru:443",
		Token:    token,
		AppName:  "bonds-service",
	}

	logger, _ := zap.NewDevelopment()

	return investgo.NewClient(
		context.Background(),
		config,
		logger.Sugar(),
	)
}
