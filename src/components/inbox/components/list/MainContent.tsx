
import { useToast } from "@/hooks/use-toast";
import FilterBar from '../../FilterBar';
import SortingControls from '../../SortingControls';
import SelectionControls from '../../SelectionControls';
import LoadingState from '../LoadingState';
import TicketActions from '../TicketActions';
import TicketListItem from '../TicketListItem';
import type { Ticket, SortField, ViewMode } from '@/types/ticket';

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

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-all duration-300 ${
      selectedTicketForChat 
        ? 'w-full md:w-3/5 lg:w-2/5' 
        : 'w-full'
    }`}>
      <div className="flex-1 overflow-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-4">
          <div className="p-4 space-y-4">
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
            />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t">
              <SelectionControls
                selectedCount={selectedTickets.length}
                totalCount={sortedAndFilteredTickets.length}
                onSelectAll={handleSelectAll}
              />
              
              <div className="flex items-center gap-4">
                <TicketActions
                  selectedTickets={selectedTickets}
                  markAsRead={markAsRead}
                  markAsUnread={markAsUnread}
                />
                <SortingControls
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  compact={!!selectedTicketForChat}
                />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="space-y-2 mb-4">
            {paginatedTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onTicketClick(ticket)}
                className="transform transition-all duration-200 hover:-translate-y-0.5"
              >
                <TicketListItem
                  ticket={ticket}
                  viewMode={selectedTicketForChat ? "compact" : viewMode}
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
              <div className="flex justify-center gap-2 my-4 pb-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
    </div>
  );
};

export default MainContent;
