package contentful

import (
	"log"
	"strconv"
	"sync"
	"time"

	contentful "github.com/contentful-labs/contentful-go"
)

// Asset represents a Contentful asset (e.g., images)
type Asset struct {
	URL   string `json:"url"`
	Title string `json:"title"`
}

// Review represents a book review from Contentful
type Review struct {
	Slug     string      `json:"slug"`
	Title    string      `json:"title"`
	Cover    Asset       `json:"cover"`
	Rating   int         `json:"rating"`
	Summary  string      `json:"summary"`
	Text     interface{} `json:"text"`     // Rich text content
	LongText interface{} `json:"longText"` // Rich text content (optional, for long reviews)
	Quote    string      `json:"quote"`
	Alt      string      `json:"alt"`
	Date     string      `json:"date"`
	Type     string      `json:"type"` // "long" or "short"
}

// ContentfulCache holds cached reviews data
type ContentfulCache struct {
	Reviews       []Review
	ReviewsBySlug map[string]Review
	LastFetched   time.Time
	mutex         sync.RWMutex
}

// Client is the Contentful client with caching
type Client struct {
	client   *contentful.Contentful
	spaceID  string
	cache    *ContentfulCache
	cacheTTL time.Duration
}

// NewClient creates a new Contentful client with caching
func NewClient(spaceID, accessToken string) *Client {
	client := contentful.NewCDA(accessToken)

	return &Client{
		client:  client,
		spaceID: spaceID,
		cache: &ContentfulCache{
			ReviewsBySlug: make(map[string]Review),
		},
		cacheTTL: 30 * time.Minute, // 30-minute cache TTL
	}
}

// isCacheValid checks if the cache is still valid
func (c *Client) isCacheValid() bool {
	c.cache.mutex.RLock()
	defer c.cache.mutex.RUnlock()
	
	if c.cache.LastFetched.IsZero() {
		return false
	}
	
	return time.Since(c.cache.LastFetched) < c.cacheTTL
}

// GetReviews fetches all reviews from Contentful (with caching)
func (c *Client) GetReviews() ([]Review, error) {
	// Return cached data if valid
	if c.isCacheValid() {
		c.cache.mutex.RLock()
		defer c.cache.mutex.RUnlock()
		return c.cache.Reviews, nil
	}

	// Fetch fresh data
	reviews, err := c.fetchReviews()
	if err != nil {
		// If fetch fails, return stale cache if available
		c.cache.mutex.RLock()
		defer c.cache.mutex.RUnlock()
		if len(c.cache.Reviews) > 0 {
			log.Printf("Warning: Contentful fetch failed, returning stale cache: %v", err)
			return c.cache.Reviews, nil
		}
		return nil, err
	}

	// Update cache
	c.cache.mutex.Lock()
	c.cache.Reviews = reviews
	c.cache.ReviewsBySlug = make(map[string]Review)
	for _, review := range reviews {
		c.cache.ReviewsBySlug[review.Slug] = review
	}
	c.cache.LastFetched = time.Now()
	c.cache.mutex.Unlock()

	return reviews, nil
}

// GetReviewBySlug fetches a single review by slug (with caching)
func (c *Client) GetReviewBySlug(slug string) (*Review, error) {
	// Check if cache is valid and contains the review
	if c.isCacheValid() {
		c.cache.mutex.RLock()
		if review, ok := c.cache.ReviewsBySlug[slug]; ok {
			c.cache.mutex.RUnlock()
			return &review, nil
		}
		c.cache.mutex.RUnlock()
	}

	// Refresh cache if needed
	_, err := c.GetReviews()
	if err != nil {
		return nil, err
	}

	// Try to get from cache again
	c.cache.mutex.RLock()
	defer c.cache.mutex.RUnlock()
	if review, ok := c.cache.ReviewsBySlug[slug]; ok {
		return &review, nil
	}

	return nil, nil // Review not found
}

// fetchReviews fetches all reviews from Contentful API
func (c *Client) fetchReviews() ([]Review, error) {
	var reviews []Review

	// Fetch "review" content type (long reviews)
	reviewCollection := c.client.Entries.List(c.spaceID)
	reviewCollection, err := reviewCollection.Next()
	if err != nil {
		return nil, err
	}

	reviewEntries := reviewCollection.ToEntry()
	for _, entry := range reviewEntries {
		// Filter by content type "review"
		if entry.Sys != nil && entry.Sys.ContentType != nil && entry.Sys.ContentType.Sys.ID == "review" {
			review := c.parseEntry(entry, "long")
			if review != nil {
				reviews = append(reviews, *review)
			}
		}
	}

	// Fetch "short" content type (short reviews)
	shortCollection := c.client.Entries.List(c.spaceID)
	shortCollection, err = shortCollection.Next()
	if err != nil {
		log.Printf("Warning: Failed to fetch shorts: %v", err)
		// Continue with just the long reviews
	} else {
		shortEntries := shortCollection.ToEntry()
		for _, entry := range shortEntries {
			// Filter by content type "short"
			if entry.Sys != nil && entry.Sys.ContentType != nil && entry.Sys.ContentType.Sys.ID == "short" {
				review := c.parseEntry(entry, "short")
				if review != nil {
					reviews = append(reviews, *review)
				}
			}
		}
	}

	return reviews, nil
}

// parseEntry parses a Contentful entry into a Review struct
func (c *Client) parseEntry(entry *contentful.Entry, reviewType string) *Review {
	fields := entry.Fields

	// Extract slug
	slug, ok := fields["slug"].(string)
	if !ok {
		return nil
	}

	review := &Review{
		Slug: slug,
		Type: reviewType,
	}

	// Extract title
	if title, ok := fields["title"].(string); ok {
		review.Title = title
	}

	// Extract rating (handle string, int, and float64)
	if ratingField, exists := fields["rating"]; exists {
		switch v := ratingField.(type) {
		case float64:
			review.Rating = int(v)
		case int:
			review.Rating = v
		case int64:
			review.Rating = int(v)
		case string:
			// Parse string to int
			if rating, err := strconv.Atoi(v); err == nil {
				review.Rating = rating
			} else {
				log.Printf("Warning: Failed to parse rating string for %s: %s", slug, v)
			}
		default:
			log.Printf("Warning: Unknown rating type for %s: %T = %v", slug, ratingField, ratingField)
		}
	}

	// Extract summary
	if summary, ok := fields["summary"].(string); ok {
		review.Summary = summary
	}

	// Extract quote
	if quote, ok := fields["quote"].(string); ok {
		review.Quote = quote
	}

	// Extract alt
	if alt, ok := fields["alt"].(string); ok {
		review.Alt = alt
	}

	// Extract date
	if date, ok := fields["date"].(string); ok {
		review.Date = date
	}

	// Extract rich text content
	if text, ok := fields["text"]; ok {
		review.Text = text
	}

	// Extract longText for full reviews
	if longText, ok := fields["longText"]; ok {
		review.LongText = longText
	}

	// Extract cover asset
	if coverField, ok := fields["cover"]; ok {
		if coverMap, ok := coverField.(map[string]interface{}); ok {
			if sys, ok := coverMap["sys"].(map[string]interface{}); ok {
				if assetID, ok := sys["id"].(string); ok {
					// Fetch the asset
					if asset := c.getAsset(assetID); asset != nil {
						review.Cover = *asset
					}
				}
			}
		}
	}

	return review
}

// getAsset fetches an asset by ID from Contentful
func (c *Client) getAsset(assetID string) *Asset {
	asset, err := c.client.Assets.Get(c.spaceID, assetID)
	if err != nil {
		log.Printf("Warning: Failed to fetch asset %s: %v", assetID, err)
		return nil
	}

	if asset.Fields == nil {
		return nil
	}

	result := &Asset{}

	// Extract title
	if asset.Fields.Title != "" {
		result.Title = asset.Fields.Title
	}

	// Extract file URL
	if asset.Fields.File != nil && asset.Fields.File.URL != "" {
		url := asset.Fields.File.URL
		// Contentful URLs are protocol-relative, add https:
		if len(url) > 0 && url[0:2] == "//" {
			result.URL = "https:" + url
		} else {
			result.URL = url
		}
	}

	return result
}
