package handlers

import (
	"html/template"
	"net/http"
	"strconv"
	"strings"
	"website-backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/russross/blackfriday/v2"
	"gorm.io/gorm"
)

type AlbumHTMLHandler struct {
	DB        *gorm.DB
	Templates *template.Template
}

// Helper function to convert markdown to HTML
func markdownToHTML(md string) template.HTML {
	html := blackfriday.Run([]byte(md))
	return template.HTML(html)
}

// GetAlbumsHTML returns the albums grid HTML
func (h *AlbumHTMLHandler) GetAlbumsHTML(c *gin.Context) {
	genreParam := c.Query("genres")
	var albums []models.Album

	query := h.DB.Preload("Links").Preload("Genres").Where("hidden = ?", false)

	// Filter by genres if provided
	if genreParam != "" {
		genreIDs := []uint{}
		for _, idStr := range strings.Split(genreParam, ",") {
			if id, err := strconv.ParseUint(idStr, 10, 32); err == nil {
				genreIDs = append(genreIDs, uint(id))
			}
		}

		if len(genreIDs) > 0 {
			// Find albums that have any of the selected genres
			query = query.Joins("JOIN album_genres ON album_genres.album_id = albums.id").
				Where("album_genres.genre_id IN ?", genreIDs).
				Distinct()
		}
	}

	result := query.Order("year DESC").Find(&albums)
	if result.Error != nil {
		c.String(http.StatusInternalServerError, "Error loading albums")
		return
	}

	data := gin.H{
		"Albums": albums,
	}

	c.Header("Content-Type", "text/html; charset=utf-8")
	if err := h.Templates.ExecuteTemplate(c.Writer, "albums_grid.html", data); err != nil {
		c.String(http.StatusInternalServerError, "Error rendering template: "+err.Error())
	}
}

// GetAlbumDetails returns the sidebar details HTML for a specific album
func (h *AlbumHTMLHandler) GetAlbumDetails(c *gin.Context) {
	id := c.Param("id")
	var album models.Album

	result := h.DB.Preload("Links").Preload("Genres").First(&album, id)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.String(http.StatusNotFound, "Album not found")
			return
		}
		c.String(http.StatusInternalServerError, "Error loading album")
		return
	}

	// Convert markdown text to HTML
	textHTML := markdownToHTML(album.Text)

	data := gin.H{
		"ID":       album.ID,
		"Name":     album.Name,
		"Artist":   album.Artist,
		"Year":     album.Year,
		"Text":     album.Text,
		"TextHTML": textHTML,
		"Links":    album.Links,
		"Genres":   album.Genres,
	}

	c.Header("Content-Type", "text/html; charset=utf-8")
	if err := h.Templates.ExecuteTemplate(c.Writer, "album_details.html", data); err != nil {
		c.String(http.StatusInternalServerError, "Error rendering template: "+err.Error())
	}
}

// ClearSidebar returns the default sidebar state
func (h *AlbumHTMLHandler) ClearSidebar(c *gin.Context) {
	c.Header("Content-Type", "text/html; charset=utf-8")
	if err := h.Templates.ExecuteTemplate(c.Writer, "sidebar_default.html", nil); err != nil {
		c.String(http.StatusInternalServerError, "Error rendering template: "+err.Error())
	}
}

// GetGenreFilters returns the genre filter buttons HTML
func (h *AlbumHTMLHandler) GetGenreFilters(c *gin.Context) {
	selectedGenresParam := c.Query("genres")
	selectedGenreIDs := make(map[uint]bool)

	if selectedGenresParam != "" {
		for _, idStr := range strings.Split(selectedGenresParam, ",") {
			if id, err := strconv.ParseUint(idStr, 10, 32); err == nil {
				selectedGenreIDs[uint(id)] = true
			}
		}
	}

	var genres []models.Genre
	result := h.DB.Order("name ASC").Find(&genres)
	if result.Error != nil {
		c.String(http.StatusInternalServerError, "Error loading genres")
		return
	}

	// Build genre data with active states and query strings
	type GenreData struct {
		ID          uint
		Name        string
		Active      bool
		QueryString string
	}

	genreDataList := []GenreData{}
	for _, genre := range genres {
		// Calculate new query string for this genre
		newSelectedIDs := make(map[uint]bool)
		for id := range selectedGenreIDs {
			newSelectedIDs[id] = true
		}

		// Toggle this genre
		if selectedGenreIDs[genre.ID] {
			delete(newSelectedIDs, genre.ID)
		} else {
			newSelectedIDs[genre.ID] = true
		}

		// Build query string
		queryParts := []string{}
		for id := range newSelectedIDs {
			queryParts = append(queryParts, strconv.FormatUint(uint64(id), 10))
		}
		queryString := ""
		if len(queryParts) > 0 {
			queryString = "genres=" + strings.Join(queryParts, ",")
		}

		genreDataList = append(genreDataList, GenreData{
			ID:          genre.ID,
			Name:        genre.Name,
			Active:      selectedGenreIDs[genre.ID],
			QueryString: queryString,
		})
	}

	data := gin.H{
		"Genres": genreDataList,
	}

	c.Header("Content-Type", "text/html; charset=utf-8")
	if err := h.Templates.ExecuteTemplate(c.Writer, "genre_filters.html", data); err != nil {
		c.String(http.StatusInternalServerError, "Error rendering template: "+err.Error())
	}
}
