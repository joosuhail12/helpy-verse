
import { AnalyticsPlugin, ChatPluginContext } from '../types';

/**
 * A demo plugin that tracks analytics events
 */
export const ChatAnalyticsPlugin: AnalyticsPlugin = {
  type: 'analytics',
  id: 'chat-analytics',
  name: 'Chat Analytics',
  description: 'Tracks chat usage and interaction patterns',
  
  trackEvent: (eventName: string, data: any, context: ChatPluginContext) => {
    // In a real implementation, this would send data to an analytics service
    console.log(`[Analytics] Event: ${eventName}`, {
      ...data,
      workspaceId: context.workspaceId,
      conversationId: context.conversationId,
      timestamp: new Date().toISOString()
    });
    
    // Example of how to persist analytics data locally
    const analyticsKey = `chat_analytics_${context.workspaceId}`;
    try {
      // Get existing analytics
      const existingData = localStorage.getItem(analyticsKey);
      const analytics = existingData ? JSON.parse(existingData) : { events: [] };
      
      // Add new event
      analytics.events.push({
        name: eventName,
        data,
        conversationId: context.conversationId,
        timestamp: new Date().toISOString()
      });
      
      // Limit to last 100 events
      if (analytics.events.length > 100) {
        analytics.events = analytics.events.slice(-100);
      }
      
      // Save back to storage
      localStorage.setItem(analyticsKey, JSON.stringify(analytics));
    } catch (error) {
      console.error('Failed to save analytics data:', error);
    }
  }
};
