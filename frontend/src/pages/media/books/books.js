const { createApp } = Vue;

createApp({
    delimiters: ['[[', ']]'], // Use different delimiters to avoid conflict with Liquid
    data() {
        return {
            books: [],
            topSeriesFromDB: [], // Top series fetched from database
            recommendedBooks: [], // Recommended books fetched from database
            loading: true,
            error: null,
            searchTerm: '',
            statusFilter: '',
            sortColumn: 'date',
            sortDirection: -1, // -1 for descending, 1 for ascending
            expandedSeries: {}, // Track which series are expanded by series name
            seriesNotesVisible: {}, // Track which single-book series notes are visible
            bookNotesVisible: {}, // Track which book notes are visible by book ID
            recommendedBooksExpanded: false, // Track if recommended books section is expanded
            currentPage: 1, // Current page for pagination
            itemsPerPage: 15, // Number of series to show per page
        };
    },

    computed: {
        // To Read Soon books
        toReadSoonBooks() {
            return this.books.filter(book =>
                book.read_soon && (!book.read_logs || book.read_logs.length === 0)
            );
        },

        // Top Series data
        topSeriesData() {
            if (this.topSeriesFromDB.length === 0) return [];

            const seriesGroups = this.groupBooksBySeries(this.books);
            
            // Create a map of series name to sort_order
            const sortOrderMap = {};
            this.topSeriesFromDB.forEach(ts => {
                if (ts.series?.name) {
                    sortOrderMap[ts.series.name] = ts.sort_order;
                }
            });
            
            const topSeriesNames = Object.keys(sortOrderMap);
            
            return seriesGroups
                .filter(series => topSeriesNames.includes(series.name))
                .map(series => ({
                    ...series,
                    readCount: series.books.filter(b => b.read).length,
                    sortOrder: sortOrderMap[series.name]
                }))
                .sort((a, b) => a.sortOrder - b.sortOrder);
        },

        // Top series config for checking if configured
        topSeriesConfig() {
            return this.topSeriesFromDB;
        },

        // Stats
        stats() {
            const readBooks = this.books.filter(book => book.read_logs && book.read_logs.length > 0);
            const unreadBooks = this.books.filter(book => !book.read_logs || book.read_logs.length === 0);
            const rereadBooks = this.books.filter(book => book.read_logs && book.read_logs.length > 1);
            const ownedBooks = this.books.filter(book => book.owned);

            return {
                read: readBooks.length,
                toRead: unreadBooks.length,
                reread: rereadBooks.length,
                owned: ownedBooks.length
            };
        },

        // Year Stats
        yearStats() {
            const currentYear = new Date().getFullYear();

            // Get all books read in current year
            const booksThisYear = this.books.filter(book => {
                if (!book.read_logs || book.read_logs.length === 0) return false;
                return book.read_logs.some(log => {
                    const logDate = new Date(log.date_finished);
                    return logDate.getFullYear() === currentYear;
                });
            });

            const totalBooksThisYear = booksThisYear.length;

            // Calculate days since start of year
            const startOfYear = new Date(currentYear, 0, 1);
            const today = new Date();
            const daysSinceStart = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24)) + 1;

            // Calculate per month (average)
            const monthsSinceStart = (today.getMonth() + 1) + (today.getDate() / 30);
            const perMonth = monthsSinceStart > 0 ? (totalBooksThisYear / monthsSinceStart).toFixed(1) : 0;

            // Calculate projected total for the year
            const projected = daysSinceStart > 0
                ? Math.round(totalBooksThisYear * (365 / daysSinceStart))
                : 0;

            return {
                year: currentYear,
                total: totalBooksThisYear,
                perMonth,
                projected
            };
        },

        // Grouped and processed series
        seriesGroups() {
            return this.groupBooksBySeries(this.books);
        },

        // Filtered series
        filteredSeries() {
            let filtered = this.seriesGroups;

            // Apply filters
            if (this.searchTerm || this.statusFilter) {
                filtered = filtered.map(series => {
                    const filteredBooks = series.books.filter(book => {
                        const matchesStatus = !this.statusFilter ||
                            (this.statusFilter === 'read' && book.read) ||
                            (this.statusFilter === 'unread' && !book.read);

                        const matchesSearch = !this.searchTerm ||
                            book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            book.author.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            (book.series && book.series.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
                            (book.notes && book.notes.toLowerCase().includes(this.searchTerm.toLowerCase()));

                        return matchesStatus && matchesSearch;
                    });

                    return { ...series, books: filteredBooks };
                }).filter(series => series.books.length > 0);
            }

            return filtered;
        },

        // Sorted series
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
                        aVal = this.parseDate(a.latestDate);
                        bVal = this.parseDate(b.latestDate);
                        break;
                }

                if (aVal < bVal) return -1 * this.sortDirection;
                if (aVal > bVal) return 1 * this.sortDirection;
                return 0;
            });

            // Add expansion and notes visibility state
            return sorted.map(series => ({
                ...series,
                isExpanded: !!this.expandedSeries[series.name],
                showNotes: !!this.seriesNotesVisible[series.name],
                books: series.books.map(book => ({
                    ...book,
                    showNotes: !!this.bookNotesVisible[book.id]
                }))
            }));
        },

        // Book count
        bookCount() {
            return this.filteredSeries.reduce((sum, s) => sum + s.books.length, 0);
        },

        // Series count
        seriesCount() {
            return this.filteredSeries.length;
        },

        // Paginated series
        paginatedSeries() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredAndSortedSeries.slice(start, end);
        },

        // Total pages
        totalPages() {
            return Math.ceil(this.filteredAndSortedSeries.length / this.itemsPerPage);
        }
    },

    methods: {
        async fetchBooks() {
            try {
                this.loading = true;
                
                // Fetch books, top series, and recommended books in parallel
                const [booksResponse, topSeriesResponse, recommendedBooksResponse] = await Promise.all([
                    fetch('/api/books'),
                    fetch('/api/top-series'),
                    fetch('/api/recommended-books')
                ]);
                
                if (!booksResponse.ok) {
                    throw new Error(`HTTP error! status: ${booksResponse.status}`);
                }
                
                this.books = await booksResponse.json();
                
                // Top series fetch is optional - don't fail if it errors
                if (topSeriesResponse.ok) {
                    this.topSeriesFromDB = await topSeriesResponse.json();
                } else {
                    console.warn('Failed to load top series');
                }
                
                // Recommended books fetch is optional - don't fail if it errors
                if (recommendedBooksResponse.ok) {
                    this.recommendedBooks = await recommendedBooksResponse.json();
                } else {
                    console.warn('Failed to load recommended books');
                }
                
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
                        seriesId: book.series?.id,
                        isExpanded: false,
                        showNotes: false
                    };
                }

                // Determine if book is read and get all dates
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
                    rating: book.rating ? (book.rating - 5).toFixed(1) : '',
                    date_finished: dateFinished,
                    read_soon: book.read_soon || false,
                    showNotes: false
                });
            });

            // Process each series to add computed properties
            return Object.values(seriesMap).map(series => {
                const bookCount = series.books.length;
                const avgRating = this.calculateAvgRating(series.books);
                const latestDate = this.getLatestDate(series.books);
                const isExpandable = series.isSeries && bookCount > 1;
                const singleBook = bookCount === 1 ? series.books[0] : null;

                // For single books in a series, display book title instead of series name
                const displayName = (series.isSeries && bookCount === 1) ? singleBook.title : series.name;

                // Calculate read progress
                let readDisplay = '';
                if (isExpandable) {
                    const readCount = series.books.filter(b => b.read).length;
                    const percentage = Math.round((readCount / bookCount) * 100);
                    readDisplay = `${percentage}%`;
                } else if (singleBook) {
                    readDisplay = singleBook.read ? '✓' : '';
                }

                // Calculate owned progress
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
                    isExpandable,
                    singleBook,
                    displayName,
                    readDisplay,
                    ownedDisplay,
                    bookId: singleBook ? singleBook.id : null
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

            if (dates.length === 0) return '';
            dates.sort((a, b) => b.val - a.val);
            return dates[0].str;
        },

        parseDate(dateStr) {
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

        toggleSingleNotes(seriesIdx) {
            const series = this.paginatedSeries[seriesIdx];
            this.seriesNotesVisible[series.name] = !this.seriesNotesVisible[series.name];
        },

        toggleBookNotes(seriesIdx, bookIdx) {
            const book = this.paginatedSeries[seriesIdx].books[bookIdx];
            this.bookNotesVisible[book.id] = !this.bookNotesVisible[book.id];
        },

        toggleRecommendedBooks() {
            this.recommendedBooksExpanded = !this.recommendedBooksExpanded;
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.clearExpansionState();
            }
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.clearExpansionState();
            }
        },

        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.clearExpansionState();
            }
        },

        clearExpansionState() {
            this.expandedSeries = {};
            this.seriesNotesVisible = {};
            this.bookNotesVisible = {};
        }
    },

    watch: {
        // Reset to page 1 when filters change
        searchTerm() {
            this.currentPage = 1;
            this.clearExpansionState();
        },
        statusFilter() {
            this.currentPage = 1;
            this.clearExpansionState();
        },
        sortColumn() {
            this.currentPage = 1;
            this.clearExpansionState();
        },
        sortDirection() {
            this.currentPage = 1;
            this.clearExpansionState();
        }
    },

    mounted() {
        this.fetchBooks();
    }
}).mount('#app');
