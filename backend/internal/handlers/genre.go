package handlers

import (
	"net/http"
	"website-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type GenreHandler struct {
	DB *gorm.DB
}

// GetGenres returns all genres (public endpoint)
func (h *GenreHandler) GetGenres(c *gin.Context) {
	var genres []models.Genre
	
	result := h.DB.Order("name ASC").Find(&genres)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, genres)
}

// GetGenre returns a single genre by ID (public endpoint)
func (h *GenreHandler) GetGenre(c *gin.Context) {
	id := c.Param("id")
	var genre models.Genre

	result := h.DB.Preload("Albums").First(&genre, id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Genre not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, genre)
}

// CreateGenre creates a new genre (protected endpoint)
func (h *GenreHandler) CreateGenre(c *gin.Context) {
	var input struct {
		Name string `json:"name" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	genre := models.Genre{
		Name: input.Name,
	}

	if err := h.DB.Create(&genre).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, genre)
}

// UpdateGenre updates an existing genre (protected endpoint)
func (h *GenreHandler) UpdateGenre(c *gin.Context) {
	id := c.Param("id")
	var genre models.Genre

	if err := h.DB.First(&genre, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Genre not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var input struct {
		Name string `json:"name" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	genre.Name = input.Name

	if err := h.DB.Save(&genre).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, genre)
}

// DeleteGenre deletes a genre (protected endpoint)
func (h *GenreHandler) DeleteGenre(c *gin.Context) {
	id := c.Param("id")
	var genre models.Genre

	if err := h.DB.First(&genre, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Genre not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Delete(&genre).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Genre deleted successfully"})
}
