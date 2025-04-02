
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { widgetService, Widget, CreateWidgetRequest, WidgetTheme } from '@/api/services/WidgetService';

interface UseWidgetsReturn {
  widgets: Widget[];
  selectedWidget: Widget | null;
  loading: boolean;
  error: string | null;
  getWidgets: () => Promise<void>;
  getWidgetById: (id: string) => Promise<void>;
  createWidget: (data: CreateWidgetRequest) => Promise<Widget | null>;
  updateWidget: (id: string, data: Partial<CreateWidgetRequest>) => Promise<Widget | null>;
  deleteWidget: (id: string) => Promise<boolean>;
  setSelectedWidget: (widget: Widget | null) => void;
}

export const useWidgets = (): UseWidgetsReturn => {
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWidgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await widgetService.getWidgets();
      setWidgets(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch widgets';
      setError(errorMessage);
      toast({
        title: 'Error fetching widgets',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getWidgetById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const widget = await widgetService.getWidgetById(id);
      setSelectedWidget(widget);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch widget ${id}`;
      setError(errorMessage);
      toast({
        title: 'Error fetching widget',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createWidget = useCallback(async (data: CreateWidgetRequest): Promise<Widget | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await widgetService.createWidget(data);
      
      // Update widgets list with the new widget
      setWidgets(prev => [...prev, {
        ...response.widget,
        widgettheme: [response.widgetTheme]
      }]);
      
      toast({
        title: 'Widget created',
        description: 'The widget has been created successfully.',
      });
      
      return {
        ...response.widget,
        widgettheme: [response.widgetTheme]
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create widget';
      setError(errorMessage);
      toast({
        title: 'Error creating widget',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateWidget = useCallback(async (id: string, data: Partial<CreateWidgetRequest>): Promise<Widget | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await widgetService.updateWidget(id, data);
      
      // Update the widgets list
      setWidgets(prev => 
        prev.map(widget => 
          widget.id === id ? {
            ...response.widget,
            widgettheme: [response.widgetTheme]
          } : widget
        )
      );
      
      // Update selected widget if it's the one being edited
      if (selectedWidget && selectedWidget.id === id) {
        setSelectedWidget({
          ...response.widget,
          widgettheme: [response.widgetTheme]
        });
      }
      
      toast({
        title: 'Widget updated',
        description: 'The widget has been updated successfully.',
      });
      
      return {
        ...response.widget,
        widgettheme: [response.widgetTheme]
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to update widget ${id}`;
      setError(errorMessage);
      toast({
        title: 'Error updating widget',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast, selectedWidget]);

  const deleteWidget = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await widgetService.deleteWidget(id);
      
      // Remove the widget from the list
      setWidgets(prev => prev.filter(widget => widget.id !== id));
      
      // Clear selected widget if it's the one being deleted
      if (selectedWidget && selectedWidget.id === id) {
        setSelectedWidget(null);
      }
      
      toast({
        title: 'Widget deleted',
        description: 'The widget has been deleted successfully.',
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to delete widget ${id}`;
      setError(errorMessage);
      toast({
        title: 'Error deleting widget',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, selectedWidget]);

  // Load widgets on component mount
  useEffect(() => {
    getWidgets();
  }, [getWidgets]);

  return {
    widgets,
    selectedWidget,
    loading,
    error,
    getWidgets,
    getWidgetById,
    createWidget,
    updateWidget,
    deleteWidget,
    setSelectedWidget
  };
};

export default useWidgets;
