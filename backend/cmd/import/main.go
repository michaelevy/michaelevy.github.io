package main

import (
	"encoding/csv"
	"io"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"website-backend/internal/models"
)

func main() {
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

	// Auto-migrate the schema
	if err := db.AutoMigrate(&models.Book{}, &models.Author{}, &models.Series{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// Open CSV file
	csvPath := os.Getenv("CSV_PATH")
	if csvPath == "" {
		csvPath = "../frontend/_data/Boooks - Data(3).csv"
	}

	file, err := os.Open(csvPath)
	if err != nil {
		log.Fatalf("Failed to open CSV file: %v", err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	
	// Read header
	header, err := reader.Read()
	if err != nil {
		log.Fatalf("Failed to read CSV header: %v", err)
	}
	
	log.Printf("CSV Header: %v", header)
	
	// Skip the rating scale rows (rows 2-9)
	for i := 0; i < 8; i++ {
		_, err := reader.Read()
		if err != nil {
			log.Fatalf("Failed to skip rating scale row %d: %v", i+1, err)
		}
	}

	imported := 0
	skipped := 0

	// Process each row
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("Error reading CSV row: %v", err)
			continue
		}

		// Skip rows without a title
		if len(record) == 0 || record[0] == "" {
			skipped++
			continue
		}

		title := strings.TrimSpace(record[0])
		if title == "" {
			skipped++
			continue
		}

		// Parse the row
		authorName := ""
		if len(record) > 1 {
			authorName = strings.TrimSpace(record[1])
		}

		seriesName := ""
		if len(record) > 2 {
			seriesName = strings.TrimSpace(record[2])
		}

		readStatus := ""
		if len(record) > 4 {
			readStatus = strings.TrimSpace(record[4])
		}

		reReadStatus := ""
		if len(record) > 5 {
			reReadStatus = strings.TrimSpace(record[5])
		}

		ownedStatus := ""
		if len(record) > 6 {
			ownedStatus = strings.TrimSpace(record[6])
		}

		rating := 0.0
		if len(record) > 7 && record[7] != "" {
			rating, _ = strconv.ParseFloat(strings.TrimSpace(record[7]), 64)
		}

		dateFinished := ""
		if len(record) > 9 {
			dateFinished = strings.TrimSpace(record[9])
		}

		notes := ""
		if len(record) > 10 {
			notes = strings.TrimSpace(record[10])
		}

		readSoon := false
		if len(record) > 11 {
			readSoon = strings.TrimSpace(record[11]) != ""
		}

		// Create or find author
		var authors []models.Author
		if authorName != "" {
			var author models.Author
			result := db.Where("name = ?", authorName).FirstOrCreate(&author, models.Author{Name: authorName})
			if result.Error != nil {
				log.Printf("Error creating author %s: %v", authorName, result.Error)
				continue
			}
			authors = append(authors, author)
		}

		// Create or find series
		var seriesID *uint
		if seriesName != "" {
			var series models.Series
			result := db.Where("name = ?", seriesName).FirstOrCreate(&series, models.Series{Name: seriesName})
			if result.Error != nil {
				log.Printf("Error creating series %s: %v", seriesName, result.Error)
				continue
			}
			seriesID = &series.ID
		}

		// Create book
		book := models.Book{
			Title:        title,
			SeriesID:     seriesID,
			ReadStatus:   readStatus,
			ReReadStatus: reReadStatus,
			OwnedStatus:  ownedStatus,
			Rating:       rating,
			DateFinished: dateFinished,
			Notes:        notes,
			ReadSoon:     readSoon,
		}

		if err := db.Create(&book).Error; err != nil {
			log.Printf("Error creating book %s: %v", title, err)
			continue
		}

		// Associate authors
		if len(authors) > 0 {
			if err := db.Model(&book).Association("Authors").Append(authors); err != nil {
				log.Printf("Error associating authors for book %s: %v", title, err)
			}
		}

		imported++
		if imported%10 == 0 {
			log.Printf("Imported %d books...", imported)
		}
	}

	log.Printf("Import complete! Imported: %d, Skipped: %d", imported, skipped)
}
