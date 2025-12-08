"use client"

import type React from "react"
import type { WorkflowNode } from "@/app/types"
import { getNodeColor, getNodeTextColor } from "@/app/utils/validation"

interface WorkflowNodeComponentProps {
  node: WorkflowNode
  isSelected: boolean
  onSelect: () => void
  onNodeDragStart: (nodeId: string, e: React.DragEvent) => void
  onNodeDragEnd: (nodeId: string, x: number, y: number) => void
  onConnectionStart: (nodeId: string, e: React.MouseEvent) => void
  onConnectionEnd: (nodeId: string, e: React.MouseEvent) => void
}

export const WorkflowNodeComponent: React.FC<WorkflowNodeComponentProps> = ({
  node,
  isSelected,
  onSelect,
  onNodeDragStart,
  onNodeDragEnd,
  onConnectionStart,
  onConnectionEnd,
}) => {
  const displayLabel = node.config && "title" in node.config ? node.config.title || node.label : node.label
  const displayLabel2 =
    node.config && "stepName" in node.config
      ? node.config.stepName || node.label
      : node.config && "message" in node.config
        ? node.config.message || node.label
        : displayLabel

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()
    onNodeDragStart(node.id, e)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault()
    const canvasElement = (e.currentTarget as HTMLElement).closest(".workflow-canvas")
    if (!canvasElement) return

    const rect = canvasElement.getBoundingClientRect()
    const x = e.clientX - rect.left - 64
    const y = e.clientY - rect.top - 32

    onNodeDragEnd(node.id, x, y)
  }

  const handleOutputMouseDown = (e: React.MouseEvent) => {
    console.log("[v0] Output port clicked on node", node.id)
    e.stopPropagation()
    e.preventDefault()
    onConnectionStart(node.id, e)
  }

  const handleInputMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    console.log("[v0] Input port released on node", node.id)
    onConnectionEnd(node.id, e)
  }

  const handleInputMouseOver = (e: React.MouseEvent) => {
    e.currentTarget.classList.add("scale-150")
  }

  const handleInputMouseLeave = (e: React.MouseEvent) => {
    e.currentTarget.classList.remove("scale-150")
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`absolute w-32 cursor-pointer transform transition-all ${getNodeColor(node.type)} border-2 rounded-lg p-3 shadow-md hover:shadow-lg hover:scale-105 workflow-node ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
      }}
      onClick={onSelect}
    >
      {/* Node Header */}
      <div className={`text-xs font-bold ${getNodeTextColor(node.type)} uppercase tracking-wide mb-1`}>
        {node.type === "automated" ? "Automated" : node.type === "approval" ? "Approval" : node.type}
      </div>

      {/* Node Title */}
      <div className={`text-sm font-semibold ${getNodeTextColor(node.type)} truncate text-balance`}>
        {displayLabel2 || node.label}
      </div>

      {/* Connection Handle - Output */}
      {node.type !== "end" && (
        <button
          onMouseDown={handleOutputMouseDown}
          className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-2 border-blue-400 rounded-full hover:bg-blue-50 transition-all hover:scale-125 cursor-pointer"
          title="Click and drag to connect to another step"
        />
      )}

      {/* Connection Handle - Input */}
      {node.type !== "start" && (
        <div
          onMouseUp={handleInputMouseUp}
          onMouseOver={handleInputMouseOver}
          onMouseLeave={handleInputMouseLeave}
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-2 border-green-400 rounded-full cursor-pointer hover:scale-125 transition-transform"
        />
      )}
    </div>
  )
}
