import React from 'react';

/**
 * Renders the main application header with the fa-podcast icon and the corrected title.
 * The styling for the icon is managed in MainApp.css.
 * @returns {JSX.Element} The header component.
 */
const Header = () => {
  return (
    <>
      {/* Load Font Awesome CSS without integrity checks to ensure the icon loads */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" 
      />

      <header className="app-header">
        {/* Container for the icon and title */}
        <div className="app-logo-container">
          
          {/* Font Awesome Podcast Icon (fa-podcast) */}
          <i 
            className="fas fa-podcast podcast-icon" 
            // Inline styling removed, now controlled by MainApp.css
          ></i>
          
          {/* Correct Application Title */}
          <h1 className="app-title">Podcast App</h1>
        </div>
      </header>
    </>
  );
};

export default Header;