# DJSL04: React Podcast App: Search, Sort, Filter, and Pagination

---

## Project Title

**React Podcast App**

---

## Project Description

This project develops an **advanced podcast browsing experience** by implementing all core requirements for the DJS04 scope: **dynamic Search, Sort, Filter, and Pagination**. The application successfully manages complex UI state, synchronizing multiple user interactions in real time while maintaining a consistent and seamless user experience.

The core achievement was establishing a **centralized state management system** within `MainApp.jsx` using React Hooks (`useState`, `useMemo`) to ensure all user controls reflect changes immediately and persist state across page navigation. This project delivers a production-ready, modular, and fully functional podcast browser.

---

## Technologies Used

* **React (Functional Components & Hooks):** Core framework using **`useState`** for state management, **`useEffect`** for lifecycle events/data fetching, and **`useMemo`** for optimized filtering and sorting.
* **JavaScript (ES6+):** Powers all dynamic behavior, including complex array manipulation for filtering and sorting.
* **Fetch API:** Utilized to asynchronously retrieve data from the external podcast API.
* **CSS3 & Responsive Design:** Ensures the layout adapts effectively across desktop, tablet, and mobile views using **CSS Grid and Flexbox**.
* **Font Awesome (via CDN):** Used for the professional, scalable podcast icon in the header.
* **ES Modules:** Used for clean, modular code organization.

---

## Features

### Core Objectives (Search, Sort, Filter, Pagination)

| Feature | Status | 
| :--- | :--- | :--- |
| **Search Functionality** | ✅ Implemented | Allows flexible searching by **any part of the podcast title** and updates results dynamically as the user types. |
| **Sorting Options** | ✅ Implemented | Allows sorting by **Newest/Oldest updated date** and **Title A–Z / Z–A**. Sorting works in tandem with active search/filter criteria. |
| **Filtering (Genre)** | ✅ Implemented | Enables **genre-based filtering** using the dropdown input, correctly mapping API IDs to titles using the local `data.js` file. |
| **Pagination** | ✅ Implemented | Displays results in manageable pages (12 items per page). Pagination **respects all active search/filter/sort states** and keeps UI selections intact. |
| **State Synchronisation** | ✅ Implemented | State is centralized in `MainApp.jsx` using `useMemo` to ensure **all controls reflect and synchronize** changes immediately and persistently. |

### Additional Quality & Maintainability

* **Header & Layout:** Implemented the correct, minimalist header layout (Icon and "Podcast App" title) and ensured the search bar is correctly placed on the left, with filters on the right.
* **Code Quality & Documentation:** All major functions are documented with JSDoc comments. The codebase maintains consistent, clean, and modular formatting.
* **Accessibility Fixes:** Fixed accessibility issues by adding a necessary `id` attribute to the search input field.
* **Conditional State Display:** Displays a **loading indicator** during data fetch and handles error states cleanly.

---

## Setup Instructions

To run this React project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone: [https://github.com/KhodaniD/KHOMAI25088_PTO2502_GroupA_KhodaniMailula_DJS04]
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd KHOMAI25088_PTO2502_GroupA_KhodaniMailula_DJS04 # Replace with your actual project folder name if different 
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will automatically open in your browser, typically at `http://localhost:5173`.

---

## Working Usage Examples

### Verification Checklist:

| Functionality | Verification |
| :--- | :--- |
| **Genre Mapping** | Numerical IDs are correctly converted to readable **text names** (e.g., "True Crime, History") on the podcast cards. |
| **Search & Sort** | Searching for a term and applying a sort order (e.g., "Oldest") correctly displays the filtered results. |
| **Filter Persistence** | Selecting a genre filter and navigating through pages maintains the selected genre across all pages. |
| **UI Consistency** | Header displays the correct icon and "Podcast App" title; the search bar is on the left; and dropdowns show only one arrow. |
| **Code Success** | No console errors or broken UI are present on load. |