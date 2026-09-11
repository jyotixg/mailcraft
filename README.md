# MailCraft

**Transactional Email Template Builder** — a schema-driven, drag-and-drop editor for building and maintaining transactional emails (OTP, login alerts, payments, subscriptions, password resets, and more).

This is a frontend-only proof of concept. It does not send email, and it has no backend — everything runs in the browser and persists to `localStorage`.

## Problem

Fintech products send a lot of transactional email — OTP, login alerts, password resets, payment receipts, subscription confirmations, security notices. In practice these templates tend to be hand-built HTML files, each one repeating the same header/footer/button markup, with variable substitution handled ad hoc and no shared way to validate that a template is actually complete before it ships.

## Solution

MailCraft treats an email as **structured data, not markup**. A template is a versioned JSON schema — metadata, a list of variables, and an ordered list of typed content blocks. A registry of reusable blocks (Text, Button, OTP, Transaction Summary, Security Alert, …) knows how to render itself two ways: as an editable block in the visual builder, and as inline-styled, table-based HTML for export. Authors compose templates by dragging blocks from a library, wire up `{{variables}}` instead of hardcoding data, and get immediate validation feedback before marking a template "Ready."

## Key Features

- Drag-and-drop block composition and reordering (`dnd-kit`), keyboard-accessible
- 13 reusable block types, including fintech-specific OTP, Transaction Summary, and Security Alert blocks
- A metadata-driven property panel — adding a new block property is a config entry, not a new form
- A variable engine: define `{{tokens}}`, insert them at the cursor, and validate usage (unknown / unused) across the whole template
- A validation engine with a template health score, category-aware rules (e.g. "OTP templates should include an OTP block"), and an email-compatibility checklist
- Builder and runtime Preview modes sharing one renderer, with desktop/mobile device frames and a live Preview Data panel
- HTML export (table-based, inline-styled, tokens left intact for a backend to fill in) and JSON export/import, both with structural validation (no `eval`, ever)
- A library of 8 built-in templates plus duplicate/delete for your own
- Undo/redo (~20 steps) over schema-changing actions, `localStorage` persistence, and keyboard shortcuts

## Architecture

Two pipelines share the same schema and the same block registry:

```
Template Schema
      ↓
Builder State (Context + useReducer, with undo/redo history)
      ↓
Block Registry (label, icon, default props, property fields, React component)
      ↓
Renderer (schema block → registry component)
      ↓
Builder canvas  /  Runtime Preview (same renderer, different variable-resolution mode)
```

```
Template Schema
      ↓
HTML Generator (engine/htmlGenerator.ts — independent of React)
      ↓
Table-based, inline-styled Email HTML
```

The **renderer never touches the DOM directly to produce HTML** — `engine/htmlGenerator.ts` is a separate, framework-agnostic function that walks the same schema and block types and emits markup by hand. This is deliberate: React's rendering is for what you see while editing; the HTML generator is what actually ships.

Editor state (`context/EmailBuilderContext.tsx` + `reducer/emailBuilderReducer.ts`) and preview/runtime state (`context/PreviewContext.tsx`) are kept separate — selecting a block or typing a sample preview value never enters undo history; changing the schema always does.

## Tech Stack

| Technology | Why |
|---|---|
| React + TypeScript + Vite | Fast dev loop, strict typing throughout (discriminated unions for blocks, no `any`) |
| MUI (Material UI) | A full component set (dialogs, drawers, menus) with a custom theme, so effort goes into the builder logic rather than rebuilding basic UI |
| dnd-kit | Accessible, well-maintained drag-and-drop primitives — used for the block library, canvas reordering, and keyboard-based reordering |
| Context + `useReducer` | A single, testable reducer for every schema mutation, which is what makes undo/redo, JSON import validation, and template loading all reuse the same code path |
| Vitest + React Testing Library | Fast, Vite-native test runner for the variable engine, validation engine, reducer, and renderer |

## Project Structure

```
src/
├── components/
│   ├── builder/      # Header, block library, canvas, sortable blocks, properties panel
│   ├── blocks/        # The 13 block React components (Text, Button, OTP, Transaction, …)
│   ├── preview/       # Email preview, device frame, preview-data panel
│   ├── templates/     # Template library dialog + card
│   ├── variables/     # Variables drawer, editor, insert-variable picker
│   ├── validation/    # Template health / validation drawer
│   ├── dialogs/       # Import, JSON export, HTML export, confirm
│   └── common/         # Error boundary
├── context/            # EmailBuilderContext (editor state), PreviewContext (runtime state)
├── reducer/            # emailBuilderReducer.ts — every schema mutation
├── registry/           # blockRegistry.ts (source of truth for blocks), propertyRegistry.ts
├── engine/             # renderer.tsx, htmlGenerator.ts, variableEngine.ts, validationEngine.ts
├── hooks/              # useEmailBuilder, useHistory, usePreview, useLocalStorage, useKeyboardShortcuts
├── templates/           # The 8 built-in template schemas
├── types/               # blocks.ts, email.ts, variables.ts
└── utils/               # id, storage, schemaValidation, download, formatDate
```

## How to Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build
npm run test      # Vitest — variable engine, validation engine, reducer, renderer
```

## Demo Flow (3–5 minutes)

1. Open MailCraft — the OTP Verification template loads by default.
2. Open **Templates**, note the 8 built-ins with categories and status, open **Forgot Password**.
3. Drag a **Security Alert** block from the library into the canvas; reorder it with the drag handle or the Move Up/Down toolbar.
4. Select it, edit its title/message in the **Properties** panel — the canvas updates immediately.
5. Open **Variables**, add a new variable (e.g. `accountType`), and insert it into a text block via the "insert variable" button.
6. Switch to **Preview**, fill in sample values in the **Preview Data** panel, and watch `{{tokens}}` resolve live.
7. Toggle **Desktop → Mobile** to see the same schema reflow.
8. Click **Validate** — walk through the health score and the checklist.
9. **Export JSON**, then **Export HTML** — point out that the HTML keeps `{{tokens}}` intact for a backend to fill in later.
10. Undo/redo a couple of the edits above to show history tracking.

## Known Limitations (intentional, for a POC)

- No backend, authentication, or real email delivery — this is a template *authoring* tool, not a sending pipeline.
- The Container block is a visual wrapper, not a nested drop target — arbitrary nesting was explicitly out of scope.
- `localStorage`-backed persistence and a flat "saved templates" map stand in for a real template repository.
- Draft/Ready is a local status flag, not an approval workflow.
- Variable types are limited to `string`/`number`; there's no per-type format validation (dates, currency, etc).
- The bundle isn't code-split (one MUI + dnd-kit bundle); fine for a POC, worth revisiting for production.

## Production Evolution

To become a real internal product, MailCraft would need:

- **Backend API + template repository** — persist schemas centrally instead of `localStorage`, with a real "Templates" service.
- **Authentication + role-based permissions** — who can edit vs. approve vs. publish a template.
- **Approval workflow** — Draft → In Review → Approved → Published, replacing the local status toggle.
- **Versioning + audit logs** — every schema change attributable and revertible, beyond in-session undo/redo.
- **Email service integration** — a publish step that hands the generated HTML + variable contract to the actual sending pipeline (SES/SendGrid/whatever `the platform` uses), rather than a manual download.
- **Environment management** — separate template sets for staging vs. production, with promotion between them.
- **Real asset upload** for images/logos rather than pasted URLs.
