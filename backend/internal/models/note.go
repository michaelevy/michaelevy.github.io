package models

import (
	"time"

	"gorm.io/gorm"
)

// Note represents a message left by a visitor
type Note struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	From    string `json:"from" binding:"required,max=50"`
	Message string `json:"message" binding:"required,max=255"`
}
