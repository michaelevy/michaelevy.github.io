// Books viewing functionality - fetches from API
const API_URL = '/api/books';
let allBooks = [];

const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const bookCount = document.getElementById('bookCount');
const tbody = document.getElementById('tableBody');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');

// Fetch books from API
async function fetchBooks() {
    try {
        loadingEl.style.display = 'block';
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allBooks = await response.json();
        loadingEl.style.display = 'none';
        updateDisplay();
    } catch (error) {
        console.error('Error fetching books:', error);
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = 'Failed to load books. Please try again later.';
    }
}

// Group books by series
function groupBooksBySeries() {
    const seriesMap = {};

    allBooks.forEach(book => {
        const seriesName = book.series?.name || book.title;
        const authorName = book.authors?.map(a => a.name).join(', ') || 'Unknown';

        if (!seriesMap[seriesName]) {
            seriesMap[seriesName] = {
                name: seriesName,
                author: authorName,
                books: [],
                isSeries: !!book.series
            };
        }

        seriesMap[seriesName].books.push({
            ...book,
            author: authorName,
            series: book.series?.name || '',
            read: book.read || false,
            owned: book.owned || false,
            rating: book.rating ? (book.rating - 5).toFixed(1) : '',
            date_finished: book.date_finished || '',
            read_soon: book.read_soon || false
        });
    });

    return Object.values(seriesMap);
}

// Parse date in DD/MM/YY format
function parseDate(dateStr) {
    if (!dateStr) return 0;

    const dates = dateStr.split(',');
    const lastDate = dates[dates.length - 1].trim();

    if (lastDate.includes('Before 2020')) return new Date('2019-12-31').getTime();

    const parts = lastDate.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        let year = parseInt(parts[2]);
        year = year < 100 ? (year < 50 ? 2000 + year : 1900 + year) : year;
        return new Date(year, month, day).getTime();
    }

    return 0;
}

// Calculate average rating for a series
function calculateAvgRating(seriesBooks) {
    const ratings = seriesBooks
        .map(b => parseFloat(b.rating))
        .filter(r => !isNaN(r) && r > 0);

    if (ratings.length === 0) return 0;
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
}

// Get latest date from series
function getLatestDate(seriesBooks) {
    const dates = seriesBooks
        .map(b => {
            const dateStr = b.date_finished;
            if (!dateStr) return null;

            const dateParts = dateStr.split(',');
            const lastDate = dateParts[dateParts.length - 1].trim();

            return { str: lastDate, val: parseDate(dateStr) };
        })
        .filter(d => d && d.val > 0);

    if (dates.length === 0) return '';
    dates.sort((a, b) => b.val - a.val);
    return dates[0].str;
}

// Render table
function renderTable(seriesGroups) {
    tbody.innerHTML = '';

    seriesGroups.forEach((series, seriesIdx) => {
        const avgRating = calculateAvgRating(series.books);
        const latestDate = getLatestDate(series.books);
        const bookCount = series.books.length;

        // Series row
        const seriesRow = document.createElement('tr');
        const isExpandable = series.isSeries && bookCount > 1;
        seriesRow.className = isExpandable ? 'series-row expandable' : 'series-row';
        seriesRow.dataset.series = series.name.toLowerCase();
        seriesRow.dataset.author = series.author.toLowerCase();
        const singleBook = bookCount === 1 ? series.books[0] : null;
        const hasNotes = singleBook && singleBook.notes && singleBook.notes.trim() !== '';

        // For single books in a series, display book title instead of series name
        const displayName = (series.isSeries && bookCount === 1) ? singleBook.title : series.name;
        
        // Calculate read progress for multi-book series
        let readDisplay = '';
        if (isExpandable) {
            const readCount = series.books.filter(b => b.read).length;
            const percentage = Math.round((readCount / bookCount) * 100);
            readDisplay = `${percentage}%`;
        } else if (singleBook) {
            readDisplay = singleBook.read ? '✓' : '';
        }
        
        seriesRow.innerHTML = `
            <td><span style="cursor: pointer;">${isExpandable ? '▶ ' : ''}${displayName}</span></td>
            <td>${series.author}</td>
            <td><span class="book-rating">${avgRating}</span></td>
            <td>${readDisplay}</td>
            <td>${singleBook && singleBook.owned ? '✓' : ''}</td>
            <td>${latestDate}</td>
            <td>${singleBook && singleBook.read_soon ? '✓' : ''}</td>
            <td>
                ${!isExpandable && hasNotes ?
                    '<button class="notes-toggle-single" data-series-idx="' + seriesIdx + '" style="cursor: pointer; padding: 0.25rem 0.5rem; font-family: \'FiraCode\'; font-size: 0.8rem; background-color: var(--accent-light); color: var(--text);">+</button>'
                    : ''}
            </td>
        `;
        tbody.appendChild(seriesRow);

        // Add notes row for single-book series
        if (!isExpandable && hasNotes) {
            const notesRow = document.createElement('tr');
            notesRow.className = 'single-notes-row';
            notesRow.dataset.seriesIdx = seriesIdx;
            notesRow.style.display = 'none';
            notesRow.innerHTML = `
                <td colspan="8" style="padding: 1rem; background-color: var(--accent-light); font-style: italic;">${singleBook.notes}</td>
            `;
            tbody.appendChild(notesRow);
        }

        // Individual book rows (only for series with multiple books)
        if (isExpandable) {
            series.books.forEach(book => {
                const bookRow = document.createElement('tr');
                bookRow.className = 'book-row';
                bookRow.dataset.seriesIdx = seriesIdx;
                bookRow.dataset.status = book.read;
                bookRow.dataset.title = book.title.toLowerCase();
                bookRow.dataset.author = book.author.toLowerCase();
                bookRow.dataset.series = series.name.toLowerCase();
                bookRow.dataset.notes = (book.notes || '').toLowerCase();

                bookRow.innerHTML = `
                    <td class="book-title">${book.title}</td>
                    <td>${book.author}</td>
                    <td><span class="book-rating">${book.rating}</span></td>
                    <td>${book.read ? '✓' : ''}</td>
                    <td>${book.owned ? '✓' : ''}</td>
                    <td>${book.date_finished}</td>
                    <td>${book.read_soon ? '✓' : ''}</td>
                    <td>
                        ${book.notes && book.notes.trim() !== '' ?
                            '<button class="notes-toggle" style="cursor: pointer; padding: 0.25rem 0.5rem; font-family: \'FiraCode\'; font-size: 0.8rem; background-color: var(--accent-light); color: var(--text);">+</button>'
                            : ''}
                    </td>
                `;
                tbody.appendChild(bookRow);

                // Notes row
                if (book.notes && book.notes.trim() !== '') {
                    const notesRow = document.createElement('tr');
                    notesRow.className = 'notes-row';
                    notesRow.dataset.seriesIdx = seriesIdx;
                    notesRow.dataset.bookNotesRow = 'true';
                    notesRow.style.display = 'none';
                    notesRow.innerHTML = `
                        <td colspan="8" style="padding: 1rem; background-color: var(--accent-light); font-style: italic; border-left: 3px solid var(--accent);">${book.notes}</td>
                    `;
                    tbody.appendChild(notesRow);
                }
            });
        }

        // Add click handler for series row
        if (isExpandable) {
            seriesRow.addEventListener('click', function() {
                const bookRows = tbody.querySelectorAll(`.book-row[data-series-idx="${seriesIdx}"]`);
                const notesRows = tbody.querySelectorAll(`.notes-row[data-series-idx="${seriesIdx}"][data-book-notes-row="true"]`);
                const isExpanded = bookRows[0].classList.contains('expanded');
                const arrow = this.querySelector('span');

                if (isExpanded) {
                    bookRows.forEach(row => row.classList.remove('expanded'));
                    notesRows.forEach(row => {
                        row.style.display = 'none';
                        const btn = row.previousElementSibling?.querySelector('.notes-toggle');
                        if (btn) btn.textContent = '+';
                    });
                    arrow.textContent = '▶ ' + series.name;
                } else {
                    bookRows.forEach(row => row.classList.add('expanded'));
                    arrow.textContent = '▼ ' + series.name;
                }
            });
        }
    });

    // Add notes toggle handlers for multi-book series
    tbody.querySelectorAll('.notes-toggle').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const bookRow = this.closest('tr');
            const notesRow = bookRow.nextElementSibling;

            if (notesRow && notesRow.classList.contains('notes-row')) {
                if (notesRow.style.display === 'none') {
                    notesRow.style.display = '';
                    this.textContent = '−';
                } else {
                    notesRow.style.display = 'none';
                    this.textContent = '+';
                }
            }
        });
    });

    // Add notes toggle handlers for single-book series
    tbody.querySelectorAll('.notes-toggle-single').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const seriesIdx = this.dataset.seriesIdx;
            const notesRow = tbody.querySelector(`.single-notes-row[data-series-idx="${seriesIdx}"]`);

            if (notesRow) {
                if (notesRow.style.display === 'none') {
                    notesRow.style.display = '';
                    this.textContent = '−';
                } else {
                    notesRow.style.display = 'none';
                    this.textContent = '+';
                }
            }
        });
    });
}

// Sorting state
let currentSortColumn = 'date';
let sortDirection = -1; // -1 for descending, 1 for ascending

// Filter and sort
function updateDisplay() {
    let seriesGroups = groupBooksBySeries();
    const searchTerm = searchInput.value.toLowerCase();
    const status = statusFilter.value;

    // Filter
    if (searchTerm || status) {
        seriesGroups = seriesGroups.map(series => {
            const filteredBooks = series.books.filter(book => {
                const matchesStatus = !status || book.read === (status === 'true');
                const matchesSearch = !searchTerm ||
                    book.title.toLowerCase().includes(searchTerm) ||
                    book.author.toLowerCase().includes(searchTerm) ||
                    (book.series && book.series.toLowerCase().includes(searchTerm)) ||
                    (book.notes && book.notes.toLowerCase().includes(searchTerm));
                return matchesStatus && matchesSearch;
            });

            return { ...series, books: filteredBooks };
        }).filter(series => series.books.length > 0);
    }

    // Sort based on current sort column
    seriesGroups.sort((a, b) => {
        let aVal, bVal;

        switch(currentSortColumn) {
            case 'series':
                aVal = a.name.toLowerCase();
                bVal = b.name.toLowerCase();
                break;
            case 'author':
                aVal = a.author.toLowerCase();
                bVal = b.author.toLowerCase();
                break;
            case 'count':
                aVal = a.books.length;
                bVal = b.books.length;
                break;
            case 'rating':
                aVal = parseFloat(calculateAvgRating(a.books));
                bVal = parseFloat(calculateAvgRating(b.books));
                break;
            case 'date':
                aVal = parseDate(getLatestDate(a.books));
                bVal = parseDate(getLatestDate(b.books));
                break;
        }

        if (aVal < bVal) return -1 * sortDirection;
        if (aVal > bVal) return 1 * sortDirection;
        return 0;
    });

    renderTable(seriesGroups);

    const totalBooks = seriesGroups.reduce((sum, s) => sum + s.books.length, 0);
    bookCount.textContent = `${seriesGroups.length} series, ${totalBooks} books`;
}

// Add sorting click handlers
document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', function() {
        const column = this.dataset.column;

        if (currentSortColumn === column) {
            sortDirection *= -1;
        } else {
            currentSortColumn = column;
            sortDirection = -1;
        }

        updateDisplay();
    });
});

// Event listeners
searchInput.addEventListener('input', updateDisplay);
statusFilter.addEventListener('change', updateDisplay);

// Initial fetch
fetchBooks();
