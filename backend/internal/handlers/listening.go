package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ListeningHandler struct{}

// TealStatus represents the structure of a teal.fm status record
type TealStatus struct {
	Item struct {
		Artists []struct {
			ArtistMbid string `json:"artistMbid"`
			ArtistName string `json:"artistName"`
		} `json:"artists"`
		Duration           int    `json:"duration"`
		TrackName          string `json:"trackName"`
		PlayedTime         string `json:"playedTime"`
		ReleaseMbid        string `json:"releaseMbid"`
		ReleaseName        string `json:"releaseName"`
		RecordingMbid      string `json:"recordingMbId"`
		SubmissionClient   string `json:"submissionClientAgent"`
	} `json:"item"`
	Time   string `json:"time"`
	Type   string `json:"$type"`
	Expiry string `json:"expiry"`
}

// GetLastListened fetches the last listened track from teal.fm via AT Protocol
func (h *ListeningHandler) GetLastListened(c *gin.Context) {
	did := "did:plc:wfyk6ochxegynulld7gflsx5"
	collection := "fm.teal.alpha.actor.status"

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
		URI   string      `json:"uri"`
		CID   string      `json:"cid"`
		Value TealStatus  `json:"value"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&atProtoResponse); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse listening data"})
		return
	}

	// Return the listening data
	c.JSON(http.StatusOK, atProtoResponse.Value)
}
