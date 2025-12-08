"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useWorkflowStore } from "@/app/store/workflow-store"
import type { WorkflowNode, AutomatedConfig, Automation } from "@/app/types"
import { getAutomations } from "@/app/api/automations"

interface AutomatedNodeConfigProps {
  node: WorkflowNode
}

export const AutomatedNodeConfig: React.FC<AutomatedNodeConfigProps> = ({ node }) => {
  const { updateNode } = useWorkflowStore()
  const config = node.config as AutomatedConfig
  const [automations, setAutomations] = useState<Automation[]>([])

  const { register, handleSubmit, watch } = useForm<AutomatedConfig>({
    defaultValues: config,
  })

  const automationType = watch("automationType")
  const selectedAutomation = automations.find((a) => a.id === automationType)

  useEffect(() => {
    getAutomations().then(setAutomations)
  }, [])

  React.useEffect(() => {
    const subscription = watch((values) => {
      updateNode(node.id, {
        config: values as AutomatedConfig,
        label: values.stepName || "Automated",
      })
    })
    return () => subscription.unsubscribe()
  }, [watch, updateNode, node.id])

  return (
    <form onSubmit={handleSubmit(() => {})} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Step Name</label>
        <input
          type="text"
          placeholder="e.g., Send Welcome Email"
          {...register("stepName", { required: "Step name is required" })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Automation Type</label>
        <select
          {...register("automationType")}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
        >
          <option value="">Select an automation</option>
          {automations.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        {selectedAutomation && <p className="text-xs text-slate-500 mt-1">{selectedAutomation.description}</p>}
      </div>

      {selectedAutomation && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className="text-xs font-medium text-slate-700 mb-3">Parameters Required:</p>
          {selectedAutomation.requiredParams.map((param) => (
            <div key={param} className="mb-3">
              <label className="block text-xs font-medium text-slate-600 mb-1 capitalize">{param}</label>
              <input
                type="text"
                placeholder={`Enter ${param}...`}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              />
            </div>
          ))}
        </div>
      )}
    </form>
  )
}
