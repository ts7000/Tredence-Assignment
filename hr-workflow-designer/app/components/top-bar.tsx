"use client"

import type React from "react"
import { Save, Check, AlertCircle, Download, Upload, Layout as LayoutIcon, RotateCcw, RotateCw } from "lucide-react"

interface TopBarProps {
  onSave: () => void
  onValidate: () => void
  onExport: () => void
  onImport: () => void
  onLayout: () => void
  onUndo?: () => void
  onRedo?: () => void
  validationErrorCount: number
}

export const TopBar: React.FC<TopBarProps> = ({
  onSave,
  onValidate,
  onExport,
  onImport,
  onLayout,
  onUndo,
  onRedo,
  validationErrorCount,
}) => {
  return (
    <div className="h-16 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between px-6">
      {/* Left - Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">HR Workflow Designer</h1>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        {onUndo && (
          <button
            onClick={onUndo}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {onRedo && (
          <button
            onClick={onRedo}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Redo"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        )}

        {/* Separator */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Layout */}
        <button
          onClick={onLayout}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          title="Auto-arrange nodes"
        >
          <LayoutIcon className="w-4 h-4" />
          Layout
        </button>

        {/* Export */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          title="Export workflow"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        {/* Import */}
        <button
          onClick={onImport}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          title="Import workflow"
        >
          <Upload className="w-4 h-4" />
          Import
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-slate-200 mx-1" />

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
