import { motion } from "framer-motion";
import {
  CheckIcon,
  EditIcon,
  ImageIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LinkCard from "./cards/LinkCard";

interface BoardCardProps {
  id: string;
  type: string;
  content: string;
  details: string[];
  position: { x: number; y: number };
  isActive: boolean;
  isDragging: boolean;
  onDragStart: (e: React.MouseEvent, id: string) => void;
  onUpdate?: (
    id: string,
    updates: Partial<{ content: string; details: string[]; type: string }>
  ) => void;
  onDelete?: (id: string) => void;
  connectionStartHandler?: (id: string) => void;
  connectionEndHandler?: (id: string) => void;
  isConnectionMode?: boolean;
}

export default function BoardCard({
  id,
  type,
  content,
  details,
  position,
  isActive,
  isDragging,
  onDragStart,
  onUpdate,
  onDelete,
  connectionStartHandler,
  connectionEndHandler,
  isConnectionMode = false,
}: BoardCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content);
  const [editableDetails, setEditableDetails] = useState<string[]>(details);
  const [showMenu, setShowMenu] = useState(false);
  const [newItem, setNewItem] = useState("");
  const contentRef = useRef<HTMLInputElement>(null);
  const newItemRef = useRef<HTMLInputElement>(null);

  // Focus on content input when editing starts
  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isEditing]);

  // Handle content update
  const handleContentUpdate = () => {
    if (onUpdate) {
      onUpdate(id, { content: editableContent });
    }
  };

  // Handle detail item update
  const handleDetailUpdate = (index: number, value: string) => {
    const newDetails = [...editableDetails];
    newDetails[index] = value;
    setEditableDetails(newDetails);
    if (onUpdate) {
      onUpdate(id, { details: newDetails });
    }
  };

  // Handle adding a new detail item
  const handleAddDetail = () => {
    if (newItem.trim() !== "") {
      const newDetails = [...editableDetails, newItem];
      setEditableDetails(newDetails);
      setNewItem("");
      if (onUpdate) {
        onUpdate(id, { details: newDetails });
      }
      // Focus on the new item input after adding
      if (newItemRef.current) {
        newItemRef.current.focus();
      }
    }
  };

  // Handle removing a detail item
  const handleRemoveDetail = (index: number) => {
    const newDetails = [...editableDetails];
    newDetails.splice(index, 1);
    setEditableDetails(newDetails);
    if (onUpdate) {
      onUpdate(id, { details: newDetails });
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
    switch (type) {
      case "image":
        return (
          <div className="bg-gray-200 h-40 rounded flex flex-col items-center justify-center">
            {details[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={details[0]}
                alt={content}
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
                          if (onUpdate) {
                            onUpdate(id, { details: newDetails });
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
                              if (onUpdate) {
                                onUpdate(id, { details: newDetails });
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
          <LinkCard
            content={content}
            details={details}
            id={id}
            editableDetails={editableDetails}
            setEditableDetails={setEditableDetails}
          />
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
                  ref={newItemRef}
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
                    ref={newItemRef}
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
    <motion.div
      className={`absolute bg-white rounded-md shadow-md ${
        isActive ? "z-50 shadow-lg" : "z-10"
      } ${type === "image" ? "w-64 h-64" : "w-72"}`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging && isActive ? "grabbing" : "grab",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Connection points */}
      {!isConnectionMode && (
        <>
          <div
            className="absolute w-3 h-3 bg-indigo-500 rounded-full top-1/2 -left-1.5 transform -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform"
            onClick={() => connectionStartHandler && connectionStartHandler(id)}
          />
          <div
            className="absolute w-3 h-3 bg-indigo-500 rounded-full top-1/2 -right-1.5 transform -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform"
            onClick={() => connectionEndHandler && connectionEndHandler(id)}
          />
          <div
            className="absolute w-3 h-3 bg-indigo-500 rounded-full left-1/2 -top-1.5 transform -translate-x-1/2 cursor-pointer hover:scale-125 transition-transform"
            onClick={() => connectionStartHandler && connectionStartHandler(id)}
          />
          <div
            className="absolute w-3 h-3 bg-indigo-500 rounded-full left-1/2 -bottom-1.5 transform -translate-x-1/2 cursor-pointer hover:scale-125 transition-transform"
            onClick={() => connectionEndHandler && connectionEndHandler(id)}
          />
        </>
      )}

      {/* Card Header */}
      <div
        className="p-3 border-b border-gray-200 flex justify-between items-center cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => !isEditing && onDragStart(e, id)}
      >
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
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200 animate-fadeIn">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 flex items-center transition-colors duration-150"
                onClick={() => {
                  setIsEditing(!isEditing);
                  setShowMenu(false);
                }}
              >
                <EditIcon className="h-4 w-4 mr-2" />
                {isEditing ? "Save Changes" : "Edit Card"}
              </button>
              {type === "note" && (
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 flex items-center transition-colors duration-150"
                  onClick={() => {
                    // Add functionality to convert note to another type
                    setShowMenu(false);
                  }}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Convert to Link
                </button>
              )}
              <button
                className="w-full text-left text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors duration-150"
                onClick={() => {
                  if (onDelete) {
                    onDelete(id);
                  }
                  setShowMenu(false);
                }}
              >
                <TrashIcon className="h-6 w-6 mr-2" />
                Delete Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3">{renderCardContent()}</div>
    </motion.div>
  );
}
