
import React, { useState, useEffect } from 'react';
import { X, ChevronUp, ChevronDown, Code } from 'lucide-react';
import { useEventSystem } from '@/hooks/useEventSystem';
import { ChatEventType, ChatEventUnion } from '@/utils/events/eventTypes';

interface EventDebuggerProps {
  isVisible: boolean;
  onClose: () => void;
}

const EventDebugger: React.FC<EventDebuggerProps> = ({ isVisible, onClose }) => {
  const [events, setEvents] = useState<ChatEventUnion[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<string>('');
  const eventSystem = useEventSystem();

  useEffect(() => {
    if (!isVisible) return;
    
    // Listen for all events
    const unsubscribe = eventSystem.subscribe('*', (event: ChatEventUnion) => {
      setEvents(prev => [event, ...prev].slice(0, 100)); // Keep last 100 events
    });
    
    return () => {
      unsubscribe();
    };
  }, [isVisible, eventSystem]);

  if (!isVisible) return null;

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredEvents = filter 
    ? events.filter(e => 
        e.type.toLowerCase().includes(filter.toLowerCase()) || 
        JSON.stringify(e).toLowerCase().includes(filter.toLowerCase())
      )
    : events;

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <div className="fixed bottom-20 left-4 z-50 w-96 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[70vh] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b p-2">
        <h3 className="font-medium text-sm">Event Debugger</h3>
        <div className="flex items-center">
          <span className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5 mr-2">
            {events.length} events
          </span>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-2 border-b">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter events..."
          className="w-full p-1 text-sm border rounded"
        />
      </div>
      
      <div className="overflow-y-auto flex-1">
        {filteredEvents.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {filter ? 'No matching events' : 'No events captured yet'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredEvents.map((event, index) => (
              <div key={index} className="px-2 py-1 hover:bg-gray-50 text-xs">
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => toggleExpand(`${event.type}-${index}`)}
                >
                  {expanded[`${event.type}-${index}`] ? (
                    <ChevronDown className="h-3 w-3 mr-1" />
                  ) : (
                    <ChevronUp className="h-3 w-3 mr-1" />
                  )}
                  
                  <div className="font-medium text-blue-600">{event.type}</div>
                  <div className="ml-2 text-gray-500">{formatTimestamp(event.timestamp)}</div>
                </div>
                
                {expanded[`${event.type}-${index}`] && (
                  <div className="mt-1 pl-5 border-l-2 border-gray-200">
                    <pre className="text-xs overflow-x-auto p-1 bg-gray-50 rounded">
                      {JSON.stringify(event, null, 2)}
                    </pre>
                    
                    <div className="mt-1 flex justify-end">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(event, null, 2));
                        }}
                        className="text-xs flex items-center text-gray-500 hover:text-blue-600"
                      >
                        <Code className="h-3 w-3 mr-1" />
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDebugger;
