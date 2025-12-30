package models

import (
	"time"

	"gorm.io/gorm"
)

// Author represents a book author
type Author struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	Name  string `json:"name" binding:"required" gorm:"uniqueIndex"`
	Books []Book `json:"books,omitempty" gorm:"many2many:book_authors;"`
}

// Series represents a book series
type Series struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	Name  string `json:"name" binding:"required" gorm:"uniqueIndex"`
	Books []Book `json:"books,omitempty" gorm:"foreignKey:SeriesID"`
}

// Book represents a book in the collection
type Book struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	Title        string    `json:"title" binding:"required"`
	Authors      []Author  `json:"authors,omitempty" gorm:"many2many:book_authors;"`
	SeriesID     *uint     `json:"series_id"`
	Series       *Series   `json:"series,omitempty" gorm:"foreignKey:SeriesID"`
	
	Read         bool    `json:"read"`          // Whether book has been read
	ReReadStatus string  `json:"reread_status"` // Deprecated - kept for backward compatibility
	Owned        bool    `json:"owned"`         // Whether book is owned
	Rating       float64 `json:"rating"`        // 6.0-10.0 scale (5-star = rating - 5)
	DateFinished string  `json:"date_finished"`
	Notes        string  `json:"notes" gorm:"type:text"`
	ReadSoon     bool    `json:"read_soon"`     // Whether to read soon
}
