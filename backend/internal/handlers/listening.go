package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ListeningHandler struct{}

// RockskyStatus represents an app.rocksky.actor.status record.
type RockskyStatus struct {
	Track *struct {
		Name          string `json:"name"`
		Artist        string `json:"artist"`
		Album         string `json:"album"`
		DurationMs    int    `json:"durationMs"`
		AlbumCoverURL string `json:"albumCoverUrl,omitempty"`
		RecordingMbid string `json:"recordingMbId,omitempty"`
	} `json:"track"`
	StartedAt string `json:"startedAt"`
	ExpiresAt string `json:"expiresAt,omitempty"`
	Type      string `json:"$type"`
}

// GetLastListened fetches the listening status from Rocksky via AT Protocol.
func (h *ListeningHandler) GetLastListened(c *gin.Context) {
	did := "did:plc:wfyk6ochxegynulld7gflsx5"
	collection := "app.rocksky.actor.status"

	// Construct the AT Protocol URL
	// Use selfhosted.social PDS endpoint
	url := fmt.Sprintf("https://selfhosted.social/xrpc/com.atproto.repo.getRecord?repo=%s&collection=%s&rkey=self", did, collection)

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
		URI   string        `json:"uri"`
		CID   string        `json:"cid"`
		Value RockskyStatus `json:"value"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&atProtoResponse); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse listening data"})
		return
	}

	// Return the listening data
	c.JSON(http.StatusOK, atProtoResponse.Value)
}
