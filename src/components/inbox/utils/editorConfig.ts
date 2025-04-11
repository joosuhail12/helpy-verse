import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Mention, { MentionOptions } from '@tiptap/extension-mention';
import type { SuggestionProps } from '@tiptap/suggestion';
import Placeholder from '@tiptap/extension-placeholder';
import UserMentionList, { UserMentionItem } from '../components/UserMentionList';
import MentionList, { MentionItem } from '../components/MentionList';
import { HttpClient } from '@/api/services/HttpClient';
import { getUserId, getUserName } from '@/utils/helpers/helpers';
import { mentionsService } from '@/api/services/mentionsService';
import { toast } from 'sonner';

interface EditorConfigOptions {
  placeholder?: string;
  onUpdate?: (html: string) => void;
  editable?: boolean;
  ticketId?: string;
}

interface Ticket {
  id?: string;
  ticketId?: string;
  [key: string]: any; // Allow for other properties
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
  loadingDiv.className = 'bg-white shadow-lg rounded-lg p-2 flex items-center justify-center';

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

// Position the popup near the '@' character
const positionPopup = (popup: HTMLElement, coords: { left: number; top: number }) => {
  if (!popup || !coords) return;

  popup.style.position = 'absolute';
  popup.style.left = `${coords.left}px`;
  popup.style.top = `${coords.top + 24}px`; // Offset to position below the @ character
  popup.style.zIndex = '1000';

  // Make sure popup doesn't go off screen
  const rect = popup.getBoundingClientRect();
  const viewportWidth = window.innerWidth;

  if (rect.right > viewportWidth) {
    popup.style.left = `${viewportWidth - rect.width - 20}px`;
  }
};

// Cached results to avoid unnecessary API calls
let cachedMembers: UserMentionItem[] = [];
let isInitialFetchComplete = false;

// Sample users for fallback and testing
const sampleUsers: UserMentionItem[] = [
  { id: '1', name: 'John Doe', initial: 'J' },
  { id: '2', name: 'Jane Smith', initial: 'J' },
  { id: '3', name: 'Alex Johnson', initial: 'A' },
  { id: '4', name: 'Taylor Brown', initial: 'T' },
];

// Extract ticket ID from various ticket object formats
const getTicketId = (ticket: Ticket | EditorConfigOptions): string | undefined => {
  if (!ticket) return undefined;

  // If it's already a string, return it
  if (typeof ticket === 'string') return ticket;

  // Check for ticketId property (from EditorConfigOptions)
  if ('ticketId' in ticket && ticket.ticketId) return ticket.ticketId;

  // Check for id property (common in ticket objects)
  if ('id' in ticket && ticket.id) return ticket.id;

  // Check for _id property (MongoDB style)
  if ('_id' in ticket && ticket._id) return ticket._id;

  console.warn('Could not find ticket ID in ticket object:', ticket);
  return undefined;
};

// Pre-fetch team members to avoid delay when @ is typed
const prefetchTeamMembers = async (currentUserId: string | null): Promise<UserMentionItem[]> => {
  if (cachedMembers.length > 0 && isInitialFetchComplete) {
    return cachedMembers;
  }

  try {
    console.log('Pre-fetching team members...');
    const response = await HttpClient.apiClient.get<TicketResponse>(
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
    );

    if (response.data.status === 'success' && response.data.data.length > 0) {
      // Extract unique team members from all tickets
      const allMembers: TeamMember[] = [];
      response.data.data.forEach(ticket => {
        if (ticket.team && ticket.team.members) {
          ticket.team.members.forEach(member => {
            // Skip the current user
            if (currentUserId && member.id === currentUserId) {
              return;
            }

            // Check if member already exists in allMembers
            const exists = allMembers.some(m => m.id === member.id);
            if (!exists) {
              allMembers.push(member);
            }
          });
        }
      });

      console.log('Extracted team members (excluding current user):', allMembers);

      // Convert to UserMentionItem format
      cachedMembers = allMembers.map(member => ({
        id: member.id,
        name: member.name,
        initial: getInitial(member.name)
      }));

      // If no members found, use sample data
      if (cachedMembers.length === 0) {
        console.warn('No team members found in response, using sample data');
        // Filter out the current user from sample data
        cachedMembers = sampleUsers.filter(user => !currentUserId || user.id !== currentUserId);
      }
    } else {
      console.warn('No valid data in API response, using sample data');
      cachedMembers = sampleUsers.filter(user => !currentUserId || user.id !== currentUserId);
    }

    isInitialFetchComplete = true;
    return cachedMembers;
  } catch (error) {
    console.error('Error pre-fetching team members:', error);
    cachedMembers = sampleUsers.filter(user => !currentUserId || user.id !== currentUserId);
    isInitialFetchComplete = true;
    return cachedMembers;
  }
};

export const createEditorConfig = (
  newMessage: string,
  p0: (editor: any) => void,
  ticketOrOptions: Ticket | EditorConfigOptions,
  customerName?: string
) => {
  // Extract options - we support both a ticket object or EditorConfigOptions
  let placeholder: string | undefined;
  let onUpdate = p0;
  let editable = true;

  // Extract ticket ID from various possible formats
  const ticketId = getTicketId(ticketOrOptions);

  // If it's EditorConfigOptions object
  if (ticketOrOptions && 'placeholder' in ticketOrOptions) {
    placeholder = ticketOrOptions.placeholder;
    onUpdate = ticketOrOptions.onUpdate || p0;
    editable = ticketOrOptions.editable !== undefined ? ticketOrOptions.editable : true;
  } else {
    // Default placeholder using customer name if available
    placeholder = customerName
      ? `Reply to ${customerName}...`
      : 'Type your message...';
  }

  const currentUserId = getUserId();

  // Start the prefetch process immediately
  prefetchTeamMembers(currentUserId);

  return {
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention bg-primary/10 text-primary px-1 py-0.5 rounded no-underline',
          'data-type': 'mention',
        },
        renderLabel({ node }) {
          return `@${node.attrs.label || ''}`;
        },
        suggestion: {
          char: '@',
          startOfLine: false, // Allow mentions anywhere in the line
          allowSpaces: true, // Allow spaces in the query
          items: async ({ query }: { query: string }): Promise<UserMentionItem[]> => {
            console.log('Fetching mention suggestions with query:', query);

            // Make sure we have team members loaded
            if (!isInitialFetchComplete) {
              await prefetchTeamMembers(currentUserId);
            }

            // If query is empty (just @), return all cached members
            if (!query) return cachedMembers;

            // Otherwise filter by query
            return cachedMembers.filter(item =>
              item.name.toLowerCase().includes(query.toLowerCase())
            );
          },
          render: () => {
            let component: UserMentionList;
            let popup: HTMLElement;
            let loadingIndicator: HTMLElement;
            let isLoading = false;

            return {
              onStart: async (props: SuggestionProps) => {
                // Create loading indicator
                isLoading = true;
                loadingIndicator = createLoadingIndicator();

                popup = document.createElement('div');
                popup.className = 'mention-popup shadow-lg rounded-md overflow-hidden';
                popup.appendChild(loadingIndicator);
                document.body.appendChild(popup);

                // Position the popup using props coordinates
                const coords = props.clientRect?.();
                if (coords) {
                  positionPopup(popup, coords);
                }

                // If we already have cached members, show them immediately
                if (isInitialFetchComplete) {
                  isLoading = false;
                  popup.removeChild(loadingIndicator);

                  component = new UserMentionList({
                    items: cachedMembers,
                    command: props.command,
                  });

                  popup.appendChild(component.element);
                }
              },
              onUpdate: (props: SuggestionProps) => {
                // Get latest coords for positioning
                const coords = props.clientRect?.();
                if (coords) {
                  positionPopup(popup, coords);
                }

                // If we were loading but now have items, replace loading indicator with results
                if (isLoading && props.items.length > 0) {
                  console.log('Received items, replacing loading indicator', props.items);
                  isLoading = false;

                  if (popup.contains(loadingIndicator)) {
                    popup.removeChild(loadingIndicator);
                  }

                  component = new UserMentionList({
                    items: props.items as UserMentionItem[],
                    command: props.command,
                  });

                  popup.appendChild(component.element);
                } else if (!isLoading) {
                  // Just update the existing component
                  component.update({ items: props.items as UserMentionItem[] });
                }
              },
              onKeyDown: (props: { event: KeyboardEvent }) => {
                if (isLoading) return false;
                return component.onKeyDown(props);
              },
              onExit: () => {
                if (popup) {
                  popup.remove();
                }
              },
            };
          },
          command: ({ editor, range, props }) => {
            const mentionedBy = getUserId();
            const userItem = props as UserMentionItem;

            // Create the mention in the editor
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent([
                {
                  type: 'mention',
                  attrs: {
                    id: userItem.id,
                    label: userItem.name,
                    mentionedUser: userItem.id
                  }
                },
                {
                  type: 'text',
                  text: ' ' // Add a space after the mention
                }
              ])
              .run();

            // If we have the necessary data, create a mention record
            if (mentionedBy && ticketId && userItem.id) {
              try {
                // Log the data for debugging
                console.log('Creating mention with data:', {
                  ticketId,
                  userId: userItem.id,
                  mentionedBy
                });

                // Use the mentionsService to create a mention
                mentionsService.createMention({
                  ticketId,
                  userId: userItem.id,
                  mentionedBy,
                  content: `${getUserName()} mentioned you in a ticket`
                });

                toast.success(`mentioned ${userItem.name} successfully`);

                console.log(`Created mention: ${mentionedBy} mentioned ${userItem.id} in ticket ${ticketId}`);
              } catch (error) {
                console.error('Failed to create mention:', error);
              }
            } else {
              console.warn('Missing data for creating mention:', {
                mentionedBy,
                ticketId,
                userId: userItem.id,
                ticketObject: ticketOrOptions
              });
            }
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    onUpdate: ({ editor }) => {
      onUpdate(editor);
    },
    editable,
    editorProps: {
      attributes: {
        class: 'focus:outline-none prose prose-sm max-w-none',
      },
    },
  };
};
