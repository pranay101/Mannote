"use client";

import { useState, useRef, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  MoreHorizontalIcon,
  ImageIcon,
  LinkIcon,
  CheckIcon,
  PlusIcon,
  XIcon,
  TrashIcon,
  BoldIcon,
  ItalicIcon,
  ListIcon,
  Heading1Icon,
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
  const [editingTitle, setEditingTitle] = useState(false);
  const [editableContent, setEditableContent] = useState(data.content);
  const [editableDetails, setEditableDetails] = useState<string[]>(
    data.details
  );
  const [showMenu, setShowMenu] = useState(false);
  const [newItem, setNewItem] = useState("");
  const contentRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: data.html || "<p>Click to add content...</p>",
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
    },
  });

  // Focus on content input when editing starts
  useEffect(() => {
    if (editingTitle && contentRef.current) {
      contentRef.current.focus();
    }
  }, [editingTitle]);

  // Handle content update
  const handleContentUpdate = () => {
    if (data.onUpdate) {
      data.onUpdate(id, { content: editableContent });
    }
    setEditingTitle(false);
  };

  // Handle detail item update
  const handleDetailUpdate = (index: number, value: string) => {
    const newDetails = [...editableDetails];
    newDetails[index] = value;
    setEditableDetails(newDetails);
    if (data.onUpdate) {
      data.onUpdate(id, { details: newDetails });
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

  // Handle paste for images
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob && data.type === "image") {
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
        }
        // For other card types, let TipTap handle the paste
      }
    }
  };

  // Render different content based on card type
  const renderCardContent = () => {
    switch (data.type) {
      case "image":
        return (
          <div className="bg-white h-40 rounded flex flex-col items-center justify-center">
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
          <div className="bg-blue-50/50 p-3 rounded flex flex-col">
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
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                    onBlur={handleContentUpdate}
                    placeholder="Link title"
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
          <div ref={contentAreaRef} className="relative">
            {editor && (
              <BubbleMenu
                editor={editor}
                tippyOptions={{ duration: 100 }}
                className="bg-white shadow-sm rounded flex items-center space-x-1 p-1"
              >
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1 rounded ${
                    editor.isActive("bold")
                      ? "bg-gray-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <BoldIcon className="h-3 w-3" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1 rounded ${
                    editor.isActive("italic")
                      ? "bg-gray-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <ItalicIcon className="h-3 w-3" />
                </button>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={`p-1 rounded ${
                    editor.isActive("bulletList")
                      ? "bg-gray-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <ListIcon className="h-3 w-3" />
                </button>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={`p-1 rounded ${
                    editor.isActive("heading", { level: 3 })
                      ? "bg-gray-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Heading1Icon className="h-3 w-3" />
                </button>
                <button
                  onClick={handleImageUpload}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <ImageIcon className="h-3 w-3" />
                </button>
              </BubbleMenu>
            )}

            {/* TipTap Editor */}
            <EditorContent editor={editor} />

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
      className={`bg-white rounded-md shadow-sm ${
        selected ? "shadow-md" : ""
      } ${data.type === "image" ? "w-64" : "w-72"} text-xs`}
    >
      {/* Connection Handles - only visible on hover or when selected */}
      {selected && (
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

      {/* Card Header */}
      <div className="p-3 border-b border-gray-100 flex justify-between items-center">
        {editingTitle ? (
          <input
            ref={contentRef}
            type="text"
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            onBlur={handleContentUpdate}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleContentUpdate();
              }
            }}
            className="flex-1 text-xs font-medium text-gray-900 bg-transparent outline-none border-none focus:outline-none focus:ring-0"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className="text-xs font-medium text-gray-900 cursor-text"
            onClick={() => setEditingTitle(true)}
          >
            {editableContent}
          </div>
        )}
        <div className="relative">
          <button
            className="p-1 rounded-full text-gray-400 hover:text-gray-500 active:border-none active:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <MoreHorizontalIcon className="h-3 w-3" />
          </button>

          {/* Card Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-50 py-1">
              <button
                className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100 flex items-center"
                onClick={() => data.onDelete && data.onDelete(id)}
              >
                <TrashIcon className="h-3 w-3 mr-2" />
                Delete Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 group text-xs">{renderCardContent()}</div>
    </div>
  );
}
