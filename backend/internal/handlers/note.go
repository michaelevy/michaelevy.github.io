package handlers

import (
	"net/http"
	"website-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetLatestNote(c *gin.Context) {
	var note models.Note

	// Get the most recent note ordered by creation time
	if err := h.db.Order("created_at desc").First(&note).Error; err != nil {
		// If no notes exist yet, return empty note
		c.JSON(http.StatusOK, gin.H{
			"from":    "Nobody yet",
			"message": "Be the first to leave a note!",
		})
		return
	}

	c.JSON(http.StatusOK, note)
}

func (h *Handler) CreateNote(c *gin.Context) {
	var note models.Note

	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.db.Create(&note).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create note"})
		return
	}

	c.JSON(http.StatusCreated, note)
}

func (h *Handler) GetAllNotes(c *gin.Context) {
	var notes []models.Note

	if err := h.db.Order("created_at desc").Find(&notes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch notes"})
		return
	}

	c.JSON(http.StatusOK, notes)
}
