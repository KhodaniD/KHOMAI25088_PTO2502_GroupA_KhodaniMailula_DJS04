/**
 * Global constants and mappings for the podcast application.
 */

// API Configuration
export const ITEMS_PER_PAGE = 20;
export const API_BASE_URL = 'https://podcast-api.netlify.app';

// Genre ID to Title mapping
export const GENRE_MAPPING = {
    1: 'Personal Growth', 2: 'True Crime', 3: 'History', 4: 'Comedy', 
    5: 'Dating & Relationships', 6: 'Fiction', 7: 'News', 8: 'Kids & Family', 
    9: 'Arts', 10: 'Science', 11: 'Music', 12: 'TV & Film', 
    13: 'Religion & Spirituality', 14: 'Documentary', 15: 'Sports', 16: 'Financial', 
    17: 'Health & Fitness', 18: 'Technology', 19: 'Culture', 20: 'Banter', 
    21: 'Business', 22: 'Politics', 23: 'Education', 24: 'Entertainment'
};

/**
 * @function formatDate
 * @description Converts an ISO date string to a readable local date.
 * @param {string} isoString The ISO date string (e.g., '2023-10-27T10:00:00.000Z').
 * @returns {string} The formatted date string (e.g., "Oct 27, 2023").
 */
export const formatDate = (isoString) => {
    if (!isoString) return 'Unknown Date';
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
        console.error('Failed to parse date:', e);
        return 'Invalid Date';
    }
};

/**
 * @function mapGenresToTitles
 * @description Maps an array of genre IDs to a comma-separated string of genre titles.
 * @param {Array<number>} ids - Array of genre IDs.
 * @returns {string} Comma-separated genre titles.
 */
export const mapGenresToTitles = (ids) => {
    if (!ids || ids.length === 0) return 'No Genres';
    return ids.map(id => GENRE_MAPPING[id] || 'Unknown').join(', ');
};

// Array of genres for filter dropdowns
export const genresForFilter = Object.keys(GENRE_MAPPING).map(id => ({
    id: Number(id),
    title: GENRE_MAPPING[id]
}));
