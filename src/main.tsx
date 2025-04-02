
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Explicitly check if React is properly loaded
if (!React || !React.createElement) {
  console.error("React is not properly initialized in main.tsx");
  throw new Error("React not properly initialized");
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// Create root and render with StrictMode for development checks
const root = ReactDOM.createRoot(rootElement);

// Wrap the entire app in React.StrictMode for development checks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
