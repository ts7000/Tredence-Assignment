"use client"

import type React from "react"
import { useWorkflowStore } from "@/app/store/workflow-store"
import type { WorkflowNode, WorkflowEdge } from "@/app/types"

// Simple ID generator function
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

interface Template {
  id: string
  name: string
  description: string
  icon: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

const TEMPLATES: Template[] = [
  {
    id: "basic-approval",
    name: "Basic Approval Flow",
    description: "Start → Approval → End",
    icon: "✓",
    nodes: [
      {
        id: "start-1",
        type: "start",
        label: "Start",
        position: { x: 50, y: 150 },
        config: {
          title: "Request Initiated",
          description: "Process starts here",
        },
      },
      {
        id: "approval-1",
        type: "approval",
        label: "Approval",
        position: { x: 300, y: 150 },
        config: {
          title: "Manager Approval",
          approverRole: "Manager",
        },
      },
      {
        id: "end-1",
        type: "end",
        label: "End",
        position: { x: 550, y: 150 },
        config: {
          message: "Request processed",
          showSummary: true,
        },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "start-1",
        target: "approval-1",
      },
      {
        id: "edge-2",
        source: "approval-1",
        target: "end-1",
      },
    ],
  },
  {
    id: "task-approval",
    name: "Task + Approval Pair",
    description: "Start → Task → Approval → End",
    icon: "📋",
    nodes: [
      {
        id: "start-2",
        type: "start",
        label: "Start",
        position: { x: 50, y: 150 },
        config: {
          title: "Request Initiated",
        },
      },
      {
        id: "task-1",
        type: "task",
        label: "Task",
        position: { x: 250, y: 150 },
        config: {
          title: "Complete Task",
          assignee: "Team Member",
          dueDays: 3,
        },
      },
      {
        id: "approval-2",
        type: "approval",
        label: "Approval",
        position: { x: 450, y: 150 },
        config: {
          title: "Manager Review",
          approverRole: "Manager",
        },
      },
      {
        id: "end-2",
        type: "end",
        label: "End",
        position: { x: 650, y: 150 },
        config: {
          message: "Task completed and approved",
        },
      },
    ],
    edges: [
      {
        id: "edge-3",
        source: "start-2",
        target: "task-1",
      },
      {
        id: "edge-4",
        source: "task-1",
        target: "approval-2",
      },
      {
        id: "edge-5",
        source: "approval-2",
        target: "end-2",
      },
    ],
  },
  {
    id: "employee-onboarding",
    name: "Employee Onboarding",
    description: "Complete HR onboarding workflow",
    icon: "👥",
    nodes: [
      {
        id: "start-3",
        type: "start",
        label: "Start",
        position: { x: 50, y: 150 },
        config: {
          title: "New Hire Onboarding",
          description: "Begin employee onboarding process",
        },
      },
      {
        id: "task-2",
        type: "task",
        label: "HR Setup",
        position: { x: 250, y: 100 },
        config: {
          title: "HR Documentation",
          assignee: "HR Team",
          dueDays: 1,
        },
      },
      {
        id: "task-3",
        type: "task",
        label: "IT Setup",
        position: { x: 250, y: 200 },
        config: {
          title: "IT Equipment & Access",
          assignee: "IT Team",
          dueDays: 1,
        },
      },
      {
        id: "approval-3",
        type: "approval",
        label: "Manager Review",
        position: { x: 450, y: 150 },
        config: {
          title: "Onboarding Confirmation",
          approverRole: "Department Manager",
        },
      },
      {
        id: "end-3",
        type: "end",
        label: "End",
        position: { x: 650, y: 150 },
        config: {
          message: "Employee onboarding complete",
          showSummary: true,
        },
      },
    ],
    edges: [
      {
        id: "edge-6",
        source: "start-3",
        target: "task-2",
      },
      {
        id: "edge-7",
        source: "start-3",
        target: "task-3",
      },
      {
        id: "edge-8",
        source: "task-2",
        target: "approval-3",
      },
      {
        id: "edge-9",
        source: "task-3",
        target: "approval-3",
      },
      {
        id: "edge-10",
        source: "approval-3",
        target: "end-3",
      },
    ],
  },
  {
    id: "leave-request",
    name: "Leave Request",
    description: "Request → Approval → Notification",
    icon: "📅",
    nodes: [
      {
        id: "start-4",
        type: "start",
        label: "Start",
        position: { x: 50, y: 150 },
        config: {
          title: "Leave Request Submitted",
        },
      },
      {
        id: "approval-4",
        type: "approval",
        label: "Manager Approval",
        position: { x: 300, y: 150 },
        config: {
          title: "Manager Review Leave Request",
          approverRole: "Manager",
        },
      },
      {
        id: "automated-1",
        type: "automated",
        label: "Send Notification",
        position: { x: 550, y: 150 },
        config: {
          stepName: "Send Approval Notification",
          automationType: "email",
          parameters: {
            template: "leave_approval",
          },
        },
      },
      {
        id: "end-4",
        type: "end",
        label: "End",
        position: { x: 800, y: 150 },
        config: {
          message: "Leave request processed",
        },
      },
    ],
    edges: [
      {
        id: "edge-11",
        source: "start-4",
        target: "approval-4",
      },
      {
        id: "edge-12",
        source: "approval-4",
        target: "automated-1",
      },
      {
        id: "edge-13",
        source: "automated-1",
        target: "end-4",
      },
    ],
  },
]

interface TemplatesPanelProps {
  onTemplateSelect?: (template: Template) => void
}

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({ onTemplateSelect }) => {
  const { setWorkflow, resetWorkflow } = useWorkflowStore()

  const handleTemplateClick = (template: Template) => {
    resetWorkflow()
    const newWorkflow = {
      id: generateId(),
      nodes: template.nodes.map((node) => ({
        ...node,
        id: generateId(),
      })),
      edges: template.edges.map((edge, idx) => ({
        ...edge,
        id: generateId(),
      })),
    }
    setWorkflow(newWorkflow)
    onTemplateSelect?.(template)
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Templates</h2>
        <p className="text-sm text-slate-600 mt-1">Start with a pre-built workflow template</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-1 gap-3">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className="flex items-start gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors text-left cursor-pointer"
            >
              <div className="text-2xl mt-1">{template.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{template.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{template.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
