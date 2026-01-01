const { createApp } = Vue;

createApp({
    delimiters: ['[[', ']]'], // Use different delimiters to avoid conflict with Liquid
    data() {
        return {
            reviews: [],
            loading: true,
            error: null,
            searchTerm: '',
            typeFilter: '', // '', 'long', 'short'
            minRating: 1,
            currentPage: 1,
            itemsPerPage: 15
        };
    },

    computed: {
        filteredReviews() {
            return this.reviews.filter(review => {
                // Search filter
                const matchesSearch = !this.searchTerm ||
                    review.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                    (review.summary && review.summary.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
                    (review.quote && review.quote.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
                    (review.series && review.series.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

                // Type filter
                const matchesType = !this.typeFilter || review.type === this.typeFilter;

                // Rating filter (treat 0 as unrated and always show)
                const matchesRating = review.rating === 0 || review.rating >= this.minRating;

                return matchesSearch && matchesType && matchesRating;
            });
        },

        sortedReviews() {
            // Sort by date descending (newest first)
            return [...this.filteredReviews].sort((a, b) => {
                const dateA = new Date(a.date || '1970-01-01');
                const dateB = new Date(b.date || '1970-01-01');
                return dateB - dateA;
            });
        },

        paginatedReviews() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.sortedReviews.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.sortedReviews.length / this.itemsPerPage);
        }
    },

    watch: {
        // Reset to page 1 when filters change
        searchTerm() {
            this.currentPage = 1;
        },
        typeFilter() {
            this.currentPage = 1;
        },
        minRating() {
            this.currentPage = 1;
        }
    },

    methods: {
        async fetchReviews() {
            try {
                this.loading = true;
                const response = await fetch('/api/reviews');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                this.reviews = await response.json();
                this.loading = false;
            } catch (error) {
                console.error('Error fetching reviews:', error);
                this.error = 'Failed to load reviews. Please try again later.';
                this.loading = false;
            }
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    },

    mounted() {
        this.fetchReviews();
    }
}).mount('#app');
