export const renderDiagnostics = (workspaceState, timeToMins, formatTo12Hour, escapeHtml, createLucideIcons) => {
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