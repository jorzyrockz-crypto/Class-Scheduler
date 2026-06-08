import {
    defaultSchoolConfig,
    initialClasses,
    initialSections,
    initialTimeSlots
} from './defaults.js';

export const migrateLegacyData = (state) => {
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
