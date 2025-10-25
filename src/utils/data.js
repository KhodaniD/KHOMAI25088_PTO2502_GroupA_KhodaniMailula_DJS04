/**
 * @fileoverview Static genre data for the Podcast Explorer application.
 * This file provides the list of genres and a mapping object for quick lookup.
 */

// Array of all available genres with their respective IDs and titles.
export const genres = [
    { id: 1, title: 'Personal Growth' },
    { id: 2, title: 'Investigative' },
    { id: 3, title: 'History' },
    { id: 4, title: 'Comedy' },
    { id: 5, title: 'Entertainment' },
    { id: 6, title: 'Business' },
    { id: 7, title: 'Fiction' },
    { id: 8, title: 'News' },
    { id: 9, title: 'Kids and Family' },
    { id: 10, title: 'Science' },
    { id: 11, title: 'Technology' },
    { id: 12, title: 'Health & Fitness' },
    { id: 13, title: 'Arts' },
    { id: 14, title: 'Music' },
    { id: 15, title: 'True Crime' }
];

// Mapping object for quickly looking up a genre title by its ID.
export const GENRE_MAPPING = genres.reduce((acc, genre) => {
    // Keys are stored as numbers for direct comparison with API response IDs.
    acc[genre.id] = genre.title; 
    return acc;
}, {});
