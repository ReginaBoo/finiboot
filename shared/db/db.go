package db

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDB(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed connect to database: %w", err)
	}
	return db, nil
}

func Migrate(db *gorm.DB, models ...any) error {
	err := db.AutoMigrate(models...)
	if err != nil {
		return fmt.Errorf("failed to migrate models: %w", err)
	}
	return nil
}
