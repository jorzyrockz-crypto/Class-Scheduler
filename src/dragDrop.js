import { State, saveState } from './state.js';
import { isCloudConnected, currentRoomCode, saveToCloud } from './cloudSync.js';

let _showToast = null;
let _renderAll = null;

export const setupDragDrop = (deps) => {
    _showToast = deps.showToast;
    _renderAll = deps.renderAll;
};

export const executeDragMoveMaster = (blockId, grade, slotId) => {
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

export const executeDragMoveSection = (blockId, sectionId, slotId, dayFilter) => {
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

export const toggleRippleCascade = (checked) => {
    State.workspace.rippleCascadeEnabled = checked;
    saveState(isCloudConnected, currentRoomCode, saveToCloud);
    if (_showToast) _showToast(checked ? "Domino Ripple Cascading enabled!" : "Domino Ripple Cascading disabled!");
};
