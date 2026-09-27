import React, { useState } from 'react';
import { 
  Network, 
  Layers, 
  Users, 
  GraduationCap, 
  Building2, 
  Code2, 
  Info,
  GitBranch,
  Search,
  Filter
} from 'lucide-react';
import { ProjectItem } from '../../types';

interface ProjectKnowledgeGraphProps {
  project?: ProjectItem;
  className?: string;
}

interface GraphNode {
  id: string;
  label: string;
  type: 'PERSON' | 'PROJECT' | 'TECH' | 'MENTOR' | 'INSTITUTION' | 'LINEAGE';
  x: number;
  y: number;
  subtitle?: string;
}

interface GraphLink {
  source: string;
  target: string;
  label?: string;
}

export const ProjectKnowledgeGraph: React.FC<ProjectKnowledgeGraphProps> = ({
  project,
  className = ''
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>('node-proj');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const pTitle = project?.title || 'Smart Campus Navigation';
  const pInst = project?.institution || 'Graphic Era Hill University';
  const pMentor = project?.passport?.facultyReviewer?.name || 'Dr. Anil Sharma';
  const pLead = project?.contributors?.[0]?.name || 'Suraj Rawat';

  // Deterministic clean layout for the relationship nodes
  const nodes: GraphNode[] = [
    { id: 'node-person', label: pLead, type: 'PERSON', x: 140, y: 150, subtitle: 'Student Contributor' },
    { id: 'node-proj', label: pTitle.length > 25 ? pTitle.slice(0, 24) + '...' : pTitle, type: 'PROJECT', x: 380, y: 180, subtitle: 'Core Project Node' },
    { id: 'node-tech1', label: 'React 19 & PWA', type: 'TECH', x: 250, y: 290, subtitle: 'Web Technology' },
    { id: 'node-tech2', label: 'BLE Beacons & A*', type: 'TECH', x: 420, y: 310, subtitle: 'Spatial Routing' },
    { id: 'node-mentor', label: pMentor, type: 'MENTOR', x: 590, y: 140, subtitle: 'Faculty Reviewer' },
    { id: 'node-inst', label: pInst.length > 22 ? pInst.slice(0, 20) + '...' : pInst, type: 'INSTITUTION', x: 620, y: 260, subtitle: 'Academic Node' },
    { id: 'node-lineage', label: 'Cohort Lineage (2024–2026)', type: 'LINEAGE', x: 380, y: 70, subtitle: 'Generational Ledger' }
  ];

  const links: GraphLink[] = [
    { source: 'node-person', target: 'node-proj', label: 'built' },
    { source: 'node-proj', target: 'node-tech1', label: 'uses' },
    { source: 'node-proj', target: 'node-tech2', label: 'implements' },
    { source: 'node-mentor', target: 'node-proj', label: 'mentors' },
    { source: 'node-mentor', target: 'node-inst', label: 'affiliated' },
    { source: 'node-proj', target: 'node-inst', label: 'accredited' },
    { source: 'node-lineage', target: 'node-proj', label: 'preserves' }
  ];

  const getNodeColor = (type: GraphNode['type']) => {
    switch (type) {
      case 'PROJECT': return { bg: '#111111', text: '#ffffff', stroke: '#000000' };
      case 'PERSON': return { bg: '#3b82f6', text: '#ffffff', stroke: '#1d4ed8' };
      case 'MENTOR': return { bg: '#059669', text: '#ffffff', stroke: '#047857' };
      case 'TECH': return { bg: '#d97706', text: '#ffffff', stroke: '#b45309' };
      case 'INSTITUTION': return { bg: '#7c3aed', text: '#ffffff', stroke: '#6d28d9' };
      case 'LINEAGE': return { bg: '#4f46e5', text: '#ffffff', stroke: '#4338ca' };
    }
  };

  const selectedNodeObj = nodes.find(n => n.id === selectedNode);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Card */}
      <div className="rounded-3xl bg-white border border-black/10 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111111] text-white flex items-center justify-center">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373]">
                Federated Topology
              </span>
              <h2 className="text-xl font-bold text-[#111111]">
                Project Knowledge Graph
              </h2>
            </div>
          </div>

          <div className="text-xs text-[#737373] bg-[#F5F5F3] px-3.5 py-1.5 rounded-full border border-black/8">
            Person ↔ Project ↔ Skill ↔ Technology ↔ Mentor ↔ Institution
          </div>
        </div>

        <p className="text-xs text-neutral-600 mt-3 leading-relaxed">
          Interactive relational mapping showing how project builders, faculty mentors, institutional nodes, and technological dependencies interconnect across generations.
        </p>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-[11px] font-semibold text-[#737373] mr-1">Legend:</span>
          {[
            { label: 'Project', color: 'bg-neutral-900 text-white' },
            { label: 'Student Builder', color: 'bg-blue-600 text-white' },
            { label: 'Faculty Mentor', color: 'bg-emerald-600 text-white' },
            { label: 'Technology', color: 'bg-amber-600 text-white' },
            { label: 'Institution', color: 'bg-purple-600 text-white' },
            { label: 'Lineage Ledger', color: 'bg-indigo-600 text-white' }
          ].map((item) => (
            <span key={item.label} className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.color}`}>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="rounded-3xl bg-[#FAF9F6] border border-black/10 p-4 sm:p-6 shadow-xs relative overflow-hidden">
        <svg
          viewBox="0 0 760 380"
          className="w-full h-auto max-h-[460px] select-none"
        >
          {/* Defs for gradients & markers */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="14"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#a3a3a3" />
            </marker>
          </defs>

          {/* Links */}
          {links.map((link, idx) => {
            const src = nodes.find(n => n.id === link.source);
            const tgt = nodes.find(n => n.id === link.target);
            if (!src || !tgt) return null;

            const isHighlighted = selectedNode === link.source || selectedNode === link.target;

            return (
              <g key={idx}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isHighlighted ? '#111111' : '#d4d4d4'}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeDasharray={link.label === 'preserves' ? '4 3' : undefined}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const colors = getNodeColor(node.type);
            const isSelected = selectedNode === node.id;
            const isProjectNode = node.type === 'PROJECT';
            const radius = isProjectNode ? 32 : 24;

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
              >
                {/* Outer Ring on selection */}
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + 6}
                    fill="none"
                    stroke={colors.bg}
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="animate-spin-slow"
                  />
                )}

                {/* Node Body */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={colors.bg}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="shadow-sm"
                />

                {/* Label text */}
                <text
                  x={node.x}
                  y={node.y + radius + 14}
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-[#111111] pointer-events-none"
                >
                  {node.label}
                </text>

                <text
                  x={node.x}
                  y={node.y + radius + 26}
                  textAnchor="middle"
                  className="text-[9.5px] fill-[#737373] pointer-events-none"
                >
                  {node.subtitle}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNodeObj && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-black/10 shadow-lg text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#111111]">{selectedNodeObj.label}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F5F5F3] text-[#737373]">
                {selectedNodeObj.type}
              </span>
            </div>
            <p className="text-[#555555]">
              {selectedNodeObj.subtitle} connected into {pTitle} generational knowledge graph.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
