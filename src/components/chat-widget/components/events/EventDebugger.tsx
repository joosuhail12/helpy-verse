
import React, { useState, useEffect } from 'react';
import { eventTracker } from '@/utils/events/eventTracker';
import { useEventListener } from '@/hooks/useEventSystem';
import { ChatEventType } from '@/utils/events/eventTypes';
import { X } from 'lucide-react';

interface EventDebuggerProps {
  isVisible?: boolean;
  onClose?: () => void;
}

/**
 * A component for debugging events in the chat widget
 * This is a development tool and should not be used in production
 */
const EventDebugger: React.FC<EventDebuggerProps> = ({ 
  isVisible = false,
  onClose
}) => {
  const [events, setEvents] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<Record<string, any>>({});
  
  // Load initial events
  useEffect(() => {
    if (isVisible) {
      const storedEvents = eventTracker.getAllEvents();
      setEvents(storedEvents.slice(-30).reverse()); // Show last 30 events
      setMetrics(eventTracker.getSessionMetrics());
    }
  }, [isVisible]);
  
  // Listen for new events
  useEventListener(
    ChatEventType.WIDGET_OPENED,
    (event) => {
      refreshEvents();
    }
  );
  
  useEventListener(
    ChatEventType.MESSAGE_SENT,
    (event) => {
      refreshEvents();
    }
  );
  
  useEventListener(
    ChatEventType.MESSAGE_RECEIVED,
    (event) => {
      refreshEvents();
    }
  );
  
  useEventListener(
    ChatEventType.PAGE_NAVIGATION,
    (event) => {
      refreshEvents();
    }
  );
  
  const refreshEvents = () => {
    const storedEvents = eventTracker.getAllEvents();
    setEvents(storedEvents.slice(-30).reverse()); // Show last 30 events
    setMetrics(eventTracker.getSessionMetrics());
  };
  
  const clearEvents = () => {
    eventTracker.clearEvents();
    setEvents([]);
    setMetrics(eventTracker.getSessionMetrics());
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-20 right-4 z-40 w-96 max-h-[80vh] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-100 p-3 flex items-center justify-between border-b">
        <h3 className="font-medium">Event Debugger</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="p-3 border-b">
        <h4 className="text-sm font-medium mb-2">Metrics</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-xs bg-gray-50 p-2 rounded">
            <span className="text-gray-600">Total events:</span> {metrics.totalEvents || 0}
          </div>
          <div className="text-xs bg-gray-50 p-2 rounded">
            <span className="text-gray-600">Sessions:</span> {metrics.sessionsStarted || 0}
          </div>
          <div className="text-xs bg-gray-50 p-2 rounded">
            <span className="text-gray-600">Messages sent:</span> {metrics.eventCounts?.message_sent || 0}
          </div>
          <div className="text-xs bg-gray-50 p-2 rounded">
            <span className="text-gray-600">Time spent:</span> {Math.round((metrics.totalTimeSpent || 0) / 1000)}s
          </div>
        </div>
        <button 
          onClick={refreshEvents}
          className="mr-2 text-xs mt-2 px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
        >
          Refresh
        </button>
        <button 
          onClick={clearEvents}
          className="text-xs mt-2 px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
        >
          Clear All
        </button>
      </div>
      
      <div className="overflow-y-auto max-h-[calc(80vh-128px)]">
        <div className="text-xs divide-y">
          {events.map((event, index) => (
            <div key={index} className="p-2 hover:bg-gray-50">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-blue-600">{event.type}</span>
                <span className="text-gray-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-gray-600">
                <span className="inline-block bg-gray-100 px-1 rounded mr-1">Page:</span> 
                {event.pageUrl ? new URL(event.pageUrl).pathname : 'unknown'}
              </div>
              {event.content && (
                <div className="text-gray-600 truncate">
                  <span className="inline-block bg-gray-100 px-1 rounded mr-1">Content:</span> 
                  {event.content}
                </div>
              )}
            </div>
          ))}
          
          {events.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No events recorded yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDebugger;
