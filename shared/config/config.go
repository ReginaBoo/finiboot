package config

import (
	"fmt"
	"log"

	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	DBHost       string `envconfig:"DB_HOST"`
	DBPort       string `envconfig:"DB_PORT"`
	DBUser       string `envconfig:"DB_USER"`
	DBPassword   string `envconfig:"DB_PASSWORD"`
	DBName       string `envconfig:"DB_NAME"`
	AppPort      string `envconfig:"APP_PORT"`
	TinkoffToken string `envconfig:"TOKEN_API_TBANK"`
}

func NewConfig() *Config {
	return &Config{}
}

func (cfg *Config) LoadConfig() {
	err := envconfig.Process("", cfg)
	if err != nil {
		log.Fatal(err)
	}
}

func (cfg *Config) CreateDsn() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
		cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName)
}
