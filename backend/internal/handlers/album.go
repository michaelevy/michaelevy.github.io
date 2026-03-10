package handlers

import (
	"net/http"
	"website-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AlbumHandler struct {
	DB *gorm.DB
}

// GetAlbums returns all albums (public endpoint)
// Pass ?include_hidden=true to include hidden albums (for admin use)
func (h *AlbumHandler) GetAlbums(c *gin.Context) {
	var albums []models.Album

	query := h.DB.Preload("Links").Preload("Genres")
	if c.Query("include_hidden") != "true" {
		query = query.Where("hidden = ?", false)
	}

	result := query.Order("year DESC").Find(&albums)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, albums)
}

// GetAlbum returns a single album by ID (public endpoint)
func (h *AlbumHandler) GetAlbum(c *gin.Context) {
	id := c.Param("id")
	var album models.Album

	result := h.DB.Preload("Links").Preload("Genres").First(&album, id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Album not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, album)
}

// CreateAlbum creates a new album (protected endpoint)
func (h *AlbumHandler) CreateAlbum(c *gin.Context) {
	var input struct {
		Name   string `json:"name" binding:"required"`
		Artist string `json:"artist" binding:"required"`
		Year   string `json:"year"`
		Links  []struct {
			Type string `json:"type" binding:"required"`
			Link string `json:"link" binding:"required"`
		} `json:"links"`
		GenreIDs []uint `json:"genre_ids"`
		Text     string `json:"text"`
		Image    string `json:"image"`
		Hidden   bool   `json:"hidden"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	album := models.Album{
		Name:   input.Name,
		Artist: input.Artist,
		Year:   input.Year,
		Text:   input.Text,
		Image:  input.Image,
		Hidden: input.Hidden,
	}

	// Create the album
	if err := h.DB.Create(&album).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Create links
	for _, linkInput := range input.Links {
		link := models.AlbumLink{
			AlbumID: album.ID,
			Type:    linkInput.Type,
			Link:    linkInput.Link,
		}
		if err := h.DB.Create(&link).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	// Associate genres
	if len(input.GenreIDs) > 0 {
		var genres []models.Genre
		h.DB.Find(&genres, input.GenreIDs)
		if err := h.DB.Model(&album).Association("Genres").Replace(genres); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	// Reload with associations
	h.DB.Preload("Links").Preload("Genres").First(&album, album.ID)

	c.JSON(http.StatusCreated, album)
}

// UpdateAlbum updates an existing album (protected endpoint)
func (h *AlbumHandler) UpdateAlbum(c *gin.Context) {
	id := c.Param("id")
	var album models.Album

	if err := h.DB.Preload("Links").Preload("Genres").First(&album, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Album not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var input struct {
		Name     string `json:"name"`
		Artist   string `json:"artist"`
		Year     string `json:"year"`
		Links    []struct {
			Type string `json:"type"`
			Link string `json:"link"`
		} `json:"links"`
		GenreIDs []uint `json:"genre_ids"`
		Text     string `json:"text"`
		Image    string `json:"image"`
		Hidden   bool   `json:"hidden"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update basic fields
	album.Name = input.Name
	album.Artist = input.Artist
	album.Year = input.Year
	album.Text = input.Text
	album.Image = input.Image
	album.Hidden = input.Hidden

	// Clear existing links and create new ones
	h.DB.Where("album_id = ?", album.ID).Delete(&models.AlbumLink{})
	for _, linkInput := range input.Links {
		link := models.AlbumLink{
			AlbumID: album.ID,
			Type:    linkInput.Type,
			Link:    linkInput.Link,
		}
		if err := h.DB.Create(&link).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	// Update genre associations
	var genres []models.Genre
	if len(input.GenreIDs) > 0 {
		h.DB.Find(&genres, input.GenreIDs)
	}
	if err := h.DB.Model(&album).Association("Genres").Replace(genres); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Save(&album).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Reload with associations
	h.DB.Preload("Links").Preload("Genres").First(&album, album.ID)

	c.JSON(http.StatusOK, album)
}

// DeleteAlbum deletes an album (protected endpoint)
func (h *AlbumHandler) DeleteAlbum(c *gin.Context) {
	id := c.Param("id")
	var album models.Album

	if err := h.DB.First(&album, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Album not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Delete associated links
	h.DB.Where("album_id = ?", album.ID).Delete(&models.AlbumLink{})

	if err := h.DB.Delete(&album).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Album deleted successfully"})
}
