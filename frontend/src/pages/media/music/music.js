// Fetch and display albums
document.addEventListener('DOMContentLoaded', async () => {
    const albumsGrid = document.querySelector('.albums-grid');
    const sidebar = document.querySelector('.album-sidebar');
    const sidebarTitle = document.querySelector('.sidebar-title');
    const sidebarText = document.querySelector('.sidebar-text');
    const sidebarClose = document.querySelector('.sidebar-close');
    const genreFilterButtons = document.getElementById('genre-filter-buttons');

    let allAlbums = [];
    let allGenres = [];
    let selectedGenres = new Set();

    // Fetch albums from API
    async function fetchAlbums() {
        try {
            const response = await fetch('/api/albums');
            if (!response.ok) {
                throw new Error(`Failed to fetch albums: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching albums:', error);
            return [];
        }
    }

    // Fetch genres from API
    async function fetchGenres() {
        try {
            const response = await fetch('/api/genres');
            if (!response.ok) {
                throw new Error(`Failed to fetch genres: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching genres:', error);
            return [];
        }
    }

    // Render genre filter buttons
    function renderGenreFilters() {
        if (!allGenres.length) {
            genreFilterButtons.innerHTML = '<span style="color: var(--accent-light); font-size: 0.9rem;">No genres available</span>';
            return;
        }

        genreFilterButtons.innerHTML = '';

        allGenres.forEach(genre => {
            const button = document.createElement('button');
            button.className = 'genre-filter-btn';
            button.textContent = genre.name;
            button.dataset.genreId = genre.id;

            if (selectedGenres.has(genre.id)) {
                button.classList.add('active');
            }

            button.addEventListener('click', () => {
                if (selectedGenres.has(genre.id)) {
                    selectedGenres.delete(genre.id);
                    button.classList.remove('active');
                } else {
                    selectedGenres.add(genre.id);
                    button.classList.add('active');
                }
                filterAndRenderAlbums();
            });

            genreFilterButtons.appendChild(button);
        });
    }

    // Filter albums based on selected genres
    function getFilteredAlbums() {
        if (selectedGenres.size === 0) {
            return allAlbums;
        }

        return allAlbums.filter(album => {
            if (!album.genres || album.genres.length === 0) {
                return false;
            }
            return album.genres.some(genre => selectedGenres.has(genre.id));
        });
    }

    // Filter and render albums
    function filterAndRenderAlbums() {
        const filteredAlbums = getFilteredAlbums();
        renderAlbums(filteredAlbums);
    }

    // Render albums to the DOM
    function renderAlbums(albums) {
        albumsGrid.innerHTML = '';

        albums.forEach(album => {
            const albumWrapper = document.createElement('div');
            albumWrapper.className = 'album-wrapper';
            albumWrapper.dataset.albumText = album.text || '';
            albumWrapper.dataset.albumTitle = album.name;
            albumWrapper.dataset.albumArtist = album.artist;

            // Store links data on the element
            if (album.links && album.links.length > 0) {
                albumWrapper.dataset.albumLinks = JSON.stringify(album.links);
            }

            const genresHTML = album.genres && album.genres.length > 0
                ? `<div class="album-genres">
                    ${album.genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')}
                </div>`
                : '';

            albumWrapper.innerHTML = `
                <div class="album-cover">
                    <img src="/public/resources/${album.image}.jpg" alt="${album.name} by ${album.artist}">
                </div>
                <div class="album-info">
                    <h2 class="album-title">${album.name}</h2>
                    <p class="album-artist">${album.artist}</p>
                    <p class="album-year">${album.year}</p>
                    ${genresHTML}
                </div>
            `;

            albumsGrid.appendChild(albumWrapper);
        });

        attachEventListeners();
    }

    function updateSidebar(wrapper) {
        const albumTitle = wrapper.dataset.albumTitle;
        const albumArtist = wrapper.dataset.albumArtist;
        const albumText = wrapper.dataset.albumText;
        const albumLinksData = wrapper.dataset.albumLinks;

        sidebarTitle.textContent = `${albumTitle} - ${albumArtist}`;

        // Build the text content with links
        let textContent = albumText || '';

        if (albumLinksData) {
            try {
                const links = JSON.parse(albumLinksData);
                if (links && links.length > 0) {
                    const linksHTML = links.map(link =>
                        `<a href="${link.link}" class="sidebar-link code" target="_blank" rel="noopener noreferrer">
                            ${link.type.charAt(0).toUpperCase() + link.type.slice(1)}
                        </a>`
                    ).join(' ');

                    sidebarText.innerHTML = textContent + (textContent ? '<br><br>' : '') + linksHTML;
                } else {
                    sidebarText.textContent = textContent;
                }
            } catch (e) {
                console.error('Error parsing album links:', e);
                sidebarText.textContent = textContent;
            }
        } else {
            sidebarText.textContent = textContent;
        }

        // Show sidebar on mobile when album is clicked
        sidebar.classList.add('visible');
    }

    function closeSidebar() {
        sidebar.classList.remove('visible');
        sidebarTitle.textContent = 'Hover over an album';
        sidebarText.textContent = 'Album information will appear here';
    }

    function attachEventListeners() {
        const albumWrappers = document.querySelectorAll('.album-wrapper');

        albumWrappers.forEach(wrapper => {
            // Handle hover for desktop
            wrapper.addEventListener('mouseenter', () => {
                updateSidebar(wrapper);
            });

            // Handle click/tap for mobile
            wrapper.addEventListener('click', (e) => {
                updateSidebar(wrapper);
            });
        });
    }

    // Close button event listener
    sidebarClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSidebar();
    });

    // Load albums and genres on page load
    allAlbums = await fetchAlbums();
    allGenres = await fetchGenres();

    renderGenreFilters();
    renderAlbums(allAlbums);
});
