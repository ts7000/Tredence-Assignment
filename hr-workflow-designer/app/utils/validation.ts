import type { Workflow, ValidationError, NodeType } from "@/app/types"

export const validateWorkflow = (workflow: Workflow): ValidationError[] => {
  const errors: ValidationError[] = []

  // Check if there's exactly one start node
  const startNodes = workflow.nodes.filter((n) => n.type === "start")
  if (startNodes.length === 0) {
    errors.push({ type: "MISSING_START", message: "Workflow must have a Start step." })
  }
  if (startNodes.length > 1) {
    errors.push({ type: "MULTIPLE_STARTS", message: "Workflow can only have one Start step." })
  }

  // Check if there's at least one end node
  const endNodes = workflow.nodes.filter((n) => n.type === "end")
  if (endNodes.length === 0) {
    errors.push({ type: "MISSING_END", message: "Workflow must have at least one End step." })
  }

  // Validate node connectivity
  const incomingEdges = new Map<string, number>()
  const outgoingEdges = new Map<string, number>()

  workflow.edges.forEach((edge) => {
    incomingEdges.set(edge.target, (incomingEdges.get(edge.target) || 0) + 1)
    outgoingEdges.set(edge.source, (outgoingEdges.get(edge.source) || 0) + 1)
  })

  // Start node should have no incoming edges
  startNodes.forEach((node) => {
    if (incomingEdges.get(node.id) || 0 > 0) {
      errors.push({
        type: "INVALID_START_CONNECTION",
        message: "Start step cannot have incoming connections.",
        nodeId: node.id,
      })
    }
    if ((outgoingEdges.get(node.id) || 0) === 0) {
      errors.push({
        type: "DISCONNECTED_START",
        message: "Start step must connect to at least one other step.",
        nodeId: node.id,
      })
    }
  })

  // End node should have no outgoing edges
  endNodes.forEach((node) => {
    if ((outgoingEdges.get(node.id) || 0) > 0) {
      errors.push({
        type: "INVALID_END_CONNECTION",
        message: "End step cannot have outgoing connections.",
        nodeId: node.id,
      })
    }
  })

  // Every node except start should have at least one incoming edge
  workflow.nodes.forEach((node) => {
    if (node.type !== "start" && (incomingEdges.get(node.id) || 0) === 0) {
      errors.push({
        type: "UNCONNECTED_NODE",
        message: `The "${node.label}" step is not connected to the workflow.`,
        nodeId: node.id,
      })
    }
  })

  // Detect cycles using DFS
  if (hasCycle(workflow)) {
    errors.push({ type: "CYCLE_DETECTED", message: "Workflow contains a loop. HR workflows should not cycle back." })
  }

  return errors
}

const hasCycle = (workflow: Workflow): boolean => {
  const adjList = new Map<string, string[]>()
  const visited = new Set<string>()
  const recStack = new Set<string>()

  workflow.nodes.forEach((node) => {
    adjList.set(node.id, [])
  })

  workflow.edges.forEach((edge) => {
    const list = adjList.get(edge.source) || []
    list.push(edge.target)
    adjList.set(edge.source, list)
  })

  const dfs = (nodeId: string): boolean => {
    visited.add(nodeId)
    recStack.add(nodeId)

    const neighbors = adjList.get(nodeId) || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true
      } else if (recStack.has(neighbor)) {
        return true
      }
    }

    recStack.delete(nodeId)
    return false
  }

  for (const node of workflow.nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true
    }
  }

  return false
}

export const getNodeColor = (type: NodeType): string => {
  const colors: Record<NodeType, string> = {
    start: "bg-green-100 border-green-300",
    task: "bg-blue-100 border-blue-300",
    approval: "bg-amber-100 border-amber-300",
    automated: "bg-purple-100 border-purple-300",
    end: "bg-red-100 border-red-300",
  }
  return colors[type]
}

export const getNodeTextColor = (type: NodeType): string => {
  const colors: Record<NodeType, string> = {
    start: "text-green-800",
    task: "text-blue-800",
    approval: "text-amber-800",
    automated: "text-purple-800",
    end: "text-red-800",
  }
  return colors[type]
}
