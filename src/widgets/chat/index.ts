
// Export components directly rather than using dynamic imports
export { ChatWidget } from './ChatWidget';
export type { 
  ThemeConfig, 
  ChatWidgetSettings, 
  View,
  WidgetOptions
} from './types';

// Export service for external usage
export { widgetService } from '@/api/services/WidgetService';
export type { Widget, WidgetTheme, CreateWidgetRequest } from '@/api/services/WidgetService';
