// Mock automations API
import type { Automation } from "@/app/types"

export const mockAutomations: Automation[] = [
  {
    id: "send-email",
    name: "Send Email",
    description: "Send an email to specified recipients",
    requiredParams: ["to", "subject", "body"],
  },
  {
    id: "generate-pdf",
    name: "Generate Offer Letter PDF",
    description: "Generate and send an offer letter PDF",
    requiredParams: ["template", "recipient", "documentName"],
  },
  {
    id: "notify-it",
    name: "Notify IT Department",
    description: "Send notification to IT for system access setup",
    requiredParams: ["employeeName", "department", "accessLevel"],
  },
  {
    id: "create-ticket",
    name: "Create Ticket in Helpdesk",
    description: "Create a support ticket for follow-up tasks",
    requiredParams: ["title", "description", "priority"],
  },
  {
    id: "send-reminder",
    name: "Send Reminder to Manager",
    description: "Send a reminder email to the assigned manager",
    requiredParams: ["managerEmail", "reminderText", "dueDate"],
  },
]

export const getAutomations = async (): Promise<Automation[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAutomations)
    }, 300)
  })
}
