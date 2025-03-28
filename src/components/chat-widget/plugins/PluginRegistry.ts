
import { ChatPlugin } from './types';

/**
 * Plugin registry for the chat widget
 * Manages registration and access to plugins
 */
class PluginRegistry {
  private plugins: Map<string, ChatPlugin> = new Map();
  
  /**
   * Register a new plugin
   * @param plugin The plugin to register
   * @returns true if registration successful, false if plugin with same ID already exists
   */
  registerPlugin(plugin: ChatPlugin): boolean {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin with ID ${plugin.id} already exists. Skipping registration.`);
      return false;
    }
    
    this.plugins.set(plugin.id, plugin);
    console.log(`Plugin "${plugin.name}" (${plugin.id}) registered successfully.`);
    return true;
  }
  
  /**
   * Unregister a plugin by ID
   * @param pluginId The ID of the plugin to unregister
   * @returns true if unregistration successful, false if plugin not found
   */
  unregisterPlugin(pluginId: string): boolean {
    if (!this.plugins.has(pluginId)) {
      console.warn(`Plugin with ID ${pluginId} not found. Cannot unregister.`);
      return false;
    }
    
    this.plugins.delete(pluginId);
    console.log(`Plugin with ID ${pluginId} unregistered successfully.`);
    return true;
  }
  
  /**
   * Get all registered plugins
   * @returns Array of registered plugins
   */
  getAllPlugins(): ChatPlugin[] {
    return Array.from(this.plugins.values());
  }
  
  /**
   * Get plugins of a specific type
   * @param type Plugin type to filter by
   * @returns Array of plugins of the specified type
   */
  getPluginsByType<T extends ChatPlugin>(type: T['type']): T[] {
    return this.getAllPlugins()
      .filter(plugin => plugin.type === type) as T[];
  }
  
  /**
   * Get a plugin by ID
   * @param pluginId The ID of the plugin to retrieve
   * @returns The plugin if found, undefined otherwise
   */
  getPluginById(pluginId: string): ChatPlugin | undefined {
    return this.plugins.get(pluginId);
  }
}

// Export a singleton instance
export const pluginRegistry = new PluginRegistry();

// Export a hook for plugins to use
export const usePluginRegistry = () => {
  return pluginRegistry;
};
