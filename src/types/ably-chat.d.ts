declare module '@ably/chat' {
    import * as Ably from 'ably';

    export class ChatClient {
        constructor(realtime: Ably.Types.RealtimePromise, options?: ChatClientOptions);
        rooms: Rooms;
        connection: Connection;
    }

    export interface ChatClientOptions {
        logLevel?: LogLevel | string;
        logHandler?: (message: string, level: LogLevel) => void;
    }

    export enum LogLevel {
        Trace = 'trace',
        Debug = 'debug',
        Info = 'info',
        Warn = 'warn',
        Error = 'error',
        Silent = 'silent',
    }

    export interface Connection {
        status: string;
        onStatusChange(callback: (change: ConnectionStatusChange) => void): { off: () => void };
    }

    export interface ConnectionStatusChange {
        current: string;
        previous: string;
    }

    export class Rooms {
        get(roomId: string, options?: RoomOptions): Promise<Room>;
        release(roomId: string): Promise<void>;
    }

    export interface Room {
        roomId: string;
        status: 'initializing' | 'initialized' | 'attaching' | 'attached' | 'detaching' | 'detached' | 'suspended' | 'failed';
        error?: Error;
        attach(): Promise<void>;
        detach(): Promise<void>;
        onStatusChange(callback: (status: RoomStatusChange) => void): { off: () => void };
        offAllStatusChange(): void;

        messages: {
            subscribe(callback: (message: MessageEvent) => void): { unsubscribe: () => void };
            send(data: MessageData): Promise<void>;
            get(options?: MessageGetOptions): Promise<MessagePage>;
        };

        presence: {
            enter(data: any): Promise<void>;
            leave(): Promise<void>;
            update(data: any): Promise<void>;
            subscribe(event: string, callback: (member: any) => void): { unsubscribe: () => void };
            unsubscribe(): void;
            get(): Promise<any[]>;
            getAll(): Promise<any[]>;
        };

        typing: {
            start(): Promise<void>;
            stop(): Promise<void>;
            subscribe(callback: (typing: any) => void): { unsubscribe: () => void };
        };

        reactions: {
            add(messageId: string, emoji: string): Promise<void>;
            remove(messageId: string, emoji: string): Promise<void>;
            get(messageId: string): Promise<any[]>;
            subscribe(messageId: string, callback: (reactionUpdate: any) => void): { unsubscribe: () => void };
        };
    }

    export interface MessageData {
        text: string;
        extras?: Record<string, any>;
    }

    export interface MessageGetOptions {
        limit?: number;
        start?: string;
        end?: string;
        direction?: 'backwards' | 'forwards';
    }

    export interface MessagePage {
        items: MessageEvent[];
        hasNext: boolean;
        isLast: boolean;
        next: () => Promise<MessagePage>;
    }

    export interface RoomStatusChange {
        current: Room['status'];
        previous: Room['status'];
    }

    export interface MessageEvent {
        id: string;
        timestamp: string;
        message: Message;
    }

    export interface Message {
        id?: string;
        text?: string;
        timestamp?: string;
        extras?: any;
    }

    export interface RoomOptions {
        presence?: boolean | PresenceOptions;
        occupancy?: boolean | OccupancyOptions;
        typing?: boolean | TypingOptions;
        reactions?: boolean | ReactionsOptions;
    }

    export interface PresenceOptions {
        // Add necessary options
    }

    export interface OccupancyOptions {
        // Add necessary options
    }

    export interface TypingOptions {
        timeoutMs?: number;
    }

    export interface ReactionsOptions {
        // Add necessary options
    }

    export const AllFeaturesEnabled: RoomOptions;
    export const RoomOptionsDefaults: RoomOptions;
} 