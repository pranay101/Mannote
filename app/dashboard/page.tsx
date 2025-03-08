"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PlusIcon,
  SearchIcon,
  LayoutGridIcon,
  ListIcon,
  MoreHorizontalIcon,
  FolderIcon,
} from "lucide-react";

// Sample data for boards
const initialBoards = [
  { id: 1, title: "Project Planning", cards: 8, lastUpdated: "2 days ago" },
  { id: 2, title: "Design Ideas", cards: 12, lastUpdated: "5 hours ago" },
  { id: 3, title: "Content Strategy", cards: 5, lastUpdated: "1 week ago" },
  { id: 4, title: "Marketing Campaign", cards: 15, lastUpdated: "3 days ago" },
  { id: 5, title: "Product Roadmap", cards: 10, lastUpdated: "Yesterday" },
  { id: 6, title: "Team Goals", cards: 7, lastUpdated: "Just now" },
];

export default function Dashboard() {
  const [boards, setBoards] = useState(initialBoards);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter boards based on search query
  const filteredBoards = boards.filter((board) =>
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  mannote
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <span className="sr-only">Notifications</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <div className="relative">
                <button className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    U
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-bold text-gray-900">My Boards</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search boards..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGridIcon className="h-5 w-5" />
              </button>
              <button
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setViewMode("list")}
              >
                <ListIcon className="h-5 w-5" />
              </button>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <PlusIcon className="h-5 w-5 mr-2" />
              New Board
            </button>
          </div>
        </div>

        {/* Boards Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Board Card */}
            <motion.div
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center h-64 cursor-pointer hover:border-indigo-500 transition-colors"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <PlusIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Create New Board
              </h3>
              <p className="text-sm text-gray-500">
                Start organizing your ideas
              </p>
            </motion.div>

            {/* Board Cards */}
            {filteredBoards.map((board) => (
              <motion.div
                key={board.id}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Link href={`/dashboard/board/${board.id}`}>
                  <div className="h-40 bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full opacity-50">
                      <div className="bg-white rounded shadow-sm"></div>
                      <div className="bg-white rounded shadow-sm"></div>
                      <div className="bg-white rounded shadow-sm"></div>
                      <div className="bg-white rounded shadow-sm"></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {board.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {board.cards} cards • Updated {board.lastUpdated}
                        </p>
                      </div>
                      <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                        <MoreHorizontalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {/* Create New Board Item */}
              <li>
                <div className="px-6 py-4 flex items-center hover:bg-gray-50 cursor-pointer">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <PlusIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 px-4">
                      <div>
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          Create New Board
                        </p>
                        <p className="text-sm text-gray-500">
                          Start organizing your ideas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              {/* Board List Items */}
              {filteredBoards.map((board) => (
                <li key={board.id}>
                  <Link
                    href={`/dashboard/board/${board.id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-6 py-4 flex items-center">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <FolderIcon className="h-5 w-5 text-indigo-600" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 px-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {board.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {board.cards} cards • Updated {board.lastUpdated}
                            </p>
                          </div>
                        </div>
                        <div>
                          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                            <MoreHorizontalIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
