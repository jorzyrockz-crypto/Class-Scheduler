/**
 * state.js – ES6 Module
 *
 * Single source of truth for all mutable application state.
 *
 * ── Exports ──────────────────────────────────────────────────────────────────
 *   State          Plain object. ES6 modules import this and mutate its
 *                  properties (State.workspace, State.draggedBlockId, …).
 *
 *   saveState      Persists workspace to localStorage + optional cloud sync.
 *                  Works with BOTH call signatures:
 *                    saveState()                          ← legacy app.js
 *                    saveState(connected, room, fn)       ← module scripts
 *
 *   loadState      Restores workspace from localStorage (with migration).
 *   getAllSchoolYears / registerSchoolYear / switchClassProgram / switchSchoolYear
 *
 * ── Backwards Compatibility ───────────────────────────────────────────────────
 *   Every State property is also exposed on window via a getter/setter so that
 *   the legacy defer script (app.js) can still read/write them as bare global
 *   variables without modification:
 *
 *     workspaceState = newObj          →  window.workspaceState setter
 *                                      →  State.workspace = newObj   ✅
 *
 *     draggedBlockId = "xyz"           →  window.draggedBlockId setter
 *                                      →  State.draggedBlockId = "xyz" ✅
 *
 *   This works because app.js is a non-strict plain script; bare assignments
 *   to undeclared identifiers resolve to window.xxx.
 */

import { defaultState } from './defaults.js';
import { migrateLegacyData } from './stateMigration.js';

// ─────────────────────────────────────────────────────────────────────────────
// The State object — plain data, mutated in place by all callers
// ─────────────────────────────────────────────────────────────────────────────
export const State = {
    // ── Workspace data ──────────────────────────────────────────────────────
    workspace: null,

    // ── Drag-and-drop ───────────────────────────────────────────────────────
    draggedBlockId:       null,
    activeQuickMoveId:    null,

    // ── Sidebar / panel ─────────────────────────────────────────────────────
    activeResourceTab:    'school',

    // ── Active selections ───────────────────────────────────────────────────
    activeSelectedCardId:  null,
    activeTeacherFilterId: null,
    expandedTeacherId:     null,

    // ── Filters ─────────────────────────────────────────────────────────────
    activeTimeSlotFilter: 'all',
    summaryFilter:        'all',
    summarySearchQuery:   '',

    // ── Inline editor ───────────────────────────────────────────────────────
    inlineEditingSlotId:  null,

    // ── Modal edit trackers ─────────────────────────────────────────────────
    editingTeacherId:     null,
    editingSubjectId:     null,
    editingSectionId:     null,
    editingTimeSlotId:    null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Window bridge: define window.workspaceState ↔ State.workspace
// and window.<key>              ↔ State.<key>
// so that app.js bare assignments hit these setters.
// ─────────────────────────────────────────────────────────────────────────────
Object.defineProperty(window, 'workspaceState', {
    get() { return State.workspace; },
    set(v) { State.workspace = v; },
    configurable: true,
    enumerable: true,
});

const STATE_KEYS = [
    'draggedBlockId', 'activeQuickMoveId', 'activeResourceTab',
    'activeSelectedCardId', 'activeTeacherFilterId', 'expandedTeacherId',
    'activeTimeSlotFilter', 'summaryFilter', 'summarySearchQuery',
    'inlineEditingSlotId', 'editingTeacherId', 'editingSubjectId',
    'editingSectionId', 'editingTimeSlotId',
];

for (const key of STATE_KEYS) {
    Object.defineProperty(window, key, {
        get() { return State[key]; },
        set(v) { State[key] = v; },
        configurable: true,
        enumerable: true,
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Storage helpers
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_SCHOOL_YEAR = 'S.Y. 2025-2026';

const getStorageKey = (year) =>
    year
        ? `elem_program_matrix_v6_${year.replace(/[^a-zA-Z0-9-]/g, '_')}`
        : 'elem_program_matrix_v6';

export const getAllSchoolYears = () => {
    try { return JSON.parse(localStorage.getItem('school_years_index') || '[]'); }
    catch { return []; }
};

export const registerSchoolYear = (year) => {
    if (!year) return;
    const years = getAllSchoolYears();
    if (!years.includes(year)) {
        years.push(year);
        localStorage.setItem('school_years_index', JSON.stringify(years));
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// saveState
// Dual call signature support:
//   saveState()                              ← called by app.js (no args)
//   saveState(isConnected, room, saveFn)     ← called by module scripts
// ─────────────────────────────────────────────────────────────────────────────
export const saveState = (isCloudConnected, currentRoomCode, saveToCloud) => {
    const _connected = isCloudConnected ?? window.isCloudConnected;
    const _room      = currentRoomCode   ?? window.currentRoomCode;
    const _saveFn    = saveToCloud       ?? window.saveToCloud;

    const currentYear = State.workspace?.schoolConfig?.schoolYear || DEFAULT_SCHOOL_YEAR;
    localStorage.setItem(getStorageKey(currentYear), JSON.stringify(State.workspace));
    localStorage.setItem('last_active_school_year', currentYear);
    registerSchoolYear(currentYear);
    if (_connected && _room && typeof _saveFn === 'function') {
        _saveFn(_room, State.workspace);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// loadState — restores workspace from localStorage with legacy migration
// ─────────────────────────────────────────────────────────────────────────────
export const loadState = () => {
    const lastActiveYear = localStorage.getItem('last_active_school_year') || DEFAULT_SCHOOL_YEAR;
    const saved = localStorage.getItem(getStorageKey(lastActiveYear))
               || localStorage.getItem('elem_program_matrix_v6'); // legacy key fallback

    if (saved) {
        State.workspace = migrateLegacyData(JSON.parse(saved));
    } else {
        State.workspace = migrateLegacyData(JSON.parse(JSON.stringify(defaultState)));
        if (lastActiveYear !== DEFAULT_SCHOOL_YEAR) {
            // Blank slate for a new school year
            State.workspace.teachers = [];
            State.workspace.classes  = [];
            State.workspace.advisers = {};
        }
    }
    State.workspace.schoolConfig.schoolYear = lastActiveYear;
};

// ─────────────────────────────────────────────────────────────────────────────
// Program / school-year switching (invoked from HTML onclick via window.xxx)
// Uses window.renderAll / window.showToast (set by app.js) to avoid circular
// imports.
// ─────────────────────────────────────────────────────────────────────────────
export const switchClassProgram = (programId) => {
    if (!State.workspace) return;
    const program = State.workspace.programs?.find(p => p.id === programId);
    if (!program) return;

    State.workspace.activeProgramId = programId;
    const tabMap = {
        'prog-master-kinder': 'master_kinder',
        'prog-master-g12':    'master_g12',
        'prog-master-g36':    'master',
    };
    State.workspace.activeTab = tabMap[programId] ?? 'program';
    saveState();

    if (window.currentView !== 'schedule' && typeof window.setMainView === 'function') {
        window.setMainView('schedule');
    }
    if (typeof window.renderAll === 'function')           window.renderAll();
    if (typeof window.renderSavedSchedules === 'function') window.renderSavedSchedules();
    if (typeof lucide !== 'undefined')                    lucide.createIcons();
    if (typeof window.showToast === 'function')           window.showToast(`Switched program to ${program.name}`);
};

export const switchSchoolYear = (newYear) => {
    if (State.workspace) saveState();
    if (window.collapsedYears) {
        const idx = window.collapsedYears.indexOf(newYear);
        if (idx !== -1) window.collapsedYears.splice(idx, 1);
    }
    localStorage.setItem('last_active_school_year', newYear);
    loadState();
    if (typeof window.renderAll === 'function')           window.renderAll();
    if (typeof window.renderSavedSchedules === 'function') window.renderSavedSchedules();
    if (typeof lucide !== 'undefined')                    lucide.createIcons();
    if (typeof window.showToast === 'function')           window.showToast(`Switched to ${newYear}`);
};

// ─────────────────────────────────────────────────────────────────────────────
// Expose everything on window so that legacy defer script (app.js) can call
// these as bare function names in non-strict mode:
//   saveState()  →  window.saveState()    ✅
//   loadState()  →  window.loadState()    ✅
//   migrateLegacyData(…)  →  window.migrateLegacyData(…)  ✅
// ─────────────────────────────────────────────────────────────────────────────
window.State               = State;
window.saveState           = saveState;
window.loadState           = loadState;
window.getAllSchoolYears    = getAllSchoolYears;
window.registerSchoolYear  = registerSchoolYear;
window.switchClassProgram  = switchClassProgram;
window.switchSchoolYear    = switchSchoolYear;
window.migrateLegacyData   = migrateLegacyData; // called directly in app.js
