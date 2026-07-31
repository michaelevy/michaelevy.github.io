package handlers

import (
	"encoding/csv"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"
	"website-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type BookHandler struct {
	DB *gorm.DB
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

// GetBooks returns all books (public endpoint)
func (h *BookHandler) GetBooks(c *gin.Context) {
	var books []models.Book
	
	result := h.DB.Preload("Authors").Preload("Series").Preload("ReadLogs").Find(&books)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, books)
}

// GetLastRead returns the most recently read book based on ReadLogs (public endpoint)
func (h *BookHandler) GetLastRead(c *gin.Context) {
	var readLog models.ReadLog
	
	// Find the most recent read log entry
	result := h.DB.Preload("Book.Authors").Preload("Book.Series").Order("date_finished DESC").First(&readLog)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "No read books found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, readLog)
}

// GetBook returns a single book by ID (public endpoint)
func (h *BookHandler) GetBook(c *gin.Context) {
	id := c.Param("id")
	var book models.Book

	result := h.DB.Preload("Authors").Preload("Series").Preload("ReadLogs").First(&book, id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, book)
}

// CreateBook creates a new book (protected endpoint)
func (h *BookHandler) CreateBook(c *gin.Context) {
	var input struct {
		Title         string    `json:"title" binding:"required"`
		AuthorNames   []string  `json:"author_names"`
		SeriesName    string    `json:"series_name"`
		DatesFinished []string  `json:"dates_finished"` // Array of date strings
		Owned         bool      `json:"owned"`
		Rating        float64   `json:"rating"`
		Notes         string    `json:"notes"`
		ReadSoon      bool      `json:"read_soon"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	book := models.Book{
		Title:    input.Title,
		Owned:    input.Owned,
		Rating:   input.Rating,
		// Notes:    input.Notes, // Commented out - Notes field removed from model
		ReadSoon: input.ReadSoon,
	}

	// Handle authors (many-to-many)
	for _, authorName := range input.AuthorNames {
		if authorName == "" {
			continue
		}
		var author models.Author
		// Find or create author
		result := h.DB.Where("name = ?", authorName).FirstOrCreate(&author, models.Author{Name: authorName})
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}
		book.Authors = append(book.Authors, author)
	}

	// Handle series (many-to-one)
	if input.SeriesName != "" {
		var series models.Series
		result := h.DB.Where("name = ?", input.SeriesName).FirstOrCreate(&series, models.Series{Name: input.SeriesName})
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}
		book.SeriesID = &series.ID
	}

	if err := h.DB.Create(&book).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Create read log entries for each date finished
	for _, dateStr := range input.DatesFinished {
		if dateStr == "" {
			continue
		}
		// Parse date string (DD/MM/YY format)
		parsedDate, err := parseDate(dateStr)
		if err != nil {
			continue // Skip invalid dates
		}
		readLog := models.ReadLog{
			BookID:       book.ID,
			DateFinished: parsedDate,
		}
		if err := h.DB.Create(&readLog).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	// Reload with associations
	h.DB.Preload("Authors").Preload("Series").Preload("ReadLogs").First(&book, book.ID)

	c.JSON(http.StatusCreated, book)
}

// UpdateBook updates an existing book (protected endpoint)
func (h *BookHandler) UpdateBook(c *gin.Context) {
	id := c.Param("id")
	var book models.Book

	if err := h.DB.Preload("Authors").Preload("Series").Preload("ReadLogs").First(&book, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var input struct {
		Title         string   `json:"title"`
		AuthorNames   []string `json:"author_names"`
		SeriesName    string   `json:"series_name"`
		DatesFinished []string `json:"dates_finished"` // Array of date strings
		Owned         bool     `json:"owned"`
		Rating        float64  `json:"rating"`
		Notes         string   `json:"notes"`
		ReadSoon      bool     `json:"read_soon"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update basic fields
	book.Title = input.Title
	book.Owned = input.Owned
	book.Rating = input.Rating
	// book.Notes = input.Notes // Commented out - Notes field removed from model
	book.ReadSoon = input.ReadSoon

	// Clear existing authors and add new ones
	h.DB.Model(&book).Association("Authors").Clear()
	for _, authorName := range input.AuthorNames {
		if authorName == "" {
			continue
		}
		var author models.Author
		result := h.DB.Where("name = ?", authorName).FirstOrCreate(&author, models.Author{Name: authorName})
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}
		h.DB.Model(&book).Association("Authors").Append(&author)
	}

	// Update series
	if input.SeriesName != "" {
		var series models.Series
		result := h.DB.Where("name = ?", input.SeriesName).FirstOrCreate(&series, models.Series{Name: input.SeriesName})
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}
		book.SeriesID = &series.ID
	} else {
		book.SeriesID = nil
	}

	// Clear existing read logs and create new ones
	h.DB.Where("book_id = ?", book.ID).Delete(&models.ReadLog{})
	for _, dateStr := range input.DatesFinished {
		if dateStr == "" {
			continue
		}
		parsedDate, err := parseDate(dateStr)
		if err != nil {
			continue // Skip invalid dates
		}
		readLog := models.ReadLog{
			BookID:       book.ID,
			DateFinished: parsedDate,
		}
		if err := h.DB.Create(&readLog).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	if err := h.DB.Omit("Series").Save(&book).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Reload with associations
	h.DB.Preload("Authors").Preload("Series").Preload("ReadLogs").First(&book, book.ID)

	c.JSON(http.StatusOK, book)
}

// DeleteBook deletes a book (protected endpoint)
func (h *BookHandler) DeleteBook(c *gin.Context) {
	id := c.Param("id")
	var book models.Book

	if err := h.DB.First(&book, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Delete(&book).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Book deleted successfully"})
}

// LogRead creates a new read log entry for a book and optionally updates book metadata (protected endpoint)
func (h *BookHandler) LogRead(c *gin.Context) {
	id := c.Param("id")
	var book models.Book

	if err := h.DB.Preload("Authors").Preload("Series").Preload("ReadLogs").First(&book, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var input struct {
		DateFinished string   `json:"date_finished" binding:"required"`
		Rating       *float64 `json:"rating"`
		Owned        *bool    `json:"owned"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse the date
	parsedDate, err := parseDate(input.DateFinished)
	if err != nil || parsedDate.IsZero() {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use DD/MM/YY or DD/MM/YYYY"})
		return
	}

	// Create the read log entry
	readLog := models.ReadLog{
		BookID:       book.ID,
		DateFinished: parsedDate,
	}

	if err := h.DB.Create(&readLog).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Update book metadata if provided
	updated := false
	if input.Rating != nil {
		book.Rating = *input.Rating
		updated = true
	}
	if input.Owned != nil {
		book.Owned = *input.Owned
		updated = true
	}

	if updated {
		if err := h.DB.Save(&book).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	// Reload with associations
	h.DB.Preload("Authors").Preload("Series").Preload("ReadLogs").First(&book, book.ID)

	c.JSON(http.StatusCreated, book)
}

// GetAuthors returns all authors (public endpoint)
func (h *BookHandler) GetAuthors(c *gin.Context) {
	var authors []models.Author
	
	result := h.DB.Find(&authors)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, authors)
}

// GetSeries returns all series (public endpoint)
func (h *BookHandler) GetSeries(c *gin.Context) {
	var series []models.Series
	
	result := h.DB.Find(&series)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, series)
}

// GetTopSeries returns top/favorite series ordered by sort_order (public endpoint)
func (h *BookHandler) GetTopSeries(c *gin.Context) {
	var topSeries []models.TopSeries
	
	result := h.DB.Preload("Series").Order("sort_order ASC").Find(&topSeries)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, topSeries)
}

// GetRecommendedBooks returns recommended books ordered by sort_order (public endpoint)
func (h *BookHandler) GetRecommendedBooks(c *gin.Context) {
	var recommendedBooks []models.RecommendedBook
	
	result := h.DB.Preload("Series").Order("sort_order ASC").Find(&recommendedBooks)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, recommendedBooks)
}

// ImportCSV imports books from a CSV file (protected endpoint)
func (h *BookHandler) ImportCSV(c *gin.Context) {
	file, _, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}
	defer file.Close()

	reader := csv.NewReader(file)
	
	// Read header
	_, err = reader.Read()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read CSV header"})
		return
	}

	// Skip the rating scale rows (rows 2-9)
	for i := 0; i < 8; i++ {
		_, err := reader.Read()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid CSV format"})
			return
		}
	}

	imported := 0
	skipped := 0
	errors := []string{}

	// Process each row
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			errors = append(errors, "Error reading CSV row: "+err.Error())
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

		read := false
		if len(record) > 4 {
			readStr := strings.TrimSpace(record[4])
			read = readStr == "Read"
		}

		reReadStatus := ""
		if len(record) > 5 {
			reReadStatus = strings.TrimSpace(record[5])
		}

		owned := false
		if len(record) > 6 {
			ownedStr := strings.TrimSpace(record[6])
			owned = ownedStr == "Owned"
		}

		rating := 0.0
		if len(record) > 7 && record[7] != "" {
			rating, _ = strconv.ParseFloat(strings.TrimSpace(record[7]), 64)
		}

		dateFinished := ""
		if len(record) > 9 {
			dateFinished = strings.TrimSpace(record[9])
		}

		// notes := ""
		// if len(record) > 10 {
		// 	notes = strings.TrimSpace(record[10])
		// }
		// Commented out - Notes field removed from model but kept for potential future use

		readSoon := false
		if len(record) > 11 {
			readSoon = strings.TrimSpace(record[11]) != ""
		}

		// Create or find author
		var authors []models.Author
		if authorName != "" {
			var author models.Author
			result := h.DB.Where("name = ?", authorName).FirstOrCreate(&author, models.Author{Name: authorName})
			if result.Error != nil {
				errors = append(errors, "Error creating author "+authorName+": "+result.Error.Error())
				continue
			}
			authors = append(authors, author)
		}

		// Create or find series
		var seriesID *uint
		if seriesName != "" {
			var series models.Series
			result := h.DB.Where("name = ?", seriesName).FirstOrCreate(&series, models.Series{Name: seriesName})
			if result.Error != nil {
				errors = append(errors, "Error creating series "+seriesName+": "+result.Error.Error())
				continue
			}
			seriesID = &series.ID
		}

		// Create book
		book := models.Book{
			Title:        title,
			SeriesID:     seriesID,
			ReReadStatus: reReadStatus,
			Owned:        owned,
			Rating:       rating,
			// Notes:        notes, // Commented out - Notes field removed from model
			ReadSoon:     readSoon,
		}

		if err := h.DB.Create(&book).Error; err != nil {
			errors = append(errors, "Error creating book "+title+": "+err.Error())
			continue
		}

		// Associate authors
		if len(authors) > 0 {
			if err := h.DB.Model(&book).Association("Authors").Append(authors); err != nil {
				errors = append(errors, "Error associating authors for book "+title+": "+err.Error())
			}
		}

		// Create read log entries if book was read
		if read && dateFinished != "" {
			// Handle comma-separated dates
			dates := strings.Split(dateFinished, ",")
			for _, dateStr := range dates {
				dateStr = strings.TrimSpace(dateStr)
				if dateStr == "" {
					continue
				}
				parsedDate, err := parseDate(dateStr)
				if err != nil || parsedDate.IsZero() {
					continue // Skip invalid dates
				}
				readLog := models.ReadLog{
					BookID:       book.ID,
					DateFinished: parsedDate,
				}
				if err := h.DB.Create(&readLog).Error; err != nil {
					errors = append(errors, "Error creating read log for book "+title+": "+err.Error())
				}
			}
		}

		imported++
	}

	response := gin.H{
		"imported": imported,
		"skipped":  skipped,
		"message":  "Import completed",
	}

	if len(errors) > 0 {
		response["errors"] = errors
	}

	c.JSON(http.StatusOK, response)
}
