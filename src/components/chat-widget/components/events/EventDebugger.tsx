
import React, { useState, useEffect } from 'react';
import { Trash, Play, Pause, Download } from 'lucide-react';
import { useEventSystem } from '@/hooks/useEventSystem';
import { ChatEventType, ChatEventUnion } from '@/utils/events/eventTypes';

interface EventDebuggerProps {
  maxEvents?: number;
  isVisible?: boolean;
  onClose?: () => void;
}

const EventDebugger: React.FC<EventDebuggerProps> = ({ 
  maxEvents = 50,
  isVisible = true,
  onClose
}) => {
  const [events, setEvents] = useState<ChatEventUnion[]>([]);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState('');
  const eventSystem = useEventSystem();

  // Subscribe to events
  useEffect(() => {
    if (paused || !isVisible) return;
    
    const unsubscribe = eventSystem.subscribe(ChatEventType.WIDGET_OPENED, (event: ChatEventUnion) => {
      setEvents(prev => [event, ...prev].slice(0, maxEvents));
    });
    
    // Subscribe to all events using wildcard
    const unsubscribeAll = eventSystem.addEventListener('*', (event: ChatEventUnion) => {
      setEvents(prev => [event, ...prev].slice(0, maxEvents));
    });
    
    return () => {
      unsubscribe();
      unsubscribeAll();
    };
  }, [paused, maxEvents, eventSystem, isVisible]);

  // Clear events
  const clearEvents = () => {
    setEvents([]);
  };
  
  // Export events as JSON
  const exportEvents = () => {
    const jsonString = JSON.stringify(events, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-events-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter events
  const filteredEvents = filter
    ? events.filter(event => 
        JSON.stringify(event).toLowerCase().includes(filter.toLowerCase())
      )
    : events;

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-gray-800 text-gray-100 p-3 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Event Debugger</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setPaused(!paused)} 
            className="p-1 rounded hover:bg-gray-700"
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          <button 
            onClick={clearEvents} 
            className="p-1 rounded hover:bg-gray-700"
          >
            <Trash className="h-4 w-4" />
          </button>
          <button 
            onClick={exportEvents} 
            className="p-1 rounded hover:bg-gray-700"
          >
            <Download className="h-4 w-4" />
          </button>
          {onClose && (
            <button 
              onClick={onClose} 
              className="p-1 rounded hover:bg-gray-700"
            >
              &times;
            </button>
          )}
        </div>
      </div>
      
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter events..."
        className="w-full px-2 py-1 bg-gray-700 text-gray-100 rounded mb-2 text-sm"
      />
      
      <div className="flex-1 overflow-auto">
        {filteredEvents.length === 0 ? (
          <div className="text-gray-500 text-center mt-4">
            {filter ? "No events matching filter" : "No events recorded"}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEvents.map((event, index) => (
              <div 
                key={index} 
                className="p-2 rounded bg-gray-700 text-xs font-mono"
              >
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-green-400">{event.type}</span>
                  <span className="text-gray-400">{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
                <pre className="text-gray-300 overflow-x-auto text-xs">
                  {JSON.stringify(event, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDebugger;
