
// Export everything from the slice
import { cannedResponsesReducer } from './cannedResponsesSlice';
import * as cannedResponsesActions from './actions';

export { cannedResponsesReducer, cannedResponsesActions };

// Export specific actions for convenience
export * from './actions';

export default cannedResponsesReducer;
