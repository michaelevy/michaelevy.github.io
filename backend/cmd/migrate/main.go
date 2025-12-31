package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"website-backend/internal/migrations"
	"website-backend/internal/models"
)

func main() {
	log.Println("Starting database migration...")

	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Get database URL
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable not set")
	}

	// Connect to database
	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Create migrations tracking table
	log.Println("Setting up migration tracking...")
	if err := db.AutoMigrate(&migrations.MigrationRecord{}); err != nil {
		log.Fatalf("Failed to create migration tracking table: %v", err)
	}

	// Run all migrations
	allMigrations := migrations.AllMigrations()
	log.Printf("Found %d migrations to check\n", len(allMigrations))

	ranCount := 0
	skippedCount := 0

	for _, migration := range allMigrations {
		// Check if this migration has already been run
		var record migrations.MigrationRecord
		result := db.Where("name = ?", migration.Name()).First(&record)

		if result.Error == nil {
			// Migration already ran
			log.Printf("⏭  Skipping migration '%s' (already applied)", migration.Name())
			skippedCount++
			continue
		}

		// Run the migration
		log.Printf("\n▶ Running migration '%s'...", migration.Name())
		if err := migration.Up(db); err != nil {
			log.Fatalf("Migration '%s' failed: %v", migration.Name(), err)
		}

		// Record that this migration ran
		record = migrations.MigrationRecord{
			Name: migration.Name(),
		}
		if err := db.Create(&record).Error; err != nil {
			log.Fatalf("Failed to record migration '%s': %v", migration.Name(), err)
		}

		log.Printf("✓ Migration '%s' completed successfully", migration.Name())
		ranCount++
	}

	// Finalize schema with AutoMigrate
	log.Println("\nFinalizing schema...")
	if err := db.AutoMigrate(&models.Book{}, &models.Author{}, &models.Series{}, &models.ReadLog{}); err != nil {
		log.Fatalf("Failed to finalize schema: %v", err)
	}
	log.Println("✓ Schema finalized")

	// Summary
	log.Printf("\n🎉 Migration completed successfully!")
	log.Printf("   Migrations run: %d", ranCount)
	log.Printf("   Migrations skipped: %d", skippedCount)
}
