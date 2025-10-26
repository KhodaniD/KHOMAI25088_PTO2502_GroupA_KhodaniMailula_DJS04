import React from 'react';

/**
 * Renders the search, filter, and sort controls in the minimalist style, 
 * matching the visual layout of the reference image.
 * * @param {Object} props - The component props.
 * @param {string} props.searchTerm - The current search term.
 * @param {function} props.onSearchChange - Handler for search input change.
 * @param {Array<Object>} props.genres - List of genre objects.
 * @param {string} props.selectedGenre - The currently selected genre ID.
 * @param {function} props.onGenreChange - Handler for genre select change.
 * @param {string} props.sortOrder - The currently selected sort order.
 * @param {function} props.onSortChange - Handler for sort select change.
 * @param {function} props.onReset - Handler to reset all filters.
 * @returns {JSX.Element} The control panel element.
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
      
      {/* Search Bar matching the image style: "Search podcasts..." */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search podcasts..."
          value={searchTerm}
          onChange={onSearchChange}
          className="control-input"
          aria-label="Search by podcast title"
        />
      </div>

      {/* Grouped Select Controls */}
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
            {/* The structure of 'genres' is assumed to be [{ id: 1, name: 'Comedy' }, ...] */}
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
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
            {/* The actual sort options here depend on your application logic, 
                but these are standard options. */}
            <option value="newest">Default</option> {/* Set a clean default visible option */}
            <option value="updated_desc">Recently Updated</option>
            <option value="a-z">A-Z Title</option>
            <option value="z-a">Z-A Title</option>
          </select>
        </div>

        {/* Reset Button - hidden via CSS in MainApp.css */}
        <button onClick={onReset} className="reset-button">
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
