import type { Workflow } from "@/app/types"

export const serializeWorkflow = (workflow: Workflow): string => {
  return JSON.stringify(workflow, null, 2)
}

export const deserializeWorkflow = (json: string): Workflow => {
  return JSON.parse(json)
}

export const generateReadableWorkflowDescription = (workflow: Workflow): string[] => {
  const steps: string[] = []
  const nodeMap = new Map(workflow.nodes.map((n) => [n.id, n]))

  // Find start node
  const startNode = workflow.nodes.find((n) => n.type === "start")
  if (!startNode) return []

  const visited = new Set<string>()
  const queue: string[] = [startNode.id]

  while (queue.length > 0) {
    const currentId = queue.shift()
    if (!currentId || visited.has(currentId)) continue

    visited.add(currentId)
    const currentNode = nodeMap.get(currentId)
    if (!currentNode) continue

    // Generate readable description
    const description = generateNodeDescription(currentNode)
    steps.push(description)

    // Find outgoing edges
    const outgoing = workflow.edges.filter((e) => e.source === currentId)
    outgoing.forEach((edge) => {
      if (!visited.has(edge.target)) {
        queue.push(edge.target)
      }
    })
  }

  return steps
}

const generateNodeDescription = (node: any): string => {
  switch (node.type) {
    case "start":
      return `Start: ${node.config?.title || node.label}`
    case "task":
      return `Task: ${node.config?.title || node.label}`
    case "approval":
      return `Approval: ${node.config?.title || node.label}`
    case "automated":
      return `Automated: ${node.config?.stepName || node.label}`
    case "end":
      return `End: ${node.config?.message || "Workflow completed"}`
    default:
      return node.label
  }
}
