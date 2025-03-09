"use client";

import { useState, useRef, useEffect, useMemo, memo, useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { useEditor } from "@tiptap/react";
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
  width?: number;
  height?: number;
  onUpdate?: (
    id: string,
    updates: Partial<{
      content: string;
      details: string[];
      type: string;
      html?: string;
      width?: number;
      height?: number;
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
        data.onUpdate(id, {
          content: editor.getText(),
          html: editor.getHTML(),
        });
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

  // Focus editor when entering edit mode
  useEffect(() => {
    if (isEditing && editor) {
      setTimeout(() => {
        editor.commands.focus("end");
      }, 10);
    }
  }, [isEditing, editor]);

  // Handle card click - if already selected, enter edit mode
  const handleCardClick = useCallback(() => {
    if (selected && !isEditing) {
      setIsEditing(true);
    }
  }, [selected, isEditing, setIsEditing]);

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
            fileInputRef={fileInputRef}
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
      } text-xs relative overflow-visible`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      data-editing={isEditing ? "true" : "false"}
      style={{
        cursor: isEditing ? "text" : "pointer",
        width: data.width || (data.type === "image" ? "fit-content" : "288px"),
        height: data.height || "auto",
        minWidth: "200px",
        minHeight: "100px",
      }}
    >
      {/* Resize Controls - Only visible when selected and not editing */}
      {selected && !isEditing && (
        <>
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              const startX = e.clientX;
              const startY = e.clientY;
              const startWidth = data.width || 288;
              const startHeight = data.height || 100;

              const onMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = moveEvent.clientX - startX;
                const deltaY = moveEvent.clientY - startY;

                if (data.onUpdate) {
                  data.onUpdate(id, {
                    width: Math.max(200, startWidth + deltaX),
                    height: Math.max(100, startHeight + deltaY),
                  });
                }
              };

              const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
              };

              document.addEventListener("mousemove", onMouseMove);
              document.addEventListener("mouseup", onMouseUp);
            }}
          >
            <div className="w-0 h-0 border-b-8 border-r-8 border-gray-400 absolute bottom-0 right-0"></div>
          </div>
        </>
      )}

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

      {/* Card Content */}
      <div className="p-3 group w-full h-full overflow-auto">{cardContent}</div>

      {/* Connection Handles - Always visible but more subtle */}
      {/* Right Handle */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-50">
        <div className="relative group">
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-indigo-400 absolute opacity-30"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 relative"></div>
          </div>
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            className="w-6 h-6 rounded-full bg-indigo-400 opacity-30 hover:opacity-70 transition-opacity"
            style={{ right: -3, border: "1px solid white" }}
          />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-8 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Drag to connect
          </div>
        </div>
      </div>

      {/* Left Handle */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-50">
        <div className="relative group">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-400 absolute opacity-30"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 relative"></div>
          </div>
          <Handle
            type="target"
            position={Position.Left}
            id="left"
            className="w-6 h-6 rounded-full bg-blue-400 opacity-30 hover:opacity-70 transition-opacity"
            style={{ left: -3, border: "1px solid white" }}
          />
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Drop connection here
          </div>
        </div>
      </div>

      {/* Top Handle */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50">
        <div className="relative group">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-indigo-400 absolute opacity-30"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 relative"></div>
          </div>
          <Handle
            type="source"
            position={Position.Top}
            id="top"
            className="w-6 h-6 rounded-full bg-indigo-400 opacity-30 hover:opacity-70 transition-opacity"
            style={{ top: -3, border: "1px solid white" }}
          />
        </div>
      </div>

      {/* Bottom Handle */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-50 overflow-visible">
        <div className="relative group overflow-visible">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-400 absolute opacity-30"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 relative"></div>
          </div>
          <Handle
            type="target"
            position={Position.Bottom}
            id="bottom"
            className="w-6 h-6 rounded-full bg-blue-400 opacity-30 hover:opacity-70 transition-opacity"
            style={{ bottom: -3, border: "1px solid white" }}
          />
        </div>
      </div>
    </div>
  );
}

// Export a memoized version of the component
export default memo(CustomNode);
