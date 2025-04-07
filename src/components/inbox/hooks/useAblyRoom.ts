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
        console.log('User name from Redux store:', userName);
        console.log('Auth state:', authState?.auth);
        currentUserRef.current = userName || 'Agent';
        console.log('Using sender name:', currentUserRef.current);
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
                    // This is a message from the current agent
                    senderName = currentUserRef.current;
                } else if (extras.isCustomer === true) {
                    // This is explicitly marked as a customer message
                    // Use the ticket's customer name with fallback
                    senderName = ticket.customer || extras.senderName || 'Customer';
                } else {
                    // For other agent messages
                    senderName = extras.senderName || extras.sender || 'Agent';
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

            // Handle presence
            setupPresence(room).catch(err => console.error('Error setting up presence:', err));
        };


        const setupPresence = async (room: any) => {
            try {
                console.log('Setting up presence');

                // Enter presence with current user info
                await room.presence.enter({
                    userId: currentUserRef.current,
                    name: currentUserRef.current,
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

                    const memberName = member.data.name;
                    // Don't show toast for current user
                    if (memberName !== currentUserRef.current) {
                        toast({
                            description: `${memberName} joined the conversation`,
                        });
                    }
                    setActiveUsers(prev => [...prev, member.data as UserPresence]);
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
                        setActiveUsers(presentMembers.map((member: any) => ({
                            userId: member.clientId,
                            name: member.data?.name || 'Unknown',
                            lastActive: member.data?.lastActive || new Date().toISOString(),
                            location: member.data?.location
                        })));
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
                            (directChannelSubscription as any)._typingSubscription.unsubscribe();
                            console.log('Unsubscribed from direct typing channel');
                        } catch (err) {
                            console.warn('Error unsubscribing from direct typing channel:', err);
                        }
                    }

                    directChannelSubscription.unsubscribe();
                    console.log('Unsubscribed from direct channel');
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

    // Typing indicator functionality with proper cleanup
    const debouncedStopTyping = useCallback(
        debounce(async () => {
            try {
                const room = roomRef.current;
                // Skip if the room is being cleaned up
                if (!room || (room as any)._isBeingCleaned) return;

                // Verify presence is available
                if (!room.presence || typeof room.presence.update !== 'function') {
                    console.warn('Presence is not available for typing indicators');
                    return;
                }

                const typingData = {
                    isTyping: false,
                    name: currentUserRef.current,
                    userId: currentUserRef.current,
                    isCustomer: false // Explicitly mark as not a customer
                };

                // 1. Stop typing via Chat SDK
                await room.presence.update(typingData).catch(err => {
                    console.warn('Error stopping typing indicator via Chat SDK:', err);
                });

                // 2. Also publish stop typing directly to the channel
                try {
                    const ablyClient = await initAbly();
                    if (!ablyClient) return;

                    const channelName = `ticket:${ticket.id}`;
                    const channel = ablyClient.channels.get(channelName);

                    // Publish typing stopped event directly to channel
                    channel.publish('typing', {
                        ...typingData,
                        timestamp: new Date().toISOString()
                    });
                } catch (err) {
                    console.warn('Error publishing stop typing directly to channel:', err);
                }
            } catch (error) {
                console.error('Error stopping typing indicator:', error);
            }
        }, 1000),
        [ticket.id]
    );

    // Cleanup typing timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            debouncedStopTyping.cancel();
        };
    }, [debouncedStopTyping]);

    const handleTyping = useCallback(() => {
        const room = roomRef.current;
        // Skip if the room is being cleaned up
        if (!room || (room as any)._isBeingCleaned) return;

        try {
            // First verify that presence is available
            if (!room.presence || typeof room.presence.update !== 'function') {
                console.warn('Presence is not available for typing indicators');
                return;
            }

            const typingData = {
                isTyping: true,
                name: currentUserRef.current,
                userId: currentUserRef.current,
                isCustomer: false // Explicitly mark as not a customer
            };

            // 1. Update typing state in Ably presence via Chat SDK
            room.presence.update(typingData).catch(err => {
                console.warn('Error updating typing status via Chat SDK:', err);
            });

            // 2. Also publish a typing indicator directly to the channel
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
            typingTimeoutRef.current = setTimeout(debouncedStopTyping, 1500);
        } catch (error) {
            console.error('Error in handleTyping:', error);
        }
    }, [debouncedStopTyping, ticket.id]);

    // Completely replace the handleSendMessage function with a more direct approach
    const handleSendMessage = async () => {
        console.log("handleSendMessage called in useAblyRoom");
        if (!newMessage || !newMessage.trim()) {
            console.log("Message is empty, not sending");
            return;
        }

        setIsSending(true);
        console.log("Setting isSending to true");

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

            // Get chat client to try both methods of sending
            const chatClient = await getAblyChatClient();
            if (!chatClient) {
                throw new Error("Failed to initialize Ably Chat client");
            }

            // Prepare the message data - make sure it's compatible with both the ConversationPanel and AblyTest
            const senderName = currentUserRef.current || "Agent";
            const messageData = {
                text: newMessage,
                extras: {
                    sender: senderName,
                    senderName: senderName,
                    senderId: senderName, // Add senderId to match AblyTest format
                    isCustomer: false,
                    type: isInternalNote ? "internal_note" : "message",
                    readBy: [senderName],
                    timestamp: new Date().toISOString()
                }
            };
            console.log("Message data prepared:", JSON.stringify(messageData));

            // IMPORTANT: Try both methods to ensure compatibility with both components

            // 1. Publish directly to the channel (for the ConversationPanel)
            console.log("Publishing message directly to channel");
            await channel.publish("message", messageData);
            console.log("Message published successfully to direct channel");

            // 2. Also try sending via the Chat SDK (for the AblyTest component)
            try {
                console.log("Attempting to send via Chat SDK as well");
                // Get room
                const chatRoom = await chatClient.rooms.get(channelName);

                // Send via Chat SDK
                if (chatRoom && chatRoom.messages && typeof chatRoom.messages.send === 'function') {
                    await chatRoom.messages.send(messageData);
                    console.log("Message also sent via Chat SDK");
                } else {
                    console.warn("Chat SDK message sending not available");
                }
            } catch (err) {
                console.warn("Could not send via Chat SDK (this is okay if direct channel publish worked):", err);
            }

            // To ensure the message appears immediately, add it directly to our state
            // This helps in case there are issues with the subscription
            const newMsg: Message = {
                id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                content: newMessage,
                sender: senderName,
                timestamp: new Date().toISOString(),
                isCustomer: false,
                type: isInternalNote ? "internal_note" : "message",
                readBy: [senderName]
            };

            console.log("Adding local copy of sent message to state");
            setMessages(prev => [...prev, newMsg]);

            // Clear the message and update state
            setNewMessage("");
            setIsInternalNote(false);

            toast({
                description: isInternalNote ? "Internal note added" : "Message sent successfully",
            });
        } catch (error) {
            console.error("Error in direct message send:", error);
            const errorMsg = error instanceof Error ? error.message : "Unknown error";

            toast({
                variant: "destructive",
                description: `Failed to send message: ${errorMsg}`,
            });
        } finally {
            setIsSending(false);
            console.log("Setting isSending to false");
        }
    };

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