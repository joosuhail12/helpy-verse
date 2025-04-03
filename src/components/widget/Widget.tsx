
import React from 'react';
import { useWidgetState } from '@/context/WidgetContext';

interface WidgetProps {
  id: string;
  title: string;
}

const Widget: React.FC<WidgetProps> = ({ id, title }) => {
  const { state, dispatch } = useWidgetState();
  
  const handleOpenWidget = () => {
    dispatch({ type: 'OPEN_WIDGET', payload: id });
  };
  
  const handleCloseWidget = () => {
    dispatch({ type: 'CLOSE_WIDGET' });
  };
  
  return (
    <div className="border rounded-md shadow-sm p-4 bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        <button
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={state.isOpen && state.activeWidget === id ? handleCloseWidget : handleOpenWidget}
        >
          {state.isOpen && state.activeWidget === id ? 'Close' : 'Open'}
        </button>
      </div>
      
      {state.isOpen && state.activeWidget === id && (
        <div className="mt-2">
          <p className="text-gray-600 dark:text-gray-300">Widget content goes here</p>
          <div className="mt-2 flex justify-end">
            <button
              className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm"
              onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' })}
            >
              Toggle Theme
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Widget;
