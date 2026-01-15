// Fetch and display the last read book
async function fetchLastRead() {
    const contentDiv = document.getElementById('last-read-content');

    try {
        const response = await fetch('/api/books/last-read');

        if (!response.ok) {
            throw new Error('Failed to fetch last read book');
        }

        const data = await response.json();

        // Format the date
        const dateFinished = new Date(data.date_finished);
        const formattedDate = dateFinished.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });

        // Build the display
        let html = '';

        if (data.book) {
            html += `<div class="book-title">${data.book.title}</div>`;

            if (data.book.authors && data.book.authors.length > 0) {
                const authorNames = data.book.authors.map(a => a.name).join(', ');
                html += `<p class="book-author">by ${authorNames}</p>`;
            }

            if (data.book.series) {
                html += `<div class="book-series">${data.book.series.name}</div>`;
            }

            html += `<div class="book-date">Finished: ${formattedDate}</div>`;
        } else {
            html = '<p class="error">No book data available</p>';
        }

        contentDiv.innerHTML = html;
    } catch (error) {
        console.error('Error fetching last read:', error);
        contentDiv.innerHTML = '<p class="error">Failed to load last read book</p>';
    }
}

// Fetch and display the last listened track
async function fetchLastListened() {
    const contentDiv = document.getElementById('last-listened-content');

    try {
        const response = await fetch('/api/listening/last');

        if (!response.ok) {
            throw new Error('Failed to fetch last listened track');
        }

        const data = await response.json();

        // Check if expired or no recent activity
        if (data.expired) {
            contentDiv.innerHTML = '<p class="placeholder">No recent listening activity</p>';
            return;
        }

        // Build the display
        let html = '';

        if (data.item) {
            html += `<div class="book-title">${data.item.trackName}</div>`;

            if (data.item.artists && data.item.artists.length > 0) {
                const artistNames = data.item.artists.map(a => a.artistName).join(', ');
                html += `<div class="book-author">by ${artistNames}</div>`;
            }

            if (data.item.releaseName) {
                html += `<div class="book-series">${data.item.releaseName}</div>`;
            }

            html += `<div class="book-date" style="margin-top: 1rem;"><a href="https://teal.fm" target="_blank" rel="noopener noreferrer" class="accent">via teal.fm</a></div>`;


            if (data.item.playedTime) {
                const playedTime = new Date(data.item.playedTime);
                const formattedTime = playedTime.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }) + ' ' + playedTime.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                html += `<div class="book-date">Played: ${formattedTime}</div>`;
            }
        } else {
            html = '<p class="placeholder">No listening data available</p>';
        }

        contentDiv.innerHTML = html;
    } catch (error) {
        console.error('Error fetching last listened:', error);
        contentDiv.innerHTML = '<p class="error">Failed to load last listened track</p>';
    }
}

// Load data when page is ready
document.addEventListener('DOMContentLoaded', () => {
    fetchLastRead();
    fetchLastListened();
});
