package main

import (
	"log"
	"os"
	"strings"
	"time"
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
		// Fallback to wildcard for development (not recommended for production)
		allowedOrigins = []string{"*"}
		log.Println("Warning: ALLOWED_ORIGINS not set, allowing all origins")
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

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "healthy",
		})
	})

	// Initialize handlers
	h := handlers.NewHandler(db)
	bookHandler := &handlers.BookHandler{DB: db}

	// API routes
	api := r.Group("/api")
	{
		// Note routes
		api.GET("/notes/latest", h.GetLatestNote)
		api.POST("/notes", h.CreateNote)
		api.GET("/notes", h.GetAllNotes) // Optional: view all notes history
		
		// Example resource routes
		api.GET("/items", h.GetItems)
		api.GET("/items/:id", h.GetItem)
		api.POST("/items", h.CreateItem)
		api.PUT("/items/:id", h.UpdateItem)
		api.DELETE("/items/:id", h.DeleteItem)

		// Public book routes (anyone can view)
		api.GET("/books", bookHandler.GetBooks)
		api.GET("/books/:id", bookHandler.GetBook)
		api.GET("/authors", bookHandler.GetAuthors)
		api.GET("/series", bookHandler.GetSeries)
		api.GET("/top-series", bookHandler.GetTopSeries)
		api.GET("/recommended-books", bookHandler.GetRecommendedBooks)

		// Protected book routes (admin only)
		adminAuth := middleware.BasicAuth()
		api.POST("/books", adminAuth, bookHandler.CreateBook)
		api.PUT("/books/:id", adminAuth, bookHandler.UpdateBook)
		api.DELETE("/books/:id", adminAuth, bookHandler.DeleteBook)
		api.POST("/books/import", adminAuth, bookHandler.ImportCSV)
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
