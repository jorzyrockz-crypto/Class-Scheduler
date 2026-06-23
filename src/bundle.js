
// --- BUNDLED FROM: src/utils.js ---
const generateId = (prefix) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

const escapeHtml = (unsafe) => (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const formatTo12Hour = (timeStr) => {
    if (!timeStr) return "";
    const parts = timeStr.split(':');
    if (parts.length !== 2) return timeStr;
    let hour = parseInt(parts[0], 10);
    const mins = parts[1];
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${mins} ${ampm}`;
};

const timeToMins = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
};

const minsToTime = (mins) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};


// --- BUNDLED FROM: src/theme.js ---
const teacherColors = {
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-800', badge: 'bg-yellow-200 text-yellow-955' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-800', badge: 'bg-orange-200 text-orange-955' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-800', badge: 'bg-blue-200 text-blue-955' },
    teal: { bg: 'bg-teal-50', border: 'border-teal-400', text: 'text-teal-800', badge: 'bg-teal-200 text-teal-955' },
    lime: { bg: 'bg-lime-50', border: 'border-lime-400', text: 'text-lime-800', badge: 'bg-lime-200 text-lime-955' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-800', badge: 'bg-purple-200 text-purple-955' },
    rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', badge: 'bg-rose-200 text-rose-955' },
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-400', text: 'text-indigo-800', badge: 'bg-indigo-200 text-indigo-955' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', badge: 'bg-amber-200 text-amber-955' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', badge: 'bg-emerald-200 text-emerald-955' },
    pink: { bg: 'bg-pink-50', border: 'border-pink-400', text: 'text-pink-800', badge: 'bg-pink-200 text-pink-955' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-400', text: 'text-cyan-800', badge: 'bg-cyan-200 text-cyan-955' },
    violet: { bg: 'bg-violet-50', border: 'border-violet-400', text: 'text-violet-800', badge: 'bg-violet-200 text-violet-955' },
    fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', badge: 'bg-fuchsia-200 text-fuchsia-955' },
    sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', badge: 'bg-sky-200 text-sky-955' }
};
const hexBadgeColor = {
    yellow: "bg-yellow-400", orange: "bg-orange-400", blue: "bg-blue-400", teal: "bg-teal-400", lime: "bg-lime-400",
    purple: "bg-purple-400", rose: "bg-rose-400", indigo: "bg-indigo-400", amber: "bg-amber-400", emerald: "bg-emerald-400",
    pink: "bg-pink-400", cyan: "bg-cyan-400", violet: "bg-violet-400", fuchsia: "bg-fuchsia-400", sky: "bg-sky-400"
};
const hexTextColors = {
    yellow: "text-yellow-955", orange: "text-orange-955", blue: "text-white", teal: "text-teal-955", lime: "text-lime-955",
    purple: "text-white", rose: "text-white", indigo: "text-white", amber: "text-amber-955", emerald: "text-white",
    pink: "text-white", cyan: "text-cyan-955", violet: "text-white", fuchsia: "text-white", sky: "text-slate-900"
};




// --- BUNDLED FROM: src/defaults.js ---
const initialSubjects = [
    {id: "s-fil", name: "FILIPINO"}, {id: "s-sci", name: "SCIENCE"},
    {id: "s-mat", name: "MATH"}, {id: "s-eng", name: "ENGLISH"},
    {id: "s-ap", name: "AP"}, {id: "s-epp", name: "EPP"},
    {id: "s-esp", name: "ESP"}, {id: "s-gmrc", name: "GMRC"},
    {id: "s-mab", name: "MAKABANSA"}, {id: "s-nrp", name: "NRP (30 MIN)"},
    {id: "s-nmp", name: "NMP (National Math Program)"}, {id: "s-hgp", name: "HGP"},
    {id: "s-map", name: "MAPEH"}
];
const initialTeachers = [
    {id: "t-em", name: "E.M. AGUSTIN", color: "yellow"},
    {id: "t-md", name: "M.D. LOZADA", color: "orange"},
    {id: "t-rq", name: "R.Q. VICENTE", color: "blue"},
    {id: "t-js", name: "J.S. DINGLASAN", color: "teal"},
    {id: "t-lb", name: "L.B. CUADRANTE", color: "purple"},
    {id: "t-lf", name: "L. FUENTES", color: "lime"}
];
const initialTimeSlots = [
    // Standard Flag Ceremony
    {id: "ts-flag", start: "07:30", end: "07:45", mins: 15, label: "FLAG CEREMONY", type: "universal", group: "all"},
    
    // Kindergarten Routine slots
    {id: "ts-k-meet", start: "07:45", end: "08:00", mins: 15, type: "academic", group: "kinder"},
    {id: "ts-k-circle1", start: "08:00", end: "08:45", mins: 45, type: "academic", group: "kinder"},
    {id: "ts-k-recess", start: "08:45", end: "09:00", mins: 15, label: "SUPERVISED RECESSED", type: "universal", group: "kinder"},
    {id: "ts-k-quiet", start: "09:00", end: "09:10", mins: 10, label: "Quiet / Nap Time", type: "universal", group: "kinder"},
    {id: "ts-k-circle2", start: "09:10", end: "09:50", mins: 40, type: "academic", group: "kinder"},
    {id: "ts-k-play", start: "09:50", end: "10:25", mins: 35, type: "academic", group: "kinder"},
    {id: "ts-k-wrap", start: "10:25", end: "10:45", mins: 20, type: "academic", group: "kinder"},
    {id: "ts-k-dismiss", start: "10:45", end: "10:55", mins: 10, label: "Dismissal Time", type: "universal", group: "kinder"},
     // Grades 1-2 Slots (40 mins each)
    {id: "ts-g12-r1", start: "07:45", end: "08:25", mins: 40, type: "academic", group: "g12"},
    {id: "ts-g12-r2", start: "08:25", end: "09:05", mins: 40, type: "academic", group: "g12"},
    {id: "ts-g12-brk1", start: "09:05", end: "09:20", mins: 15, label: "HEALTH BREAK", type: "universal", group: "g12"},
    {id: "ts-g12-r3", start: "09:20", end: "10:00", mins: 40, type: "academic", group: "g12"},
    {id: "ts-g12-r4", start: "10:00", end: "10:40", mins: 40, type: "academic", group: "g12"},
    {id: "ts-g12-r5", start: "10:40", end: "11:20", mins: 40, type: "academic", group: "g12"},
    {id: "ts-g12-brk2", start: "11:20", end: "12:35", mins: 75, label: "HEALTH BREAK (LUNCH)", type: "universal", group: "g12"},
    {id: "ts-g12-r6", start: "12:35", end: "13:15", mins: 40, type: "academic", group: "g12"},
    {id: "ts-g12-r7", start: "13:15", end: "13:55", mins: 40, type: "academic", group: "g12"},
    {id: "ts-g12-r8", start: "13:55", end: "14:35", mins: 40, type: "academic", group: "g12"},
    {id: "ts-g12-r9", start: "14:35", end: "15:15", mins: 40, type: "academic", group: "g12"},
    {id: "ts-g12-collab", start: "15:15", end: "15:30", mins: 15, label: "Collaborative Session", type: "universal", group: "g12"},
     // Grades 3-6 Slots (45 mins each)
    {id: "ts-r1", start: "07:45", end: "08:30", mins: 45, type: "academic", group: "g36"},
    {id: "ts-r2", start: "08:30", end: "09:15", mins: 45, type: "academic", group: "g36"},
    {id: "ts-brk1", start: "09:15", end: "09:30", mins: 15, label: "HEALTH BREAK", type: "universal", group: "g36"},
    {id: "ts-r3", start: "09:30", end: "10:15", mins: 45, type: "academic", group: "g36"},
    {id: "ts-r4", start: "10:15", end: "11:00", mins: 45, type: "academic", group: "g36"},
    {id: "ts-r5", start: "11:00", end: "11:45", mins: 45, type: "academic", group: "g36"},
    {id: "ts-brk2", start: "11:45", end: "13:00", mins: 75, label: "HEALTH BREAK (LUNCH)", type: "universal", group: "g36"},
    {id: "ts-r6", start: "13:00", end: "13:45", mins: 45, type: "academic", group: "g36"},
    {id: "ts-r7", start: "13:45", end: "14:30", mins: 45, type: "academic", group: "g36"},
    {id: "ts-r8", start: "14:30", end: "15:15", mins: 45, type: "academic", group: "g36"},
    {id: "ts-r9", start: "15:15", end: "15:45", mins: 30, type: "academic", group: "g36"},
    {id: "ts-collab", start: "15:45", end: "16:00", mins: 15, label: "Collaborative Session / Intervention", type: "universal", group: "g36"}
];
const initialSections = [
    {id: "sec-k-faith", name: "Faith", grade: "Kindergarten"},
    {id: "sec-g1-hope", name: "Hope", grade: "Grade 1"},
    {id: "sec-g2-charity", name: "Charity", grade: "Grade 2"},
    {id: "sec-g3-joy", name: "Joy", grade: "Grade 3"},
    {id: "sec-g4-gold", name: "Gold", grade: "Grade 4"},
    {id: "sec-g5-diamond", name: "Diamond", grade: "Grade 5"},
    {id: "sec-g6-ruby", name: "Ruby", grade: "Grade 6"}
];
const initialClasses = [
    { id: "c-1", subjectId: "s-fil", grade: "Grade 3", teacherId: "t-em", timeSlotId: "ts-r1", day: "master" },
    { id: "c-2", subjectId: "s-sci", grade: "Grade 4", teacherId: "t-md", timeSlotId: "ts-r1", day: "master" },
    { id: "c-3", subjectId: "s-mat", grade: "Grade 5", teacherId: "t-rq", timeSlotId: "ts-r1", day: "master" },
    { id: "c-4", subjectId: "s-eng", grade: "Grade 6", teacherId: "t-js", timeSlotId: "ts-r1", day: "master" }
];
const defaultAdvisers = {
    "Kindergarten": "t-lb",
    "Grade 1": "t-lf",
    "Grade 2": "t-md",
    "Grade 3": "t-em", 
    "Grade 4": "t-md",  
    "Grade 5": "t-rq",   
    "Grade 6": "t-js"   
};
const defaultSchoolConfig = {
    region: "Region VI - Western Visayas",
    division: "Division of Aklan",
    district: "District of Balete",
    schoolName: "OQUENDO ELEMENTARY SCHOOL",
    schoolAddress: "Oquendo, Balete, Aklan",
    schoolYear: "S.Y. 2025-2026",
    logoLeft: "", 
    logoRight: "",
    signatory1Name: "JOHN RUSSELL L. GUADALUPE",
    signatory1Title: "TIII/OIC",
    signatory2Name: "MA. ROWENA L. BIROL",
    signatory2Title: "HT-IV / HTID"
};
const defaultState = {
    subjects: initialSubjects,
    teachers: initialTeachers,
    classes: initialClasses,
    advisers: defaultAdvisers,
    timeSlots: initialTimeSlots, 
    grades: ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"], 
    sections: initialSections,
    schoolConfig: defaultSchoolConfig,
    activeTab: "master", 
    gradelevelFilter: "Grade 4",
    gradelevelDayFilter: "mon",
    rippleCascadeEnabled: true
};




// --- BUNDLED FROM: src/stateMigration.js ---
const migrateLegacyData = (state) => {
    if (!state.timeSlots || state.timeSlots.length === 0) {
        state.timeSlots = JSON.parse(JSON.stringify(initialTimeSlots));
    } else {
        state.timeSlots.forEach(ts => {
            if (ts.id === 'ts-r10') {
                ts.group = 'g36';
            }
        });

        state.timeSlots.forEach(ts => {
            if (!ts.group) {
                if (ts.id.startsWith('ts-k-') || ts.id === 'ts-k-recess' || ts.id === 'ts-k-quiet' || ts.id === 'ts-k-dismiss') {
                    ts.group = 'kinder';
                } else if (ts.id.startsWith('ts-g12-')) {
                    ts.group = 'g12';
                } else if (ts.id === 'ts-flag') {
                    ts.group = 'all';
                } else {
                    ts.group = 'g36';
                }
            }
        });

        const hasKinderSlots = state.timeSlots.some(ts => ts.group === 'kinder');
        if (!hasKinderSlots) {
            const kinderSlots = initialTimeSlots.filter(ts => ts.group === 'kinder');
            state.timeSlots = [...state.timeSlots, ...kinderSlots];
        }
        const hasG12Slots = state.timeSlots.some(ts => ts.group === 'g12');
        if (!hasG12Slots) {
            const g12Slots = initialTimeSlots.filter(ts => ts.group === 'g12');
            state.timeSlots = [...state.timeSlots, ...g12Slots];
        }
        const hasG36Slots = state.timeSlots.some(ts => ts.group === 'g36');
        if (!hasG36Slots) {
            const g36Slots = initialTimeSlots.filter(ts => ts.group === 'g36');
            state.timeSlots = [...state.timeSlots, ...g36Slots];
        }
    }

    if (!state.schoolConfig) state.schoolConfig = JSON.parse(JSON.stringify(defaultSchoolConfig));
    if (!state.advisers) state.advisers = {};
    if (state.rippleCascadeEnabled === undefined) state.rippleCascadeEnabled = true;

    const romanArabicMap = {
        "Grade I": "Grade 1", "Grade II": "Grade 2", "Grade III": "Grade 3",
        "Grade IV": "Grade 4", "Grade V": "Grade 5", "Grade VI": "Grade 6",
        "Kinder": "Kindergarten"
    };

    if (state.grades) {
        state.grades = state.grades.map(g => romanArabicMap[g] || g);
    } else {
        state.grades = ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];
    }

    const normalizedAdvisers = {};
    Object.keys(state.advisers || {}).forEach(k => {
        const normKey = romanArabicMap[k] || k;
        normalizedAdvisers[normKey] = state.advisers[k];
    });
    state.advisers = normalizedAdvisers;

    if (state.sections) {
        state.sections.forEach(sec => {
            sec.grade = romanArabicMap[sec.grade] || sec.grade;
        });
    } else {
        state.sections = JSON.parse(JSON.stringify(initialSections));
    }

    if (state.classes) {
        state.classes.forEach(c => {
            c.grade = romanArabicMap[c.grade] || c.grade;
            if (c.sectionId === undefined) c.sectionId = '';

            if (c.day !== 'master' && !c.sectionId) {
                const targetSec = state.sections.find(s => s.grade === c.grade);
                if (targetSec) c.sectionId = targetSec.id;
            }
        });
    } else {
        state.classes = JSON.parse(JSON.stringify(initialClasses));
    }

    if (state.classes && state.classes.filter(c => c.grade === 'Kindergarten').length === 0) {
        state.classes.push(
            { id: "c-k1", subjectId: "s-gmrc", grade: "Kindergarten", teacherId: "t-lb", timeSlotId: "ts-k-meet", day: "master", sectionId: "" },
            { id: "c-k2", subjectId: "s-mab", grade: "Kindergarten", teacherId: "t-lb", timeSlotId: "ts-k-circle1", day: "master", sectionId: "" },
            { id: "c-k3", subjectId: "s-nrp", grade: "Kindergarten", teacherId: "t-lb", timeSlotId: "ts-k-circle2", day: "master", sectionId: "" }
        );
    }

    if (!state.activeTab) state.activeTab = "master";
    if (!state.gradelevelFilter) state.gradelevelFilter = "Grade 4";
    if (!state.gradelevelDayFilter) state.gradelevelDayFilter = "mon";

    return state;
};


// --- BUNDLED FROM: src/storage.js ---
const STORAGE_KEY = 'elem_program_matrix_v6';

const readSavedState = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
};

const writeSavedState = (state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};


// --- BUNDLED FROM: src/state.js ---
/**
 * state.js Ã¢â‚¬â€œ ES6 Module
 *
 * Single source of truth for all mutable application state.
 *
 * Ã¢â€â‚¬Ã¢â€â‚¬ Exports Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
 *   State          Plain object. ES6 modules import this and mutate its
 *                  properties (State.workspace, State.draggedBlockId, Ã¢â‚¬Â¦).
 *
 *   saveState      Persists workspace to localStorage + optional cloud sync.
 *                  Works with BOTH call signatures:
 *                    saveState()                          Ã¢â€ Â legacy app.js
 *                    saveState(connected, room, fn)       Ã¢â€ Â module scripts
 *
 *   loadState      Restores workspace from localStorage (with migration).
 *   getAllSchoolYears / registerSchoolYear / switchClassProgram / switchSchoolYear
 *
 * Ã¢â€â‚¬Ã¢â€â‚¬ Backwards Compatibility Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
 *   Every State property is also exposed on window via a getter/setter so that
 *   the legacy defer script (app.js) can still read/write them as bare global
 *   variables without modification:
 *
 *     workspaceState = newObj          Ã¢â€ â€™  window.workspaceState setter
 *                                      Ã¢â€ â€™  State.workspace = newObj   Ã¢Å“â€¦
 *
 *     draggedBlockId = "xyz"           Ã¢â€ â€™  window.draggedBlockId setter
 *                                      Ã¢â€ â€™  State.draggedBlockId = "xyz" Ã¢Å“â€¦
 *
 *   This works because app.js is a non-strict plain script; bare assignments
 *   to undeclared identifiers resolve to window.xxx.
 */

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
// The State object Ã¢â‚¬â€ plain data, mutated in place by all callers
// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
const State = {
    // Ã¢â€â‚¬Ã¢â€â‚¬ Workspace data Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    workspace: null,

    // Ã¢â€â‚¬Ã¢â€â‚¬ Drag-and-drop Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    draggedBlockId:       null,
    activeQuickMoveId:    null,

    // Ã¢â€â‚¬Ã¢â€â‚¬ Sidebar / panel Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    activeResourceTab:    'school',

    // Ã¢â€â‚¬Ã¢â€â‚¬ Active selections Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    activeSelectedCardId:  null,
    activeTeacherFilterId: null,
    expandedTeacherId:     null,

    // Ã¢â€â‚¬Ã¢â€â‚¬ Filters Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    activeTimeSlotFilter: 'all',
    summaryFilter:        'all',
    summarySearchQuery:   '',

    // Ã¢â€â‚¬Ã¢â€â‚¬ Inline editor Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    inlineEditingSlotId:  null,

    // Ã¢â€â‚¬Ã¢â€â‚¬ Modal edit trackers Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    editingTeacherId:     null,
    editingSubjectId:     null,
    editingSectionId:     null,
    editingTimeSlotId:    null,
};

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
// Window bridge: define window.workspaceState Ã¢â€ â€ State.workspace
// and window.<key>              Ã¢â€ â€ State.<key>
// so that app.js bare assignments hit these setters.
// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
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

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
// Storage helpers
// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
const DEFAULT_SCHOOL_YEAR = 'S.Y. 2025-2026';

const getStorageKey = (year) =>
    year
        ? `elem_program_matrix_v6_${year.replace(/[^a-zA-Z0-9-]/g, '_')}`
        : 'elem_program_matrix_v6';

const getAllSchoolYears = () => {
    try { return JSON.parse(localStorage.getItem('school_years_index') || '[]'); }
    catch { return []; }
};

const registerSchoolYear = (year) => {
    if (!year) return;
    const years = getAllSchoolYears();
    if (!years.includes(year)) {
        years.push(year);
        localStorage.setItem('school_years_index', JSON.stringify(years));
    }
};

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
// saveState
// Dual call signature support:
//   saveState()                              Ã¢â€ Â called by app.js (no args)
//   saveState(isConnected, room, saveFn)     Ã¢â€ Â called by module scripts
// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
const saveState = (isCloudConnected, currentRoomCode, saveToCloud) => {
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

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
// loadState Ã¢â‚¬â€ restores workspace from localStorage with legacy migration
// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
const loadState = () => {
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

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
// Program / school-year switching (invoked from HTML onclick via window.xxx)
// Uses window.renderAll / window.showToast (set by app.js) to avoid circular
// imports.
// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
const switchClassProgram = (programId) => {
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

const switchSchoolYear = (newYear) => {
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

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
// Expose everything on window so that legacy defer script (app.js) can call
// these as bare function names in non-strict mode:
//   saveState()  Ã¢â€ â€™  window.saveState()    Ã¢Å“â€¦
//   loadState()  Ã¢â€ â€™  window.loadState()    Ã¢Å“â€¦
//   migrateLegacyData(Ã¢â‚¬Â¦)  Ã¢â€ â€™  window.migrateLegacyData(Ã¢â‚¬Â¦)  Ã¢Å“â€¦
// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
window.State               = State;
window.saveState           = saveState;
window.loadState           = loadState;
window.getAllSchoolYears    = getAllSchoolYears;
window.registerSchoolYear  = registerSchoolYear;
window.switchClassProgram  = switchClassProgram;
window.switchSchoolYear    = switchSchoolYear;
window.migrateLegacyData   = migrateLegacyData; // called directly in app.js


// --- BUNDLED FROM: src/dragDrop.js ---
let _showToast = null;
let _renderAll = null;

const setupDragDrop = (deps) => {
    _showToast = deps.showToast;
    _renderAll = deps.renderAll;
};

const executeDragMoveMaster = (blockId, grade, slotId) => {
    const block = State.workspace.classes.find(c => c.id === blockId);
    if (block) {
        const displaced = State.workspace.classes.find(c => 
            c.id !== blockId && 
            c.day === 'master' && 
            c.timeSlotId === slotId && 
            c.grade === grade
        );
        if (displaced) {
            State.workspace.classes = State.workspace.classes.filter(c => c.id !== displaced.id);
            if (_showToast) _showToast(`Displaced block was removed`);
        }

        block.grade = grade;
        block.sectionId = ''; 
        block.timeSlotId = slotId;
        block.day = 'master';
        saveState(isCloudConnected, currentRoomCode, saveToCloud);
        if (_renderAll) _renderAll();
        if (_showToast) _showToast("Schedule updated!");
    }
    State.draggedBlockId = null;
};

const executeDragMoveSection = (blockId, sectionId, slotId, dayFilter) => {
    const block = State.workspace.classes.find(c => c.id === blockId);
    const targetSection = State.workspace.sections.find(s => s.id === sectionId);
    if (block && targetSection) {
        const displaced = State.workspace.classes.find(c => 
            c.id !== blockId && 
            c.day === dayFilter && 
            c.timeSlotId === slotId && 
            c.sectionId === sectionId
        );
        if (displaced) {
            State.workspace.classes = State.workspace.classes.filter(c => c.id !== displaced.id);
            if (_showToast) _showToast(`Displaced block was removed`);
        }

        block.grade = targetSection.grade;
        block.sectionId = sectionId;
        block.timeSlotId = slotId;
        block.day = dayFilter;
        saveState(isCloudConnected, currentRoomCode, saveToCloud);
        if (_renderAll) _renderAll();
        if (_showToast) _showToast("Schedule updated!");
    }
    State.draggedBlockId = null;
};

const toggleRippleCascade = (checked) => {
    State.workspace.rippleCascadeEnabled = checked;
    saveState(isCloudConnected, currentRoomCode, saveToCloud);
    if (_showToast) _showToast(checked ? "Domino Ripple Cascading enabled!" : "Domino Ripple Cascading disabled!");
};


// --- BUNDLED FROM: src/scheduling.js ---
let _showToast = null;
let _renderAll = null;
let _renderResourceLists = null;

const setupScheduling = (deps) => {
    _showToast = deps.showToast;
    _renderAll = deps.renderAll;
    _renderResourceLists = deps.renderResourceLists;
};

const checkTeacherCollision = (block) => {
    if (!block.timeSlotId || block.day === 'pool') return false;
    const simultaneousBlocks = State.workspace.classes.filter(c => 
        c.id !== block.id && 
        c.day === block.day && 
        c.timeSlotId === block.timeSlotId
    );
    return simultaneousBlocks.some(c => c.teacherId === block.teacherId);
};

const checkDuplicateSubject = (block) => {
    if (!block.timeSlotId || block.day === 'pool') return false;
    const duplicateBlocks = State.workspace.classes.filter(c => {
        if (c.id === block.id || c.day !== block.day || c.timeSlotId !== block.timeSlotId) return false;
        if (block.day === 'master') {
            return c.grade === block.grade && c.subjectId === block.subjectId;
        } else {
            return c.sectionId === block.sectionId && c.subjectId === block.subjectId;
        }
    });
    return duplicateBlocks.length > 0;
};

const assignTeacherQuick = (teacherId) => {
    if (!State.activeSelectedCardId) return;
    const block = State.workspace.classes.find(c => c.id === State.activeSelectedCardId);
    if (block) {
        block.teacherId = teacherId;
        
        const isCollision = checkTeacherCollision(block);
        if (isCollision) {
            if (_showToast) _showToast("Warning: Teacher is double-booked on this time slot!", "error");
        } else {
            if (_showToast) _showToast("Teacher assigned successfully!");
        }
        saveState(isCloudConnected, currentRoomCode, saveToCloud);
        State.activeSelectedCardId = null; 
        if (_renderAll) _renderAll();
    }
};

const getLiveStatus = (teacherId) => {
    const now = new Date();
    const dayMap = [null, 'mon', 'tue', 'wed', 'thu', 'fri', null];
    const currentDayStr = dayMap[now.getDay()]; 
    
    if (!currentDayStr) return "Available (Weekend)";

    const currentMins = now.getHours() * 60 + now.getMinutes();

    const activeSlot = State.workspace.timeSlots.find(ts => {
        if (ts.type === 'universal') return false; 
        const startMins = timeToMins(ts.start);
        const endMins = timeToMins(ts.end);
        return currentMins >= startMins && currentMins < endMins;
    });

    if (activeSlot) {
        const activeClass = State.workspace.classes.find(c => 
            c.teacherId === teacherId && 
            (c.day === currentDayStr || c.day === 'master') && 
            c.timeSlotId === activeSlot.id
        );
        if (activeClass) {
            const subject = State.workspace.subjects.find(s => s.id === activeClass.subjectId);
            const subjName = subject ? subject.name : "Class";
            const room = activeClass.sectionId ? 
                (State.workspace.sections.find(s => s.id === activeClass.sectionId)?.name || activeClass.grade) : 
                activeClass.grade;
            return `Currently teaching <span class="font-bold text-slate-800">${subjName}</span> for <span class="font-bold text-slate-800">${room}</span>`;
        }
    }
    
    const futureClasses = State.workspace.classes.filter(c => 
        c.teacherId === teacherId && 
        (c.day === currentDayStr || c.day === 'master')
    ).map(c => {
        const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
        return { ...c, startMins: ts ? timeToMins(ts.start) : 0 };
    }).filter(c => c.startMins > currentMins).sort((a, b) => a.startMins - b.startMins);

    if (futureClasses.length > 0) {
        const nextClass = futureClasses[0];
        const diff = nextClass.startMins - currentMins;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        let timeStr = "";
        if (hours > 0 && mins > 0) timeStr = `${hours} hours and ${mins} minutes`;
        else if (hours > 0) timeStr = `${hours} hours`;
        else timeStr = `${mins} minutes`;
        return `Available: Next class in <span class="font-bold text-slate-800">${timeStr}</span>.`;
    }

    return "Available (No more classes today)";
};


// --- BUNDLED FROM: src/importExport.js ---
let _showToast = null;
let _setActiveTab = null;

const setupImportExport = (deps) => {
    _showToast = deps.showToast;
    _setActiveTab = deps.setActiveTab;
};

const exportData = () => {
    try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(State.workspace, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "school_program_matrix_backup.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        if (_showToast) _showToast("Class program backup downloaded.");
    } catch (err) {
        if (_showToast) _showToast("Unable to export data locally.", "error");
    }
};

const triggerImport = () => {
    document.getElementById('import-file-input').click();
};

const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedState = JSON.parse(event.target.result);
            if (importedState.subjects && importedState.teachers) {
                State.workspace = migrateLegacyData(importedState);
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                if (_setActiveTab) _setActiveTab(State.workspace.activeTab);
                if (_showToast) _showToast("Class Program backup imported!");
            } else {
                if (_showToast) _showToast("Invalid backup file format.", "error");
            }
        } catch (err) {
            if (_showToast) _showToast("Failed to read the backup data.", "error");
        }
    };
    reader.readAsText(file);
    e.target.value = '';
};


// --- BUNDLED FROM: src/cloudSync.js ---
let db = null;
let auth = null;
let currentRoomCode = "default";
let isCloudConnected = false;
let unsubscribeRoom = null;
let isCloudEnabled = false;
let appId = 'default-app-id';
let currentUser = null;
let currentSchoolId = null;

function setSyncSchool(schoolId, user) {
    currentUser = user;
    currentSchoolId = schoolId;
    if (user && schoolId) {
        isCloudConnected = true;
        listenToRoom(currentRoomCode);
    } else {
        isCloudConnected = false;
        if (unsubscribeRoom) unsubscribeRoom();
        updateCloudUI('disabled');
    }
}

// Dependencies injected from app.js
let _showToast = null;
let _renderAll = null;

const setupCloudSync = (config, token, id, deps) => {
    appId = id;
    _showToast = deps.showToast;
    _renderAll = deps.renderAll;

    if (config) {
        try {
            const app = initializeApp(config);
            db = getFirestore(app);
            auth = getAuth(app);
            isCloudEnabled = true;
        } catch (err) {
            console.error("Cloud configuration failed:", err);
        }
    }
};

async function initCloudSync(initialAuthToken) {
    if (!isCloudEnabled) {
        updateCloudUI('disabled');
        return;
    }
    updateCloudUI('connecting');
    try {
        let user;
        if (initialAuthToken) {
            const cred = await signInWithCustomToken(auth, initialAuthToken);
            user = cred.user;
        } else {
            const cred = await signInAnonymously(auth);
            user = cred.user;
        }
        if (user) {
            isCloudConnected = true;
            listenToRoom(currentRoomCode);
        }
    } catch (err) {
        console.error("Cloud connection failed:", err);
        updateCloudUI('failed');
    }
}

function listenToRoom(roomCode) {
    if (unsubscribeRoom) unsubscribeRoom();
    updateCloudUI('connecting');
    
    const activeDb = db || window.db;
    if (!activeDb) {
        console.error("Firestore database is not initialized.");
        updateCloudUI('disabled');
        return;
    }
    const docRef = (currentUser && currentSchoolId)
        ? doc(activeDb, 'artifacts', appId, 'schools', currentSchoolId, 'schedules', roomCode)
        : doc(activeDb, 'artifacts', appId, 'public', 'data', 'schedules', roomCode);
    unsubscribeRoom = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const incomingData = docSnap.data();
            if (incomingData && incomingData.subjects && incomingData.teachers) {
                State.workspace = migrateLegacyData(incomingData);
                writeSavedState(State.workspace);
                updateCloudUI('connected');
                if (_renderAll) _renderAll();
            }
        } else {
            updateCloudUI('connected');
            saveToCloud(roomCode, State.workspace);
        }
    }, (error) => {
        console.error("Firestore room subscription error:", error);
        updateCloudUI('error');
    });
}

async function saveToCloud(roomCode, data) {
    const activeDb = db || window.db;
    if (!isCloudConnected || !activeDb) return;
    try {
        updateCloudUI('saving');
        const docRef = (currentUser && currentSchoolId)
            ? doc(activeDb, 'artifacts', appId, 'schools', currentSchoolId, 'schedules', roomCode)
            : doc(activeDb, 'artifacts', appId, 'public', 'data', 'schedules', roomCode);
        const cleanData = JSON.parse(JSON.stringify(data));
        await setDoc(docRef, cleanData);
        updateCloudUI('connected');
    } catch (err) {
        console.error("Failed to save to cloud:", err);
        updateCloudUI('error');
    }
}

function updateCloudUI(status) {
    const iconContainer = document.getElementById('cloud-indicator-icon');
    const statusText = document.getElementById('cloud-indicator-status');
    const activeRoomSpan = document.getElementById('cloud-active-room');

    if (!iconContainer || !statusText) return;

    if (activeRoomSpan) {
        activeRoomSpan.innerText = currentRoomCode.toUpperCase();
    }

    switch (status) {
        case 'disabled':
            iconContainer.className = "p-1.5 bg-slate-50 text-slate-400 rounded-lg border border-slate-100";
            iconContainer.innerHTML = '<i data-lucide="cloud-off" class="w-4 h-4"></i>';
            statusText.className = "text-[9px] font-bold text-slate-400 uppercase tracking-wider block";
            statusText.innerText = "Offline Mode";
            break;
        case 'connecting':
            iconContainer.className = "p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 animate-pulse";
            iconContainer.innerHTML = '<i data-lucide="cloud-lightning" class="w-4 h-4"></i>';
            statusText.className = "text-[9px] font-bold text-blue-500 uppercase tracking-wider block animate-pulse";
            statusText.innerText = "Connecting...";
            break;
        case 'connected':
            iconContainer.className = "p-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100";
            iconContainer.innerHTML = '<i data-lucide="cloud" class="w-4 h-4"></i>';
            statusText.className = "text-[9px] font-bold text-emerald-600 uppercase tracking-wider block";
            statusText.innerText = "Synced & Secured";
            break;
        case 'saving':
            iconContainer.className = "p-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 animate-spin";
            iconContainer.innerHTML = '<i data-lucide="refresh-cw" class="w-4 h-4"></i>';
            statusText.className = "text-[9px] font-bold text-amber-600 uppercase tracking-wider block";
            statusText.innerText = "Saving to Cloud...";
            break;
        case 'error':
        case 'failed':
            iconContainer.className = "p-1.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-100";
            iconContainer.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4"></i>';
            statusText.className = "text-[9px] font-bold text-rose-500 uppercase tracking-wider block";
            statusText.innerText = "Sync Failed";
            break;
    }
    if (window.lucide) window.lucide.createIcons();
}

function switchCloudRoom() {
    const roomInput = document.getElementById('cloud-room-input');
    if (!roomInput) return;
    const code = roomInput.value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (!code) {
        if (_showToast) _showToast("Please enter a valid alphanumeric room code.", "error");
        return;
    }
    currentRoomCode = code;
    if (isCloudConnected) {
        listenToRoom(currentRoomCode);
        if (_showToast) _showToast(`Switched to shared room: ${code.toUpperCase()}`);
    } else {
        if (_showToast) _showToast("Working locally. Room will connect once network starts.", "info");
    }
}


// --- BUNDLED FROM: src/conflictDiagnostics.js ---
const renderDiagnostics = (workspaceState, timeToMins, formatTo12Hour, escapeHtml, createLucideIcons) => {
    const listEl = document.getElementById('conflict-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    const conflicts = [];
    const scheduled = workspaceState.classes.filter(c => c.day !== 'pool');
    const sortedSlots = [...workspaceState.timeSlots].sort((a, b) => timeToMins(a.start) - timeToMins(b.start));
    const days = ['master', 'mon', 'tue', 'wed', 'thu', 'fri'];
    
    // 1. Double Booking Diagnostics
    scheduled.forEach(c1 => {
        scheduled.forEach(c2 => {
            if (c1.id !== c2.id && c1.day === c2.day && c1.timeSlotId === c2.timeSlotId && c1.teacherId === c2.teacherId) {
                const teacher = workspaceState.teachers.find(t => t.id === c1.teacherId);
                const tName = teacher ? teacher.name : "Unknown";
                const slot = workspaceState.timeSlots.find(s => s.id === c1.timeSlotId);
                const sName = slot ? `${formatTo12Hour(slot.start)}-${formatTo12Hour(slot.end)}` : "";
                const dayLabel = c1.day === 'master' ? 'Master Class' : c1.day.toUpperCase();
                const conflictMsg = `Double-booking: Teacher ${tName} is scheduled in multiple rooms at ${sName} on ${dayLabel}.`;
                if (!conflicts.some(x => x.msg === conflictMsg)) {
                    conflicts.push({ type: 'danger', msg: conflictMsg });
                }
            }
        });
    });

    // 2. Duplicate Subject Diagnostics
    scheduled.forEach(c1 => {
        scheduled.forEach(c2 => {
            if (c1.id !== c2.id && c1.day === c2.day && c1.timeSlotId === c2.timeSlotId) {
                if (c1.day === 'master' && c1.grade === c2.grade && c1.subjectId === c2.subjectId) {
                    const subject = workspaceState.subjects.find(s => s.id === c1.subjectId);
                    const subName = subject ? subject.name : "Unknown";
                    const conflictMsg = `Overlap: Duplicate Subject "${subName}" scheduled for ${c1.grade} during the same slot.`;
                    if (!conflicts.some(x => x.msg === conflictMsg)) {
                        conflicts.push({ type: 'warning', msg: conflictMsg });
                    }
                } else if (c1.day !== 'master' && c1.sectionId === c2.sectionId && c1.subjectId === c2.subjectId) {
                    const subject = workspaceState.subjects.find(s => s.id === c1.subjectId);
                    const subName = subject ? subject.name : "Unknown";
                    const section = workspaceState.sections.find(s => s.id === c1.sectionId);
                    const secName = section ? section.name : "Unknown";
                    const conflictMsg = `Overlap: Duplicate Subject "${subName}" scheduled for Section ${secName} during the same slot.`;
                    if (!conflicts.some(x => x.msg === conflictMsg)) {
                        conflicts.push({ type: 'warning', msg: conflictMsg });
                    }
                }
            }
        });
    });

    // 3. GMRC & HGP Pedagogical Rules
    scheduled.forEach(c => {
        const subject = workspaceState.subjects.find(s => s.id === c.subjectId);
        if (subject) {
            if (subject.name === 'GMRC' && c.day === 'fri') {
                const conflictMsg = `GMRC Conflict: GMRC is scheduled on a Friday for ${c.grade}. It should be taught Monday to Thursday.`;
                conflicts.push({ type: 'warning', msg: conflictMsg });
            }
            if (subject.name === 'HGP' && ['mon', 'tue', 'wed', 'thu'].includes(c.day)) {
                const conflictMsg = `HGP Placement: Homeroom Guidance Program (HGP) is scheduled on ${c.day.toUpperCase()} for ${c.grade}. It is recommended only on Fridays.`;
                conflicts.push({ type: 'warning', msg: conflictMsg });
            }
        }
    });

    // 4. Consecutive Hours Cap Alert
    workspaceState.teachers.forEach(teacher => {
        days.forEach(day => {
            let streak = 0;
            sortedSlots.forEach(slot => {
                if (slot.type === 'universal') {
                    streak = 0; 
                } else {
                    const isTeaching = workspaceState.classes.some(c => 
                        c.teacherId === teacher.id && 
                        c.day === day && 
                        c.timeSlotId === slot.id
                    );
                    if (isTeaching) {
                        streak++;
                        if (streak >= 4) {
                            const dayLabel = day === 'master' ? 'Master Class' : day.toUpperCase();
                            const conflictMsg = `Consecutive Teaching: Teacher ${teacher.name} is scheduled for 4+ consecutive academic blocks on ${dayLabel} without a break.`;
                            if (!conflicts.some(x => x.msg === conflictMsg)) {
                                conflicts.push({ type: 'warning', msg: conflictMsg });
                            }
                        }
                    } else {
                        streak = 0; 
                    }
                }
            });
        });
    });

    // 5. Daily Subject Clustering Detector
    days.forEach(day => {
        const dayClasses = workspaceState.classes.filter(c => c.day === day);
        const counts = {};
        dayClasses.forEach(c => {
            let key = '';
            if (day === 'master') {
                key = `${c.grade}_${c.subjectId}`;
            } else {
                key = `${c.sectionId}_${c.subjectId}`;
            }
            if (key) {
                counts[key] = (counts[key] || 0) + 1;
            }
        });

        dayClasses.forEach(c => {
            let key = '';
            let groupName = '';
            if (day === 'master') {
                key = `${c.grade}_${c.subjectId}`;
                groupName = c.grade;
            } else {
                if (c.sectionId) {
                    key = `${c.sectionId}_${c.subjectId}`;
                    const sec = workspaceState.sections.find(s => s.id === c.sectionId);
                    groupName = sec ? `${c.grade} (${sec.name})` : c.grade;
                }
            }

            if (key && counts[key] > 1) {
                const sub = workspaceState.subjects.find(s => s.id === c.subjectId);
                const subName = sub ? sub.name : 'Unknown';
                const dayLabel = day === 'master' ? 'Master Class' : day.toUpperCase();
                const conflictMsg = `Subject Clustering: ${groupName} is assigned the subject ${subName} ${counts[key]} times on ${dayLabel}.`;
                if (!conflicts.some(x => x.msg === conflictMsg)) {
                    conflicts.push({ type: 'warning', msg: conflictMsg });
                }
            }
        });
    });

    if (conflicts.length === 0) {
        listEl.innerHTML = `
            <div class="flex items-center gap-1.5 text-emerald-600 font-bold p-1 bg-emerald-50 rounded-lg font-semibold">
                <i data-lucide="check-circle-2" class="w-3.5 h-3.5 shrink-0"></i>
                <span>No conflicts or scheduling violations. All clear!</span>
            </div>
        `;
    } else {
        conflicts.forEach(conflict => {
            const styleClass = conflict.type === 'danger' 
                ? 'bg-red-50 border-l-2 border-red-500 text-red-700' 
                : 'bg-amber-50 border-l-2 border-amber-500 text-amber-700';
            const icon = conflict.type === 'danger' ? 'alert-octagon' : 'alert-triangle';
            
            listEl.innerHTML += `
                <div class="p-1.5 rounded flex items-start gap-1.5 ${styleClass} font-semibold">
                    <i data-lucide="${icon}" class="w-3 h-3 mt-0.5 shrink-0"></i>
                    <span class="leading-tight">${conflict.msg}</span>
                </div>
            `;
        });
    }
    createLucideIcons();
};

// --- BUNDLED FROM: src/ui.js ---
// Global variables provided by the container environment
                
        
        
        
        // --- DATA DEFAULTS ---
        
        
        
        

        
        
        
         
         
         
         
         

        // Edit trackers
        
        
        
         

        // Custom palettes
        

        const showToast = (message, type = "info") => {
            const toast = document.getElementById('custom-toast');
            const msgEl = document.getElementById('toast-message');
            const iconEl = document.getElementById('toast-icon');
            
            msgEl.innerText = message;
            if (type === 'error') {
                iconEl.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 text-red-400"></i>';
                toast.className = "fixed bottom-5 right-5 bg-red-950 text-red-100 border border-red-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 transform translate-y-0 opacity-100 transition-all duration-300 z-[100] text-sm font-semibold";
            } else {
                iconEl.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>';
                toast.className = "fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 transform translate-y-0 opacity-100 transition-all duration-300 z-[100] text-sm font-semibold";
            }
            lucide.createIcons();
            setTimeout(() => {
                toast.className = "fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 transform translate-y-20 opacity-0 transition-all duration-300 z-[100] text-sm font-semibold";
            }, 3000);
        };

        const showConfirm = (title, message, onConfirm) => {
            const modal = document.getElementById('confirm-modal');
            document.getElementById('confirm-title').innerText = title;
            document.getElementById('confirm-message').innerText = message;
            modal.style.display = 'flex';
            
            const cancelBtn = document.getElementById('confirm-cancel-btn');
            const okBtn = document.getElementById('confirm-ok-btn');
            
            const cleanup = () => {
                modal.style.display = 'none';
                const newCancelBtn = cancelBtn.cloneNode(true);
                const newOkBtn = okBtn.cloneNode(true);
                cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
                okBtn.parentNode.replaceChild(newOkBtn, okBtn);
            };
            
            document.getElementById('confirm-ok-btn').addEventListener('click', () => { onConfirm(); cleanup(); });
            document.getElementById('confirm-cancel-btn').addEventListener('click', () => { cleanup(); });
        };

        
        
        

        const updateAdviserMap = (grade, teacherId) => {
            State.workspace.advisers[grade] = teacherId;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderAll(); 
        };

        const updateSchoolConfig = (key, value) => {
            State.workspace.schoolConfig[key] = value;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderPrintDOM();
        };

        const handleLogoUpload = (e, side) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                State.workspace.schoolConfig[side] = event.target.result;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderPrintDOM();
                showToast(`${side === 'logoLeft' ? 'Left' : 'Right'} logo successfully saved.`);
            };
            reader.readAsDataURL(file);
        };

        const clearLogo = (side) => {
            State.workspace.schoolConfig[side] = "";
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderPrintDOM();
            showToast(`${side === 'logoLeft' ? 'Left' : 'Right'} logo cleared.`);
        };

        const renderPrintDOM = () => {
            const cfg = State.workspace.schoolConfig;
            
            document.getElementById('print-region').innerText = cfg.region || "";
            document.getElementById('print-division').innerText = cfg.division || "";
            document.getElementById('print-district').innerText = cfg.district || "";
            document.getElementById('print-schoolName').innerText = cfg.schoolName || "";
            document.getElementById('print-schoolAddress').innerText = cfg.schoolAddress || "";
            document.getElementById('print-sy').innerText = cfg.schoolYear || "";
            
            const leftContainer = document.getElementById('print-logo-left-container');
            const rightContainer = document.getElementById('print-logo-right-container');
            if (leftContainer) leftContainer.innerHTML = cfg.logoLeft ? `<img src="${cfg.logoLeft}" class="print-logo-img">` : `NO LOGO`;
            if (rightContainer) rightContainer.innerHTML = cfg.logoRight ? `<img src="${cfg.logoRight}" class="print-logo-img">` : `NO LOGO`;

            document.getElementById('print-sig1-name').innerText = cfg.signatory1Name || "";
            document.getElementById('print-sig1-title').innerText = cfg.signatory1Title || "";
            document.getElementById('print-sig2-name').innerText = cfg.signatory2Name || "";
            document.getElementById('print-sig2-title').innerText = cfg.signatory2Title || "";
        };

        const checkTeacherCollision = (block) => {
            if (!block.timeSlotId || block.day === 'pool') return false;
            const simultaneousBlocks = State.workspace.classes.filter(c => 
                c.id !== block.id && 
                c.day === block.day && 
                c.timeSlotId === block.timeSlotId
            );
            return simultaneousBlocks.some(c => c.teacherId === block.teacherId);
        };

        const checkDuplicateSubject = (block) => {
            if (!block.timeSlotId || block.day === 'pool') return false;
            const duplicateBlocks = State.workspace.classes.filter(c => {
                if (c.id === block.id || c.day !== block.day || c.timeSlotId !== block.timeSlotId) return false;
                if (block.day === 'master') {
                    return c.grade === block.grade && c.subjectId === block.subjectId;
                } else {
                    return c.sectionId === block.sectionId && c.subjectId === block.subjectId;
                }
            });
            return duplicateBlocks.length > 0;
        };

        window.addEventListener('beforeprint', () => {
            const titleEl = document.getElementById('print-doc-title');
            if (State.workspace.activeTab === 'master_kinder') {
                titleEl.innerText = `MASTER CLASS PROGRAM (KINDERGARTEN)`;
            } else if (State.workspace.activeTab === 'master_g12') {
                titleEl.innerText = `MASTER CLASS PROGRAM (GRADES 1 - 2)`;
            } else if (State.workspace.activeTab === 'master') {
                titleEl.innerText = `MASTER CLASS PROGRAM (GRADES 3 - 6)`;
            } else if (State.workspace.activeTab === 'summary') {
                titleEl.innerText = `TEACHING LOAD SUMMARY REPORT`;
            } else {
                const filter = State.workspace.gradelevelFilter;
                titleEl.innerText = `CLASS PROGRAM FOR ${filter}`;
            }
        });

        const populateGradelevelFilters = () => {
            const gradeSelect = document.getElementById('gradelevel-filter-select');
            gradeSelect.innerHTML = '';
            State.workspace.grades.forEach(g => {
                gradeSelect.add(new Option(g, g));
            });
            if (!State.workspace.grades.includes(State.workspace.gradelevelFilter)) {
                State.workspace.gradelevelFilter = State.workspace.grades[0] || '';
            }
            gradeSelect.value = State.workspace.gradelevelFilter;
            document.getElementById('gradelevel-day-select').value = State.workspace.gradelevelDayFilter || "mon";
        };

        const handleGradeFilterChange = (val) => {
            State.workspace.gradelevelFilter = val;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderAll();
        };

        const handleDayFilterChange = (val) => {
            State.workspace.gradelevelDayFilter = val;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderAll();
        };

        const setActiveTab = (tab) => {
            State.workspace.activeTab = tab;
            
            const tabs = ['master-kinder', 'master-g12', 'master', 'gradelevel', 'summary'];
            tabs.forEach(t => {
                const btn = document.getElementById(`tab-${t}`);
                if (!btn) return;
                const matches = t === 'master-kinder' && tab === 'master_kinder' || 
                                t === 'master-g12' && tab === 'master_g12' || 
                                t === tab;
                btn.className = matches 
                    ? 'px-4 py-2 text-xs font-bold rounded-lg border bg-emerald-600 text-white border-emerald-600 shadow-sm tab-active' 
                    : 'px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 bg-white text-slate-700';
            });
            
            const filterBar = document.getElementById('gradelevel-selector-bar');
            if (tab === 'gradelevel') {
                filterBar.classList.remove('hidden');
                populateGradelevelFilters();
            } else {
                filterBar.classList.add('hidden');
            }

            const sidebar = document.getElementById('sidebar-container');
            const workspace = document.getElementById('workspace-container');
            const summaryDashboard = document.getElementById('summary-dashboard-container');

            if (sidebar && workspace) {
                if (tab === 'summary') {
                    sidebar.classList.add('hidden', 'xl:hidden');
                    workspace.classList.remove('xl:col-span-5');
                    workspace.classList.add('xl:col-span-6');
                    if (summaryDashboard) {
                        summaryDashboard.classList.remove('hidden');
                        summaryDashboard.classList.add('flex');
                    }
                    State.summaryFilter = 'all';
                    State.summarySearchQuery = '';
                    const searchInput = document.getElementById('summary-search-input');
                    if (searchInput) searchInput.value = '';
                    const filters = ['all', 'overload', 'optimal', 'underload'];
                    filters.forEach(f => {
                        const btn = document.getElementById(`sum-filter-${f}`);
                        if (btn) {
                            if (f === 'all') {
                                btn.className = "px-3 py-1.5 text-[11px] font-bold rounded-lg border bg-emerald-600 text-white border-emerald-600 shadow-sm transition";
                            } else {
                                btn.className = "px-3 py-1.5 text-[11px] font-bold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 bg-white transition";
                            }
                        }
                    });
                } else {
                    sidebar.classList.remove('hidden', 'xl:hidden');
                    workspace.classList.remove('xl:col-span-6');
                    workspace.classList.add('xl:col-span-5');
                    if (summaryDashboard) {
                        summaryDashboard.classList.add('hidden');
                        summaryDashboard.classList.remove('flex');
                    }
                }
            }

            // Close active inline time edits
            State.inlineEditingSlotId = null;

            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderAll();
        };

        const getLiveStatus = (teacherId) => {
            const now = new Date();
            const dayMap = [null, 'mon', 'tue', 'wed', 'thu', 'fri', null];
            const currentDayStr = dayMap[now.getDay()]; 
            
            if (!currentDayStr) return "Available (Weekend)";

            const currentMins = now.getHours() * 60 + now.getMinutes();

            const activeSlot = State.workspace.timeSlots.find(ts => {
                if (ts.type === 'universal') return false; 
                const startMins = timeToMins(ts.start);
                const endMins = timeToMins(ts.end);
                return currentMins >= startMins && currentMins < endMins;
            });

            if (activeSlot) {
                const activeClass = State.workspace.classes.find(c => 
                    c.teacherId === teacherId && 
                    (c.day === currentDayStr || c.day === 'master') && 
                    c.timeSlotId === activeSlot.id
                );
                if (activeClass) {
                    const subject = State.workspace.subjects.find(s => s.id === activeClass.subjectId);
                    const subjName = subject ? subject.name : "Class";
                    const room = activeClass.sectionId ? 
                        (State.workspace.sections.find(s => s.id === activeClass.sectionId)?.name || activeClass.grade) : 
                        activeClass.grade;
                    return `Currently teaching <span class="font-bold text-slate-800">${subjName}</span> for <span class="font-bold text-slate-800">${room}</span>`;
                }
            }
            
            const futureClasses = State.workspace.classes.filter(c => 
                c.teacherId === teacherId && 
                (c.day === currentDayStr || c.day === 'master')
            ).map(c => {
                const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
                return { ...c, startMins: ts ? timeToMins(ts.start) : 0 };
            }).filter(c => c.startMins > currentMins).sort((a, b) => a.startMins - b.startMins);

            if (futureClasses.length > 0) {
                const nextClass = futureClasses[0];
                const diff = nextClass.startMins - currentMins;
                const hours = Math.floor(diff / 60);
                const mins = diff % 60;
                let timeStr = "";
                if (hours > 0 && mins > 0) timeStr = `${hours} hours and ${mins} minutes`;
                else if (hours > 0) timeStr = `${hours} hours`;
                else timeStr = `${mins} minutes`;
                return `Available: Next class in <span class="font-bold text-slate-800">${timeStr}</span>.`;
            }

            return "Available (No more classes today)";
        };

        const updateTimeSlotGroup = (slotId, newGroup) => {
            const slot = State.workspace.timeSlots.find(ts => ts.id === slotId);
            if (slot) {
                slot.group = newGroup;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderAll();
                renderResourceLists();
                showToast("Time slot segment group association updated!");
            }
        };

        const setTimeSlotFilter = (filter) => {
            State.activeTimeSlotFilter = filter;
            const filters = ['all', 'g36', 'g12', 'kinder', 'all_shared'];
            filters.forEach(f => {
                const btn = document.getElementById(`btn-ts-filter-${f}`);
                if (!btn) return;
                if (f === filter) {
                    btn.className = "flex-1 py-1 text-[9px] font-extrabold rounded-lg transition-all bg-white text-slate-800 shadow-xs";
                } else {
                    btn.className = "flex-1 py-1 text-[9px] font-extrabold rounded-lg transition-all text-slate-500 hover:text-slate-800";
                }
            });
            renderResourceLists();
        };

        const toggleTeacherFilter = (id) => {
            if (State.activeTeacherFilterId === id) {
                State.activeTeacherFilterId = null;
                State.expandedTeacherId = null;
            } else {
                State.activeTeacherFilterId = id;
                State.expandedTeacherId = id;
                State.activeSelectedCardId = null; 
            }
            renderAll();
        };

        const toggleRippleCascade = (checked) => {
            State.workspace.rippleCascadeEnabled = checked;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            showToast(checked ? "Domino Ripple Cascading enabled!" : "Domino Ripple Cascading disabled!");
        };

        const renderAutopopulatePanel = () => {
            const container = document.getElementById('teacher-panel-flex');
            const titleEl = document.getElementById('teacher-panel-title');
            const clearBtn = document.getElementById('clear-highlight-btn');

            if (!container) return;

            if (!State.activeSelectedCardId) {
                titleEl.innerText = "Teacher Directory";
                if (State.activeTeacherFilterId) {
                    clearBtn.classList.remove('hidden');
                } else {
                    clearBtn.classList.add('hidden');
                }
                
                container.innerHTML = State.workspace.teachers.map(t => {
                    const badgeHex = hexBadgeColor[t.color || 'blue'];
                    const textHex = hexTextColors[t.color || 'blue'];

                    const advisoryGrades = Object.keys(State.workspace.advisers).filter(g => State.workspace.advisers[g] === t.id);
                    const advisoryText = advisoryGrades.length > 0 ? `Adviser: ${advisoryGrades.join(', ')}` : 'None';

                    const isAdviser = advisoryGrades.length > 0;
                    const adviserLoadDaily = isAdviser ? 1.00 : 0.00;

                    const getTeacherLoadHoursForDay = (teacherId, day) => {
                        const mins = State.workspace.classes
                            .filter(c => c.teacherId === teacherId && (c.day === day || c.day === 'master'))
                            .reduce((sum, c) => {
                                const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
                                return sum + (ts ? ts.mins : 0);
                            }, 0);
                        return mins / 60.0;
                    };

                    const activeDay = (State.workspace.activeTab === 'master' || State.workspace.activeTab === 'master_g12' || State.workspace.activeTab === 'master_kinder') ? 'master' : State.workspace.gradelevelDayFilter;
                    const dailyTeachingHours = getTeacherLoadHoursForDay(t.id, activeDay);

                    const weeklyMasterMins = State.workspace.classes
                        .filter(c => c.teacherId === t.id && c.day === 'master')
                        .reduce((sum, c) => {
                            const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
                            return sum + (ts ? ts.mins * 5 : 0);
                        }, 0);

                    const weeklySpecificMins = State.workspace.classes
                        .filter(c => c.teacherId === t.id && c.day !== 'master' && c.day !== 'pool')
                        .reduce((sum, c) => {
                            const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
                            return sum + (ts ? ts.mins : 0);
                        }, 0);
                    
                    const weeklyTeachingHours = (weeklyMasterMins + weeklySpecificMins) / 60.0;

                    const totalDailyLoad = dailyTeachingHours + adviserLoadDaily;
                    const dailyExcess = totalDailyLoad - 6.00;
                    const excessMins = Math.round(dailyExcess * 60);

                    const isSelectedFilter = State.activeTeacherFilterId === t.id;
                    const highlightClass = isSelectedFilter ? 'card-teacher-highlight ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : '';
                    
                    const filterBadge = isSelectedFilter ? `
                        <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 animate-pulse font-semibold">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Filtering
                        </span>
                    ` : '';

                    const chevronClass = isSelectedFilter ? 'transform rotate-180 text-emerald-500' : 'text-slate-400';
                    const expandableContent = isSelectedFilter ? `
                        <div class="grid grid-cols-2 gap-1.5 bg-slate-50/70 p-2 rounded-lg border border-slate-100 text-[10px] text-slate-600 font-semibold transition-all duration-200">
                            <div>
                                <span class="block text-[8px] uppercase font-bold tracking-wider text-slate-400">Advisory</span>
                                <span class="font-bold text-slate-700 truncate block max-w-full" title="${escapeHtml(advisoryText)}">${escapeHtml(advisoryText)}</span>
                            </div>
                            <div>
                                <span class="block text-[8px] uppercase font-bold tracking-wider text-slate-400">Weekly load</span>
                                <span class="font-bold text-slate-700">${weeklyTeachingHours.toFixed(1)} hours</span>
                            </div>
                        </div>

                        <div class="flex items-start gap-1.5 pt-1.5 border-t border-slate-100 text-[11px] text-slate-500 leading-tight transition-all duration-200">
                            <i data-lucide="clock" class="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0"></i>
                            <div class="flex-1">
                                <span class="block text-[8px] uppercase font-bold tracking-wider text-slate-400">Availability Info</span>
                                <div id="live-status-${t.id}" class="text-slate-600 font-bold mt-0.5">${getLiveStatus(t.id)}</div>
                            </div>
                        </div>
                    ` : '';

                    return `
                        <div onclick="toggleTeacherFilter('${t.id}')" class="w-full flex flex-col bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 rounded-xl p-3 shadow-xs hover:shadow-md transition-all duration-200 text-xs gap-1.5 relative cursor-pointer font-semibold ${highlightClass}">
                            <div class="flex items-start justify-between gap-2 min-w-0">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <span class="w-2 h-2 rounded-full ${badgeHex} shrink-0 shadow-2xs"></span>
                                    <span class="font-extrabold text-slate-950 uppercase tracking-tight break-words text-xs select-none">${escapeHtml(t.name)}</span>
                                </div>
                                <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-250 mt-0.5 ${chevronClass}"></i>
                            </div>

                            <div class="flex items-center gap-1.5 pl-4 ml-0.5">
                                ${filterBadge ? filterBadge : `
                                    <span class="text-[9.5px] font-extrabold px-2 py-0.5 rounded-md border ${
                                        dailyExcess > 0.001 
                                        ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' 
                                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    }">
                                        ${totalDailyLoad.toFixed(1)}h ${dailyExcess > 0.001 ? `(+${excessMins}m Over)` : 'Optimal'}
                                    </span>
                                `}
                            </div>
                            
                            ${expandableContent}
                        </div>
                    `;
                }).join('');
                lucide.createIcons();
                return;
            }

            const block = State.workspace.classes.find(c => c.id === State.activeSelectedCardId);
            if (!block) return;

            const subject = State.workspace.subjects.find(s => s.id === block.subjectId) || { name: 'Unknown' };
            titleEl.innerText = `Teacher: ${subject.name}`;
            clearBtn.classList.remove('hidden');

            const dayCode = block.day;
            const slotId = block.timeSlotId;

            const busyTeacherIds = State.workspace.classes
                .filter(c => c.id !== block.id && c.day === dayCode && c.timeSlotId === slotId && c.teacherId)
                .map(c => c.teacherId);

            const experiencedTeacherIds = Array.from(new Set(
                State.workspace.classes
                    .filter(c => c.subjectId === block.subjectId && c.teacherId)
                    .map(c => c.teacherId)
            ));

            let sortedTeachers = [...State.workspace.teachers].sort((a, b) => {
                const aExp = experiencedTeacherIds.includes(a.id) ? 1 : 0;
                const bExp = experiencedTeacherIds.includes(b.id) ? 1 : 0;
                return bExp - aExp; 
            });

            container.innerHTML = sortedTeachers.map(t => {
                const isBusy = busyTeacherIds.includes(t.id);
                const isExperienced = experiencedTeacherIds.includes(t.id);
                
                const badgeHex = hexBadgeColor[t.color || 'blue'];
                const textHex = hexTextColors[t.color || 'blue'];

                if (isBusy) {
                    return `
                        <button disabled class="px-2.5 py-1.5 rounded-xl bg-slate-200 text-slate-400 font-bold text-[11px] border border-dashed border-slate-300 opacity-45 cursor-not-allowed flex items-center gap-1 w-full text-left justify-start" title="Scheduled elsewhere during this time slot">
                            <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                            ${escapeHtml(t.name)} (Busy)
                        </button>
                    `;
                }

                const starIcon = isExperienced ? `<i data-lucide="star" class="w-3 h-3 fill-current shrink-0 text-white"></i>` : '';
                const clickAction = `onclick="assignTeacherQuick('${t.id}')"`;

                return `
                    <button ${clickAction} class="px-2.5 py-2 rounded-xl ${badgeHex} ${textHex} font-bold text-[11px] shadow-xs hover:shadow-sm border border-black/10 active:scale-95 transition-all flex items-center gap-1.5 w-full text-left justify-start">
                        <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0"></span>
                        ${starIcon}
                        <span class="truncate uppercase">${escapeHtml(t.name)}</span>
                    </button>
                `;
            }).join('');

            if (sortedTeachers.length === 0) {
                container.innerHTML = `<span class="text-xs text-slate-400 italic p-1">No teachers found</span>`;
            }

            lucide.createIcons();
        };

        const handleCardHighlightSelect = (id) => {
            if (State.activeSelectedCardId === id) {
                State.activeSelectedCardId = null;
            } else {
                State.activeSelectedCardId = id;
                State.activeTeacherFilterId = null; 
            }
            renderAll();
        };

        const clearActiveCardFilter = () => {
            State.activeSelectedCardId = null;
            State.activeTeacherFilterId = null;
            renderAll();
        };

        const assignTeacherQuick = (teacherId) => {
            if (!State.activeSelectedCardId) return;
            const block = State.workspace.classes.find(c => c.id === State.activeSelectedCardId);
            if (block) {
                block.teacherId = teacherId;
                
                const isCollision = checkTeacherCollision(block);
                if (isCollision) {
                    showToast("Warning: Teacher is double-booked on this time slot!", "error");
                } else {
                    showToast("Teacher assigned successfully!");
                }
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                State.activeSelectedCardId = null; 
                renderAll();
            }
        };

        const getActiveTimeSlotsForCurrentView = () => {
            const isMasterKinder = State.workspace.activeTab === 'master_kinder';
            const isMasterG12 = State.workspace.activeTab === 'master_g12';
            const isMasterG36 = State.workspace.activeTab === 'master';
            
            if (isMasterKinder) {
                return State.workspace.timeSlots.filter(ts => ts.group === 'kinder');
            } else if (isMasterG12) {
                return State.workspace.timeSlots.filter(ts => ts.group === 'all' || ts.group === 'g12');
            } else if (isMasterG36) {
                return State.workspace.timeSlots.filter(ts => (ts.group === 'all' || ts.group === 'g36'));
            } else {
                const filterGrade = State.workspace.gradelevelFilter;
                if (filterGrade === "Kindergarten") {
                    return State.workspace.timeSlots.filter(ts => ts.group === 'kinder');
                } else if (filterGrade === "Grade 1" || filterGrade === "Grade 2") {
                    return State.workspace.timeSlots.filter(ts => ts.group === 'all' || ts.group === 'g12');
                } else {
                    return State.workspace.timeSlots.filter(ts => (ts.group === 'all' || ts.group === 'g36'));
                }
            }
        };

        // --- DIRECT INTERACTIVE CELL TIME EDITORS ---
        const startDirectTimeSlotEdit = (slotId) => {
            State.inlineEditingSlotId = slotId;
            renderAll();
        };

        const saveDirectTimeSlotInline = (slotId) => {
            const startInput = document.getElementById(`inline-start-${slotId}`);
            const endInput = document.getElementById(`inline-end-${slotId}`);
            const groupSelect = document.getElementById(`inline-group-${slotId}`);

            if (!startInput || !endInput) return;

            const start = startInput.value;
            const end = endInput.value;
            const startMins = timeToMins(start);
            const endMins = timeToMins(end);

            if (endMins <= startMins) {
                showToast("End time must be after start time.", "error");
                return;
            }

            const tsObj = State.workspace.timeSlots.find(t => t.id === slotId);
            if (tsObj) {
                tsObj.start = start;
                tsObj.end = end;
                tsObj.mins = endMins - startMins;
                if (groupSelect) {
                    tsObj.group = groupSelect.value;
                }

                // Run Segment Domino Cascading Engine (Proposal 2 & 3)
                if (State.workspace.rippleCascadeEnabled !== false) {
                    const targetGroup = tsObj.group;
                    const sortedSlots = [...State.workspace.timeSlots].sort((a, b) => timeToMins(a.start) - timeToMins(b.start));
                    const editIdx = sortedSlots.findIndex(t => t.id === slotId);
                    
                    let currentEndMins = endMins;
                    for (let i = editIdx + 1; i < sortedSlots.length; i++) {
                        const nextTs = sortedSlots[i];
                        if (nextTs.group === targetGroup || targetGroup === 'all' || nextTs.group === 'all') {
                            const dur = nextTs.mins;
                            const nextStartStr = minsToTime(currentEndMins);
                            const nextEndStr = minsToTime(currentEndMins + dur);
                            
                            const actualTs = State.workspace.timeSlots.find(t => t.id === nextTs.id);
                            if (actualTs) {
                                actualTs.start = nextStartStr;
                                actualTs.end = nextEndStr;
                            }
                            currentEndMins += dur;
                        }
                    }
                }

                State.inlineEditingSlotId = null;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderAll();
                showToast("Timeline slot and subsequent offsets updated dynamically!");
            }
        };

        const cancelDirectTimeSlotInline = () => {
            State.inlineEditingSlotId = null;
            renderAll();
        };

        const appendFloatingTimeSlotNext = (baseSlotId) => {
            const baseSlot = State.workspace.timeSlots.find(ts => ts.id === baseSlotId);
            if (!baseSlot) return;

            const baseEndMins = timeToMins(baseSlot.end);
            const newDuration = baseSlot.mins || 45;
            const newStartStr = baseSlot.end;
            const newEndStr = minsToTime(baseEndMins + newDuration);

            const newSlot = {
                id: generateId('ts'),
                start: newStartStr,
                end: newEndStr,
                mins: newDuration,
                type: "academic",
                group: baseSlot.group,
                label: ""
            };

            State.workspace.timeSlots.push(newSlot);
            State.workspace.timeSlots.sort((a, b) => timeToMins(a.start) - timeToMins(b.start));

            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderAll();
            showToast("New relative time slot row inserted successfully!");
        };

        const renderAll = () => {
            const suspendedAvatars = document.querySelectorAll('#touch-drag-avatar');
            suspendedAvatars.forEach(av => av.remove());
            
            updateDashboardStats();
            renderPrintDOM();
            renderDynamicHeaders();
            renderAutopopulatePanel();
            renderDiagnostics(); 
            renderTeacherDashboard();

            const tbody = document.getElementById('matrix-tbody');
            tbody.innerHTML = '';

            if (State.workspace.activeTab === 'summary') { 
            if (State.workspace.activeTab === 'summary') {
                renderSummaryView(); 
                return;
            }

            const isMasterKinder = State.workspace.activeTab === "master_kinder";
            const isMasterG12 = State.workspace.activeTab === "master_g12";
            const isMasterG36 = State.workspace.activeTab === "master";

            const gradeFilter = State.workspace.gradelevelFilter;
            const dayFilter = State.workspace.gradelevelDayFilter;

            const activeSlots = getActiveTimeSlotsForCurrentView();

            activeSlots.forEach(slot => { 
            activeSlots.forEach(slot => {
                const tr = document.createElement('tr');
                tr.className = slot.type === 'universal' ? 'bg-slate-50/70 border-y border-slate-200' : 'hover:bg-slate-50/40 transition-colors';

                // TIME SLOT CELL: Interactive Inline Editor inside main program matrix
                const tdTime = document.createElement('td');
                tdTime.className = "p-3 border-r border-slate-200 text-center align-middle whitespace-nowrap relative group/slot-cell min-w-[200px] h-24";
                
                if (State.inlineEditingSlotId === slot.id) {
                    tdTime.innerHTML = `
                        <div class="flex flex-col gap-1.5 p-1 bg-emerald-50 rounded-lg border border-emerald-200 max-w-[190px] mx-auto print:hidden" onclick="event.stopPropagation()">
                            <div class="flex gap-1 items-center">
                                <input type="time" id="inline-start-${slot.id}" value="${slot.start}" class="bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] font-bold text-slate-800 focus:outline-none focus:border-emerald-500 w-full">
                                <span class="text-[10px] font-bold text-slate-400">to</span>
                                <input type="time" id="inline-end-${slot.id}" value="${slot.end}" class="bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] font-bold text-slate-800 focus:outline-none focus:border-emerald-500 w-full">
                            </div>
                            <select id="inline-group-${slot.id}" class="bg-white border border-slate-200 rounded px-1 py-0.5 text-[9px] font-bold text-slate-600 focus:outline-none">
                                <option value="g36" ${slot.group === 'g36' ? 'selected' : ''}>Grades 3-6 (45m)</option>
                                <option value="g12" ${slot.group === 'g12' ? 'selected' : ''}>Grades 1-2 (40m)</option>
                                <option value="kinder" ${slot.group === 'kinder' ? 'selected' : ''}>Kinder</option>
                                <option value="all" ${slot.group === 'all' ? 'selected' : ''}>Shared (All)</option>
                            </select>
                            <div class="flex gap-1 justify-end mt-0.5">
                                <button onclick="cancelDirectTimeSlotInline()" class="px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-500 uppercase">Esc</button>
                                <button onclick="saveDirectTimeSlotInline('${slot.id}')" class="px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white uppercase font-bold">Save</button>
                            </div>
                        </div>
                        <div class="hidden print:block text-slate-700 font-semibold text-xs">
                            ${formatTo12Hour(slot.start)} - ${formatTo12Hour(slot.end)}
                        </div>
                    `;
                } else {
                    tdTime.innerHTML = `
                        <div onclick="startDirectTimeSlotEdit('${slot.id}')" class="cursor-pointer hover:bg-emerald-50 hover:text-emerald-800 px-3 py-2 rounded-xl transition duration-150 inline-block font-bold text-xs text-slate-700 select-none border border-transparent hover:border-emerald-150 relative" title="Click to edit times directly">
                            ${formatTo12Hour(slot.start)} - ${formatTo12Hour(slot.end)}
                        </div>
                        
                        <button onclick="appendFloatingTimeSlotNext('${slot.id}')" class="absolute -bottom-2 right-2 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-md transform scale-0 group-hover/slot-cell:scale-100 active:scale-95 transition-all duration-200 z-30 print:hidden flex items-center justify-center border border-white" title="Add Next Time Slot">
                            <i data-lucide="plus" class="w-3.5 h-3.5 font-extrabold"></i>
                        </button>
                    `;
                }
                tr.appendChild(tdTime);

                // MINS CELL: Dynamically computes duration values based on Start & End configurations
                const tdMins = document.createElement('td');
                tdMins.className = "p-3 text-xs text-slate-500 text-center border-r border-slate-200 align-middle font-bold tracking-wide";
                tdMins.innerText = `${slot.mins}m`;
                tr.appendChild(tdMins);

                if (slot.type === 'universal') {
                    let colCount = 1;
                    if (isMasterKinder) colCount = 1;
                    else if (isMasterG12) colCount = 2;
                    else if (isMasterG36) colCount = 4;
                    else {
                        colCount = State.workspace.sections.filter(sec => sec.grade === gradeFilter).length || 1;
                    }

                    const tdUniversal = document.createElement('td');
                    tdUniversal.colSpan = colCount;
                    tdUniversal.className = "p-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100/50 align-middle font-sans";
                    tdUniversal.innerHTML = `<span class="inline-flex items-center gap-1.5"><i data-lucide="coffee" class="w-3.5 h-3.5 print:hidden"></i> ${slot.label || "SCHOOL INTERVAL"}</span>`;
                    tr.appendChild(tdUniversal);
                } else {
                    if (isMasterKinder) {
                        const tdCell = document.createElement('td');
                        tdCell.className = "p-2 border-r border-slate-200 align-middle h-24 transition-all duration-200";
                        tdCell.dataset.grade = "Kindergarten";
                        tdCell.dataset.slotId = slot.id;

                        const block = State.workspace.classes.find(c => 
                            c.day === 'master' && 
                            c.timeSlotId === slot.id && 
                            c.grade === "Kindergarten"
                        );

                        if (block) {
                            tdCell.appendChild(createDragBlock(block));
                        } else {
                            tdCell.innerHTML = `<div class="w-full h-full min-h-[60px] border border-dashed border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-center text-[10px] text-slate-400 select-none hover:text-slate-500 font-bold print:border-none print:text-transparent" onclick="openCreateModalAtMaster('Kindergarten', '${slot.id}')">Empty Slot</div>`;
                        }

                        tdCell.addEventListener('dragover', (e) => { e.preventDefault(); tdCell.classList.add('drag-over-active'); });
                        tdCell.addEventListener('dragleave', () => { tdCell.classList.remove('drag-over-active'); });
                        tdCell.addEventListener('drop', (e) => {
                            e.preventDefault();
                            tdCell.classList.remove('drag-over-active');
                            if (State.draggedBlockId) executeDragMoveMaster(State.draggedBlockId, "Kindergarten", slot.id);
                        });

                        tr.appendChild(tdCell);
                    } else if (isMasterG12) {
                        const targetGrades = ["Grade 1", "Grade 2"];
                        targetGrades.forEach(grade => {
                            const tdCell = document.createElement('td');
                            tdCell.className = "p-2 border-r border-slate-200 align-middle h-24 transition-all duration-200";
                            tdCell.style.width = `50%`;
                            tdCell.dataset.grade = grade;
                            tdCell.dataset.slotId = slot.id;

                            const block = State.workspace.classes.find(c => 
                                c.day === 'master' && 
                                c.timeSlotId === slot.id && 
                                c.grade === grade
                            );

                            if (block) {
                                tdCell.appendChild(createDragBlock(block));
                            } else {
                                tdCell.innerHTML = `<div class="w-full h-full min-h-[60px] border border-dashed border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-center text-[10px] text-slate-400 select-none hover:text-slate-500 font-bold print:border-none print:text-transparent" onclick="openCreateModalAtMaster('${grade}', '${slot.id}')">Empty Slot</div>`;
                            }

                            tdCell.addEventListener('dragover', (e) => { e.preventDefault(); tdCell.classList.add('drag-over-active'); });
                            tdCell.addEventListener('dragleave', () => { tdCell.classList.remove('drag-over-active'); });
                            tdCell.addEventListener('drop', (e) => {
                                e.preventDefault();
                                tdCell.classList.remove('drag-over-active');
                                if (State.draggedBlockId) executeDragMoveMaster(State.draggedBlockId, grade, slot.id);
                            });

                            tr.appendChild(tdCell);
                        });
                    } else if (isMasterG36) {
                        const targetGrades = ["Grade 3", "Grade 4", "Grade 5", "Grade 6"];
                        targetGrades.forEach(grade => {
                            const tdCell = document.createElement('td');
                            tdCell.className = "p-2 border-r border-slate-200 align-middle h-24 transition-all duration-200";
                            tdCell.style.width = `25%`;
                            tdCell.dataset.grade = grade;
                            tdCell.dataset.slotId = slot.id;

                            const block = State.workspace.classes.find(c => 
                                c.day === 'master' && 
                                c.timeSlotId === slot.id && 
                                c.grade === grade
                            );

                            if (block) {
                                tdCell.appendChild(createDragBlock(block));
                            } else {
                                tdCell.innerHTML = `<div class="w-full h-full min-h-[60px] border border-dashed border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-center text-[10px] text-slate-400 select-none hover:text-slate-500 font-bold print:border-none print:text-transparent" onclick="openCreateModalAtMaster('${grade}', '${slot.id}')">Empty Slot</div>`;
                            }

                            tdCell.addEventListener('dragover', (e) => { e.preventDefault(); tdCell.classList.add('drag-over-active'); });
                            tdCell.addEventListener('dragleave', () => { tdCell.classList.remove('drag-over-active'); });
                            tdCell.addEventListener('drop', (e) => {
                                e.preventDefault();
                                tdCell.classList.remove('drag-over-active');
                                if (State.draggedBlockId) executeDragMoveMaster(State.draggedBlockId, grade, slot.id);
                            });

                            tr.appendChild(tdCell);
                        });
                    } else {
                        const activeSections = State.workspace.sections.filter(sec => sec.grade === gradeFilter);

                        if (activeSections.length === 0) {
                            const tdEmpty = document.createElement('td');
                            tdEmpty.colSpan = 1;
                            tdEmpty.className = "p-4 text-center text-xs text-slate-400 bg-slate-50 italic font-semibold";
                            tdEmpty.innerText = "No Sections configured. Add one in Settings.";
                            tr.appendChild(tdEmpty);
                        } else {
                            activeSections.forEach(section => {
                                const tdCell = document.createElement('td');
                                tdCell.className = "p-2 border-r border-slate-200 align-middle h-24 transition-all duration-200";
                                tdCell.style.width = `${100 / activeSections.length}%`;
                                tdCell.dataset.sectionId = section.id;
                                tdCell.dataset.slotId = slot.id;

                                const block = State.workspace.classes.find(c => 
                                    c.day === dayFilter && 
                                    c.timeSlotId === slot.id && 
                                    c.sectionId === section.id
                                );

                                if (block) {
                                    tdCell.appendChild(createDragBlock(block));
                                } else {
                                    tdCell.innerHTML = `<div class="w-full h-full min-h-[60px] border border-dashed border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-center text-[10px] text-slate-400 select-none hover:text-slate-500 font-bold print:border-none print:text-transparent" onclick="openCreateModalAtSection('${section.id}', '${slot.id}')">Empty Slot</div>`;
                                }

                                tdCell.addEventListener('dragover', (e) => { e.preventDefault(); tdCell.classList.add('drag-over-active'); });
                                tdCell.addEventListener('dragleave', () => { tdCell.classList.remove('drag-over-active'); });
                                tdCell.addEventListener('drop', (e) => {
                                    e.preventDefault();
                                    tdCell.classList.remove('drag-over-active');
                                    if (State.draggedBlockId) executeDragMoveSection(State.draggedBlockId, section.id, slot.id, dayFilter);
                                });

                                tr.appendChild(tdCell);
                            });
                        }
                    }
                }

                tbody.appendChild(tr);
            });

            lucide.createIcons();
        };

        const renderSummaryView = () => {
            const tbody = document.getElementById('matrix-tbody');
            tbody.innerHTML = '';
            
            let totalTeacher = State.workspace.teachers.length;
            let grandTotalWeeklyTeachingMins = 0;
            let totalOverloadedCount = 0;
            let totalDailyLoadsSum = 0;

            const teacherDataList = State.workspace.teachers.map(t => {
                const advisoryGrades = Object.keys(State.workspace.advisers).filter(g => State.workspace.advisers[g] === t.id);
                
                // Formulate detailed Advisory Room text including sections
                const advisoryText = advisoryGrades.map(g => {
                    const secs = State.workspace.sections.filter(sec => sec.grade === g).map(sec => sec.name);
                    return secs.length > 0 ? `${g} (${secs.join(', ')})` : g;
                }).join(', ') || 'None';

                const isAdviser = advisoryGrades.length > 0;
                const adviserLoadDaily = isAdviser ? 1.00 : 0.00;

                const getTeacherLoadHoursForDay = (teacherId, day) => {
                    const mins = State.workspace.classes
                        .filter(c => c.teacherId === teacherId && (c.day === day || c.day === 'master'))
                        .reduce((sum, c) => {
                            const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
                            return sum + (ts ? ts.mins : 0);
                        }, 0);
                    return mins / 60.0;
                };

                const dailyTeachingHours = getTeacherLoadHoursForDay(t.id, 'master');

                const weeklyMasterMins = State.workspace.classes
                    .filter(c => c.teacherId === t.id && c.day === 'master')
                    .reduce((sum, c) => {
                        const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
                        return sum + (ts ? ts.mins * 5 : 0);
                    }, 0);

                const weeklySpecificMins = State.workspace.classes
                    .filter(c => c.teacherId === t.id && c.day !== 'master' && c.day !== 'pool')
                    .reduce((sum, c) => {
                        const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
                        return sum + (ts ? ts.mins : 0);
                    }, 0);
                
                const weeklyTeachingHours = (weeklyMasterMins + weeklySpecificMins) / 60.0;
                grandTotalWeeklyTeachingMins += (weeklyMasterMins + weeklySpecificMins);

                const totalDailyLoad = dailyTeachingHours + adviserLoadDaily;
                totalDailyLoadsSum += totalDailyLoad;

                if (totalDailyLoad > 6.001) {
                    totalOverloadedCount++;
                }

                let statusType = 'optimal';
                if (totalDailyLoad > 6.001) statusType = 'overload';
                else if (totalDailyLoad < 4.0) statusType = 'underload';

                return {
                    teacher: t,
                    advisoryText,
                    isAdviser,
                    adviserLoadDaily,
                    weeklyTeachingHours,
                    dailyTeachingHours,
                    totalDailyLoad,
                    statusType,
                    advisoryGrades
                };
            });

            // Dynamic chronological sort index: Kinder up to Grade 6, Non-advisory at the bottom
            const getSortWeight = (item) => {
                const gradesOrder = State.workspace.grades || [];
                if (item.advisoryGrades && item.advisoryGrades.length > 0) {
                    let minIndex = Infinity;
                    item.advisoryGrades.forEach(g => {
                        const idx = gradesOrder.indexOf(g);
                        if (idx !== -1 && idx < minIndex) {
                            minIndex = idx;
                        }
                    });
                    return minIndex;
                }
                return Infinity; // Keeps floating supporting instructors consistently at bottom of list
            };

            teacherDataList.sort((a, b) => {
                const weightA = getSortWeight(a);
                const weightB = getSortWeight(b);
                if (weightA !== weightB) {
                    return weightA - weightB;
                }
                return a.teacher.name.localeCompare(b.teacher.name);
            });

            const grandTotalWeeklyTeachingHours = grandTotalWeeklyTeachingMins / 60.0;
            const averageDailyLoad = totalTeacher > 0 ? (totalDailyLoadsSum / totalTeacher) : 0;
            const complianceRate = totalTeacher > 0 ? (((totalTeacher - totalOverloadedCount) / totalTeacher) * 100) : 100;

            const kpiGrid = document.getElementById('summary-kpi-grid');
            if (kpiGrid) {
                kpiGrid.innerHTML = `
                    <div class="bg-white border border-slate-300 p-4 rounded-lg flex flex-col gap-1 shadow-sm">
                        <div class="flex items-center gap-2 text-slate-500 mb-1">
                            <i data-lucide="users" class="w-4 h-4"></i>
                            <span class="text-[11px] font-semibold uppercase tracking-wider">Total Teachers</span>
                        </div>
                        <div class="flex items-baseline gap-2">
                            <h4 class="text-2xl font-semibold text-slate-900">${totalTeacher}</h4>
                            <span class="text-xs text-slate-500">active members</span>
                        </div>
                    </div>

                    <div class="bg-white border border-slate-300 p-4 rounded-lg flex flex-col gap-1 shadow-sm">
                        <div class="flex items-center gap-2 text-slate-500 mb-1">
                            <i data-lucide="clock" class="w-4 h-4"></i>
                            <span class="text-[11px] font-semibold uppercase tracking-wider">Schedule Volume</span>
                        </div>
                        <div class="flex items-baseline gap-2">
                            <h4 class="text-2xl font-semibold text-slate-900">${grandTotalWeeklyTeachingHours.toFixed(1)}</h4>
                            <span class="text-xs text-slate-500">hrs weekly contact</span>
                        </div>
                    </div>

                    <div class="bg-white border border-slate-300 p-4 rounded-lg flex flex-col gap-1 shadow-sm">
                        <div class="flex items-center gap-2 text-slate-500 mb-1">
                            <i data-lucide="trending-up" class="w-4 h-4"></i>
                            <span class="text-[11px] font-semibold uppercase tracking-wider">Avg Workload</span>
                        </div>
                        <div class="flex items-baseline gap-2">
                            <h4 class="text-2xl font-semibold text-slate-900">${averageDailyLoad.toFixed(1)}</h4>
                            <span class="text-xs text-slate-500">hrs/day (Ideal: 5-6)</span>
                        </div>
                    </div>

                    <div class="bg-white border border-slate-300 p-4 rounded-lg flex flex-col gap-1 shadow-sm">
                        <div class="flex items-center gap-2 text-slate-500 mb-1">
                            <i data-lucide="${complianceRate >= 80 ? 'shield-check' : 'shield-alert'}" class="w-4 h-4 ${complianceRate >= 80 ? 'text-emerald-500' : 'text-rose-500'}"></i>
                            <span class="text-[11px] font-semibold uppercase tracking-wider">Load Compliance</span>
                        </div>
                        <div class="flex items-baseline gap-2">
                            <h4 class="text-2xl font-semibold text-slate-900">${complianceRate.toFixed(0)}%</h4>
                            <span class="text-xs ${complianceRate >= 80 ? 'text-emerald-600' : 'text-rose-600'}">
                                ${totalOverloadedCount === 0 ? 'Optimal' : `${totalOverloadedCount} adjust suggested`}
                            </span>
                        </div>
                    </div>
                `;
            }

            const filteredTeachers = teacherDataList.filter(item => {
                if (State.summaryFilter !== 'all' && item.statusType !== State.summaryFilter) {
                    return false;
                }
                if (State.summarySearchQuery) {
                    const nameMatch = item.teacher.name.toLowerCase().includes(State.summarySearchQuery);
                    const advisoryMatch = item.advisoryText.toLowerCase().includes(State.summarySearchQuery);
                    return nameMatch || advisoryMatch;
                }
                return true;
            });

            if (filteredTeachers.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td colspan="5" class="p-10 text-center text-slate-400 bg-slate-50/50 italic font-semibold">
                        <div class="flex flex-col items-center gap-2 justify-center py-4">
                            <i data-lucide="search" class="w-8 h-8 text-slate-300"></i>
                            <span>No instructors match the active filters.</span>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
                lucide.createIcons();
                return;
            }

            filteredTeachers.forEach(({ teacher, advisoryText, isAdviser, adviserLoadDaily, weeklyTeachingHours, dailyTeachingHours, totalDailyLoad, statusType }) => {
                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-50 transition-colors border-b border-slate-200";

                const badgeHex = hexBadgeColor[teacher.color || 'blue'];
                const dailyExcess = totalDailyLoad - 6.00;
                const excessMins = Math.round(dailyExcess * 60);

                let badgeText = 'Optimal Load';
                let badgeClasses = 'border-emerald-300 text-emerald-700 bg-emerald-50/50';

                if (statusType === 'overload') {
                    badgeText = `Overload (+${excessMins}m)`;
                    badgeClasses = 'border-rose-300 text-rose-700 bg-rose-50/50 font-semibold';
                } else if (statusType === 'underload') {
                    badgeText = 'Underloaded';
                    badgeClasses = 'border-slate-300 text-slate-600 bg-slate-50';
                }

                const teacherClasses = State.workspace.classes.filter(c => c.teacherId === teacher.id);
                let scheduleBlocksHtml = '';
                if (teacherClasses.length === 0) {
                    scheduleBlocksHtml = '<span class="text-slate-400 italic text-[11px]">No assigned classes</span>';
                } else {
                    scheduleBlocksHtml = `<div class="flex flex-wrap gap-1.5">`;
                    teacherClasses.forEach(c => {
                        const sub = State.workspace.subjects.find(s => s.id === c.subjectId);
                        const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
                        const subLabel = sub ? sub.name : 'Class';
                        const mins = ts ? ts.mins : 0;
                        const dayLabel = c.day === 'master' ? 'Daily' : c.day.toUpperCase();
                        
                        scheduleBlocksHtml += `
                            <span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-white border border-slate-200 text-slate-600 hover:border-slate-300 transition-colors cursor-default">
                                <span class="font-semibold text-slate-700">${subLabel}</span> 
                                <span class="text-slate-400">(${escapeHtml(c.grade)} &middot; ${mins}m &middot; ${dayLabel})</span>
                            </span>
                        `;
                    });
                    scheduleBlocksHtml += `</div>`;
                }

                tr.innerHTML = `
                    <td class="p-3 text-slate-900 flex items-center gap-3 min-w-[200px] h-full align-middle">
                        <span class="w-3 h-3 rounded-full ${badgeHex} shrink-0 ring-1 ring-black/5 mt-1 self-start"></span>
                        <div class="truncate flex flex-col gap-1 items-start">
                            <span class="block text-sm font-medium truncate">${escapeHtml(teacher.name)}</span>
                            ${isAdviser ? `<span class="px-2 py-0.5 border border-amber-200 bg-amber-50 text-amber-700 rounded-full text-[10px] font-medium inline-block truncate max-w-[180px]" title="${escapeHtml(advisoryText)}">Adviser: ${escapeHtml(advisoryText)}</span>` : ''}
                        </div>
                    </td>
                    <td class="p-3 align-middle max-w-[340px]">${scheduleBlocksHtml}</td>
                    <td class="p-3 text-sm text-slate-700 align-middle whitespace-nowrap font-medium">${totalDailyLoad.toFixed(1)} hrs/day</td>
                    <td class="p-3 align-middle">
                        <span class="px-2.5 py-0.5 rounded-full text-[11px] border ${badgeClasses} w-max block">
                            ${badgeText}
                        </span>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            lucide.createIcons();
        };

        const setSummaryFilter = (filter) => {
            State.summaryFilter = filter;
            const filters = ['all', 'overload', 'optimal', 'underload'];
            filters.forEach(f => {
                const btn = document.getElementById(`sum-filter-${f}`);
                if (!btn) return;
                if (f === filter) {
                    btn.className = "px-3 py-1.5 text-[11px] font-semibold rounded-md border bg-slate-800 text-white border-slate-800 transition";
                } else {
                    btn.className = "px-3 py-1.5 text-[11px] font-semibold rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 bg-white transition";
                }
            });
            renderAll();
        };

        const handleSummarySearch = (val) => {
            State.summarySearchQuery = val.trim().toLowerCase();
            renderAll();
        };

        const renderDynamicHeaders = () => {
            const thead = document.getElementById('matrix-thead');
            thead.innerHTML = '';
            
            const tr = document.createElement('tr');
            tr.className = "bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-300";
            
            if (State.workspace.activeTab === 'summary') {
                tr.innerHTML = `
                    <th class="p-3 text-left font-semibold w-1/4">Teacher</th>
                    <th class="p-3 text-left font-semibold w-5/12">Subject Assignment</th>
                    <th class="p-3 text-left font-semibold w-1/12">Total Teaching Load</th>
                    <th class="p-3 text-left font-semibold w-1/12">Compliance Status</th>
                `;
            } else {
                tr.innerHTML = `
                    <th class="p-3 w-44 border-r border-slate-200 text-center font-bold">Time Slot</th>
                    <th class="p-3 w-20 border-r border-slate-200 text-center font-bold">Mins</th>
                `;

                if (State.workspace.activeTab === 'master_kinder') {
                    const th = document.createElement('th');
                    th.className = "p-3 border-r border-slate-200 text-center font-bold";
                    th.style.width = `100%`;
                    const adviserId = State.workspace.advisers["Kindergarten"];
                    const adviserTeacher = State.workspace.teachers.find(t => t.id === adviserId);
                    const adviserName = adviserTeacher ? adviserTeacher.name : "Unassigned";
                    th.innerHTML = `
                        Kindergarten (Rotational Matrix)
                        <div class="text-[10px] font-normal text-slate-500 capitalize print:font-serif print:text-black font-semibold font-semibold">Adviser: ${escapeHtml(adviserName)}</div>
                    `;
                    tr.appendChild(th);
                } else if (State.workspace.activeTab === 'master_g12') {
                    const targetGrades = ["Grade 1", "Grade 2"];
                    targetGrades.forEach(grade => {
                        const adviserId = State.workspace.advisers[grade];
                        const adviserTeacher = State.workspace.teachers.find(t => t.id === adviserId);
                        const adviserName = adviserTeacher ? adviserTeacher.name : "Unassigned";

                        const th = document.createElement('th');
                        th.className = "p-3 border-r border-slate-200 text-center font-bold";
                        th.style.width = `50%`;
                        th.innerHTML = `
                            ${escapeHtml(grade)}
                            <div class="text-[10px] font-normal text-slate-500 capitalize print:font-serif print:text-black font-semibold">Adviser: ${escapeHtml(adviserName)}</div>
                        `;
                        tr.appendChild(th);
                    });
                } else if (State.workspace.activeTab === 'master') {
                    const targetGrades = ["Grade 3", "Grade 4", "Grade 5", "Grade 6"];
                    targetGrades.forEach(grade => {
                        const adviserId = State.workspace.advisers[grade];
                        const adviserTeacher = State.workspace.teachers.find(t => t.id === adviserId);
                        const adviserName = adviserTeacher ? adviserTeacher.name : "Unassigned";

                        const th = document.createElement('th');
                        th.className = "p-3 border-r border-slate-200 text-center font-bold";
                        th.style.width = `25%`;
                        th.innerHTML = `
                            ${escapeHtml(grade)}
                            <div class="text-[10px] font-normal text-slate-500 capitalize print:font-serif print:text-black font-semibold">Adviser: ${escapeHtml(adviserName)}</div>
                        `;
                        tr.appendChild(th);
                    });
                } else {
                    const activeSections = State.workspace.sections.filter(sec => sec.grade === State.workspace.gradelevelFilter);
                    if (activeSections.length === 0) {
                        const th = document.createElement('th');
                        th.className = "p-3 text-center text-slate-400 italic font-bold text-xs";
                        th.innerText = "No active sections";
                        tr.appendChild(th);
                    } else {
                        activeSections.forEach(sec => {
                            const th = document.createElement('th');
                            th.className = "p-3 border-r border-slate-200 text-center text-xs uppercase font-bold";
                            th.style.width = `${100 / activeSections.length}%`;
                            tr.appendChild(th);
                        });
                    }
                }
            }
            thead.appendChild(tr);
        };

        const createDragBlock = (block) => {
            const subject = State.workspace.subjects.find(s => s.id === block.subjectId) || { name: 'Unknown' };
            const teacher = State.workspace.teachers.find(t => t.id === block.teacherId) || { name: 'Unknown', color: 'blue' };
            const colors = teacherColors[teacher.color || 'blue'] || teacherColors['blue'];
            
            const isCollision = checkTeacherCollision(block);
            const isDuplicate = checkDuplicateSubject(block);

            const ts = State.workspace.timeSlots.find(slot => slot.id === block.timeSlotId);
            const durationMins = ts ? ts.mins : 0;

            const el = document.createElement('div');
            el.id = block.id;
            el.draggable = true;

            let activeHighlightClass = '';
            let opacityDimClass = '';

            if (State.activeTeacherFilterId) {
                if (block.teacherId === State.activeTeacherFilterId) {
                    activeHighlightClass = 'card-active-highlight ring-4 ring-emerald-500 shadow-xl scale-[1.02] z-10';
                } else {
                    opacityDimClass = 'opacity-25 scale-95 grayscale-[30%] pointer-events-none transition-all duration-300';
                }
            } else if (State.activeSelectedCardId === block.id) {
                activeHighlightClass = 'card-active-highlight';
            }
            
            el.className = `p-2.5 rounded-lg border-2 ${colors.border} ${colors.bg} cursor-grab relative group shadow-xs transition hover:shadow bg-white print-card ${activeHighlightClass} ${opacityDimClass}`;
            
            let alertHtml = '';
            if (isCollision) {
                el.classList.add('border-red-500', 'bg-red-50');
                alertHtml += `<div class="text-[9px] text-red-600 font-bold flex items-center gap-1 mt-1 leading-tight print:hidden"><i data-lucide="alert-triangle" class="w-3 h-3 text-red-500 shrink-0"></i> Teacher Overlapped</div>`;
            }
            if (isDuplicate) {
                el.classList.add('border-rose-500', 'bg-rose-50');
                alertHtml += `<div class="text-[9px] text-rose-600 font-bold flex items-center gap-1 mt-0.5 leading-tight print:hidden"><i data-lucide="alert-triangle" class="w-3 h-3 text-rose-500 shrink-0"></i> Duplicate Subject</div>`;
            }

            let badgeText = block.grade;
            if (block.sectionId) {
                const sectionObj = State.workspace.sections.find(s => s.id === block.sectionId);
                if (sectionObj) {
                    badgeText = sectionObj.name;
                }
            }
            
            let gradeRomSuffix = (State.workspace.activeTab === 'master' || State.workspace.activeTab === 'master_g12') ? block.grade.replace('Grade ', '') : '';

            el.innerHTML = `
                <div class="flex justify-between items-start mb-0.5 gap-1.5 font-sans print:flex-col print:items-center print:w-full print:mb-0">
                    <div class="flex flex-col items-start print:items-center">
                        <span class="font-extrabold text-[12px] ${colors.text} leading-tight print-card-title text-center">
                            ${escapeHtml(subject.name)} <span class="hidden print:inline">${gradeRomSuffix}</span>
                        </span>
                        <span class="text-[9px] font-bold text-slate-400 mt-0.5">${durationMins}m duration</span>
                    </div>
                    <span class="text-[8px] px-1 py-0.2 rounded font-extrabold ${colors.badge} tracking-wider shrink-0 uppercase print:hidden">${escapeHtml(badgeText)}</span>
                </div>
                <div class="text-[10px] font-bold text-slate-700 flex items-center justify-start print:justify-center gap-1 leading-none mt-1 print-card-subtitle print:mt-0">
                     <i data-lucide="user" class="w-3.5 h-3.5 text-slate-500 opacity-80 shrink-0 print:hidden"></i> 
                     <span class="text-center truncate">${escapeHtml(teacher.name)}</span>
                </div>
                ${alertHtml}
                
                <div class="absolute top-1 right-1 hidden group-hover:flex gap-0.5 bg-white/95 backdrop-blur-xs rounded border border-slate-200 p-0.5 shadow-md print:hidden">
                    <button type="button" onclick="openPopover('${block.id}')" class="p-0.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded font-bold" title="Quick Move"><i data-lucide="arrow-right-left" class="w-3.5 h-3.5 font-bold"></i></button>
                    <button type="button" onclick="openEditModal('${block.id}')" class="p-0.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded font-bold" title="Edit"><i data-lucide="edit-2" class="w-3.5 h-3.5 font-bold"></i></button>
                    <button type="button" onclick="deleteBlock('${block.id}')" class="p-0.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded font-bold" title="Delete"><i data-lucide="trash" class="w-3.5 h-3.5 font-bold"></i></button>
                </div>
            `;

            el.onclick = (e) => {
                if (e.target.closest('button')) return; 
                handleCardHighlightSelect(block.id);
            };

            el.addEventListener('dragstart', (e) => {
                State.draggedBlockId = block.id;
                e.dataTransfer.effectAllowed = 'move';
                setTimeout(() => el.classList.add('dragging'), 0);
            });
            
            el.addEventListener('dragend', () => {
                el.classList.remove('dragging');
                document.querySelectorAll('.drag-over-active').forEach(c => c.classList.remove('drag-over-active'));
            });

            setupTouchListeners(el, block.id);
            return el;
        };

        const openResourceModal = () => {
            setResourceTab('school');
            document.getElementById('resource-modal').style.display = 'flex';
        };

        const closeResourceModal = () => {
            document.getElementById('resource-modal').style.display = 'none';
        };

        const openCreateModal = () => {
            if (State.workspace.grades.length === 0) {
                showToast("Please add at least one Grade level in Settings first.", "error");
                return;
            }
            populateSelects('create');
            
            const isKinder = State.workspace.activeTab === 'master_kinder';
            const isG12 = State.workspace.activeTab === 'master_g12';
            let targetDay = (State.workspace.activeTab === 'master' || State.workspace.activeTab === 'master_g12' || State.workspace.activeTab === 'master_kinder') ? 'master' : State.workspace.gradelevelDayFilter;
            
            let targetGrade = "Grade 4";
            if (isKinder) targetGrade = "Kindergarten";
            else if (isG12) targetGrade = "Grade 1";
            else if (State.workspace.activeTab === 'gradelevel') targetGrade = State.workspace.gradelevelFilter;

            let targetSection = "";
            if (targetDay !== 'master') {
                const availableSections = State.workspace.sections.filter(s => s.grade === targetGrade);
                if (availableSections.length > 0) targetSection = availableSections[0].id;
            }

            const activeSlots = getActiveTimeSlotsForCurrentView();
            const targetTimeSlot = activeSlots.length > 0 ? activeSlots[0].id : "";

            setupCreateModalValues(targetDay, targetGrade, targetSection, targetTimeSlot);
            document.getElementById('create-modal').style.display = 'flex';
        };

        const openCreateModalAtMaster = (grade, slotId) => {
            populateSelects('create');
            setupCreateModalValues('master', grade, '', slotId);
            document.getElementById('create-modal').style.display = 'flex';
        };

        const openCreateModalAtSection = (sectionId, slotId) => {
            populateSelects('create');
            const dayFilter = State.workspace.gradelevelDayFilter;
            const sec = State.workspace.sections.find(s => s.id === sectionId);
            const grade = sec ? sec.grade : State.workspace.gradelevelFilter;
            setupCreateModalValues(dayFilter, grade, sectionId, slotId);
            document.getElementById('create-modal').style.display = 'flex';
        };

        const setupCreateModalValues = (day, grade, sectionId, slotId) => {
            document.getElementById('create-day-hidden').value = day;
            document.getElementById('create-grade-hidden').value = grade;
            document.getElementById('create-section-hidden').value = sectionId;
            document.getElementById('create-timeslot-hidden').value = slotId;

            const infoBox = document.getElementById('create-target-info');
            const slotObj = State.workspace.timeSlots.find(s => s.id === slotId);
            const slotText = slotObj ? `${formatTo12Hour(slotObj.start)} - ${formatTo12Hour(slotObj.end)}` : 'Auto Slot';
            const dayText = day === 'master' ? 'Master Schedule' : day.toUpperCase();
            
            let locationText = grade;
            if (sectionId) {
                const secObj = State.workspace.sections.find(s => s.id === sectionId);
                if (secObj) locationText = `${grade} (Section ${secObj.name})`;
            }

            infoBox.innerHTML = `
                <i data-lucide="info" class="w-4 h-4 text-emerald-600 shrink-0"></i>
                <div>
                    Target Locked: <strong>${locationText}</strong> &bull; <strong>${dayText}</strong> &bull; <strong>${slotText}</strong>
                </div>
            `;
            lucide.createIcons();
        };

        const closeCreateModal = () => {
            document.getElementById('create-form').reset();
            document.getElementById('create-modal').style.display = 'none';
        };

        const openEditModal = (id) => {
            const block = State.workspace.classes.find(c => c.id === id);
            if (!block) return;

            populateSelects('edit');
            document.getElementById('edit-class-id').value = block.id;
            document.getElementById('edit-subject-select').value = block.subjectId;
            document.getElementById('edit-teacher-select').value = block.teacherId;
            document.getElementById('edit-timeslot-select').value = block.timeSlotId;

            document.getElementById('edit-modal').style.display = 'flex';
        };

        const closeEditModal = () => {
            document.getElementById('edit-form').reset();
            document.getElementById('edit-modal').style.display = 'none';
        };

        const openPopover = (id) => {
            State.activeQuickMoveId = id;
            const btnContainer = document.getElementById('quick-move-buttons');
            if (!btnContainer) return;
            btnContainer.innerHTML = '';

            const block = State.workspace.classes.find(c => c.id === id);
            if (!block) return;

            const isMasterKinder = State.workspace.activeTab === 'master_kinder';
            const isMasterG12 = State.workspace.activeTab === 'master_g12';
            const isMasterG36 = State.workspace.activeTab === 'master';

            const activeSlots = getActiveTimeSlotsForCurrentView();

            if (isMasterKinder) {
                activeSlots.forEach(slot => {
                    if (slot.type === 'universal') return;
                    const btn = document.createElement('button');
                    btn.className = "text-left py-2 px-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 rounded-lg text-[11px] font-medium transition flex justify-between";
                    btn.innerHTML = `<span>${formatTo12Hour(slot.start)} (Kinder)</span> <span class="text-[9px] text-slate-400 font-bold">Move</span>`;
                    btn.onclick = () => {
                        executeDragMoveMaster(State.activeQuickMoveId, "Kindergarten", slot.id);
                        closePopover();
                    };
                    btnContainer.appendChild(btn);
                });
            } else if (isMasterG12) {
                const targetGrades = ["Grade 1", "Grade 2"];
                activeSlots.forEach(slot => {
                    if (slot.type === 'universal') return;
                    targetGrades.forEach(g => {
                        const btn = document.createElement('button');
                        btn.className = "text-left py-2 px-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 rounded-lg text-[11px] font-medium transition flex justify-between";
                        btn.innerHTML = `<span>${formatTo12Hour(slot.start)} (${g})</span> <span class="text-[9px] text-slate-400 font-bold">Move</span>`;
                        btn.onclick = () => {
                            executeDragMoveMaster(State.activeQuickMoveId, g, slot.id);
                            closePopover();
                        };
                        btnContainer.appendChild(btn);
                    });
                });
            } else if (isMasterG36) {
                const targetGrades = ["Grade 3", "Grade 4", "Grade 5", "Grade 6"];
                activeSlots.forEach(slot => {
                    if (slot.type === 'universal') return;
                    targetGrades.forEach(g => {
                        const btn = document.createElement('button');
                        btn.className = "text-left py-2 px-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 rounded-lg text-[11px] font-medium transition flex justify-between";
                        btn.innerHTML = `<span>${formatTo12Hour(slot.start)} (${g})</span> <span class="text-[9px] text-slate-400 font-bold">Move</span>`;
                        btn.onclick = () => {
                            executeDragMoveMaster(State.activeQuickMoveId, g, slot.id);
                            closePopover();
                        };
                        btnContainer.appendChild(btn);
                    });
                });
            } else {
                const activeSections = State.workspace.sections.filter(sec => sec.grade === State.workspace.gradelevelFilter);
                activeSlots.forEach(slot => {
                    if (slot.type === 'universal') return;
                    activeSections.forEach(sec => {
                        const btn = document.createElement('button');
                        btn.className = "text-left py-2 px-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 rounded-lg text-[11px] font-medium transition flex justify-between font-semibold";
                        btn.innerHTML = `<span>${formatTo12Hour(slot.start)} (${sec.name})</span> <span class="text-[9px] text-slate-400 font-bold">Move</span>`;
                        btn.onclick = () => {
                            executeDragMoveSection(State.activeQuickMoveId, sec.id, slot.id, State.workspace.gradelevelDayFilter);
                            closePopover();
                        };
                        btnContainer.appendChild(btn);
                    });
                });
            }

            document.getElementById('quick-move-popover').style.display = 'flex';
            lucide.createIcons();
        };

        const closePopover = () => {
            State.activeQuickMoveId = null;
            document.getElementById('quick-move-popover').style.display = 'none';
        };

        const populateSelects = (prefix) => {
            const subSel = document.getElementById(`${prefix}-subject-select`);
            const teachSel = document.getElementById(`${prefix}-teacher-select`);

            if (!subSel || !teachSel) return;

            subSel.innerHTML = ''; teachSel.innerHTML = ''; 

            State.workspace.subjects.forEach(s => subSel.add(new Option(s.name, s.id)));
            State.workspace.teachers.forEach(t => teachSel.add(new Option(t.name, t.id)));
            
            if (prefix === 'edit') {
                const slotSel = document.getElementById(`edit-timeslot-select`);
                if (slotSel) {
                    slotSel.innerHTML = '';
                    const activeSlots = getActiveTimeSlotsForCurrentView();
                    activeSlots.forEach(slot => {
                        if(slot.type === 'universal') return;
                        const label = `${formatTo12Hour(slot.start)} - ${formatTo12Hour(slot.end)} (${slot.mins} mins)`;
                        slotSel.add(new Option(label, slot.id));
                    });
                }
            }
        };

        const setupTouchListeners = (el, blockId) => {
            let touchClone = null;
            let lastTargetCell = null;

            el.addEventListener('touchstart', (e) => {
                if (e.touches.length > 1) return;
                
                e.preventDefault();
                
                State.draggedBlockId = blockId;
                const touch = e.touches[0];
                el.classList.add('dragging');

                touchClone = el.cloneNode(true);
                touchClone.id = 'touch-drag-avatar';
                touchClone.style.position = 'fixed';
                touchClone.style.width = el.offsetWidth + 'px';
                touchClone.style.height = el.offsetHeight + 'px';
                touchClone.style.pointerEvents = 'none';
                touchClone.style.opacity = '0.85';
                touchClone.style.zIndex = '1000';
                touchClone.style.left = (touch.clientX - el.offsetWidth / 2) + 'px';
                touchClone.style.top = (touch.clientY - el.offsetHeight / 2) + 'px';
                document.body.appendChild(touchClone);

                currentPointerY = touch.clientY;
                startAutoScroll();

                const onTouchMove = (moveEvent) => {
                    if (!touchClone) return;
                    if (moveEvent.cancelable) moveEvent.preventDefault();

                    const t = moveEvent.touches[0];
                    touchClone.style.left = (t.clientX - touchClone.offsetWidth / 2) + 'px';
                    touchClone.style.top = (t.clientY - touchClone.offsetHeight / 2) + 'px';

                    currentPointerY = t.clientY;

                    const elementUnder = document.elementFromPoint(t.clientX, t.clientY);
                    if (!elementUnder) return;

                    const targetCell = elementUnder.closest('td[data-grade], td[data-section-id]');

                    if (lastTargetCell && lastTargetCell !== targetCell) {
                        lastTargetCell.classList.remove('drag-over-active');
                    }

                    if (targetCell) {
                        targetCell.classList.add('drag-over-active');
                        lastTargetCell = targetCell;
                    } else {
                        lastTargetCell = null;
                    }
                };

                const onTouchEnd = () => {
                    el.classList.remove('dragging');
                    if (touchClone) {
                        touchClone.remove();
                        touchClone = null;
                    }

                    stopAutoScroll();

                    if (lastTargetCell) {
                        lastTargetCell.classList.remove('drag-over-active');
                        const slotId = lastTargetCell.dataset.slotId;
                        const grade = lastTargetCell.dataset.grade;
                        const sectionId = lastTargetCell.dataset.sectionId;

                        if (State.workspace.activeTab.startsWith('master') && grade && slotId) {
                            executeDragMoveMaster(State.draggedBlockId, grade, slotId);
                        } else if (State.workspace.activeTab === 'gradelevel' && sectionId && slotId) {
                            executeDragMoveSection(State.draggedBlockId, sectionId, slotId, State.workspace.gradelevelDayFilter);
                        }
                        lastTargetCell = null;
                    }
                    State.draggedBlockId = null;

                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                    document.removeEventListener('touchcancel', onTouchEnd);
                };

                document.addEventListener('touchmove', onTouchMove, { passive: false });
                document.addEventListener('touchend', onTouchEnd, { passive: false });
                document.addEventListener('touchcancel', onTouchEnd, { passive: false });

            }, { passive: false });

            el.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
        };

        const executeDragMoveMaster = (blockId, grade, slotId) => {
            const block = State.workspace.classes.find(c => c.id === blockId);
            if (block) {
                const displaced = State.workspace.classes.find(c => 
                    c.id !== blockId && 
                    c.day === 'master' && 
                    c.timeSlotId === slotId && 
                    c.grade === grade
                );
                if (displaced) {
                    State.workspace.classes = State.workspace.classes.filter(c => c.id !== displaced.id);
                    showToast(`Displaced block was removed`);
                }

                block.grade = grade;
                block.sectionId = ''; 
                block.timeSlotId = slotId;
                block.day = 'master';
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderAll();
                showToast("Schedule updated!");
            }
            State.draggedBlockId = null;
        };

        const executeDragMoveSection = (blockId, sectionId, slotId, dayFilter) => {
            const block = State.workspace.classes.find(c => c.id === blockId);
            const targetSection = State.workspace.sections.find(s => s.id === sectionId);
            if (block && targetSection) {
                const displaced = State.workspace.classes.find(c => 
                    c.id !== blockId && 
                    c.day === dayFilter && 
                    c.timeSlotId === slotId && 
                    c.sectionId === sectionId
                );
                if (displaced) {
                    State.workspace.classes = State.workspace.classes.filter(c => c.id !== displaced.id);
                    showToast(`Displaced block was removed`);
                }

                block.grade = targetSection.grade;
                block.sectionId = sectionId;
                block.timeSlotId = slotId;
                block.day = dayFilter;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderAll();
                showToast("Schedule updated!");
            }
            State.draggedBlockId = null;
        };

        const exportData = () => {
            try {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(State.workspace, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", "school_program_matrix_backup.json");
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                showToast("Class program backup downloaded.");
            } catch (err) {
                showToast("Unable to export data locally.", "error");
            }
        };

        const triggerImport = () => {
            document.getElementById('import-file-input').click();
        };

        const handleImport = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedState = JSON.parse(event.target.result);
                    if (importedState.subjects && importedState.teachers) {
                        State.workspace = migrateLegacyData(importedState);
                        saveState(isCloudConnected, currentRoomCode, saveToCloud);
                        setActiveTab(State.workspace.activeTab);
                        showToast("Class Program backup imported!");
                    } else {
                        showToast("Invalid backup file format.", "error");
                    }
                } catch (err) {
                    showToast("Failed to read the backup data.", "error");
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        };

        const handleCreateClass = (e) => {
            e.preventDefault();
            const subjectId = document.getElementById('create-subject-select').value;
            const day = document.getElementById('create-day-hidden').value;
            const teacherId = document.getElementById('create-teacher-select').value;
            const timeSlotId = document.getElementById('create-timeslot-hidden').value;
            const grade = document.getElementById('create-grade-hidden').value;
            const sectionId = document.getElementById('create-section-hidden').value;

            if (timeSlotId) {
                const displaced = State.workspace.classes.find(c => {
                    if (day === 'master') {
                        return c.day === 'master' && c.timeSlotId === timeSlotId && c.grade === grade;
                    } else {
                        return c.day === day && c.timeSlotId === timeSlotId && c.sectionId === sectionId;
                    }
                });
                if (displaced) {
                    State.workspace.classes = State.workspace.classes.filter(c => c.id !== displaced.id);
                    showToast(`Displaced block was removed`);
                }
            }

            const newBlock = { id: generateId('c'), subjectId, grade, sectionId, teacherId, timeSlotId, day };
            State.workspace.classes.push(newBlock);
            
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            closeCreateModal();
            renderAll();
            showToast("Matrix class block created!");
        };

        const handleSaveEdit = (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-class-id').value;
            const block = State.workspace.classes.find(c => c.id === id);
            
            if (block) {
                const newSlot = document.getElementById('edit-timeslot-select').value;
                const newTeacher = document.getElementById('edit-teacher-select').value;
                const newSubject = document.getElementById('edit-subject-select').value;

                if (newSlot) {
                    const displaced = State.workspace.classes.find(c => 
                        c.id !== block.id && 
                        c.day === block.day && 
                        c.timeSlotId === newSlot && 
                        (block.day === 'master' ? c.grade === block.grade : c.sectionId === block.sectionId)
                    );
                    if (displaced) {
                        State.workspace.classes = State.workspace.classes.filter(c => c.id !== displaced.id);
                    }
                }

                block.subjectId = newSubject;
                block.teacherId = newTeacher;
                block.timeSlotId = newSlot;

                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                closeEditModal();
                renderAll();
                showToast("Block program details saved.");
            }
        };

        const deleteBlock = (id) => {
            showConfirm("Delete Schedule Block", "Are you sure you want to remove this academic block?", () => {
                State.workspace.classes = State.workspace.classes.filter(c => c.id !== id);
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderAll();
                showToast("Schedule block deleted.");
            });
        };

        const setResourceTab = (tab) => {
            State.activeResourceTab = tab;
            ['school', 'teachers', 'subjects', 'timeslots', 'grades', 'sections', 'cloud'].forEach(t => {
                const btn = document.getElementById(`res-tab-${t}`);
                const sec = document.getElementById(`res-sec-${t}`);
                if (t === tab) {
                    btn.className = "px-3 py-1.5 text-xs font-bold rounded-lg border transition-all bg-emerald-600 text-white border-emerald-600 font-semibold";
                    sec.classList.remove('hidden');
                } else {
                    btn.className = "px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 bg-white text-slate-700 font-semibold";
                    sec.classList.add('hidden');
                }
            });
            if (tab === 'school') {
                document.getElementById('cfg-region').value = State.workspace.schoolConfig.region;
                document.getElementById('cfg-division').value = State.workspace.schoolConfig.division;
                document.getElementById('cfg-district').value = State.workspace.schoolConfig.district;
                document.getElementById('cfg-schoolName').value = State.workspace.schoolConfig.schoolName;
                document.getElementById('cfg-schoolAddress').value = State.workspace.schoolConfig.schoolAddress;
                document.getElementById('cfg-sy').value = State.workspace.schoolConfig.schoolYear;
                document.getElementById('cfg-sig1-name').value = State.workspace.schoolConfig.signatory1Name;
                document.getElementById('cfg-sig1-title').value = State.workspace.schoolConfig.signatory1Title;
                document.getElementById('cfg-sig2-name').value = State.workspace.schoolConfig.signatory2Name;
                document.getElementById('cfg-sig2-title').value = State.workspace.schoolConfig.signatory2Title;
            }
            if (tab === 'timeslots') {
                document.getElementById('cfg-ripple-cascade').checked = State.workspace.rippleCascadeEnabled !== false;
            }
            renderResourceLists();
        };

        const toggleSlotLabelInput = (type) => {
            const container = document.getElementById('slot-label-container');
            if (type === 'universal') {
                container.classList.remove('hidden');
                document.getElementById('slot-label-input').required = true;
            } else {
                container.classList.add('hidden');
                document.getElementById('slot-label-input').required = false;
            }
        };

        const handleCreateTimeSlot = (e) => {
            e.preventDefault();
            const start = document.getElementById('slot-start-input').value;
            const end = document.getElementById('slot-end-input').value;
            const group = document.getElementById('slot-group-input').value;
            const type = document.getElementById('slot-type-input').value;
            const label = document.getElementById('slot-label-input').value.trim().toUpperCase();

            const startMins = timeToMins(start);
            const endMins = timeToMins(end);

            if (endMins <= startMins) {
                showToast("End time must be set chronologically after start time.", "error");
                return;
            }

            const mins = endMins - startMins;
            const newSlot = {
                id: generateId('ts'),
                start,
                end,
                mins,
                type,
                group,
                label: type === 'universal' ? label : ''
            };

            State.workspace.timeSlots.push(newSlot);
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            
            document.getElementById('slot-start-input').value = '';
            document.getElementById('slot-end-input').value = '';
            document.getElementById('slot-label-input').value = '';
            showToast("New Time Slot row added.");
        };

        const moveTimeSlotUp = (index) => {
            if (index <= 0) return;
            const temp = State.workspace.timeSlots[index];
            State.workspace.timeSlots[index] = State.workspace.timeSlots[index - 1];
            State.workspace.timeSlots[index - 1] = temp;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Time slot moved up.");
        };

        const moveTimeSlotDown = (index) => {
            if (index >= State.workspace.timeSlots.length - 1) return;
            const temp = State.workspace.timeSlots[index];
            State.workspace.timeSlots[index] = State.workspace.timeSlots[index + 1];
            State.workspace.timeSlots[index + 1] = temp;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Time slot moved down.");
        };

        const sortTimeSlotsChronologically = () => {
            State.workspace.timeSlots.sort((a, b) => timeToMins(a.start) - timeToMins(b.start));
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Time slots sorted chronologically.");
        };

        const deleteTimeSlot = (id) => {
            const assignedClasses = State.workspace.classes.filter(c => c.timeSlotId === id);
            
            const performDelete = () => {
                State.workspace.classes = State.workspace.classes.filter(c => c.timeSlotId !== id);
                State.workspace.timeSlots = State.workspace.timeSlots.filter(ts => ts.id !== id);
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
                showToast("Time slot row deleted successfully.");
            };

            if (assignedClasses.length > 0) {
                showConfirm(
                    "Delete Time Slot?", 
                    `There are ${assignedClasses.length} class(es) scheduled inside this slot. Deleting this slot will permanently remove those schedules. Proceed?`, 
                    performDelete
                );
            } else {
                performDelete();
            }
        };

        const handleCreateGrade = (e) => {
            e.preventDefault();
            const input = document.getElementById('grade-name-input');
            const name = input ? input.value.trim() : "";
            if(name) {
                if (State.workspace.grades.includes(name)) {
                    showToast("Grade level already exists.", "error");
                    return;
                }
                State.workspace.grades.push(name);
                input.value = '';
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
                showToast("Grade level added.");
            }
        };

        const deleteGrade = (grade) => {
            const assignedClasses = State.workspace.classes.filter(c => c.grade === grade);
            
            const performDelete = () => {
                State.workspace.classes = State.workspace.classes.filter(c => c.grade !== grade);
                State.workspace.grades = State.workspace.grades.filter(g => g !== grade);
                State.workspace.sections = State.workspace.sections.filter(sec => sec.grade !== grade);
                if (State.workspace.advisers[grade]) {
                    delete State.workspace.advisers[grade];
                }
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
                showToast("Grade level removed.");
            };

            if (assignedClasses.length > 0) {
                showConfirm(
                    "Delete Grade Level?",
                    `There are ${assignedClasses.length} classes scheduled for ${grade}. Removing this will permanently delete its associated sections and schedules. Proceed?`,
                    performDelete
                );
            } else {
                performDelete();
            }
        };

        const moveGradeUp = (index) => {
            if (index <= 0) return;
            const temp = State.workspace.grades[index];
            State.workspace.grades[index] = State.workspace.grades[index - 1];
            State.workspace.grades[index - 1] = temp;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Grade column reordered.");
        };

        const moveGradeDown = (index) => {
            if (index >= State.workspace.grades.length - 1) return;
            const temp = State.workspace.grades[index];
            State.workspace.grades[index] = State.workspace.grades[index + 1];
            State.workspace.grades[index + 1] = temp;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Grade column reordered.");
        };

        const handleCreateSection = (e) => {
            e.preventDefault();
            const grade = document.getElementById('section-grade-select').value;
            const input = document.getElementById('section-name-input');
            const name = input ? input.value.trim() : "";

            if (!grade) {
                showToast("Please create a Grade Level first.", "error");
                return;
            }

            if (State.workspace.sections.some(s => s.grade === grade && s.name === name)) {
                showToast("Section name already exists in this Grade Level.", "error");
                return;
            }

            State.workspace.sections.push({
                id: generateId('sec'),
                name,
                grade
            });
            if (input) input.value = '';
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Section added.");
        };

        const deleteSection = (sectionId) => {
            const assignedClasses = State.workspace.classes.filter(c => c.sectionId === sectionId);
            
            const performDelete = () => {
                State.workspace.classes = State.workspace.classes.filter(c => c.sectionId !== sectionId);
                State.workspace.sections = State.workspace.sections.filter(sec => sec.id !== sectionId);
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
                showToast("Section deleted.");
            };

            if (assignedClasses.length > 0) {
                showConfirm(
                    "Delete Section Column?",
                    `There are ${assignedClasses.length} classes scheduled for this section. Removing this column will permanently delete those blocks. Proceed?`,
                    performDelete
                );
            } else {
                performDelete();
            }
        };

        const moveSectionUp = (index, grade) => {
            const list = State.workspace.sections.filter(s => s.grade === grade);
            if (index <= 0) return;
            const globalIndex1 = State.workspace.sections.findIndex(s => s.id === list[index].id);
            const globalIndex2 = State.workspace.sections.findIndex(s => s.id === list[index - 1].id);
            
            const temp = State.workspace.sections[globalIndex1];
            State.workspace.sections[globalIndex1] = State.workspace.sections[globalIndex2];
            State.workspace.sections[globalIndex2] = temp;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Sections reordered.");
        };

        const moveSectionDown = (index, grade) => {
            const list = State.workspace.sections.filter(s => s.grade === grade);
            if (index >= list.length - 1) return;
            const globalIndex1 = State.workspace.sections.findIndex(s => s.id === list[index].id);
            const globalIndex2 = State.workspace.sections.findIndex(s => s.id === list[index + 1].id);
            
            const temp = State.workspace.sections[globalIndex1];
            State.workspace.sections[globalIndex1] = State.workspace.sections[globalIndex2];
            State.workspace.sections[globalIndex2] = temp;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Sections reordered.");
        };

        const startTeacherEdit = (id) => {
            State.editingTeacherId = id;
            renderResourceLists();
        };

        const cancelTeacherEdit = () => {
            State.editingTeacherId = null;
            renderResourceLists();
        };

        const saveTeacherEdit = (id) => {
            const input = document.getElementById(`edit-t-name-${id}`);
            if (!input) return;
            const newName = input.value.trim().toUpperCase();
            if (!newName) {
                showToast("Teacher name cannot be empty.", "error");
                return;
            }
            const teacher = State.workspace.teachers.find(t => t.id === id);
            if (teacher) {
                teacher.name = newName;
                State.editingTeacherId = null;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
                showToast("Teacher name globally updated!");
            }
        };

        const updateTeacherColorInline = (id, colorKey) => {
            const teacher = State.workspace.teachers.find(t => t.id === id);
            if (teacher) {
                teacher.color = colorKey;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
            }
        };

        const startSubjectEdit = (id) => {
            State.editingSubjectId = id;
            renderResourceLists();
        };

        const cancelSubjectEdit = () => {
            State.editingSubjectId = null;
            renderResourceLists();
        };

        const saveSubjectEdit = (id) => {
            const input = document.getElementById(`edit-s-name-${id}`);
            if (!input) return;
            const newName = input.value.trim().toUpperCase();
            if (!newName) {
                showToast("Subject name cannot be empty.", "error");
                return;
            }
            const subject = State.workspace.subjects.find(s => s.id === id);
            if (subject) {
                subject.name = newName;
                State.editingSubjectId = null;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
                showToast("Subject updated globally!");
            }
        };

        const startSectionEdit = (id) => {
            State.editingSectionId = id;
            renderResourceLists();
        };

        const cancelSectionEdit = () => {
            State.editingSectionId = null;
            renderResourceLists();
        };

        const saveSectionEdit = (id) => {
            const input = document.getElementById(`edit-sec-name-${id}`);
            if (!input) return;
            const newName = input.value.trim().toUpperCase();
            if (!newName) {
                showToast("Section title cannot be empty.", "error");
                return;
            }
            const section = State.workspace.sections.find(s => s.id === id);
            if (section) {
                section.name = newName;
                State.editingSectionId = null;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
                showToast("Section title updated globally!");
            }
        };

        const startTimeSlotEdit = (id) => {
            State.editingTimeSlotId = id;
            renderResourceLists();
        };

        const cancelTimeSlotEdit = () => {
            State.editingTimeSlotId = null;
            renderResourceLists();
        };

        const saveTimeSlotEdit = (id) => {
            const startInput = document.getElementById(`edit-ts-start-${id}`);
            const endInput = document.getElementById(`edit-ts-end-${id}`);
            const labelInput = document.getElementById(`edit-ts-label-${id}`);

            if (!startInput || !endInput) return;

            const start = startInput.value;
            const end = endInput.value;
            const startMins = timeToMins(start);
            const endMins = timeToMins(end);

            if (endMins <= startMins) {
                showToast("End time must be set chronologically after start time.", "error");
                return;
            }

            const tsObj = State.workspace.timeSlots.find(t => t.id === id);
            if (tsObj) {
                tsObj.start = start;
                tsObj.end = end;
                tsObj.mins = endMins - startMins;
                if (tsObj.type === 'universal' && labelInput) {
                    tsObj.label = labelInput.value.trim().toUpperCase() || "UNIVERSAL EVENT";
                }

                if (State.workspace.rippleCascadeEnabled !== false) {
                    const targetGroup = tsObj.group;
                    const sortedSlots = [...State.workspace.timeSlots].sort((a, b) => timeToMins(a.start) - timeToMins(b.start));
                    const editIdx = sortedSlots.findIndex(t => t.id === id);
                    
                    let currentEndMins = endMins;
                    for (let i = editIdx + 1; i < sortedSlots.length; i++) {
                        const nextTs = sortedSlots[i];
                        if (nextTs.group === targetGroup || targetGroup === 'all' || nextTs.group === 'all') {
                            const dur = nextTs.mins;
                            const nextStartStr = minsToTime(currentEndMins);
                            const nextEndStr = minsToTime(currentEndMins + dur);
                            
                            const actualTs = State.workspace.timeSlots.find(t => t.id === nextTs.id);
                            if (actualTs) {
                                actualTs.start = nextStartStr;
                                actualTs.end = nextEndStr;
                            }
                            currentEndMins += dur;
                        }
                    }
                }

                State.editingTimeSlotId = null;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
                showToast("Time slot row updated successfully!");
            }
        };

        const renderResourceLists = () => {
            if (State.activeResourceTab === 'subjects') {
                const subList = document.getElementById('subjects-list-container');
                subList.innerHTML = State.workspace.subjects.map(s => {
                    const isEditing = State.editingSubjectId === s.id;
                    if (isEditing) {
                        return `
                        <div class="flex items-center gap-2 p-2 bg-white border border-emerald-200 rounded-xl shadow-sm transition">
                            <input type="text" id="edit-s-name-${s.id}" value="${escapeHtml(s.name)}" class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 uppercase">
                            <button onclick="saveSubjectEdit('${s.id}')" class="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-2.5 py-1 text-xs font-bold transition">Save</button>
                            <button onclick="cancelSubjectEdit()" class="bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg px-2 py-1 text-xs font-bold transition">Cancel</button>
                        </div>
                        `;
                    } else {
                        return `
                        <div class="flex justify-between items-center p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition">
                            <span class="text-xs font-bold text-slate-800 truncate">${escapeHtml(s.name)}</span>
                            <div class="flex items-center gap-1.5">
                                <button onclick="startSubjectEdit('${s.id}')" class="p-1 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition" title="Edit Subject">
                                    <i data-lucide="edit-2" class="w-3.5 h-3.5 font-bold"></i>
                                </button>
                                <button type="button" onclick="deleteSubject('${s.id}')" class="text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 p-1 font-bold transition ml-1"><i data-lucide="x" class="w-4 h-4 font-bold"></i></button>
                            </div>
                        </div>
                        `;
                    }
                }).join('');
            }

            if (State.activeResourceTab === 'teachers') {
                const teachList = document.getElementById('teachers-list-container');
                teachList.innerHTML = State.workspace.teachers.map(t => {
                    const isEditing = State.editingTeacherId === t.id;
                    
                    if (isEditing) {
                        return `
                        <div class="flex flex-col gap-2 p-3 bg-white border border-emerald-200 rounded-xl shadow-sm transition">
                            <div class="flex items-center gap-2">
                                <input type="text" id="edit-t-name-${t.id}" value="${escapeHtml(t.name)}" class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                                <button onclick="saveTeacherEdit('${t.id}')" class="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-2.5 py-1 text-xs font-bold transition">Save</button>
                                <button onclick="cancelTeacherEdit()" class="bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg px-2 py-1 text-xs font-bold transition">Cancel</button>
                            </div>
                            <div class="flex flex-col gap-1 mt-1">
                                <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Select Signature Color Theme:</span>
                                <div class="grid grid-cols-5 gap-1.5 p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                                    ${Object.keys(teacherColors).map(colorKey => {
                                        const isSelected = t.color === colorKey;
                                        const bgClass = hexBadgeColor[colorKey];
                                        return `
                                            <button onclick="updateTeacherColorInline('${t.id}', '${colorKey}')" class="w-full h-4.5 rounded ring-offset-1 ${bgClass} ${isSelected ? 'ring-2 ring-emerald-500 border border-white' : 'opacity-80 hover:opacity-100'}" title="${colorKey}"></button>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                        `;
                    } else {
                        return `
                        <div class="flex justify-between items-center p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition">
                            <div class="flex items-center gap-2 min-w-0">
                                <span class="w-3 h-3 rounded-full ${hexBadgeColor[t.color || 'blue']} shrink-0"></span>
                                <span class="text-xs font-bold text-slate-800 truncate">${escapeHtml(t.name)}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <button onclick="startTeacherEdit('${t.id}')" class="p-1 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition" title="Edit Teacher Details">
                                    <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                                </button>
                                <button type="button" onclick="deleteTeacher('${t.id}')" class="text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 p-1 transition font-bold"><i data-lucide="x" class="w-4 h-4 font-bold"></i></button>
                            </div>
                        </div>
                        `;
                    }
                }).join('');
                
                const advisersSettings = document.getElementById('advisers-settings-container');
                advisersSettings.innerHTML = '';
                State.workspace.grades.forEach(grade => {
                    const blockDiv = document.createElement('div');
                    blockDiv.className = "p-3 bg-white rounded-xl border border-slate-200 shadow-sm mb-3";
                    
                    const label = document.createElement('label');
                    label.className = "block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5";
                    label.innerText = `${grade} Adviser`;
                    
                    const selectContainer = document.createElement('div');
                    selectContainer.className = "relative";
                    
                    const select = document.createElement('select');
                    select.className = "w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-700 focus:outline-none focus:border-emerald-500 appearance-none font-semibold";
                    select.onchange = (e) => updateAdviserMap(grade, e.target.value);
                    
                    select.add(new Option("-- No Adviser --", ""));
                    State.workspace.teachers.forEach(t => {
                        select.add(new Option(t.name, t.id));
                    });
                    select.value = State.workspace.advisers[grade] || '';
                    
                    const chevron = document.createElement('div');
                    chevron.className = "absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500";
                    chevron.innerHTML = `<i data-lucide="chevron-down" class="w-4 h-4"></i>`;

                    selectContainer.appendChild(select);
                    selectContainer.appendChild(chevron);

                    blockDiv.appendChild(label);
                    blockDiv.appendChild(selectContainer);
                    advisersSettings.appendChild(blockDiv);
                });
            }

            if (State.activeResourceTab === 'timeslots') {
                const slotsContainer = document.getElementById('timeslots-list-container');
                
                const filteredList = State.workspace.timeSlots
                    .map((ts, idx) => ({ ts, originalIndex: idx }))
                    .filter(({ ts }) => {
                        if (State.activeTimeSlotFilter === 'all') return true;
                        if (State.activeTimeSlotFilter === 'all_shared') return ts.group === 'all';
                        return ts.group === State.activeTimeSlotFilter;
                    });

                slotsContainer.innerHTML = filteredList.map(({ ts, originalIndex }) => {
                    const isUniversal = ts.type === 'universal';
                    const typeBadge = isUniversal 
                        ? `<span class="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-100 text-amber-800 uppercase shrink-0 font-bold">Universal Event</span>` 
                        : `<span class="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-100 text-blue-800 uppercase shrink-0 font-bold">Academic Grid</span>`;
                    
                    const isEditing = State.editingTimeSlotId === ts.id;
                    
                    if (isEditing) {
                        return `
                        <div class="flex flex-col gap-2 p-3 bg-white border border-emerald-200 rounded-xl shadow-sm transition">
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block text-[8px] uppercase font-bold text-slate-400 mb-0.5">Start Time</label>
                                    <input type="time" id="edit-ts-start-${ts.id}" value="${ts.start}" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                                </div>
                                <div>
                                    <label class="block text-[8px] uppercase font-bold text-slate-400 mb-0.5">End Time</label>
                                    <input type="time" id="edit-ts-end-${ts.id}" value="${ts.end}" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                                </div>
                            </div>
                            ${isUniversal ? `
                                <div>
                                    <label class="block text-[8px] uppercase font-bold text-slate-400 mb-0.5">Universal Event Label</label>
                                    <input type="text" id="edit-ts-label-${ts.id}" value="${escapeHtml(ts.label || '')}" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 uppercase">
                                </div>
                            ` : ''}
                            <div class="flex gap-1.5 mt-1">
                                <button onclick="saveTimeSlotEdit('${ts.id}')" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-1 text-xs font-bold transition">Save</button>
                                <button onclick="cancelTimeSlotEdit()" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg py-1 text-xs font-bold transition">Cancel</button>
                            </div>
                        </div>
                        `;
                    } else {
                        const labelDisplay = isUniversal ? `<div class="text-[10px] text-amber-700 font-bold leading-tight mt-0.5 font-sans font-bold">Label: ${escapeHtml(ts.label)}</div>` : '';
                        
                        return `
                        <div class="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs flex justify-between items-center gap-2">
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="text-xs font-bold text-slate-800">${formatTo12Hour(ts.start)} - ${formatTo12Hour(ts.end)}</span>
                                    <span class="text-[10px] text-slate-500 font-bold">(${ts.mins}m)</span>
                                    ${typeBadge}
                                    <select onchange="updateTimeSlotGroup('${ts.id}', this.value)" class="bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-600 font-bold rounded px-1.5 py-0.5 text-[9px] uppercase cursor-pointer transition-colors focus:outline-none">
                                        <option value="g36" ${ts.group === 'g36' ? 'selected' : ''}>Grades 3-6</option>
                                        <option value="g12" ${ts.group === 'g12' ? 'selected' : ''}>Grades 1-2</option>
                                        <option value="kinder" ${ts.group === 'kinder' ? 'selected' : ''}>Kinder</option>
                                        <option value="all" ${ts.group === 'all' ? 'selected' : ''}>Shared</option>
                                    </select>
                                </div>
                                ${labelDisplay}
                            </div>
                            <div class="flex items-center gap-1.5 shrink-0">
                                <button type="button" onclick="startTimeSlotEdit('${ts.id}')" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition" title="Edit Time Slot Times">
                                    <i data-lucide="edit-2" class="w-3.5 h-3.5 font-bold"></i>
                                </button>
                                <button type="button" onclick="moveTimeSlotUp(${originalIndex})" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${originalIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}" ${originalIndex === 0 ? 'disabled' : ''}>
                                    <i data-lucide="arrow-up" class="w-3.5 h-3.5 font-bold"></i>
                                </button>
                                <button type="button" onclick="moveTimeSlotDown(${originalIndex})" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${originalIndex === State.workspace.timeSlots.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}" ${originalIndex === State.workspace.timeSlots.length - 1 ? 'disabled' : ''}>
                                    <i data-lucide="arrow-down" class="w-3.5 h-3.5 font-bold"></i>
                                </button>
                                <button type="button" onclick="deleteTimeSlot('${ts.id}')" class="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 transition ml-1" title="Delete Time Slot"><i data-lucide="trash-2" class="w-3.5 h-3.5 font-bold"></i></button>
                            </div>
                        </div>
                        `;
                    }
                }).join('');
            }

            if (State.activeResourceTab === 'grades') {
                const gradesContainer = document.getElementById('grades-list-container');
                gradesContainer.innerHTML = State.workspace.grades.map((grade, index) => `
                    <div class="flex justify-between items-center p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <span class="text-xs font-bold text-slate-700">${escapeHtml(grade)}</span>
                        <div class="flex items-center gap-1 shrink-0">
                            <button type="button" onclick="moveGradeUp(${index})" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}" ${index === 0 ? 'disabled' : ''}><i data-lucide="arrow-up" class="w-4 h-4 font-bold"></i></button>
                            <button type="button" onclick="moveGradeDown(${index})" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${index === State.workspace.grades.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}" ${index === State.workspace.grades.length - 1 ? 'disabled' : ''}><i data-lucide="arrow-down" class="w-4 h-4 font-bold"></i></button>
                            <button type="button" onclick="deleteGrade('${grade}')" class="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 transition ml-1 font-bold"><i data-lucide="x" class="w-4 h-4 font-bold"></i></button>
                        </div>
                    </div>
                `).join('');
            }

            if (State.activeResourceTab === 'sections') {
                const secContainer = document.getElementById('sections-list-container');
                const gradeSel = document.getElementById('section-grade-select');
                
                gradeSel.innerHTML = '';
                State.workspace.grades.forEach(g => {
                    gradeSel.add(new Option(g, g));
                });

                let sectionsHtml = '';
                State.workspace.grades.forEach(grade => {
                    const gradeSections = State.workspace.sections.filter(s => s.grade === grade);
                    if (gradeSections.length > 0) {
                        sectionsHtml += `
                            <div class="mb-3 font-semibold">
                                <h5 class="text-xs font-extrabold text-slate-500 uppercase border-b border-slate-200 pb-1 mb-1 font-bold">${escapeHtml(grade)}</h5>
                                <div class="space-y-1">
                                    ${gradeSections.map((sec, idx) => {
                                        const isEditing = State.editingSectionId === sec.id;
                                        if (isEditing) {
                                            return `
                                            <div class="flex items-center gap-2 p-2 bg-white border border-emerald-200 rounded-xl shadow-sm transition">
                                                <input type="text" id="edit-sec-name-${sec.id}" value="${escapeHtml(sec.name)}" class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                                                <button onclick="saveSectionEdit('${sec.id}')" class="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-2.5 py-1 text-xs font-bold transition">Save</button>
                                                <button onclick="cancelSectionEdit()" class="bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg px-2 py-1 text-xs font-bold transition">Cancel</button>
                                            </div>
                                            `;
                                        } else {
                                            return `
                                            <div class="flex justify-between items-center p-2 bg-white border border-slate-200 rounded-lg shadow-xs">
                                                <span class="text-xs font-semibold text-slate-700 font-bold">Section ${escapeHtml(sec.name)}</span>
                                                    <button onclick="startSectionEdit('${sec.id}')" class="p-1 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition" title="Rename Section">
                                                        <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                                                    </button>
                                                    <button type="button" onclick="moveSectionUp(${idx}, '${grade}')" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}" ${idx === 0 ? 'disabled' : ''}><i data-lucide="arrow-up" class="w-3.5 h-3.5 font-bold"></i></button>
                                                    <button type="button" onclick="moveSectionDown(${idx}, '${grade}')" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${idx === gradeSections.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}" ${idx === gradeSections.length - 1 ? 'disabled' : ''}><i data-lucide="arrow-down" class="w-3.5 h-3.5 font-bold"></i></button>
                                                    <button type="button" onclick="deleteSection('${sec.id}')" class="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 transition ml-1 font-bold"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
                                                </div>
                                            </div>
                                            `;
                                        }
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }
                });
                
                secContainer.innerHTML = sectionsHtml || `<div class="text-xs text-slate-400 italic p-2 font-bold">No Sections configured yet.</div>`;
            }

            lucide.createIcons();
        };

        const handleCreateSubject = (e) => {
            e.preventDefault();
            const input = document.getElementById('subject-pool-input');
            const name = input.value.trim().toUpperCase();
            if(name) {
                State.workspace.subjects.push({ id: generateId('s'), name });
                input.value = '';
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll(); 
                showToast(`Subject "${name}" added.`);
            }
        };

        const handleCreateTeacher = (e) => {
            e.preventDefault();
            const input = document.getElementById('teacher-pool-input');
            const color = document.querySelector('input[name="new-teacher-color"]:checked').value;
            const name = input.value.trim().toUpperCase();
            if(name) {
                State.workspace.teachers.push({ id: generateId('t'), name, color });
                input.value = '';
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll(); 
                showToast(`Teacher "${name}" added to list.`);
            }
        };

        const deleteSubject = (id) => {
            if(State.workspace.classes.some(c => c.subjectId === id)) {
                showToast("Cannot delete subject: It is assigned to scheduled classes.", "error");
                return;
            }
            State.workspace.subjects = State.workspace.subjects.filter(s => s.id !== id);
            saveState(isCloudConnected, currentRoomCode, saveToCloud); 
            renderResourceLists();
            renderAll(); 
            showToast("Subject removed.");
        };

        const deleteTeacher = (id) => {
            if(State.workspace.classes.some(c => c.teacherId === id)) {
                showToast("Cannot delete teacher: They are assigned to classes.", "error");
                return;
            }
            State.workspace.teachers = State.workspace.teachers.filter(t => t.id !== id);
            saveState(isCloudConnected, currentRoomCode, saveToCloud); 
            renderResourceLists();
            renderAll(); 
            showToast("Teacher removed.");
        };

        const resetBoard = () => {
            showConfirm("Reset Entire Program Placements", "Are you sure you want to clear your current schedule placements? This preserves your custom resources.", () => {
                State.workspace.classes = [];
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderAll();
                showToast("Workspace program placements cleared.");
            });
        };

        let scrollLoopEngine = null;
        let currentPointerY = null;

        const startAutoScroll = () => {
            if (scrollLoopEngine) return;
            scrollLoopEngine = requestAnimationFrame(function runScrollEngine() {
                if (currentPointerY !== null) {
                    const scrollBoundaryThreshold = 80; 
                    const speedMultiplier = 0.22; 
                    const screenHeight = window.innerHeight;
                    
                    let yDelta = 0;
                    if (currentPointerY < scrollBoundaryThreshold) {
                        yDelta = -Math.max(1, (scrollBoundaryThreshold - currentPointerY) * speedMultiplier);
                    } else if (currentPointerY > screenHeight - scrollBoundaryThreshold) {
                        yDelta = Math.max(1, (currentPointerY - (screenHeight - scrollBoundaryThreshold)) * speedMultiplier);
                    }
                    
                    if (yDelta !== 0) {
                        window.scrollBy(0, yDelta);
                    }
                }
                scrollLoopEngine = requestAnimationFrame(runScrollEngine);
            });
        };

        const stopAutoScroll = () => {
            if (scrollLoopEngine) {
                cancelAnimationFrame(scrollLoopEngine);
                scrollLoopEngine = null;
            }
            currentPointerY = null;
        };

        const updatePointerYForMouseDrag = (e) => {
            currentPointerY = e.clientY;
        };

        document.addEventListener('dragstart', () => {
            document.addEventListener('dragover', updatePointerYForMouseDrag);
            startAutoScroll();
        });

        document.addEventListener('dragend', () => {
            document.removeEventListener('dragover', updatePointerYForMouseDrag);
            stopAutoScroll();
        });

        setInterval(() => {
            if (!State.activeSelectedCardId) {
                State.workspace.teachers.forEach(t => {
                    const el = document.getElementById(`live-status-${t.id}`);
                    if (el) el.innerHTML = getLiveStatus(t.id);
                });
            }
        }, 60000);

        
        // --- AUTH & CLOUD SCOPING ---
        let currentUser = null;
        let currentSchoolId = null;

        async function handleAuthAction(action) {
            const email = document.getElementById('auth-email').value.trim();
            const password = document.getElementById('auth-password').value.trim();
            const schoolIdInput = document.getElementById('auth-school');
            const schoolId = schoolIdInput ? schoolIdInput.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') : '';
            
            const errorMsg = document.getElementById('auth-error-msg');
            const errorText = document.getElementById('auth-error-text');

            if (action !== 'logout' && (!email || !password || !schoolId)) {
                if (errorMsg && errorText) {
                    errorMsg.classList.remove('hidden');
                    errorText.innerText = "Please enter School ID, Email, and Password.";
                }
                return;
            }

            if (errorMsg) errorMsg.classList.add('hidden');

            try {
                if (action === 'login') {
                    await window.signInWithEmailAndPassword(window.auth, email, password);
                } else if (action === 'signup') {
                    const cred = await window.createUserWithEmailAndPassword(window.auth, email, password);
                    await window.setDoc(window.doc(window.db, 'users', cred.user.uid), { schoolId: schoolId });
                } else if (action === 'logout') {
                    await window.signOut(window.auth);
                }
            } catch (error) {
                if (errorMsg && errorText) {
                    errorMsg.classList.remove('hidden');
                    errorText.innerText = error.message;
                }
            }
        }

        // Register the Firebase auth listener.
        // Uses 'firebase-ready' event to handle the race between the ES module
        // Firebase init (async network fetch) and this deferred bundle.js script.
        function registerAuthListener() {
            if (!window.auth) {
                console.warn('Firebase auth not available. Running in offline mode.');
                const errorMsg = document.getElementById('auth-error-msg');
                const errorText = document.getElementById('auth-error-text');
                if (errorMsg && errorText) {
                    errorMsg.classList.remove('hidden');
                    errorText.innerText = 'Cloud login unavailable. Check your internet connection.';
                }
                return;
            }
            window.onAuthStateChanged(window.auth, async (user) => {
                const authPortal = document.getElementById('auth-portal');
                const userEmailSpan = document.getElementById('nav-user-email');
                const userSchoolSpan = document.getElementById('nav-user-school');
                const profileContainer = document.getElementById('nav-profile-container');

                if (user) {
                    currentUser = user;
                    try {
                        const userDoc = await window.getDoc(window.doc(window.db, 'users', user.uid));
                        if (userDoc.exists() && userDoc.data().schoolId) {
                            currentSchoolId = userDoc.data().schoolId;
                        } else {
                            currentSchoolId = 'default-school';
                        }
                    } catch (e) {
                        currentSchoolId = 'default-school';
                    }

                    if (authPortal) authPortal.style.display = 'none';
                    if (profileContainer) profileContainer.classList.remove('hidden');
                    if (userEmailSpan) userEmailSpan.innerText = user.email;
                    if (userSchoolSpan) userSchoolSpan.innerText = currentSchoolId;

                    setSyncSchool(currentSchoolId, currentUser);
                    checkVersion();
                } else {
                    currentUser = null;
                    currentSchoolId = null;
                    if (authPortal) authPortal.style.display = 'flex';
                    if (profileContainer) profileContainer.classList.add('hidden');
                    setSyncSchool(null, null);
                }
            });
        }

        // If firebase-ready already fired (module ran before bundle), call now;
        // otherwise wait for the event (handles the race condition on file://).
        if (window.auth !== undefined) {
            registerAuthListener();
        } else {
            window.addEventListener('firebase-ready', registerAuthListener, { once: true });
        }

        // --- UPDATE ANNOUNCEMENT UTILITIES (PWA) ---
        function checkVersion() {
            const lastSeen = localStorage.getItem('elem_program_matrix_last_version');
            if (lastSeen !== window.APP_VERSION) {
                setTimeout(() => showUpdateToast(), 1000);
            }
        }

        function showUpdateToast() {
            const toast = document.getElementById('update-toast');
            const versionSpan = document.getElementById('update-toast-version');
            if (!toast || !versionSpan) return;
            
            versionSpan.innerText = window.APP_VERSION;
            toast.classList.remove('translate-y-32', 'opacity-0');
        }

        function dismissUpdateToast() {
            const toast = document.getElementById('update-toast');
            if (toast) {
                toast.classList.add('translate-y-32', 'opacity-0');
            }
        }

        function startTheatricalUpdate() {
            dismissUpdateToast();
            
            const modal = document.getElementById('installing-modal');
            const bar = document.getElementById('installing-progress-bar');
            const statusText = document.getElementById('installing-status-text');
            
            if (modal) modal.classList.remove('hidden');
            if (modal) {
                void modal.offsetWidth;
                modal.classList.remove('opacity-0');
            }
            
            if (bar) bar.style.width = '0%';
            
            const sequence = [
                { time: 500, percent: 15, text: "Connecting to secure server..." },
                { time: 1200, percent: 45, text: "Downloading workspace assets..." },
                { time: 2000, percent: 80, text: "Compiling fresh UI modules..." },
                { time: 2700, percent: 100, text: "Finalizing installation!" }
            ];
            
            sequence.forEach(step => {
                setTimeout(() => {
                    if (bar) bar.style.width = `${step.percent}%`;
                    if (statusText) statusText.innerText = step.text;
                }, step.time);
            });
            
            setTimeout(() => {
                if (modal) modal.classList.add('opacity-0');
                setTimeout(() => {
                    if (modal) modal.classList.add('hidden');
                    openUpdateModal();
                }, 300);
            }, 3200);
        }

        function openUpdateModal() {
            const modal = document.getElementById('update-modal');
            const content = document.getElementById('update-modal-content');
            const list = document.getElementById('update-changelog-list');
            const versionText = document.getElementById('update-version-text');

            if (versionText) versionText.innerText = window.APP_VERSION;
            
            if (list) {
                list.innerHTML = '';
                (window.APP_CHANGELOG || []).forEach(item => {
                    const formattedText = item.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-slate-800">$1</span>');
                    list.innerHTML += `
                        <li class="flex gap-3 text-sm text-slate-600 items-start">
                            <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"></i>
                            <span>${formattedText}</span>
                        </li>
                    `;
                });
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();

            if (modal) modal.classList.remove('hidden');
            if (modal) {
                void modal.offsetWidth;
                modal.classList.remove('opacity-0');
            }
            if (content) {
                content.classList.remove('scale-95');
                content.classList.add('animate-pop-in');
            }
            
            const profileMenu = document.getElementById('profile-dropdown-menu');
            if (profileMenu) profileMenu.classList.add('hidden', 'opacity-0', 'scale-95');
        }

        function closeUpdateModal() {
            const modal = document.getElementById('update-modal');
            const content = document.getElementById('update-modal-content');
            
            if (modal) modal.classList.add('opacity-0');
            if (content) {
                content.classList.remove('animate-pop-in');
                content.classList.add('scale-95');
            }
            
            setTimeout(() => {
                if (modal) modal.classList.add('hidden');
                localStorage.setItem('elem_program_matrix_last_version', window.APP_VERSION);
            }, 300);
        }

        // --- SCHOOL YEAR HANDLERS ---
        function updateSchoolCategory() {
            const categories = ['k', 'es', 'jhs', 'shs', 'is', 'ps'];
            const selected = categories
                .filter(c => {
                    const el = document.getElementById('cfg-cat-' + c);
                    return el && el.checked;
                })
                .map(c => document.getElementById('cfg-cat-' + c).value);
            State.workspace.schoolConfig.schoolCategories = selected;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
        }

        function updateDashboardStats() {
            const gradeEl = document.getElementById('dash-stat-grades');
            const teacherEl = document.getElementById('dash-stat-teachers');
            const subEl = document.getElementById('dash-stat-subjects');
            const badgeEl = document.getElementById('dash-sy-badge');

            if (gradeEl) gradeEl.innerText = State.workspace.grades ? State.workspace.grades.length : 0;
            if (teacherEl) teacherEl.innerText = State.workspace.teachers ? State.workspace.teachers.length : 0;
            if (subEl) subEl.innerText = State.workspace.subjects ? State.workspace.subjects.length : 0;

            const activeYear = State.workspace?.schoolConfig?.schoolYear || 'School Year';
            if (badgeEl) badgeEl.innerText = activeYear;

            const dropdownList = document.getElementById('sy-dropdown-list');
            if (dropdownList) {
                const years = (window.getAllSchoolYears && window.getAllSchoolYears()) || [];
                if (years.length === 0) {
                    dropdownList.innerHTML = `<p class="px-3 py-3 text-[11px] text-slate-400 text-center">No saved years yet.</p>`;
                } else {
                    dropdownList.innerHTML = years.map(y => `
                        <button onclick="window.switchSchoolYear('${y}'); window.closeSYDropdown();"
                            class="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold transition-colors text-left ${
                                y === activeYear
                                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                                    : 'text-slate-700 hover:bg-slate-50'
                            }">
                            <i data-lucide="${y === activeYear ? 'check-circle-2' : 'circle'}" class="w-3.5 h-3.5 ${y === activeYear ? 'text-emerald-500' : 'text-slate-300'} shrink-0"></i>
                            ${y}
                        </button>
                    `).join('');
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }
            }

            if (typeof window.renderSavedSchedules === 'function') window.renderSavedSchedules();
        }

        function toggleSYDropdown() {
            const menu = document.getElementById('sy-dropdown-menu');
            const chevron = document.getElementById('sy-dropdown-chevron');
            if (!menu) return;
            const isOpen = !menu.classList.contains('hidden');
            if (isOpen) {
                menu.classList.add('hidden');
                if (chevron) chevron.style.transform = 'rotate(0deg)';
            } else {
                menu.classList.remove('hidden');
                if (chevron) chevron.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    const handler = (e) => {
                        const wrapper = document.getElementById('sy-dropdown-wrapper');
                        if (wrapper && !wrapper.contains(e.target)) {
                            closeSYDropdown();
                            document.removeEventListener('click', handler);
                        }
                    };
                    document.addEventListener('click', handler);
                }, 10);
            }
        }

        function closeSYDropdown() {
            const menu = document.getElementById('sy-dropdown-menu');
            const chevron = document.getElementById('sy-dropdown-chevron');
            if (menu) menu.classList.add('hidden');
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        }

        function openNewSYModal() {
            closeSYDropdown();
            const modal = document.getElementById('new-sy-modal');
            const input = document.getElementById('new-sy-input');
            const carryover = document.getElementById('new-sy-carryover');
            if (input) input.value = '';
            if (carryover) carryover.checked = false;
            if (modal) {
                modal.style.display = 'flex';
                if (typeof lucide !== 'undefined') lucide.createIcons();
                setTimeout(() => input && input.focus(), 100);
            }
        }

        function closeNewSYModal() {
            const modal = document.getElementById('new-sy-modal');
            if (modal) modal.style.display = 'none';
        }

        function createNewSchoolYear() {
            const input = document.getElementById('new-sy-input');
            const carryover = document.getElementById('new-sy-carryover');
            const year = input ? input.value.trim() : '';
            if (!year) {
                showToast('Please enter a school year label.', 'error');
                return;
            }
            const existingYears = (window.getAllSchoolYears && window.getAllSchoolYears()) || [];
            if (existingYears.includes(year)) {
                showToast('That school year already exists.', 'error');
                return;
            }

            saveState(isCloudConnected, currentRoomCode, saveToCloud);

            const newState = JSON.parse(JSON.stringify(defaultState));
            newState.schoolConfig = JSON.parse(JSON.stringify(State.workspace.schoolConfig));
            newState.schoolConfig.schoolYear = year;
            newState.classes = [];
            newState.advisers = {};

            if (carryover && carryover.checked) {
                newState.teachers = JSON.parse(JSON.stringify(State.workspace.teachers || []));
                newState.subjects = JSON.parse(JSON.stringify(State.workspace.subjects || []));
                newState.timeSlots = JSON.parse(JSON.stringify(State.workspace.timeSlots || []));
                newState.grades = JSON.parse(JSON.stringify(State.workspace.grades || []));
                newState.sections = JSON.parse(JSON.stringify(State.workspace.sections || []));
            } else {
                newState.teachers = [];
                newState.subjects = [];
            }

            State.workspace = newState;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            localStorage.setItem('last_active_school_year', year);

            closeNewSYModal();
            renderAll();
            if (typeof window.renderSavedSchedules === 'function') window.renderSavedSchedules();
            showToast(`School Year "${year}" created!`);
        }

        // --- TEACHER MANAGEMENT & DASHBOARD ---
        function renderTeacherDashboard() {
            const grid = document.getElementById('teachers-dashboard-grid');
            if (!grid) return;
            
            grid.className = 'flex flex-col gap-4';

            const emptyState = document.getElementById('teachers-empty-state');
            const hasTeachers = State.workspace.teachers && State.workspace.teachers.length > 0;

            if (!hasTeachers) {
                grid.querySelectorAll('details').forEach(el => el.remove());
                if (emptyState) emptyState.style.display = 'flex';
                if (typeof lucide !== 'undefined') lucide.createIcons();
                return;
            }
            if (emptyState) emptyState.style.display = 'none';
            
            const teacherLoads = {};
            if (State.workspace.teachers) {
                State.workspace.teachers.forEach(t => teacherLoads[t.id] = { mins: 0, subjects: new Set(), classes: {}, advisory: null });
            }
            
            if (State.workspace.classes) {
                State.workspace.classes.forEach(c => {
                    if (c.teacherId && teacherLoads[c.teacherId]) {
                        const slot = State.workspace.timeSlots.find(ts => ts.id === c.timeSlotId);
                        let m = 0;
                        if (slot) {
                            m = timeToMins(slot.end) - timeToMins(slot.start);
                            teacherLoads[c.teacherId].mins += m;
                        }
                        
                        let subjectName = "Unknown";
                        if (c.subjectId) {
                            const sub = State.workspace.subjects.find(s => s.id === c.subjectId);
                            if (sub) {
                                subjectName = sub.name;
                                teacherLoads[c.teacherId].subjects.add(sub.name);
                            }
                        }
                        
                        let className = "Unknown Class";
                        if (c.sectionId) {
                            const sec = State.workspace.sections.find(s => s.id === c.sectionId);
                            if (sec) {
                                const grade = State.workspace.grades.find(g => g.id === sec.gradeId);
                                className = (grade ? grade.name : '') + ' - ' + sec.name;
                            }
                        } else if (c.gradeId) {
                            const grade = State.workspace.grades.find(g => g.id === c.gradeId);
                            if (grade) className = grade.name + ' - All Sections';
                        }
                        
                        const assignmentKey = className + ' | ' + subjectName;
                        if (!teacherLoads[c.teacherId].classes[assignmentKey]) {
                            teacherLoads[c.teacherId].classes[assignmentKey] = 0;
                        }
                        teacherLoads[c.teacherId].classes[assignmentKey] += m;
                    }
                });
            }

            if (State.workspace.advisers) {
                Object.keys(State.workspace.advisers).forEach(grade => {
                    const advId = State.workspace.advisers[grade];
                    if (advId && teacherLoads[advId]) {
                        teacherLoads[advId].mins += 60;
                        teacherLoads[advId].advisory = grade;
                    }
                });
            }

            grid.querySelectorAll('details').forEach(el => el.remove());

            const teacherCardsHTML = State.workspace.teachers.map(t => {
                const data = teacherLoads[t.id];
                const totalHours = Math.floor(data.mins / 60);
                const totalMins = data.mins % 60;
                const loadText = `${totalHours}h ${totalMins > 0 ? totalMins + 'm' : ''}`.trim();
                
                const expectedMins = t.position && t.position.toLowerCase().includes("master") ? 1500 : 1800;
                const expectedHours = expectedMins / 60;
                const progressPct = Math.min(100, Math.round((data.mins / expectedMins) * 100));
                
                const isUnderLoad = data.mins < expectedMins;
                const statusBadge = isUnderLoad 
                    ? `<span class="px-2.5 py-1 bg-amber-50 text-amber-600 font-bold text-[10px] uppercase tracking-wider rounded-full flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Under Load</span>`
                    : `<span class="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase tracking-wider rounded-full flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Balanced</span>`;

                const subjectCount = data.subjects.size;
                const classCount = Object.keys(data.classes).length;
                
                const subtitleParts = [];
                if (t.position) subtitleParts.push(t.position);
                if (data.advisory) subtitleParts.push(`${data.advisory} Adviser`);
                const subtitle = subtitleParts.join(' Ã¢â‚¬Â¢ ') || 'No Position Set';
                
                const colorHex = teacherColors[t.color] || '#94a3b8';

                const tagsHTML = Array.from(data.subjects).map(sub => 
                    `<span class="px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-lg">${sub}</span>`
                ).join('');
                const tagsDisplay = tagsHTML || `<span class="text-xs text-slate-400">None</span>`;

                const assignmentsHTML = Object.entries(data.classes).map(([key, mins]) => {
                    const parts = key.split(' | ');
                    const cls = parts[0];
                    const sub = parts[1];
                    const h = Math.floor(mins / 60);
                    const m = mins % 60;
                    const timeStr = h > 0 ? `${h} ${h===1?'hr':'hrs'}` : `${m} m`;
                    return `
                        <div class="flex justify-between items-center text-xs py-1">
                            <div class="flex items-center gap-2">
                                <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${colorHex}"></span>
                                <span class="font-bold text-slate-700">${cls} &ndash; ${sub}</span>
                            </div>
                            <span class="text-slate-500 font-bold">${timeStr}</span>
                        </div>
                    `;
                }).join('');
                const assignmentsDisplay = assignmentsHTML || `<div class="text-xs text-slate-400 py-1">No classes assigned</div>`;

                return `
                    <details class="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden open:shadow-md transition-all duration-300">
                        <summary class="flex flex-col md:flex-row items-start md:items-center p-4 cursor-pointer list-none gap-4 md:gap-0 relative outline-none select-none">
                            <div class="absolute left-0 top-0 bottom-0 w-1.5" style="background-color: ${colorHex}"></div>
                            
                            <div class="flex items-center gap-4 pl-2 flex-1">
                                <div class="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                                    <i data-lucide="user" class="w-6 h-6 text-slate-400"></i>
                                </div>
                                <div>
                                    <h3 class="font-extrabold text-slate-800 text-base leading-tight uppercase">${t.name}</h3>
                                    <p class="text-xs font-bold text-slate-500 mt-0.5">${subtitle}</p>
                                </div>
                            </div>
                            
                            <div class="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-8 w-full md:w-auto">
                                ${statusBadge}
                                <div class="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                    <i data-lucide="clock" class="w-4 h-4 text-slate-400"></i> ${totalHours}/${expectedHours} hrs
                                </div>
                                <div class="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                    <i data-lucide="book-open" class="w-4 h-4 text-slate-400"></i> ${subjectCount} Subjects
                                </div>
                                <div class="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                                    <i data-lucide="users" class="w-4 h-4 text-slate-400"></i> ${classCount} Classes
                                </div>
                                <div class="ml-auto md:ml-0 p-1 rounded-full group-hover:bg-slate-50 transition group-open:bg-emerald-50 border border-transparent group-open:border-emerald-200 text-slate-400 group-open:text-emerald-600">
                                    <i data-lucide="chevron-down" class="w-5 h-5 transition-transform duration-300 group-open:-rotate-180"></i>
                                </div>
                            </div>
                        </summary>
                        
                        <div class="border-t border-slate-100 p-6 bg-white animate-in slide-in-from-top-2 fade-in duration-200">
                            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                
                                <div class="lg:col-span-5 flex flex-col">
                                    <div class="flex justify-between items-end mb-2">
                                        <h4 class="text-xs font-bold text-slate-800">Workload Progress</h4>
                                        <span class="text-xs font-bold text-slate-600">${progressPct}% (${totalHours}/${expectedHours} hrs)</span>
                                    </div>
                                    <div class="w-full bg-slate-100 rounded-full h-2.5 mb-6 overflow-hidden">
                                        <div class="h-2.5 rounded-full transition-all duration-1000" style="width: ${progressPct}%; background-color: ${colorHex}"></div>
                                    </div>
                                    
                                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        <div class="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                                            <div class="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase mb-1"><i data-lucide="clock" class="w-3 h-3 text-purple-500"></i> Teaching Load</div>
                                            <span class="font-extrabold text-slate-800">${loadText}</span>
                                        </div>
                                        <div class="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                                            <div class="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase mb-1"><i data-lucide="book-open" class="w-3 h-3 text-emerald-500"></i> Subjects</div>
                                            <span class="font-extrabold text-slate-800">${subjectCount}</span>
                                        </div>
                                        <div class="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                                            <div class="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase mb-1"><i data-lucide="users" class="w-3 h-3 text-blue-500"></i> Classes</div>
                                            <span class="font-extrabold text-slate-800">${classCount}</span>
                                        </div>
                                        <div class="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                                            <div class="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase mb-1"><i data-lucide="award" class="w-3 h-3 text-red-500"></i> Advisory</div>
                                            <span class="font-extrabold text-slate-800">${data.advisory || 'None'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-8">
                                    <h4 class="text-xs font-bold text-slate-800 mb-3">Subjects Taught</h4>
                                    <div class="flex flex-wrap gap-2">
                                        ${tagsDisplay}
                                    </div>
                                </div>

                                <div class="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-8">
                                    <h4 class="text-xs font-bold text-slate-800 mb-3">Class Assignments</h4>
                                    <div class="flex flex-col gap-1 max-h-[120px] overflow-y-auto pr-2">
                                        ${assignmentsDisplay}
                                    </div>
                                </div>
                            </div>

                            <div class="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                                <button onclick="window.viewTeacherSchedule('${t.id}')" class="px-4 py-2 border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
                                    <i data-lucide="calendar" class="w-3.5 h-3.5"></i> View Schedule
                                </button>
                                <button onclick="window.openTeacherModal('${t.id}')" class="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
                                    <i data-lucide="edit-2" class="w-3.5 h-3.5"></i> Edit Teacher
                                </button>
                                <button onclick="window.deleteTeacher('${t.id}')" class="px-4 py-2 border border-slate-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm ml-auto">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
                                </button>
                            </div>
                        </div>
                    </details>
                `;
            }).join('');

            grid.insertAdjacentHTML('beforeend', teacherCardsHTML);
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function promptCreateTeacher() { openTeacherModal(); }
        function promptEditTeacherName(id) { openTeacherModal(id); }
        function promptEditTeacherColor(id) { openTeacherModal(id); }

        function openTeacherModal(id = null) {
            const modal = document.getElementById('teacher-modal');
            const form = document.getElementById('teacher-form');
            const title = document.getElementById('teacher-modal-title');
            
            if (form) form.reset();
            const idInput = document.getElementById('teacher-modal-id');
            if (idInput) idInput.value = id || '';
            
            if (id) {
                const teacher = State.workspace.teachers.find(t => t.id === id);
                if (teacher) {
                    if (title) title.innerHTML = '<i data-lucide="edit" class="w-5 h-5 text-emerald-500"></i> Edit Teacher';
                    const nameInput = document.getElementById('teacher-modal-name');
                    const posInput = document.getElementById('teacher-modal-position');
                    if (nameInput) nameInput.value = teacher.name || '';
                    if (posInput) posInput.value = teacher.position || '';
                    const colorInput = document.querySelector(`input[name="teacher-modal-color"][value="${teacher.color}"]`);
                    if (colorInput) colorInput.checked = true;
                }
            } else {
                if (title) title.innerHTML = '<i data-lucide="user-plus" class="w-5 h-5 text-emerald-500"></i> Add New Teacher';
                const colors = ['yellow', 'orange', 'blue', 'teal', 'lime', 'purple', 'rose', 'indigo', 'amber', 'emerald', 'pink', 'cyan', 'violet', 'fuchsia', 'sky'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                const randomColorInput = document.querySelector(`input[name="teacher-modal-color"][value="${randomColor}"]`);
                if (randomColorInput) randomColorInput.checked = true;
            }
            
            if (modal) modal.style.display = 'flex';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        function closeTeacherModal() {
            const modal = document.getElementById('teacher-modal');
            if (modal) modal.style.display = 'none';
        }

        function handleSaveTeacher(e) {
            e.preventDefault();
            const id = document.getElementById('teacher-modal-id').value;
            const name = document.getElementById('teacher-modal-name').value.trim().toUpperCase();
            const position = document.getElementById('teacher-modal-position').value.trim();
            const colorEl = document.querySelector('input[name="teacher-modal-color"]:checked');
            const color = colorEl ? colorEl.value : 'emerald';

            if (!name) return;

            if (id) {
                const teacher = State.workspace.teachers.find(t => t.id === id);
                if (teacher) {
                    teacher.name = name;
                    teacher.position = position;
                    teacher.color = color;
                    showToast("Teacher updated!");
                }
            } else {
                if (State.workspace.teachers.some(t => t.name === name)) {
                    showToast("A teacher with that name already exists.", "error");
                    return;
                }
                const newT = { id: 't-' + Date.now() + Math.random().toString(36).substr(2, 5), name, position, color };
                State.workspace.teachers.push(newT);
                showToast(`Teacher "${name}" created!`);
            }
            
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderAll();
            closeTeacherModal();
        }

        function viewTeacherSchedule(id) {
            if (typeof window.setActiveCardFilter === 'function') {
                window.setActiveCardFilter('teacher', id);
            } else {
                window.activeCardFilter = { type: 'teacher', id: id };
                const b = document.getElementById('clear-filter-btn');
                if (b) b.classList.remove('hidden');
                renderAll();
            }
            if (typeof window.setMainView === 'function') {
                window.setMainView('schedule');
            }
        }

        // --- OBJECT PROPERTY GETTER/SETTER EXPORTS ---
        Object.defineProperty(window, 'isCloudConnected', {
            get: () => isCloudConnected,
            configurable: true
        });
        Object.defineProperty(window, 'currentRoomCode', {
            get: () => currentRoomCode,
            configurable: true
        });
        Object.defineProperty(window, 'saveToCloud', {
            get: () => saveToCloud,
            configurable: true
        });

        // Register Service Worker for PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    })
                    .catch(err => {
                        console.log('ServiceWorker registration failed: ', err);
                    });
            });

            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    refreshing = true;
                    window.location.reload();
                }
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            const dropdownBtn = document.getElementById('actions-dropdown-btn');
            const dropdownMenu = document.getElementById('actions-dropdown-menu');
            
            const profileBtn = document.getElementById('profile-dropdown-btn');
            const profileMenu = document.getElementById('profile-dropdown-menu');

            if (dropdownBtn && dropdownMenu) {
                dropdownBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdownMenu.classList.toggle('hidden');
                    dropdownMenu.classList.toggle('opacity-0');
                    dropdownMenu.classList.toggle('scale-95');
                    
                    if (profileMenu && !profileMenu.classList.contains('hidden')) {
                        profileMenu.classList.add('hidden', 'opacity-0', 'scale-95');
                    }
                });
            }

            if (profileBtn && profileMenu) {
                profileBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    profileMenu.classList.toggle('hidden');
                    profileMenu.classList.toggle('opacity-0');
                    profileMenu.classList.toggle('scale-95');
                    
                    if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
                        dropdownMenu.classList.add('hidden', 'opacity-0', 'scale-95');
                    }
                });
            }

            document.addEventListener('click', (e) => {
                if (dropdownBtn && dropdownMenu && !dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.add('hidden', 'opacity-0', 'scale-95');
                }
                if (profileBtn && profileMenu && !profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
                    profileMenu.classList.add('hidden', 'opacity-0', 'scale-95');
                }
            });
        });
        
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        let firebaseConfig = null;
        if (typeof __firebase_config !== 'undefined' && __firebase_config) {
            try { firebaseConfig = JSON.parse(__firebase_config); } catch (e) { }
        }
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        setupCloudSync(firebaseConfig, initialAuthToken, appId, { showToast, renderAll });

        window.onload = function () {
            setupDragDrop({ showToast, renderAll });
            setupScheduling({ showToast, renderAll, renderResourceLists });
            setupImportExport({ showToast, setActiveTab });
            loadState();
            const initialTab = State.workspace.activeTab || 'master';
            setActiveTab(initialTab);
            if (typeof setMainView === 'function') {
                setMainView(initialTab === 'summary' ? 'summary' : 'schedule');
            }
            initCloudSync(initialAuthToken);
        };

        // --- EXPOSE MODULE FUNCTIONS TO GLOBAL WINDOW SCOPE FOR HTML HANDLERS ---
        window.openResourceModal = openResourceModal;
        window.closeResourceModal = closeResourceModal;
        window.openCreateModal = openCreateModal;
        window.triggerImport = triggerImport;
        window.handleImport = handleImport;
        window.exportData = exportData;
        window.resetBoard = resetBoard;
        window.setActiveTab = setActiveTab;
        window.handleGradeFilterChange = handleGradeFilterChange;
        window.handleDayFilterChange = handleDayFilterChange;
        window.clearActiveCardFilter = clearActiveCardFilter;
        window.setSummaryFilter = setSummaryFilter;
        window.handleSummarySearch = handleSummarySearch;
        window.updateSchoolConfig = updateSchoolConfig;
        window.handleLogoUpload = handleLogoUpload;
        window.clearLogo = clearLogo;
        window.handleCreateTeacher = handleCreateTeacher;
        window.handleCreateSubject = handleCreateSubject;
        window.handleCreateTimeSlot = handleCreateTimeSlot;
        window.sortTimeSlotsChronologically = sortTimeSlotsChronologically;
        window.setTimeSlotFilter = setTimeSlotFilter;
        window.handleCreateGrade = handleCreateGrade;
        window.handleCreateSection = handleCreateSection;
        window.closeCreateModal = closeCreateModal;
        window.handleCreateClass = handleCreateClass;
        window.closeEditModal = closeEditModal;
        window.handleSaveEdit = handleSaveEdit;
        window.closePopover = closePopover;
        window.toggleRippleCascade = toggleRippleCascade;
        window.toggleTeacherFilter = toggleTeacherFilter;
        window.assignTeacherQuick = assignTeacherQuick;
        window.startDirectTimeSlotEdit = startDirectTimeSlotEdit;
        window.cancelDirectTimeSlotInline = cancelDirectTimeSlotInline;
        window.saveDirectTimeSlotInline = saveDirectTimeSlotInline;
        window.appendFloatingTimeSlotNext = appendFloatingTimeSlotNext;
        window.openCreateModalAtMaster = openCreateModalAtMaster;
        window.openCreateModalAtSection = openCreateModalAtSection;
        window.openPopover = openPopover;
        window.openEditModal = openEditModal;
        window.deleteBlock = deleteBlock;
        window.saveSubjectEdit = saveSubjectEdit;
        window.cancelSubjectEdit = cancelSubjectEdit;
        window.startSubjectEdit = startSubjectEdit;
        window.deleteSubject = deleteSubject;
        window.saveTeacherEdit = saveTeacherEdit;
        window.cancelTeacherEdit = cancelTeacherEdit;
        window.updateTeacherColorInline = updateTeacherColorInline;
        window.startTeacherEdit = startTeacherEdit;
        window.deleteTeacher = deleteTeacher;
        window.saveTimeSlotEdit = saveTimeSlotEdit;
        window.cancelTimeSlotEdit = cancelTimeSlotEdit;
        window.updateTimeSlotGroup = updateTimeSlotGroup;
        window.startTimeSlotEdit = startTimeSlotEdit;
        window.moveTimeSlotUp = moveTimeSlotUp;
        window.moveTimeSlotDown = moveTimeSlotDown;
        window.deleteTimeSlot = deleteTimeSlot;
        window.moveGradeUp = moveGradeUp;
        window.moveGradeDown = moveGradeDown;
        window.deleteGrade = deleteGrade;
        window.saveSectionEdit = saveSectionEdit;
        window.cancelSectionEdit = cancelSectionEdit;
        window.startSectionEdit = startSectionEdit;
        window.moveSectionUp = moveSectionUp;
        window.moveSectionDown = moveSectionDown;
        window.deleteSection = deleteSection;
        window.switchCloudRoom = switchCloudRoom;
        window.setResourceTab = setResourceTab;
        window.toggleSlotLabelInput = toggleSlotLabelInput;
        window.handleAuthAction = handleAuthAction;
        window.openUpdateModal = openUpdateModal;
        window.closeUpdateModal = closeUpdateModal;
        window.dismissUpdateToast = dismissUpdateToast;
        window.startTheatricalUpdate = startTheatricalUpdate;
        window.updateSchoolCategory = updateSchoolCategory;
        window.toggleSYDropdown = toggleSYDropdown;
        window.closeSYDropdown = closeSYDropdown;
        window.openNewSYModal = openNewSYModal;
        window.closeNewSYModal = closeNewSYModal;
        window.createNewSchoolYear = createNewSchoolYear;
        window.renderTeacherDashboard = renderTeacherDashboard;
        window.promptCreateTeacher = promptCreateTeacher;
        window.promptEditTeacherName = promptEditTeacherName;
        window.promptEditTeacherColor = promptEditTeacherColor;
        window.openTeacherModal = openTeacherModal;
        window.closeTeacherModal = closeTeacherModal;
        window.handleSaveTeacher = handleSaveTeacher;
        window.viewTeacherSchedule = viewTeacherSchedule;


// --- BUNDLED FROM: src/ui-handlers.js ---
        // --- 3-COLUMN LAYOUT LOGIC ---
        window.toggleSidebar = function(side) {
            const sidebar = document.getElementById('global-' + side + '-sidebar');
            const toggleBtn = document.getElementById(side + '-sidebar-toggle');
            const icon = toggleBtn ? toggleBtn.querySelector('i, svg') : null;
            
            if (side === 'left') {
                const isExpanded = sidebar.classList.contains('w-64');
                const texts = sidebar.querySelectorAll('.nav-text');
                const labels = sidebar.querySelectorAll('.nav-label');
                const tooltips = sidebar.querySelectorAll('.nav-tooltip');
                const navBtns = sidebar.querySelectorAll('.nav-btn');
                const bottomArea = document.getElementById('nav-bottom-area');
                const savedSchedulesSection = document.getElementById('saved-schedules-section');
                const savedSchedulesCollapsed = document.getElementById('saved-schedules-collapsed-icon');

                if (!isExpanded) {
                    // Expand Left Sidebar
                    sidebar.classList.remove('w-[72px]');
                    const logoExpanded = document.getElementById('sidebar-logo-expanded');
                    const logoCollapsed = document.getElementById('sidebar-logo-collapsed');
                    if (logoExpanded) logoExpanded.classList.remove('hidden');
                    if (logoCollapsed) logoCollapsed.classList.add('hidden');
                    sidebar.classList.add('w-64');
                    if (icon) icon.style.transform = 'rotate(0deg)';
                    if (bottomArea) bottomArea.classList.replace('justify-center', 'justify-end');
                    
                    if (savedSchedulesCollapsed) savedSchedulesCollapsed.classList.add('hidden');
                    if (savedSchedulesSection) {
                        savedSchedulesSection.classList.remove('hidden');
                        setTimeout(() => savedSchedulesSection.style.opacity = '1', 50);
                    }

                    navBtns.forEach(b => {
                        b.classList.remove('justify-center', 'px-0');
                        b.classList.add('justify-start', 'px-3');
                    });
                    
                    texts.forEach(t => { t.style.display = 'block'; setTimeout(() => t.style.opacity = '1', 50); });
                    labels.forEach(l => { l.style.display = 'block'; setTimeout(() => l.style.opacity = '1', 50); });
                    tooltips.forEach(t => t.classList.add('hidden'));
                } else {
                    // Collapse Left Sidebar
                    sidebar.classList.remove('w-64');
                    const logoExpanded = document.getElementById('sidebar-logo-expanded');
                    const logoCollapsed = document.getElementById('sidebar-logo-collapsed');
                    if (logoExpanded) logoExpanded.classList.add('hidden');
                    if (logoCollapsed) logoCollapsed.classList.remove('hidden');
                    sidebar.classList.add('w-[72px]');
                    if (icon) icon.style.transform = 'rotate(180deg)';
                    if (bottomArea) bottomArea.classList.replace('justify-end', 'justify-center');
                    
                    if (savedSchedulesSection) {
                        savedSchedulesSection.style.opacity = '0';
                        setTimeout(() => {
                            savedSchedulesSection.classList.add('hidden');
                            if (savedSchedulesCollapsed) savedSchedulesCollapsed.classList.remove('hidden');
                            if (savedSchedulesCollapsed) savedSchedulesCollapsed.classList.add('flex');
                        }, 300);
                    }

                    navBtns.forEach(b => {
                        b.classList.remove('justify-start', 'px-3');
                        b.classList.add('justify-center', 'px-0');
                    });
                    
                    texts.forEach(t => { t.style.opacity = '0'; setTimeout(() => t.style.display = 'none', 300); });
                    labels.forEach(l => { l.style.opacity = '0'; setTimeout(() => l.style.display = 'none', 300); });
                    tooltips.forEach(t => t.classList.remove('hidden'));
                }
            } else {
                // Right Sidebar Logic (Completely hide/show)
                if (sidebar.classList.contains('w-0')) {
                    sidebar.classList.remove('w-0', 'border-none', 'px-0');
                    sidebar.classList.add('w-72', 'border-l');
                    icon.setAttribute('data-lucide', 'chevron-right');
                    Array.from(sidebar.children).forEach(c => {
                        if (c.tagName !== 'BUTTON') c.style.opacity = '1';
                    });
                } else {
                    sidebar.classList.add('w-0', 'border-none', 'px-0');
                    sidebar.classList.remove('w-72', 'border-l');
                    icon.setAttribute('data-lucide', 'chevron-left');
                    Array.from(sidebar.children).forEach(c => {
                        if (c.tagName !== 'BUTTON') c.style.opacity = '0';
                    });
                }
            }
            if (window.lucide) lucide.createIcons();
        };

        window.setMainView = function(view) {
            ['dashboard', 'schedule', 'summary', 'teachers'].forEach(v => {
                const btn = document.getElementById('nav-btn-' + v);
                if (btn) {
                    if (v === view) {
                        btn.classList.remove('text-slate-600', 'hover:bg-slate-50');
                        btn.classList.add('bg-emerald-50', 'text-emerald-700');
                    } else {
                        btn.classList.add('text-slate-600', 'hover:bg-slate-50');
                        btn.classList.remove('bg-emerald-50', 'text-emerald-700', 'hover:bg-emerald-100');
                    }
                }
                
                const toolContainer = document.getElementById('right-tools-' + v);
                if (toolContainer) {
                    if (v === view) toolContainer.classList.remove('hidden');
                    else toolContainer.classList.add('hidden');
                }
            });

            const workspace = document.getElementById('workspace-container');
            const dashboard = document.getElementById('center-dashboard');
            const teachersView = document.getElementById('center-teachers');
            const horizontalTabs = document.querySelector('.flex.gap-2.mb-4.border-b');

            if (view === 'dashboard') {
                if (workspace) workspace.style.display = 'none';
                if (horizontalTabs) horizontalTabs.style.display = 'none';
                if (teachersView) teachersView.style.display = 'none';
                if (dashboard) dashboard.style.display = 'flex';
            } else if (view === 'teachers') {
                if (workspace) workspace.style.display = 'none';
                if (horizontalTabs) horizontalTabs.style.display = 'none';
                if (dashboard) dashboard.style.display = 'none';
                if (teachersView) teachersView.style.display = 'flex';
                if (typeof window.renderTeacherDashboard === 'function') window.renderTeacherDashboard();
            } else if (view === 'schedule') {
                if (workspace) workspace.style.display = 'flex';
                if (horizontalTabs) horizontalTabs.style.display = 'flex';
                if (dashboard) dashboard.style.display = 'none';
                
                const activeTab = document.querySelector('.tab-active');
                if (!activeTab || activeTab.id === 'tab-summary') {
                    if (typeof setActiveTab === 'function') setActiveTab('master_kinder');
                }
            } else if (view === 'summary') {
                if (workspace) workspace.style.display = 'flex';
                if (horizontalTabs) horizontalTabs.style.display = 'none';
                if (dashboard) dashboard.style.display = 'none';
                if (teachersView) teachersView.style.display = 'none';
                if (typeof setActiveTab === 'function') setActiveTab('summary');
            }
        };

        setTimeout(() => {
            renderSavedSchedules();
        }, 100);

        // --- CLASS PROGRAM ARCHITECTURE HANDLERS ---

        window.populateSectionsDropdownForProgramCreate = function(grade) {
            const select = document.getElementById('cp-section');
            if (!select) return;
            select.innerHTML = '';
            
            const sections = (window.workspaceState?.sections || []).filter(s => s.grade === grade);
            sections.forEach(sec => {
                const opt = document.createElement('option');
                opt.value = sec.id;
                opt.innerText = sec.name;
                select.appendChild(opt);
            });
        };

        window.handleProgramTypeChange = function(type) {
            const indDiv = document.getElementById('cp-ind-config');
            const multiDiv = document.getElementById('cp-multi-config');
            const masterDiv = document.getElementById('cp-master-config');
            
            if (indDiv) indDiv.style.display = type === 'individual' ? 'flex' : 'none';
            if (multiDiv) multiDiv.style.display = type === 'multigrade' ? 'block' : 'none';
            if (masterDiv) masterDiv.style.display = type === 'master' ? 'block' : 'none';
        };

        window.openCreateProgramModal = function(programId = null) {
            const modal = document.getElementById('create-program-modal');
            const title = document.getElementById('create-program-modal-title');
            const idInput = document.getElementById('cp-id');
            const nameInput = document.getElementById('cp-name');
            const typeSelect = document.getElementById('cp-type');
            const gradeSelect = document.getElementById('cp-grade');
            const saveBtnText = document.getElementById('cp-save-btn-text');
            
            if (!modal) return;
            
            // Populate Grades select
            if (gradeSelect) {
                gradeSelect.innerHTML = '';
                const grades = window.workspaceState?.grades || [];
                grades.forEach(g => {
                    const opt = document.createElement('option');
                    opt.value = g;
                    opt.innerText = g;
                    gradeSelect.appendChild(opt);
                });
            }
            
            // Populate Multi-Grade Sections checklists
            const multiContainer = document.getElementById('cp-multi-sections-container');
            if (multiContainer) {
                multiContainer.innerHTML = '';
                const sections = window.workspaceState?.sections || [];
                sections.forEach(sec => {
                    const div = document.createElement('label');
                    div.className = 'flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 p-1.5 rounded-lg';
                    div.innerHTML = `
                        <input type="checkbox" name="cp-multi-sections" value="${sec.id}" class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500">
                        <span>${sec.grade} - ${sec.name}</span>
                    `;
                    multiContainer.appendChild(div);
                });
            }
            
            // Populate Master sub-programs checklist (exclude master programs themselves to prevent recursion)
            const masterContainer = document.getElementById('cp-master-programs-container');
            if (masterContainer) {
                masterContainer.innerHTML = '';
                const programs = (window.workspaceState?.programs || []).filter(p => p.type !== 'master');
                programs.forEach(prog => {
                    const div = document.createElement('label');
                    div.className = 'flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 p-1.5 rounded-lg';
                    div.innerHTML = `
                        <input type="checkbox" name="cp-master-progs" value="${prog.id}" class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500">
                        <span>${prog.name} (${prog.type})</span>
                    `;
                    masterContainer.appendChild(div);
                });
            }

            if (programId) {
                // Edit Mode
                const prog = window.workspaceState.programs.find(p => p.id === programId);
                if (!prog) return;
                
                title.innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-emerald-500"></i> Edit Class Program`;
                idInput.value = prog.id;
                nameInput.value = prog.name || '';
                typeSelect.value = prog.type;
                typeSelect.disabled = true; // Block switching type of existing program to prevent mapping errors
                saveBtnText.innerText = 'Save Changes';
                
                window.handleProgramTypeChange(prog.type);
                
                if (prog.type === 'individual') {
                    if (gradeSelect) {
                        gradeSelect.value = prog.grade || '';
                        window.populateSectionsDropdownForProgramCreate(prog.grade);
                        const secSelect = document.getElementById('cp-section');
                        if (secSelect) secSelect.value = prog.sectionId || '';
                    }
                } else if (prog.type === 'multigrade') {
                    const checkboxes = document.querySelectorAll('input[name="cp-multi-sections"]');
                    checkboxes.forEach(cb => {
                        cb.checked = (prog.sectionIds || []).includes(cb.value);
                    });
                } else if (prog.type === 'master') {
                    const checkboxes = document.querySelectorAll('input[name="cp-master-progs"]');
                    checkboxes.forEach(cb => {
                        cb.checked = (prog.subProgramIds || []).includes(cb.value);
                    });
                }
            } else {
                // Create Mode
                title.innerHTML = `<i data-lucide="file-plus" class="w-5 h-5 text-emerald-500"></i> Create Class Program`;
                idInput.value = '';
                nameInput.value = '';
                typeSelect.value = 'individual';
                typeSelect.disabled = false;
                saveBtnText.innerText = 'Create Program';
                
                window.handleProgramTypeChange('individual');
                
                const grades = window.workspaceState?.grades || [];
                if (grades.length > 0) {
                    if (gradeSelect) gradeSelect.value = grades[0];
                    window.populateSectionsDropdownForProgramCreate(grades[0]);
                }
            }
            
            modal.style.display = 'flex';
            if (window.lucide) lucide.createIcons();
        };

        window.closeCreateProgramModal = function() {
            const modal = document.getElementById('create-program-modal');
            if (modal) modal.style.display = 'none';
        };

        window.handleSaveProgram = function() {
            const id = document.getElementById('cp-id').value;
            const name = document.getElementById('cp-name').value.trim();
            const type = document.getElementById('cp-type').value;
            
            if (!name) {
                if (typeof window.showToast === 'function') window.showToast("Please enter a program name.", "error");
                return;
            }
            
            let programData = { id: id || `prog-${Math.random().toString(36).substr(2, 9)}`, name, type };
            
            if (type === 'individual') {
                const grade = document.getElementById('cp-grade').value;
                const sectionId = document.getElementById('cp-section').value;
                if (!grade || !sectionId) {
                    if (typeof window.showToast === 'function') window.showToast("Please configure grade and section.", "error");
                    return;
                }
                programData.grade = grade;
                programData.sectionId = sectionId;
            } else if (type === 'multigrade') {
                const checked = Array.from(document.querySelectorAll('input[name="cp-multi-sections"]:checked')).map(cb => cb.value);
                if (checked.length === 0) {
                    if (typeof window.showToast === 'function') window.showToast("Please select at least one section to combine.", "error");
                    return;
                }
                programData.sectionIds = checked;
            } else if (type === 'master') {
                const checked = Array.from(document.querySelectorAll('input[name="cp-master-progs"]:checked')).map(cb => cb.value);
                if (checked.length === 0) {
                    if (typeof window.showToast === 'function') window.showToast("Please select at least one program to combine.", "error");
                    return;
                }
                programData.subProgramIds = checked;
            }
            
            if (!window.workspaceState.programs) window.workspaceState.programs = [];
            
            if (id) {
                // Update
                const idx = window.workspaceState.programs.findIndex(p => p.id === id);
                if (idx !== -1) window.workspaceState.programs[idx] = programData;
            } else {
                // Insert
                window.workspaceState.programs.push(programData);
            }
            
            window.workspaceState.activeProgramId = programData.id;
            
            // Sync activeTab
            if (programData.id === 'prog-master-kinder') {
                window.workspaceState.activeTab = 'master_kinder';
            } else if (programData.id === 'prog-master-g12') {
                window.workspaceState.activeTab = 'master_g12';
            } else if (programData.id === 'prog-master-g36') {
                window.workspaceState.activeTab = 'master';
            } else {
                window.workspaceState.activeTab = 'program';
            }

            if (typeof window.saveState === 'function') window.saveState();
            if (typeof window.renderAll === 'function') window.renderAll();
            if (typeof window.renderSavedSchedules === 'function') window.renderSavedSchedules();
            
            window.closeCreateProgramModal();
            if (typeof window.showToast === 'function') window.showToast(`Saved program "${name}"`);
        };

        window.handleDeleteProgram = function(programId) {
            const prog = window.workspaceState?.programs?.find(p => p.id === programId);
            if (!prog) return;
            
            if (typeof window.showConfirm === 'function') {
                window.showConfirm(
                    "Delete Class Program", 
                    `Are you sure you want to delete the program "${prog.name}"? Scheduled class blocks within this program will also be deleted.`, 
                    () => {
                        window.workspaceState.programs = window.workspaceState.programs.filter(p => p.id !== programId);
                        
                        // Clear associated classes
                        if (window.workspaceState.classes) {
                            window.workspaceState.classes = window.workspaceState.classes.filter(c => c.programId !== programId);
                        }
                        
                        // Re-route active program
                        if (window.workspaceState.activeProgramId === programId) {
                            window.workspaceState.activeProgramId = window.workspaceState.programs[0]?.id || "";
                            if (window.workspaceState.activeProgramId) {
                                const activeProg = window.workspaceState.programs[0];
                                if (activeProg.id === 'prog-master-kinder') window.workspaceState.activeTab = 'master_kinder';
                                else if (activeProg.id === 'prog-master-g12') window.workspaceState.activeTab = 'master_g12';
                                else if (activeProg.id === 'prog-master-g36') window.workspaceState.activeTab = 'master';
                                else window.workspaceState.activeTab = 'program';
                            }
                        }
                        
                        if (typeof window.saveState === 'function') window.saveState();
                        if (typeof window.renderAll === 'function') window.renderAll();
                        if (typeof window.renderSavedSchedules === 'function') window.renderSavedSchedules();
                        if (typeof window.showToast === 'function') window.showToast(`Deleted program "${prog.name}"`);
                    }
                );
            }
        };

        window.handleSplitProgram = function(programId) {
            const prog = window.workspaceState?.programs?.find(p => p.id === programId);
            if (!prog) return;
            
            if (prog.type === 'master') {
                if (typeof window.showConfirm === 'function') {
                    window.showConfirm(
                        "Dissolve Master Program",
                        `Are you sure you want to dissolve the Master Program "${prog.name}"? The individual sub-programs will remain intact.`,
                        () => {
                            window.workspaceState.programs = window.workspaceState.programs.filter(p => p.id !== programId);
                            if (window.workspaceState.activeProgramId === programId) {
                                window.workspaceState.activeProgramId = window.workspaceState.programs[0]?.id || "";
                                window.workspaceState.activeTab = 'program';
                            }
                            if (typeof window.saveState === 'function') window.saveState();
                            if (typeof window.renderAll === 'function') window.renderAll();
                            if (typeof window.renderSavedSchedules === 'function') window.renderSavedSchedules();
                            if (typeof window.showToast === 'function') window.showToast(`Dissolved Master Program`);
                        }
                    );
                }
            } else if (prog.type === 'multigrade') {
                if (typeof window.showConfirm === 'function') {
                    window.showConfirm(
                        "Split Multi-Grade Program",
                        `Are you sure you want to split "${prog.name}" into separate individual programs? This will copy all scheduled classes to each section so you can customize them separately.`,
                        () => {
                            const newPrograms = [];
                            
                            (prog.sectionIds || []).forEach(secId => {
                                const sectionObj = window.workspaceState.sections.find(s => s.id === secId);
                                if (!sectionObj) return;
                                
                                const newProgId = `prog-sec-${secId}`;
                                if (!window.workspaceState.programs.some(p => p.id === newProgId)) {
                                    window.workspaceState.programs.push({
                                        id: newProgId,
                                        name: `${sectionObj.grade} - ${sectionObj.name}`,
                                        type: 'individual',
                                        grade: sectionObj.grade,
                                        sectionId: secId
                                    });
                                }
                                
                                // Clone class blocks
                                const classesToClone = (window.workspaceState.classes || []).filter(c => c.programId === programId);
                                classesToClone.forEach(c => {
                                    window.workspaceState.classes.push({
                                        ...c,
                                        id: `c-split-${Math.random().toString(36).substr(2, 9)}`,
                                        sectionId: secId,
                                        programId: newProgId
                                    });
                                });
                            });
                            
                            // Delete multi-grade program and classes
                            window.workspaceState.programs = window.workspaceState.programs.filter(p => p.id !== programId);
                            window.workspaceState.classes = window.workspaceState.classes.filter(c => c.programId !== programId);
                            
                            window.workspaceState.activeProgramId = `prog-sec-${prog.sectionIds[0]}` || '';
                            window.workspaceState.activeTab = 'program';
                            
                            if (typeof window.saveState === 'function') window.saveState();
                            if (typeof window.renderAll === 'function') window.renderAll();
                            if (typeof window.renderSavedSchedules === 'function') window.renderSavedSchedules();
                            if (typeof window.showToast === 'function') window.showToast(`Split multi-grade program into individual sections.`);
                        }
                    );
                }
            }
        };



// --- BUNDLED FROM: src/saved-schedules.js ---
        window.collapsedYears = window.collapsedYears || [];

        window.toggleYearExpansion = function(year) {
            const idx = window.collapsedYears.indexOf(year);
            if (idx !== -1) {
                window.collapsedYears.splice(idx, 1);
            } else {
                window.collapsedYears.push(year);
            }
            window.renderSavedSchedules();
        };

        window.renderSavedSchedules = function() {
            const treeContainer = document.getElementById('saved-schedules-tree');
            if (!treeContainer) return;

            const years = (window.getAllSchoolYears && window.getAllSchoolYears()) || [];
            const activeYear = window.workspaceState?.schoolConfig?.schoolYear || '';

            if (years.length === 0) {
                treeContainer.innerHTML = `
                    <div class="px-3 py-4 text-center">
                        <p class="text-[11px] text-slate-400 font-medium">No school years found.</p>
                        <button onclick="window.openNewSYModal()" class="mt-2 text-[11px] text-emerald-600 font-bold hover:underline">+ Create one</button>
                    </div>
                `;
                if (window.lucide) lucide.createIcons();
                return;
            }

            let html = '';
            years.forEach(year => {
                const isActive = year === activeYear;
                const isCollapsed = window.collapsedYears.includes(year);
                html += `
                    <div class="mb-1">
                        <button
                            onclick="${isActive ? `window.toggleYearExpansion('${year}')` : `window.switchSchoolYear('${year}')`}"
                            class="flex items-center gap-2 w-full py-2 px-3 text-[13px] rounded-lg transition-colors text-left group ${isActive ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'}"
                        >
                            <i data-lucide="${isActive && !isCollapsed ? 'folder-open' : 'folder'}" class="w-4 h-4 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'} transition-colors"></i>
                            <span class="truncate flex-1">${year}</span>
                            ${isActive ? '<span class="text-[9px] font-bold bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full shrink-0">Active</span>' : ''}
                        </button>
                `;

                if (isActive && !isCollapsed) {
                    html += `<div class="pl-4 mt-1 mb-2 space-y-[2px] border-l border-slate-200 ml-5">`;
                    const programs = window.workspaceState?.programs || [];
                    const activeProgId = window.workspaceState?.activeProgramId || '';
                    programs.forEach(prog => {
                        const isProgActive = prog.id === activeProgId;
                        let iconName = 'file-text';
                        if (prog.type === 'multigrade') iconName = 'layers';
                        else if (prog.type === 'master') iconName = 'layout-grid';

                        html += `
                            <div class="group relative flex items-center justify-between w-full py-1.5 px-2 rounded-md transition-colors ${isProgActive ? 'bg-emerald-50/50 text-emerald-800 font-bold shadow-xs' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}">
                                <button
                                    onclick="window.switchClassProgram('${prog.id}')"
                                    class="flex items-center gap-1.5 flex-1 min-w-0 text-[12px] text-left"
                                >
                                    <i data-lucide="${iconName}" class="w-3.5 h-3.5 shrink-0 ${isProgActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'}"></i>
                                    <span class="truncate">${prog.name}</span>
                                </button>
                                
                                <div class="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 ml-1 transition-opacity">
                                    <button onclick="event.stopPropagation(); window.openCreateProgramModal('${prog.id}')" class="p-0.5 hover:text-emerald-600 rounded" title="Edit Program">
                                        <i data-lucide="edit-3" class="w-3 h-3"></i>
                                    </button>
                                    ${prog.type === 'master' ? `
                                        <button onclick="event.stopPropagation(); window.handleSplitProgram('${prog.id}')" class="p-0.5 hover:text-blue-600 rounded" title="Split Master Program">
                                            <i data-lucide="split" class="w-3 h-3"></i>
                                        </button>
                                    ` : ''}
                                    ${prog.type === 'multigrade' ? `
                                        <button onclick="event.stopPropagation(); window.handleSplitProgram('${prog.id}')" class="p-0.5 hover:text-blue-600 rounded" title="Split Multi-Grade Program">
                                            <i data-lucide="scissors" class="w-3 h-3"></i>
                                        </button>
                                    ` : ''}
                                    <button onclick="event.stopPropagation(); window.handleDeleteProgram('${prog.id}')" class="p-0.5 hover:text-rose-600 rounded" title="Delete Program">
                                        <i data-lucide="trash-2" class="w-3 h-3"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    });

                    // Add "Create Program" action button
                    html += `
                        <button
                            onclick="window.openCreateProgramModal()"
                            class="flex items-center gap-1.5 w-full py-1.5 px-2 text-[11px] text-slate-400 hover:text-emerald-600 hover:bg-slate-50 rounded-md transition-colors text-left font-bold"
                        >
                            <i data-lucide="plus" class="w-3.5 h-3.5 shrink-0"></i>
                            <span>Create Program</span>
                        </button>
                    `;
                    html += `</div>`;
                }

                html += `</div>`;
            });

            treeContainer.innerHTML = html;
            if (window.lucide) lucide.createIcons();
        };


