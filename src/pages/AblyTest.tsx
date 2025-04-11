import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, AlertCircle, Check, MessageCircleCode, Trash2, User } from 'lucide-react';
import { getAblyChatClient, initAbly } from '@/utils/ably';
import AblyConnectionTest from '@/components/AblyConnectionTest';
import { Separator } from '@/components/ui/separator';
import { useAppSelector } from '@/hooks/useAppSelector';
import { AllFeaturesEnabled } from '@ably/chat';

// Helper function to get user initials from name
const getUserInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ')
        .map(part => part[0]?.toUpperCase() || '')
        .filter(Boolean)
        .join('')
        .slice(0, 2);
};

// Safe access to user data with fallbacks
const getUserInfo = (auth: any) => {
    // Try different possible paths for user data
    const userId = auth?.user?.data?.id || 'anonymous';
    const username = auth?.user?.data?.name || 'Anonymous User';
    const userEmail = auth?.user?.data?.email || '';
    return { userId, username, userEmail };
};

const AblyTest = () => {
    const [roomId, setRoomId] = useState('test-room');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [room, setRoom] = useState<any>(null);
    const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
    const [error, setError] = useState<string | null>(null);
    const [diagnosticInfo, setDiagnosticInfo] = useState<string>('');
    const [isJoining, setIsJoining] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    // Get user data from auth state
    const auth = useAppSelector(state => state.auth);
    const { userId, username, userEmail } = getUserInfo(auth);
    const userInitials = getUserInitials(username);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (room) {
                try {
                    console.log('Detaching from room on component unmount');

                    // Mark as being cleaned up to prevent further operations
                    (room as any)._isBeingCleaned = true;

                    // Clean up presence first if available
                    if (room.presence && typeof room.presence.leave === 'function') {
                        try {
                            room.presence.leave().catch(err => {
                                console.warn('Error leaving presence during cleanup:', err);
                            });
                        } catch (error) {
                            console.warn('Error calling presence.leave:', error);
                        }
                    }

                    // Use a small delay to ensure presence operations finish before detaching
                    setTimeout(() => {
                        try {
                            room.detach().catch(err => {
                                console.warn('Error detaching room during cleanup:', err);
                            });
                        } catch (error) {
                            console.error('Error detaching room:', error);
                        }
                    }, 100);
                } catch (error) {
                    console.error('Error detaching from room:', error);
                }
            }

            // Clean up any lingering typing timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [room]);

    const connectToRoom = async () => {
        if (!roomId.trim()) {
            setError('Please enter a room ID');
            return;
        }

        setIsJoining(true);
        setError(null);
        setDiagnosticInfo('');
        setStatus('connecting');

        try {
            // First test Ably basic connection
            console.log('Testing raw Ably connection first...');
            const ablyClient = await initAbly();

            if (!ablyClient) {
                throw new Error('Failed to initialize Ably client');
            }

            console.log('Ably client initialized, getting chat client...');

            // Get chat client
            const chatClient = await getAblyChatClient();

            if (!chatClient) {
                throw new Error('Failed to initialize Ably Chat client');
            }

            // Prepend "ticket:" to the room ID to match the expected format
            const fullRoomId = roomId.startsWith('ticket:') ? roomId : `ticket:${roomId}`;
            console.log('Chat client initialized, getting room:', fullRoomId);

            // Enable presence specifically
            const roomOptions = {
                ...AllFeaturesEnabled,
                presence: {
                    enabled: true,  // Explicitly enable presence
                    memberKey: 'clientId', // Specify how to identify members
                    maxMembers: 100  // Maximum members in presence
                },
                typing: true
            };

            // Get chat room with presence enabled
            const chatRoom = await chatClient.rooms.get(fullRoomId, roomOptions);

            setDiagnosticInfo('Room instance created. Attaching to room...');

            // Set up message handler before attaching
            chatRoom.messages.subscribe((messageEvent: any) => {
                console.log('Received message via Chat SDK:', messageEvent);

                const msg = messageEvent.message;
                const extras = msg.extras || {};

                // Display the sender name from extras
                const senderName = extras.senderName || extras.sender || 'Unknown';

                // Ensure content has HTML format if needed
                let content = msg.text || '';
                if (content && !content.includes('<')) {
                    content = `<p>${content}</p>`;
                }

                // Check if message is from current user
                const isCurrentUser =
                    extras.sender === username ||
                    extras.senderId === userId ||
                    extras.senderName === username;

                setMessages(prev => {
                    // Check for duplicates before adding
                    const msgId = messageEvent.id || `sdk-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

                    // Look for matching ID or very similar content+time
                    const isDuplicate = prev.some(m =>
                        m.id === msgId ||
                        (m.content === content && Math.abs(new Date(m.timestamp).getTime() - new Date(messageEvent.timestamp || Date.now()).getTime()) < 1000)
                    );

                    if (isDuplicate) {
                        console.log('Chat SDK message appears to be duplicate, not adding');
                        return prev;
                    }

                    console.log('Adding Chat SDK message to state');
                    return [...prev, {
                        id: msgId,
                        content: content,
                        sender: senderName,
                        timestamp: messageEvent.timestamp,
                        isSystem: extras.isSystem || false,
                        isCurrentUser: isCurrentUser
                    }];
                });
            });

            // Set up status change handler
            chatRoom.onStatusChange((statusChange: any) => {
                console.log('Room status changed:', statusChange);

                const statusInfo = `Room status changed from ${statusChange.previous} to ${statusChange.current}`;
                setDiagnosticInfo(prev => `${prev}\n${statusInfo}`);

                if (statusChange.current === 'failed') {
                    setStatus('error');
                    const errorMsg = statusChange.error?.message || 'Unknown error';
                    setError(`Room connection failed: ${errorMsg}`);
                    setDiagnosticInfo(prev => `${prev}\nError: ${errorMsg}`);
                } else if (statusChange.current === 'attached') {
                    setStatus('connected');
                    setDiagnosticInfo(prev => `${prev}\nSuccessfully attached to room`);

                    // Send a system message with user's name
                    try {
                        chatRoom.messages.send({
                            text: `${username} has joined the room`,
                            extras: {
                                senderName: 'System',
                                sender: 'System',
                                isSystem: true
                            }
                        }).catch(err => {
                            console.error('Error sending join message:', err);
                            setDiagnosticInfo(prev => `${prev}\nError sending system message: ${err.message}`);
                        });

                        // Initialize presence if available
                        if (chatRoom.presence && typeof chatRoom.presence.enter === 'function') {
                            chatRoom.presence.enter({
                                name: username,
                                userId: userId,
                                isCustomer: true
                            }).catch(err => {
                                console.error('Error entering presence:', err);
                                setDiagnosticInfo(prev => `${prev}\nWarning: Could not initialize presence: ${err.message}`);
                            });
                        }
                    } catch (error) {
                        console.error('Error during room initialization:', error);
                        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                        setDiagnosticInfo(prev => `${prev}\nWarning: ${errorMsg}`);
                    }
                }
            });

            // Attach to the room
            setDiagnosticInfo(prev => `${prev}\nCalling room.attach()`);
            await chatRoom.attach();

            console.log('Successfully attached to room');
            setRoom(chatRoom);

            // Add direct channel subscription for messages sent via direct publish
            try {
                console.log('Setting up direct channel subscription in AblyTest');
                const directChannel = ablyClient.channels.get(fullRoomId);

                directChannel.subscribe('message', (message: any) => {
                    console.log('AblyTest received direct channel message:', message);

                    const data = message.data;
                    if (!data) {
                        console.error('Direct message data is empty:', message);
                        return;
                    }

                    const extras = data.extras || {};
                    const senderName = extras.senderName || extras.sender || 'Unknown';

                    // Check if this message is from the current user - we need to check multiple identifiers
                    const isCurrentUser =
                        extras.sender === username ||
                        extras.senderId === userId ||
                        extras.senderName === username;

                    // Add the message to our state if it doesn't already exist
                    setMessages(prev => {
                        // Generate a unique ID if needed
                        const msgId = message.id || `direct-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

                        // Check for duplicates - look for matching ID or very similar content+time
                        const isDuplicate = prev.some(m =>
                            m.id === msgId ||
                            (m.content === data.text && Math.abs(new Date(m.timestamp).getTime() - new Date(extras.timestamp || Date.now()).getTime()) < 1000)
                        );

                        if (isDuplicate) {
                            console.log('Message appears to be a duplicate, not adding');
                            return prev;
                        }

                        // Ensure content has HTML format if needed
                        let content = data.text || '';
                        if (content && !content.includes('<')) {
                            content = `<p>${content}</p>`;
                        }

                        const newMsg = {
                            id: msgId,
                            content: content,
                            sender: senderName,
                            timestamp: extras.timestamp || new Date().toISOString(),
                            isSystem: extras.isSystem || false,
                            isCurrentUser: isCurrentUser
                        };

                        console.log('Adding direct message to AblyTest state:', newMsg);
                        return [...prev, newMsg];
                    });
                });

                setDiagnosticInfo(prev => `${prev}\nDirect channel subscription also set up`);

                // Also subscribe to typing events directly
                try {
                    console.log('Setting up direct typing subscription in AblyTest');

                    directChannel.subscribe('typing', (message: any) => {
                        console.log('AblyTest received direct typing event:', message);

                        const data = message.data;
                        if (!data) return;

                        const isTyping = data.isTyping === true;
                        const memberName = data.name || 'Unknown';
                        const isCustomer = data.isCustomer === true;

                        // Skip self typing
                        if (memberName === username) return;

                        // Show "Agent is typing" for agent messages
                        const displayName = isCustomer ? memberName : 'Agent';

                        if (isTyping) {
                            setTypingUsers(prev => [...new Set([...prev, displayName])]);
                        } else {
                            setTypingUsers(prev => prev.filter(user =>
                                user !== displayName &&
                                user !== 'Agent'
                            ));
                        }
                    });

                    setDiagnosticInfo(prev => `${prev}\nDirect typing subscription also set up`);
                } catch (err) {
                    console.error('Error setting up direct typing subscription:', err);
                    setDiagnosticInfo(prev => `${prev}\nError setting up direct typing subscription: ${err.message}`);
                }
            } catch (err) {
                console.error('Error setting up direct channel subscription:', err);
                setDiagnosticInfo(prev => `${prev}\nError setting up direct subscription: ${err.message}`);
            }

            // Add presence diagnostics
            try {
                const hasPresence = chatRoom.presence &&
                    typeof chatRoom.presence.enter === 'function' &&
                    typeof chatRoom.presence.subscribe === 'function';

                setDiagnosticInfo(prev => `${prev}\nPresence capability: ${hasPresence ? 'Available' : 'NOT AVAILABLE'}`);

                if (!hasPresence) {
                    setDiagnosticInfo(prev => `${prev}\nWARNING: Presence is not available. Typing indicators will not work.`);
                }
            } catch (error) {
                console.error('Error checking presence capabilities:', error);
                setDiagnosticInfo(prev => `${prev}\nError checking presence: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error connecting to room:', error);
            setStatus('error');
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            setError(`Failed to connect to room: ${errorMsg}`);
            setDiagnosticInfo(prev => `${prev}\nConnection error: ${errorMsg}`);
        } finally {
            setIsJoining(false);
        }
    };

    const clearMessages = () => {
        setMessages([]);
    };

    const sendMessage = async () => {
        if (!message.trim() || !room) return;

        setIsSending(true);
        try {
            // Prepare the message data
            const messageData = {
                text: message,
                extras: {
                    sender: username,  // Use actual username as sender (not 'You')
                    senderName: username, // Include the actual user name
                    senderId: userId, // Include user ID for identification
                    userInitials: userInitials,
                    isCustomer: true // Mark as customer for the conversation panel
                }
            };

            // Method 1: Send via Chat SDK
            await room.messages.send(messageData);

            // Method 2: Also publish directly to the channel
            try {
                console.log("Also publishing directly to channel for compatibility");
                const ablyClient = await initAbly();
                if (ablyClient) {
                    // Get the raw channel with the same name
                    const channelName = room.id; // This should be "ticket:roomId"
                    const channel = ablyClient.channels.get(channelName);

                    // Publish directly
                    await channel.publish("message", messageData);
                    console.log("Message published directly to channel:", channelName);
                }
            } catch (err) {
                console.warn("Could not publish directly to channel (this is okay if Chat SDK worked):", err);
            }

            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            setError(`Failed to send message: ${errorMsg}`);
            setDiagnosticInfo(prev => `${prev}\nSend error: ${errorMsg}`);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleTyping = async () => {
        if (!message.trim() || !room) return;

        try {
            const typingData = {
                isTyping: true,
                name: username,
                userId: userEmail || username,
                isCustomer: true
            };

            // 1. Update typing via Chat SDK if available
            if (room.presence && typeof room.presence.update === 'function') {
                // Update presence with typing status and customer flag
                await room.presence.update(typingData);
            }

            // 2. Also publish typing directly to the channel
            try {
                const ablyClient = await initAbly();
                if (ablyClient) {
                    const channelName = room.id; // This should be "ticket:roomId"
                    const channel = ablyClient.channels.get(channelName);

                    // Publish typing directly to channel
                    channel.publish('typing', {
                        ...typingData,
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (err) {
                console.warn('Error publishing typing directly to channel:', err);
            }

            // Clear timeout if it exists
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Set timeout to stop typing after 1.5 seconds
            typingTimeoutRef.current = setTimeout(async () => {
                try {
                    const stopTypingData = {
                        isTyping: false,
                        name: username,
                        userId: userEmail || username,
                        isCustomer: true
                    };

                    // 1. Stop typing via Chat SDK if available
                    if (room && room.presence && typeof room.presence.update === 'function') {
                        await room.presence.update(stopTypingData);
                    }

                    // 2. Also publish stop typing directly
                    try {
                        const ablyClient = await initAbly();
                        if (ablyClient) {
                            const channelName = room.id;
                            const channel = ablyClient.channels.get(channelName);

                            // Publish stop typing directly
                            channel.publish('typing', {
                                ...stopTypingData,
                                timestamp: new Date().toISOString()
                            });
                        }
                    } catch (err) {
                        console.warn('Error publishing stop typing directly:', err);
                    }
                } catch (error) {
                    console.error('Error stopping typing indicator:', error);
                }
            }, 1500);
        } catch (error) {
            console.error('Error updating typing status:', error);
        }
    };

    // Simplified input handling without typing indicators if presence is not available
    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
        // Only try to update typing status if we have presence functionality
        if (e.target.value.trim() && room?.presence && typeof room.presence.update === 'function') {
            handleTyping();
        }
    };

    // Update the typing subscription to handle presence safely
    useEffect(() => {
        const presenceEnabled = room?.presence && typeof room.presence.subscribe === 'function';

        if (room && presenceEnabled) {
            try {
                // Subscribe to presence updates for typing indicators
                const unsubscribe = room.presence.subscribe('update', (member: any) => {
                    if (member.data?.isTyping !== undefined) {
                        const memberName = member.data.name;
                        // Only show typing indicators for others, not self
                        if (memberName !== username) {
                            if (member.data.isTyping) {
                                // Show "Agent is typing" for agent messages
                                const displayName = member.data.isCustomer === false ? 'Agent' : memberName;
                                setTypingUsers(prev => [...new Set([...prev, displayName])]);
                            } else {
                                setTypingUsers(prev => prev.filter(user => user !== memberName && user !== 'Agent'));
                            }
                        }
                    }
                });

                return () => {
                    // Clean up subscription when component unmounts or room changes
                    if (unsubscribe && typeof unsubscribe === 'function') {
                        unsubscribe();
                    }
                };
            } catch (error) {
                console.error('Error setting up typing indicator subscription:', error);
            }
        } else if (room && !presenceEnabled) {
            console.warn('Presence is not available on this room. Typing indicators will not work.');
        }
    }, [room, username]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <MessageCircleCode className="h-6 w-6" />
                Ably Chat Test Page
            </h1>
            <p className="text-muted-foreground mb-8">Test your Ably Chat connection and functionality</p>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Connection Settings</CardTitle>
                            <CardDescription>Set up and test your Ably connection</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <AblyConnectionTest />

                            <Separator className="my-2" />

                            <div className="flex items-center gap-2 py-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{username}</p>
                                    {userEmail && <p className="text-xs text-muted-foreground">{userEmail}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Room ID</label>
                                <p className="text-xs text-muted-foreground">("ticket:" prefix will be added automatically)</p>
                                <Input
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    placeholder="Enter room ID"
                                    disabled={status === 'connected' || isJoining}
                                />
                            </div>

                            <Button
                                onClick={connectToRoom}
                                disabled={status === 'connected' || isJoining || !roomId.trim()}
                                className="w-full"
                            >
                                {isJoining ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Connecting...
                                    </>
                                ) : status === 'connected' ?
                                    'Connected' :
                                    'Connect to Room'
                                }
                            </Button>

                            {status === 'connected' && (
                                <Alert className="bg-green-50 text-green-800 border-green-200">
                                    <Check className="h-4 w-4" />
                                    <AlertTitle>Connected</AlertTitle>
                                    <AlertDescription>
                                        You are connected to room: {roomId.startsWith('ticket:') ? roomId : `ticket:${roomId}`}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {diagnosticInfo && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-medium mb-2">Diagnostic Info</h3>
                                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                                        {diagnosticInfo}
                                    </pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card className="h-full flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Chat Messages</CardTitle>
                                <CardDescription>
                                    {status === 'connected'
                                        ? `Connected to room: ${roomId.startsWith('ticket:') ? roomId : `ticket:${roomId}`}`
                                        : 'Connect to a room to start chatting'}
                                </CardDescription>
                            </div>
                            {messages.length > 0 && (
                                <Button variant="ghost" size="icon" onClick={clearMessages} title="Clear messages">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="flex-grow overflow-hidden">
                            <ScrollArea className="h-[400px] pr-4">
                                {messages.length === 0 ? (
                                    <div className="text-center text-gray-500 py-10">
                                        {status === 'connected'
                                            ? 'No messages yet. Send your first message below!'
                                            : 'Connect to a room to see messages'}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((msg, index) => (
                                            <div
                                                key={msg.id || index}
                                                className={`px-3 py-2 rounded-lg ${msg.isSystem
                                                    ? 'bg-gray-100 text-gray-700 text-center text-sm italic'
                                                    : msg.isCurrentUser
                                                        ? 'bg-blue-500 text-white ml-auto'
                                                        : 'bg-gray-200 text-gray-800 mr-auto'
                                                    } max-w-[80%] break-words`}
                                            >
                                                <div className="font-medium text-xs mb-1">
                                                    {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString()}
                                                </div>
                                                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </ScrollArea>
                            {/* Only show typing indicators if available and someone is typing */}
                            {typingUsers && typingUsers.length > 0 && (
                                <div className="mt-2 text-xs text-muted-foreground italic">
                                    {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="border-t p-4">
                            <div className="flex w-full gap-2">
                                <Input
                                    value={message}
                                    onChange={handleMessageChange}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type your message..."
                                    disabled={status !== 'connected' || isSending}
                                />
                                <Button
                                    onClick={sendMessage}
                                    disabled={status !== 'connected' || isSending || !message.trim()}
                                >
                                    {isSending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AblyTest;