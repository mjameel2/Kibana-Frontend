import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

// External libraries
import ReactFlow, { 
  Background, 
  BackgroundVariant, 
  applyEdgeChanges, 
  applyNodeChanges 
} from 'react-flow-renderer';

// My libraries
import { Node } from './Node';
import { GraphEdge, GraphNode, GraphNodeData } from '../../../common/model';
import { EndpointEventsProviderContext } from '../../context/EndpointEventsProvider';

const reactflowwrapper_css_style = {
  width: "100%",
  height: "100%",
  minHeight: 300,
  maxHeight: "30vh"
};

const initialNodes = [
  {
    id: '1',
    type: 'special',
    data: { 
      label: 'Process 1',
      styles: {
        backgroundColor: "var(--kibana-red)"
      }
    } as GraphNodeData,
    position: { x: 250, y: 25 },
  },
  // default node
  {
    id: '2',
    type: 'special',
    data: { 
      label: 'Process 2',
      styles: {
        backgroundColor: "var(--kibana-green)"
      }
    } as GraphNodeData,
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'special',
    data: { 
      label: 'Process 3',
      styles: {
        backgroundColor: "var(--kibana-blue)"
      }
    } as GraphNodeData,
    position: { x: 250, y: 250 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

export function Graph() {
  const { data } = useContext(EndpointEventsProviderContext);
  
  const [nodes, setNodes] = useState<any>(initialNodes);
  const [edges, setEdges] = useState<any>(initialEdges);

  console.log('nodes', nodes);
  console.log('edges', edges);

  useEffect(()=>{
    const graphNodes: GraphNode[] = [];
    for (let p1 of data?.pages ?? []) {
      console.log(p1);
      let endpointEvents: any = p1;
      for (const ee of endpointEvents) {
        const parent = ee?._source?.process?.parent?.pid?.toString();
        if (parent === undefined || parent === null) {
          continue;
        }
        if (graphNodes.find((n) => n.id === parent) === undefined) {
          graphNodes.push({
            id: parent,
            type: 'special',
            data: {
              label: parent,
              styles: {
                backgroundColor: "var(--kibana-blue)"
              },
              endpointEvent: ee
            },
            position: { x: 250, y: 25 }
          } as GraphNode);
        }
        
        const current = ee?._source?.process?.pid?.toString();
        if (current === undefined || current === null) {
          continue;
        }
        if (graphNodes.find((n) => n.id === current) === undefined) {
          graphNodes.push({
            id: current,
            type: 'special',
            data: {
              label: current,
              styles: {
                backgroundColor: "var(--kibana-blue)"
              },
              endpointEvent: ee,
            },
            position: { x: 250, y: 25 }
          } as GraphNode);
        }
      }
    }
    setNodes(graphNodes);

    const graphEdges: GraphEdge[] = [];
    for (let p2 of data?.pages ?? []) {
      console.log(p2);
      let endpointEvents: any = p2;
      for (const ee2 of endpointEvents) {
        const parent = ee2?._source?.process?.parent?.pid;
        const current = ee2?._source?.process?.pid;
        if (parent && current) {
          const edgeId = `e${parent}-${current}`;
          if (graphEdges.find((e) => e.id === edgeId) === undefined) {
            graphEdges.push({
              id: edgeId,
              source: parent.toString(),
              target: current.toString()
            });
          }
        }
      }
    }
    setEdges(graphEdges);
  }, [JSON.stringify(data)]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds: any) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds: any) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({ special: Node }), []);

  return (
    <div style={reactflowwrapper_css_style}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
      >
        <Background
          variant={BackgroundVariant.Lines}
          gap={16}
          size={1}
        />
      </ReactFlow>
    </div>
  );
} 
