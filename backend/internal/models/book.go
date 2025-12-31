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

// ReadLog represents a record of when a book was read
type ReadLog struct {
	ID           uint           `gorm:"primarykey" json:"id"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
	
	BookID       uint      `json:"book_id" binding:"required" gorm:"index"`
	Book         *Book     `json:"book,omitempty" gorm:"foreignKey:BookID"`
	DateFinished time.Time `json:"date_finished" binding:"required"`
}

// Book represents a book in the collection
type Book struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	Title        string      `json:"title" binding:"required"`
	Authors      []Author    `json:"authors,omitempty" gorm:"many2many:book_authors;"`
	SeriesID     *uint       `json:"series_id"`
	Series       *Series     `json:"series,omitempty" gorm:"foreignKey:SeriesID"`
	ReadLogs     []ReadLog   `json:"read_logs,omitempty" gorm:"foreignKey:BookID"`
	
	ReReadStatus string  `json:"reread_status"` // Deprecated - kept for backward compatibility
	Owned        bool    `json:"owned"`         // Whether book is owned
	Rating       float64 `json:"rating"`        // 6.0-10.0 scale (5-star = rating - 5)
	Notes        string  `json:"notes" gorm:"type:text"`
	ReadSoon     bool    `json:"read_soon"`     // Whether to read soon
}

// TopSeries represents a favorite series for display in the "My Top Series" widget
type TopSeries struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	SeriesID  uint    `json:"series_id" binding:"required" gorm:"uniqueIndex;not null"`
	Series    *Series `json:"series,omitempty" gorm:"foreignKey:SeriesID"`
	SortOrder int     `json:"sort_order" gorm:"default:0"` // Order for display (lower = higher priority)
}

// RecommendedBook represents a book recommendation for display in the "Recommended Books" widget
type RecommendedBook struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	SeriesID  uint    `json:"series_id" binding:"required" gorm:"not null"`
	Series    *Series `json:"series,omitempty" gorm:"foreignKey:SeriesID"`
	Summary   string  `json:"summary" gorm:"type:text"`
	Quote     string  `json:"quote" gorm:"type:text"`
	Review    string  `json:"review" gorm:"type:text"`
	SortOrder int     `json:"sort_order" gorm:"default:0"` // Order for display (lower = higher priority)
}
