"use client";

import Link from "next/link";
import {
  FileTextIcon,
  ImageIcon,
  ListIcon,
  LinkIcon,
  CheckSquareIcon,
  TableIcon,
  LayoutIcon,
  PencilIcon,
  UploadIcon,
  MoreVerticalIcon,
} from "lucide-react";

interface BoardSidebarProps {
  onAddItem: (type: string) => void;
}

export default function BoardSidebar({ onAddItem }: BoardSidebarProps) {
  const sidebarItems = [
    { icon: <FileTextIcon size={20} />, label: "Note", type: "note" },
    { icon: <ImageIcon size={20} />, label: "Image", type: "image" },
    { icon: <ListIcon size={20} />, label: "To-do", type: "todo" },
    { icon: <LinkIcon size={20} />, label: "Link", type: "link" },
    { icon: <CheckSquareIcon size={20} />, label: "Board", type: "board" },
    { icon: <TableIcon size={20} />, label: "Table", type: "table" },
    { icon: <LayoutIcon size={20} />, label: "Column", type: "column" },
    { icon: <PencilIcon size={20} />, label: "Draw", type: "draw" },
    { icon: <UploadIcon size={20} />, label: "Upload", type: "upload" },
  ];

  return (
    <div className="fixed left-0 top-0 bottom-0 w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 z-10">
      <Link href="/dashboard" className="mb-6">
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
          M
        </div>
      </Link>

      <div className="flex-1 flex flex-col items-center space-y-4">
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            className="w-10 h-10 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => onAddItem(item.type)}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center space-y-4 mb-4">
        <button className="w-10 h-10 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
          <MoreVerticalIcon size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
          U
        </div>
      </div>
    </div>
  );
}
