import { memo, useState, useRef, useEffect, useCallback } from "react";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";
import "./TodoCard.css";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoCardProps {
  editableDetails: string[];
  newItem: string;
  setNewItem: React.Dispatch<React.SetStateAction<string>>;
  handleDetailUpdate: (index: number, value: string) => void;
  handleRemoveDetail: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

function TodoCard({
  editableDetails,
  newItem,
  setNewItem,
  handleDetailUpdate,
  handleRemoveDetail,
  handleKeyDown,
}: TodoCardProps) {
  // Add a ref to track if we're currently updating from parent
  const isUpdatingFromParent = useRef(false);
  // Add a ref to track the previous editableDetails for comparison
  const prevEditableDetailsRef = useRef<string[]>([]);
  // Add a ref to track the previous todoItems for comparison
  const prevTodoItemsRef = useRef<TodoItem[]>([]);

  // Convert string array to TodoItem array
  const [todoItems, setTodoItems] = useState<TodoItem[]>(() =>
    editableDetails.map((detail, index) => {
      // Check if the detail has a completed marker (e.g., "[x] Task")
      const isCompleted = detail.startsWith("[x]") || detail.startsWith("✓");
      const text = isCompleted
        ? detail.replace(/^\[x\]\s*|^✓\s*/, "").trim()
        : detail;

      return {
        id: `todo-${index}-${Date.now()}`,
        text,
        completed: isCompleted,
      };
    })
  );

  // Sync todoItems with editableDetails
  useEffect(() => {
    // Skip if we're currently updating from todoItems to editableDetails
    if (isUpdatingFromParent.current) {
      isUpdatingFromParent.current = false;
      return;
    }

    // Check if editableDetails has actually changed
    const hasChanged =
      editableDetails.length !== prevEditableDetailsRef.current.length ||
      editableDetails.some(
        (detail, i) =>
          i >= prevEditableDetailsRef.current.length ||
          detail !== prevEditableDetailsRef.current[i]
      );

    if (hasChanged) {
      // Update the ref with current editableDetails
      prevEditableDetailsRef.current = [...editableDetails];

      setTodoItems(
        editableDetails.map((detail, index) => {
          const isCompleted =
            detail.startsWith("[x]") || detail.startsWith("✓");
          const text = isCompleted
            ? detail.replace(/^\[x\]\s*|^✓\s*/, "").trim()
            : detail;

          return {
            id: `todo-${index}-${Date.now()}`,
            text,
            completed: isCompleted,
          };
        })
      );
    }
  }, [editableDetails]);

  // Sync editableDetails with todoItems
  useEffect(() => {
    // Skip the first render
    if (prevTodoItemsRef.current.length === 0 && todoItems.length > 0) {
      prevTodoItemsRef.current = [...todoItems];
      return;
    }

    // Check if todoItems has actually changed
    const hasChanged =
      todoItems.length !== prevTodoItemsRef.current.length ||
      todoItems.some((item, i) => {
        if (i >= prevTodoItemsRef.current.length) return true;
        const prevItem = prevTodoItemsRef.current[i];
        return (
          item.text !== prevItem.text || item.completed !== prevItem.completed
        );
      });

    if (!hasChanged) {
      return;
    }

    // Update the ref with current todoItems
    prevTodoItemsRef.current = [...todoItems];

    // Convert todoItems to string format
    const newDetails = todoItems.map((item) =>
      item.completed ? `[x] ${item.text}` : item.text
    );

    // Check if the arrays are different before updating
    const isDifferent =
      newDetails.length !== editableDetails.length ||
      newDetails.some((detail, index) => detail !== editableDetails[index]);

    if (isDifferent) {
      // Set flag to prevent the other useEffect from running
      isUpdatingFromParent.current = true;

      // Batch all updates to avoid multiple re-renders
      const batchedUpdates = () => {
        // First handle additions and updates
        newDetails.forEach((detail, index) => {
          if (index < editableDetails.length) {
            if (detail !== editableDetails[index]) {
              handleDetailUpdate(index, detail);
            }
          } else {
            // This is a new item that needs to be added
            // We'll add it at the end
            handleDetailUpdate(editableDetails.length, detail);
          }
        });

        // Then handle removals (if any)
        // We need to remove from the end to avoid index shifting issues
        for (let i = editableDetails.length - 1; i >= newDetails.length; i--) {
          handleRemoveDetail(i);
        }
      };

      // Execute all updates
      batchedUpdates();

      // Update the ref with the new details
      prevEditableDetailsRef.current = [...newDetails];
    }
  }, [todoItems, handleDetailUpdate, handleRemoveDetail, editableDetails]);

  // Handle adding a new todo item
  const handleAddItem = useCallback(() => {
    if (newItem.trim()) {
      // Add directly to editableDetails to avoid sync issues
      const newItemText = newItem.trim();
      handleDetailUpdate(editableDetails.length, newItemText);

      // Also update our local state to avoid waiting for the sync
      setTodoItems((prev) => [
        ...prev,
        {
          id: `todo-${prev.length}-${Date.now()}`,
          text: newItemText,
          completed: false,
        },
      ]);

      // Clear the input
      setNewItem("");
    }
  }, [newItem, setNewItem, editableDetails.length, handleDetailUpdate]);

  // Handle toggling a todo item's completed state
  const handleToggleItem = useCallback(
    (index: number) => {
      // Update our local state
      setTodoItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, completed: !item.completed } : item
        )
      );

      // Update parent state - we need to toggle the completed state in editableDetails
      const currentItem = editableDetails[index];
      const isCurrentlyCompleted =
        currentItem.startsWith("[x]") || currentItem.startsWith("✓");

      if (isCurrentlyCompleted) {
        // Remove the completion marker
        const newText = currentItem.replace(/^\[x\]\s*|^✓\s*/, "").trim();
        handleDetailUpdate(index, newText);
      } else {
        // Add the completion marker
        handleDetailUpdate(index, `[x] ${currentItem}`);
      }
    },
    [editableDetails, handleDetailUpdate]
  );

  // Handle updating a todo item's text
  const handleUpdateItemText = useCallback(
    (index: number, text: string) => {
      // Update our local state
      setTodoItems((prev) =>
        prev.map((item, i) => (i === index ? { ...item, text } : item))
      );

      // Update parent state - we need to preserve the completion state
      const currentItem = editableDetails[index];
      const isCompleted =
        currentItem.startsWith("[x]") || currentItem.startsWith("✓");

      // Update with the new text while preserving completion state
      if (isCompleted) {
        handleDetailUpdate(index, `[x] ${text}`);
      } else {
        handleDetailUpdate(index, text);
      }
    },
    [editableDetails, handleDetailUpdate]
  );

  // Handle removing a todo item
  const handleRemoveItem = useCallback(
    (index: number) => {
      // Update our local state
      setTodoItems((prev) => {
        const newItems = prev.filter((_, i) => i !== index);

        // Update the ref to prevent unnecessary sync
        prevTodoItemsRef.current = newItems;

        return newItems;
      });

      // Update parent state
      handleRemoveDetail(index);
    },
    [handleRemoveDetail]
  );

  // Handle keyboard navigation and actions
  const handleItemKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        // Insert a new empty item after this one directly in editableDetails
        const newItemId = `todo-${todoItems.length}-${Date.now()}`;

        // Update our local state
        setTodoItems((prev) => {
          const newItems = [
            ...prev.slice(0, index + 1),
            {
              id: newItemId,
              text: "",
              completed: false,
            },
            ...prev.slice(index + 1),
          ];

          // Update the ref to prevent unnecessary sync
          prevTodoItemsRef.current = newItems;

          return newItems;
        });

        // Update parent state - we need to handle this carefully to maintain indices
        // First, update all items after the current index to shift them down
        for (let i = editableDetails.length - 1; i > index; i--) {
          handleDetailUpdate(i + 1, editableDetails[i]);
        }

        // Then insert the new empty item
        handleDetailUpdate(index + 1, "");

        // Focus the new item after render
        setTimeout(() => {
          const elements = document.querySelectorAll("[data-todo-edit]");
          if (elements[index + 1]) {
            (elements[index + 1] as HTMLElement).focus();
          }
        }, 0);
      } else if (
        e.key === "Backspace" &&
        (e.currentTarget as HTMLElement).textContent === ""
      ) {
        e.preventDefault();

        // Remove the item from our local state
        setTodoItems((prev) => {
          const newItems = prev.filter((_, i) => i !== index);

          // Update the ref to prevent unnecessary sync
          prevTodoItemsRef.current = newItems;

          return newItems;
        });

        // Remove from parent state
        handleRemoveDetail(index);

        // Focus the previous item if it exists
        setTimeout(() => {
          const elements = document.querySelectorAll("[data-todo-edit]");
          if (elements[index - 1]) {
            (elements[index - 1] as HTMLElement).focus();
          }
        }, 0);
      } else if (
        e.key === "Tab" &&
        !e.shiftKey &&
        index === todoItems.length - 1
      ) {
        // If tabbing from the last item, add a new item
        if ((e.currentTarget as HTMLElement).textContent !== "") {
          e.preventDefault();
          handleAddItem();

          // Focus the new item after render
          setTimeout(() => {
            const input = newItemInputRef.current;
            if (input) {
              input.focus();
            }
          }, 0);
        }
      } else if (e.key === "Space" && e.ctrlKey) {
        e.preventDefault();
        handleToggleItem(index);
      }
    },
    [
      handleAddItem,
      handleRemoveDetail,
      handleDetailUpdate,
      handleToggleItem,
      todoItems.length,
      editableDetails,
    ]
  );

  // Custom input ref for the new item input
  const newItemInputRef = useRef<HTMLInputElement>(null);

  // Enhanced keydown handler for the new item input
  const handleNewItemKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddItem();
      } else {
        // Pass to the parent handler for other keys
        handleKeyDown(e);
      }
    },
    [handleAddItem, handleKeyDown]
  );

  return (
    <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1 todo-card">
      <h3 className="font-medium text-sm text-gray-700 mb-2">Tasks</h3>

      {todoItems.length === 0 ? (
        <div className="text-xs text-gray-400 italic py-2">
          No tasks yet. Add one below.
        </div>
      ) : (
        <div className="space-y-1.5">
          {todoItems.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-start group rounded-sm hover:bg-gray-50 -mx-1 px-1 py-0.5 transition-colors ${
                item.completed ? "bg-gray-50/50" : ""
              }`}
            >
              <button
                className={`w-4 h-4 mt-0.5 rounded-sm border flex items-center justify-center mr-2 flex-shrink-0 transition-colors ${
                  item.completed
                    ? "bg-indigo-500 border-indigo-500 text-white"
                    : "border-gray-300 hover:border-indigo-400"
                }`}
                onClick={() => handleToggleItem(index)}
                aria-label={
                  item.completed ? "Mark as incomplete" : "Mark as complete"
                }
                title={
                  item.completed ? "Mark as incomplete" : "Mark as complete"
                }
              >
                {item.completed && <CheckIcon className="h-2.5 w-2.5" />}
              </button>

              <div
                contentEditable
                suppressContentEditableWarning
                data-todo-edit
                onBlur={(e) =>
                  handleUpdateItemText(index, e.currentTarget.textContent || "")
                }
                onKeyDown={(e) => handleItemKeyDown(e, index)}
                className={`flex-1 text-xs focus:outline-none py-0.5 transition-colors ${
                  item.completed
                    ? "text-gray-400 line-through"
                    : "text-gray-700"
                }`}
                style={{ wordBreak: "break-word" }}
              >
                {item.text}
              </div>

              <button
                className="ml-2 text-gray-400 hover:text-red-500 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveItem(index)}
                aria-label="Remove item"
                title="Remove item"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center mt-3 pt-1 border-t border-gray-100">
        <button
          className="w-4 h-4 rounded-sm border border-gray-300 flex items-center justify-center mr-2 flex-shrink-0 hover:border-indigo-400 transition-colors"
          onClick={handleAddItem}
          aria-label="Add new item"
          title="Add new item"
        >
          <PlusIcon className="h-2.5 w-2.5 text-gray-500" />
        </button>
        <input
          ref={newItemInputRef}
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleNewItemKeyDown}
          placeholder="Add new task..."
          className="flex-1 text-xs text-gray-700 bg-transparent focus:outline-none py-0.5 placeholder-gray-400"
          aria-label="New task input"
        />
      </div>

      {todoItems.length > 0 && (
        <div className="text-xs text-gray-400 mt-2 text-right">
          <span className="font-medium">
            {todoItems.filter((item) => item.completed).length}
          </span>
          <span> of </span>
          <span className="font-medium">{todoItems.length}</span>
          <span> completed</span>
        </div>
      )}
    </div>
  );
}

export default memo(TodoCard);
