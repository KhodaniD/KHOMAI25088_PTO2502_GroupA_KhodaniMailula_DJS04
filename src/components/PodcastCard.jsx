import React from 'react';

/**
 * Helper function to format the date into a Month Name Day, YYYY string (e.g., "November 1, 2022").
 * This format precisely matches the style seen in the reference image.
 * @param {string} dateString - The ISO date string (e.g., "2022-11-01T00:00:00.000Z").
 * @returns {string} The formatted date string.
 */
const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    try {
        const date = new Date(dateString);
        
        // Use 'en-US' locale with specific options to ensure "Month Day, YYYY" format
        const options = {
            month: 'long',       // Full Month Name (e.g., November)
            day: 'numeric',      // Day (e.g., 1). Using 'numeric' removes leading zeros.
            year: 'numeric',     // YYYY (e.g., 2022)
        };

        // toLocaleDateString is the most reliable way to enforce this format
        return date.toLocaleDateString('en-US', options);

    } catch (error) {
        console.error("Error formatting date:", error);
        // Fallback gracefully
        return dateString; 
    }
};


/**
 * Renders a single podcast card for the grid view.
 * Uses React.memo for performance optimization.
 * @param {Object} props - The component props.
 * @param {Object} props.podcast - The podcast data object.
 * @returns {JSX.Element} The podcast card element.
 */
const PodcastCard = React.memo(({ podcast }) => {
  
  // FIX: Add check for undefined 'podcast' object to prevent "Cannot read properties of undefined" error
  if (!podcast) {
      console.warn("PodcastCard received null or undefined podcast prop.");
      return null; // Don't render anything if data is missing
  }
    
  // Ensure the image URL is valid or use a placeholder
  const imageUrl = podcast.image || 'https://placehold.co/600x600/cccccc/333333?text=No+Image';
  const formattedDate = formatDate(podcast.updated);

  return (
    <div className="podcast-card" title={podcast.title}>
      <img 
        src={imageUrl} 
        alt={`Cover art for ${podcast.title}`} 
        className="podcast-image"
        onError={(e) => {
          // Fallback if image fails to load
          e.target.onerror = null; 
          e.target.src = 'https://placehold.co/600x600/cccccc/333333?text=No+Image';
        }}
      />
      <div className="card-content">
        <div>
          <h3 className="podcast-title">{podcast.title}</h3>
          
          <p className="podcast-seasons">
            {podcast.seasons} {podcast.seasons === 1 ? 'season' : 'seasons'}
          </p>
        </div>
        
        <div>
          <p className="podcast-genre">
            {podcast.genres.join(', ')}
          </p>
          
          {/* Display the fixed date format: Updated November 1, 2022 */}
          <p className="podcast-updated">
            Updated {formattedDate}
          </p>
        </div>
      </div>
    </div>
  );
});

export default PodcastCard;
