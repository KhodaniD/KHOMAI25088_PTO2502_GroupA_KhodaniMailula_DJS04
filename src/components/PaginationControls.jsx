import React from 'react';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // Don't render if there's only one page
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Function to render page buttons
  const renderPageButtons = () => {
    const buttons = [];
    const maxButtons = 5; 
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end === totalPages) {
      start = Math.max(1, totalPages - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          // Use class names for styling in MainApp.css
          className={`page-button ${i === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
          disabled={i === currentPage}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    // Use class name for styling the container in MainApp.css
    <div className="pagination-controls">
      <button 
        onClick={handlePrev} 
        disabled={currentPage === 1}
        className="nav-button"
      >
        Previous
      </button>

      {renderPageButtons()}

      <button 
        onClick={handleNext} 
        disabled={currentPage === totalPages}
        className="nav-button"
      >
        Next
      </button>
    </div>
  );
};

// *** This default export resolves your "does not provide an export named 'default'" error ***
export default PaginationControls;