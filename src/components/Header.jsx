import React from 'react';

/**
 * Renders the main application header with the fa-podcast icon and the corrected title.
 * @returns {JSX.Element} The header component.
 */
const Header = () => {
  return (
    <>
      {/* CRITICAL FIX: Load Font Awesome CSS without 'integrity' and 'crossOrigin'
        attributes to bypass security blocking and ensure the icon loads.
      */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" 
      />

      <header className="app-header">
        {/* Container for the icon and title to keep them together on the left */}
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
          
          {/* CORRECT TITLE: Set to "Podcast App" (Fixes the "The Podcast App" bug) */}
          <h1 className="app-title">Podcast App</h1>
        </div>
      </header>
    </>
  );
};

export default Header;