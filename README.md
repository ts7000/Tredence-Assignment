# HR Workflow Designer

Visual HR workflow builder that lets people teams sketch processes, configure each step, validate the flow, and simulate the employee experience before shipping the automation.

## Architecture
- **App Router + TypeScript (Next.js 16)** keeps UI, API mocks, and utility code colocated under `app/`, enabling server/client boundary control while staying deploy-ready for Vercel.
- **State layer** (`app/store/workflow-store.ts`) uses Zustand to maintain a single source of truth for nodes, edges, selection, and validation errors. Every UI surface (canvas, config forms, simulation drawer) subscribes to the same store for instant sync.
- **Canvas + Node system** (`workflow-canvas.tsx`, `workflow-node.tsx`) renders a custom, lightweight graph surface: drag-and-drop from the sidebar, move nodes, and draw edges without external diagramming libraries.
- **Node configuration forms** (`app/components/node-configs/*`) use React Hook Form for controlled inputs with live validation and instant store updates.
- **Templates system** (`components/templates-panel.tsx`) provides 4 pre-built workflows with nodes and connections that users can customize.
- **Layout utilities** (`app/utils/layout.ts`) implements hierarchical and force-directed layout algorithms for automatic node arrangement.
- **Export/Import hooks** (`app/hooks/use-export-import.ts`) handle workflow serialization with file I/O and JSON validation.
- **Validation + Simulation utilities** (`app/utils/validation.ts`, `app/api/simulation.ts`, `app/utils/serialization.ts`) stay framework-agnostic and can be reused server-side.
- **UI foundation** combines Tailwind CSS, Radix primitives, and custom components for consistent spacing, motion, and theming.

## Features
### Core Features
- **Drag-and-drop node palette** – 5 node types (Start, Task, Approval, Automated, End) with contextual configurations
- **Interactive canvas** – Move nodes, draw connections, delete edges, and organize your workflow visually
- **Live validation** – Real-time feedback on missing Start/End nodes, orphaned steps, cycles, and connection rules
- **Simulation engine** – Preview workflow execution paths with readable step descriptions and error detection
- **Workflow serialization** – Export workflows as JSON and import saved configurations

### New Enhancements
- **Pre-built templates** – Load one of 4 industry templates:
  - Basic Approval Flow (Start → Approval → End)
  - Task + Approval Pair (Start → Task → Approval → End)
  - Employee Onboarding (multi-step HR onboarding with parallel tasks)
  - Leave Request (Request → Manager Approval → Auto-notification → End)
- **Auto-layout** – Intelligently arrange nodes in a hierarchical layout with one click
- **Export/Import workflows** – Save workflows as timestamped JSON files and import them later with validation
- **Toast notifications** – Visual feedback for all actions (save, export, import, layout, validation)

## Getting Started
1. **Install prerequisites**
	- Node.js 18+ 
	- npm or pnpm
2. **Install dependencies**
	```bash
	npm install
	```
3. **Run the app locally**
	```bash
	npm run dev
	```
	Visit `http://localhost:3000` and start building workflows.
4. **Build and deploy**
	```bash
	npm run build    # Creates a production build
	npm run start    # Serves the optimized build
	npm run lint     # Run ESLint
	```

## Quick Start Guide
1. **Create a workflow from scratch**: Drag nodes from the sidebar onto the canvas
2. **Or use a template**: Click the purple "Templates" button in the sidebar to load a pre-built workflow
3. **Configure nodes**: Click on any node to open its configuration panel on the right
4. **Draw connections**: Click the connection point on any node and drag to another node
5. **Validate**: Click "Validate" in the top bar to check for errors
6. **Export**: Click "Export" to download your workflow as JSON
7. **Import**: Click "Import" to load a previously saved workflow
8. **Auto-arrange**: Click "Layout" to automatically organize all nodes

## Design Decisions
- **Single-store graph model** simplifies state management and serialization because every node/edge mutation goes through one predictable action.
- **React Hook Form for node editors** offers controlled inputs with minimal re-renders and enables future extensibility.
- **Custom canvas over off-the-shelf diagram libs** keeps the interaction model focused on linear HR flows while maintaining flexibility for custom interactions.
- **Template system** reduces friction for users by providing proven workflow patterns they can start with and customize.
- **Automatic layout algorithms** help users organize complex workflows without manual positioning, improving usability.
- **Client-side file I/O** for export/import allows instant workflows without backend latency, with validation to ensure data integrity.
- **Pure functions for validation/simulation** makes logic testable and portable to backend workers.
- **Mock API layer** mirrors future integrations (automation catalog, run previews) so the UI contract is defined upfront.

## Delivered Scope vs. Next Iterations
### Completed in this submission
- Drag-and-drop palette, movable nodes, and interactive edge creation/deletion
- Type-specific config panels with live-updating labels and contextual help
- Validation banner + toast notifications for errors and actions
- Simulation panel with readable execution steps and error highlighting
- **Templates system with 4 pre-built workflow patterns**
- **Auto-layout feature for hierarchical node arrangement**
- **Export/Import workflow functionality with validation**
- Workflow serialization to JSON format
- Polished UI with TopBar, Sidebar, config drawer, and responsive layout

### Potential Enhancements
- **Persistence layer** – Save/load workflows from backend database with version history
- **Branching & conditions** – Support parallel paths, guards, and conditional logic
- **Execution telemetry** – Store simulation runs, timing estimates, and SLA tracking
- **Collaboration features** – Real-time presence, comments, and collaborative editing
- **Advanced testing** – Unit tests for validators, Playwright E2E tests for workflows
- **Accessibility improvements** – Keyboard-driven workflow building, reduced-motion mode
- **Performance optimization** – Virtualization for large workflows, lazy-loading templates
- **Undo/Redo** – Full history stack for workflow modifications
- **Workflow analytics** – Track most used steps, common patterns, execution metrics