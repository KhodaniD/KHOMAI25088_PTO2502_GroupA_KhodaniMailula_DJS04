import React from 'react';

/**
 * Renders the search, filter, and sort controls.
 */
const ControlPanel = ({
  searchTerm,
  onSearchChange,
  genres,
  selectedGenre,
  onGenreChange,
  sortOrder,
  onSortChange,
  onReset,
}) => {
  return (
    <div className="control-panel">
      
      {/* Search Bar - Positioned first for Left placement by CSS */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search podcasts..."
          value={searchTerm}
          // FIX: Added 'id' to fix accessibility warning ("A form field element should have an id...")
          id="search-input" 
          onChange={onSearchChange}
          className="control-input"
          aria-label="Search by podcast title"
        />
      </div>

      {/* Grouped Select Controls - Positioned second for Right placement by CSS */}
      <div className="control-group">
        
        {/* Genre Select */}
        <div className="control-select-wrapper">
          <label htmlFor="genre-select" className="control-label">Genre:</label>
          <select
            id="genre-select"
            value={selectedGenre}
            onChange={onGenreChange}
            className="control-select"
            aria-label="Select Genre Filter"
          >
            <option value="">All Genres</option>
            {/* FIX: Uses genre.title, relies on correct data.js export */}
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.title} 
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className="control-select-wrapper">
          <label htmlFor="sort-select" className="control-label">Sort:</label>
          <select
            id="sort-select"
            value={sortOrder}
            onChange={onSortChange}
            className="control-select"
            aria-label="Select Sort Order"
          >
            <option value="newest">Default</option>
            <option value="a-z">A-Z Title</option>
            <option value="z-a">Z-A Title</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <button onClick={onReset} className="reset-button">
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;