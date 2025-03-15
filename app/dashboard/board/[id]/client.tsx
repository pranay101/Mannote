"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  EdgeTypes,
  MarkerType,
  MiniMap,
  Node,
  NodeChange,
  NodeTypes,
  Panel,
  ReactFlowInstance,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import BoardSidebar from "@/app/components/BoardSidebar";
import CustomEdge from "@/app/components/CustomEdge";
import CustomNode from "@/app/components/CustomNode";
import type { Board } from "@/types/definitions";
import { GeneralObject } from "@/types/definitions";
import axios from "axios";
import { ArrowLeftIcon, InfoIcon, LoaderIcon, SaveIcon, XIcon } from "lucide-react";
import moment from "moment";
import { toast } from "sonner";
import { v4 } from "uuid";
import { useSession } from "next-auth/react";
import Image from "next/image";

// Define node types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Define edge types
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// Flow component
function Flow({ boardId }: { boardId: string }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  // Initialize nodes first, without edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [showHelperText, setShowHelperText] = useState(true);
  const { project } = useReactFlow();

  const [board, setBoard] = useState<Board | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<{
    database: string;
    localStorage: string;
  } | null>(null);
  const [showSaveTooltip, setShowSaveTooltip] = useState(false);

  const { data: session } = useSession();

  console.log(session, "session");

  const fetchAndSetBoard = useCallback(async () => {
    const res = await axios.get(`/api/boards/${boardId}`);

    setBoard(res.data);
    setNodes(res.data.cards || []);
    setEdges(res.data.edges || []);

    setLastSaved({
      localStorage: res.data.updatedAt,
      database: res.data.updatedAt,
    });
  }, [boardId, setNodes, setEdges]);

  useEffect(() => {
    fetchAndSetBoard();
  }, [boardId, fetchAndSetBoard, setEdges, setNodes]);

  // Custom node change handler to prevent dragging active nodes
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // Filter out position changes for nodes in editing mode
      const filteredChanges = changes.filter((change) => {
        if (change.type === "position") {
          // Find the node element
          const nodeElement = document.querySelector(
            `[data-id="${change.id}"]`
          );
          // Check if the node is in editing mode
          if (
            nodeElement &&
            nodeElement.querySelector('[data-editing="true"]')
          ) {
            return false; // Skip this change
          }
        }
        return true;
      });

      // Apply the filtered changes
      onNodesChange(filteredChanges);
    },
    [onNodesChange]
  );

  // Get board title
  const boardTitle = `Board ${board?.title || "Untitled"}`;

  // Handle connection
  const onConnect = useCallback(
    (params: Connection) => {
      // Ensure sourceHandle and targetHandle are defined
      const connection = {
        ...params,
        sourceHandle: params.sourceHandle || "right",
        targetHandle: params.targetHandle || "left",
        type: "custom", // Use our custom edge
        data: { label: "" }, // Initialize with empty label
        markerEnd: { type: MarkerType.ArrowClosed },
      };

      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  // Handle node update
  const handleNodeUpdate = useCallback(
    (
      nodeId: string,
      updates: Partial<{
        content: string;
        details: string[];
        type: string;
        html?: string;
        width?: number;
        height?: number;
      }>
    ) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...updates,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  // Handle node delete
  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      console.log(nodeId, "nodeId");
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  // Add node data to nodes
  const addNodeDataToNodes = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === "custom") {
          return {
            ...node,
            data: {
              ...node.data,
              onUpdate: handleNodeUpdate,
              onDelete: handleNodeDelete,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes, handleNodeUpdate, handleNodeDelete]);

  // Add new item
  const addNewItem = useCallback(
    (type: string) => {
      if (!reactFlowInstance) return;

      const newId = v4();
      const position = project({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });

      let initialHtml = "";
      if (type === "note") {
        initialHtml = "<p>Click to add content...</p>";
      }

      const newNode: Node = {
        id: newId,
        type: "custom",
        position,
        data: {
          type,
          content:
            type === "note"
              ? "New Note"
              : type === "image"
              ? "New Image"
              : type === "todo"
              ? "New To-do"
              : type === "link"
              ? "New Link"
              : "New Item",
          details: [],
          html: initialHtml,
          onUpdate: handleNodeUpdate,
          onDelete: handleNodeDelete,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, project, setNodes, handleNodeUpdate, handleNodeDelete]
  );

  console.log(nodes, "nodes");
  console.log(edges, "edges");
  console.log(board, "board");

  // Initialize node data and edges
  useEffect(() => {
    // First add data to nodes
    addNodeDataToNodes();

    // Then set edges after a small delay to ensure nodes and handles are rendered
    const timer = setTimeout(() => {
      // Initialize with empty edges array instead of undefined initialEdges
      setEdges([]);
    }, 100);

    return () => clearTimeout(timer);
  }, [addNodeDataToNodes, setEdges]);

  // Memoize node types to prevent unnecessary re-renders
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  // Memoize edge types to prevent unnecessary re-renders
  const memoizedEdgeTypes = useMemo(() => edgeTypes, []);

  // Define connection line style
  const connectionLineStyle = useMemo(
    () => ({
      strokeWidth: 3,
      stroke: "#6366f1", // indigo-500
      strokeDasharray: "5,5",
      animation: "dashdraw 0.5s linear infinite",
    }),
    []
  );

  // Add CSS for the animation
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes dashdraw {
        0% {
          stroke-dashoffset: 10;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSaveToLocalStorage = useCallback(() => {
    setIsSaving(true);
    localStorage.setItem(
      "board",
      JSON.stringify({
        ...board,
        nodes,
        edges,
      })
    );
    setLastSaved({
      database: lastSaved?.database || "",
      localStorage: moment().toISOString(),
    });
    setIsSaving(false);
  }, [board, nodes, edges, lastSaved?.database]);

  const handleSave = useCallback(() => {
    if (!board) return;

    handleSaveToLocalStorage();

    setIsSaving(true);
    const updatedBoard = {
      ...board,
      cards: nodes.map((node) => ({
        id: node.id,
        title: node.data.content,
        description: node.data.details.join("\n"),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        position: node.position,
        width: node.width,
        height: node.height,
        type: node.type,
        data: node.data,
      })),
      // Add edges to the board data
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        label: edge.data?.label || "",
      })),
    };

    axios
      .put(`/api/boards/${boardId}`, updatedBoard)
      .then((res: GeneralObject) => {
        setLastSaved({
          localStorage: lastSaved?.localStorage || "",
          database: moment().toISOString(),
        });
        setBoard(res.data);
        toast.success("Board saved to database");
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [board, handleSaveToLocalStorage, nodes, edges, boardId, lastSaved?.localStorage]);

  const handleDeleteAll = useCallback(() => {
    if (!board) return;
    
    const updatedBoard = {
      ...board,
      cards: [],
      edges: []
    };
    
    axios.put(`/api/boards/${boardId}`, updatedBoard)
      .then((res) => {
        setNodes([]);
        setEdges([]);
        setBoard(res.data);
        toast.success("Board cleared");
      })
      .catch((error) => {
        console.error("Error clearing board:", error);
        toast.error("Failed to clear board");
      });
  }, [board, setNodes, setEdges, boardId]);

  useEffect(() => {
    // Set up auto-save to localStorage every 15 seconds
    const localStorageInterval = setInterval(() => {
      handleSaveToLocalStorage();
    }, 15000); // 15 seconds

    // Set up auto-save to database every 2 minutes
    const dbSaveInterval = setInterval(() => {
      handleSave();
    }, 120000); // 2 minutes

    // Clean up intervals on unmount
    return () => {
      clearInterval(localStorageInterval);
      clearInterval(dbSaveInterval);
    };
  }, [
    nodes,
    edges,
    board,
    handleSaveToLocalStorage,
    handleSave,
    lastSaved?.database,
    lastSaved?.localStorage,
  ]);

  console.log(lastSaved, "lastSaved");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Board Sidebar */}
      <BoardSidebar onAddItem={addNewItem} onDeleteAll={handleDeleteAll} />

      {/* Main Content */}
      <div className="ml-16 h-screen">
        {/* Board Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-full mx-auto px-4">
            <div className="flex justify-between items-center h-12">
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                </Link>
                <h1 className="text-sm font-semibold text-gray-900">
                  {boardTitle}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                {/* Last saved info - hidden on small screens, shown with tooltip */}
                <div className="hidden md:flex text-sm text-gray-600 gap-4">
                  <h6>Last Saved</h6>

                  <div className="flex items-center gap-2">
                    <span>
                      <strong>Local: </strong>
                      {lastSaved?.localStorage
                        ? moment(lastSaved.localStorage).format("h:mm A")
                        : "Never"}
                    </span>
                    <span>
                      <strong>Database: </strong>
                      {lastSaved?.database
                        ? moment(lastSaved.database).format("h:mm A")
                        : "Never"}
                    </span>
                  </div>
                </div>
                
                {/* Info icon for small screens */}
                <div className="md:hidden relative">
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onMouseEnter={() => setShowSaveTooltip(true)}
                    onMouseLeave={() => setShowSaveTooltip(false)}
                    onClick={() => setShowSaveTooltip(!showSaveTooltip)}
                  >
                    <InfoIcon className="h-4 w-4" />
                  </button>
                  
                  {/* Tooltip panel - column layout on mobile */}
                  {showSaveTooltip && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg p-3 text-xs z-50 border border-gray-200">
                      <h6 className="font-semibold mb-1">Last Saved</h6>
                      <div className="flex flex-col space-y-2">
                        <div>
                          <strong>Local Storage: </strong>
                          {lastSaved?.localStorage
                            ? moment(lastSaved.localStorage).format("h:mm A, MMM D")
                            : "Never"}
                        </div>
                        <div>
                          <strong>Database: </strong>
                          {lastSaved?.database
                            ? moment(lastSaved.database).format("h:mm A, MMM D")
                            : "Never"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSave()}
                  >
                    {isSaving ? (
                      <LoaderIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      <SaveIcon className="h-4 w-4" />
                    )}
                    <span>{isSaving ? "Saving..." : "Save"}</span>
                  </button>
                </div>

                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs">
                    {session?.user?.name
                      ? session.user.name.charAt(0)
                      : session?.user?.email?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* React Flow Canvas */}
        <div ref={reactFlowWrapper} className="h-[calc(100vh-48px)]">
          <ReactFlow
            key={`flow-${boardId}`}
            nodes={nodes || []}
            edges={edges || []}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={memoizedNodeTypes}
            edgeTypes={memoizedEdgeTypes}
            connectionLineStyle={connectionLineStyle}
            onInit={setReactFlowInstance}
            minZoom={0.1}
            maxZoom={4}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            selectNodesOnDrag={false}
            panOnDrag={[1, 2]} // Only pan when middle or right mouse button is used
            className="text-selectable-flow"
            
          >
            <Controls />
            <MiniMap className="hidden md:block" />
            <Background color="#aaa" gap={16} />

            {/* Helper message with dismiss button */}
            {showHelperText && (
              <Panel
                position="bottom-center"
                className="hidden md:block bg-indigo-500/80 backdrop-blur-sm p-3 rounded-md shadow-md mb-4 text-xs text-white font-medium transition-opacity duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <span className="mr-2 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
                      </span>
                      <span>Use the circular handles to connect cards</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <span className="mr-2">✏️</span>
                      <span>Click on connection labels to edit them</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <span className="mr-2">⌨️</span>
                      <span>Press Ctrl + Del to delete a card</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setShowHelperText(false)}
                    className="ml-3 text-white hover:text-gray-200 focus:outline-none"
                    aria-label="Close helper text"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

// Board client component with React Flow Provider
export default function BoardClient({ boardId }: { boardId: string }) {
  return (
    <ReactFlowProvider>
      <Flow boardId={boardId} />
    </ReactFlowProvider>
  );
}
