"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"
import { useWorkflowStore } from "@/app/store/workflow-store"
import type { WorkflowNode, NodeType } from "@/app/types"
import { WorkflowNodeComponent } from "./workflow-node"
import { useAutoId } from "@/app/hooks/use-auto-id"

export const WorkflowCanvas: React.FC = () => {
  const { workflow, addNode, updateNode, addEdge, selectNode, deleteEdge } = useWorkflowStore()
  const [connecting, setConnecting] = useState<{
    from: string
    x: number
    y: number
    currentX: number
    currentY: number
  } | null>(null)
  const canvasRef = React.useRef<HTMLDivElement>(null)
  const generateId = useAutoId()
  const isMouseDownRef = useRef(false)
  const connectingStartTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const handleGlobalMouseDown = () => {
      isMouseDownRef.current = true
      connectingStartTimeRef.current = Date.now()
    }

    const handleGlobalMouseUp = () => {
      isMouseDownRef.current = false
      const holdTime = connectingStartTimeRef.current ? Date.now() - connectingStartTimeRef.current : 0
      if (holdTime > 50) {
        console.log("[v0] Global mouseup - clearing connection after", holdTime, "ms")
        setConnecting(null)
      }
      connectingStartTimeRef.current = null
    }

    window.addEventListener("mousedown", handleGlobalMouseDown)
    window.addEventListener("mouseup", handleGlobalMouseUp)
    return () => {
      window.removeEventListener("mousedown", handleGlobalMouseDown)
      window.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [])

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (connecting) {
        setConnecting((prev) =>
          prev
            ? {
                ...prev,
                currentX: e.clientX,
                currentY: e.clientY,
              }
            : null,
        )
      }
    },
    [connecting],
  )

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const nodeTypeStr = e.dataTransfer.getData("nodeType")

    if (!nodeTypeStr || !canvasRef.current) {
      return
    }

    const nodeType = nodeTypeStr as NodeType

    const rect = canvasRef.current.getBoundingClientRect()
    const randomOffsetX = Math.random() * 100 - 50
    const randomOffsetY = Math.random() * 100 - 50
    const x = e.clientX - rect.left + randomOffsetX
    const y = e.clientY - rect.top + randomOffsetY

    const newNode: WorkflowNode = {
      id: generateId(nodeType),
      type: nodeType,
      label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
      config:
        nodeType === "start"
          ? { title: "", description: "" }
          : nodeType === "end"
            ? { message: "" }
            : nodeType === "task"
              ? { title: "", description: "" }
              : nodeType === "approval"
                ? { title: "" }
                : { stepName: "" },
      position: { x: Math.max(0, x), y: Math.max(0, y) },
    }

    addNode(newNode)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleNodeDragStart = (nodeId: string, e: React.DragEvent) => {
    e.dataTransfer!.effectAllowed = "move"
    e.dataTransfer!.setData("movingNodeId", nodeId)
  }

  const handleNodeDragEnd = (nodeId: string, x: number, y: number) => {
    updateNode(nodeId, {
      position: {
        x: Math.max(0, x),
        y: Math.max(0, y),
      },
    })
  }

  const handleConnectionStart = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("[v0] Starting connection from node", nodeId)
    const node = workflow.nodes.find((n) => n.id === nodeId)
    if (!node) return

    const nodeElement = (e.currentTarget as HTMLElement).closest(".workflow-node")
    if (!nodeElement) return

    const nodeRect = nodeElement.getBoundingClientRect()
    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return

    const startX = nodeRect.left - canvasRect.left + nodeRect.width / 2
    const startY = nodeRect.top - canvasRect.top + nodeRect.height / 2

    setConnecting({
      from: nodeId,
      x: startX,
      y: startY,
      currentX: e.clientX,
      currentY: e.clientY,
    })
  }

  const handleConnectionEnd = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (!connecting) {
      console.log("[v0] No connecting state")
      return
    }

    if (connecting.from === nodeId) {
      console.log("[v0] Cannot connect node to itself")
      setConnecting(null)
      return
    }

    const targetNode = workflow.nodes.find((n) => n.id === nodeId)
    if (!targetNode || targetNode.type === "start") {
      console.log("[v0] Invalid target node")
      setConnecting(null)
      return
    }

    const sourceNode = workflow.nodes.find((n) => n.id === connecting.from)
    if (!sourceNode || sourceNode.type === "end") {
      console.log("[v0] Invalid source node")
      setConnecting(null)
      return
    }

    console.log("[v0] Creating connection from", connecting.from, "to", nodeId)

    const edgeId = `edge-${connecting.from}-${nodeId}`
    addEdge({
      id: edgeId,
      source: connecting.from,
      target: nodeId,
    })
    setConnecting(null)
  }

  const handleEdgeClick = (edgeId: string) => {
    deleteEdge(edgeId)
  }

  return (
    <div
      ref={canvasRef}
      onDrop={handleCanvasDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleCanvasMouseMove}
      className="workflow-canvas relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto"
      style={{ userSelect: "none" }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.5 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(203, 213, 225)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <svg className="absolute inset-0 w-full h-full pointer-events-auto">
        {workflow.edges.map((edge) => {
          const sourceNode = workflow.nodes.find((n) => n.id === edge.source)
          const targetNode = workflow.nodes.find((n) => n.id === edge.target)
          if (!sourceNode || !targetNode) return null

          const x1 = sourceNode.position.x + 64
          const y1 = sourceNode.position.y + 60
          const x2 = targetNode.position.x + 64
          const y2 = targetNode.position.y + 10

          return (
            <g key={edge.id} onClick={() => handleEdgeClick(edge.id)} style={{ cursor: "pointer" }}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#94a3b8"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                className="hover:stroke-red-500 transition-colors"
              />
            </g>
          )
        })}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#94a3b8" />
          </marker>
        </defs>
      </svg>

      {connecting && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line
            x1={connecting.x}
            y1={connecting.y}
            x2={connecting.currentX - (canvasRef.current?.getBoundingClientRect().left || 0)}
            y2={connecting.currentY - (canvasRef.current?.getBoundingClientRect().top || 0)}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
      )}

      <div className="absolute inset-0">
        {workflow.nodes.map((node) => (
          <WorkflowNodeComponent
            key={node.id}
            node={node}
            isSelected={node.id === workflow.selectedNodeId}
            onSelect={() => selectNode(node.id)}
            onNodeDragStart={handleNodeDragStart}
            onNodeDragEnd={handleNodeDragEnd}
            onConnectionStart={handleConnectionStart}
            onConnectionEnd={handleConnectionEnd}
          />
        ))}
      </div>

      {workflow.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-slate-400">
            <p className="text-lg font-medium">Drag steps from the sidebar to get started</p>
            <p className="text-sm mt-2">Build your HR workflow on this canvas</p>
          </div>
        </div>
      )}
    </div>
  )
}
