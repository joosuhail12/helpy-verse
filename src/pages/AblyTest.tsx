import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, AlertCircle, Check, MessageCircleCode, Trash2 } from 'lucide-react';
import { getAblyChatClient, initAbly } from '@/utils/ably';
import AblyConnectionTest from '@/components/AblyConnectionTest';
import { Separator } from '@/components/ui/separator';

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
                    room.detach();
                } catch (error) {
                    console.error('Error detaching from room:', error);
                }
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

            // Get chat room
            const chatRoom = await chatClient.rooms.get(fullRoomId);

            setDiagnosticInfo('Room instance created. Attaching to room...');

            // Set up message handler before attaching
            chatRoom.messages.subscribe((messageEvent: any) => {
                console.log('Received message:', messageEvent);

                const msg = messageEvent.message;
                setMessages(prev => [...prev, {
                    id: messageEvent.id,
                    content: msg.text || '',
                    sender: msg.extras?.sender || 'Unknown',
                    timestamp: messageEvent.timestamp,
                    isSystem: msg.extras?.isSystem || false
                }]);
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

                    // Send a system message
                    chatRoom.messages.send({
                        text: 'A new user has joined the room',
                        extras: {
                            sender: 'System',
                            isSystem: true
                        }
                    }).catch(err => {
                        console.error('Error sending join message:', err);
                        setDiagnosticInfo(prev => `${prev}\nError sending system message: ${err.message}`);
                    });
                }
            });

            // Attach to the room
            setDiagnosticInfo(prev => `${prev}\nCalling room.attach()`);
            await chatRoom.attach();

            console.log('Successfully attached to room');
            setRoom(chatRoom);
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
            await room.messages.send({
                text: message,
                extras: {
                    sender: 'You',
                }
            });

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
                                                    : msg.sender === 'You'
                                                        ? 'bg-blue-500 text-white ml-auto'
                                                        : 'bg-gray-200 text-gray-800 mr-auto'
                                                    } max-w-[80%] break-words`}
                                            >
                                                <div className="font-medium text-xs mb-1">
                                                    {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString()}
                                                </div>
                                                <div>{msg.content}</div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                        <CardFooter className="border-t p-4">
                            <div className="flex w-full gap-2">
                                <Input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
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