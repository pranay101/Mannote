"use client";

import { useState, useRef, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  ImageIcon,
  LinkIcon,
  CheckIcon,
  PlusIcon,
  XIcon,
  TrashIcon,
} from "lucide-react";

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

export default function CustomNode({
  id,
  data,
  selected,
}: NodeProps<CustomNodeData>) {
  const [isActive, setIsActive] = useState(false);
  const [editableDetails, setEditableDetails] = useState<string[]>(
    data.details
  );
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [newItem, setNewItem] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
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
    editorProps: {
      attributes: {
        class:
          "prose prose-xs focus:outline-none min-h-[100px] max-w-none text-gray-600 text-xs",
      },
      handlePaste: (view, event) => {
        // Let our custom paste handler deal with images
        if (event.clipboardData && event.clipboardData.files.length > 0) {
          return true; // Return true to let our custom handler take over
        }
        return false; // Let TipTap handle other paste events
      },
    },
  });

  // Focus editor when card becomes active
  useEffect(() => {
    if (isActive && editor) {
      editor.commands.focus();
    }
  }, [isActive, editor]);

  // Handle detail item update
  const handleDetailUpdate = (index: number, value: string) => {
    const newDetails = [...editableDetails];
    newDetails[index] = value;
    setEditableDetails(newDetails);
    if (data.onUpdate) {
      data.onUpdate(id, { details: newDetails });
    }
  };

  // Handle paste for images
  const handlePaste = (e: React.ClipboardEvent) => {
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
  };

  // Handle adding a new detail item
  const handleAddDetail = () => {
    if (newItem.trim() !== "") {
      const newDetails = [...editableDetails, newItem];
      setEditableDetails(newDetails);
      setNewItem("");
      if (data.onUpdate) {
        data.onUpdate(id, { details: newDetails });
      }
    }
  };

  // Handle removing a detail item
  const handleRemoveDetail = (index: number) => {
    const newDetails = [...editableDetails];
    newDetails.splice(index, 1);
    setEditableDetails(newDetails);
    if (data.onUpdate) {
      data.onUpdate(id, { details: newDetails });
    }
  };

  // Handle keydown events for adding new items
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddDetail();
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
  };

  // Handle image upload
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  // Process uploaded image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  // Render different content based on card type
  const renderCardContent = () => {
    switch (data.type) {
      case "image":
        return (
          <div className="bg-white h-40 flex flex-col items-center justify-center">
            {data.details[0] ? (
              <img
                src={data.details[0]}
                alt={data.content}
                className="h-full w-full object-contain"
              />
            ) : (
              <div
                className="flex flex-col items-center w-full h-full"
                onPaste={handlePaste}
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={handleImageUpload}
                >
                  <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">
                    Click to upload or paste an image
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
        );
      case "link":
        return (
          <div className="bg-blue-50/50 p-3 flex flex-col">
            {data.details[0] ? (
              <a
                href={data.details[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline flex items-center text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <LinkIcon className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                <span>{data.content}</span>
              </a>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center">
                  <LinkIcon className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={data.content}
                    onChange={(e) => {
                      if (data.onUpdate) {
                        data.onUpdate(id, { content: e.target.value });
                      }
                    }}
                    className="flex-1 text-xs text-gray-600 bg-transparent focus:outline-none"
                  />
                </div>
                <input
                  type="url"
                  value={editableDetails[0] || ""}
                  onChange={(e) => {
                    const newDetails = [e.target.value];
                    setEditableDetails(newDetails);
                    if (data.onUpdate) {
                      data.onUpdate(id, { details: newDetails });
                    }
                  }}
                  placeholder="https://example.com"
                  className="w-full text-xs text-blue-600 bg-transparent focus:outline-none"
                />
              </div>
            )}
          </div>
        );
      case "todo":
        return (
          <div className="space-y-2">
            {editableDetails.map((detail, index) => (
              <div key={index} className="flex items-center group">
                <button
                  className="w-4 h-4 rounded-sm border border-gray-300 flex items-center justify-center mr-2 flex-shrink-0"
                  onClick={() => handleRemoveDetail(index)}
                >
                  <CheckIcon className="h-2 w-2 text-gray-500" />
                </button>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleDetailUpdate(index, e.currentTarget.textContent || "")
                  }
                  className="flex-1 text-xs text-gray-600 focus:outline-none"
                >
                  {detail}
                </div>
                <button
                  className="ml-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveDetail(index)}
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
            <div className="flex items-center mt-2">
              <button className="w-4 h-4 rounded-sm border border-gray-300 flex items-center justify-center mr-2 flex-shrink-0">
                <PlusIcon className="h-2 w-2 text-gray-500" />
              </button>
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add new item..."
                className="flex-1 text-xs text-gray-600 bg-transparent focus:outline-none"
              />
            </div>
          </div>
        );
      default: // note type
        return (
          <div
            ref={contentAreaRef}
            className="relative cursor-text"
            onPaste={handlePaste}
          >
            {/* TipTap Editor */}
            <EditorContent editor={editor} className="cursor-text" />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        );
    }
  };

  return (
    <div
      ref={nodeRef}
      className={`bg-white border border-gray-200 ${
        isActive
          ? "shadow-md ring-1 ring-indigo-200"
          : selected
          ? "shadow-md"
          : "shadow-sm"
      } ${data.type === "image" ? "w-64" : "w-72"} text-xs relative`}
      onClick={() => !isActive && setIsActive(true)}
      onBlur={(e) => {
        // Only deactivate if clicking outside the card
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsActive(false);
          setShowDeleteButton(false);
        }
      }}
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => !isActive && setShowDeleteButton(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Delete Button - Inside Card */}
      {showDeleteButton && (
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

      {/* Connection Handles - only visible on hover or when selected and not active */}
      {selected && !isActive && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            className="w-2 h-2 bg-indigo-500 opacity-0 hover:opacity-70 transition-opacity"
          />
          <Handle
            type="source"
            position={Position.Left}
            id="left"
            className="w-2 h-2 bg-indigo-500 opacity-0 hover:opacity-70 transition-opacity"
          />
          <Handle
            type="source"
            position={Position.Top}
            id="top"
            className="w-2 h-2 bg-indigo-500 opacity-0 hover:opacity-70 transition-opacity"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottom"
            className="w-2 h-2 bg-indigo-500 opacity-0 hover:opacity-70 transition-opacity"
          />
        </>
      )}

      {/* Card Content */}
      <div className="p-3 group">{renderCardContent()}</div>
    </div>
  );
}
