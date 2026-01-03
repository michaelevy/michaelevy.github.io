package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ImageHandler struct {
	DB *gorm.DB
}

// UploadImage uploads an image to the resources folder (protected endpoint)
func (h *ImageHandler) UploadImage(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Validate file type
	ext := strings.ToLower(filepath.Ext(file.Filename))
	allowedExts := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
		".webp": true,
		".svg":  true,
	}

	if !allowedExts[ext] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only image files are allowed (jpg, png, gif, webp, svg)"})
		return
	}

	// Get the image name from form (or use original filename without extension)
	imageName := c.PostForm("name")
	if imageName == "" {
		imageName = strings.TrimSuffix(file.Filename, ext)
	}

	// Sanitize the image name (remove special characters, spaces, etc.)
	imageName = strings.ToLower(imageName)
	imageName = strings.ReplaceAll(imageName, " ", "-")
	imageName = strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' || r == '_' {
			return r
		}
		return -1
	}, imageName)

	// Check for file size (limit to 10MB)
	if file.Size > 10*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File size must be less than 10MB"})
		return
	}

	// Create the upload directory if it doesn't exist
	uploadDir := "/app/uploads/resources"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
		return
	}

	// Save file with original extension
	destPath := filepath.Join(uploadDir, imageName+ext)

	// Check if file already exists
	if _, err := os.Stat(destPath); err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "File with this name already exists"})
		return
	}

	// Open source file
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open uploaded file"})
		return
	}
	defer src.Close()

	// Create destination file
	dst, err := os.Create(destPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}
	defer dst.Close()

	// Copy file
	if _, err = io.Copy(dst, src); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Image uploaded successfully",
		"filename":  imageName + ext,
		"path":      fmt.Sprintf("/public/resources/%s%s", imageName, ext),
		"size":      file.Size,
	})
}

// ListImages lists all available images (protected endpoint)
func (h *ImageHandler) ListImages(c *gin.Context) {
	uploadDir := "/app/uploads/resources"

	// Check if directory exists
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		c.JSON(http.StatusOK, []gin.H{})
		return
	}

	files, err := os.ReadDir(uploadDir)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read directory"})
		return
	}

	var images []gin.H
	allowedExts := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
		".webp": true,
		".svg":  true,
	}

	for _, file := range files {
		if !file.IsDir() {
			ext := strings.ToLower(filepath.Ext(file.Name()))
			if allowedExts[ext] {
				info, err := file.Info()
				if err != nil {
					continue
				}

				images = append(images, gin.H{
					"filename": file.Name(),
					"name":     strings.TrimSuffix(file.Name(), ext),
					"ext":      ext,
					"size":     info.Size(),
					"path":     fmt.Sprintf("/public/resources/%s", file.Name()),
					"modified": info.ModTime(),
				})
			}
		}
	}

	c.JSON(http.StatusOK, images)
}

// DeleteImage deletes an image (protected endpoint)
func (h *ImageHandler) DeleteImage(c *gin.Context) {
	filename := c.Param("filename")
	
	// Validate filename (prevent path traversal)
	if strings.Contains(filename, "..") || strings.Contains(filename, "/") || strings.Contains(filename, "\\") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid filename"})
		return
	}

	uploadDir := "/app/uploads/resources"
	filePath := filepath.Join(uploadDir, filename)

	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	// Delete the file
	if err := os.Remove(filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Image deleted successfully"})
}
