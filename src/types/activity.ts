
export type ActivityType = 'email' | 'note' | 'call' | 'meeting' | 'message' | 'task';

export interface ActivityMetadata {
  subject?: string;
  content?: string;
  taskName?: string;
  status?: string;
  [key: string]: any;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user: string;
  metadata?: ActivityMetadata;
}
