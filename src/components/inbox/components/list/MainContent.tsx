
import { useToast } from "@/hooks/use-toast";
import FilterBar from '../../FilterBar';
import SortingControls from '../../SortingControls';
import SelectionControls from '../../SelectionControls';
import LoadingState from '../LoadingState';
import TicketActions from '../TicketActions';
import TicketListItem from '../TicketListItem';
import type { Ticket, SortField, ViewMode } from '@/types/ticket';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import ConversationPanelContainer from './ConversationPanelContainer';

interface MainContentProps {
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedTickets: string[];
  handleSort: (field: SortField) => void;
  handleTicketSelection: (id: string) => void;
  handleSelectAll: (checked: boolean) => void;
  sortedAndFilteredTickets: Ticket[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  loadingStates: Record<string, boolean>;
  markAsRead: (ids: string[]) => void;
  markAsUnread: (ids: string[]) => void;
  onTicketClick: (ticket: Ticket) => void;
  selectedTicketForChat: Ticket | null;
}

const ITEMS_PER_PAGE = 5;

const MainContent = ({
  isLoading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  sortField,
  sortDirection,
  viewMode,
  setViewMode,
  selectedTickets,
  handleSort,
  handleTicketSelection,
  handleSelectAll,
  sortedAndFilteredTickets,
  currentPage,
  setCurrentPage,
  loadingStates,
  markAsRead,
  markAsUnread,
  onTicketClick,
  selectedTicketForChat,
}: MainContentProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const totalPages = Math.ceil(sortedAndFilteredTickets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTickets = sortedAndFilteredTickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCopyTicketId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast({
      description: "Ticket ID copied to clipboard",
      duration: 2000,
    });
  };

  if (selectedTicketForChat && isMobile) {
    return (
      <div className="h-full w-full overflow-hidden transition-all duration-300 ease-in-out">
        <ConversationPanelContainer 
          selectedTicket={selectedTicketForChat} 
          onClose={() => onTicketClick(selectedTicketForChat)} 
        />
      </div>
    );
  }

  if (selectedTicketForChat && !isMobile) {
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full overflow-hidden transition-all duration-300 ease-in-out"
      >
        <ResizablePanel 
          defaultSize={40} 
          minSize={25} 
          className="flex flex-col h-full overflow-hidden transition-all duration-300"
        >
          {renderTicketList()}
        </ResizablePanel>
        
        <ResizableHandle withHandle className="transition-opacity duration-300 hover:opacity-100 opacity-40" />
        
        <ResizablePanel defaultSize={60} minSize={30}>
          <ConversationPanelContainer 
            selectedTicket={selectedTicketForChat} 
            onClose={() => onTicketClick(selectedTicketForChat)} 
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden animate-fade-in">
      {renderTicketList()}
    </div>
  );

  function renderTicketList() {
    return (
      <>
        <div className={`flex-none ${isMobile ? 'px-2 pt-2 pb-1' : 'px-4 pt-4 pb-2'}`}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className={`${isMobile ? 'p-2' : 'p-4'} space-y-3`}>
              <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
              />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 pt-2 md:pt-4 border-t">
                <SelectionControls
                  selectedCount={selectedTickets.length}
                  totalCount={sortedAndFilteredTickets.length}
                  onSelectAll={handleSelectAll}
                />
                
                <div className="flex items-center gap-2 flex-wrap">
                  <TicketActions
                    selectedTickets={selectedTickets}
                    markAsRead={markAsRead}
                    markAsUnread={markAsUnread}
                  />
                  <SortingControls
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    compact={!!selectedTicketForChat || isMobile}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`flex-1 overflow-auto ${isMobile ? 'px-2 pb-2' : 'px-4 pb-4'}`}>
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="space-y-2">
              {paginatedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => onTicketClick(ticket)}
                  className="transform transition-all duration-200 hover:-translate-y-0.5"
                >
                  <TicketListItem
                    ticket={ticket}
                    viewMode={selectedTicketForChat || isMobile ? "compact" : viewMode}
                    isSelected={selectedTickets.includes(ticket.id)}
                    isLoading={!!loadingStates[ticket.id]}
                    onSelect={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleTicketSelection(ticket.id);
                    }}
                    onCopyId={(id: string, e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleCopyTicketId(id);
                    }}
                  />
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 my-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`${isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-primary text-white shadow-md shadow-primary/20'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }
};

export default MainContent;
