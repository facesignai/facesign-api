'use client'

import clsx from 'clsx'
import { useState } from 'react'

interface FlowNode {
  id: string
  type: string
  label: string
  description?: string
}

interface FlowEdge {
  id: string
  source: string
  target: string
  label?: string
}

interface FlowDiagramProps {
  nodes: FlowNode[]
  edges: FlowEdge[]
  title?: string
  description?: string
  interactive?: boolean
}

const nodeTypeStyles = {
  start: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300',
  end: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300',
  conversation: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300',
  liveness_detection: 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300',
  document_scan: 'bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-300',
  default: 'bg-zinc-100 border-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-200'
}

function FlowNodeComponent({ 
  node, 
  interactive = false 
}: { 
  node: FlowNode
  interactive?: boolean 
}) {
  const [isHovered, setIsHovered] = useState(false)
  
  const nodeStyle = nodeTypeStyles[node.type as keyof typeof nodeTypeStyles] || nodeTypeStyles.default
  
  return (
    <div 
      className={clsx(
        'relative rounded-lg border-2 px-4 py-3 transition-all duration-200',
        nodeStyle,
        interactive && 'cursor-pointer hover:scale-105 hover:shadow-lg'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-center">
        <div className="text-xs font-medium uppercase tracking-wide opacity-75">
          {node.type.replace('_', ' ')}
        </div>
        <div className="mt-1 font-semibold">
          {node.label}
        </div>
      </div>
      
      {interactive && isHovered && node.description && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform">
          <div className="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
            {node.description}
            <div className="absolute top-full left-1/2 -translate-x-1/2 transform">
              <div className="border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FlowConnection({ edge }: { edge: FlowEdge; nodes: FlowNode[] }) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-600"></div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="text-zinc-400 dark:text-zinc-500"
        >
          <path
            d="M8 2L14 8L8 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {edge.label && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {edge.label}
          </span>
        )}
      </div>
    </div>
  )
}

export function FlowDiagram({ 
  nodes, 
  edges, 
  title, 
  description, 
  interactive = false 
}: FlowDiagramProps) {
  
  // Simple linear layout for now - can be enhanced with more complex layouts
  const renderLinearFlow = () => {
    const startNode = nodes.find(n => n.type === 'start')
    if (!startNode) return null
    
    const orderedNodes = [startNode]
    let currentNodeId = startNode.id
    
    // Follow edges to build the flow path
    let maxIterations = nodes.length
    while (maxIterations > 0) {
      const nextEdge = edges.find(e => e.source === currentNodeId)
      if (!nextEdge) break
      
      const nextNode = nodes.find(n => n.id === nextEdge.target)
      if (!nextNode) break
      
      orderedNodes.push(nextNode)
      currentNodeId = nextNode.id
      maxIterations--
    }
    
    return (
      <div className="flex flex-col gap-4">
        {orderedNodes.map((node, index) => (
          <div key={node.id}>
            <FlowNodeComponent 
              node={node} 
              interactive={interactive}
            />
            {index < orderedNodes.length - 1 && (
              <div className="py-2">
                <FlowConnection 
                  edge={edges.find(e => e.source === node.id)!} 
                  nodes={nodes} 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="my-8 rounded-lg border border-zinc-200 p-6 dark:border-zinc-700">
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="flex justify-center">
        <div className="max-w-md">
          {renderLinearFlow()}
        </div>
      </div>
      
      {interactive && (
        <div className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Hover over nodes for more details
        </div>
      )}
    </div>
  )
}