package models

import (
	"time"

	"gorm.io/gorm"
)

type Album struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Name   string       `json:"name" binding:"required"`
	Artist string       `json:"artist" binding:"required"`
	Year   string       `json:"year"`
	Links  []AlbumLink  `gorm:"foreignKey:AlbumID" json:"links"`
	Genres []Genre      `gorm:"many2many:album_genres;" json:"genres"`
	Text   string       `json:"text" gorm:"type:text"`
	Image  string       `json:"image"`
}

type AlbumLink struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	AlbumID uint   `json:"album_id"`
	Type    string `json:"type" binding:"required"`
	Link    string `json:"link" binding:"required"`
}

type Genre struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Name   string        `json:"name" binding:"required" gorm:"uniqueIndex"`
	Albums []Album       `gorm:"many2many:album_genres;" json:"albums,omitempty"`
}

type AlbumGenre struct {
	AlbumID uint `json:"album_id"`
	GenreID uint `json:"genre_id"`
}
