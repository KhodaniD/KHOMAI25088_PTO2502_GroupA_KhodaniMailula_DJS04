import React from 'react';

/**
 * Renders a stylized loading spinner or an error message based on props.
 * This component relies on the .status-message and .spinner styles defined in MainApp.css.
 * * @param {Object} props - The component props.
 * @param {string} props.message - The message text to display (e.g., "Loading podcasts...").
 * @param {boolean} props.isError - True if the message indicates an error.
 * @returns {JSX.Element} The loading or error message container.
 */
export function LoadingAndError({ message, isError }) {
  const className = `status-message ${isError ? 'error' : 'loading'}`;

  return (
    <div className={className}>
      <p>{message}</p>
      {/* Show spinner only if NOT an error */}
      {!isError && <div className="spinner"></div>}
    </div>
  );
}