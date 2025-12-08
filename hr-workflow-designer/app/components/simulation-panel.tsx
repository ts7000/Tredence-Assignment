"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useWorkflowStore } from "@/app/store/workflow-store"
import type { SimulationResult } from "@/app/types"
import { simulateWorkflow } from "@/app/api/simulation"
import { X, CheckCircle, AlertCircle } from "lucide-react"

interface SimulationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({ isOpen, onClose }) => {
  const { workflow } = useWorkflowStore()
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && !result) {
      runSimulation()
    }
  }, [isOpen])

  const runSimulation = async () => {
    setLoading(true)
    try {
      const simResult = await simulateWorkflow(workflow)
      setResult(simResult)
    } catch (error) {
      setResult({
        status: "error",
        steps: [],
        errors: [{ type: "SIMULATION_ERROR", message: "Failed to simulate workflow" }],
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-auto">
        {/* Header */}
        <div className="border-b border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Workflow Simulation</h2>
            <p className="text-sm text-slate-600 mt-1">Testing how your workflow would execute</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
                <p className="text-slate-600">Simulating workflow...</p>
              </div>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-6">
              {/* Status */}
              <div
                className={`p-4 rounded-lg border-2 flex items-center gap-3 ${
                  result.status === "success" ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
                }`}
              >
                {result.status === "success" ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <p className={`font-bold ${result.status === "success" ? "text-green-900" : "text-red-900"}`}>
                    {result.status === "success" ? "Workflow Simulation Successful!" : "Workflow Has Issues"}
                  </p>
                  {result.status === "error" && result.errors && result.errors.length > 0 && (
                    <p className="text-sm text-red-800 mt-1">{result.errors[0].message}</p>
                  )}
                </div>
              </div>

              {/* Errors */}
              {result.errors && result.errors.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Issues Found:</h3>
                  <div className="space-y-2">
                    {result.errors.map((error, idx) => (
                      <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-900">{error.message}</p>
                        {error.nodeId && <p className="text-xs text-red-700 mt-1">Step ID: {error.nodeId}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Execution Steps */}
              {result.steps && result.steps.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Execution Flow:</h3>
                  <div className="space-y-2">
                    {result.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-slate-700 pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {result.warnings && result.warnings.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Warnings:</h3>
                  <div className="space-y-2">
                    {result.warnings.map((warning, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-900">{warning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 flex justify-end gap-3">
          <button
            onClick={runSimulation}
            className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Re-run Simulation
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
