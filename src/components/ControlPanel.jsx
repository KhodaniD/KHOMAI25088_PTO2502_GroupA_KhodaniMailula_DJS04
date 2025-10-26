import React from 'react';

/**
 * Renders the control panel with search, filter, and sort inputs.
 * @param {Object} props - Component props.
 * @param {string} props.searchTerm - The current value of the search input.
 * @param {Function} props.onSearchChange - Handler for search input changes.
 * @param {Array<Object>} props.genres - The list of all available genres.
 * @param {string} props.selectedGenre - The ID of the currently selected genre.
 * @param {Function} props.onGenreChange - Handler for genre select changes.
 * @param {string} props.sortOrder - The current sort order.
 * @param {Function} props.onSortChange - Handler for sort select changes.
 * @param {Function} props.onReset - Handler for the reset button.
 * @returns {JSX.Element}
 */
const ControlPanel = ({
  searchTerm,
  onSearchChange,
  genres,
  selectedGenre,
  onGenreChange,
  sortOrder,
  onSortChange,
  onReset
}) => {
  return (
    <div className="control-panel">
      {/* --- Search Input --- */}
      <div className="control-group">
        <label htmlFor="search" className="visually-hidden">Search by title:</label>
        <input
          type="search"
          id="search"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>

      {/* --- Genre Filter --- */}
      <div className="control-group">
        <label htmlFor="genre-select">Genre:</label>
        <select id="genre-select" value={selectedGenre} onChange={onGenreChange}>
          <option value="">All Genres</option>
          {/* Map over the genres from data.js */}
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.title}
            </option>
          ))}
        </select>
      </div>

      {/* --- Sort Dropdown --- */}
      <div className="control-group">
        <label htmlFor="sort-select">Sort:</label>
        <select id="sort-select" value={sortOrder} onChange={onSortChange}>
          <option value="newest">Newest</option>
          <option value="a-z">Title (A-Z)</option>
          <option value="z-a">Title (Z-A)</option>
        </select>
      </div>

      {/* --- Reset Button --- */}
      <button onClick={onReset} className="reset-button" title="Reset Filters">
        {/* You can use an icon or text */}
        <span role="img" aria-label="Reset">🔄</span> Reset Filters
      </button>
    </div>
  );
};

export default ControlPanel;