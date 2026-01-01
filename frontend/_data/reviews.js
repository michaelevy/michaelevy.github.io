// Fetch reviews from the API at build time
export default async function() {
    try {
        // Use environment variable or default to production URL
        // During Docker build, this should point to your live API
        // During local dev, you can set REVIEW_API_URL to localhost
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
