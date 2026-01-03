// Fetch and display albums
document.addEventListener('DOMContentLoaded', async () => {
    const albumsGrid = document.querySelector('.albums-grid');
    const sidebarTitle = document.querySelector('.sidebar-title');
    const sidebarText = document.querySelector('.sidebar-text');

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

    // Render albums to the DOM
    function renderAlbums(albums) {
        albumsGrid.innerHTML = '';
        
        albums.forEach(album => {
            const albumWrapper = document.createElement('div');
            albumWrapper.className = 'album-wrapper';
            albumWrapper.dataset.albumText = album.text || '';
            albumWrapper.dataset.albumTitle = album.name;
            albumWrapper.dataset.albumArtist = album.artist;

            const linksHTML = album.links.map(link => 
                `<a href="${link.link}" class="album-link" target="_blank" rel="noopener noreferrer">
                    ${link.type.charAt(0).toUpperCase() + link.type.slice(1)}
                </a>`
            ).join('');

            albumWrapper.innerHTML = `
                <div class="album-cover">
                    <img src="/public/resources/${album.image}.jpg" alt="${album.name} by ${album.artist}">
                </div>
                <div class="album-info">
                    <h2 class="album-title">${album.name}</h2>
                    <p class="album-artist">${album.artist}</p>
                    <p class="album-year">${album.year}</p>
                    <div class="album-links">
                        ${linksHTML}
                    </div>
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

        sidebarTitle.textContent = `${albumTitle} - ${albumArtist}`;
        sidebarText.textContent = albumText;
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
                // Don't update sidebar if clicking on a link
                if (e.target.closest('.album-link')) {
                    return;
                }
                updateSidebar(wrapper);
            });
        });
    }

    // Load albums on page load
    const albums = await fetchAlbums();
    renderAlbums(albums);
});
