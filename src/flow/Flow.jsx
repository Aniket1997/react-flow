import React, { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 150 },
    data: { label: "default style 1" },
    ...nodeDefaults,
  },
  {
    id: "2",
    position: { x: 250, y: 0 },
    data: { label: "default style 2" },
    ...nodeDefaults,
  },
  {
    id: "3",
    position: { x: 250, y: 150 },
    data: { label: "default style 3" },
    ...nodeDefaults,
  },
  {
    id: "4",
    position: { x: 250, y: 300 },
    data: { label: "default style 4" },
    ...nodeDefaults,
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
  },
  {
    id: "e1-4",
    source: "1",
    target: "4",
  },
];

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedSubNode, setSelectedSubNode] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    []
  );

  const handleNodeClick = (event, node) => {
    setEditingNodeId(node.id);
    setNewTitle(node.data.label);
    setDrawerVisible(true);
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleSaveTitle = () => {
    if (editingNodeId) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === editingNodeId ? { ...n, data: { ...n.data, label: newTitle } } : n
        )
      );
      setDrawerVisible(false);
    }
  };

  const handleAddSubNode = () => {
    const newId = `${editingNodeId}-${Date.now()}`;
    const newNode = {
      id: newId,
      position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
      data: { label: `New Subnode` },
      ...nodeDefaults,
    };
    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, { id: `e-${editingNodeId}-${newId}`, source: editingNodeId, target: newId }]);
  };

  const handleEditSubNode = (nodeId) => {
    setSelectedSubNode(nodeId);
    const subNode = nodes.find((node) => node.id === nodeId);
    setNewTitle(subNode?.data?.label || "");
  };

  const handleSaveSubNodeTitle = () => {
    if (selectedSubNode) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedSubNode ? { ...n, data: { ...n.data, label: newTitle } } : n
        )
      );
      setSelectedSubNode(null);
      setNewTitle("");
    }
  };

  const handleDeleteSubNode = (nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {drawerVisible && (
        <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "100%", background: "white", boxShadow: "-2px 0 5px rgba(0,0,0,0.2)", padding: "20px" }}>
          <h3>Node Details</h3>
          <div>
            <label>Edit Title:</label>
            <input
              type="text"
              value={newTitle}
              onChange={handleTitleChange}
              placeholder="Enter new title"
            />
            <button onClick={handleSaveTitle}>Save</button>
          </div>

          <div style={{ marginTop: "20px" }}>
            <button onClick={handleAddSubNode}>Add Subnode</button>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h4>Subnodes:</h4>
            {nodes.filter((n) => n.id.startsWith(editingNodeId)).map((subNode) => (
              <div key={subNode.id} style={{ marginBottom: "10px" }}>
                <span>{subNode.data.label}</span>
                <button onClick={() => handleEditSubNode(subNode.id)}>Edit</button>
                <button onClick={() => handleDeleteSubNode(subNode.id)}>Delete</button>
              </div>
            ))}
          </div>

          {selectedSubNode && (
            <div style={{ marginTop: "20px" }}>
              <label>Edit Subnode Title:</label>
              <input
                type="text"
                value={newTitle}
                onChange={handleTitleChange}
                placeholder="Enter new subnode title"
              />
              <button onClick={handleSaveSubNodeTitle}>Save</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Flow;