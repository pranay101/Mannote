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

## LinkCard

The LinkCard component is a Milanote-style link preview card that fetches and displays metadata for URLs.

### Features

- **Link Preview**: Automatically fetches and displays metadata for URLs
- **Rich Preview**: Shows title, description, favicon, and preview image when available
- **Interactive Controls**:
  - Open link in new tab
  - Copy link to clipboard
  - Edit link URL
- **Error Handling**: Graceful error states with retry options
- **Loading States**: Smooth loading animations
- **Editing Mode**: Easy URL input with validation
- **Responsive Design**: Adapts to different screen sizes
- **Visual Feedback**: Hover effects and animations

### Usage

```tsx
<LinkCard
  content={content}
  details={details}
  id={id}
  editableDetails={editableDetails}
  setEditableDetails={setEditableDetails}
  onUpdate={onUpdate}
/>
```

### Props

- `content`: Title of the link
- `details`: Array containing the URL as the first element
- `id`: Unique identifier for the card
- `editableDetails`: Array containing the editable URL
- `setEditableDetails`: Function to update the editable details
- `onUpdate`: Function to update the card data in the parent component

### Implementation Details

The LinkCard component fetches metadata from a server endpoint and displays it in a visually appealing way. It handles various states:

1. **Editing Mode**: When no URL is provided or when editing is triggered
2. **Loading State**: While fetching metadata
3. **Error State**: When metadata fetching fails
4. **Preview State**: When metadata is successfully fetched

The component uses the `/api/link-metadata` endpoint to fetch metadata for URLs.

### Styling

The component uses Tailwind CSS exclusively for styling, with transitions and animations handled through Tailwind's utility classes.
