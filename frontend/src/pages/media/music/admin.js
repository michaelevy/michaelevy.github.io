const API_URL = '/api/albums';
const GENRE_API_URL = '/api/genres';
const IMAGE_API_URL = '/api/images';
let albums = [];
let genres = [];
let credentials = null;

// Check authentication and fetch albums
async function init() {
    try {
        // Try fetching albums (public endpoint) first to check if API is available
        const albumResponse = await fetch(API_URL);
        if (!albumResponse.ok) throw new Error('API not available');
        
        albums = await albumResponse.json();
        
        // Fetch genres
        const genreResponse = await fetch(GENRE_API_URL);
        if (genreResponse.ok) {
            genres = await genreResponse.json();
        }
        
        // Show admin section (user will be prompted for auth when they try to edit/delete)
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'block';
        
        renderAlbums();
        renderGenres();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error').textContent = 'Failed to load albums.';
        document.getElementById('error').style.display = 'block';
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
    
    options.headers = {
        ...options.headers,
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
    };
    
    const response = await fetch(url, options);
    
    if (response.status === 401) {
        credentials = null; // Reset credentials
        throw new Error('Authentication failed');
    }
    
    return response;
}

async function authFetchMultipart(url, formData) {
    if (!credentials) {
        const username = prompt('Enter admin username:');
        const password = prompt('Enter admin password:');
        if (!username || !password) {
            throw new Error('Authentication cancelled');
        }
        credentials = btoa(`${username}:${password}`);
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${credentials}` },
        body: formData
    });

    if (response.status === 401) {
        credentials = null;
        throw new Error('Authentication failed');
    }

    return response;
}

// Load available images into datalist
async function loadImageList() {
    try {
        const response = await authFetch(IMAGE_API_URL);
        if (!response.ok) return;
        const images = await response.json();
        const datalist = document.getElementById('image-list');
        datalist.innerHTML = (images || []).map(img => `<option value="${img.filename}">`).join('');
    } catch (e) {
    }
}

// Show image preview
function showImagePreview(filename) {
    const preview = document.getElementById('image-preview');
    if (!filename) {
        preview.innerHTML = '';
        return;
    }
    preview.innerHTML = `<img src="/public/resources/${filename}" alt="Preview" />`;
}

// Render albums list
function renderAlbums() {
    const containerEl = document.getElementById('albums-container');
    if (!albums.length) {
        containerEl.innerHTML = '<p>No albums found.</p>';
        return;
    }
    
    containerEl.innerHTML = albums.map(album => {
        const links = album.links?.map(l => l.type).join(', ') || '';
        const genreNames = album.genres?.map(g => g.name).join(', ') || '';
        
        return `
            <div class="album-item">
                <div class="album-info">
                    <h4>${album.name}</h4>
                    <div class="album-meta">
                        ${album.artist}${album.year ? ` • ${album.year}` : ''}${genreNames ? ` • Genres: ${genreNames}` : ''}${links ? ` • Links: ${links}` : ''}
                    </div>
                </div>
                <div class="album-actions">
                    <button class="btn btn-secondary" onclick="editAlbum(${album.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteAlbum(${album.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Render genres list
function renderGenres() {
    const containerEl = document.getElementById('genres-container');
    if (!genres.length) {
        containerEl.innerHTML = '<p>No genres found.</p>';
        return;
    }
    
    containerEl.innerHTML = genres.map(genre => {
        return `
            <div class="genre-item">
                <div class="genre-info">
                    <span>${genre.name}</span>
                </div>
                <div class="genre-actions">
                    <button class="btn btn-secondary" onclick="editGenre(${genre.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteGenre(${genre.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Render genre checkboxes in form
function renderGenreCheckboxes(selectedGenreIds = []) {
    const container = document.getElementById('genres-checkboxes');
    container.innerHTML = '';
    
    if (genres.length === 0) {
        container.innerHTML = '<p style="color: #666; font-size: 0.9rem;">No genres available. Create some genres first.</p>';
        return;
    }
    
    genres.forEach(genre => {
        const isChecked = selectedGenreIds.includes(genre.id);
        const checkbox = document.createElement('label');
        checkbox.className = 'genre-checkbox';
        checkbox.innerHTML = `
            <input type="checkbox" name="genre" value="${genre.id}" ${isChecked ? 'checked' : ''}>
            <span>${genre.name}</span>
        `;
        container.appendChild(checkbox);
    });
}

// Render link inputs in form
function renderLinkInputs(links = []) {
    const container = document.getElementById('links-container');
    container.innerHTML = '';
    
    links.forEach((link, index) => {
        addLinkInput(link.type, link.link, index);
    });
    
    // Add one empty link input if none exist
    if (links.length === 0) {
        addLinkInput('', '', 0);
    }
}

// Add a single link input row
function addLinkInput(type = '', link = '', index = null) {
    const container = document.getElementById('links-container');
    const linkItem = document.createElement('div');
    linkItem.className = 'link-item';
    linkItem.dataset.index = index !== null ? index : container.children.length;
    
    linkItem.innerHTML = `
        <input type="text" class="link-type" placeholder="Type (e.g., bandcamp, spotify)" value="${type}" />
        <input type="text" class="link-url" placeholder="URL" value="${link}" />
        <button type="button" class="btn btn-danger remove-link-btn">Remove</button>
    `;
    
    container.appendChild(linkItem);
    
    // Add remove handler
    linkItem.querySelector('.remove-link-btn').addEventListener('click', () => {
        linkItem.remove();
    });
}

// Show add album form
document.getElementById('add-album-btn').addEventListener('click', () => {
    document.getElementById('form-title').textContent = 'Add Album';
    document.getElementById('album-edit-form').reset();
    document.getElementById('album-id').value = '';
    renderLinkInputs([]);
    renderGenreCheckboxes([]);
    document.getElementById('album-form').style.display = 'block';
});

// Add link button handler
document.getElementById('add-link-btn').addEventListener('click', () => {
    addLinkInput();
});

// Close modal
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('album-form').style.display = 'none';
});

document.querySelector('.cancel-btn').addEventListener('click', () => {
    document.getElementById('album-form').style.display = 'none';
});

// Upload image on file select
document.getElementById('image-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById('upload-status');
    statusEl.textContent = 'Uploading...';

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await authFetchMultipart(`${IMAGE_API_URL}/upload`, formData);
        const text = await response.text();
        let result;
        try { result = JSON.parse(text); } catch { throw new Error('Server returned non-JSON response (check file size < 10MB)'); }

        if (!response.ok) {
            throw new Error(result.error || 'Upload failed');
        }

        document.getElementById('image').value = result.filename;
        showImagePreview(result.filename);
        statusEl.textContent = 'Uploaded!';
        setTimeout(() => { statusEl.textContent = ''; }, 3000);

        // Refresh datalist
        loadImageList();
    } catch (error) {
        statusEl.textContent = 'Failed: ' + error.message;
    }

    // Reset file input so same file can be re-selected
    e.target.value = '';
});

// Refresh images button
document.getElementById('refresh-images-btn').addEventListener('click', () => {
    loadImageList();
});

// Preview on image field change
document.getElementById('image').addEventListener('input', (e) => {
    showImagePreview(e.target.value);
});

// Edit album
window.editAlbum = function(id) {
    const album = albums.find(a => a.id === id);
    if (!album) return;
    
    document.getElementById('form-title').textContent = 'Edit Album';
    document.getElementById('album-id').value = album.id;
    document.getElementById('name').value = album.name || '';
    document.getElementById('artist').value = album.artist || '';
    document.getElementById('year').value = album.year || '';
    document.getElementById('image').value = album.image || '';
    document.getElementById('text').value = album.text || '';
    
    renderLinkInputs(album.links || []);
    
    const selectedGenreIds = album.genres?.map(g => g.id) || [];
    renderGenreCheckboxes(selectedGenreIds);
    
    document.getElementById('album-form').style.display = 'block';
};

// Delete album
window.deleteAlbum = async function(id) {
    if (!confirm('Are you sure you want to delete this album?')) return;
    
    try {
        const response = await authFetch(`${API_URL}/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        albums = albums.filter(a => a.id !== id);
        renderAlbums();
        alert('Album deleted successfully');
    } catch (error) {
        alert('Failed to delete album: ' + error.message);
    }
};

// Submit form
document.getElementById('album-edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('album-id').value;
    
    // Collect links from form
    const linkItems = document.querySelectorAll('.link-item');
    const links = [];
    linkItems.forEach(item => {
        const type = item.querySelector('.link-type').value.trim();
        const link = item.querySelector('.link-url').value.trim();
        if (type && link) {
            links.push({ type, link });
        }
    });
    
    // Collect selected genre IDs
    const genreCheckboxes = document.querySelectorAll('input[name="genre"]:checked');
    const genre_ids = Array.from(genreCheckboxes).map(cb => parseInt(cb.value));
    
    const data = {
        name: document.getElementById('name').value,
        artist: document.getElementById('artist').value,
        year: document.getElementById('year').value,
        image: document.getElementById('image').value,
        text: document.getElementById('text').value,
        links: links,
        genre_ids: genre_ids
    };
    
    try {
        const url = id ? `${API_URL}/${id}` : API_URL;
        const method = id ? 'PUT' : 'POST';
        
        const response = await authFetch(url, {
            method,
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const savedAlbum = await response.json();
        
        if (id) {
            const index = albums.findIndex(a => a.id == id);
            albums[index] = savedAlbum;
        } else {
            albums.push(savedAlbum);
        }
        
        renderAlbums();
        document.getElementById('album-form').style.display = 'none';
        alert('Album saved successfully');
    } catch (error) {
        alert('Failed to save album: ' + error.message);
    }
});

// Genre management functions
window.showAddGenreForm = function() {
    const name = prompt('Enter genre name:');
    if (!name || !name.trim()) return;
    
    createGenre(name.trim());
};

window.editGenre = function(id) {
    const genre = genres.find(g => g.id === id);
    if (!genre) return;
    
    const newName = prompt('Edit genre name:', genre.name);
    if (!newName || !newName.trim()) return;
    
    updateGenre(id, newName.trim());
};

window.deleteGenre = async function(id) {
    if (!confirm('Are you sure you want to delete this genre?')) return;
    
    try {
        const response = await authFetch(`${GENRE_API_URL}/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        genres = genres.filter(g => g.id !== id);
        renderGenres();
        alert('Genre deleted successfully');
    } catch (error) {
        alert('Failed to delete genre: ' + error.message);
    }
};

async function createGenre(name) {
    try {
        const response = await authFetch(GENRE_API_URL, {
            method: 'POST',
            body: JSON.stringify({ name })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newGenre = await response.json();
        genres.push(newGenre);
        genres.sort((a, b) => a.name.localeCompare(b.name));
        renderGenres();
        alert('Genre created successfully');
    } catch (error) {
        alert('Failed to create genre: ' + error.message);
    }
}

async function updateGenre(id, name) {
    try {
        const response = await authFetch(`${GENRE_API_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ name })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const updatedGenre = await response.json();
        const index = genres.findIndex(g => g.id === id);
        genres[index] = updatedGenre;
        genres.sort((a, b) => a.name.localeCompare(b.name));
        renderGenres();
        alert('Genre updated successfully');
    } catch (error) {
        alert('Failed to update genre: ' + error.message);
    }
}

// Initialize
init();
