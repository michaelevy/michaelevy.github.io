package main

import (
	"log"
	"os"
	"strings"
	"time"
	"website-backend/internal/contentful"
	"website-backend/internal/database"
	"website-backend/internal/handlers"
	"website-backend/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file if it exists (for local development)
	_ = godotenv.Load()

	// Get database URL from environment
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	// Initialize database
	db, err := database.Connect(dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto-migrate database schema
	if err := database.Migrate(db); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// Set Gin mode
	if os.Getenv("GIN_MODE") == "" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create router
	r := gin.Default()

	// Get allowed origins from environment
	allowedOriginsStr := os.Getenv("ALLOWED_ORIGINS")
	var allowedOrigins []string
	if allowedOriginsStr != "" {
		allowedOrigins = strings.Split(allowedOriginsStr, ",")
		// Trim whitespace from each origin
		for i := range allowedOrigins {
			allowedOrigins[i] = strings.TrimSpace(allowedOrigins[i])
		}
	} else {
		if os.Getenv("GIN_MODE") == "release" {
			log.Fatal("ALLOWED_ORIGINS must be set in production mode")
		}
		allowedOrigins = []string{"*"}
		log.Println("Warning: ALLOWED_ORIGINS not set, allowing all origins (development mode only)")
	}

	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	// Rate limiting middleware (100 requests per minute per IP)
	rateLimiter := middleware.NewRateLimiter(100, time.Minute)
	r.Use(rateLimiter.Middleware())

	// Stricter rate limiter for public write endpoints (5 requests per hour per IP)
	strictRateLimiter := middleware.NewRateLimiter(5, time.Hour)

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "healthy",
		})
	})

	// Initialize handlers
	h := handlers.NewHandler(db)
	bookHandler := &handlers.BookHandler{DB: db}
	albumHandler := &handlers.AlbumHandler{DB: db}
	genreHandler := &handlers.GenreHandler{DB: db}
	imageHandler := &handlers.ImageHandler{DB: db}
	listeningHandler := &handlers.ListeningHandler{}
	
	// Initialize Contentful client
	contentfulSpaceID := os.Getenv("CONTENTFUL_SPACE_ID")
	contentfulAccessToken := os.Getenv("CONTENTFUL_ACCESS_TOKEN")
	var reviewHandler *handlers.ReviewHandler
	if contentfulSpaceID != "" && contentfulAccessToken != "" {
		contentfulClient := contentful.NewClient(contentfulSpaceID, contentfulAccessToken)
		reviewHandler = &handlers.ReviewHandler{
			DB:               db,
			ContentfulClient: contentfulClient,
		}
	} else {
		log.Println("Warning: CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN not set, review endpoints will not be available")
	}

	// API routes
	api := r.Group("/api")
	{
		// Note routes
		api.GET("/notes/latest", h.GetLatestNote)
		api.POST("/notes", strictRateLimiter.Middleware(), h.CreateNote) // Strict rate limit: 5/hour
		api.GET("/notes", h.GetAllNotes)
		
		// Example resource routes
		api.GET("/items", h.GetItems)
		api.GET("/items/:id", h.GetItem)
		api.POST("/items", h.CreateItem)
		api.PUT("/items/:id", h.UpdateItem)
		api.DELETE("/items/:id", h.DeleteItem)

		// Public book routes (anyone can view)
		api.GET("/books", bookHandler.GetBooks)
		api.GET("/books/:id", bookHandler.GetBook)
		api.GET("/books/last-read", bookHandler.GetLastRead)
		api.GET("/authors", bookHandler.GetAuthors)
		api.GET("/series", bookHandler.GetSeries)
		api.GET("/top-series", bookHandler.GetTopSeries)
		api.GET("/recommended-books", bookHandler.GetRecommendedBooks)

		// Protected book routes (admin only)
		adminAuth := middleware.BasicAuth()
		api.POST("/books", adminAuth, bookHandler.CreateBook)
		api.PUT("/books/:id", adminAuth, bookHandler.UpdateBook)
		api.DELETE("/books/:id", adminAuth, bookHandler.DeleteBook)
		api.POST("/books/:id/read-log", adminAuth, bookHandler.LogRead)
		api.POST("/books/import", adminAuth, bookHandler.ImportCSV)

		// Public album routes (anyone can view)
		api.GET("/albums", albumHandler.GetAlbums)
		api.GET("/albums/:id", albumHandler.GetAlbum)

		// Listening history routes (public)
		api.GET("/listening/last", listeningHandler.GetLastListened)

		// Protected album routes (admin only)
		api.POST("/albums", adminAuth, albumHandler.CreateAlbum)
		api.PUT("/albums/:id", adminAuth, albumHandler.UpdateAlbum)
		api.DELETE("/albums/:id", adminAuth, albumHandler.DeleteAlbum)

		// Public genre routes (anyone can view)
		api.GET("/genres", genreHandler.GetGenres)
		api.GET("/genres/:id", genreHandler.GetGenre)

		// Protected genre routes (admin only)
		api.POST("/genres", adminAuth, genreHandler.CreateGenre)
		api.PUT("/genres/:id", adminAuth, genreHandler.UpdateGenre)
		api.DELETE("/genres/:id", adminAuth, genreHandler.DeleteGenre)

		// Image management routes (admin only)
		api.POST("/images/upload", adminAuth, imageHandler.UploadImage)
		api.GET("/images", adminAuth, imageHandler.ListImages)
		api.DELETE("/images/:filename", adminAuth, imageHandler.DeleteImage)
		
		// Review routes (public, read-only)
		if reviewHandler != nil {
			api.GET("/reviews", reviewHandler.GetReviews)
			api.GET("/reviews/:slug", reviewHandler.GetReview)
			api.GET("/series/:id/reviews", reviewHandler.GetSeriesReviews)
			api.GET("/reviews/mappings", reviewHandler.GetMappings)
			
			// Protected mapping routes (admin only)
			api.POST("/reviews/mappings", adminAuth, reviewHandler.CreateMapping)
			api.PUT("/reviews/mappings/:id", adminAuth, reviewHandler.UpdateMapping)
			api.DELETE("/reviews/mappings/:id", adminAuth, reviewHandler.DeleteMapping)
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
