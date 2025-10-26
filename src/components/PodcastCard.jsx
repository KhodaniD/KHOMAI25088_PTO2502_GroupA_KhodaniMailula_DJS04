import React from 'react';

const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    try {
        const date = new Date(dateString);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return dateString; 
    }
};

const PodcastCard = React.memo(({ podcast }) => {
  
  if (!podcast) return null;
    
  const imageUrl = podcast.image || 'https://placehold.co/600x600/cccccc/333333?text=No+Image';
  const formattedDate = formatDate(podcast.updated);

  return (
    <div className="podcast-card" title={podcast.title}>
      <img 
        src={imageUrl} 
        alt={`Cover art for ${podcast.title}`} 
        className="podcast-image"
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src = 'https://placehold.co/600x600/cccccc/333333?text=No+Image';
        }}
      />
      <div className="card-content">
        <h3 className="podcast-title">{podcast.title}</h3>
        
        <p className="podcast-seasons">
          {podcast.seasons} {podcast.seasons === 1 ? 'season' : 'seasons'}
        </p>

        {/* CRITICAL FIX: Maps over the 'podcast.genreTitles' array (the names) */}
        {podcast.genreTitles && podcast.genreTitles.map(title => (
          <p key={title} className="podcast-genre">
            {title}
          </p>
        ))}
        
        <p className="podcast-updated">
          Updated {formattedDate}
        </p>
      </div>
    </div>
  );
});

export default PodcastCard;