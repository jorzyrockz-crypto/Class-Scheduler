import { defaultState } from './defaults.js';
import { readSavedState, writeSavedState } from './storage.js';
import { migrateLegacyData } from './stateMigration.js';

export const State = {
    workspace: JSON.parse(JSON.stringify(defaultState)),
    summaryFilter: 'all',
    summarySearchQuery: '',
    inlineEditingSlotId: null,
    draggedBlockId: null,
    activeQuickMoveId: null,
    activeResourceTab: 'school',
    activeSelectedCardId: null,
    activeTeacherFilterId: null,
    expandedTeacherId: null,
    activeTimeSlotFilter: 'all',
    editingTeacherId: null,
    editingSubjectId: null,
    editingSectionId: null,
    editingTimeSlotId: null
};

export const saveState = (isCloudConnected, currentRoomCode, saveToCloudCallback) => {
    writeSavedState(State.workspace);
    if (isCloudConnected && currentRoomCode && saveToCloudCallback) {
        saveToCloudCallback(currentRoomCode, State.workspace);
    }
};

export const loadState = () => {
    const saved = readSavedState();
    if (saved) {
        State.workspace = migrateLegacyData(saved);
    } else {
        State.workspace = migrateLegacyData(JSON.parse(JSON.stringify(defaultState)));
    }
};
