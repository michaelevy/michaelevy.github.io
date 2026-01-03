// Fetch reviews from the API at build time
export default async function() {
    // Skip API calls in local development mode
    if (process.env.SKIP_API === 'true') {
        console.log('Skipping API calls (SKIP_API=true)');
        return [];
    }

    try {
        const apiUrl = process.env.REVIEW_API_URL || 'https://michaelevy.com/api/reviews';

        console.log(`Fetching reviews from: ${apiUrl}`);
        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.warn(`Failed to fetch reviews from API (status: ${response.status})`);
            return [];
        }

        const reviews = await response.json();
        console.log(`Successfully fetched ${reviews.length} reviews`);
        return reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}
