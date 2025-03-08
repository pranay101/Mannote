"use client";

import { useState, useRef, useCallback } from "react";
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

// Define node types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
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
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    label: "uses",
  },
];

// Flow component
function Flow({ boardId }: { boardId: string }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { project } = useReactFlow();

  // Get board title
  const boardTitle = `Board ${boardId}`;

  // Handle connection
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      ),
    [setEdges]
  );

  // Handle node update
  const handleNodeUpdate = useCallback(
    (nodeId: string, updates: any) => {
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
          onUpdate: handleNodeUpdate,
          onDelete: handleNodeDelete,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, project, setNodes, handleNodeUpdate, handleNodeDelete]
  );

  // Initialize node data
  useState(() => {
    addNodeDataToNodes();
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Board Sidebar */}
      <BoardSidebar onAddItem={addNewItem} />

      {/* Main Content */}
      <div className="ml-16 h-screen">
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

        {/* React Flow Canvas */}
        <div ref={reactFlowWrapper} className="h-[calc(100vh-64px)]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            fitView
            snapToGrid
            snapGrid={[20, 20]}
            minZoom={0.1}
            maxZoom={4}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
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
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

// Board component with React Flow Provider
export default function Board({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const boardId = unwrappedParams.id;

  return (
    <ReactFlowProvider>
      <Flow boardId={boardId} />
    </ReactFlowProvider>
  );
}
