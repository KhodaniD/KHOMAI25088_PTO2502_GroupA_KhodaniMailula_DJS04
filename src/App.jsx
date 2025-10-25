import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { Search, RotateCcw, LayoutGrid, ArrowLeft, Loader2, BookOpen } from 'lucide-react'; 

/**
 * @fileoverview A single-file React application for the Podcast Explorer.
 * All components, logic, and data are consolidated here due to environment constraints.
 */


// --- STATIC DATA (Genres) ---
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

// --- UTILITIES ---

/** The number of podcast cards to display per page. */
const ITEMS_PER_PAGE = 12;

/** The base URL for the podcast API. */
const API_BASE_URL = 'https://podcast-api.netlify.app';

/** Formats an ISO date string into a readable format. */
const formatDate = (isoDate) => {
  if (!isoDate) return 'Date Unavailable';
  return new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * Fetches data from the API with a basic exponential backoff retry mechanism.
 * @param {string} url - The API endpoint URL.
 * @returns {Promise<object>} The JSON response data.
 */
async function fetchWithRetry(url) {
  const maxRetries = 3;
  let lastError = null;
  for (let i = 0; i < maxRetries; i++) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        }
        lastError = new Error(`HTTP error! status: ${response.status} for ${url}`);
    } catch (err) {
        lastError = err;
    }
    console.warn(`Attempt ${i + 1} failed for ${url}. Retrying in ${2 ** i}s...`);
    await new Promise(resolve => setTimeout(resolve, 1000 * (2 ** i)));
  }
  throw lastError; // Throw the last error after max retries
}

/** Fetches the list of all podcast shows from the API. */
async function fetchAllPodcasts() {
  try {
    return await fetchWithRetry(API_BASE_URL);
  } catch (error) {
    console.error("Error fetching all podcasts:", error);
    throw new Error("Could not connect to the podcast API.");
  }
}

/** Fetches the details for a specific podcast show. */
async function fetchShowDetails(id) {
  if (!id) throw new Error("Show ID is required.");
  try {
    return await fetchWithRetry(`${API_BASE_URL}/id/${id}`);
  } catch (error) {
    console.error(`Error fetching details for show ${id}:`, error);
    throw new Error(`Failed to load details for show ID ${id}.`);
  }
}

// --- CONTEXT SETUP ---
const PodcastContext = createContext(null);

/** Custom hook to consume the podcast context. */
const usePodcast = () => {
  const context = useContext(PodcastContext);
  if (!context) {
    throw new Error('usePodcast must be used within a PodcastProvider');
  }
  return context;
};

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
  
  // NEW: State for Detail View
  const [selectedShowId, setSelectedShowId] = useState(null);
  const [detailedShow, setDetailedShow] = useState(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);


  // --- DATA FETCHING (List View) ---
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

  // --- DATA FETCHING (Detail View) ---
  useEffect(() => {
    if (!selectedShowId) {
        setDetailedShow(null);
        setDetailsError(null);
        return;
    }

    const loadDetails = async () => {
        setIsDetailsLoading(true);
        setDetailsError(null);
        try {
            const data = await fetchShowDetails(selectedShowId);
            setDetailedShow(data);
        } catch (err) {
            console.error("Fetch Detail Error:", err);
            setDetailsError(err.message || 'Failed to load show details.');
        } finally {
            setIsDetailsLoading(false);
        }
    };
    loadDetails();
  }, [selectedShowId]);

  // --- HANDLERS (List View) ---
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortKey(e.target.value);
    setCurrentPage(1); 
  }, []);

  const handleGenreSelect = useCallback((e) => {
    const selectedId = Number(e.target.value);
    setActiveGenreIds(selectedId === 0 ? [] : [selectedId]);
    setCurrentPage(1); 
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to the top of the content when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }, []);

  const handleReset = useCallback(() => {
    setSearchTerm('');
    setSortKey('newest');
    setActiveGenreIds([]);
    setCurrentPage(1);
  }, []);

  // --- HANDLERS (Detail View) ---
  const handleViewDetails = useCallback((showId) => {
    setSelectedShowId(showId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedShowId(null);
    setDetailedShow(null);
    setDetailsError(null);
    // Optionally scroll back to top of list
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }, []);


  // --- CORE LOGIC: Filtering, Searching, Sorting (Memoized) ---
  const filteredAndSearchedShows = useMemo(() => {
    let result = allShows;

    if (activeGenreIds.length > 0) {
      const filterId = activeGenreIds[0]; 
      result = result.filter(show => show.genres.includes(Number(filterId)));
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(show => 
        show.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        show.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return result;
  }, [allShows, activeGenreIds, searchTerm]);

  const sortedShows = useMemo(() => {
    const sorted = [...filteredAndSearchedShows];
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
        setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // --- CONTEXT VALUE ---
  const contextValue = useMemo(() => ({
    // List View State & Data
    paginatedShows, totalItems, totalPages, currentPage, searchTerm, sortKey, activeGenreIds, isLoading, error,
    // List View Handlers
    handleSearchChange, handleSortChange, handleGenreSelect, handlePageChange, handleReset,
    // Detail View State & Data
    selectedShowId, detailedShow, isDetailsLoading, detailsError,
    // Detail View Handlers
    handleViewDetails, handleCloseDetails,
    // Static Data
    GENRE_MAPPING, genres 
  }), [
    // List View dependencies
    paginatedShows, totalItems, totalPages, currentPage, searchTerm, sortKey, activeGenreIds, isLoading, error,
    handleSearchChange, handleSortChange, handleGenreSelect, handlePageChange, handleReset,
    // Detail View dependencies
    selectedShowId, detailedShow, isDetailsLoading, detailsError,
    handleViewDetails, handleCloseDetails
  ]);

  return (
    <PodcastContext.Provider value={contextValue}>
      {children}
    </PodcastContext.Provider>
  );
};


// --- UI COMPONENTS ---

/** Renders loading state for the main list view. */
const ListLoadingState = () => (
    <div className="text-center py-20">
      <Loader2 className="mx-auto h-12 w-12 text-indigo-500 animate-spin" />
      <p className="mt-2 text-lg font-medium text-gray-600">Loading podcasts...</p>
    </div>
);

/** Renders general list error state. */
const ListErrorState = ({ error }) => (
    <div className="text-center py-20 bg-red-50 border border-red-200 rounded-xl">
        <span className="text-red-500 text-xl font-semibold">Error:</span>
        <p className="text-gray-600 mt-2">{error}</p>
        <p className="text-sm text-gray-400">Please check your network connection or the API endpoint.</p>
    </div>
);


/** Renders a single podcast show preview card. */
const ShowCard = ({ show }) => {
  const { GENRE_MAPPING, handleViewDetails } = usePodcast();

  // Function to map genre IDs to titles
  const getGenreTitles = (genreIds) => {
    return genreIds.map(id => GENRE_MAPPING[Number(id)] || 'Unknown').join(', ');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="flex-shrink-0 relative pt-[100%]">
        <img 
          src={show.image} 
          alt={show.title} 
          className="absolute inset-0 w-full h-full object-cover object-center rounded-t-xl" 
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = `https://placehold.co/400x400/e0e7ff/4338ca?text=${show.title.substring(0, 1).toUpperCase()}`; 
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
            <p><span className="font-medium text-gray-700">Last Updated:</span> {formatDate(show.updated)}</p>
          </div>
        </div>
        
        {/* Detail Button */}
        <div className="mt-4">
          <button
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-md"
            onClick={() => handleViewDetails(show.id)} 
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};


/** Renders the Search, Filter, and Sort Bar Component. */
const FilterBar = () => {
  const { 
    searchTerm, sortKey, activeGenreIds,
    handleSearchChange, handleSortChange, handleGenreSelect, handleReset,
    genres
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-sm"
          />
        </div>

        {/* Genre Filter */}
        <select
          value={selectedGenreId}
          onChange={handleGenreSelect}
          className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none shadow-sm"
        >
          <option value={0}>All Genres</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.title}</option>
          ))}
        </select>

        {/* Sort Options */}
        <select
          value={sortKey}
          onChange={handleSortChange}
          className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none shadow-sm"
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
          className="flex items-center space-x-1 text-sm font-medium text-gray-500 hover:text-indigo-600 transition duration-150"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};

/** Renders the Pagination Controls. */
const Pagination = () => {
  const { currentPage, totalPages, handlePageChange } = usePodcast();

  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const pages = [];
    const maxButtons = 5; 

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
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm'
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
        className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        Previous
      </button>
      
      <div className="flex space-x-2">
        {renderPageButtons()}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
      Next
      </button>
    </div>
  );
};


/** Renders the main grid of podcast cards. */
const ShowGrid = () => {
  const { paginatedShows, isLoading, error, totalItems } = usePodcast();

  if (isLoading) return <ListLoadingState />;
  if (error) return <ListErrorState error={error} />;
  
  if (totalItems === 0) {
    return (
      <div className="text-center py-20">
        <LayoutGrid className="mx-auto h-12 w-12 text-gray-400 mb-4" />
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

// --- NEW COMPONENT: SHOW DETAILS VIEW (PLACEHOLDER) ---

/** Renders the details for a specific podcast show. */
const ShowDetails = () => {
    const { detailedShow, isDetailsLoading, detailsError, handleCloseDetails } = usePodcast();

    // Loading State
    if (isDetailsLoading) {
        return (
            <div className="text-center py-20">
                <Loader2 className="mx-auto h-12 w-12 text-indigo-500 animate-spin" />
                <p className="mt-2 text-lg font-medium text-gray-600">Loading show details...</p>
            </div>
        );
    }

    // Error State
    if (detailsError) {
        return (
            <div className="text-center py-20 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-red-500 text-xl font-semibold">Details Error:</span>
                <p className="text-gray-600 mt-2">{detailsError}</p>
                <button 
                    onClick={handleCloseDetails}
                    className="mt-4 flex items-center mx-auto space-x-2 text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to List</span>
                </button>
            </div>
        );
    }

    // Placeholder Content until fully implemented
    if (!detailedShow) {
        return (
            <div className="text-center py-20">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h2 className="text-2xl font-bold text-gray-800 mt-4">Show Details Placeholder</h2>
                <p className="text-lg text-gray-600 mt-2">
                    {/* Display a dummy text or the selected ID */}
                    Details for a show ID are about to load here!
                </p>
                <div className="mt-6">
                    <button
                        onClick={handleCloseDetails}
                        className="flex items-center mx-auto space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to All Shows</span>
                    </button>
                </div>
            </div>
        );
    }
    
    // --- Actual Placeholder Rendering for the Fetched Detailed Show ---
    return (
        <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
            <button
                onClick={handleCloseDetails}
                className="flex items-center space-x-2 mb-6 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to All Shows</span>
            </button>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <img 
                    src={detailedShow.image} 
                    alt={detailedShow.title} 
                    className="w-full md:w-64 h-auto object-cover rounded-xl shadow-lg flex-shrink-0"
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = `https://placehold.co/400x400/e0e7ff/4338ca?text=${detailedShow.title.substring(0, 1).toUpperCase()}`; 
                    }}
                />
                
                <div className="flex-grow">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{detailedShow.title}</h1>
                    <p className="text-lg text-gray-600 mb-4">{detailedShow.description}</p>
                    
                    <div className="text-sm text-gray-700 space-y-1">
                        <p><span className="font-semibold text-indigo-600">Total Seasons:</span> {detailedShow.seasons.length}</p>
                        <p><span className="font-semibold text-indigo-600">Last Updated:</span> {formatDate(detailedShow.updated)}</p>
                    </div>

                    <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <p className="font-bold text-indigo-700">Next Step:</p>
                        <p className="text-sm text-indigo-600">This view now shows the fetched data! We need to implement the interactive seasons and episodes list below.</p>
                    </div>
                </div>
            </div>

            {/* Placeholder for Seasons and Episodes UI */}
            <div className="mt-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 border-b pb-2">Seasons</h2>
                <div className="text-gray-500">
                    <p>Episodes and playable audio will be rendered here.</p>
                </div>
            </div>
        </div>
    );
};


/** Renders either the List View or the Detail View based on state. */
const AppContent = () => {
    const { selectedShowId } = usePodcast();

    return selectedShowId ? <ShowDetails /> : (
        <>
            <FilterBar />
            <ShowGrid />
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
          <AppContent />
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
