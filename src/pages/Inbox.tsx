
import React, { useState } from 'react';
import { FilterBar } from '@/components/inbox/FilterBar';
import { SortingControls } from '@/components/inbox/SortingControls';
import { SelectionControls } from '@/components/inbox/SelectionControls';
import LoadingState from '@/components/inbox/components/LoadingState';
import EmptyTicketState from '@/components/inbox/EmptyTicketState';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateTicketDialog from '@/components/inbox/components/ticket-form/CreateTicketDialog';

const Inbox = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  
  // Add state for FilterBar props
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Simulate loading for demo
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 flex justify-between items-center bg-white">
        <h1 className="text-2xl font-semibold">Inbox</h1>
        <Button onClick={() => setIsCreateTicketOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <FilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
          />
          <div className="flex gap-2">
            <SortingControls />
            <SelectionControls />
          </div>
        </div>
        
        {isLoading ? (
          <LoadingState />
        ) : (
          <EmptyTicketState 
            onCreateTicket={() => setIsCreateTicketOpen(true)}
          />
        )}
      </div>
      
      <CreateTicketDialog 
        isOpen={isCreateTicketOpen} 
        onClose={() => setIsCreateTicketOpen(false)} 
      />
    </div>
  );
};

export default Inbox;
