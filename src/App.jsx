import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { Search, RotateCcw, LayoutGrid } from 'lucide-react'; 

/**
 * @fileoverview Single-file React application for the Podcast Explorer.
 * All core logic and UI components are consolidated here.
 */


// --- STATIC DATA MOVED FROM data.js (to fix import error) ---
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

export const GENRE_MAPPING = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.title; 
    return acc;
}, {});
// --- END STATIC DATA ---

// --- CONTEXT SETUP ---
const PodcastContext = createContext(null);

/**
 * Custom hook to consume the podcast context.
 */
const usePodcast = () => {
  const context = useContext(PodcastContext);
  if (!context) {
    throw new Error('usePodcast must be used within a PodcastProvider');
  }
  return context;
};

// --- CONSTANTS AND UTILITIES ---

/** The number of podcast cards to display per page. */
const ITEMS_PER_PAGE = 12;

/** The base URL for the podcast API. */
const API_BASE_URL = 'https://podcast-api.netlify.app';

/** Fetches the list of all podcast shows from the API. */
async function fetchAllPodcasts() {
  try {
    // Add a basic exponential backoff retry logic in case of temporary network failure
    const maxRetries = 3;
    let lastError = null;
    for (let i = 0; i < maxRetries; i++) {
        const response = await fetch(API_BASE_URL);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        lastError = new Error(`HTTP error! status: ${response.status}`);
        console.warn(`Attempt ${i + 1} failed. Retrying in ${2 ** i}s...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (2 ** i)));
    }
    throw lastError; // Throw the last error after max retries
  } catch (error) {
    console.error("Error fetching all podcasts:", error);
    throw new Error("Could not connect to the podcast API.");
  }
}

// --- PODCAST CONTEXT PROVIDER (State and Logic) ---

/**
 * PodcastProvider component. It holds all application state, data fetching, 
 * filtering, sorting, and pagination logic. 
 */
const PodcastProvider = ({ children }) => {
  // --- STATE MANAGEMENT ---
  const [allShows, setAllShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('newest'); 
  const [activeGenreIds, setActiveGenreIds] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- DATA FETCHING ---
  const loadShows = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllPodcasts(); 
      setAllShows(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message || 'Failed to fetch podcast data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShows();
  }, [loadShows]);

  // --- HANDLERS ---
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset page on search
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortKey(e.target.value);
    setCurrentPage(1); // Reset page on sort
  }, []);

  const handleGenreSelect = useCallback((e) => {
    const selectedId = Number(e.target.value);
    // Since we moved data into this file, we can use the local imports
    setActiveGenreIds(selectedId === 0 ? [] : [selectedId]);
    setCurrentPage(1); // Reset page on filter
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to the top of the content when changing pages
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
  }, []);

  const handleReset = useCallback(() => {
    setSearchTerm('');
    setSortKey('newest');
    setActiveGenreIds([]);
    setCurrentPage(1);
  }, []);

  // --- CORE LOGIC: Filtering, Searching, Sorting ---
  const filteredAndSearchedShows = useMemo(() => {
    let result = allShows;

    if (activeGenreIds.length > 0) {
      const filterId = activeGenreIds[0]; 
      // API returns genres as an array of numbers, so we ensure comparison is correct
      result = result.filter(show => show.genres.includes(Number(filterId)));
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(show => 
        show.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        show.description.toLowerCase().includes(lowerCaseSearchTerm) // Search in description too for better results
      );
    }

    return result;
  }, [allShows, activeGenreIds, searchTerm]);

  const sortedShows = useMemo(() => {
    const sorted = [...filteredAndSearchedShows];
    // Convert date strings to Date objects for accurate comparison
    const dateComparer = (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime();
    
    switch (sortKey) {
      case 'title_asc': 
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title_desc': 
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'newest':
      default: 
        return sorted.sort(dateComparer);
    }
  }, [filteredAndSearchedShows, sortKey]);

  // Pagination calculation
  const totalItems = sortedShows.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedShows = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedShows.slice(startIndex, endIndex);
  }, [sortedShows, currentPage]);

  // Sync current page with total pages after filter/search change
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage === 0 && totalPages > 0) {
      setCurrentPage(1);
    } else if (currentPage > 1 && totalPages === 0) {
        // When results go to zero (e.g., search clears all), reset page
        setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // --- CONTEXT VALUE ---
  const contextValue = useMemo(() => ({
    paginatedShows,
    totalItems,
    totalPages,
    currentPage,
    searchTerm,
    sortKey,
    activeGenreIds,
    isLoading,
    error,
    handleSearchChange,
    handleSortChange,
    handleGenreSelect,
    handlePageChange,
    handleReset,
    GENRE_MAPPING, // Now directly available
    genres // Now directly available
  }), [
    paginatedShows, totalItems, totalPages, currentPage, searchTerm, sortKey, activeGenreIds, isLoading, error,
    handleSearchChange, handleSortChange, handleGenreSelect, handlePageChange, handleReset
  ]);

  return (
    <PodcastContext.Provider value={contextValue}>
      {children}
    </PodcastContext.Provider>
  );
};


// --- UI COMPONENTS ---

/**
 * ShowCard component: Renders a single podcast show preview.
 */
const ShowCard = ({ show }) => {
  const { GENRE_MAPPING } = usePodcast();

  const formattedDate = new Date(show.updated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Function to map genre IDs to titles
  const getGenreTitles = (genreIds) => {
    // Ensure all IDs are passed as numbers if they are stored as strings in 'show.genres'
    return genreIds.map(id => GENRE_MAPPING[Number(id)] || GENRE_MAPPING[String(id)] || 'Unknown').join(', ');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="flex-shrink-0">
        <img 
          src={show.image} 
          alt={show.title} 
          className="w-full h-48 object-cover object-center" 
          onError={(e) => {
            e.target.onerror = null; 
            // Placeholder image on error
            e.target.src = `https://placehold.co/400x300/e5e7eb/4b5563?text=${show.title.substring(0, 15)}...`; 
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 truncate" title={show.title}>
            {show.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {show.description}
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p><span className="font-medium text-gray-700">Seasons:</span> {show.seasons}</p>
            <p><span className="font-medium text-gray-700">Genres:</span> {getGenreTitles(show.genres)}</p>
            <p><span className="font-medium text-gray-700">Last Updated:</span> {formattedDate}</p>
          </div>
        </div>
        
        {/* Detail Button */}
        <div className="mt-4">
          <button
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
            // Placeholder onClick for future implementation
            onClick={() => console.log(`Viewing show: ${show.title}`)} 
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};


/**
 * Filter, Sort, and Search Bar Component
 */
const FilterBar = () => {
  const { 
    searchTerm, sortKey, activeGenreIds,
    handleSearchChange, handleSortChange, handleGenreSelect, handleReset,
    genres // Genres are now local to the file, but accessed via context
  } = usePodcast();

  const selectedGenreId = activeGenreIds.length > 0 ? activeGenreIds[0] : 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100 sticky top-0 z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        {/* Genre Filter */}
        <select
          value={selectedGenreId}
          onChange={handleGenreSelect}
          className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150 appearance-none"
        >
          <option value={0}>All Genres</option>
          {genres.map(genre => (
            // Ensure ID is a number for the select value
            <option key={genre.id} value={genre.id}>{genre.title}</option>
          ))}
        </select>

        {/* Sort Options */}
        <select
          value={sortKey}
          onChange={handleSortChange}
          className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150 appearance-none"
        >
          <option value="newest">Sort: Newest</option>
          <option value="title_asc">Sort: Title (A-Z)</option>
          <option value="title_desc">Sort: Title (Z-A)</option>
        </select>
      </div>

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReset}
          className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition duration-150"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};

/**
 * Pagination Controls Component
 */
const Pagination = () => {
  const { currentPage, totalPages, handlePageChange } = usePodcast();

  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const pages = [];
    const maxButtons = 5; // Max number of visible page buttons

    // Logic to calculate which page numbers to show
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    // Add main range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    
    // Use Set to ensure unique pages after adding 1 and totalPages 
    const uniquePages = [...new Set(pages)];


    return uniquePages.map((page, index) => (
      <button
        key={index}
        onClick={() => page !== '...' && handlePageChange(page)}
        disabled={page === '...'}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-150 ${
          page === '...'
            ? 'text-gray-500 cursor-default'
            : page === currentPage
            ? 'bg-blue-600 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        {page}
      </button>
    ));
  };


  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      <div className="flex space-x-2">
        {renderPageButtons()}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
      Next
      </button>
    </div>
  );
};


/**
 * Main Content Display Component (Grid of Cards)
 */
const ShowGrid = () => {
  const { paginatedShows, isLoading, error, totalItems } = usePodcast();

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <LayoutGrid className="mx-auto h-12 w-12 text-blue-500 animate-pulse" />
        <p className="mt-2 text-lg font-medium text-gray-600">Loading podcasts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <span className="text-red-500 text-xl font-semibold">Error:</span>
        <p className="text-gray-600 mt-2">{error}</p>
        <p className="text-sm text-gray-400">Please check your network connection or the API endpoint.</p>
      </div>
    );
  }
  
  if (totalItems === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-semibold text-gray-700">No Podcasts Found</p>
        <p className="text-gray-500 mt-2">Try adjusting your search term or filters.</p>
      </div>
    );
  }


  return (
    <>
      <div className="text-center text-sm font-medium text-gray-500 mb-4">
        Showing {paginatedShows.length} of {totalItems} results.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedShows.map(show => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
      <Pagination />
    </>
  );
};


// --- MAIN APP COMPONENT ---

const App = () => {
  return (
    // Wrap the entire application in the PodcastProvider
    <PodcastProvider> 
      <div className="min-h-screen bg-gray-50 font-sans">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              The Podcast Explorer
            </h1>
            <p className="text-gray-500 mt-1">Discover, filter, and sort your favorite podcasts.</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <FilterBar />
          <ShowGrid />
        </main>

        <footer className="bg-white border-t border-gray-100 mt-12 py-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Podcast Explorer. Data provided by podcast-api.netlify.app.
        </footer>
      </div>
    </PodcastProvider>
  );
};

// Default export is mandatory for the main application component
export default App;
