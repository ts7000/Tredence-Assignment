"use client"

import type React from "react"
import type { NodeType } from "@/app/types"
import { Play, Plus, Zap } from "lucide-react"

interface SidebarProps {
  onNodeDragStart: (type: NodeType) => void
  onSimulate: () => void
  onShowTemplates?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onNodeDragStart, onSimulate, onShowTemplates }) => {
  const nodeTypes: Array<{ type: NodeType; label: string; description: string }> = [
    { type: "start", label: "Start", description: "Begin your workflow" },
    { type: "task", label: "Task", description: "Manual step for someone" },
    { type: "approval", label: "Approval", description: "Decision point" },
    { type: "automated", label: "Automated", description: "System action" },
    { type: "end", label: "End", description: "Workflow completion" },
  ]

  const handleDragStart = (type: NodeType, e: React.DragEvent) => {
    e.dataTransfer.setData("nodeType", type)
    e.dataTransfer.effectAllowed = "move"
    onNodeDragStart(type)
  }

  return (
    <div className="w-64 border-r border-slate-200 bg-white shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-slate-200 p-4">
        <h2 className="font-bold text-slate-900">Workflow Steps</h2>
        <p className="text-xs text-slate-500 mt-1">Drag steps onto the canvas</p>
      </div>

      {/* Node Palette */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.type}
            draggable
            onDragStart={(e) => handleDragStart(nodeType.type, e)}
            className="p-3 border-2 border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:border-slate-300"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-slate-600" />
              <div className="flex-1">
                <div className="font-medium text-slate-900 text-sm">{nodeType.label}</div>
                <div className="text-xs text-slate-500">{nodeType.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Templates Button */}
      {onShowTemplates && (
        <div className="border-t border-slate-200 p-4">
          <button
            onClick={onShowTemplates}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Templates
          </button>
        </div>
      )}

      {/* Simulate Button */}
      <div className={onShowTemplates ? "border-t border-slate-200 p-4" : "border-t border-slate-200 p-4"}>
        <button
          onClick={onSimulate}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Play className="w-4 h-4" />
          Simulate Workflow
        </button>
      </div>

      {/* Help Text */}
      <div className="border-t border-slate-200 p-4 bg-blue-50">
        <p className="text-xs text-blue-900 leading-relaxed">
          <span className="font-medium">Tip:</span> Connect all steps to create a valid workflow. Every step except
          Start must have an input connection.
        </p>
      </div>
    </div>
  )
}
