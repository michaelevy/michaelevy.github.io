const { createApp } = Vue;

createApp({
    delimiters: ['[[', ']]'],
    data() {
        return {
            review: null,
            loading: true,
            error: null,
            spoilersRevealed: {} // Track which spoilers are revealed
        };
    },

    computed: {
        renderedText() {
            if (!this.review || !this.review.text) return '';
            return this.renderRichText(this.review.text);
        },

        renderedLongText() {
            if (!this.review || !this.review.longText) return '';
            return this.renderRichText(this.review.longText);
        }
    },

    methods: {
        async fetchReview() {
            try {
                this.loading = true;
                
                // Get slug from URL
                const slug = this.getSlugFromURL();
                if (!slug) {
                    this.error = 'No review slug provided';
                    this.loading = false;
                    return;
                }

                const response = await fetch(`/api/reviews/${slug}`);
                
                if (response.status === 404) {
                    this.review = null;
                    this.loading = false;
                    return;
                }
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                this.review = await response.json();
                this.loading = false;
            } catch (error) {
                console.error('Error fetching review:', error);
                this.error = 'Failed to load review. Please try again later.';
                this.loading = false;
            }
        },

        getSlugFromURL() {
            // Extract slug from URL query parameter
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('slug');
        },

        formatDate(dateString) {
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            } catch (e) {
                return dateString;
            }
        },

        renderRichText(richText) {
            if (!richText) return '';
            
            // Handle both object and already-rendered HTML
            if (typeof richText === 'string') {
                return richText;
            }

            // Contentful rich text format
            if (richText.nodeType === 'document' && richText.content) {
                return this.renderNodes(richText.content);
            }

            return '';
        },

        renderNodes(nodes) {
            if (!Array.isArray(nodes)) return '';
            
            return nodes.map(node => this.renderNode(node)).join('');
        },

        renderNode(node) {
            if (!node || !node.nodeType) return '';

            switch (node.nodeType) {
                case 'paragraph':
                    return `<p>${this.renderNodes(node.content || [])}</p>`;
                
                case 'heading-1':
                    return `<h1>${this.renderNodes(node.content || [])}</h1>`;
                
                case 'heading-2':
                    return `<h2>${this.renderNodes(node.content || [])}</h2>`;
                
                case 'heading-3':
                    return `<h3>${this.renderNodes(node.content || [])}</h3>`;
                
                case 'heading-4':
                    return `<h4>${this.renderNodes(node.content || [])}</h4>`;
                
                case 'heading-5':
                    return `<h5>${this.renderNodes(node.content || [])}</h5>`;
                
                case 'heading-6':
                    return `<h6>${this.renderNodes(node.content || [])}</h6>`;
                
                case 'blockquote':
                    return `<blockquote>${this.renderNodes(node.content || [])}</blockquote>`;
                
                case 'unordered-list':
                    return `<ul>${this.renderNodes(node.content || [])}</ul>`;
                
                case 'ordered-list':
                    return `<ol>${this.renderNodes(node.content || [])}</ol>`;
                
                case 'list-item':
                    return `<li>${this.renderNodes(node.content || [])}</li>`;
                
                case 'hr':
                    return '<hr>';
                
                case 'text':
                    return this.renderTextNode(node);
                
                case 'hyperlink':
                    const url = node.data?.uri || '#';
                    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${this.renderNodes(node.content || [])}</a>`;
                
                default:
                    // Unknown node type, try to render its content
                    if (node.content) {
                        return this.renderNodes(node.content);
                    }
                    return '';
            }
        },

        renderTextNode(node) {
            let text = node.value || '';
            
            // Escape HTML
            text = text.replace(/&/g, '&amp;')
                      .replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;');

            // Apply marks (bold, italic, etc.)
            if (node.marks && node.marks.length > 0) {
                node.marks.forEach(mark => {
                    switch (mark.type) {
                        case 'bold':
                            // Bold text becomes spoiler (matching library-cat behavior)
                            const spoilerId = 'spoiler-' + Math.random().toString(36).substr(2, 9);
                            text = `<span class="spoiler" onclick="this.classList.toggle('revealed')">${text}</span>`;
                            break;
                        case 'italic':
                            text = `<em>${text}</em>`;
                            break;
                        case 'underline':
                            text = `<u>${text}</u>`;
                            break;
                        case 'code':
                            text = `<code>${text}</code>`;
                            break;
                    }
                });
            }

            return text;
        }
    },

    mounted() {
        this.fetchReview();
    }
}).mount('#app');
