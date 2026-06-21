import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithCustomToken, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { State } from './state.js';
import { migrateLegacyData } from './stateMigration.js';
import { writeSavedState } from './storage.js';

let db = null;
let auth = null;
export let currentRoomCode = "default";
export let isCloudConnected = false;
let unsubscribeRoom = null;
export let isCloudEnabled = false;
let appId = 'default-app-id';

// Dependencies injected from app.js
let _showToast = null;
let _renderAll = null;

export const setupCloudSync = (config, token, id, deps) => {
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

export async function initCloudSync(initialAuthToken) {
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

export function listenToRoom(roomCode) {
    if (unsubscribeRoom) unsubscribeRoom();
    updateCloudUI('connecting');
    
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'schedules', roomCode);
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

export async function saveToCloud(roomCode, data) {
    if (!isCloudConnected || !db) return;
    try {
        updateCloudUI('saving');
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'schedules', roomCode);
        const cleanData = JSON.parse(JSON.stringify(data));
        await setDoc(docRef, cleanData);
        updateCloudUI('connected');
    } catch (err) {
        console.error("Failed to save to cloud:", err);
        updateCloudUI('error');
    }
}

export function updateCloudUI(status) {
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

export function switchCloudRoom() {
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
