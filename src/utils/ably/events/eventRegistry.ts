
// Event listeners storage for cleanup
export const eventHandlers: Record<string, Function[]> = {};

/**
 * Register an event handler
 */
export const registerEventHandler = (
  eventKey: string, 
  handler: Function
): void => {
  if (!eventHandlers[eventKey]) {
    eventHandlers[eventKey] = [];
  }
  eventHandlers[eventKey].push(handler);
};

/**
 * Remove an event handler
 */
export const removeEventHandler = (
  eventKey: string, 
  handler: Function
): void => {
  if (eventHandlers[eventKey]) {
    const index = eventHandlers[eventKey].indexOf(handler);
    if (index !== -1) {
      eventHandlers[eventKey].splice(index, 1);
    }
  }
};

/**
 * Clear all event handlers for a key
 */
export const clearEventHandlers = (eventKey: string): void => {
  if (eventHandlers[eventKey]) {
    delete eventHandlers[eventKey];
  }
};

/**
 * Clear all event handlers
 */
export const clearAllEventHandlers = (): void => {
  Object.keys(eventHandlers).forEach(key => {
    delete eventHandlers[key];
  });
};
