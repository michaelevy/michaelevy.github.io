const { createApp } = Vue;

createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            books: [],
            loading: true,
            error: null,
            searchTerm: '',
            statusFilter: '',
            sortColumn: 'date',
            sortDirection: -1,
            expandedSeries: {},
            currentPage: 1,
            itemsPerPage: 15,
            credentials: null,
            
            // Edit modal
            showEditModal: false,
            editingBook: null,
            editForm: {
                title: '',
                authors: '',
                series: '',
                rating: null,
                datesFinished: '',
                owned: false,
                readSoon: false
            },
            editError: null,
            editSubmitting: false,
            
            // Log Read modal
            showLogReadModal: false,
            logReadBook: null,
            logReadForm: {
                dateFinished: '',
                rating: null,
                owned: false
            },
            logReadError: null,
            logReadSubmitting: false,
            
            // Import CSV modal
            showImportCsvModal: false,
            csvFile: null,
            importProgress: false,
            importResult: null
        };
    },

    computed: {
        seriesGroups() {
            return this.groupBooksBySeries(this.books);
        },

        filteredSeries() {
            let filtered = this.seriesGroups;

            if (this.searchTerm || this.statusFilter) {
                filtered = filtered.map(series => {
                    const filteredBooks = series.books.filter(book => {
                        const matchesStatus = !this.statusFilter ||
                            (this.statusFilter === 'read' && book.read) ||
                            (this.statusFilter === 'unread' && !book.read);

                        const matchesSearch = !this.searchTerm ||
                            book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            (book.series && book.series.toLowerCase().includes(this.searchTerm.toLowerCase()));

                        return matchesStatus && matchesSearch;
                    });

                    return { ...series, books: filteredBooks };
                }).filter(series => series.books.length > 0);
            }

            return filtered;
        },

        filteredAndSortedSeries() {
            const sorted = [...this.filteredSeries].sort((a, b) => {
                let aVal, bVal;

                switch(this.sortColumn) {
                    case 'series':
                        aVal = a.name.toLowerCase();
                        bVal = b.name.toLowerCase();
                        break;
                    case 'author':
                        aVal = a.author.toLowerCase();
                        bVal = b.author.toLowerCase();
                        break;
                    case 'rating':
                        aVal = parseFloat(a.avgRating);
                        bVal = parseFloat(b.avgRating);
                        break;
                    case 'date':
                        aVal = this.parseDate(a.latestDateSort);
                        bVal = this.parseDate(b.latestDateSort);
                        break;
                }

                if (aVal < bVal) return -1 * this.sortDirection;
                if (aVal > bVal) return 1 * this.sortDirection;
                return 0;
            });

            return sorted.map(series => ({
                ...series,
                isExpanded: !!this.expandedSeries[series.name]
            }));
        },

        bookCount() {
            return this.filteredSeries.reduce((sum, s) => sum + s.books.length, 0);
        },

        seriesCount() {
            return this.filteredSeries.length;
        },

        paginatedSeries() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredAndSortedSeries.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredAndSortedSeries.length / this.itemsPerPage);
        }
    },

    methods: {
        async fetchBooks() {
            try {
                this.loading = true;
                const response = await fetch('/api/books');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                this.books = await response.json();
                this.loading = false;
            } catch (error) {
                console.error('Error fetching books:', error);
                this.error = 'Failed to load books. Please try again later.';
                this.loading = false;
            }
        },

        groupBooksBySeries(books) {
            const seriesMap = {};

            books.forEach(book => {
                const seriesName = book.series?.name || book.title;
                const authorName = book.authors?.map(a => a.name).join(', ') || 'Unknown';

                if (!seriesMap[seriesName]) {
                    seriesMap[seriesName] = {
                        name: seriesName,
                        author: authorName,
                        books: [],
                        isSeries: !!book.series,
                        seriesId: book.series?.id
                    };
                }

                const hasReadLogs = book.read_logs && book.read_logs.length > 0;
                const dateFinished = hasReadLogs
                    ? book.read_logs
                        .sort((a, b) => new Date(a.date_finished) - new Date(b.date_finished))
                        .map(log => new Date(log.date_finished).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit'
                        }).replace(/\//g, '/'))
                        .join(', ')
                    : '';

                seriesMap[seriesName].books.push({
                    ...book,
                    author: authorName,
                    series: book.series?.name || '',
                    read: hasReadLogs,
                    owned: book.owned || false,
                    rating: book.rating ? book.rating.toFixed(1) : '',
                    date_finished: dateFinished,
                    read_soon: book.read_soon || false
                });
            });

            return Object.values(seriesMap).map(series => {
                const bookCount = series.books.length;
                const avgRating = this.calculateAvgRating(series.books);
                const latestDateObj = this.getLatestDate(series.books);
                const latestDate = latestDateObj.display;
                const latestDateSort = latestDateObj.sort;
                const isExpandable = series.isSeries && bookCount > 1;
                const singleBook = bookCount === 1 ? series.books[0] : null;
                const displayName = (series.isSeries && bookCount === 1) ? singleBook.title : series.name;

                let readDisplay = '';
                if (isExpandable) {
                    const readCount = series.books.filter(b => b.read).length;
                    const percentage = Math.round((readCount / bookCount) * 100);
                    readDisplay = `${percentage}%`;
                } else if (singleBook) {
                    readDisplay = singleBook.read ? '✓' : '';
                }

                let ownedDisplay = '';
                if (isExpandable) {
                    const ownedCount = series.books.filter(b => b.owned).length;
                    const percentage = Math.round((ownedCount / bookCount) * 100);
                    ownedDisplay = `${percentage}%`;
                } else if (singleBook) {
                    ownedDisplay = singleBook.owned ? '✓' : '';
                }

                return {
                    ...series,
                    bookCount,
                    avgRating,
                    latestDate,
                    latestDateSort,
                    isExpandable,
                    singleBook,
                    displayName,
                    readDisplay,
                    ownedDisplay
                };
            });
        },

        calculateAvgRating(seriesBooks) {
            const ratings = seriesBooks
                .map(b => parseFloat(b.rating))
                .filter(r => !isNaN(r) && r > 0);

            if (ratings.length === 0) return 0;
            return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
        },

        getLatestDate(seriesBooks) {
            const dates = seriesBooks
                .map(b => {
                    const dateStr = b.date_finished;
                    if (!dateStr) return null;

                    const dateParts = dateStr.split(',');
                    const lastDate = dateParts[dateParts.length - 1].trim();

                    return { str: lastDate, val: this.parseDate(dateStr) };
                })
                .filter(d => d && d.val > 0);

            if (dates.length === 0) return { display: '', sort: '' };
            dates.sort((a, b) => b.val - a.val);
            
            return { display: dates[0].str, sort: dates[0].str };
        },

        parseDate(dateStr) {
            if (!dateStr) return 0;

            const dates = dateStr.split(',');
            const lastDate = dates[dates.length - 1].trim();

            const parts = lastDate.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                let year = parseInt(parts[2]);
                year = year < 100 ? (year < 50 ? 2000 + year : 1900 + year) : year;
                return new Date(year, month, day).getTime();
            }

            return 0;
        },

        sortBy(column) {
            if (this.sortColumn === column) {
                this.sortDirection *= -1;
            } else {
                this.sortColumn = column;
                this.sortDirection = -1;
            }
        },

        toggleSeries(seriesIdx) {
            const series = this.paginatedSeries[seriesIdx];
            this.expandedSeries[series.name] = !this.expandedSeries[series.name];
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.expandedSeries = {};
            }
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.expandedSeries = {};
            }
        },

        async authFetch(url, options = {}) {
            if (!this.credentials) {
                const username = prompt('Enter admin username:');
                const password = prompt('Enter admin password:');
                if (!username || !password) {
                    throw new Error('Authentication cancelled');
                }
                this.credentials = btoa(`${username}:${password}`);
            }

            options.headers = {
                ...options.headers,
                'Authorization': `Basic ${this.credentials}`,
                'Content-Type': 'application/json'
            };

            const response = await fetch(url, options);

            if (response.status === 401) {
                this.credentials = null;
                throw new Error('Authentication failed');
            }

            return response;
        },

        // Edit Modal Methods
        showAddBookModal() {
            this.editingBook = null;
            this.editForm = {
                title: '',
                authors: '',
                series: '',
                rating: null,
                datesFinished: '',
                owned: false,
                readSoon: false
            };
            this.editError = null;
            this.showEditModal = true;
        },

        openEditModal(book) {
            this.editingBook = book;
            this.editForm = {
                title: book.title || '',
                authors: book.authors?.map(a => a.name).join(', ') || '',
                series: book.series || '',
                rating: book.rating ? parseFloat(book.rating) : null,
                datesFinished: book.date_finished || '',
                owned: book.owned || false,
                readSoon: book.read_soon || false
            };
            this.editError = null;
            this.showEditModal = true;
        },

        closeEditModal() {
            this.showEditModal = false;
            this.editingBook = null;
            this.editError = null;
        },

        async submitEdit() {
            this.editError = null;
            this.editSubmitting = true;

            try {
                const authorNames = this.editForm.authors
                    .split(',')
                    .map(a => a.trim())
                    .filter(a => a);

                const datesFinished = this.editForm.datesFinished
                    ? this.editForm.datesFinished.split(',').map(d => d.trim()).filter(d => d)
                    : [];

                const data = {
                    title: this.editForm.title,
                    author_names: authorNames,
                    series_name: this.editForm.series,
                    owned: this.editForm.owned,
                    rating: this.editForm.rating || 0,
                    dates_finished: datesFinished,
                    read_soon: this.editForm.readSoon
                };

                const url = this.editingBook ? `/api/books/${this.editingBook.id}` : '/api/books';
                const method = this.editingBook ? 'PUT' : 'POST';

                const response = await this.authFetch(url, {
                    method,
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to save book');
                }

                await this.fetchBooks();
                this.closeEditModal();
            } catch (error) {
                console.error('Error saving book:', error);
                this.editError = error.message;
            } finally {
                this.editSubmitting = false;
            }
        },

        async deleteBook(book) {
            if (!confirm(`Are you sure you want to delete "${book.title}"?`)) return;

            try {
                const response = await this.authFetch(`/api/books/${book.id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Failed to delete book');
                }

                await this.fetchBooks();
            } catch (error) {
                alert('Failed to delete book: ' + error.message);
            }
        },

        // Log Read Modal Methods
        openLogReadModal(book) {
            this.logReadBook = book;
            this.logReadForm.dateFinished = this.getTodayFormatted();
            this.logReadForm.rating = book.rating ? parseFloat(book.rating) : null;
            this.logReadForm.owned = book.owned || false;
            this.logReadError = null;
            this.showLogReadModal = true;
        },

        closeLogReadModal() {
            this.showLogReadModal = false;
            this.logReadBook = null;
            this.logReadForm = {
                dateFinished: '',
                rating: null,
                owned: false
            };
            this.logReadError = null;
        },

        getTodayFormatted() {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = String(today.getFullYear()).slice(-2);
            return `${day}/${month}/${year}`;
        },

        async submitLogRead() {
            this.logReadError = null;
            this.logReadSubmitting = true;

            try {
                const payload = {
                    date_finished: this.logReadForm.dateFinished
                };

                if (this.logReadForm.rating !== null && this.logReadForm.rating !== '') {
                    payload.rating = parseFloat(this.logReadForm.rating);
                }

                payload.owned = this.logReadForm.owned;

                const response = await this.authFetch(`/api/books/${this.logReadBook.id}/read-log`, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to log read');
                }

                await this.fetchBooks();
                this.closeLogReadModal();
            } catch (error) {
                console.error('Error logging read:', error);
                this.logReadError = error.message;
            } finally {
                this.logReadSubmitting = false;
            }
        },

        // Import CSV Methods
        showImportModal() {
            this.csvFile = null;
            this.importProgress = false;
            this.importResult = null;
            this.showImportCsvModal = true;
        },

        closeImportModal() {
            this.showImportCsvModal = false;
            this.csvFile = null;
            this.importResult = null;
        },

        handleFileSelect(event) {
            this.csvFile = event.target.files[0];
            this.importResult = null;
        },

        async submitImport() {
            if (!this.csvFile) return;

            this.importProgress = true;
            this.importResult = null;

            try {
                const formData = new FormData();
                formData.append('file', this.csvFile);

                if (!this.credentials) {
                    const username = prompt('Enter admin username:');
                    const password = prompt('Enter admin password:');
                    if (!username || !password) {
                        throw new Error('Authentication cancelled');
                    }
                    this.credentials = btoa(`${username}:${password}`);
                }

                const response = await fetch('/api/books/import', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${this.credentials}`
                    },
                    body: formData
                });

                if (response.status === 401) {
                    this.credentials = null;
                    throw new Error('Authentication failed');
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                this.importResult = {
                    success: true,
                    message: `
                        <strong>Import Complete!</strong><br>
                        Imported: ${result.imported} books<br>
                        Skipped: ${result.skipped} rows<br>
                        ${result.errors && result.errors.length > 0 ? `<br><strong>Errors:</strong><br>${result.errors.join('<br>')}` : ''}
                    `
                };

                await this.fetchBooks();
            } catch (error) {
                this.importResult = {
                    success: false,
                    message: 'Import failed: ' + error.message
                };
            } finally {
                this.importProgress = false;
            }
        }
    },

    watch: {
        searchTerm() {
            this.currentPage = 1;
            this.expandedSeries = {};
        },
        statusFilter() {
            this.currentPage = 1;
            this.expandedSeries = {};
        },
        sortColumn() {
            this.currentPage = 1;
            this.expandedSeries = {};
        },
        sortDirection() {
            this.currentPage = 1;
            this.expandedSeries = {};
        }
    },

    mounted() {
        this.fetchBooks();
    }
}).mount('#app');
