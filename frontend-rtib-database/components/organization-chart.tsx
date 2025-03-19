"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  MarkerType,
  Panel,
  ReactFlowProvider,
} from "reactflow"
import "reactflow/dist/style.css"
import type { OrganizationChartData, OrganizationMember } from "@/types/organization"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Card } from "@/components/ui/card"
import { ExternalLink, Mail, Phone, Maximize, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"

// Custom node component for organization members
const OrgNode = ({ data }: { data: OrganizationMember }) => {
  return (
    <div className="group">
      <div className="relative flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md w-[180px] group-hover:scale-105">
        <div className="absolute -top-10 w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-sm bg-gray-100 dark:bg-gray-700">
          {data.imageUrl ? (
            <img src={data.imageUrl || "/placeholder.svg"} alt={data.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-xl font-semibold">
              {data.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          )}
        </div>
        <div className="mt-10 text-center">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{data.position}</p>
          {data.department && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{data.department}</p>}
        </div>

        {/* Contact details that appear on hover/touch */}
        <div className="absolute left-0 right-0 -bottom-2 bg-white dark:bg-gray-800 rounded-b-xl p-3 shadow-md opacity-0 group-hover:opacity-100 group-hover:bottom-0 transition-all duration-300 z-10 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col gap-2">
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline py-1"
              >
                <Mail className="h-4 w-4" />
                <span className="truncate">{data.email}</span>
              </a>
            )}
            {data.phone && (
              <a
                href={`tel:${data.phone}`}
                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline py-1"
              >
                <Phone className="h-4 w-4" />
                <span>{data.phone}</span>
              </a>
            )}
            {data.linkedinUrl && (
              <a
                href={data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline py-1"
              >
                <ExternalLink className="h-4 w-4" />
                <span>LinkedIn Profile</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Node types definition
const nodeTypes = {
  orgNode: OrgNode,
}

interface OrganizationChartProps {
  companyId: string
  data: OrganizationChartData
}

export function OrganizationChart({ companyId, data }: OrganizationChartProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const flowRef = useRef(null)
  const containerRef = useRef(null)

  // Function to create the node and edge structure
  const createNodesAndEdges = useCallback(() => {
    if (!data || !data.nodes || data.nodes.length === 0) {
      setIsLoading(false)
      return
    }

    const levels: Record<number, OrganizationMember[]> = {}

    // Group nodes by level
    data.nodes.forEach((node) => {
      if (!levels[node.level]) {
        levels[node.level] = []
      }
      levels[node.level].push(node)
    })

    const levelKeys = Object.keys(levels).map(Number).sort()
    const maxLevel = Math.max(...levelKeys)

    // Calculate positions for each node
    const flowNodes: Node[] = []
    const flowEdges: Edge[] = []

    levelKeys.forEach((level) => {
      const nodesInLevel = levels[level]
      const levelWidth = nodesInLevel.length

      nodesInLevel.forEach((node, index) => {
        // Calculate x position based on the number of nodes in this level
        const xPos = isMobile
          ? index * 220 // More spacing for mobile
          : ((index + 1) / (levelWidth + 1)) * (levelWidth <= 3 ? 1000 : levelWidth * 300)

        // Calculate y position based on level with more spacing for mobile
        const yPos = (level - 1) * (isMobile ? 250 : 200)

        // Create the node
        flowNodes.push({
          id: node.id,
          type: "orgNode",
          position: { x: xPos, y: yPos },
          data: node,
        })

        // Create edge to parent if it exists
        if (node.parentId) {
          flowEdges.push({
            id: `${node.parentId}-${node.id}`,
            source: node.parentId,
            target: node.id,
            type: "smoothstep",
            animated: false,
            style: { stroke: "#94a3b8", strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 15,
              height: 15,
              color: "#94a3b8",
            },
          })
        }
      })
    })

    setNodes(flowNodes)
    setEdges(flowEdges)
    setIsLoading(false)
  }, [data, isMobile, setNodes, setEdges])

  // Initialize nodes and edges when data changes
  useEffect(() => {
    setIsLoading(true)
    createNodesAndEdges()
  }, [data, createNodesAndEdges, isMobile])

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen()
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setIsFullscreen(false)
    }
  }, [isFullscreen])

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!document.fullscreenElement || !!document.webkitFullscreenElement || !!document.msFullscreenElement,
      )
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("msfullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("msfullscreenchange", handleFullscreenChange)
    }
  }, [])

  if (isLoading) {
    return (
      <Card className="p-6 flex items-center justify-center h-[400px]">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading organization chart...</div>
      </Card>
    )
  }

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <Card className="p-6 flex items-center justify-center h-[400px]">
        <div className="text-gray-500 dark:text-gray-400">No organization data available</div>
      </Card>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`${isFullscreen ? "fixed inset-0 z-50 bg-white dark:bg-gray-900" : "relative"} rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden`}
      style={{ height: isFullscreen ? "100vh" : isMobile ? "400px" : "600px" }}
    >
      <ReactFlowProvider>
        <ReactFlow
          ref={flowRef}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.5}
          maxZoom={1.5}
          defaultZoom={0.8}
          attributionPosition="bottom-right"
          connectionLineType={ConnectionLineType.SmoothStep}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#f1f5f9" gap={16} />
          <Controls showInteractive={false} />
          <Panel position="top-right" className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-white dark:bg-gray-800"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}

