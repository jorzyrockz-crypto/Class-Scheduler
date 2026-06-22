        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        window.onSnapshot = onSnapshot;
        window.doc = doc;
        window.getDoc = getDoc;
        window.setDoc = setDoc;
        
        window.signInWithEmailAndPassword = signInWithEmailAndPassword;
        window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
        window.signOut = signOut;
        window.onAuthStateChanged = onAuthStateChanged;

        // --- UPDATE ANNOUNCEMENT SYSTEM ---
        const APP_VERSION = "v1.1.7";
        const APP_CHANGELOG = [
            "🏛️ **Three-Tier Architecture:** Added support for Individual, Multi-Grade, and Master class programs.",
            "📂 **Sidebar Folders:** The navigation tree now supports collapsible school year folders.",
            "🎨 **Sidebar Layout:** Compacted navigation spacing and improved scroll containment.",
            "🧑‍🏫 **Faculty Page Restored:** Fixed an issue where the Teacher Faculty Workload page was not rendering correctly.",
            "🎨 **Load Summary UI:** Completely redesigned the Load Summary view to feature a cleaner GitHub-style aesthetic.",
            "⚡ **PWA Update Fix:** Resolved an issue where Progressive Web App updates were not properly installing and reloading.",
            "🛠️ **Performance Refactor:** The app's engine has been completely modularized into smaller, highly-efficient files for lightning-fast loading."
        ];

        // Global variables
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = {
            apiKey: "AIzaSyCnBYuNlOYUoLKKcaua5nMqnTSlFi4Di80",
            authDomain: "class-scheduler-63968.firebaseapp.com",
            projectId: "class-scheduler-63968",
            storageBucket: "class-scheduler-63968.firebasestorage.app",
            messagingSenderId: "747294517653",
            appId: "1:747294517653:web:795a578b113913ee1dae9c"
        };
        const initialAuthToken = null;

        window.currentRoomCode = "default";
        window.isCloudConnected = false;
        window.unsubscribeRoom = null;

        // Initialize Firebase
        try {
            const app = initializeApp(firebaseConfig);
            window.db = getFirestore(app);
            window.auth = getAuth(app);
            window.isCloudEnabled = true;
        } catch (err) {
            console.error("Cloud configuration failed:", err);
            window.db = null;
            window.auth = null;
            window.isCloudEnabled = false;
        }
