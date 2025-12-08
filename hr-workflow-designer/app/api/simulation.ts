// Mock simulation API
import type { Workflow, SimulationResult } from "@/app/types"
import { validateWorkflow } from "@/app/utils/validation"
import { generateReadableWorkflowDescription } from "@/app/utils/serialization"

export const simulateWorkflow = async (workflow: Workflow): Promise<SimulationResult> => {
  // Validate first
  const validationErrors = validateWorkflow(workflow)

  if (validationErrors.length > 0) {
    return {
      status: "error",
      steps: [],
      errors: validationErrors,
    }
  }

  // Generate readable steps
  const steps = generateReadableWorkflowDescription(workflow)

  // Simulate execution with potential warnings
  const warnings: string[] = []
  if (workflow.nodes.length > 10) {
    warnings.push("This is a complex workflow with many steps. Consider breaking it down.")
  }

  return {
    status: "success",
    steps,
    warnings,
    errors: [],
  }
}
