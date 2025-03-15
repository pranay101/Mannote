"use client";

import axios from "axios";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PlusIcon,
  SearchIcon,
  LayoutGridIcon,
  ListIcon,
  MoreHorizontalIcon,
  FolderIcon,
  Loader2Icon,
  AlertCircleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Board } from "@/lib/models";
import { GeneralObject } from "@/types/definitions";
import { v4 } from "uuid";
import { toast } from "sonner";
import Image from "next/image";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [boards, setBoards] = useState<Board[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const boardsRef = useRef<Board[]>([]);

  // Update boardsRef whenever boards change
  useEffect(() => {
    boardsRef.current = boards;
  }, [boards]);

  // Define fetchBoards with useCallback to avoid dependency issues
  const fetchBoards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await axios.get("/api/boards").then((res: GeneralObject) => {
        setBoards(res.data);
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error fetching boards:", error);
      setError("Failed to load your boards. Please try refreshing the page.");
      setIsLoading(false);
    }
  }, []);

  // Function to handle sign out
  const handleSignOut = useCallback(async () => {
    try {
      // Sign out and redirect to login page
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Sign out error:", error);
      // Force redirect to login if there's an error
      router.push("/login");
    }
  }, [router]);

  // Add a periodic check to verify the session is still valid
  useEffect(() => {
    if (status !== "authenticated") return;

    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) {
          handleSignOut();
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    };

    // Check session every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [status, handleSignOut]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const createNewBoard = async () => {
    if (!newBoardTitle.trim()) return;

    try {
      setIsCreating(true);
      setError(null);

      // Since we don't have a backend, create a mock board
      const newBoard = {
        id: v4(),
        title: newBoardTitle,
        description: "",
        cards: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: session?.user?.email || "",
      };

      await axios.post("/api/boards", newBoard).then(() => {
        fetchBoards();

        setNewBoardTitle("");
        setShowCreateForm(false);
        setIsCreating(false);
        toast.success("Board created successfully");
      });
    } catch (error) {
      console.error("Error creating board:", error);
      toast.error("Failed to create board. Please try again.");
      setIsCreating(false);
    }
  };

  // Filter boards based on search query
  const filteredBoards = boards.filter((board) =>
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) {
      return days === 1 ? "Yesterday" : `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return "Just now";
    }
  };

  // If session is loading, show loading spinner
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (status === "unauthenticated") {
    router.push("/login");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
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
              <button
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                onClick={handleSignOut}
              >
                <span className="sr-only">Sign Out</span>
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
              <div className="relative">
                <button className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">Open user menu</span>
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      {session?.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
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
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setShowCreateForm(true)}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Board
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <div className="mt-2">
                  <button
                    className="text-sm text-red-700 font-medium underline"
                    onClick={() => {
                      setError(null);
                      fetchBoards();
                    }}
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2Icon className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            {/* Create New Board Form */}
            {showCreateForm && (
              <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Create New Board
                </h3>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Enter board title..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mr-4"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") createNewBoard();
                    }}
                  />
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    onClick={createNewBoard}
                    disabled={isCreating || !newBoardTitle.trim()}
                  >
                    {isCreating ? (
                      <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <PlusIcon className="h-4 w-4 mr-2" />
                    )}
                    Create
                  </button>
                  <button
                    className="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

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
                  onClick={() => setShowCreateForm(true)}
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
                {filteredBoards.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    No boards found. Create your first board to get started!
                  </div>
                ) : (
                  filteredBoards.map((board) => (
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
                          {board.cards && board.cards.length > 0 ? (
                            <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full opacity-50">
                              <div className="bg-white rounded shadow-sm"></div>
                              <div className="bg-white rounded shadow-sm"></div>
                              <div className="bg-white rounded shadow-sm"></div>
                              <div className="bg-white rounded shadow-sm"></div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <p className="text-gray-400 text-sm">
                                No cards yet
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 mb-1">
                                {board.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {board.cards?.length || 0} cards • Updated{" "}
                                {formatDate(board.updatedAt)}
                              </p>
                            </div>
                            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                              <MoreHorizontalIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {/* Create New Board Item */}
                  <li>
                    <div
                      className="px-6 py-4 flex items-center hover:bg-gray-50 cursor-pointer"
                      onClick={() => setShowCreateForm(true)}
                    >
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
                  {filteredBoards.length === 0 ? (
                    <li className="px-6 py-12 text-center text-gray-500">
                      No boards found. Create your first board to get started!
                    </li>
                  ) : (
                    filteredBoards.map((board) => (
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
                                    {board.cards?.length || 0} cards • Updated{" "}
                                    {formatDate(board.updatedAt)}
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
                    ))
                  )}
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
