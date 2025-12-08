"use client"

import React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { useWorkflowStore } from "@/app/store/workflow-store"
import type { WorkflowNode, TaskConfig } from "@/app/types"

interface TaskNodeConfigProps {
  node: WorkflowNode
}

export const TaskNodeConfig: React.FC<TaskNodeConfigProps> = ({ node }) => {
  const { updateNode } = useWorkflowStore()
  const config = node.config as TaskConfig

  const { register, handleSubmit, watch, control } = useForm<TaskConfig>({
    defaultValues: config,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customFields",
  })

  const title = watch("title")

  React.useEffect(() => {
    const subscription = watch((values) => {
      updateNode(node.id, {
        config: values as TaskConfig,
        label: values.title || "Task",
      })
    })
    return () => subscription.unsubscribe()
  }, [watch, updateNode, node.id])

  return (
    <form onSubmit={handleSubmit(() => {})} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
        <input
          type="text"
          placeholder="e.g., Collect Documents"
          {...register("title", { required: "Task title is required" })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          placeholder="What should happen in this step?"
          {...register("description")}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none resize-none"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Who is Responsible?</label>
        <select
          {...register("assignee")}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
        >
          <option value="">Select an assignee</option>
          <option value="hr">HR Team</option>
          <option value="hiring-manager">Hiring Manager</option>
          <option value="employee">Employee</option>
          <option value="it">IT Department</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Due Date (Days)</label>
        <input
          type="number"
          placeholder="e.g., 3"
          {...register("dueDays", { min: 1 })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
        />
        <p className="text-xs text-slate-500 mt-1">How many days should this task take?</p>
      </div>
    </form>
  )
}
