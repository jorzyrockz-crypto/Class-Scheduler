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
        const APP_VERSION = "v1.1.1";
        const APP_CHANGELOG = [
            "🎉 **Theatrical Updater:** Added a gorgeous interactive installation wizard!",
            "🔐 **SaaS Authentication:** The app is now protected by a secure login portal using real Email and Password authentication.",
            "🏢 **School Workspaces:** Teachers can now collaborate seamlessly by joining the same 'School ID' workspace during account creation.",
            "✨ **Clean Profile Menu:** The top navigation bar has been beautifully streamlined with a dedicated Profile Dropdown menu."
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
