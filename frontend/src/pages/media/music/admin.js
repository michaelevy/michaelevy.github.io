const API_URL = '/api/albums';
let albums = [];
let credentials = null;

// Check authentication and fetch albums
async function init() {
    try {
        // Try fetching albums (public endpoint) first to check if API is available
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('API not available');
        
        albums = await response.json();
        
        // Show admin section (user will be prompted for auth when they try to edit/delete)
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'block';
        
        renderAlbums();
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

// Render albums list
function renderAlbums() {
    const containerEl = document.getElementById('albums-container');
    if (!albums.length) {
        containerEl.innerHTML = '<p>No albums found.</p>';
        return;
    }
    
    containerEl.innerHTML = albums.map(album => {
        const links = album.links?.map(l => l.type).join(', ') || '';
        
        return `
            <div class="album-item">
                <div class="album-info">
                    <h4>${album.name}</h4>
                    <div class="album-meta">
                        ${album.artist}${album.year ? ` • ${album.year}` : ''}${links ? ` • Links: ${links}` : ''}
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
    
    const data = {
        name: document.getElementById('name').value,
        artist: document.getElementById('artist').value,
        year: document.getElementById('year').value,
        image: document.getElementById('image').value,
        text: document.getElementById('text').value,
        links: links
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

// Initialize
init();
