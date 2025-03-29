
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AppProviders from './components/app/AppProviders'

// Ensure React is properly initialized by using the createRoot API
// and wrapping the entire app with AppProviders here instead of in App.tsx
const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
