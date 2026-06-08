export const initialSubjects = [
    {id: "s-fil", name: "FILIPINO"}, {id: "s-sci", name: "SCIENCE"},
    {id: "s-mat", name: "MATH"}, {id: "s-eng", name: "ENGLISH"},
    {id: "s-ap", name: "AP"}, {id: "s-epp", name: "EPP"},
    {id: "s-esp", name: "ESP"}, {id: "s-gmrc", name: "GMRC"},
    {id: "s-mab", name: "MAKABANSA"}, {id: "s-nrp", name: "NRP (30 MIN)"},
    {id: "s-nmp", name: "NMP (National Math Program)"}, {id: "s-hgp", name: "HGP"},
    {id: "s-map", name: "MAPEH"}
];
export const initialTeachers = [
    {id: "t-em", name: "E.M. AGUSTIN", color: "yellow"},
    {id: "t-md", name: "M.D. LOZADA", color: "orange"},
    {id: "t-rq", name: "R.Q. VICENTE", color: "blue"},
    {id: "t-js", name: "J.S. DINGLASAN", color: "teal"},
    {id: "t-lb", name: "L.B. CUADRANTE", color: "purple"},
    {id: "t-lf", name: "L. FUENTES", color: "lime"}
];
export const initialTimeSlots = [
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
export const initialSections = [
    {id: "sec-k-faith", name: "Faith", grade: "Kindergarten"},
    {id: "sec-g1-hope", name: "Hope", grade: "Grade 1"},
    {id: "sec-g2-charity", name: "Charity", grade: "Grade 2"},
    {id: "sec-g3-joy", name: "Joy", grade: "Grade 3"},
    {id: "sec-g4-gold", name: "Gold", grade: "Grade 4"},
    {id: "sec-g5-diamond", name: "Diamond", grade: "Grade 5"},
    {id: "sec-g6-ruby", name: "Ruby", grade: "Grade 6"}
];
export const initialClasses = [
    { id: "c-1", subjectId: "s-fil", grade: "Grade 3", teacherId: "t-em", timeSlotId: "ts-r1", day: "master" },
    { id: "c-2", subjectId: "s-sci", grade: "Grade 4", teacherId: "t-md", timeSlotId: "ts-r1", day: "master" },
    { id: "c-3", subjectId: "s-mat", grade: "Grade 5", teacherId: "t-rq", timeSlotId: "ts-r1", day: "master" },
    { id: "c-4", subjectId: "s-eng", grade: "Grade 6", teacherId: "t-js", timeSlotId: "ts-r1", day: "master" }
];
export const defaultAdvisers = {
    "Kindergarten": "t-lb",
    "Grade 1": "t-lf",
    "Grade 2": "t-md",
    "Grade 3": "t-em", 
    "Grade 4": "t-md",  
    "Grade 5": "t-rq",   
    "Grade 6": "t-js"   
};
export const defaultSchoolConfig = {
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
export const defaultState = {
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


