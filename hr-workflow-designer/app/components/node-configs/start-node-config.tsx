"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { useWorkflowStore } from "@/app/store/workflow-store"
import type { WorkflowNode, StartConfig } from "@/app/types"

interface StartNodeConfigProps {
  node: WorkflowNode
}

export const StartNodeConfig: React.FC<StartNodeConfigProps> = ({ node }) => {
  const { updateNode } = useWorkflowStore()
  const config = node.config as StartConfig

  const { register, handleSubmit, watch } = useForm<StartConfig>({
    defaultValues: config,
  })

  const title = watch("title")

  React.useEffect(() => {
    const subscription = watch((values) => {
      updateNode(node.id, {
        config: values as StartConfig,
        label: values.title || "Start",
      })
    })
    return () => subscription.unsubscribe()
  }, [watch, updateNode, node.id])

  return (
    <form onSubmit={handleSubmit(() => {})} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Workflow Title</label>
        <input
          type="text"
          placeholder="e.g., New Employee Onboarding"
          {...register("title", { required: "Workflow title is required" })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
        />
        <p className="text-xs text-slate-500 mt-1">What is the name of this workflow?</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          placeholder="Describe what this workflow does..."
          {...register("description")}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none resize-none"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Tags (optional)</label>
        <input
          type="text"
          placeholder="e.g., onboarding, hr, critical"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
        />
        <p className="text-xs text-slate-500 mt-1">Separate tags with commas</p>
      </div>
    </form>
  )
}
