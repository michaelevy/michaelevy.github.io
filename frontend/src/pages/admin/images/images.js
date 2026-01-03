const API_URL = '/api/images';
let images = [];
let credentials = null;
let filteredImages = [];

// Check authentication and fetch images
async function init() {
    try {
        // Show admin section
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'block';
        
        await loadImages();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Make authenticated request
async function authFetch(url, options = {}) {
    if (!credentials) {
        const username = prompt('Enter admin username:');
        const password = prompt('Enter admin password:');
        if (!username || !password) {
            throw new Error('Authentication cancelled');
        }
        credentials = btoa(`${username}:${password}`);
    }
    
    if (!options.headers) {
        options.headers = {};
    }
    
    options.headers['Authorization'] = `Basic ${credentials}`;
    
    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
        options.headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(url, options);
    
    if (response.status === 401) {
        credentials = null; // Reset credentials
        throw new Error('Authentication failed');
    }
    
    return response;
}

// Load images from API
async function loadImages() {
    try {
        const response = await authFetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        images = await response.json();
        filteredImages = [...images];
        renderImages();
    } catch (error) {
        console.error('Error loading images:', error);
        alert('Failed to load images: ' + error.message);
    }
}

// Render images grid
function renderImages() {
    const gridEl = document.getElementById('images-grid');
    
    if (filteredImages.length === 0) {
        gridEl.innerHTML = '<div class="empty-state">No images found. Upload your first image to get started!</div>';
        return;
    }
    
    gridEl.innerHTML = filteredImages.map(image => {
        const sizeKB = (image.size / 1024).toFixed(2);
        const date = new Date(image.modified).toLocaleDateString();
        
        return `
            <div class="image-card" data-filename="${image.filename}">
                <img src="${image.path}" alt="${image.filename}" class="image-preview" />
                <div class="image-info">
                    <div class="image-filename">${image.filename}</div>
                    <div class="image-meta">${sizeKB} KB • ${date}</div>
                    <div class="image-path">${image.path}</div>
                    <div class="image-actions">
                        <button class="btn btn-secondary" onclick="copyPath('${image.path}')">Copy Path</button>
                        <button class="btn btn-danger" onclick="deleteImage('${image.filename}')">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Filter images
function filterImages() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const extFilter = document.getElementById('filter-ext').value;
    
    filteredImages = images.filter(image => {
        const matchesSearch = image.filename.toLowerCase().includes(searchTerm);
        const matchesExt = !extFilter || image.ext === extFilter;
        return matchesSearch && matchesExt;
    });
    
    renderImages();
}

// Copy image path to clipboard
window.copyPath = function(path) {
    navigator.clipboard.writeText(path).then(() => {
        alert('Path copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy path');
    });
};

// Delete image
window.deleteImage = async function(filename) {
    if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;
    
    try {
        const response = await authFetch(`${API_URL}/${filename}`, { method: 'DELETE' });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        images = images.filter(img => img.filename !== filename);
        filterImages();
        alert('Image deleted successfully');
    } catch (error) {
        alert('Failed to delete image: ' + error.message);
    }
};

// Show upload modal
document.getElementById('upload-btn').addEventListener('click', () => {
    document.getElementById('upload-form').reset();
    document.getElementById('upload-preview').style.display = 'none';
    document.getElementById('upload-result').style.display = 'none';
    document.getElementById('upload-progress').style.display = 'none';
    document.getElementById('upload-modal').style.display = 'block';
});

// Close modal
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('upload-modal').style.display = 'none';
});

document.querySelector('.cancel-btn').addEventListener('click', () => {
    document.getElementById('upload-modal').style.display = 'none';
});

// Preview image on selection
document.getElementById('image-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('preview-image').src = e.target.result;
            document.getElementById('upload-preview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Handle upload form submission
document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('image-file');
    const nameInput = document.getElementById('image-name');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select an image');
        return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    if (nameInput.value.trim()) {
        formData.append('name', nameInput.value.trim());
    }
    
    const progressEl = document.getElementById('upload-progress');
    const resultEl = document.getElementById('upload-result');
    
    progressEl.style.display = 'block';
    resultEl.style.display = 'none';
    
    try {
        const response = await authFetch(API_URL + '/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        progressEl.style.display = 'none';
        resultEl.style.display = 'block';
        resultEl.className = 'success';
        resultEl.innerHTML = `
            <strong>Upload successful!</strong><br>
            Filename: ${result.filename}<br>
            Path: ${result.path}
        `;
        
        // Refresh the image list
        await loadImages();
        
        // Close modal after 2 seconds
        setTimeout(() => {
            document.getElementById('upload-modal').style.display = 'none';
        }, 2000);
        
    } catch (error) {
        progressEl.style.display = 'none';
        resultEl.style.display = 'block';
        resultEl.className = 'error';
        resultEl.textContent = 'Upload failed: ' + error.message;
    }
});

// Search and filter handlers
document.getElementById('search-input').addEventListener('input', filterImages);
document.getElementById('filter-ext').addEventListener('change', filterImages);

// Initialize
init();
