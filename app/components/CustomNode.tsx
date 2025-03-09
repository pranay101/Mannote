"use client";

import { useState, useRef, useEffect, useMemo, memo, useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TrashIcon } from "lucide-react";

// Import card components
import ImageCard from "./cards/ImageCard";
import LinkCard from "./cards/LinkCard";
import TodoCard from "./cards/TodoCard";
import NoteCard from "./cards/NoteCard";

interface CustomNodeData {
  type: string;
  content: string;
  details: string[];
  html?: string;
  onUpdate?: (
    id: string,
    updates: Partial<{
      content: string;
      details: string[];
      type: string;
      html?: string;
    }>
  ) => void;
  onDelete?: (id: string) => void;
}

function CustomNode({ id, data, selected }: NodeProps<CustomNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableDetails, setEditableDetails] = useState<string[]>(
    data.details
  );
  const [newItem, setNewItem] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content:
      data.html ||
      (data.content
        ? `<p>${data.content}</p>`
        : "<p>Click to add content...</p>"),
    onUpdate: ({ editor }) => {
      if (data.onUpdate) {
        data.onUpdate(id, { html: editor.getHTML() });
      }
    },
    editable: false, // Start as non-editable
  });

  // Update editor editable state when isEditing changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [isEditing, editor]);

  // Handle card click - if already selected, enter edit mode
  const handleCardClick = useCallback(() => {
    if (selected && !isEditing) {
      setIsEditing(true);
    }
  }, [selected, isEditing, setIsEditing]);

  // Focus editor when entering edit mode
  useEffect(() => {
    if (isEditing && editor) {
      setTimeout(() => {
        editor.commands.focus("end");
      }, 10);
    }
  }, [isEditing, editor]);

  // Exit edit mode when card is no longer selected
  useEffect(() => {
    if (!selected && isEditing) {
      setIsEditing(false);
    }
  }, [selected, isEditing]);

  // Handle click outside to exit edit mode
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) {
        setIsEditing(false);
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  // Handle detail item update
  const handleDetailUpdate = useCallback(
    (index: number, value: string) => {
      const newDetails = [...editableDetails];
      newDetails[index] = value;
      setEditableDetails(newDetails);
      if (data.onUpdate) {
        data.onUpdate(id, { details: newDetails });
      }
    },
    [editableDetails, setEditableDetails, data.onUpdate, id]
  );

  // Handle paste for images
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            if (data.type === "image") {
              e.preventDefault();
              const reader = new FileReader();
              reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                const newDetails = [imageUrl];
                setEditableDetails(newDetails);
                if (data.onUpdate) {
                  data.onUpdate(id, { details: newDetails });
                }
              };
              reader.readAsDataURL(blob);
              return;
            } else if (data.type === "note" && editor) {
              // For note cards, insert the image into the TipTap editor
              e.preventDefault();
              const reader = new FileReader();
              reader.onload = (event) => {
                const imageUrl = event.target?.result as string;
                editor.chain().focus().setImage({ src: imageUrl }).run();
              };
              reader.readAsDataURL(blob);
              return;
            }
          }
        }
      }
    },
    [data.type, editor, id, data.onUpdate, setEditableDetails]
  );

  // Handle adding a new detail item
  const handleAddDetail = useCallback(() => {
    if (newItem.trim() !== "") {
      const newDetails = [...editableDetails, newItem];
      setEditableDetails(newDetails);
      setNewItem("");
      if (data.onUpdate) {
        data.onUpdate(id, { details: newDetails });
      }
    }
  }, [
    newItem,
    editableDetails,
    setEditableDetails,
    setNewItem,
    data.onUpdate,
    id,
  ]);

  // Handle removing a detail item
  const handleRemoveDetail = useCallback(
    (index: number) => {
      const newDetails = [...editableDetails];
      newDetails.splice(index, 1);
      setEditableDetails(newDetails);
      if (data.onUpdate) {
        data.onUpdate(id, { details: newDetails });
      }
    },
    [editableDetails, setEditableDetails, data.onUpdate, id]
  );

  // Handle keydown events for adding new items
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        if (newItem.trim() !== "") {
          const newDetails = [...editableDetails, newItem];
          setEditableDetails(newDetails);
          setNewItem("");
          if (data.onUpdate) {
            data.onUpdate(id, { details: newDetails });
          }
        }
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        // Only delete the node if Ctrl/Cmd is pressed with Delete/Backspace
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          e.stopPropagation();
          if (data.onDelete) {
            data.onDelete(id);
          }
        }
      }
    },
    [
      newItem,
      editableDetails,
      setEditableDetails,
      setNewItem,
      data.onUpdate,
      data.onDelete,
      id,
    ]
  );

  // Handle image upload
  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  // Process uploaded image
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          if (data.type === "image") {
            const newDetails = [imageUrl];
            setEditableDetails(newDetails);
            if (data.onUpdate) {
              data.onUpdate(id, { details: newDetails });
            }
          } else if (editor) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [data.type, editor, id, data.onUpdate, setEditableDetails]
  );

  // Memoize the renderCardContent function
  const cardContent = useMemo(() => {
    switch (data.type) {
      case "image":
        return (
          <ImageCard
            content={data.content}
            details={data.details}
            id={id}
            onUpdate={data.onUpdate}
            handlePaste={handlePaste}
            handleImageUpload={handleImageUpload}
            handleFileChange={handleFileChange}
          />
        );
      case "link":
        return (
          <LinkCard
            content={data.content}
            details={data.details}
            id={id}
            editableDetails={editableDetails}
            setEditableDetails={setEditableDetails}
            onUpdate={data.onUpdate}
          />
        );
      case "todo":
        return (
          <TodoCard
            editableDetails={editableDetails}
            newItem={newItem}
            setNewItem={setNewItem}
            handleDetailUpdate={handleDetailUpdate}
            handleRemoveDetail={handleRemoveDetail}
            handleKeyDown={handleKeyDown}
          />
        );
      default: // note type
        return (
          <NoteCard
            editor={editor}
            isEditing={isEditing}
            selected={selected}
            setIsEditing={setIsEditing}
            handlePaste={handlePaste}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
          />
        );
    }
  }, [
    data.type,
    data.content,
    data.details,
    id,
    data.onUpdate,
    handlePaste,
    handleImageUpload,
    handleFileChange,
    editableDetails,
    setEditableDetails,
    newItem,
    setNewItem,
    handleDetailUpdate,
    handleRemoveDetail,
    handleKeyDown,
    editor,
    isEditing,
    selected,
    setIsEditing,
    fileInputRef,
  ]);

  return (
    <div
      ref={nodeRef}
      className={`bg-white ${
        isEditing
          ? "shadow-md ring-1 ring-indigo-200"
          : selected
          ? "shadow-md"
          : "shadow-sm"
      } ${data.type === "image" ? "w-64" : "w-72"} text-xs relative`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      data-editing={isEditing ? "true" : "false"}
      style={{
        cursor: isEditing ? "text" : "pointer",
      }}
    >
      {/* Delete Button - Only visible when selected but not editing */}
      {selected && !isEditing && (
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1 border border-transparent hover:border-red-500 rounded"
          onClick={(e) => {
            e.stopPropagation();
            if (data.onDelete) {
              data.onDelete(id);
            }
          }}
          title="Delete card (Ctrl+Delete)"
        >
          <TrashIcon className="h-3 w-3" />
        </button>
      )}

      {/* Source Handles - always render but only show when selected and not editing */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className={`w-2 h-2 bg-indigo-500 ${
          selected && !isEditing ? "opacity-0 hover:opacity-70" : "opacity-0"
        } transition-opacity`}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className={`w-2 h-2 bg-indigo-500 ${
          selected && !isEditing ? "opacity-0 hover:opacity-70" : "opacity-0"
        } transition-opacity`}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className={`w-2 h-2 bg-indigo-500 ${
          selected && !isEditing ? "opacity-0 hover:opacity-70" : "opacity-0"
        } transition-opacity`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className={`w-2 h-2 bg-indigo-500 ${
          selected && !isEditing ? "opacity-0 hover:opacity-70" : "opacity-0"
        } transition-opacity`}
      />

      {/* Target Handles - always render but only show when selected and not editing */}
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className={`w-2 h-2 bg-blue-500 ${
          selected && !isEditing ? "opacity-0 hover:opacity-70" : "opacity-0"
        } transition-opacity`}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className={`w-2 h-2 bg-blue-500 ${
          selected && !isEditing ? "opacity-0 hover:opacity-70" : "opacity-0"
        } transition-opacity`}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className={`w-2 h-2 bg-blue-500 ${
          selected && !isEditing ? "opacity-0 hover:opacity-70" : "opacity-0"
        } transition-opacity`}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        className={`w-2 h-2 bg-blue-500 ${
          selected && !isEditing ? "opacity-0 hover:opacity-70" : "opacity-0"
        } transition-opacity`}
      />

      {/* Card Content */}
      <div className="p-3 group">{cardContent}</div>
    </div>
  );
}

// Export a memoized version of the component
export default memo(CustomNode);
