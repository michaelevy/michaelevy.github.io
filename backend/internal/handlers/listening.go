package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ListeningHandler struct{}

// RockskyScrobble represents a completed listen in app.rocksky.scrobble.
type RockskyScrobble struct {
	Title     string `json:"title"`
	Artist    string `json:"artist"`
	Album     string `json:"album"`
	CreatedAt string `json:"createdAt"`
}

// GetLastListened fetches the latest Rocksky scrobble via AT Protocol.
func (h *ListeningHandler) GetLastListened(c *gin.Context) {
	did := "did:plc:wfyk6ochxegynulld7gflsx5"
	collection := "app.rocksky.scrobble"

	// Construct the AT Protocol URL
	// Use selfhosted.social PDS endpoint
	// Scrobble record keys are chronological; descending order gives the latest listen.
	url := fmt.Sprintf("https://selfhosted.social/xrpc/com.atproto.repo.listRecords?repo=%s&collection=%s&limit=1&reverse=false", did, collection)

	// Make HTTP request
	resp, err := http.Get(url)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch listening data"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("AT Protocol returned status %d", resp.StatusCode)})
		return
	}

	// Parse the response
	var atProtoResponse struct {
		Records []struct {
			Value RockskyScrobble `json:"value"`
		} `json:"records"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&atProtoResponse); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse listening data"})
		return
	}

	if len(atProtoResponse.Records) == 0 {
		c.JSON(http.StatusOK, gin.H{"track": nil})
		return
	}

	// Keep the display response consistent while using permanent listening history.
	scrobble := atProtoResponse.Records[0].Value
	c.JSON(http.StatusOK, gin.H{
		"track": gin.H{
			"name":   scrobble.Title,
			"artist": scrobble.Artist,
			"album":  scrobble.Album,
		},
		"startedAt": scrobble.CreatedAt,
	})
}
