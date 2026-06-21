import re

filepath = 'src/app.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add cloudSync imports right after state.js imports
if "import { initCloudSync, setupCloudSync, switchCloudRoom, saveToCloud, currentRoomCode, isCloudConnected } from './cloudSync.js';" not in content:
    content = content.replace("import { State, saveState, loadState } from './state.js';",
                              "import { State, saveState, loadState } from './state.js';\n        import { initCloudSync, setupCloudSync, switchCloudRoom, saveToCloud, currentRoomCode, isCloudConnected } from './cloudSync.js';")

# 2. Remove Firebase imports from app.js since they moved to cloudSync.js
firebase_imports = [
    r'import \{ initializeApp \} from "https://www\.gstatic\.com/firebasejs/11\.6\.1/firebase-app\.js";\n',
    r'import \{ getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged \} from "https://www\.gstatic\.com/firebasejs/11\.6\.1/firebase-auth\.js";\n',
    r'import \{ getFirestore, doc, getDoc, setDoc, onSnapshot \} from "https://www\.gstatic\.com/firebasejs/11\.6\.1/firebase-firestore\.js";\n',
    r'﻿﻿        import \{ initializeApp \} from "https://www\.gstatic\.com/firebasejs/11\.6\.1/firebase-app\.js";\n'
]

for imp in firebase_imports:
    content = re.sub(imp, '', content)

# 3. Remove cloud variables and init logic from app.js top
vars_to_remove = [
    r'const appId = typeof __app_id !== \'undefined\' \? __app_id : \'default-app-id\';\n',
    r'let firebaseConfig = null;\n\s*if \(typeof __firebase_config !== \'undefined\' && __firebase_config\) \{\n\s*try \{\n\s*firebaseConfig = JSON\.parse\(__firebase_config\);\n\s*\} catch \(e\) \{\n\s*console\.error\("Malformed Firebase configuration string:", e\);\n\s*firebaseConfig = null;\n\s*\}\n\s*\}\n',
    r'const initialAuthToken = typeof __initial_auth_token !== \'undefined\' \? __initial_auth_token : null;\n',
    r'let db = null;\n\s*let auth = null;\n\s*let currentRoomCode = "default";\n\s*let isCloudConnected = false;\n\s*let unsubscribeRoom = null;\n\s*let isCloudEnabled = false;\n',
    r'// Verify configuration safety\n\s*if \(firebaseConfig\) \{\n\s*try \{\n\s*const app = initializeApp\(firebaseConfig\);\n\s*db = getFirestore\(app\);\n\s*auth = getAuth\(app\);\n\s*isCloudEnabled = true;\n\s*\} catch \(err\) \{\n\s*console\.error\("Cloud configuration failed:", err\);\n\s*\}\n\s*\}\n'
]

for v in vars_to_remove:
    content = re.sub(v, '', content)

# 4. We need to setup CloudSync in app.js. We can inject it before "loadState();" (which might be in window.onload)
# Wait, we need to extract the functions completely. Let's use regex to remove the functions.
funcs_to_remove = [
    r'async function initCloudSync\(\) \{[\s\S]*?\}\s*(?=function listenToRoom)',
    r'function listenToRoom\(roomCode\) \{[\s\S]*?\}\s*(?=async function saveToCloud)',
    r'async function saveToCloud\(roomCode, data\) \{[\s\S]*?\}\s*(?=function updateCloudUI)',
    r'function updateCloudUI\(status\) \{[\s\S]*?\}\s*(?=function switchCloudRoom)',
    r'function switchCloudRoom\(\) \{[\s\S]*?\}\s*(?=const updateAdviserMap)',
    r'// --- CLOUD SYNC ENGINE UTILITIES ---\s*'
]

for func in funcs_to_remove:
    content = re.sub(func, '', content)

# Add setupCloudSync call and variables that we removed back so app.js can init it properly
# Let's just find `window.onload = function () {`
init_code = """
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        let firebaseConfig = null;
        if (typeof __firebase_config !== 'undefined' && __firebase_config) {
            try { firebaseConfig = JSON.parse(__firebase_config); } catch (e) { }
        }
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        setupCloudSync(firebaseConfig, initialAuthToken, appId, { showToast, renderAll });
"""

if "setupCloudSync(firebaseConfig" not in content:
    content = content.replace("window.onload = function () {", init_code + "\n        window.onload = function () {")
    content = content.replace("initCloudSync();", "initCloudSync(initialAuthToken);")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("CloudSync refactor complete.")
