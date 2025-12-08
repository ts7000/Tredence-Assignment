import { create } from "zustand"
import type { Workflow, WorkflowNode, WorkflowEdge, ValidationError } from "@/app/types"

interface WorkflowStore {
  workflow: Workflow
  selectedNodeId: string | null
  validationErrors: ValidationError[]

  // Node operations
  addNode: (node: WorkflowNode) => void
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void
  deleteNode: (id: string) => void
  selectNode: (id: string | null) => void

  // Edge operations
  addEdge: (edge: WorkflowEdge) => void
  deleteEdge: (id: string) => void

  // Workflow operations
  setWorkflow: (workflow: Workflow) => void
  setValidationErrors: (errors: ValidationError[]) => void
  resetWorkflow: () => void
}

const initialWorkflow: Workflow = {
  id: "workflow-1",
  nodes: [],
  edges: [],
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  workflow: initialWorkflow,
  selectedNodeId: null,
  validationErrors: [],

  addNode: (node) =>
    set((state) => ({
      workflow: {
        ...state.workflow,
        nodes: [...state.workflow.nodes, node],
      },
    })),

  updateNode: (id, updates) =>
    set((state) => ({
      workflow: {
        ...state.workflow,
        nodes: state.workflow.nodes.map((node) => (node.id === id ? { ...node, ...updates } : node)),
      },
    })),

  deleteNode: (id) =>
    set((state) => ({
      workflow: {
        ...state.workflow,
        nodes: state.workflow.nodes.filter((node) => node.id !== id),
        edges: state.workflow.edges.filter((edge) => edge.source !== id && edge.target !== id),
      },
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    })),

  selectNode: (id) =>
    set(() => ({
      selectedNodeId: id,
    })),

  addEdge: (edge) =>
    set((state) => {
      // Prevent duplicate edges
      const exists = state.workflow.edges.some((e) => e.source === edge.source && e.target === edge.target)
      if (exists) return state

      return {
        workflow: {
          ...state.workflow,
          edges: [...state.workflow.edges, edge],
        },
      }
    }),

  deleteEdge: (id) =>
    set((state) => ({
      workflow: {
        ...state.workflow,
        edges: state.workflow.edges.filter((edge) => edge.id !== id),
      },
    })),

  setWorkflow: (workflow) =>
    set(() => ({
      workflow,
    })),

  setValidationErrors: (errors) =>
    set(() => ({
      validationErrors: errors,
    })),

  resetWorkflow: () =>
    set(() => ({
      workflow: initialWorkflow,
      selectedNodeId: null,
      validationErrors: [],
    })),
}))
