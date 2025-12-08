"use client"

import type React from "react"
import { CheckCircle, AlertCircle } from "lucide-react"

interface ToastProps {
  message: string
  type: "success" | "error"
}

export const Toast: React.FC<ToastProps> = ({ message, type }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
        type === "success" ? "bg-green-50 border-green-300 text-green-900" : "bg-red-50 border-red-300 text-red-900"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />
      ) : (
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
      )}
      <p className="font-medium text-sm">{message}</p>
    </div>
  )
}
