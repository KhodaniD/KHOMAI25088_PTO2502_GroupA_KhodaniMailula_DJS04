/**
 * @fileoverview Central module for constants, utilities, and API calls.
 */

/** The number of podcast cards to display per page. */
export const ITEMS_PER_PAGE = 12;

/** The base URL for the podcast API. (Not exported, used internally by fetch function) */
const API_BASE_URL = 'https://podcast-api.netlify.app';

/**
 * Genre ID to Title mapping required by the project.
 */
export const GENRE_MAPPING = {
  1: 'Personal Growth',
  2: 'True Crime',
  3: 'Sports',
  4: 'Kids & Family',
  5: 'Comedy',
  6: 'Entertainment',
  7: 'Business',
  8: 'Fiction',
  9: 'News',
  10: 'Health & Fitness',
  11: 'Arts',
  12: 'Science',
  13: 'History',
  14: 'Technology',
  15: 'Music',
  16: 'Religion & Spirituality',
  17: 'TV & Film',
  18: 'Philosophy',
  19: 'Travel',
  20: 'Culture',
  21: 'Finance'
};

/**
 * Fetches the list of all podcast shows from the API.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of podcast preview objects.
 */
export async function fetchAllPodcasts() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all podcasts:", error);
    // Throwing the error allows the context to set a proper error state.
    throw new Error("Could not connect to the podcast API.");
  }
}

/**
 * Utility to format ISO date strings into a readable local date.
 * @param {string} isoString - The ISO date string (e.g., "2023-10-27T10:00:00.000Z").
 * @returns {string} The formatted date string (e.g., "Oct 27, 2023").
 */
export function formatDate(isoString) {
  if (!isoString) return 'Unknown Date';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** * Maps an array of genre IDs to a comma-separated string of genre titles.
 * @param {Array<number>} ids - Array of genre IDs.
 * @returns {string} Comma-separated genre titles.
 */
export function mapGenreIdsToTitles(ids) {
  if (!ids || ids.length === 0) return 'No Genres';
  return ids.map(id => GENRE_MAPPING[id] || 'Unknown').join(', ');
}
