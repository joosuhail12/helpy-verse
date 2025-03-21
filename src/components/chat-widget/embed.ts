
/**
 * Embed script for Pullse Chat Widget
 * This script can be used to embed the chat widget on any website
 */

interface PullseChatOptions {
  workspaceId: string;
  primaryColor?: string;
  position?: 'right' | 'left';
  welcomeMessage?: string;
  agentName?: string;
  hideOnPaths?: string[];
}

// Define the global Pullse object
declare global {
  interface Window {
    Pullse: {
      init: (options: PullseChatOptions) => void;
      open: () => void;
      close: () => void;
      toggle: () => void;
    };
  }
}

const defaultOptions: PullseChatOptions = {
  workspaceId: '',
  primaryColor: '#9b87f5',
  position: 'right',
  welcomeMessage: 'How can we help you today?',
  agentName: 'Support Team',
  hideOnPaths: [],
};

let isInitialized = false;
let widgetOptions = { ...defaultOptions };
let widgetIframe: HTMLIFrameElement | null = null;
let widgetContainer: HTMLDivElement | null = null;

/**
 * Initialize the chat widget with the provided options
 */
const init = (options: PullseChatOptions) => {
  if (isInitialized) {
    console.warn('Pullse Chat Widget is already initialized.');
    return;
  }

  if (!options.workspaceId) {
    console.error('Pullse Chat Widget: workspaceId is required for initialization.');
    return;
  }

  // Merge options with defaults
  widgetOptions = { ...defaultOptions, ...options };
  
  // Check if widget should be hidden on current path
  const currentPath = window.location.pathname;
  if (widgetOptions.hideOnPaths?.some(path => currentPath.includes(path))) {
    console.log(`Pullse Chat Widget: Hidden on path ${currentPath}`);
    return;
  }

  // Create widget container
  widgetContainer = document.createElement('div');
  widgetContainer.id = 'pullse-chat-widget-container';
  widgetContainer.style.position = 'fixed';
  widgetContainer.style.bottom = '20px';
  widgetContainer.style[widgetOptions.position || 'right'] = '20px';
  widgetContainer.style.zIndex = '999999';
  document.body.appendChild(widgetContainer);

  // Create launcher button 
  const launcherButton = document.createElement('button');
  launcherButton.id = 'pullse-chat-launcher';
  launcherButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `;
  launcherButton.style.backgroundColor = widgetOptions.primaryColor;
  launcherButton.style.color = 'white';
  launcherButton.style.border = 'none';
  launcherButton.style.borderRadius = '50%';
  launcherButton.style.width = '56px';
  launcherButton.style.height = '56px';
  launcherButton.style.cursor = 'pointer';
  launcherButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  launcherButton.style.display = 'flex';
  launcherButton.style.justifyContent = 'center';
  launcherButton.style.alignItems = 'center';
  
  // Add click event to launcher button
  launcherButton.addEventListener('click', toggle);
  
  // Add launcher to container
  widgetContainer.appendChild(launcherButton);
  
  // Mark as initialized
  isInitialized = true;
  console.log('Pullse Chat Widget initialized successfully.');
};

/**
 * Open the chat widget
 */
const open = () => {
  if (!isInitialized || !widgetContainer) {
    console.error('Pullse Chat Widget is not initialized. Call init() first.');
    return;
  }

  // Remove launcher button
  const launcherButton = document.getElementById('pullse-chat-launcher');
  if (launcherButton) {
    launcherButton.style.display = 'none';
  }

  // Create iframe if it doesn't exist
  if (!widgetIframe) {
    widgetIframe = document.createElement('iframe');
    widgetIframe.id = 'pullse-chat-iframe';
    widgetIframe.src = `https://widget.pullse.ai/chat/${widgetOptions.workspaceId}`;
    widgetIframe.style.border = 'none';
    widgetIframe.style.width = '350px';
    widgetIframe.style.height = '500px';
    widgetIframe.style.borderRadius = '12px';
    widgetIframe.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
    widgetIframe.style.backgroundColor = 'white';
    
    // Add messaging to pass options to iframe
    widgetIframe.onload = () => {
      widgetIframe?.contentWindow?.postMessage({
        type: 'PULLSE_CHAT_OPTIONS',
        options: widgetOptions
      }, '*');
    };
    
    widgetContainer.appendChild(widgetIframe);
  } else {
    widgetIframe.style.display = 'block';
  }
};

/**
 * Close the chat widget
 */
const close = () => {
  if (!isInitialized || !widgetContainer) return;

  // Hide iframe
  if (widgetIframe) {
    widgetIframe.style.display = 'none';
  }

  // Show launcher button
  const launcherButton = document.getElementById('pullse-chat-launcher');
  if (launcherButton) {
    launcherButton.style.display = 'flex';
  }
};

/**
 * Toggle the chat widget open/closed
 */
const toggle = () => {
  if (!widgetIframe || widgetIframe.style.display === 'none') {
    open();
  } else {
    close();
  }
};

// Expose the public API
window.Pullse = {
  init,
  open,
  close,
  toggle
};

// For npm package usage
export default {
  init,
  open,
  close,
  toggle
};
