"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  MarkerType,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  NodeChange,
  EdgeTypes,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  ArrowLeftIcon,
  SearchIcon,
  Share2Icon,
  SettingsIcon,
  PlusIcon,
} from "lucide-react";
import BoardSidebar from "@/app/components/BoardSidebar";
import CustomNode from "@/app/components/CustomNode";
import CustomEdge from "@/app/components/CustomEdge";

// Define node types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Define edge types
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// Sample data for initial nodes
const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 100, y: 100 },
    data: {
      type: "note",
      content: "Initiate Admin Login",
      details: [
        "create a form for admin login and attach it to the main page",
        "link it to the backend and make sure to provide high security and safety",
        "admin dashboard allows functionality like adding mentor accounts and populating students into the database",
      ],
      html: "<p>Create a form for admin login and attach it to the main page.</p><p>Link it to the backend and make sure to provide high security and safety.</p><p>Admin dashboard allows functionality like adding mentor accounts and populating students into the database.</p>",
    },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 400, y: 100 },
    data: {
      type: "note",
      content: "Mentor login",
      details: [
        "Mark attendance",
        "Put in marks of individual students",
        "Approve leave and BOA",
        "Send notice to all students",
      ],
    },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 700, y: 100 },
    data: {
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
    },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 100, y: 400 },
    data: {
      type: "note",
      content: "Student Login",
      details: [
        "See marks and Attendance demographics",
        "apply for leave",
        "see notifications",
      ],
    },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 700, y: 400 },
    data: {
      type: "note",
      content: "Mentor Schema",
      details: [],
    },
  },
  {
    id: "6",
    type: "custom",
    position: { x: 100, y: 650 },
    data: {
      type: "image",
      content: "WebRTC Integration",
      details: [
        "https://webrtc.github.io/webrtc-org/assets/images/webrtc-logo-vert-retro-255x305.png",
      ],
    },
  },
];

// Sample data for initial edges
const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    sourceHandle: "right",
    targetHandle: "left",
    type: "custom",
    data: { label: "connects to" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    sourceHandle: "right",
    targetHandle: "left",
    type: "custom",
    data: { label: "uses" },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];

// Flow component
function Flow({ boardId }: { boardId: string }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  // Initialize nodes first, without edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const { project } = useReactFlow();

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
  const boardTitle = `Board ${boardId}`;

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

      const newId = `${Date.now()}`;
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

  // Initialize node data and edges
  useEffect(() => {
    // First add data to nodes
    addNodeDataToNodes();

    // Then set edges after a small delay to ensure nodes and handles are rendered
    const timer = setTimeout(() => {
      setEdges(initialEdges);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Board Sidebar */}
      <BoardSidebar onAddItem={addNewItem} />

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
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                    <SearchIcon className="h-3 w-3 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="block w-32 pl-7 pr-2 py-1 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs"
                  />
                </div>
                <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                  <Share2Icon className="h-4 w-4" />
                </button>
                <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                  <SettingsIcon className="h-4 w-4" />
                </button>
                <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs">
                  U
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* React Flow Canvas */}
        <div ref={reactFlowWrapper} className="h-[calc(100vh-48px)]">
          <ReactFlow
            key={`flow-${boardId}`}
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={memoizedNodeTypes}
            edgeTypes={memoizedEdgeTypes}
            connectionLineStyle={connectionLineStyle}
            onInit={setReactFlowInstance}
            fitView
            minZoom={0.1}
            maxZoom={4}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            selectNodesOnDrag={false}
            panOnDrag={[1, 2]} // Only pan when middle or right mouse button is used
            className="text-selectable-flow"
          >
            <Controls />
            <MiniMap />
            <Background color="#aaa" gap={16} />
            <Panel
              position="top-right"
              className="bg-white p-2 rounded-md shadow-md"
            >
              <button
                className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={() => addNewItem("note")}
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Note</span>
              </button>
            </Panel>

            {/* Helper message */}
            <Panel
              position="bottom-center"
              className="bg-indigo-600 p-3 rounded-md shadow-md mb-4 text-sm text-white font-medium"
            >
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <span className="mr-2 flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-white inline-block"></span>
                  </span>
                  <span>Use the circular handles to connect cards</span>
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <span className="mr-2">✏️</span>
                  <span>Click on connection labels to edit them</span>
                </span>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

// Define the params type
interface BoardParams {
  id: string;
}

// Board component with React Flow Provider
export default function Board({ params }: { params: Record<string, unknown> }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params) as BoardParams;
  const boardId = unwrappedParams.id;

  return (
    <ReactFlowProvider>
      <Flow boardId={boardId} />
    </ReactFlowProvider>
  );
}
