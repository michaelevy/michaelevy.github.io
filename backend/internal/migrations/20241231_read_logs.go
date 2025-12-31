package migrations

import (
	"log"
	"strings"
	"time"

	"gorm.io/gorm"
	"website-backend/internal/models"
)

// Migration20241231ReadLogs migrates from books.read/date_finished to read_logs table
type Migration20241231ReadLogs struct{}

func (m Migration20241231ReadLogs) Name() string {
	return "20241231_read_logs"
}

func (m Migration20241231ReadLogs) Up(db *gorm.DB) error {
	log.Println("Running migration: 20241231_read_logs")

	// Step 1: Create the read_logs table (if it doesn't exist)
	log.Println("  Creating read_logs table...")
	if err := db.AutoMigrate(&models.ReadLog{}); err != nil {
		return err
	}
	log.Println("  ✓ read_logs table created")

	// Step 2: Check if old columns exist
	log.Println("  Checking if old columns exist...")
	hasOldColumns := false
	if db.Migrator().HasColumn(&models.Book{}, "read") {
		hasOldColumns = true
		log.Println("  ✓ Found old 'read' column")
	}
	if db.Migrator().HasColumn(&models.Book{}, "date_finished") {
		hasOldColumns = true
		log.Println("  ✓ Found old 'date_finished' column")
	}

	if !hasOldColumns {
		log.Println("  No old columns found - migration may have already been run")
		log.Println("  Skipping data migration step")
		return nil
	}

	// Step 3: Migrate data from old schema to new schema
	log.Println("  Migrating data from books to read_logs...")

	// OldBook represents the old schema before migration
	type OldBook struct {
		ID           uint   `gorm:"primarykey"`
		Read         bool   `gorm:"column:read"`
		DateFinished string `gorm:"column:date_finished"`
	}

	var oldBooks []OldBook
	if err := db.Table("books").Select("id, read, date_finished").Find(&oldBooks).Error; err != nil {
		return err
	}

	migrated := 0
	skipped := 0

	for _, oldBook := range oldBooks {
		// Only create read log if book was marked as read and has a date
		if oldBook.Read && oldBook.DateFinished != "" {
			// Handle comma-separated dates (for re-reads)
			dates := strings.Split(oldBook.DateFinished, ",")

			for _, dateStr := range dates {
				dateStr = strings.TrimSpace(dateStr)
				if dateStr == "" {
					continue
				}

				parsedDate, err := parseDate(dateStr)
				if err != nil || parsedDate.IsZero() {
					log.Printf("  Warning: Could not parse date '%s' for book ID %d", dateStr, oldBook.ID)
					continue
				}

				readLog := models.ReadLog{
					BookID:       oldBook.ID,
					DateFinished: parsedDate,
				}

				if err := db.Create(&readLog).Error; err != nil {
					log.Printf("  Error creating read log for book ID %d: %v", oldBook.ID, err)
				} else {
					migrated++
				}
			}
		} else {
			skipped++
		}
	}

	log.Printf("  ✓ Data migration complete: %d read logs created, %d books skipped", migrated, skipped)

	// Step 4: Drop old columns
	log.Println("  Dropping old columns from books table...")

	if db.Migrator().HasColumn(&models.Book{}, "read") {
		if err := db.Migrator().DropColumn(&models.Book{}, "read"); err != nil {
			log.Printf("  Warning: Failed to drop 'read' column: %v", err)
		} else {
			log.Println("  ✓ Dropped 'read' column")
		}
	}

	if db.Migrator().HasColumn(&models.Book{}, "date_finished") {
		if err := db.Migrator().DropColumn(&models.Book{}, "date_finished"); err != nil {
			log.Printf("  Warning: Failed to drop 'date_finished' column: %v", err)
		} else {
			log.Println("  ✓ Dropped 'date_finished' column")
		}
	}

	return nil
}

func (m Migration20241231ReadLogs) Down(db *gorm.DB) error {
	log.Println("Rolling back migration: 20241231_read_logs")
	// Rollback would be complex - better to restore from backup
	log.Println("  Rollback not implemented - restore from backup if needed")
	return nil
}

// parseDate parses date string in DD/MM/YY or DD/MM/YYYY format
func parseDate(dateStr string) (time.Time, error) {
	dateStr = strings.TrimSpace(dateStr)
	if dateStr == "" {
		return time.Time{}, nil
	}

	// Handle "Before 2020" special case
	if strings.Contains(dateStr, "Before 2020") {
		return time.Date(2019, 12, 31, 0, 0, 0, 0, time.UTC), nil
	}

	// Try DD/MM/YY format
	layouts := []string{"02/01/06", "02/01/2006", "2006-01-02"}
	for _, layout := range layouts {
		if t, err := time.Parse(layout, dateStr); err == nil {
			return t, nil
		}
	}

	return time.Time{}, nil
}
