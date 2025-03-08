"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  PlusIcon,
  SearchIcon,
  MoreHorizontalIcon,
  ImageIcon,
  FileTextIcon,
  ListIcon,
  LinkIcon,
  CheckSquareIcon,
  UserIcon,
  Share2Icon,
  SettingsIcon,
} from "lucide-react";
import BoardCard from "@/app/components/BoardCard";

// Sample data for board items
const initialItems = [
  {
    id: 1,
    type: "note",
    content: "Initiate Admin Login",
    details: [
      "create a form for admin login and attach it to the main page",
      "link it to the backend and make sure to provide high security and safety",
      "admin dashboard allows functionality like adding mentor accounts and populating students into the database",
    ],
    position: { x: 100, y: 100 },
  },
  {
    id: 2,
    type: "note",
    content: "Mentor login",
    details: [
      "Mark attendance",
      "Put in marks of individual students",
      "Approve leave and BOA",
      "Send notice to all students",
    ],
    position: { x: 400, y: 100 },
  },
  {
    id: 3,
    type: "note",
    content: "Student Account",
    details: [
      "Schema",
      "Name",
      "Email",
      "Password",
      "Date of birth",
      "Date of creating accounts",
    ],
    position: { x: 700, y: 100 },
  },
  {
    id: 4,
    type: "note",
    content: "Student Login",
    details: [
      "See marks and Attendance demographics",
      "apply for leave",
      "see notifications",
    ],
    position: { x: 100, y: 400 },
  },
  {
    id: 5,
    type: "note",
    content: "Mentor Schema",
    details: [],
    position: { x: 700, y: 400 },
  },
  {
    id: 6,
    type: "image",
    content: "WebRTC Integration",
    details: ["5 cards"],
    position: { x: 100, y: 650 },
  },
];

// Board component
export default function Board({ params }: { params: { id: string } }) {
  const [items, setItems] = useState(initialItems);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const itemStartPos = useRef({ x: 0, y: 0 });

  // Get board title from sample data
  const boardTitle = `Board ${params.id}`;

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent, id: number) => {
    setActiveItem(id);
    setIsDragging(true);

    const item = items.find((item) => item.id === id);
    if (item) {
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      itemStartPos.current = { ...item.position };
    }

    // Add event listeners for drag and drop
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
  };

  // Handle drag
  const handleDrag = (e: MouseEvent) => {
    if (activeItem === null || !isDragging) return;

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === activeItem
          ? {
              ...item,
              position: {
                x: itemStartPos.current.x + dx,
                y: itemStartPos.current.y + dy,
              },
            }
          : item
      )
    );
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    setActiveItem(null);

    // Remove event listeners
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleDragEnd);
  };

  // Add new item
  const addNewItem = (type: string) => {
    const newId = Math.max(...items.map((item) => item.id)) + 1;
    const boardRect = boardRef.current?.getBoundingClientRect();

    if (boardRect) {
      const centerX = boardRect.width / 2 - 150;
      const centerY = boardRect.height / 2 - 100;

      const newItem = {
        id: newId,
        type,
        content: type === "note" ? "New Note" : "New Image",
        details: [],
        position: { x: centerX, y: centerY },
      };

      setItems([...items, newItem]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Board Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {boardTitle}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search in board..."
                  className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <Share2Icon className="h-5 w-5" />
              </button>
              <button className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <SettingsIcon className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Board Toolbar */}
      <div className="bg-white border-b border-gray-200 py-2 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => addNewItem("note")}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FileTextIcon className="h-4 w-4 mr-1.5" />
            Note
          </button>
          <button
            onClick={() => addNewItem("image")}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ImageIcon className="h-4 w-4 mr-1.5" />
            Image
          </button>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <ListIcon className="h-4 w-4 mr-1.5" />
            List
          </button>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <LinkIcon className="h-4 w-4 mr-1.5" />
            Link
          </button>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <CheckSquareIcon className="h-4 w-4 mr-1.5" />
            To-do
          </button>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <UserIcon className="h-4 w-4 mr-1.5" />
            Person
          </button>
        </div>
      </div>

      {/* Board Canvas */}
      <div
        ref={boardRef}
        className="flex-1 relative overflow-auto bg-gray-100 dotted-bg"
        style={{ minHeight: "80vh" }}
      >
        {/* Board Items */}
        {items.map((item) => (
          <BoardCard
            key={item.id}
            id={item.id}
            type={item.type}
            content={item.content}
            details={item.details}
            position={item.position}
            isActive={activeItem === item.id}
            isDragging={isDragging}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
}
