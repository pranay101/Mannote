"use client";

import { motion } from "framer-motion";
import { MoreHorizontalIcon, ImageIcon } from "lucide-react";

interface BoardCardProps {
  id: number;
  type: string;
  content: string;
  details: string[];
  position: { x: number; y: number };
  isActive: boolean;
  isDragging: boolean;
  onDragStart: (e: React.MouseEvent, id: number) => void;
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
}: BoardCardProps) {
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
      {/* Card Header */}
      <div
        className="p-3 border-b border-gray-200 flex justify-between items-center"
        onMouseDown={(e) => onDragStart(e, id)}
      >
        <h3 className="text-sm font-medium text-gray-900">{content}</h3>
        <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
          <MoreHorizontalIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-3">
        {type === "image" ? (
          <div className="bg-gray-200 h-40 rounded flex items-center justify-center">
            <ImageIcon className="h-10 w-10 text-gray-400" />
          </div>
        ) : (
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
            {details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
