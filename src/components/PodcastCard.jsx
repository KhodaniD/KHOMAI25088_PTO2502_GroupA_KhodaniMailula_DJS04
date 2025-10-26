// src/components/PodcastCard.jsx

import React from 'react';

const PodcastCard = ({ podcast, genreMapping }) => {
  // Ensure the component handles missing data gracefully
  if (!podcast) {
    return null;
  }

  // Logic to find the primary genre name
  const primaryGenreId = podcast.genres && podcast.genres.length > 0 
    ? podcast.genres[0] 
    : null;
    
  const genreName = primaryGenreId 
    ? (genreMapping[primaryGenreId] || 'Unknown Genre') 
    : 'No Genre';

  return (
    // Uses the class names we discussed for styling in MainApp.css
    <div className="podcast-card"> 
      <img 
        src={podcast.image} 
        alt={`Cover for ${podcast.title}`} 
        className="podcast-image"
      />
      <div className="card-content">
        <h3 className="podcast-title">{podcast.title}</h3>
        <p className="podcast-seasons">Seasons: {podcast.seasons}</p>
        
        <span className="podcast-genre">
          {genreName}
        </span>
        
        <p className="podcast-updated">
          Updated: {new Date(podcast.updated).toLocaleDateString()}
        </p>
      </div>
      {/* A link or button to view show details would go here */}
    </div>
  );
};

// *** This default export finally satisfies the import in PodcastGrid.jsx ***
export default PodcastCard;