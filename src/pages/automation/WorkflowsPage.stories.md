
# Workflows Page

The Workflows page allows users to manage automation workflows with the following features:

## Features
- **Workflow Organization:**
  - Tag-based categorization with color coding
  - Folder organization for grouping related workflows
  - Intuitive filtering by folder, tags, status, and type

- **Analytics & Insights:**
  - Overview of workflow performance metrics
  - Success/failure rates visualization
  - Run counts and timing analytics

- **User Experience:**
  - Keyboard shortcuts for common actions
  - Clone/duplicate workflows with customized naming
  - Multi-select mode for bulk operations
  - Clear filter indicators

## Component Structure

- **WorkflowsPage**: Main container component
- **WorkflowFolderSelector**: Drop-down folder navigation and management
- **WorkflowTagsControl**: Tag filtering and management
- **WorkflowTableCard**: Individual workflow item display

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+N   | New workflow |
| Ctrl+F   | Focus search |
| Shift+E  | Expand workflow |
| Shift+T  | Toggle status |
| Shift+D  | Duplicate workflow |

## Future Enhancements

- Advanced filtering by custom attributes
- Scheduled workflow calendar view
- Workflow dependency visualization
- Performance optimization for large workflow sets
