# HR Workflow Designer

Visual HR workflow builder that lets people teams sketch processes, configure each step, validate the flow, and simulate the employee experience before shipping the automation.

## Architecture
- **App Router + TypeScript (Next.js 16)** keeps UI, API mocks, and utility code colocated under `app/`, enabling server/client boundary control while staying deploy-ready for Vercel.
- **State layer (`app/store/workflow-store.ts`)** uses Zustand to keep a single source of truth for nodes, edges, selection, and validation errors. Every UI surface (canvas, config forms, simulation drawer) subscribes to the same store for instant sync.
- **Canvas + Node system** (`workflow-canvas.tsx`, `workflow-node.tsx`) renders a custom, lightweight graph surface: drag-and-drop from the sidebar, move nodes, and draw edges without pulling in a heavy diagramming library.
- **Node configuration forms** (`app/components/node-configs/*`) rely on React Hook Form so every keystroke immediately dispatches updates to the store, keeping the rendered node label, validation, and serialization in lockstep.
- **Validation + Simulation utilities** (`app/utils/validation.ts`, `app/api/simulation.ts`, `app/utils/serialization.ts`) stay framework-agnostic. They gate Start/End rules, detect cycles, and convert workflows into human-readable execution steps for the simulation modal.
- **UI foundation** combines Tailwind CSS, Radix primitives, and custom components (`app/components/*`, `components/ui/*`) for consistent spacing, motion, and theming via `app/globals.css` and `components/theme-provider.tsx`.

## Getting Started
1. **Install prerequisites**
	- Node.js 20+ (matches Next 16 requirements)
	- pnpm 9 (`corepack enable pnpm` on macOS/Linux)
2. **Install dependencies**
	```bash
	pnpm install
	```
3. **Run the app locally**
	```bash
	pnpm dev
	```
	Visit `http://localhost:3000` and start dragging nodes.
4. **Lint / type-check / production build**
	```bash
	pnpm lint      # ESLint + TypeScript
	pnpm build     # Creates a production build
	pnpm start     # Serves the optimized build
	```

## Design Decisions
- **Single-store graph model** simplifies undo/redo and serialization because every node/edge mutation goes through one predictable slice.
- **React Hook Form for node editors** offers controlled inputs with minimal re-renders and unlocks future validation schemas (Zod, RHF resolvers) per node type.
- **Custom canvas over off-the-shelf diagram libs** keeps the interaction model focused (linear HR flows) and gave flexibility for bespoke touches like snapping, connection guards, and empty-state messaging.
- **Pure functions for validation/simulation** makes it easy to port the same logic to a backend worker later without rewrites.
- **Mock API layer** (`app/api/automations.ts`, `app/api/simulation.ts`) mirrors future integrations (automation catalog, run previews) so the UI contract is already defined.

## Delivered Scope vs. Next Iterations
### ✅ Completed in this submission
- Drag-and-drop palette, movable nodes, and interactive edge creation/deletion on the canvas.
- Type-specific config panels (Start/Task/Approval/Automated/End) with live-updating labels and contextual helper text.
- Validation banner + toast system surfacing missing Start/End nodes, orphaned steps, and loop detection before export.
- Simulation panel that reuses validation, generates readable execution steps, and highlights warnings/errors.
- Workflow serialization to downloadable JSON plus helper descriptions for handoff to downstream systems.
- Polished UI shell (TopBar, Sidebar, config drawer, overlays) with responsive layout and accessible focus styles.

### ✨ What I would add with more time
- **Persistence + import**: save/load workflows from local storage or a backend, plus version history.
- **Branching logic + conditions**: support parallel paths, guard rails (e.g., auto-approval threshold logic), and visual indicators for split/merge nodes.
- **Execution telemetry**: store simulation runs, show timing estimates, and surface SLA breaches.
- **Collaboration**: presence indicators, commenting, and optional realtime editing via WebSockets or Liveblocks.
- **Robust testing**: unit tests for validators/serializers and Playwright coverage for drag/drop and simulation flows.
- **Accessibility & performance**: keyboard-driven node placement, reduced-motion mode, and virtualization for large workflows.