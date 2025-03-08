"use client";

import { useState, useRef } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import {
  MoreHorizontalIcon,
  ImageIcon,
  LinkIcon,
  CheckIcon,
  PlusIcon,
  XIcon,
  TrashIcon,
  EditIcon,
} from "lucide-react";

interface CustomNodeData {
  type: string;
  content: string;
  details: string[];
  onUpdate?: (
    id: string,
    updates: Partial<{ content: string; details: string[]; type: string }>
  ) => void;
  onDelete?: (id: string) => void;
}

export default function CustomNode({
  id,
  data,
  selected,
}: NodeProps<CustomNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(data.content);
  const [editableDetails, setEditableDetails] = useState<string[]>(
    data.details
  );
  const [showMenu, setShowMenu] = useState(false);
  const [newItem, setNewItem] = useState("");
  const contentRef = useRef<HTMLInputElement>(null);

  // Handle content update
  const handleContentUpdate = () => {
    if (data.onUpdate) {
      data.onUpdate(id, { content: editableContent });
    }
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

  // Render different content based on card type
  const renderCardContent = () => {
    switch (data.type) {
      case "image":
        return (
          <div className="bg-gray-200 h-40 rounded flex flex-col items-center justify-center">
            {data.details[0] ? (
              <img
                src={data.details[0]}
                alt={data.content}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                {isEditing && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">
                      Paste an image URL or upload
                    </p>
                    <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newItem.trim() !== "") {
                          const newDetails = [newItem];
                          setEditableDetails(newDetails);
                          setNewItem("");
                          if (data.onUpdate) {
                            data.onUpdate(id, { details: newDetails });
                          }
                        }
                      }}
                      placeholder="Paste image URL here..."
                      className="w-full text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 px-2 py-1"
                    />
                    <label className="mt-2 inline-block px-3 py-1.5 bg-indigo-600 text-white text-xs rounded cursor-pointer hover:bg-indigo-700">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const imageUrl = event.target?.result as string;
                              const newDetails = [imageUrl];
                              setEditableDetails(newDetails);
                              if (data.onUpdate) {
                                data.onUpdate(id, { details: newDetails });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case "link":
        return (
          <div className="bg-blue-50 p-3 rounded flex flex-col">
            {data.details[0] && !isEditing ? (
              <a
                href={data.details[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline flex items-center"
              >
                <LinkIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <span>{data.content}</span>
              </a>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center">
                  <LinkIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                    onBlur={handleContentUpdate}
                    placeholder="Link title"
                    className="flex-1 text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500"
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
                  className="w-full text-sm text-blue-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        );
      case "todo":
        return (
          <div className="space-y-2">
            {editableDetails.map((detail, index) => (
              <div key={index} className="flex items-center">
                <button
                  className="w-5 h-5 rounded-sm border border-gray-300 flex items-center justify-center mr-2 flex-shrink-0"
                  onClick={() => handleRemoveDetail(index)}
                >
                  <CheckIcon className="h-3 w-3 text-gray-500" />
                </button>
                {isEditing ? (
                  <input
                    type="text"
                    value={detail}
                    onChange={(e) => handleDetailUpdate(index, e.target.value)}
                    className="flex-1 text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                  />
                ) : (
                  <span className="text-sm text-gray-600">{detail}</span>
                )}
                {isEditing && (
                  <button
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    onClick={() => handleRemoveDetail(index)}
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <div className="flex items-center mt-2">
                <button className="w-5 h-5 rounded-sm border border-gray-300 flex items-center justify-center mr-2 flex-shrink-0">
                  <PlusIcon className="h-3 w-3 text-gray-500" />
                </button>
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add new item..."
                  className="flex-1 text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        );
      default: // note type
        return (
          <div>
            {isEditing ? (
              <div className="space-y-2">
                {editableDetails.map((detail, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={detail}
                      onChange={(e) =>
                        handleDetailUpdate(index, e.target.value)
                      }
                      className="flex-1 text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      className="ml-2 text-gray-400 hover:text-gray-600"
                      onClick={() => handleRemoveDetail(index)}
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center mt-2">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add new item..."
                    className="flex-1 text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    className="ml-2 text-indigo-500 hover:text-indigo-600"
                    onClick={handleAddDetail}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                {editableDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        );
    }
  };

  return (
    <div
      className={`bg-white rounded-md shadow-md ${
        selected ? "ring-2 ring-indigo-500" : ""
      } ${data.type === "image" ? "w-64" : "w-72"}`}
    >
      {/* Connection Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="w-3 h-3 bg-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 bg-indigo-500"
      />

      {/* Card Header */}
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        {isEditing ? (
          <input
            ref={contentRef}
            type="text"
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            onBlur={handleContentUpdate}
            className="flex-1 text-sm font-medium text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className="text-sm font-medium text-gray-900">
            {editableContent}
          </h3>
        )}
        <div className="relative">
          <button
            className="p-1 rounded-full text-gray-400 hover:text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <MoreHorizontalIcon className="h-4 w-4" />
          </button>

          {/* Card Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-50 py-1">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  setIsEditing(!isEditing);
                  setShowMenu(false);
                }}
              >
                <EditIcon className="h-4 w-4 mr-2" />
                {isEditing ? "Done Editing" : "Edit Card"}
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                onClick={() => data.onDelete && data.onDelete(id)}
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3">{renderCardContent()}</div>
    </div>
  );
}
