
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'

const container = document.getElementById('root')

if (!container) {
  console.error('Failed to find root element')
  throw new Error('Failed to find root element')
}

const root = createRoot(container)

try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
} catch (error) {
  console.error('Error rendering app:', error)
  root.render(
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500">
        Failed to load application. Please check console for errors.
      </div>
    </div>
  )
}
