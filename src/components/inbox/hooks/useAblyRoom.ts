import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getAblyChatRoom, getAblyChatClient } from '@/utils/ably';
import debounce from 'lodash/debounce';
import type { Message, UserPresence } from '../types';
import type { Ticket } from '@/types/ticket';
import { AllFeaturesEnabled } from '@ably/chat';

export const useAblyRoom = (ticket: Ticket) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isInternalNote, setIsInternalNote] = useState(false);
    // Uncomment typing and presence state
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [activeUsers, setActiveUsers] = useState<UserPresence[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Initialize messages with the initial ticket message
    useEffect(() => {
        setMessages([{
            id: ticket.id,
            content: ticket.lastMessage,
            sender: ticket.customer,
            timestamp: ticket.createdAt,
            isCustomer: true,
            readBy: []
        }]);
    }, [ticket]);

    // Handle room setup and cleanup
    useEffect(() => {
        let roomInstance: any;
        let isComponentMounted = true;

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

                const newMsg: Message = {
                    id: messageEvent.id,
                    content: message.text || '',
                    sender: extras.sender || 'Unknown',
                    timestamp: messageEvent.timestamp,
                    isCustomer: extras.isCustomer || false,
                    type: extras.type || 'message',
                    readBy: extras.readBy || []
                };

                setMessages(prev => [...prev, newMsg]);
            });

            // Uncomment presence setup
            // Handle presence
            setupPresence(room).catch(err => console.error('Error setting up presence:', err));
        };


        const setupPresence = async (room: any) => {
            try {
                console.log('Setting up presence');

                // Enter presence
                await room.presence.enter({
                    userId: 'Agent',
                    name: 'Agent',
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

                    toast({
                        description: `${member.data.name} joined the conversation`,
                    });
                    setActiveUsers(prev => [...prev, member.data as UserPresence]);
                });

                room.presence.subscribe('leave', (member: any) => {
                    if (!isComponentMounted) return;
                    console.log('Member left:', member);

                    toast({
                        description: `${member.data.name} left the conversation`,
                    });
                    setActiveUsers(prev => prev.filter(user => user.userId !== member.data.userId));
                });

                room.presence.subscribe('update', (member: any) => {
                    if (!isComponentMounted) return;

                    if (member.data?.isTyping) {
                        setTypingUsers(prev => [...new Set([...prev, member.data.name])]);
                    } else {
                        setTypingUsers(prev => prev.filter(user => user !== member.data.name));
                    }

                    if (member.data?.lastRead) {
                        setMessages(prev => prev.map(msg => ({
                            ...msg,
                            readBy: [...(msg.readBy || []), member.data.userId]
                        })));
                    }

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
            isComponentMounted = false;
            if (roomInstance) {
                try {
                    console.log('Cleaning up room');
                    // Uncomment presence leave
                    roomInstance.presence.leave();
                    roomInstance.detach();
                } catch (error) {
                    console.error('Error cleaning up room:', error);
                }
            }
        };
    }, [ticket.id, toast]);

    // Uncomment typing indicator functionality
    // Typing indicator functionality
    const debouncedStopTyping = useCallback(
        debounce(async (room) => {
            try {
                await room.typing.stop();
            } catch (error) {
                console.error('Error stopping typing indicator:', error);
            }
        }, 1000),
        []
    );

    const handleTyping = async () => {
        try {
            const room = await getAblyChatRoom(`ticket:${ticket.id}`);
            if (!room) {
                console.error('Room not available for typing indicator');
                return;
            }
            await room.typing.start();
            debouncedStopTyping(room);
        } catch (error) {
            console.error('Error updating typing status:', error);
        }
    };

    // Send message functionality
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        setIsSending(true);
        try {
            const room = await getAblyChatRoom(`ticket:${ticket.id}`);
            if (!room) {
                throw new Error('Could not connect to chat room');
            }

            const messageData = {
                text: newMessage,
                extras: {
                    sender: 'Agent',
                    isCustomer: false,
                    type: isInternalNote ? 'internal_note' : 'message',
                    readBy: ['Agent']
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
        // Uncomment returned presence and typing values
        typingUsers,
        activeUsers,
        handleSendMessage,
        // Uncomment handleTyping
        handleTyping,
        isLoading,
        isSending,
        error,
        isInternalNote,
        setIsInternalNote
    };
}; 