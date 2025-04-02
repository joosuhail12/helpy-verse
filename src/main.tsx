
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Explicitly check if React is properly loaded
if (!React || !React.createElement) {
  console.error("React is not properly initialized in main.tsx");
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
