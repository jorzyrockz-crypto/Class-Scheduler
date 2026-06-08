# Elementary Class Program Scheduler

## Overview

The Elementary Class Program Scheduler is a browser-based scheduling app for building and reviewing elementary class program matrices. It organizes grade levels, sections, subjects, teachers, days, and time slots into printable school program views.

The app is currently a static front-end project. It runs locally in the browser and stores schedule data in browser local storage, with optional cloud sync support when Firebase configuration is available.

## Main Features

- Master program views for Kindergarten, Grades 1-2, and Grades 3-6
- Grade level class program view by selected grade and day
- Teaching load summary dashboard
- Faculty, subject, grade, section, and time slot management
- Drag-and-drop class block scheduling
- Conflict diagnostics for teacher overlap, duplicate subjects, GMRC/HGP placement, and long consecutive teaching blocks
- JSON import and export for backups
- Print-friendly class program layout with school header, logos, and signatories
- Optional Firebase cloud room sync

## Project Structure

```text
Class Scheduler/
+-- elementary_class_program_matrix.html
+-- start-local-server.ps1
+-- PROJECT.md
+-- src/
    +-- app.js
    +-- defaults.js
    +-- stateMigration.js
    +-- storage.js
    +-- styles.css
    +-- theme.js
    +-- utils.js
```

## File Guide

- `elementary_class_program_matrix.html` is the app shell and contains the main HTML layout.
- `src/app.js` contains the main application behavior, rendering, event handlers, storage, drag-and-drop, import/export, printing, and cloud sync logic.
- `src/defaults.js` contains default subjects, teachers, time slots, sections, advisers, school profile data, and the initial app state.
- `src/stateMigration.js` normalizes older saved schedules so they still work with the current app structure.
- `src/storage.js` contains the local storage key and read/write helpers.
- `src/theme.js` contains the teacher color palettes and badge/text color maps.
- `src/utils.js` contains shared formatting, escaping, ID, and time conversion helpers.
- `src/styles.css` contains custom styles, drag states, scrollbar styles, touch behavior, and print styles.
- `start-local-server.ps1` starts a small local web server for the modular app.

## Running The App

Because the app now uses JavaScript modules, open it through a local web server instead of directly through `file://`.

From the project folder, run:

```powershell
.\start-local-server.ps1
```

Then open:

```text
http://127.0.0.1:8000/elementary_class_program_matrix.html
```

## Browser Dependencies

The app loads these browser libraries from CDNs:

- Tailwind CSS from `https://cdn.tailwindcss.com`
- Lucide icons from `https://unpkg.com/lucide@latest`
- Firebase modules from `https://www.gstatic.com/firebasejs/11.6.1/`

An internet connection is needed for those CDN-hosted libraries unless they are later vendored locally.

## Data Storage

The app saves the working schedule to browser local storage under:

```text
elem_program_matrix_v6
```

Users can also create portable backups with the built-in JSON export button and restore them with the import button.

## Development Notes

- Keep static school defaults in `src/defaults.js`.
- Keep saved-data compatibility changes in `src/stateMigration.js`.
- Keep browser storage helpers in `src/storage.js`.
- Keep visual theme constants in `src/theme.js`.
- Keep shared pure helpers in `src/utils.js`.
- Keep behavior changes in `src/app.js`.
- Keep print and custom layout styling in `src/styles.css`.
- After editing JavaScript modules, run a syntax check if possible.
- Test through the local server URL, not the direct file URL.

## Current Status

The app has been modularized from a single HTML file into separate HTML, CSS, and JavaScript module files. Defaults, theme constants, storage helpers, legacy migration, and shared utilities now live in focused modules. The next useful cleanup step would be splitting `src/app.js` further into smaller modules for rendering, scheduling rules, modals, drag-and-drop, cloud sync, and import/export.
