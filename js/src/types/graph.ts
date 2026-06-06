import type { SimulationNodeDatum, SimulationLinkDatum } from "d3";

export interface GraphNode extends SimulationNodeDatum {
  id: string;
  label: string;
  group: string;
  linkCount: number;
  color?: string;
  preview?: string[];
}

export interface GraphEdge extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}
