import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Check, Info } from 'lucide-react';
import { initAbly } from '@/utils/ably';

const AblyConnectionTest = () => {
    const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string>('');
    const [details, setDetails] = useState<string>('');

    const testConnection = async () => {
        setStatus('testing');
        setMessage('');
        setDetails('');

        try {
            console.log('Testing Ably connection...');
            const ablyKey = import.meta.env.VITE_ABLY_API_KEY;

            if (!ablyKey) {
                throw new Error('Ably API key not found in environment variables');
            }

            // Check if API key is well-formed
            if (!ablyKey.includes(':')) {
                setDetails('API key appears malformed. Should be in format "key:secret"');
            }

            const client = await initAbly();

            if (!client) {
                throw new Error('Failed to initialize Ably client');
            }

            setStatus('success');
            setMessage('Successfully connected to Ably!');
            setDetails(`Using API key: ${ablyKey.substring(0, 8)}...`);
        } catch (error) {
            console.error('Ably connection test failed:', error);
            setStatus('error');
            setMessage(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

            // Add more detailed diagnostic info
            const env = import.meta.env.MODE;
            setDetails(`Environment: ${env}. Check your .env file and make sure VITE_ABLY_API_KEY is set correctly.`);
        }
    };

    // Test connection on mount
    useEffect(() => {
        testConnection();
    }, []);

    return (
        <div className="space-y-4">
            {status === 'error' && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Connection Error</AlertTitle>
                    <AlertDescription className="space-y-2">
                        <p>{message}</p>
                        {details && <p className="text-sm opacity-80">{details}</p>}
                    </AlertDescription>
                </Alert>
            )}

            {status === 'success' && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Connected</AlertTitle>
                    <AlertDescription className="space-y-2">
                        <p>{message}</p>
                        {details && <p className="text-sm opacity-80">{details}</p>}
                    </AlertDescription>
                </Alert>
            )}

            {status === 'idle' && (
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Ably Connection</AlertTitle>
                    <AlertDescription>Click to test connection to Ably</AlertDescription>
                </Alert>
            )}

            <Button
                onClick={testConnection}
                size="sm"
                disabled={status === 'testing'}
                variant={status === 'success' ? 'outline' : 'default'}
            >
                {status === 'testing' ? (
                    <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Testing Connection...
                    </>
                ) : (
                    'Test Ably Connection'
                )}
            </Button>
        </div>
    );
};

export default AblyConnectionTest; 