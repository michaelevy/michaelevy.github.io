package middleware

import (
	"crypto/subtle"
	"os"

	"github.com/gin-gonic/gin"
)

// BasicAuth middleware checks HTTP Basic Authentication
func BasicAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		username := os.Getenv("ADMIN_USERNAME")
		password := os.Getenv("ADMIN_PASSWORD")

		// If credentials are not set, deny access
		if username == "" || password == "" {
			c.Header("WWW-Authenticate", `Basic realm="Admin Area"`)
			c.AbortWithStatus(401)
			return
		}

		// Get credentials from request
		user, pass, ok := c.Request.BasicAuth()

		// Use constant-time comparison to prevent timing attacks
		if !ok || 
		   subtle.ConstantTimeCompare([]byte(user), []byte(username)) != 1 ||
		   subtle.ConstantTimeCompare([]byte(pass), []byte(password)) != 1 {
			c.Header("WWW-Authenticate", `Basic realm="Admin Area"`)
			c.AbortWithStatus(401)
			return
		}

		c.Next()
	}
}
