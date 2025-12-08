// HR Workflow Designer - Core Type Definitions

export type NodeType = "start" | "task" | "approval" | "automated" | "end"
export type FieldType = "text" | "dropdown" | "checkbox" | "textarea"

// Node Configurations
export interface StartConfig {
  title: string
  description?: string
  tags?: string[]
}

export interface TaskConfig {
  title: string
  description?: string
  assignee?: string
  dueDays?: number
  customFields?: CustomField[]
}

export interface ApprovalConfig {
  title: string
  approverRole?: string
  autoApprovalThreshold?: number
}

export interface AutomatedConfig {
  stepName: string
  automationType?: string
  parameters?: Record<string, string>
}

export interface EndConfig {
  message?: string
  showSummary?: boolean
  summaryFields?: string[]
}

export type NodeConfig = StartConfig | TaskConfig | ApprovalConfig | AutomatedConfig | EndConfig

export interface CustomField {
  id: string
  label: string
  type: FieldType
  required: boolean
}

// Workflow Structure
export interface WorkflowNode {
  id: string
  type: NodeType
  label: string
  config: NodeConfig
  position: { x: number; y: number }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
}

export interface Workflow {
  id: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

// Simulation & Validation
export interface ValidationError {
  type: string
  message: string
  nodeId?: string
}

export interface SimulationResult {
  status: "success" | "error"
  steps: string[]
  warnings?: string[]
  errors?: ValidationError[]
}

// Automation Definition
export interface Automation {
  id: string
  name: string
  description: string
  requiredParams: string[]
}
