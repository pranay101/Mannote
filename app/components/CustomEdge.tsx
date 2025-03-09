import React, { useState, useCallback } from "react";
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  useReactFlow,
} from "reactflow";
import { XIcon, PencilIcon } from "lucide-react";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(data?.label || "");
  const { setEdges } = useReactFlow();

  // Calculate the edge path
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Handle label change
  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLabelText(e.target.value);
    },
    []
  );

  // Save the label
  const handleLabelSave = useCallback(() => {
    setIsEditing(false);
    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              label: labelText,
            },
            label: labelText,
          };
        }
        return edge;
      })
    );
  }, [id, labelText, setEdges]);

  // Handle key press in the input field
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleLabelSave();
      } else if (e.key === "Escape") {
        setIsEditing(false);
        setLabelText(data?.label || "");
      }
    },
    [handleLabelSave, data?.label]
  );

  // Delete the edge
  const handleDelete = useCallback(() => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  }, [id, setEdges]);

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          {isEditing ? (
            <div className="flex items-center bg-white border border-gray-300 rounded shadow-sm">
              <input
                type="text"
                value={labelText}
                onChange={handleLabelChange}
                onKeyDown={handleKeyPress}
                onBlur={handleLabelSave}
                autoFocus
                className="px-2 py-1 text-xs w-24 focus:outline-none"
                placeholder="Edge label"
              />
            </div>
          ) : (
            <div className="flex items-center">
              <div
                className={`px-2 py-1 rounded-l bg-white border border-gray-200 text-xs ${
                  data?.label ? "text-gray-700" : "text-gray-400 italic"
                }`}
              >
                {data?.label || "Add label"}
              </div>
              <button
                className="p-1 bg-white border border-l-0 border-gray-200 rounded-r hover:bg-gray-50"
                onClick={() => setIsEditing(true)}
              >
                <PencilIcon className="h-3 w-3 text-gray-500" />
              </button>
              <button
                className="p-1 ml-1 bg-white border border-gray-200 rounded hover:bg-red-50"
                onClick={handleDelete}
              >
                <XIcon className="h-3 w-3 text-red-500" />
              </button>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
