import type { WorkflowNode, WorkflowEdge } from "@/app/types"

interface LayoutNode extends WorkflowNode {
  level?: number
  visited?: boolean
}

/**
 * Calculate hierarchical layout for workflow nodes
 * Uses breadth-first search to assign levels based on node connections
 */
export const calculateHierarchicalLayout = (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): WorkflowNode[] => {
  if (nodes.length === 0) return nodes

  // Create a map of nodes for easier lookup
  const nodeMap = new Map<string, LayoutNode>(nodes.map((n) => [n.id, { ...n }]))

  // Build adjacency lists
  const incomingEdges = new Map<string, string[]>()
  const outgoingEdges = new Map<string, string[]>()

  nodes.forEach((node) => {
    incomingEdges.set(node.id, [])
    outgoingEdges.set(node.id, [])
  })

  edges.forEach((edge) => {
    incomingEdges.get(edge.target)?.push(edge.source)
    outgoingEdges.get(edge.source)?.push(edge.target)
  })

  // Find start nodes (nodes with no incoming edges)
  const startNodes = nodes.filter((n) => (incomingEdges.get(n.id)?.length ?? 0) === 0)

  // Assign levels using BFS
  const levels = new Map<string, number>()
  const queue = startNodes.map((n) => n.id)

  startNodes.forEach((n) => {
    levels.set(n.id, 0)
  })

  while (queue.length > 0) {
    const nodeId = queue.shift()
    if (!nodeId) continue

    const currentLevel = levels.get(nodeId) ?? 0
    const outgoing = outgoingEdges.get(nodeId) ?? []

    outgoing.forEach((targetId) => {
      const targetLevel = levels.get(targetId) ?? -1
      const newLevel = currentLevel + 1

      if (targetLevel === -1) {
        levels.set(targetId, newLevel)
        queue.push(targetId)
      } else if (newLevel > targetLevel) {
        levels.set(targetId, newLevel)
      }
    })
  }

  // Group nodes by level
  const levelGroups = new Map<number, string[]>()
  levels.forEach((level, nodeId) => {
    if (!levelGroups.has(level)) {
      levelGroups.set(level, [])
    }
    levelGroups.get(level)?.push(nodeId)
  })

  // Calculate layout parameters
  const horizontalSpacing = 250 // Space between levels
  const verticalSpacing = 120 // Space between nodes in same level
  const startX = 50
  const startY = 150

  // Position nodes based on their level and position within level
  const layoutNodes = nodes.map((node) => {
    const level = levels.get(node.id) ?? 0
    const nodesInLevel = levelGroups.get(level) ?? []
    const indexInLevel = nodesInLevel.indexOf(node.id)

    const x = startX + level * horizontalSpacing
    const y = startY + (indexInLevel - (nodesInLevel.length - 1) / 2) * verticalSpacing

    return {
      ...node,
      position: { x: Math.max(x, 0), y: Math.max(y, 0) },
    }
  })

  return layoutNodes
}

/**
 * Force-directed layout algorithm for more organic node arrangement
 */
export const calculateForceDirectedLayout = (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  iterations: number = 50
): WorkflowNode[] => {
  if (nodes.length === 0) return nodes

  // Initialize positions if not already set
  let positions = nodes.map((node) => ({
    id: node.id,
    x: node.position?.x ?? Math.random() * 800,
    y: node.position?.y ?? Math.random() * 600,
    vx: 0, // velocity x
    vy: 0, // velocity y
  }))

  const k = 100 // Ideal spring length
  const c = 0.1 // Damping coefficient
  const repulsion = 1000 // Repulsion strength

  // Simulate for N iterations
  for (let iter = 0; iter < iterations; iter++) {
    // Reset forces
    positions.forEach((p) => {
      p.vx = 0
      p.vy = 0
    })

    // Apply spring forces from edges
    edges.forEach((edge) => {
      const source = positions.find((p) => p.id === edge.source)
      const target = positions.find((p) => p.id === edge.target)

      if (source && target) {
        const dx = target.x - source.x
        const dy = target.y - source.y
        const distance = Math.sqrt(dx * dx + dy * dy) + 0.1

        const force = (distance - k) / distance

        source.vx += force * dx
        source.vy += force * dy
        target.vx -= force * dx
        target.vy -= force * dy
      }
    })

    // Apply repulsion forces
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const p1 = positions[i]
        const p2 = positions[j]

        const dx = p2.x - p1.x
        const dy = p2.y - p1.y
        const distance = Math.sqrt(dx * dx + dy * dy) + 0.1

        const force = repulsion / (distance * distance)

        p1.vx -= (force * dx) / distance
        p1.vy -= (force * dy) / distance
        p2.vx += (force * dx) / distance
        p2.vy += (force * dy) / distance
      }
    }

    // Apply damping and update positions
    positions.forEach((p) => {
      p.vx *= c
      p.vy *= c
      p.x += p.vx
      p.y += p.vy

      // Keep within bounds
      p.x = Math.max(20, Math.min(p.x, 1200))
      p.y = Math.max(20, Math.min(p.y, 800))
    })
  }

  // Return nodes with updated positions
  return nodes.map((node) => {
    const position = positions.find((p) => p.id === node.id)
    return {
      ...node,
      position: position ? { x: position.x, y: position.y } : node.position,
    }
  })
}
