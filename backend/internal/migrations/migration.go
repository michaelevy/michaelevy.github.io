package migrations

import (
	"time"

	"gorm.io/gorm"
)

// Migration interface that all migrations must implement
type Migration interface {
	Name() string
	Up(db *gorm.DB) error
	Down(db *gorm.DB) error
}

// MigrationRecord tracks which migrations have been run
type MigrationRecord struct {
	ID        uint      `gorm:"primarykey"`
	Name      string    `gorm:"uniqueIndex"`
	AppliedAt time.Time `gorm:"autoCreateTime"`
}

// AllMigrations returns all migrations in order
func AllMigrations() []Migration {
	return []Migration{
		Migration20241231ReadLogs{},
		// Add new migrations here in chronological order
	}
}
