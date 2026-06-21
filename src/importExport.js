import { State, saveState } from './state.js';
import { migrateLegacyData } from './stateMigration.js';
import { isCloudConnected, currentRoomCode, saveToCloud } from './cloudSync.js';

let _showToast = null;
let _setActiveTab = null;

export const setupImportExport = (deps) => {
    _showToast = deps.showToast;
    _setActiveTab = deps.setActiveTab;
};

export const exportData = () => {
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

export const triggerImport = () => {
    document.getElementById('import-file-input').click();
};

export const handleImport = (e) => {
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
