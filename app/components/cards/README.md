# Card Components

This directory contains various card components used in the application.

## TodoCard

The TodoCard component is a simple, efficient todo list card that provides essential task management features.

### Features

- **Task Completion**: Mark tasks as complete/incomplete with visual feedback
- **Keyboard Shortcuts**:
  - `Enter`: Add a new task below the current one
  - `Backspace` on empty task: Delete the task
  - `Ctrl+Space`: Toggle task completion
  - `Tab` from last task: Add a new task
- **Visual Feedback**:
  - Completed tasks are strikethrough and grayed out
  - Hover effects for better UX
  - Animations for task completion
- **Progress Tracking**: Shows completion status (X of Y completed)
- **Empty State Handling**: Displays a helpful message when no tasks exist
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Mobile Support**: Optimized for touch interfaces

### Usage

```tsx
<TodoCard
  editableDetails={editableDetails}
  newItem={newItem}
  setNewItem={setNewItem}
  handleDetailUpdate={handleDetailUpdate}
  handleRemoveDetail={handleRemoveDetail}
  handleKeyDown={handleKeyDown}
/>
```

### Props

- `editableDetails`: Array of task strings
- `newItem`: Current value of the new task input
- `setNewItem`: Function to update the new task input
- `handleDetailUpdate`: Function to update a task at a specific index
- `handleRemoveDetail`: Function to remove a task at a specific index
- `handleKeyDown`: Function to handle keyboard events

### Implementation Details

The TodoCard component maintains an internal state of todo items with the following structure:

```ts
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}
```

It syncs this internal state with the parent component's `editableDetails` array, converting between the formats as needed. Completed tasks are stored with a `[x]` prefix in the `editableDetails` array.

### Styling

The component uses Tailwind CSS for styling and includes custom animations defined in `TodoCard.css`.
