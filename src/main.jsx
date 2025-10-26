import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// CRITICAL FIX: Imports the renamed file/component
import MainApp from './MainApp.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
)
