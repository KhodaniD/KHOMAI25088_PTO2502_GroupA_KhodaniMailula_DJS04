import React from 'react';
// The path MUST be relative to the current file location (inside components folder)
import PodcastCard from './PodcastCard.jsx'; 

const PodcastGrid = ({ podcasts, genreMapping }) => {
  return (
    <div className="podcast-grid">
      {podcasts.map(podcast => (
        <PodcastCard
          key={podcast.id}
          podcast={podcast}
          genreMapping={genreMapping}
        />
      ))}
    </div>
  );
};

export default PodcastGrid;