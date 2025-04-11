import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Mention, { MentionOptions } from '@tiptap/extension-mention';
import type { SuggestionProps } from '@tiptap/suggestion';
import Placeholder from '@tiptap/extension-placeholder';
import UserMentionList, { UserMentionItem } from '../components/UserMentionList';
import MentionList, { MentionItem } from '../components/MentionList';
import { HttpClient } from '@/api/services/HttpClient';

interface EditorConfigOptions {
  placeholder?: string;
  onUpdate?: (html: string) => void;
  editable?: boolean;
}

interface CustomerMentionItem {
  id: string;
  name: string;
  company: string;
  ticketId: string;
}

interface TeamMember {
  id: string;
  name: string;
}

interface TicketResponse {
  status: string;
  message: string;
  data: Array<{
    id: string;
    team: {
      id: string;
      name: string;
      members: TeamMember[];
    };
  }>;
}

const convertToMentionItem = (item: UserMentionItem | CustomerMentionItem): MentionItem => {
  if ('avatar' in item) {
    return {
      label: item.name,
      value: `@${item.id}`,
    };
  }

  const customerItem = item as CustomerMentionItem;
  return {
    label: `${customerItem.name} (${customerItem.company})`,
    value: `#${customerItem.ticketId}`,
  };
};

// Function to get first letter of name for avatar
const getInitial = (name: string): string => {
  return name ? name.charAt(0).toUpperCase() : '';
};

// Create loading indicator for mention dropdown
const createLoadingIndicator = (): HTMLElement => {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'bg-white shadow-lg rounded-lg p-4 flex items-center justify-center';

  const spinner = document.createElement('div');
  spinner.className = 'animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2';

  const text = document.createElement('span');
  text.textContent = 'Loading users...';
  text.className = 'text-sm text-gray-600';

  loadingDiv.appendChild(spinner);
  loadingDiv.appendChild(text);

  return loadingDiv;
};

// Create error indicator
const createErrorIndicator = (message: string): HTMLElement => {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'bg-white shadow-lg rounded-lg p-4 flex items-center';

  const icon = document.createElement('div');
  icon.className = 'text-red-500 mr-2';
  icon.innerHTML = '⚠️';

  const text = document.createElement('span');
  text.textContent = message;
  text.className = 'text-sm text-gray-600';

  errorDiv.appendChild(icon);
  errorDiv.appendChild(text);

  return errorDiv;
};

// Cached results to avoid unnecessary API calls
let cachedMembers: UserMentionItem[] = [];

// Sample users for fallback and testing
const sampleUsers: UserMentionItem[] = [
  { id: '1', name: 'John Doe', initial: 'J' },
  { id: '2', name: 'Jane Smith', initial: 'J' },
  { id: '3', name: 'Alex Johnson', initial: 'A' },
  { id: '4', name: 'Taylor Brown', initial: 'T' },
];

export const createEditorConfig = (options: EditorConfigOptions) => {
  const { placeholder, onUpdate, editable = true } = options;

  return {
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          char: '@',
          startOfLine: false, // Allow mentions anywhere in the line
          items: async ({ query }: { query: string }): Promise<UserMentionItem[]> => {
            console.log('Fetching mention suggestions');

            // Use cached results if available
            if (cachedMembers.length > 0) {
              console.log('Using cached members');
              return cachedMembers.filter(item =>
                !query || item.name.toLowerCase().includes(query.toLowerCase())
              );
            }

            try {
              console.log('Making API call to fetch team members...');

              // Create a timeout promise
              const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('API request timed out')), 5000);
              });

              // Race between the API call and the timeout
              const response = await Promise.race([
                HttpClient.apiClient.get<TicketResponse>(
                  '/team/user/tickets',
                  {
                    params: {
                      // workspace_id handled by HttpClient automatically
                      status: 'open',
                      priority: 1,
                      skip: 0,
                      limit: 10
                    }
                  }
                ),
                timeoutPromise
              ]);

              console.log('API response received:', response.data);

              if (response.data.status === 'success' && response.data.data.length > 0) {
                // Extract unique team members from all tickets
                const allMembers: TeamMember[] = [];
                response.data.data.forEach(ticket => {
                  if (ticket.team && ticket.team.members) {
                    ticket.team.members.forEach(member => {
                      // Check if member already exists in allMembers
                      const exists = allMembers.some(m => m.id === member.id);
                      if (!exists) {
                        allMembers.push(member);
                      }
                    });
                  }
                });

                console.log('Extracted team members:', allMembers);

                // Convert to UserMentionItem format
                cachedMembers = allMembers.map(member => ({
                  id: member.id,
                  name: member.name,
                  initial: getInitial(member.name)
                }));

                // If no members found, use sample data
                if (cachedMembers.length === 0) {
                  console.warn('No team members found in response, using sample data');
                  cachedMembers = sampleUsers;
                }

                // Filter by query
                return cachedMembers.filter(item =>
                  !query || item.name.toLowerCase().includes(query.toLowerCase())
                );
              }

              console.warn('No valid data in API response, using sample data:', response.data);
              return sampleUsers.filter(item =>
                !query || item.name.toLowerCase().includes(query.toLowerCase())
              );
            } catch (error) {
              console.error('Error fetching team members:', error);
              return sampleUsers.filter(item =>
                !query || item.name.toLowerCase().includes(query.toLowerCase())
              );
            }
          },
          render: () => {
            let component: UserMentionList;
            let popup: HTMLElement;
            let loadingIndicator: HTMLElement;
            let errorIndicator: HTMLElement;
            let isLoading = false;
            let loadingTimeout: ReturnType<typeof setTimeout>;

            return {
              onStart: () => {
                // Create loading indicator
                isLoading = true;
                loadingIndicator = createLoadingIndicator();

                popup = document.createElement('div');
                popup.className = 'mention-popup';
                popup.appendChild(loadingIndicator);
                document.body.appendChild(popup);

                // Position the loading indicator
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  const rect = range.getBoundingClientRect();

                  popup.style.position = 'absolute';
                  popup.style.left = `${rect.left}px`;
                  popup.style.top = `${rect.bottom + 5}px`;
                  popup.style.zIndex = '1000';
                }

                // Set a timeout to show error if loading takes too long
                loadingTimeout = setTimeout(() => {
                  if (isLoading) {
                    console.warn('Loading timeout reached, showing fallback data');
                    // Replace loading indicator with error message
                    isLoading = false;
                    popup.removeChild(loadingIndicator);

                    errorIndicator = createErrorIndicator('Could not load users. Using sample data.');
                    popup.appendChild(errorIndicator);

                    // Create component with sample data
                    setTimeout(() => {
                      popup.removeChild(errorIndicator);
                      component = new UserMentionList({
                        items: sampleUsers,
                        command: (item: UserMentionItem) => {
                          console.log('Selected user from sample data:', item);
                        },
                      });
                      popup.appendChild(component.element);
                    }, 1500);
                  }
                }, 3000);
              },
              onUpdate: (props: SuggestionProps) => {
                // If loading timeout is active, clear it
                if (loadingTimeout) {
                  clearTimeout(loadingTimeout);
                }

                // If we were loading but now have items, replace loading indicator with results
                if (isLoading && props.items.length > 0) {
                  console.log('Received items, replacing loading indicator', props.items);
                  isLoading = false;
                  popup.removeChild(loadingIndicator);

                  component = new UserMentionList({
                    items: props.items as UserMentionItem[],
                    command: props.command,
                  });

                  popup.appendChild(component.element);
                } else if (!isLoading) {
                  // Just update the existing component
                  component.update({ items: props.items as UserMentionItem[] });
                }

                // Update position
                const rect = props.clientRect?.();
                if (rect) {
                  popup.style.position = 'absolute';
                  popup.style.left = `${rect.left}px`;
                  popup.style.top = `${rect.bottom + 5}px`;
                  popup.style.zIndex = '1000';
                }
              },
              onKeyDown: (props: { event: KeyboardEvent }) => {
                if (isLoading) return false;
                return component.onKeyDown(props);
              },
              onExit: () => {
                // Clear timeout if it exists
                if (loadingTimeout) {
                  clearTimeout(loadingTimeout);
                }

                if (popup) {
                  popup.remove();
                }
              },
            };
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
    editable,
    editorProps: {
      attributes: {
        class: 'focus:outline-none prose prose-sm max-w-none',
      },
    },
  };
};
