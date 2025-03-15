"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { CheckIcon, PlusIcon, XIcon, EditIcon } from "lucide-react";

interface TodoProps {
  initialItems?: Array<{ text: string; completed: boolean }>;
  onChange?: (items: Array<{ text: string; completed: boolean }>) => void;
  className?: string;
  readOnly?: boolean;
}

export default function Todo({
  initialItems = [],
  onChange,
  className = "",
  readOnly = false,
}: TodoProps) {
  // Convert string[] to { text: string, completed: boolean }[] if needed
  const normalizedInitialItems = initialItems.length > 0 && typeof initialItems[0] === 'string'
    ? (initialItems as unknown as string[]).map(text => ({ text, completed: false }))
    : initialItems;

  const [items, setItems] = useState<Array<{ text: string; completed: boolean }>>(normalizedInitialItems);
  const [newItem, setNewItem] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const newItemInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Focus on edit input when editing starts
  useEffect(() => {
    if (editingIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingIndex]);

  const handleAddItem = useCallback(() => {
    if (newItem.trim()) {
      const updatedItems = [...items, { text: newItem.trim(), completed: false }];
      setItems(updatedItems);
      setNewItem("");
      onChange?.(updatedItems);
      
      // Focus back on the input after adding
      setTimeout(() => {
        newItemInputRef.current?.focus();
      }, 0);
    }
  }, [items, newItem, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddItem();
      }
    },
    [handleAddItem]
  );

  const handleUpdateItem = useCallback(
    (index: number, text: string) => {
      const updatedItems = [...items];
      updatedItems[index] = { ...updatedItems[index], text };
      setItems(updatedItems);
      onChange?.(updatedItems);
      setEditingIndex(null);
    },
    [items, onChange]
  );

  const handleRemoveItem = useCallback(
    (index: number) => {
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
      onChange?.(updatedItems);
    },
    [items, onChange]
  );

  const handleToggleItem = useCallback(
    (index: number) => {
      const updatedItems = [...items];
      updatedItems[index] = { 
        ...updatedItems[index], 
        completed: !updatedItems[index].completed 
      };
      setItems(updatedItems);
      onChange?.(updatedItems);
    },
    [items, onChange]
  );

  const startEditing = useCallback((index: number) => {
    setEditingIndex(index);
  }, []);

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const target = e.target as HTMLInputElement;
        handleUpdateItem(index, target.value);
      } else if (e.key === "Escape") {
        setEditingIndex(null);
      }
    },
    [handleUpdateItem]
  );

  // Handle drag and drop
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const itemsCopy = [...items];
      const draggedItemContent = itemsCopy[dragItem.current];
      itemsCopy.splice(dragItem.current, 1);
      itemsCopy.splice(dragOverItem.current, 0, draggedItemContent);
      
      setItems(itemsCopy);
      onChange?.(itemsCopy);
      
      // Reset refs
      dragItem.current = null;
      dragOverItem.current = null;
    }
  };

  if (readOnly) {
    return (
      <div className={`space-y-2 ${className}`}>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-5 h-5 rounded-sm border border-gray-300 flex items-center justify-center mr-3 flex-shrink-0 ${item.completed ? 'bg-indigo-500 border-indigo-500' : ''}`}>
              {item.completed && <CheckIcon className="h-3 w-3 text-white" />}
            </div>
            <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <div 
          key={index} 
          className="flex items-center group"
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
        >
          <button
            className={`w-5 h-5 rounded-sm border border-gray-300 flex items-center justify-center mr-3 flex-shrink-0 hover:bg-gray-50 transition-colors ${
              item.completed ? 'bg-indigo-500 border-indigo-500' : ''
            }`}
            onClick={() => handleToggleItem(index)}
            aria-label={item.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {item.completed && <CheckIcon className="h-3 w-3 text-white" />}
          </button>
          
          {editingIndex === index ? (
            <input
              ref={editInputRef}
              type="text"
              defaultValue={item.text}
              onBlur={(e) => handleUpdateItem(index, e.target.value)}
              onKeyDown={(e) => handleEditKeyDown(e, index)}
              className="flex-1 text-sm text-gray-700 bg-transparent border-b border-gray-300 focus:border-indigo-500 focus:outline-none py-0.5"
              autoFocus
            />
          ) : (
            <span 
              className={`flex-1 text-sm py-0.5 ${
                item.completed ? 'line-through text-gray-400' : 'text-gray-700'
              }`}
            >
              {item.text}
            </span>
          )}
          
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            {editingIndex !== index && (
              <button
                className="ml-2 text-gray-400 hover:text-gray-600"
                onClick={() => startEditing(index)}
                aria-label="Edit todo item"
              >
                <EditIcon className="h-4 w-4" />
              </button>
            )}
            <button
              className="ml-2 text-gray-400 hover:text-red-500"
              onClick={() => handleRemoveItem(index)}
              aria-label="Remove todo item"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      
      <div className="flex items-center mt-3 pt-1">
        <button
          className="w-5 h-5 rounded-sm border border-gray-300 flex items-center justify-center mr-3 flex-shrink-0 hover:bg-gray-50 transition-colors"
          onClick={handleAddItem}
          aria-label="Add new todo item"
        >
          <PlusIcon className="h-3 w-3 text-gray-500" />
        </button>
        <input
          ref={newItemInputRef}
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add new item..."
          className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none py-0.5 border-b border-transparent focus:border-gray-300"
        />
      </div>
    </div>
  );
}
