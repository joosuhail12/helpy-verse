
import React from 'react';
import { LayoutList, LayoutGrid, AlignJustify } from 'lucide-react';
import { ViewMode } from '@/types/ticket';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-md">
      <button
        className={`p-1.5 rounded ${currentView === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
        onClick={() => onViewChange('list')}
        title="List view"
      >
        <LayoutList className="w-4 h-4" />
      </button>
      <button
        className={`p-1.5 rounded ${currentView === 'card' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
        onClick={() => onViewChange('card')}
        title="Card view"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        className={`p-1.5 rounded ${currentView === 'compact' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
        onClick={() => onViewChange('compact')}
        title="Compact view"
      >
        <AlignJustify className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ViewToggle;
