"use client"

import type React from "react"
import { Save, Check, AlertCircle } from "lucide-react"

interface TopBarProps {
  onSave: () => void
  onValidate: () => void
  validationErrorCount: number
}

export const TopBar: React.FC<TopBarProps> = ({ onSave, onValidate, validationErrorCount }) => {
  return (
    <div className="h-16 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between px-6">
      {/* Left - Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">HR Workflow Designer</h1>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-4">
        {/* Validation Status */}
        {validationErrorCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">{validationErrorCount} issue(s)</span>
          </div>
        )}

        {validationErrorCount === 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Valid</span>
          </div>
        )}

        {/* Action Buttons */}
        <button
          onClick={onValidate}
          className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Validate
        </button>

        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>
    </div>
  )
}
