import { State, saveState } from './state.js';
import { isCloudConnected, currentRoomCode, saveToCloud } from './cloudSync.js';
import { timeToMins } from './utils.js';

let _showToast = null;
let _renderAll = null;
let _renderResourceLists = null;

export const setupScheduling = (deps) => {
    _showToast = deps.showToast;
    _renderAll = deps.renderAll;
    _renderResourceLists = deps.renderResourceLists;
};

export const checkTeacherCollision = (block) => {
    if (!block.timeSlotId || block.day === 'pool') return false;
    const simultaneousBlocks = State.workspace.classes.filter(c => 
        c.id !== block.id && 
        c.day === block.day && 
        c.timeSlotId === block.timeSlotId
    );
    return simultaneousBlocks.some(c => c.teacherId === block.teacherId);
};

export const checkDuplicateSubject = (block) => {
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

export const assignTeacherQuick = (teacherId) => {
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

export const getLiveStatus = (teacherId) => {
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
