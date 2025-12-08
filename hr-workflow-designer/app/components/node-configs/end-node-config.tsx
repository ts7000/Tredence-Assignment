"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { useWorkflowStore } from "@/app/store/workflow-store"
import type { WorkflowNode, EndConfig } from "@/app/types"

interface EndNodeConfigProps {
  node: WorkflowNode
}

export const EndNodeConfig: React.FC<EndNodeConfigProps> = ({ node }) => {
  const { updateNode } = useWorkflowStore()
  const config = node.config as EndConfig

  const { register, handleSubmit, watch } = useForm<EndConfig>({
    defaultValues: config,
  })

  React.useEffect(() => {
    const subscription = watch((values) => {
      updateNode(node.id, {
        config: values as EndConfig,
        label: "End",
      })
    })
    return () => subscription.unsubscribe()
  }, [watch, updateNode, node.id])

  return (
    <form onSubmit={handleSubmit(() => {})} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">End Message</label>
        <textarea
          placeholder="e.g., Onboarding completed successfully!"
          {...register("message")}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none resize-none"
          rows={3}
        />
        <p className="text-xs text-slate-500 mt-1">What message should show when the workflow completes?</p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("showSummary")}
          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-400"
        />
        <label className="ml-2 text-sm font-medium text-slate-700">Show workflow summary</label>
      </div>
    </form>
  )
}
