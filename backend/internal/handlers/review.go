package handlers

import (
	"net/http"
	"strconv"
	"website-backend/internal/contentful"
	"website-backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ReviewHandler struct {
	DB               *gorm.DB
	ContentfulClient *contentful.Client
}

// ReviewResponse combines Contentful review data with series mapping
type ReviewResponse struct {
	contentful.Review
	Series *models.Series `json:"series,omitempty"`
}

// GetReviews returns all reviews from Contentful with series mappings
func (h *ReviewHandler) GetReviews(c *gin.Context) {
	// Fetch reviews from Contentful
	reviews, err := h.ContentfulClient.GetReviews()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reviews from Contentful"})
		return
	}

	// Fetch all mappings from database
	var mappings []models.ReviewSeriesMapping
	result := h.DB.Preload("Series").Find(&mappings)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Create a map of slug -> series for quick lookup
	mappingMap := make(map[string]*models.Series)
	for _, mapping := range mappings {
		mappingMap[mapping.ReviewSlug] = mapping.Series
	}

	// Build response with series data
	var response []ReviewResponse
	for _, review := range reviews {
		reviewResp := ReviewResponse{
			Review: review,
			Series: mappingMap[review.Slug],
		}
		response = append(response, reviewResp)
	}

	c.JSON(http.StatusOK, response)
}

// GetReview returns a single review by slug
func (h *ReviewHandler) GetReview(c *gin.Context) {
	slug := c.Param("slug")

	// Fetch review from Contentful
	review, err := h.ContentfulClient.GetReviewBySlug(slug)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch review from Contentful"})
		return
	}

	if review == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}

	// Fetch mapping from database
	var mapping models.ReviewSeriesMapping
	result := h.DB.Preload("Series").Where("review_slug = ?", slug).First(&mapping)
	
	// Build response
	reviewResp := ReviewResponse{
		Review: *review,
	}
	
	if result.Error == nil {
		reviewResp.Series = mapping.Series
	}

	c.JSON(http.StatusOK, reviewResp)
}

// GetSeriesReviews returns all reviews for a specific series
func (h *ReviewHandler) GetSeriesReviews(c *gin.Context) {
	seriesIDStr := c.Param("id")
	seriesID, err := strconv.ParseUint(seriesIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid series ID"})
		return
	}

	// Fetch mappings for this series
	var mappings []models.ReviewSeriesMapping
	result := h.DB.Preload("Series").Where("series_id = ?", uint(seriesID)).Find(&mappings)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Fetch all reviews from Contentful
	allReviews, err := h.ContentfulClient.GetReviews()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reviews from Contentful"})
		return
	}

	// Create a map of slugs for this series
	slugMap := make(map[string]*models.Series)
	for _, mapping := range mappings {
		slugMap[mapping.ReviewSlug] = mapping.Series
	}

	// Filter reviews for this series
	var response []ReviewResponse
	for _, review := range allReviews {
		if series, ok := slugMap[review.Slug]; ok {
			reviewResp := ReviewResponse{
				Review: review,
				Series: series,
			}
			response = append(response, reviewResp)
		}
	}

	c.JSON(http.StatusOK, response)
}

// GetMappings returns all review-to-series mappings (for frontend to check which series have reviews)
func (h *ReviewHandler) GetMappings(c *gin.Context) {
	var mappings []models.ReviewSeriesMapping
	
	result := h.DB.Preload("Series").Find(&mappings)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, mappings)
}
