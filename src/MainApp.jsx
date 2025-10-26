import React, { useState, useEffect, useMemo } from 'react';
// Correct import for sibling data file
import { genres, GENRE_MAPPING } from './utils/data.js'; 
import Header from './components/Header.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import PodcastGrid from './components/PodcastGrid.jsx';
import PaginationControls from './components/PaginationControls.jsx';
import { LoadingAndError } from "./components/LoadingAndError.jsx";
import './MainApp.css'; 

const ITEMS_PER_PAGE = 12;

function MainApp() {
  const [allPodcasts, setAllPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(''); 
  const [sortOrder, setSortOrder] = useState('newest'); 
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPodcasts = async () => {
      setIsLoading(true);
      try {
        // Fetch data from the API
        const response = await fetch('https://podcast-api.netlify.app');
        if (!response.ok) {
          throw new Error('Failed to fetch podcast data.');
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
  }, []);

  const filteredAndSortedPodcasts = useMemo(() => {
    let processedPodcasts = [...allPodcasts];
    
    // Filter by search term
    if (searchTerm) {
      processedPodcasts = processedPodcasts.filter(podcast =>
        podcast.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by selected genre
    if (selectedGenre) {
      processedPodcasts = processedPodcasts.filter(podcast =>
        podcast.genres.includes(Number(selectedGenre))
      );
    }
    
    // Sort logic
    switch (sortOrder) {
      case 'a-z':
        processedPodcasts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        processedPodcasts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'oldest':
        processedPodcasts.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      case 'newest':
      default:
        // Default to newest
        processedPodcasts.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
    }

    return processedPodcasts;
  }, [allPodcasts, searchTerm, selectedGenre, sortOrder]);

  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGenre, sortOrder]);

  // Pagination logic
  const paginatedPodcasts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedPodcasts.slice(startIndex, endIndex);
  }, [filteredAndSortedPodcasts, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedPodcasts.length / ITEMS_PER_PAGE);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSortOrder('newest');
    setCurrentPage(1);
  };

  if (isLoading || error) {
    return <LoadingAndError 
             message={isLoading ? "Loading podcasts..." : `Error: ${error}`}
             isError={!!error}
           />;
  }

  return (
    <div className="App">
      <Header />
      
      <main>
        <ControlPanel
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreChange={(e) => setSelectedGenre(e.target.value)}
          sortOrder={sortOrder}
          onSortChange={(e) => setSortOrder(e.target.value)}
          onReset={handleReset}
        />
        
        <div className="results-info">
          Showing {paginatedPodcasts.length} of {filteredAndSortedPodcasts.length} results
        </div>

        {filteredAndSortedPodcasts.length === 0 ? (
          <div className="no-results-message">
            No podcasts found matching your criteria. Try resetting the filters.
          </div>
        ) : (
          <PodcastGrid
            podcasts={paginatedPodcasts}
            genreMapping={GENRE_MAPPING}
          />
        )}
        
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}

export default MainApp;
