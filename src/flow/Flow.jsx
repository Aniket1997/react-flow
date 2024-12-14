import React, { useCallback, useEffect, useState } from "react";
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
import workflowData from "../data/data"; // Static import of the data

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Function to convert JSON structure to nodes and edges
  const generateFlowFromData = (data, startX = 0, startY = 0, levelGap = 200, siblingGap = 55) => {
    const nodes = [];
    const edges = [];

    const processNode = (node, parentId = null, level = 0, verticalOffset = 0) => {
      const id = node.id;

      // Calculate position dynamically based on the level and vertical offset
      const nodeX = startX + level * levelGap; // Horizontal spacing increases with level
      const nodeY = startY + verticalOffset * siblingGap; // Vertical spacing for siblings

      // Determine if the node is a top-level node (main node)
      const isMainNode = parentId === null;

      // Add the current node with light green for main nodes
      nodes.push({
        id: id,
        position: { x: nodeX, y: nodeY },
        data: { label: node.title },
        style: {
          backgroundColor: isMainNode ? "lightgreen" : "#ffffff", // Light green for main nodes, white for sub-nodes
          border: "1px solid #333", // Optional: add border for better visibility
          padding: "10px",
        },
        ...nodeDefaults,
      });

      // Add an edge if there's a parent
      if (parentId) {
        edges.push({
          id: `e-${parentId}-${id}`,
          source: parentId,
          target: id,
          animated: true,
        });
      }

      // Process children recursively
      let childOffset = verticalOffset; // Track vertical positioning for children
      node.children.forEach((child, index) => {
        childOffset = processNode(child, id, level + 1, childOffset);
        childOffset++; // Move down for the next sibling
      });

      // Return the current vertical offset after placing this node and its subtree
      return childOffset;
    };

    // Process each top-level node
    let offset = 0; // Track the vertical position for top-level nodes
    data.forEach((node) => {
      offset = processNode(node, null, 0, offset);
      offset++; // Add spacing between top-level nodes
    });

    return { nodes, edges };
  };

  // Initialize nodes and edges from static data
  useEffect(() => {
    const { nodes, edges } = generateFlowFromData(workflowData.nodes); // Pass all root nodes
    setNodes(nodes);
    setEdges(edges);
  }, []);

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
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "300px",
            height: "100%",
            background: "white",
            boxShadow: "-2px 0 5px rgba(0,0,0,0.2)",
            padding: "20px",
          }}
        >
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
        </div>
      )}
    </div>
  );
};

export default Flow;
