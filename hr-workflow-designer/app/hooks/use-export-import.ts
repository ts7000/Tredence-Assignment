import { useCallback } from "react"
import { useWorkflowStore } from "@/app/store/workflow-store"
import { serializeWorkflow, deserializeWorkflow } from "@/app/utils/serialization"
import type { Workflow } from "@/app/types"

interface UseExportImportReturn {
  exportWorkflow: () => void
  importWorkflow: (onSuccess?: () => void, onError?: (error: string) => void) => void
}

export const useExportImport = (): UseExportImportReturn => {
  const { workflow, setWorkflow } = useWorkflowStore()

  const exportWorkflow = useCallback(() => {
    try {
      const serialized = serializeWorkflow(workflow)
      const blob = new Blob([serialized], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `workflow-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export workflow:", error)
      throw new Error("Failed to export workflow")
    }
  }, [workflow])

  const importWorkflow = useCallback(
    (onSuccess?: () => void, onError?: (error: string) => void) => {
      try {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = ".json"

        input.onchange = (e: any) => {
          const file = e.target.files?.[0]
          if (!file) return

          const reader = new FileReader()
          reader.onload = (event) => {
            try {
              const json = event.target?.result as string
              const importedWorkflow = deserializeWorkflow(json)

              // Validate the imported workflow structure
              if (!importedWorkflow.id || !Array.isArray(importedWorkflow.nodes) || !Array.isArray(importedWorkflow.edges)) {
                throw new Error("Invalid workflow format")
              }

              setWorkflow(importedWorkflow)
              onSuccess?.()
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : "Failed to parse workflow file"
              onError?.(errorMessage)
              console.error("Failed to import workflow:", error)
            }
          }

          reader.onerror = () => {
            const errorMessage = "Failed to read file"
            onError?.(errorMessage)
            console.error("Failed to read file")
          }

          reader.readAsText(file)
        }

        input.click()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to import workflow"
        onError?.(errorMessage)
        console.error("Failed to import workflow:", error)
      }
    },
    [setWorkflow]
  )

  return {
    exportWorkflow,
    importWorkflow,
  }
}
