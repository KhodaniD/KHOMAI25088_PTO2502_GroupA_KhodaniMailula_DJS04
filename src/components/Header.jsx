import React from 'react';

/**
 * Renders the main application header with the fa-podcast icon and title.
 * @returns {JSX.Element} The header component.
 */
const Header = () => {
  return (
    <>
      {/* Load Font Awesome CSS using a standard link tag for CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" 
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLMDJ8K4ThzOQ+0tD+Kz6U1r44w67yN5k84mF2tW+J8xN9eA3f7B4F9Q4A2v5z5w==" 
        crossOrigin="anonymous" 
        referrerPolicy="no-referrer" 
      />

      <header className="app-header">
        <div className="app-logo-container">
          
          {/* Font Awesome Podcast Icon (fa-podcast) */}
          <i 
            className="fas fa-podcast podcast-icon" 
            style={{ 
              fontSize: '1.5em', 
              marginRight: '8px', 
              color: '#333' 
            }}
          ></i>
          
          {/* FIX: Correct Application Title */}
          <h1 className="app-title">Podcast App</h1>
        </div>
      </header>
    </>
  );
};

export default Header;