import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getAblyChatRoom, getAblyChatClient, initAbly } from '@/utils/ably';
import debounce from 'lodash/debounce';
import type { Message, UserPresence } from '../types';
import type { Ticket } from '@/types/ticket';
import { AllFeaturesEnabled } from '@ably/chat';
import { useStore } from 'react-redux';

export const useAblyRoom = (ticket: Ticket) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isInternalNote, setIsInternalNote] = useState(false);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const store = useStore();
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const roomRef = useRef<any>(null);
    const currentUserRef = useRef<string>('');

    // Get current user info once when component mounts
    useEffect(() => {
        const authState = store.getState() as any;
        const userName = authState?.auth?.user?.data?.name;
        // Add user email for better identification
        const userEmail = authState?.auth?.user?.data?.email;

        console.log('User name from Redux store:', userName);
        console.log('User email from Redux store:', userEmail);
        console.log('Auth state:', authState?.auth);

        // Create a user identifier that includes email if available
        const userId = userEmail ? `${userName || 'Agent'}|${userEmail}` : `${userName || 'Agent'}-${Date.now()}`;
        currentUserRef.current = userId;

        console.log('Using sender ID:', currentUserRef.current);
    }, [store]);

    // Initialize messages with the initial ticket message
    useEffect(() => {
        // Ensure we have a valid timestamp
        const timestamp = ticket.createdAt || new Date().toISOString();

        setMessages([{
            id: ticket.id,
            content: ticket.lastMessage,
            sender: ticket.customer || 'Customer',
            timestamp: timestamp,
            isCustomer: true,
            readBy: []
        }]);
    }, [ticket]);

    // Handle room setup and cleanup
    useEffect(() => {
        let isComponentMounted = true;
        let roomInstance: any;
        let directChannelSubscription: any = null;

        const setupRoom = async () => {
            setIsLoading(true);
            setError(null);

            try {
                console.log('Setting up chat room for ticket:', ticket.id);

                // DIRECT CHANNEL SUBSCRIPTION
                // Subscribe directly to the Ably channel in addition to the Chat SDK
                try {
                    const ablyClient = await initAbly();
                    if (ablyClient) {
                        const channelName = `ticket:${ticket.id}`;
                        const channel = ablyClient.channels.get(channelName);

                        // Store subscription for cleanup
                        directChannelSubscription = channel.subscribe('message', (message: any) => {
                            if (!isComponentMounted) return;

                            console.log('Received direct channel message:', message);

                            // Extract data from the message
                            const data = message.data;
                            if (!data) {
                                console.error('Message data is empty:', message);
                                return;
                            }

                            const extras = data.extras || {};

                            // Set sender name based on message source
                            let senderName = extras.senderName || extras.sender || 'Unknown';

                            // Get message content, ensuring it contains HTML
                            let content = data.text || '';
                            if (content && !content.includes('<')) {
                                // If content doesn't appear to be HTML, wrap it in paragraph tags
                                content = `<p>${content}</p>`;
                            }

                            const newMsg: Message = {
                                id: message.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                content: content,
                                sender: senderName,
                                timestamp: extras.timestamp || new Date().toISOString(),
                                isCustomer: extras.isCustomer === true,
                                type: extras.type || 'message',
                                readBy: extras.readBy || []
                            };

                            console.log('Adding direct message to state:', newMsg);

                            // Use a function to update messages to prevent race conditions
                            setMessages(prev => {
                                // Check if this message ID already exists to prevent duplicates
                                if (prev.some(m => m.id === newMsg.id)) {
                                    console.log('Message already exists in state, not adding duplicate');
                                    return prev;
                                }

                                console.log('Adding new message to state array, current count:', prev.length);
                                return [...prev, newMsg];
                            });
                        });

                        // Add direct typing subscription
                        const typingSubscription = channel.subscribe('typing', (message: any) => {
                            if (!isComponentMounted) return;

                            console.log('Received direct typing event:', message);

                            const data = message.data;
                            if (!data) return;

                            const isTyping = data.isTyping === true;
                            const memberName = data.name || 'Unknown';
                            const isCustomer = data.isCustomer === true;

                            // Skip self typing
                            if (memberName === currentUserRef.current) return;

                            // For the conversation panel, we want to show customer name is typing
                            const displayName = isCustomer ?
                                (ticket.customer || 'Customer') : // Use ticket customer name if available
                                memberName; // Otherwise use the member name provided

                            if (isTyping) {
                                setTypingUsers(prev => [...new Set([...prev, displayName])]);
                            } else {
                                setTypingUsers(prev => prev.filter(user =>
                                    user !== memberName &&
                                    user !== (ticket.customer || 'Customer')
                                ));
                            }
                        });

                        // Store for cleanup
                        (directChannelSubscription as any)._typingSubscription = typingSubscription;
                        console.log('Typing subscription:', typingSubscription);

                        console.log('Set up direct typing subscription for', channelName);
                    }
                } catch (err) {
                    console.error('Error setting up direct channel subscription:', err);
                }

                // Get chat client
                const chatClient = await getAblyChatClient();

                if (!chatClient) {
                    throw new Error('Failed to initialize Ably Chat client');
                }

                console.log('Got chat client, getting room');

                // Get chat room with all features enabled
                const room = await chatClient.rooms.get(`ticket:${ticket.id}`, AllFeaturesEnabled);

                // Log diagnostic info using type assertion
                console.log('Room has messages object:', !!room.messages);

                // Store room instance
                roomInstance = room;
                roomRef.current = room; // Store room in ref for access in other methods

                console.log('Got room, setting up status listener');

                // Set up status change listener before attaching
                const { off: statusOff } = room.onStatusChange((status) => {
                    if (!isComponentMounted) return;

                    console.log('Room status changed:', status);

                    if (status.current === 'failed') {
                        console.error('Room failed:', status);
                        setError('Failed to connect to the conversation room. Please try again.');
                    } else if (status.current === 'suspended') {
                        console.warn('Room suspended:', status);
                        setError('Connection to the conversation room has been suspended. Trying to reconnect...');
                    } else if (status.current === 'attached') {
                        console.log('Room attached, setting up subscriptions');
                        // Once attached, set up message and presence subscriptions
                        setupSubscriptions(room);
                    }
                });

                // Attaching to room
                console.log('Attaching to room');
                await room.attach();
                console.log('Room attached');

                // Log additional diagnostics with safe property access
                try {
                    // Safely access internal properties with type assertion
                    const internalRoom = room as any;
                    if (internalRoom._ably && internalRoom._ably.channels) {
                        const channelState = internalRoom._ably.channels.get(internalRoom.id)?.state;
                        console.log('Channel state:', channelState);
                    }

                    if (internalRoom._ably && internalRoom._ably.connection) {
                        console.log('Connection state:', internalRoom._ably.connection.state);
                    }
                } catch (err) {
                    console.warn('Could not access internal room properties:', err);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error setting up chat room:', error);
                if (isComponentMounted) {
                    setError(`Failed to connect to the conversation. ${error instanceof Error ? error.message : 'Please try again.'}`);
                    setIsLoading(false);
                }
            }
        };

        const setupSubscriptions = (room: any) => {
            if (!isComponentMounted) return;

            console.log('Setting up message subscription');

            // Verify that room.messages exists and has a subscribe method
            if (!room.messages || typeof room.messages.subscribe !== 'function') {
                console.error('Room messages capability is not available!');
                setError('Message functionality is not available. Please refresh and try again.');
                return;
            }

            // Subscribe to messages
            room.messages.subscribe((messageEvent: any) => {
                if (!isComponentMounted) return;
                console.log('Received message:', messageEvent);

                const message = messageEvent.message;
                const extras = message.extras || {};

                // Determine if the message is from the current user
                const isFromCurrentUser = extras.sender === currentUserRef.current;

                // Set sender name based on message source
                let senderName;

                if (isFromCurrentUser) {
                    // Use the actual user name for current user's messages
                    senderName = currentUserRef.current;
                } else if (extras.isCustomer === true) {
                    // For customer messages
                    senderName = extras.senderName || ticket.customer || 'Customer';
                } else {
                    // For other users' messages, use their actual names
                    senderName = extras.senderName || extras.sender || 'Unknown User';
                }

                const newMsg: Message = {
                    id: messageEvent.id,
                    content: message.text || '',
                    sender: senderName,
                    timestamp: messageEvent.timestamp || new Date().toISOString(),
                    isCustomer: extras.isCustomer === true,
                    type: extras.type || 'message',
                    readBy: extras.readBy || []
                };

                setMessages(prev => [...prev, newMsg]);
            });

            // Setup read receipt subscription
            try {
                const ablyClient = initAbly();
                if (!ablyClient) return;

                const channelName = `ticket:${ticket.id}`;
                const channel = ablyClient.then(client => {
                    const ch = client.channels.get(channelName);

                    // Subscribe to read receipt events
                    ch.subscribe('message:read', (readEvent: any) => {
                        const { messageId, readBy, reader, readAt } = readEvent.data;

                        // Log read receipt event for debugging
                        console.log(`Read receipt event:`, readEvent.data);

                        if (messageId && readBy) {
                            // Update the message's readBy status in local state
                            setMessages(prevMessages =>
                                prevMessages.map(msg =>
                                    msg.id === messageId
                                        ? { ...msg, readBy, lastReadAt: readAt || new Date().toISOString() }
                                        : msg
                                )
                            );
                        }
                    });

                    // Ensure typing events are processed properly
                    ch.subscribe('typing', (typingEvent: any) => {
                        if (!isComponentMounted) return;

                        const data = typingEvent.data;
                        if (!data) return;

                        console.log('Received typing event:', typingEvent);

                        const isTyping = data.isTyping === true;
                        const memberName = data.name || 'Unknown';
                        // Extract display name if in format with | or -
                        const displayName = memberName.includes('|')
                            ? memberName.split('|')[0]
                            : memberName.split('-')[0];

                        const isCustomer = data.isCustomer === true;

                        // Skip self typing
                        if (memberName === currentUserRef.current) return;

                        if (isTyping) {
                            setTypingUsers(prev => [...new Set([...prev, displayName])]);
                        } else {
                            setTypingUsers(prev => prev.filter(user =>
                                user !== displayName &&
                                user !== memberName &&
                                user !== (ticket.customer || 'Customer')
                            ));
                        }
                    });

                    return ch;
                }).catch(err => {
                    console.error('Error getting Ably channel for read receipts:', err);
                    return null;
                });
            } catch (error) {
                console.error('Error setting up read receipt subscription:', error);
            }

            // Handle presence
            setupPresence(room).catch(err => console.error('Error setting up presence:', err));
        };

        const setupPresence = async (room: any) => {
            try {
                console.log('Setting up presence');

                // Enter presence with current user info - use displayName for better readability
                const displayName = currentUserRef.current.split(/[|-]/)[0];
                await room.presence.enter({
                    userId: currentUserRef.current,
                    name: displayName, // Use displayName instead of the full ID
                    lastActive: new Date().toISOString(),
                    location: {
                        ticketId: ticket.id,
                        area: 'conversation'
                    }
                });

                console.log('Entered presence, setting up presence listeners');

                // Subscribe to presence changes
                room.presence.subscribe('enter', (member: any) => {
                    if (!isComponentMounted) return;
                    console.log('Member entered:', member);

                    // Get display name for UI
                    const memberData = member.data || {};
                    const memberName = memberData.name || 'Unknown';

                    // Don't show toast for current user
                    if (memberData.userId !== currentUserRef.current) {
                        toast({
                            description: `${memberName} joined the conversation`,
                        });
                    }

                    // Ensure we're not adding duplicates
                    setActiveUsers(prev => {
                        // Check if user already exists
                        const exists = prev.some(u => u.userId === memberData.userId);
                        if (exists) return prev;
                        return [...prev, memberData as UserPresence];
                    });
                });

                room.presence.subscribe('leave', (member: any) => {
                    if (!isComponentMounted) return;
                    console.log('Member left:', member);

                    const memberName = member.data.name;
                    // Don't show toast for current user
                    if (memberName !== currentUserRef.current) {
                        toast({
                            description: `${memberName} left the conversation`,
                        });
                    }
                    // Remove from typing users if they were typing
                    setTypingUsers(prev => prev.filter(user => user !== memberName));
                    // Remove from active users
                    setActiveUsers(prev => prev.filter(user => user.userId !== member.data.userId));
                });

                room.presence.subscribe('update', (member: any) => {
                    if (!isComponentMounted) return;
                    const memberName = member.data.name;
                    const isCustomerTyping = member.data?.isCustomer === true;

                    // Handle typing status updates
                    if (member.data?.isTyping !== undefined) {
                        // Don't show typing indicator for current user
                        if (memberName !== currentUserRef.current) {
                            if (member.data.isTyping) {
                                // For the conversation panel, we want to show customer name is typing
                                // For test chat (AblyTest), we want to show "Agent is typing"
                                const displayName = isCustomerTyping ?
                                    (ticket.customer || 'Customer') : // Use ticket customer name if available
                                    memberName; // Otherwise use the member name provided

                                setTypingUsers(prev => [...new Set([...prev, displayName])]);
                            } else {
                                setTypingUsers(prev => prev.filter(user =>
                                    user !== memberName &&
                                    user !== (ticket.customer || 'Customer')
                                ));
                            }
                        }
                    }

                    // Handle read status updates
                    if (member.data?.lastRead) {
                        setMessages(prev => prev.map(msg => ({
                            ...msg,
                            readBy: [...(msg.readBy || []), member.data.userId]
                        })));
                    }

                    // Handle location updates
                    if (member.data?.location) {
                        setActiveUsers(prev => prev.map(user =>
                            user.userId === member.data.userId
                                ? { ...user, location: member.data.location }
                                : user
                        ));
                    }
                });

                // Get initial presence - compatibility fix for v0.5.1
                try {
                    // Use the underlying Ably channel's presence instead
                    // as room.presence.getAll() doesn't exist in this version
                    const underlying = room._ably.channels.get(room.id);
                    const presentMembers = await underlying.presence.get();

                    if (presentMembers && Array.isArray(presentMembers)) {
                        console.log('Got presence members:', presentMembers);

                        // Map present members to active users
                        const activeUsersList = presentMembers.map((member: any) => {
                            // Get better name for display
                            let displayName = member.data?.name || 'Unknown';
                            if (member.clientId && member.clientId.includes('|')) {
                                displayName = member.clientId.split('|')[0];
                            } else if (member.clientId && member.clientId.includes('-')) {
                                displayName = member.clientId.split('-')[0];
                            }

                            return {
                                userId: member.clientId,
                                name: displayName,
                                lastActive: member.data?.lastActive || new Date().toISOString(),
                                location: member.data?.location
                            };
                        });

                        console.log('Setting active users:', activeUsersList);
                        setActiveUsers(activeUsersList);
                    }
                } catch (err) {
                    console.warn('Could not get presence members:', err);
                    // Don't fail if we can't get presence members
                }
            } catch (error) {
                console.error('Error setting up presence:', error);
            }
        };

        setupRoom();

        return () => {
            console.log('Cleaning up room');
            isComponentMounted = false;

            // Clean up direct channel subscription
            if (directChannelSubscription) {
                try {
                    // Clean up typing subscription if it exists
                    if ((directChannelSubscription as any)._typingSubscription) {
                        try {
                            // Check if unsubscribe method exists before calling it
                            if (typeof (directChannelSubscription as any)._typingSubscription.unsubscribe === 'function') {
                                (directChannelSubscription as any)._typingSubscription.unsubscribe();
                                console.log('Unsubscribed from direct typing channel');
                            } else {
                                console.log('Typing subscription does not have unsubscribe method, skipping');
                            }
                        } catch (err) {
                            console.warn('Error unsubscribing from direct typing channel:', err);
                        }
                    }

                    // Check if unsubscribe method exists on directChannelSubscription
                    if (typeof directChannelSubscription.unsubscribe === 'function') {
                        directChannelSubscription.unsubscribe();
                        console.log('Unsubscribed from direct channel');
                    } else {
                        console.log('Direct channel subscription does not have unsubscribe method, skipping');
                    }
                } catch (err) {
                    console.warn('Error unsubscribing from direct channel:', err);
                }
            }

            // Add a flag to prevent additional operations during cleanup
            if (roomInstance) {
                try {
                    // Set a flag on the room instance to indicate it's being cleaned up
                    (roomInstance as any)._isBeingCleaned = true;

                    // Wrap presence leave in try/catch to prevent errors
                    if (roomInstance.presence && typeof roomInstance.presence.leave === 'function') {
                        try {
                            roomInstance.presence.leave().catch(err => {
                                console.warn('Error leaving presence during cleanup:', err);
                            });
                        } catch (error) {
                            console.warn('Error calling presence.leave:', error);
                        }
                    }

                    // Use a small delay to ensure presence operations finish before detaching
                    setTimeout(() => {
                        try {
                            roomInstance.detach().catch(err => {
                                console.warn('Error detaching room during cleanup:', err);
                            });
                        } catch (error) {
                            console.error('Error detaching room:', error);
                        }
                    }, 100);
                } catch (error) {
                    console.error('Error cleaning up room:', error);
                }
            }
        };
    }, [ticket.id, toast]);

    // Modify the handleSendMessage function to include more metadata
    const handleSendMessage = async () => {
        console.log("handleSendMessage called in useAblyRoom");

        // Validate message content
        if (!newMessage || newMessage.trim() === '' || newMessage === '<p></p>') {
            console.log("Message is empty, not sending");
            return;
        }

        setIsSending(true);
        try {
            // Try to get an Ably client directly
            console.log("Getting Ably client directly");
            const ablyClient = await initAbly();
            if (!ablyClient) {
                throw new Error("Failed to initialize Ably client");
            }

            // Create the channel name using the ticket ID
            const channelName = `ticket:${ticket.id}`;
            console.log("Using channel name:", channelName);

            // Get or create the channel
            const channel = ablyClient.channels.get(channelName);
            console.log("Got channel:", !!channel);

            // Extract just the name part from the current user ID for better display
            const displayName = currentUserRef.current.split('|')[0];

            // Prepare the message data with enhanced metadata
            const messageData = {
                text: newMessage,
                extras: {
                    sender: currentUserRef.current,
                    senderName: displayName,
                    senderId: currentUserRef.current,
                    isCustomer: false,
                    type: isInternalNote ? "internal_note" : "message",
                    // Initialize readBy with just the sender and timestamp
                    readBy: [{
                        userId: currentUserRef.current,
                        name: displayName,
                        readAt: new Date().toISOString()
                    }],
                    timestamp: new Date().toISOString()
                }
            };
            console.log("Message data prepared:", JSON.stringify(messageData));

            // Publish directly to the channel
            console.log("Publishing message directly to channel");
            await channel.publish("message", messageData);
            console.log("Message published successfully to direct channel");

            // Add to local state immediately
            const newMsg: Message = {
                id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                content: newMessage,
                sender: currentUserRef.current,
                senderName: displayName,
                timestamp: new Date().toISOString(),
                isCustomer: false,
                type: isInternalNote ? "internal_note" : "message",
                readBy: [{
                    userId: currentUserRef.current,
                    name: displayName,
                    readAt: new Date().toISOString()
                }]
            };

            setMessages(prev => [...prev, newMsg]);
            setNewMessage("");
            setIsInternalNote(false);

            toast({
                description: isInternalNote ? "Internal note added" : "Message sent successfully",
            });
        } catch (error) {
            console.error("Error sending message:", error);
            toast({
                variant: "destructive",
                description: "Failed to send message. Please try again.",
            });
            throw error;
        } finally {
            setIsSending(false);
        }
    };

    // Replace the automatic read receipt handling with improved version
    useEffect(() => {
        if (!messages.length || !currentUserRef.current) return;

        // Only attempt to mark messages that aren't sent by the current user
        const messagesToMark = messages.filter(
            msg => {
                // Skip messages sent by current user
                if (msg.sender === currentUserRef.current) return false;

                // Check if already read by current user
                const alreadyRead = Array.isArray(msg.readBy)
                    ? msg.readBy.some(reader =>
                        typeof reader === 'object'
                            ? reader.userId === currentUserRef.current
                            : reader === currentUserRef.current)
                    : false;

                return !alreadyRead;
            }
        );

        if (messagesToMark.length > 0) {
            const markMessagesAsRead = async () => {
                try {
                    const client = await initAbly();
                    if (!client) return;

                    // Get the channel for the current ticket
                    const chatChannel = client.channels.get(`ticket:${ticket.id}`);

                    // Extract display name (part before | or - in currentUserRef.current)
                    const displayName = currentUserRef.current.split(/[|-]/)[0];

                    // Mark each message as read
                    for (const msg of messagesToMark) {
                        // Create a reader object with current timestamp
                        const readerInfo = {
                            userId: currentUserRef.current,
                            name: displayName,
                            readAt: new Date().toISOString()
                        };

                        // Handle different readBy formats (array of objects or array of strings)
                        let readBy = [];
                        if (Array.isArray(msg.readBy)) {
                            readBy = [...msg.readBy];
                        } else if (msg.readBy) {
                            readBy = [msg.readBy];
                        }

                        // Add reader in the correct format
                        const updatedReadBy = [...readBy, readerInfo];

                        // Log read receipt for debugging
                        console.log(`Marking message ${msg.id || 'unknown'} as read by ${displayName} (${currentUserRef.current})`);
                        console.log(`Sender: ${msg.sender} (${msg.senderName || 'Unknown'})`);
                        console.log(`Previous readers:`, readBy);
                        console.log(`Updated readers:`, updatedReadBy);

                        // Publish an update to the message's readBy status
                        await chatChannel.publish('message:read', {
                            messageId: msg.id,
                            readBy: updatedReadBy,
                            reader: readerInfo,
                            readAt: new Date().toISOString()
                        });

                        // Update local state
                        setMessages(prevMessages =>
                            prevMessages.map(m =>
                                m.id === msg.id
                                    ? { ...m, readBy: updatedReadBy }
                                    : m
                            )
                        );
                    }
                } catch (error) {
                    console.error('Error marking messages as read:', error);
                }
            };

            // Execute the marking
            markMessagesAsRead();
        }
    }, [messages, ticket.id]);

    // Fix typing indicator handling
    const handleTyping = useCallback(() => {
        const room = roomRef.current;
        // Skip if the room is being cleaned up
        if (!room || (room as any)._isBeingCleaned) return;

        try {
            // Extract display name (part before | or - in currentUserRef.current)
            const displayName = currentUserRef.current.split(/[|-]/)[0];

            const typingData = {
                isTyping: true,
                name: currentUserRef.current, // Keep full ID for uniqueness
                displayName: displayName, // Add display name for UI
                userId: currentUserRef.current,
                isCustomer: false // Explicitly mark as not a customer
            };

            // Publish typing indicator directly to the channel
            const publishTypingDirectly = async () => {
                try {
                    const ablyClient = await initAbly();
                    if (!ablyClient) return;

                    const channelName = `ticket:${ticket.id}`;
                    const channel = ablyClient.channels.get(channelName);

                    // Publish typing event directly to channel
                    channel.publish('typing', {
                        ...typingData,
                        timestamp: new Date().toISOString()
                    });
                } catch (err) {
                    console.warn('Error publishing typing directly to channel:', err);
                }
            };

            // Execute the direct typing publish
            publishTypingDirectly();

            // Clear timeout if it exists and set a new one
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Set timeout to stop typing after 1.5 seconds of inactivity
            typingTimeoutRef.current = setTimeout(() => {
                const stopTypingDirectly = async () => {
                    try {
                        const ablyClient = await initAbly();
                        if (!ablyClient) return;

                        const channelName = `ticket:${ticket.id}`;
                        const channel = ablyClient.channels.get(channelName);

                        // Publish typing stopped event directly to channel
                        channel.publish('typing', {
                            ...typingData,
                            isTyping: false,
                            timestamp: new Date().toISOString()
                        });

                        console.log('Published stop typing event');
                    } catch (err) {
                        console.warn('Error publishing stop typing:', err);
                    }
                };

                stopTypingDirectly();
            }, 1500);
        } catch (error) {
            console.error('Error in handleTyping:', error);
        }
    }, [ticket.id]);

    // Cleanup typing timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return {
        messages,
        newMessage,
        setNewMessage,
        typingUsers,
        activeUsers,
        handleSendMessage,
        handleTyping,
        isLoading,
        isSending,
        error,
        isInternalNote,
        setIsInternalNote
    };
}; 