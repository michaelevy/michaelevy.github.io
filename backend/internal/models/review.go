package models

import (
	"time"

	"gorm.io/gorm"
)

// ReviewSeriesMapping represents a mapping between a Contentful review slug and a Series
type ReviewSeriesMapping struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	ReviewSlug string  `json:"review_slug" gorm:"uniqueIndex;not null"`
	SeriesID   uint    `json:"series_id" gorm:"not null"`
	Series     *Series `json:"series,omitempty" gorm:"foreignKey:SeriesID"`
}
