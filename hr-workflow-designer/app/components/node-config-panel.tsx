"use client"

import type React from "react"
import { useWorkflowStore } from "@/app/store/workflow-store"
import { StartNodeConfig } from "./node-configs/start-node-config"
import { TaskNodeConfig } from "./node-configs/task-node-config"
import { ApprovalNodeConfig } from "./node-configs/approval-node-config"
import { AutomatedNodeConfig } from "./node-configs/automated-node-config"
import { EndNodeConfig } from "./node-configs/end-node-config"
import { X } from "lucide-react"

export const NodeConfigPanel: React.FC = () => {
  const { workflow, selectedNodeId, selectNode, deleteNode } = useWorkflowStore()

  const selectedNode = workflow.nodes.find((n) => n.id === selectedNodeId)

  if (!selectedNode) {
    return null
  }

  const handleDelete = () => {
    deleteNode(selectedNode.id)
    selectNode(null)
  }

  return (
    <div className="w-80 border-l border-slate-200 bg-white shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-slate-200 p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)} Configuration
          </h3>
          <p className="text-xs text-slate-500 mt-1">Configure this step's properties</p>
        </div>
        <button onClick={() => selectNode(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Config Forms */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedNode.type === "start" && <StartNodeConfig node={selectedNode} />}
        {selectedNode.type === "task" && <TaskNodeConfig node={selectedNode} />}
        {selectedNode.type === "approval" && <ApprovalNodeConfig node={selectedNode} />}
        {selectedNode.type === "automated" && <AutomatedNodeConfig node={selectedNode} />}
        {selectedNode.type === "end" && <EndNodeConfig node={selectedNode} />}
      </div>

      {/* Delete Button */}
      <div className="border-t border-slate-200 p-4">
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 text-sm font-medium text-red-600 border border-red-300 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          Delete Step
        </button>
      </div>
    </div>
  )
}
