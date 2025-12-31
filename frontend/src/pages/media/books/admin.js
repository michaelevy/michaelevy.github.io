const API_URL = '/api/books';
let books = [];
let credentials = null;

// Check authentication and fetch books
async function init() {
    try {
        // Try fetching books (public endpoint) first to check if API is available
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('API not available');
        
        books = await response.json();
        
        // Show admin section (user will be prompted for auth when they try to edit/delete)
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'block';
        
        renderBooks();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error').textContent = 'Failed to load books.';
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

// Render books list
function renderBooks() {
    const listEl = document.getElementById('books-list');
    if (!books.length) {
        listEl.innerHTML = '<p>No books found.</p>';
        return;
    }
    
    listEl.innerHTML = books.map(book => {
        const authors = book.authors?.map(a => a.name).join(', ') || 'Unknown';
        const series = book.series?.name || '';
        const rating = book.rating ? (book.rating - 5).toFixed(1) : '';
        
        return `
            <div class="book-item">
                <div class="book-info">
                    <h4>${book.title}</h4>
                    <div class="book-meta">
                        ${authors}${series ? ` • ${series}` : ''}${rating ? ` • ${rating}★` : ''}
                    </div>
                </div>
                <div class="book-actions">
                    <button class="btn btn-secondary" onclick="editBook(${book.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteBook(${book.id})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Show add book form
document.getElementById('add-book-btn').addEventListener('click', () => {
    document.getElementById('form-title').textContent = 'Add Book';
    document.getElementById('book-edit-form').reset();
    document.getElementById('book-id').value = '';
    document.getElementById('book-form').style.display = 'block';
});

// Close modal
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('book-form').style.display = 'none';
});

document.getElementById('cancel-btn').addEventListener('click', () => {
    document.getElementById('book-form').style.display = 'none';
});

// Edit book
window.editBook = function(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;
    
    // Convert read_logs to comma-separated date strings
    const datesFinished = book.read_logs?.map(log => {
        const date = new Date(log.date_finished);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    }).join(', ') || '';
    
    document.getElementById('form-title').textContent = 'Edit Book';
    document.getElementById('book-id').value = book.id;
    document.getElementById('title').value = book.title || '';
    document.getElementById('authors').value = book.authors?.map(a => a.name).join(', ') || '';
    document.getElementById('series').value = book.series?.name || '';
    document.getElementById('owned').checked = book.owned || false;
    document.getElementById('rating').value = book.rating || '';
    document.getElementById('date-finished').value = datesFinished;
    document.getElementById('notes').value = book.notes || '';
    document.getElementById('read-soon').checked = book.read_soon || false;
    
    document.getElementById('book-form').style.display = 'block';
};

// Delete book
window.deleteBook = async function(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
        const response = await authFetch(`${API_URL}/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        books = books.filter(b => b.id !== id);
        renderBooks();
        alert('Book deleted successfully');
    } catch (error) {
        alert('Failed to delete book: ' + error.message);
    }
};

// Submit form
document.getElementById('book-edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('book-id').value;
    const authorNames = document.getElementById('authors').value
        .split(',')
        .map(a => a.trim())
        .filter(a => a);
    
    // Parse dates_finished from comma-separated string
    const datesFinishedStr = document.getElementById('date-finished').value;
    const datesFinished = datesFinishedStr
        ? datesFinishedStr.split(',').map(d => d.trim()).filter(d => d)
        : [];
    
    const data = {
        title: document.getElementById('title').value,
        author_names: authorNames,
        series_name: document.getElementById('series').value,
        owned: document.getElementById('owned').checked,
        rating: parseFloat(document.getElementById('rating').value) || 0,
        dates_finished: datesFinished,
        notes: document.getElementById('notes').value,
        read_soon: document.getElementById('read-soon').checked
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
        
        const savedBook = await response.json();
        
        if (id) {
            const index = books.findIndex(b => b.id == id);
            books[index] = savedBook;
        } else {
            books.push(savedBook);
        }
        
        renderBooks();
        document.getElementById('book-form').style.display = 'none';
        alert('Book saved successfully');
    } catch (error) {
        alert('Failed to save book: ' + error.message);
    }
});

// Show import modal
document.getElementById('import-csv-btn').addEventListener('click', () => {
    document.getElementById('import-form').reset();
    document.getElementById('import-result').style.display = 'none';
    document.getElementById('import-progress').style.display = 'none';
    document.getElementById('import-modal').style.display = 'block';
});

// Close import modal
document.querySelector('.import-close').addEventListener('click', () => {
    document.getElementById('import-modal').style.display = 'none';
});

document.querySelector('.import-cancel-btn').addEventListener('click', () => {
    document.getElementById('import-modal').style.display = 'none';
});

// Handle CSV import
document.getElementById('import-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('csv-file');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a CSV file');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const progressEl = document.getElementById('import-progress');
    const resultEl = document.getElementById('import-result');
    
    progressEl.style.display = 'block';
    resultEl.style.display = 'none';
    
    try {
        if (!credentials) {
            const username = prompt('Enter admin username:');
            const password = prompt('Enter admin password:');
            if (!username || !password) {
                throw new Error('Authentication cancelled');
            }
            credentials = btoa(`${username}:${password}`);
        }
        
        const response = await fetch(`${API_URL}/import`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`
            },
            body: formData
        });
        
        if (response.status === 401) {
            credentials = null;
            throw new Error('Authentication failed');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        progressEl.style.display = 'none';
        resultEl.style.display = 'block';
        resultEl.className = 'success';
        resultEl.innerHTML = `
            <strong>Import Complete!</strong><br>
            Imported: ${result.imported} books<br>
            Skipped: ${result.skipped} rows<br>
            ${result.errors && result.errors.length > 0 ? `<br><strong>Errors:</strong><br>${result.errors.join('<br>')}` : ''}
        `;
        
        // Refresh the book list
        const booksResponse = await fetch(API_URL);
        books = await booksResponse.json();
        renderBooks();
        
    } catch (error) {
        progressEl.style.display = 'none';
        resultEl.style.display = 'block';
        resultEl.className = 'error';
        resultEl.textContent = 'Import failed: ' + error.message;
    }
});

// Initialize
init();
