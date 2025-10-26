import React, { useState, useEffect, useMemo } from 'react';
import { genres, GENRE_MAPPING } from './data';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import PodcastGrid from './components/PodcastGrid';
import PaginationControls from './components/PaginationControls';
import LoadingAndError from './components/LoadingAndError';
import './App.css'; // We'll create this file for styling

// Define how many items to show per page
const ITEMS_PER_PAGE = 12;

/**
 * The main application component.
 * Manages all application state, data fetching, and business logic.
 * @returns {JSX.Element} The rendered React application.
 */
function App() {
  // --- State Declarations ---

  // State for storing the complete, unfiltered list of podcasts from the API
  const [allPodcasts, setAllPodcasts] = useState([]);
  
  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Control States ---

  // State for the search input
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for the selected genre filter ('' means 'All Genres')
  const [selectedGenre, setSelectedGenre] = useState('');
  
  // State for the sort order ('newest', 'a-z', 'z-a')
  const [sortOrder, setSortOrder] = useState('newest');
  
  // State for the current pagination page
  const [currentPage, setCurrentPage] = useState(1);

  // --- Data Fetching ---

  /**
   * Fetches all podcast data from the API when the component mounts.
   */
  useEffect(() => {
    const fetchPodcasts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://podcast-api.netlify.app');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAllPodcasts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcasts();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Derived State (Filtering, Sorting) ---

  /**
   * Calculates the filtered and sorted list of podcasts.
   * This `useMemo` hook re-runs only when the source data or any
   * of the control states (searchTerm, selectedGenre, sortOrder) change.
   * @returns {Array} The processed list of podcasts.
   */
  const filteredAndSortedPodcasts = useMemo(() => {
    let processedPodcasts = [...allPodcasts];

    // 1. Apply Search Filter
    if (searchTerm) {
      processedPodcasts = processedPodcasts.filter(podcast =>
        podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Apply Genre Filter
    if (selectedGenre) {
      processedPodcasts = processedPodcasts.filter(podcast =>
        podcast.genres.includes(Number(selectedGenre))
      );
    }

    // 3. Apply Sorting
    switch (sortOrder) {
      case 'a-z':
        processedPodcasts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        processedPodcasts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
      default:
        processedPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
    }

    return processedPodcasts;
  }, [allPodcasts, searchTerm, selectedGenre, sortOrder]);

  // --- Pagination Logic ---

  /**
   * Resets the current page to 1 whenever the filters or sort order change,
   * ensuring the user always starts at the beginning of a new list.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGenre, sortOrder]);

  /**
   * Calculates the final list of podcasts to display for the current page.
   * This `useMemo` hook re-runs only when the filtered list or the current page changes.
   * @returns {Array} The "sliced" list of podcasts for the current page.
   */
  const paginatedPodcasts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedPodcasts.slice(startIndex, endIndex);
  }, [filteredAndSortedPodcasts, currentPage]);

  // Calculate total pages needed for pagination
  const totalPages = Math.ceil(filteredAndSortedPodcasts.length / ITEMS_PER_PAGE);

  // --- Event Handlers ---

  /**
   * Resets all filters and controls to their default values.
   */
  const handleReset = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSortOrder('newest');
    setCurrentPage(1);
  };

  // --- Render Logic ---

  if (isLoading) {
    return <LoadingAndError message="Loading podcasts..." />;
  }

  if (error) {
    return <LoadingAndError message={`Error: ${error}`} isError={true} />;
  }

  return (
    <div className="App">
      <Header />
      
      <main>
        <ControlPanel
          // Search props
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          
          // Genre props
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreChange={(e) => setSelectedGenre(e.target.value)}
          
          // Sort props
          sortOrder={sortOrder}
          onSortChange={(e) => setSortOrder(e.target.value)}
          
          // Reset action
          onReset={handleReset}
        />
        
        <div className="results-info">
          Showing {paginatedPodcasts.length} of {filteredAndSortedPodcasts.length} results
        </div>
        
        <PodcastGrid
          podcasts={paginatedPodcasts}
          genreMapping={GENRE_MAPPING}
        />
        
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </main>
    </div>
  );
}

export default App;