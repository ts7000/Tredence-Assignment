"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { useWorkflowStore } from "@/app/store/workflow-store"
import type { WorkflowNode, ApprovalConfig } from "@/app/types"

interface ApprovalNodeConfigProps {
  node: WorkflowNode
}

export const ApprovalNodeConfig: React.FC<ApprovalNodeConfigProps> = ({ node }) => {
  const { updateNode } = useWorkflowStore()
  const config = node.config as ApprovalConfig

  const { register, handleSubmit, watch } = useForm<ApprovalConfig>({
    defaultValues: config,
  })

  React.useEffect(() => {
    const subscription = watch((values) => {
      updateNode(node.id, {
        config: values as ApprovalConfig,
        label: values.title || "Approval",
      })
    })
    return () => subscription.unsubscribe()
  }, [watch, updateNode, node.id])

  return (
    <form onSubmit={handleSubmit(() => {})} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Step Title</label>
        <input
          type="text"
          placeholder="e.g., Manager Approval"
          {...register("title", { required: "Title is required" })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Approver Role</label>
        <select
          {...register("approverRole")}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
        >
          <option value="">Select who approves</option>
          <option value="manager">Manager</option>
          <option value="hr-lead">HR Lead</option>
          <option value="director">Director</option>
          <option value="cfo">CFO</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Auto-Approval Threshold</label>
        <input
          type="number"
          placeholder="e.g., 5000"
          {...register("autoApprovalThreshold", { min: 0 })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
        />
        <p className="text-xs text-slate-500 mt-1">Leave blank for no auto-approval</p>
      </div>
    </form>
  )
}
