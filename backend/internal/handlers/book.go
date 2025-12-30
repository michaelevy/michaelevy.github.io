package handlers

import (
	"encoding/csv"
	"io"
	"net/http"
	"strconv"
	"strings"
	"website-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type BookHandler struct {
	DB *gorm.DB
}

// GetBooks returns all books (public endpoint)
func (h *BookHandler) GetBooks(c *gin.Context) {
	var books []models.Book
	
	result := h.DB.Preload("Authors").Preload("Series").Find(&books)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, books)
}

// GetBook returns a single book by ID (public endpoint)
func (h *BookHandler) GetBook(c *gin.Context) {
	id := c.Param("id")
	var book models.Book

	result := h.DB.Preload("Authors").Preload("Series").First(&book, id)
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
		Title        string   `json:"title" binding:"required"`
		AuthorNames  []string `json:"author_names"`
		SeriesName   string   `json:"series_name"`
		Read         bool     `json:"read"`
		Owned        bool     `json:"owned"`
		Rating       float64  `json:"rating"`
		DateFinished string   `json:"date_finished"`
		Notes        string   `json:"notes"`
		ReadSoon     bool     `json:"read_soon"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	book := models.Book{
		Title:        input.Title,
		Read:         input.Read,
		Owned:        input.Owned,
		Rating:       input.Rating,
		DateFinished: input.DateFinished,
		Notes:        input.Notes,
		ReadSoon:     input.ReadSoon,
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

	// Reload with associations
	h.DB.Preload("Authors").Preload("Series").First(&book, book.ID)

	c.JSON(http.StatusCreated, book)
}

// UpdateBook updates an existing book (protected endpoint)
func (h *BookHandler) UpdateBook(c *gin.Context) {
	id := c.Param("id")
	var book models.Book

	if err := h.DB.Preload("Authors").Preload("Series").First(&book, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var input struct {
		Title        string   `json:"title"`
		AuthorNames  []string `json:"author_names"`
		SeriesName   string   `json:"series_name"`
		Read         bool     `json:"read"`
		Owned        bool     `json:"owned"`
		Rating       float64  `json:"rating"`
		DateFinished string   `json:"date_finished"`
		Notes        string   `json:"notes"`
		ReadSoon     bool     `json:"read_soon"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update basic fields
	book.Title = input.Title
	book.Read = input.Read
	book.Owned = input.Owned
	book.Rating = input.Rating
	book.DateFinished = input.DateFinished
	book.Notes = input.Notes
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

	if err := h.DB.Save(&book).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Reload with associations
	h.DB.Preload("Authors").Preload("Series").First(&book, book.ID)

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
			Read:         read,
			ReReadStatus: reReadStatus,
			Owned:        owned,
			Rating:       rating,
			DateFinished: dateFinished,
			Notes:        notes,
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
