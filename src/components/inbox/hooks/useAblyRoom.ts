import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getAblyChatRoom, getAblyChatClient } from '@/utils/ably';
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
        currentUserRef.current = authState?.auth?.user?.data?.name || 'Agent';
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

        const setupRoom = async () => {
            setIsLoading(true);
            setError(null);

            try {
                console.log('Setting up chat room for ticket:', ticket.id);

                // Get chat client
                const chatClient = await getAblyChatClient();

                if (!chatClient) {
                    throw new Error('Failed to initialize Ably Chat client');
                }

                console.log('Got chat client, getting room');

                // Get chat room with all features enabled
                const room = await chatClient.rooms.get(`ticket:${ticket.id}`, AllFeaturesEnabled);
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

                // Attempt to attach to the room
                console.log('Attaching to room');
                await room.attach();
                console.log('Room attached');

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
                    senderName = currentUserRef.current;
                } else if (extras.isCustomer || !extras.sender || extras.sender === 'customer') {
                    // For customer messages, use the ticket's customer name
                    senderName = ticket.customer || 'Customer';
                } else {
                    // For other agent messages
                    senderName = extras.senderName || extras.sender || 'Agent';
                }

                const newMsg: Message = {
                    id: messageEvent.id,
                    content: message.text || '',
                    sender: senderName,
                    timestamp: messageEvent.timestamp || new Date().toISOString(),
                    isCustomer: extras.isCustomer || (!isFromCurrentUser && !extras.sender),
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

                // When stopping typing, include proper user identification
                await room.presence.update({
                    isTyping: false,
                    name: currentUserRef.current,
                    userId: currentUserRef.current,
                    isCustomer: false // Explicitly mark as not a customer
                }).catch(err => {
                    console.warn('Error stopping typing indicator:', err);
                });
            } catch (error) {
                console.error('Error stopping typing indicator:', error);
            }
        }, 1000),
        []
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

            // Update typing state in Ably presence with proper user identification
            room.presence.update({
                isTyping: true,
                name: currentUserRef.current,
                userId: currentUserRef.current,
                isCustomer: false // Explicitly mark as not a customer
            }).catch(err => {
                console.warn('Error updating typing status:', err);
            });

            // Clear timeout if it exists and set a new one
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Set timeout to stop typing after 1.5 seconds of inactivity
            typingTimeoutRef.current = setTimeout(debouncedStopTyping, 1500);
        } catch (error) {
            console.error('Error in handleTyping:', error);
        }
    }, [debouncedStopTyping]);

    // Send message functionality
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        setIsSending(true);
        try {
            const room = await getAblyChatRoom(`ticket:${ticket.id}`);
            if (!room || (room as any)._isBeingCleaned) {
                throw new Error('Could not connect to chat room or room is being cleaned up');
            }

            // Get current user name
            const senderName = currentUserRef.current;

            const messageData = {
                text: newMessage,
                extras: {
                    sender: senderName,
                    senderName: senderName, // Add explicit sender name
                    isCustomer: false,
                    type: isInternalNote ? 'internal_note' : 'message',
                    readBy: [senderName],
                    timestamp: new Date().toISOString() // Ensure timestamp is set
                }
            };

            await room.messages.send(messageData);
            setNewMessage('');
            setIsInternalNote(false);

            toast({
                description: isInternalNote ? "Internal note added" : "Message sent successfully",
            });
        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                variant: "destructive",
                description: "Failed to send message. Please try again.",
            });
        } finally {
            setIsSending(false);
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