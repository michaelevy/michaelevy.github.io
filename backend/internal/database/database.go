package database

import (
	"website-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Connect(databaseURL string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	return db, nil
}

func Migrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.Note{},
		&models.Item{},
		&models.Book{},
		&models.Author{},
		&models.Series{},
		&models.ReadLog{},
		&models.TopSeries{},
		&models.RecommendedBook{},
		&models.ReviewSeriesMapping{},
	)
}
