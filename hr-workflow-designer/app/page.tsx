"use client"

import { useState, useCallback } from "react"
import { useWorkflowStore } from "@/app/store/workflow-store"
import { WorkflowCanvas } from "@/app/components/workflow-canvas"
import { NodeConfigPanel } from "@/app/components/node-config-panel"
import { Sidebar } from "@/app/components/sidebar"
import { TopBar } from "@/app/components/top-bar"
import { TemplatesPanel } from "@/app/components/templates-panel"
import { SimulationPanel } from "@/app/components/simulation-panel"
import { validateWorkflow } from "@/app/utils/validation"
import { serializeWorkflow } from "@/app/utils/serialization"
import { calculateHierarchicalLayout } from "@/app/utils/layout"
import { useExportImport } from "@/app/hooks/use-export-import"
import type { NodeType } from "@/app/types"
import { Toast } from "@/app/components/toast"

export default function Home() {
  const { workflow, setValidationErrors, validationErrors, updateNode } = useWorkflowStore()
  const { exportWorkflow, importWorkflow } = useExportImport()
  const [draggedNodeType, setDraggedNodeType] = useState<NodeType | null>(null)
  const [showSimulation, setShowSimulation] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const handleNodeDragStart = useCallback((type: NodeType) => {
    setDraggedNodeType(type)
  }, [])

  const handleValidate = useCallback(() => {
    const errors = validateWorkflow(workflow)
    setValidationErrors(errors)

    if (errors.length === 0) {
      setToast({ message: "Workflow is valid!", type: "success" })
    } else {
      setToast({
        message: `Found ${errors.length} issue(s) in your workflow`,
        type: "error",
      })
    }

    setTimeout(() => setToast(null), 4000)
  }, [workflow, setValidationErrors])

  const handleSave = useCallback(() => {
    const serialized = serializeWorkflow(workflow)
    const blob = new Blob([serialized], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "workflow.json"
    a.click()

    setToast({ message: "Workflow saved!", type: "success" })
    setTimeout(() => setToast(null), 4000)
  }, [workflow])

  const handleExport = useCallback(() => {
    try {
      exportWorkflow()
      setToast({ message: "Workflow exported successfully!", type: "success" })
      setTimeout(() => setToast(null), 4000)
    } catch (error) {
      setToast({ message: "Failed to export workflow", type: "error" })
      setTimeout(() => setToast(null), 4000)
    }
  }, [exportWorkflow])

  const handleImport = useCallback(() => {
    importWorkflow(
      () => {
        setToast({ message: "Workflow imported successfully!", type: "success" })
        setTimeout(() => setToast(null), 4000)
      },
      (error) => {
        setToast({ message: `Import failed: ${error}`, type: "error" })
        setTimeout(() => setToast(null), 4000)
      }
    )
  }, [importWorkflow])

  const handleLayout = useCallback(() => {
    try {
      const layoutedNodes = calculateHierarchicalLayout(workflow.nodes, workflow.edges)
      layoutedNodes.forEach((node) => {
        updateNode(node.id, { position: node.position })
      })
      setToast({ message: "Layout applied successfully!", type: "success" })
      setTimeout(() => setToast(null), 4000)
    } catch (error) {
      setToast({ message: "Failed to apply layout", type: "error" })
      setTimeout(() => setToast(null), 4000)
    }
  }, [workflow.nodes, workflow.edges, updateNode])


  const handleSimulate = useCallback(() => {
    setShowSimulation(true)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Bar */}
      <TopBar
        onSave={handleSave}
        onValidate={handleValidate}
        onExport={handleExport}
        onImport={handleImport}
        onLayout={handleLayout}
        validationErrorCount={validationErrors.length}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar / Templates */}
        {showTemplates ? (
          <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <button
                onClick={() => setShowTemplates(false)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                ← Back to Nodes
              </button>
            </div>
            <TemplatesPanel onTemplateSelect={() => setShowTemplates(false)} />
          </div>
        ) : (
          <Sidebar
            onNodeDragStart={handleNodeDragStart}
            onSimulate={handleSimulate}
            onShowTemplates={() => setShowTemplates(true)}
          />
        )}

        {/* Canvas */}
        <div className="flex-1 flex overflow-hidden">
          <WorkflowCanvas />

          {/* Config Panel */}
          <NodeConfigPanel />
        </div>
      </div>

      {/* Validation Errors Banner */}
      {validationErrors.length > 0 && (
        <div className="border-t border-red-200 bg-red-50 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-red-900">Workflow Issues</h3>
              <div className="mt-2 space-y-1">
                {validationErrors.slice(0, 3).map((error, idx) => (
                  <p key={idx} className="text-sm text-red-800">
                    • {error.message}
                  </p>
                ))}
                {validationErrors.length > 3 && (
                  <p className="text-sm text-red-800">• And {validationErrors.length - 3} more issue(s)</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulation Panel */}
      <SimulationPanel isOpen={showSimulation} onClose={() => setShowSimulation(false)} />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
