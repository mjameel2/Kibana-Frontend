import { XYPosition } from 'react-flow-renderer';

export interface GraphNode {
  id: string;
  type: string;
  position: XYPosition;
  data: GraphNodeData;
}

export interface GraphNodeData {
  label: string;
  styles?: React.CSSProperties;
  endpointEvent?: EndpointEvent;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface GraphNode {
  id: string;
  type: string;
  data: GraphNodeData;
}

export interface EndpointEventSourceAgent {
  name: string;
  id: string;
  type: string;
  ephemeral_id: string;
  version: string;
}

export interface EndpointEventSourceProcess {
  parent: EndpointEventSourceProcessParent;
  pid: number;
  entity_id: string;
  command_line: string;
  executable: string;
  hash: {
      sha256: string;
      md5: string;
  };
}

export interface EndpointEventSourceProcessParent {
  pid: number;
  entity_id: string;
  command_line: string;
  executable: string;
  hash: {
      sha256: string;
      md5: string;
  };
}

export interface EndpointEventSourceCBC {
  endpoint_event: EndpointEventSourceCBCEE;
}

export interface EndpointEventSourceCBCEE {
  schema: number,
  event_origin: string,
  organization_key: string,
  process: any,
  netconn_community_id: string,
  backend: any,
  type: string,
  device: EndpointEventSourceCBCEEDevice,
  sensor_action: string,
  version: string
}

export interface EndpointEventSourceCBCEEDevice {
  os: string;
  external_ip: string;
  timestamp: string;
}

export interface EndpointEventSource {
  agent: EndpointEventSourceAgent;
  process: EndpointEventSourceProcess;
  carbon_black_cloud: EndpointEventSourceCBC
}

export interface EndpointEvent {
  _index: string,
  _id: string,
  _score: number,
  _source: EndpointEventSource
}