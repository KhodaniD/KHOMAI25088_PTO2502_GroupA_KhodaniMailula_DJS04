/**
 * Global constants and genre mappings for the podcast application.
 */

// Genre ID to Title mapping (Comprehensive list)
export const GENRE_MAPPING = {
    1: 'Personal Growth', 2: 'True Crime', 3: 'History', 4: 'Comedy', 
    5: 'Dating & Relationships', 6: 'Fiction', 7: 'News', 8: 'Kids & Family', 
    9: 'Arts', 10: 'Science', 11: 'Music', 12: 'TV & Film', 
    13: 'Religion & Spirituality', 14: 'Documentary', 15: 'Sports', 16: 'Financial', 
    17: 'Health & Fitness', 18: 'Technology', 19: 'Culture', 20: 'Banter', 
    21: 'Business', 22: 'Politics', 23: 'Education', 24: 'Entertainment'
};

// CRITICAL FIX: Array of genres for filter dropdowns (MainApp.jsx imports this as 'genres')
export const genres = Object.keys(GENRE_MAPPING).map(id => ({
    id: Number(id),
    title: GENRE_MAPPING[id]
}));

// Optional exports for consistency
export const ITEMS_PER_PAGE = 20;
export const API_BASE_URL = 'https://podcast-api.netlify.app';

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