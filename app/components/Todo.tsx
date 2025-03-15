"use client";

import { useState, useCallback } from "react";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";

interface TodoProps {
  initialItems?: string[];
  onChange?: (items: string[]) => void;
  className?: string;
}

export default function Todo({
  initialItems = [],
  onChange,
  className = "",
}: TodoProps) {
  const [items, setItems] = useState<string[]>(initialItems);
  const [newItem, setNewItem] = useState<string>("");

  const handleAddItem = useCallback(() => {
    if (newItem.trim()) {
      const updatedItems = [...items, newItem.trim()];
      setItems(updatedItems);
      setNewItem("");
      onChange?.(updatedItems);
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
    (index: number, value: string) => {
      const updatedItems = [...items];
      updatedItems[index] = value;
      setItems(updatedItems);
      onChange?.(updatedItems);
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
      // In a real app, you might want to mark items as completed
      // For now, we'll just remove them
      handleRemoveItem(index);
    },
    [handleRemoveItem]
  );

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center group">
          <button
            className="w-5 h-5 rounded-sm border border-gray-300 flex items-center justify-center mr-3 flex-shrink-0 hover:bg-gray-50 transition-colors"
            onClick={() => handleToggleItem(index)}
            aria-label="Complete todo item"
          >
            <CheckIcon className="h-3 w-3 text-gray-500" />
          </button>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              handleUpdateItem(index, e.currentTarget.textContent || "")
            }
            className="flex-1 text-sm text-gray-700 focus:outline-none py-0.5"
          >
            {item}
          </div>
          <button
            className="ml-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleRemoveItem(index)}
            aria-label="Remove todo item"
          >
            <XIcon className="h-4 w-4" />
          </button>
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
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add new item..."
          className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none py-0.5"
        />
      </div>
    </div>
  );
}
