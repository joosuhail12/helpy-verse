
// Re-export from refactored modules
export { 
  connectionOptions,
  initializeAbly,
  getAblyInstance,
  setAblyInstance
} from './connection/connectionManager';

export { cleanupAblyConnection } from './connection/cleanup';

// Re-export event handlers registry
export { eventHandlers } from './events/eventRegistry';
