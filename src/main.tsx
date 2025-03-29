
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Ensure React is initialized properly before any components are rendered
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
