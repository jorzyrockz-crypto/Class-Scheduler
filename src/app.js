import './ui.js';
import { setupNav } from './nav.js';

window.addEventListener('DOMContentLoaded', () => {
    setupNav();
});

// If the DOM is already loaded (e.g. deferred module), run it now
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    setupNav();
}

// The application is now fully compartmentalized into smaller, specialized modules.
// - state.js: Manages all shared tracking properties and browser storage interaction
// - cloudSync.js: Manages Firebase realtime collaborative syncing
// - importExport.js: Manages downloading JSON backups and uploading JSON backups
// - scheduling.js: Houses the teacher collision algorithms and scheduling rules
// - dragDrop.js: Handles all HTML5 drag and drop interactive events and ripple behaviors
// - ui.js: Manages DOM mutations, layout generation, modals, and binds handlers to the window

// This file simply orchestrates the import of ui.js, which in turn orchestrates the rest of the app.
