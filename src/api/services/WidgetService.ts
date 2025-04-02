
import { BaseService } from './BaseService';
import api from '@/services/api';

export interface WidgetTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    primaryForeground: string;
    background: string;
    foreground: string;
    border: string;
    userMessage: string;
    userMessageText: string;
    agentMessage: string;
    agentMessageText: string;
    inputBackground: string;
  };
  labels: {
    welcomeTitle: string;
    welcomeSubtitle: string;
  };
  persona: string;
  position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  isCompact: boolean;
}

export interface Widget {
  id: string;
  name: string;
  clientId: string;
  workspaceId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  widgettheme: WidgetTheme[];
}

export interface CreateWidgetRequest {
  name: string;
  themeName: string;
  colors: WidgetTheme['colors'];
  position: WidgetTheme['position'];
  labels: WidgetTheme['labels'];
  persona: string;
  isCompact: boolean;
}

export interface CreateWidgetResponse {
  widget: Widget;
  widgetTheme: WidgetTheme;
}

/**
 * Service for interacting with the Widget API
 */
export class WidgetService extends BaseService<any, any> {
  protected endpoint = '/widgets';

  /**
   * Get all widgets for a workspace
   */
  async getWidgets(): Promise<Widget[]> {
    try {
      const response = await this.request<{ data: Widget[] }>('get', this.endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching widgets:', error);
      throw error;
    }
  }

  /**
   * Get a specific widget by ID
   */
  async getWidgetById(widgetId: string): Promise<Widget> {
    try {
      const response = await this.request<{ data: Widget }>('get', `${this.endpoint}/${widgetId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching widget ${widgetId}:`, error);
      throw error;
    }
  }

  /**
   * Get widget configuration by ID
   */
  async getWidgetConfig(widgetId: string): Promise<Widget> {
    try {
      const response = await this.request<{ data: Widget }>('get', `${this.endpoint}/getWidgetConfig/${widgetId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching widget config ${widgetId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new widget
   */
  async createWidget(widgetData: CreateWidgetRequest): Promise<CreateWidgetResponse> {
    try {
      const response = await this.request<{ data: CreateWidgetResponse }>('post', this.endpoint, widgetData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating widget:', error);
      throw error;
    }
  }

  /**
   * Update an existing widget
   */
  async updateWidget(widgetId: string, widgetData: Partial<CreateWidgetRequest>): Promise<CreateWidgetResponse> {
    try {
      const response = await this.request<{ data: CreateWidgetResponse }>('patch', `${this.endpoint}/${widgetId}`, widgetData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating widget ${widgetId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a widget
   */
  async deleteWidget(widgetId: string): Promise<boolean> {
    try {
      const response = await this.request<{ data: boolean }>('delete', `${this.endpoint}/${widgetId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting widget ${widgetId}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const widgetService = new WidgetService();
