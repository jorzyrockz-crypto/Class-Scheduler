
        // --- DATA DEFAULTS ---
        let summaryFilter = 'all';
        let summarySearchQuery = '';
        let inlineEditingSlotId = null; // Currently editing slot row identifier

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
            schoolId: "",
            schoolAddress: "Oquendo, Balete, Aklan",
            schoolType: "",
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
            rippleCascadeEnabled: true,
            programs: [],
            activeProgramId: ""
        };

        let workspaceState = JSON.parse(JSON.stringify(defaultState));
        window.workspaceState = workspaceState;
        let draggedBlockId = null;
        let activeQuickMoveId = null;
        let activeResourceTab = 'school'; 
        let activeSelectedCardId = null; 
        let activeTeacherFilterId = null; 
        let expandedTeacherId = null; 
        let activeTimeSlotFilter = 'all'; 

        // Edit trackers
        let editingTeacherId = null;
        let editingSubjectId = null;
        let editingSectionId = null;
        let editingTimeSlotId = null; 

        // Custom palettes
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

            // --- CLASS PROGRAM ARCHITECTURE MIGRATION ---
            if (!state.programs) state.programs = [];
            if (state.activeProgramId === undefined) state.activeProgramId = "";

            if (state.programs.length === 0) {
                // Generate default Individual Programs for all sections
                const individualPrograms = (state.sections || []).map(sec => ({
                    id: `prog-sec-${sec.id}`,
                    name: `${sec.grade} - ${sec.name}`,
                    type: 'individual',
                    grade: sec.grade,
                    sectionId: sec.id
                }));

                // Generate default Multi-Grade Program (Grades 1-2)
                const secG1 = (state.sections || []).find(s => s.grade === "Grade 1")?.id || "";
                const secG2 = (state.sections || []).find(s => s.grade === "Grade 2")?.id || "";
                const multigradeProgram = {
                    id: 'prog-mg-g12',
                    name: 'Grades 1 - 2 Combined',
                    type: 'multigrade',
                    sectionIds: [secG1, secG2].filter(Boolean)
                };

                // Generate default Master Programs
                const masterKinder = {
                    id: 'prog-master-kinder',
                    name: 'Master Program (Kindergarten)',
                    type: 'master',
                    subProgramIds: (state.sections || []).filter(s => s.grade === "Kindergarten").map(s => `prog-sec-${s.id}`)
                };
                const masterG12 = {
                    id: 'prog-master-g12',
                    name: 'Master Program (Grades 1 - 2)',
                    type: 'master',
                    subProgramIds: ['prog-mg-g12']
                };
                const masterG36 = {
                    id: 'prog-master-g36',
                    name: 'Master Program (Grades 3 - 6)',
                    type: 'master',
                    subProgramIds: (state.sections || []).filter(s => ["Grade 3", "Grade 4", "Grade 5", "Grade 6"].includes(s.grade)).map(s => `prog-sec-${s.id}`)
                };

                state.programs = [
                    ...individualPrograms,
                    multigradeProgram,
                    masterKinder,
                    masterG12,
                    masterG36
                ];

                // Map legacy classes to programId
                if (state.classes) {
                    state.classes.forEach(c => {
                        if (!c.programId) {
                            if (c.sectionId) {
                                c.programId = `prog-sec-${c.sectionId}`;
                            } else {
                                // Find section for grade
                                const sec = (state.sections || []).find(s => s.grade === c.grade);
                                if (sec) {
                                    c.sectionId = sec.id;
                                    c.programId = `prog-sec-${sec.id}`;
                                }
                            }
                        }
                    });
                }
            }

            // Ensure activeProgramId is set if empty
            if (!state.activeProgramId) {
                if (state.activeTab === 'master_kinder') {
                    state.activeProgramId = 'prog-master-kinder';
                } else if (state.activeTab === 'master_g12') {
                    state.activeProgramId = 'prog-master-g12';
                } else if (state.activeTab === 'master') {
                    state.activeProgramId = 'prog-master-g36';
                } else {
                    state.activeProgramId = state.programs[0]?.id || "";
                }
            }

            return state;
        };

        const generateId = (prefix) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
        
        const getStorageKey = (year) => {
            if (!year) return 'elem_program_matrix_v6';
            return `elem_program_matrix_v6_${year.replace(/[^a-zA-Z0-9-]/g, '_')}`;
        };

        const saveState = () => {
            const currentYear = workspaceState?.schoolConfig?.schoolYear || defaultSchoolConfig.schoolYear;
            localStorage.setItem(getStorageKey(currentYear), JSON.stringify(workspaceState));
            localStorage.setItem('last_active_school_year', currentYear);
            registerSchoolYear(currentYear);

            if (window.isCloudConnected && window.currentRoomCode) {
                window.saveToCloud(window.currentRoomCode, workspaceState);
            }
        };
        
        const loadState = () => {
            const lastActiveYear = localStorage.getItem('last_active_school_year') || defaultSchoolConfig.schoolYear;
            const currentKey = getStorageKey(lastActiveYear);
            
            let saved = localStorage.getItem(currentKey);
            
            // Legacy Migration logic: fall back to the old storage key if it's the first time
            if (!saved && localStorage.getItem('elem_program_matrix_v6')) {
                saved = localStorage.getItem('elem_program_matrix_v6');
            }

            if (saved) {
                workspaceState = migrateLegacyData(JSON.parse(saved));
            } else {
                workspaceState = migrateLegacyData(JSON.parse(JSON.stringify(defaultState)));
                
                // If it's a completely new blank slate (not the 2025-2026 default), clear specific data
                if (lastActiveYear !== defaultSchoolConfig.schoolYear) {
                    workspaceState.teachers = [];
                    workspaceState.classes = [];
                    workspaceState.advisers = {};
                }
            }
            
            // Ensure the active school year is set in the config
            workspaceState.schoolConfig.schoolYear = lastActiveYear;
            window.workspaceState = workspaceState;
        };

        const switchClassProgram = (programId) => {
            if (!workspaceState) return;
            const program = workspaceState.programs.find(p => p.id === programId);
            if (!program) return;
            workspaceState.activeProgramId = programId;
            // Also synchronize activeTab so that legacy parts of the system don't break
            if (programId === 'prog-master-kinder') {
                workspaceState.activeTab = 'master_kinder';
            } else if (programId === 'prog-master-g12') {
                workspaceState.activeTab = 'master_g12';
            } else if (programId === 'prog-master-g36') {
                workspaceState.activeTab = 'master';
            } else {
                workspaceState.activeTab = 'program';
            }
            saveState();
            
            // Auto switch navigation view if we are on summary or dashboard
            if (window.currentView !== 'schedule') {
                if (typeof window.setMainView === 'function') window.setMainView('schedule');
            }
            
            if (typeof renderAll === 'function') renderAll();
            if (typeof window.renderSavedSchedules === 'function') window.renderSavedSchedules();
            if (typeof lucide !== 'undefined') lucide.createIcons();
            if (typeof showToast === 'function') showToast(`Switched program to ${program.name}`);
        };
        window.switchClassProgram = switchClassProgram;

        const switchSchoolYear = (newYear) => {
            // Save current progress to the outgoing school year
            if (workspaceState) {
                saveState();
            }
            
            // Update the tracker and fetch the incoming school year state
            localStorage.setItem('last_active_school_year', newYear);
            loadState();
            if (typeof renderAll === 'function') renderAll();
            if (typeof window.renderSavedSchedules === 'function') window.renderSavedSchedules();
            if (typeof lucide !== 'undefined') lucide.createIcons();
            if (typeof showToast === 'function') showToast(`Switched to ${newYear}`);
        };
        window.switchSchoolYear = switchSchoolYear;

        const getAllSchoolYears = () => {
            try {
                return JSON.parse(localStorage.getItem('school_years_index') || '[]');
            } catch { return []; }
        };
        window.getAllSchoolYears = getAllSchoolYears;

        const registerSchoolYear = (year) => {
            if (!year) return;
            const years = getAllSchoolYears();
            if (!years.includes(year)) {
                years.push(year);
                localStorage.setItem('school_years_index', JSON.stringify(years));
            }
        };
        window.registerSchoolYear = registerSchoolYear;
