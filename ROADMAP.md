# Project Improvement Roadmap: Simple to Complex

This document outlines the planned improvement phases for the **Class Program Scheduler** to transition it from a monolithic front-end structure into a modular, highly performant, and intelligent application.

```mermaid
graph TD
    Phase1[Phase 1: Code & Style Modularization] --> Phase2[Phase 2: True ES6 Modules Integration]
    Phase2 --> Phase3[Phase 3: Granular DOM Rendering]
    Phase3 --> Phase4[Phase 4: Resilient Offline Sync]
    Phase4 --> Phase5[Phase 5: Intelligent Auto-Scheduler]

    style Phase1 fill:#d1fae5,stroke:#059669,stroke-width:2px
    style Phase2 fill:#ecfdf5,stroke:#10b981,stroke-width:1px
    style Phase3 fill:#fef3c7,stroke:#d97706,stroke-width:1px
    style Phase4 fill:#fff1f2,stroke:#e11d48,stroke-width:1px
    style Phase5 fill:#f5f3ff,stroke:#7c3aed,stroke-width:2px
```

---

## 🟢 Phase 1: Code & Style Modularization (Simple)
**Goal:** Clean up the HTML structure and link modularized assets.

*   **Move Inline Styles:** Extract the 130+ lines of CSS from `<style>` inside `index.html` and consolidate them into the external `src/styles.css` file.
*   **Link External Stylesheet:** Add `<link rel="stylesheet" href="src/styles.css">` to `index.html`.
*   **Remove Unused Code:** Remove redundant files or leftover refactoring scripts that clutter the workspace.

---

## 🟡 Phase 2: True ES6 Module Architecture (Medium)
**Goal:** Migrate the scripts from the global `window` namespace to modular ES6 exports/imports.

### ✅ Phase 2a — Completed
*   **External Firebase Module:** Moved the 56-line inline `<script type="module">` Firebase bootstrap from `index.html` into `src/firebase-init.js`.
*   **Convert Simple Scripts:** Converted `src/ui-handlers.js` and `src/saved-schedules.js` from `defer` to `type="module"` script tags — they only set `window.*` functions so they are fully compatible.
*   **Link External Stylesheet:** Done in Phase 1.

### 🔲 Phase 2b — Remaining
*   **Rewrite `src/state.js`:** Convert it from a plain `defer` script to a proper ES6 module that exports `State`, `saveState`, `loadState`, `switchClassProgram`, `switchSchoolYear`, etc. This requires the sub-modules (`scheduling.js`, `dragDrop.js`, `importExport.js`) to correctly resolve their `import { State }` calls.
*   **Retire `src/app.js`:** Replace the monolithic 4000-line `src/app.js` with `src/ui.js` as the active entry point. `src/ui.js` already has correct ES6 imports but is missing a few features (`handleAuthAction`, `openNewSYModal`, `createNewSchoolYear`, teacher modal) that must be migrated first.
*   **Import Sub-modules in Entry Point:** Once `ui.js` is the entry point, have it explicitly import and initialize `ui-handlers.js`, `saved-schedules.js`, and `nav.js`.

---

## 🟠 Phase 3: Granular DOM Rendering (Medium-Complex)
**Goal:** Improve interface performance and eliminate layout lag during drag-and-drop actions.

*   **Avoid Full Redraws:** Currently, calling `renderAll()` completely resets and redraws large chunks of the workspace DOM via `innerHTML` whenever a card is moved.
*   **Targeted DOM Updates:** Rewrite the rendering functions to target specific nodes. For example, moving a subject card should only re-render the source cell, the target cell, the specific teacher's summary workload item, and the diagnostics console.

---

## 🔴 Phase 4: Resilient Offline-to-Online Cloud Sync (Complex)
**Goal:** Enable seamless collaboration by resolving conflicts that occur when editing offline.

*   **State Conflict Strategy:** Cache local changes during network disconnects.
*   **Sync Resolution Dialog:** When coming back online, detect if remote changes exist. Provide a visual merge interface to let users pick between local overwrites, remote overwrites, or a side-by-side merge.

---

## 🟣 Phase 5: Intelligent Auto-Scheduling & Suggestions (Advanced)
**Goal:** Introduce smart automation to solve schedule constraints automatically.

*   **Smart Conflict Resolver:** In addition to listing conflicts, display helper buttons next to warnings. Clicking "Suggest Alternative" will scan for available time slots or teachers that won't violate rules.
*   **Backtracking Auto-Scheduler:** Implement a constraint satisfaction engine. The user specifies desired subjects, section allocations, and teacher workloads, and the scheduler outputs a fully-allocated, conflict-free matrix draft.
