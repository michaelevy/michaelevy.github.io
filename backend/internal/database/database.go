package database

import (
	"website-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Connect establishes a connection to the PostgreSQL database
func Connect(databaseURL string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	return db, nil
}

// Migrate runs auto-migration for all models
func Migrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.Note{},
		&models.Item{},
		// Add more models here as you create them
	)
}
