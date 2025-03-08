"use client";

interface CardConnectionProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
  strokeWidth?: number;
  dashed?: boolean;
  label?: string;
  onDelete?: () => void;
}

export default function CardConnection({
  startX,
  startY,
  endX,
  endY,
  color = "#6366f1", // indigo-500
  strokeWidth = 2,
  dashed = false,
  label,
  onDelete,
}: CardConnectionProps) {
  // Calculate the path for the arrow
  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx);

  // Calculate control point for the curve (for a slight curve)
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const curveOffset = 30; // Adjust for more or less curve
  const controlX = midX - curveOffset * Math.sin(angle);
  const controlY = midY + curveOffset * Math.cos(angle);

  // Calculate arrow head points
  const arrowLength = 10;
  const arrowWidth = 6;
  const arrowAngle = Math.PI / 6; // 30 degrees

  const arrowPoint1X = endX - arrowLength * Math.cos(angle - arrowAngle);
  const arrowPoint1Y = endY - arrowLength * Math.sin(angle - arrowAngle);
  const arrowPoint2X = endX - arrowLength * Math.cos(angle + arrowAngle);
  const arrowPoint2Y = endY - arrowLength * Math.sin(angle + arrowAngle);

  // Path for the curved line
  const path = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;

  // Calculate position for the label
  const labelX = midX;
  const labelY = midY - 15; // Offset above the line

  return (
    <g className="connection">
      {/* Main path */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? "5,5" : "none"}
        markerEnd="url(#arrowhead)"
      />

      {/* Arrow head */}
      <polygon
        points={`${endX},${endY} ${arrowPoint1X},${arrowPoint1Y} ${arrowPoint2X},${arrowPoint2Y}`}
        fill={color}
      />

      {/* Label */}
      {label && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          <rect
            x="-20"
            y="-10"
            width="40"
            height="20"
            rx="4"
            fill="white"
            stroke={color}
            strokeWidth="1"
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fill={color}
            fontSize="10"
          >
            {label}
          </text>
        </g>
      )}

      {/* Delete button */}
      {onDelete && (
        <g
          transform={`translate(${midX}, ${midY})`}
          onClick={onDelete}
          className="cursor-pointer hover:opacity-80"
        >
          <circle r="8" fill="white" stroke={color} strokeWidth="1" />
          <line
            x1="-4"
            y1="-4"
            x2="4"
            y2="4"
            stroke={color}
            strokeWidth="1.5"
          />
          <line
            x1="4"
            y1="-4"
            x2="-4"
            y2="4"
            stroke={color}
            strokeWidth="1.5"
          />
        </g>
      )}
    </g>
  );
}
