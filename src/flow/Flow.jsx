import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes = [];
const initialEdges = [];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNode = () => {
    setNodes((nds) => [
      ...nds,
      {
        id: (nds.length + 1).toString(),
        position: { x: nds.length * 200, y: 0 },
        data: { label: `Node ${nds.length + 1}` },
      },
    ]);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button
        onClick={addNode}
        style={{ position: 'absolute', zIndex: 10, top: 10, left: 10 }}
      >
        Add Node
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background
          variant="dots"
          gap={16}
          size={1}
          color="#888"
        />
      </ReactFlow>
    </div>
  );
}
