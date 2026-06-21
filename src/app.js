
        // --- CLOUD SYNC ENGINE UTILITIES ---
        let currentUser = null;
        let currentSchoolId = null;

        async function initCloudSync() {
            if (!isCloudEnabled) {
                updateCloudUI('disabled');
                return;
            }
            updateCloudUI('connecting');
            
            // Listen for auth state changes
            onAuthStateChanged(auth, async (user) => {
                const authPortal = document.getElementById('auth-portal');
                const userEmailSpan = document.getElementById('nav-user-email');
                const userSchoolSpan = document.getElementById('nav-user-school');
                const profileContainer = document.getElementById('nav-profile-container');

                if (user) {
                    // User is signed in
                    currentUser = user;
                    
                    try {
                        const userDoc = await getDoc(doc(db, 'users', user.uid));
                        if (userDoc.exists() && userDoc.data().schoolId) {
                            currentSchoolId = userDoc.data().schoolId;
                        } else {
                            currentSchoolId = 'default-school';
                        }
                    } catch (e) {
                        currentSchoolId = 'default-school';
                    }

                    authPortal.style.display = 'none';
                    if (profileContainer) profileContainer.classList.remove('hidden');
                    if (userEmailSpan) userEmailSpan.innerText = user.email;
                    if (userSchoolSpan) userSchoolSpan.innerText = currentSchoolId;

                    isCloudConnected = true;
                    listenToRoom(currentRoomCode);
                    checkVersion();
                } else {
                    // User is signed out
                    currentUser = null;
                    currentSchoolId = null;
                    isCloudConnected = false;
                    if (unsubscribeRoom) unsubscribeRoom();
                    
                    authPortal.style.display = 'flex';
                    if (profileContainer) profileContainer.classList.add('hidden');
                    updateCloudUI('disabled');
                }
            });
        }

        async function handleAuthAction(action) {
            const email = document.getElementById('auth-email').value.trim();
            const password = document.getElementById('auth-password').value.trim();
            const schoolIdInput = document.getElementById('auth-school');
            const schoolId = schoolIdInput ? schoolIdInput.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') : '';
            
            const errorMsg = document.getElementById('auth-error-msg');
            const errorText = document.getElementById('auth-error-text');

            if (action !== 'logout' && (!email || !password || !schoolId)) {
                errorMsg.classList.remove('hidden');
                errorText.innerText = "Please enter School ID, Email, and Password.";
                return;
            }

            errorMsg.classList.add('hidden');

            try {
                if (action === 'login') {
                    // On login, we verify credentials. 
                    // To enforce school matching, we could check if the typed schoolId matches their DB record,
                    // but for now, the DB record overrides whatever they type to ensure they stay in their school.
                    await signInWithEmailAndPassword(auth, email, password);
                } else if (action === 'signup') {
                    const cred = await createUserWithEmailAndPassword(auth, email, password);
                    // Save their school ID
                    await setDoc(doc(db, 'users', cred.user.uid), { schoolId: schoolId });
                } else if (action === 'logout') {
                    await signOut(auth);
                }
            } catch (error) {
                errorMsg.classList.remove('hidden');
                errorText.innerText = error.message;
            }
        }
        window.handleAuthAction = handleAuthAction;

        // --- UPDATE ANNOUNCEMENT UTILITIES ---
        function checkVersion() {
            const lastSeen = localStorage.getItem('elem_program_matrix_last_version');
            if (lastSeen !== APP_VERSION) {
                // Short delay so it pops up gracefully after login
                setTimeout(() => showUpdateToast(), 1000);
            }
        }

        function showUpdateToast() {
            const toast = document.getElementById('update-toast');
            const versionSpan = document.getElementById('update-toast-version');
            if (!toast || !versionSpan) return;
            
            versionSpan.innerText = APP_VERSION;
            toast.classList.remove('translate-y-32', 'opacity-0');
        }

        function dismissUpdateToast() {
            const toast = document.getElementById('update-toast');
            if (toast) {
                toast.classList.add('translate-y-32', 'opacity-0');
            }
        }

        function startTheatricalUpdate() {
            dismissUpdateToast();
            
            const modal = document.getElementById('installing-modal');
            const bar = document.getElementById('installing-progress-bar');
            const statusText = document.getElementById('installing-status-text');
            
            // Show modal
            modal.classList.remove('hidden');
            void modal.offsetWidth;
            modal.classList.remove('opacity-0');
            
            // Reset bar
            bar.style.width = '0%';
            
            // Sequence of fake statuses and progress
            const sequence = [
                { time: 500, percent: 15, text: "Connecting to secure server..." },
                { time: 1200, percent: 45, text: "Downloading workspace assets..." },
                { time: 2000, percent: 80, text: "Compiling fresh UI modules..." },
                { time: 2700, percent: 100, text: "Finalizing installation!" }
            ];
            
            sequence.forEach(step => {
                setTimeout(() => {
                    bar.style.width = `${step.percent}%`;
                    statusText.innerText = step.text;
                }, step.time);
            });
            
            // Finish and show real release notes
            setTimeout(() => {
                modal.classList.add('opacity-0');
                setTimeout(() => {
                    modal.classList.add('hidden');
                    openUpdateModal();
                }, 300);
            }, 3200);
        }

        function openUpdateModal() {
            const modal = document.getElementById('update-modal');
            const content = document.getElementById('update-modal-content');
            const list = document.getElementById('update-changelog-list');
            const versionText = document.getElementById('update-version-text');

            versionText.innerText = APP_VERSION;
            
            // Populate list
            list.innerHTML = '';
            APP_CHANGELOG.forEach(item => {
                // Simple markdown-style bolding for the first few words
                const formattedText = item.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-slate-800">$1</span>');
                list.innerHTML += `
                    <li class="flex gap-3 text-sm text-slate-600 items-start">
                        <i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"></i>
                        <span>${formattedText}</span>
                    </li>
                `;
            });
            lucide.createIcons();

            // Show modal with animation
            modal.classList.remove('hidden');
            // Trigger reflow
            void modal.offsetWidth;
            modal.classList.remove('opacity-0');
            content.classList.remove('scale-95');
            content.classList.add('animate-pop-in');
            
            // Close profile dropdown if it was open via the button
            const profileMenu = document.getElementById('profile-dropdown-menu');
            if (profileMenu) profileMenu.classList.add('hidden', 'opacity-0', 'scale-95');
        }

        function closeUpdateModal() {
            const modal = document.getElementById('update-modal');
            const content = document.getElementById('update-modal-content');
            
            modal.classList.add('opacity-0');
            content.classList.remove('animate-pop-in');
            content.classList.add('scale-95');
            
            setTimeout(() => {
                modal.classList.add('hidden');
                localStorage.setItem('elem_program_matrix_last_version', APP_VERSION);
            }, 300);
        }

        function listenToRoom(roomCode) {
            if (unsubscribeRoom) unsubscribeRoom();
            updateCloudUI('connecting');
            
            if (!currentUser || !currentSchoolId) return;
            const docRef = doc(db, 'artifacts', appId, 'schools', currentSchoolId, 'schedules', roomCode);
            unsubscribeRoom = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    const incomingData = docSnap.data();
                    if (incomingData && incomingData.subjects && incomingData.teachers) {
                        workspaceState = migrateLegacyData(incomingData);
                        localStorage.setItem('elem_program_matrix_v6', JSON.stringify(workspaceState));
                        updateCloudUI('connected');
                        renderAll();
                    }
                } else {
                    // Room doesn't have online copy, push local state to start collaboration room
                    updateCloudUI('connected');
                    saveToCloud(roomCode, workspaceState);
                }
            }, (error) => {
                console.error("Firestore room subscription error:", error);
                updateCloudUI('error');
            });
        }

        async function saveToCloud(roomCode, data) {
            if (!isCloudConnected || !db || !currentUser || !currentSchoolId) return;
            try {
                updateCloudUI('saving');
                const docRef = doc(db, 'artifacts', appId, 'schools', currentSchoolId, 'schedules', roomCode);
                const cleanData = JSON.parse(JSON.stringify(data));
                await setDoc(docRef, cleanData);
                updateCloudUI('connected');
            } catch (err) {
                console.error("Failed to save to cloud:", err);
                updateCloudUI('error');
            }
        }

        function updateCloudUI(status) {
            const statusDot = document.getElementById('profile-status-dot');
            const statusText = document.getElementById('profile-cloud-status-text');

            if (!statusDot || !statusText) return;

            switch (status) {
                case 'disabled':
                    statusDot.className = "absolute top-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full bg-slate-400";
                    statusText.className = "text-[9px] font-bold text-slate-400 uppercase tracking-wider";
                    statusText.innerText = "Offline";
                    break;
                case 'connecting':
                    statusDot.className = "absolute top-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full bg-blue-500 animate-pulse";
                    statusText.className = "text-[9px] font-bold text-blue-500 uppercase tracking-wider animate-pulse";
                    statusText.innerText = "Connecting...";
                    break;
                case 'connected':
                    statusDot.className = "absolute top-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full bg-emerald-500";
                    statusText.className = "text-[9px] font-bold text-emerald-500 uppercase tracking-wider";
                    statusText.innerText = "Synced & Secured";
                    break;
                case 'saving':
                    statusDot.className = "absolute top-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full bg-amber-500";
                    statusText.className = "text-[9px] font-bold text-amber-500 uppercase tracking-wider animate-pulse";
                    statusText.innerText = "Saving...";
                    break;
                case 'error':
                case 'failed':
                    statusDot.className = "absolute top-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full bg-rose-500";
                    statusText.className = "text-[9px] font-bold text-rose-500 uppercase tracking-wider";
                    statusText.innerText = "Sync Failed"
                    break;
            }
            lucide.createIcons();
        }

        function switchCloudRoom() {
            const roomInput = document.getElementById('cloud-room-input');
            if (!roomInput) return;
            const code = roomInput.value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
            if (!code) {
                showToast("Please enter a valid alphanumeric room code.", "error");
                return;
            }
            currentRoomCode = code;
            if (isCloudConnected) {
                listenToRoom(currentRoomCode);
                showToast(`Switched to shared room: ${code.toUpperCase()}`);
            } else {
                showToast("Working locally. Room will connect once network starts.", "info");
            }
        }

        const escapeHtml = (unsafe) => (unsafe||"").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const formatTo12Hour = (timeStr) => {
            if (!timeStr) return "";
            const parts = timeStr.split(':');
            if (parts.length !== 2) return timeStr;
            let hour = parseInt(parts[0], 10);
            let mins = parts[1];
            const ampm = hour >= 12 ? 'PM' : 'AM';
            hour = hour % 12;
            hour = hour ? hour : 12; 
            return `${hour}:${parts[1]} ${ampm}`;
        };

        const timeToMins = (t) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        const minsToTime = (mins) => {
            const h = Math.floor(mins / 60) % 24;
            const m = mins % 60;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };

        const updateAdviserMap = (grade, teacherId) => {
            workspaceState.advisers[grade] = teacherId;
            saveState();
            renderAll(); 
        };

        const updateSchoolConfig = (key, value) => {
            workspaceState.schoolConfig[key] = value;
            saveState();
            renderPrintDOM();
        };

        const handleLogoUpload = (e, side) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                workspaceState.schoolConfig[side] = event.target.result;
                saveState();
                renderPrintDOM();
                showToast(`${side === 'logoLeft' ? 'Left' : 'Right'} logo successfully saved.`);
            };
            reader.readAsDataURL(file);
        };

        const clearLogo = (side) => {
            workspaceState.schoolConfig[side] = "";
            saveState();
            renderPrintDOM();
            showToast(`${side === 'logoLeft' ? 'Left' : 'Right'} logo cleared.`);
        };

        const renderPrintDOM = () => {
            const cfg = workspaceState.schoolConfig;
            
            document.getElementById('print-region').innerText = cfg.region || "";
            document.getElementById('print-division').innerText = cfg.division || "";
            document.getElementById('print-district').innerText = cfg.district || "";
            document.getElementById('print-schoolName').innerText = cfg.schoolName || "";
            document.getElementById('print-schoolAddress').innerText = cfg.schoolAddress || "";
            document.getElementById('print-sy').innerText = cfg.schoolYear || "";
            
            const leftContainer = document.getElementById('print-logo-left-container');
            const rightContainer = document.getElementById('print-logo-right-container');
            if (leftContainer) leftContainer.innerHTML = cfg.logoLeft ? `<img src="${cfg.logoLeft}" class="print-logo-img">` : `NO LOGO`;
            if (rightContainer) rightContainer.innerHTML = cfg.logoRight ? `<img src="${cfg.logoRight}" class="print-logo-img">` : `NO LOGO`;

            document.getElementById('print-sig1-name').innerText = cfg.signatory1Name || "";
            document.getElementById('print-sig1-title').innerText = cfg.signatory1Title || "";
            document.getElementById('print-sig2-name').innerText = cfg.signatory2Name || "";
            document.getElementById('print-sig2-title').innerText = cfg.signatory2Title || "";
        };

        const checkTeacherCollision = (block) => {
            if (!block.timeSlotId || block.day === 'pool') return false;
            const simultaneousBlocks = workspaceState.classes.filter(c => 
                c.id !== block.id && 
                c.day === block.day && 
                c.timeSlotId === block.timeSlotId
            );
            return simultaneousBlocks.some(c => c.teacherId === block.teacherId);
        };

        const checkDuplicateSubject = (block) => {
            if (!block.timeSlotId || block.day === 'pool') return false;
            const duplicateBlocks = workspaceState.classes.filter(c => {
                if (c.id === block.id || c.day !== block.day || c.timeSlotId !== block.timeSlotId) return false;
                if (block.day === 'master') {
                    return c.grade === block.grade && c.subjectId === block.subjectId;
                } else {
                    return c.sectionId === block.sectionId && c.subjectId === block.subjectId;
                }
            });
            return duplicateBlocks.length > 0;
        };

        const renderDiagnostics = () => {
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
            lucide.createIcons();
        };

        window.addEventListener('beforeprint', () => {
            const titleEl = document.getElementById('print-doc-title');
            if (workspaceState.activeTab === 'master_kinder') {
                titleEl.innerText = `MASTER CLASS PROGRAM (KINDERGARTEN)`;
            } else if (workspaceState.activeTab === 'master_g12') {
                titleEl.innerText = `MASTER CLASS PROGRAM (GRADES 1 - 2)`;
            } else if (workspaceState.activeTab === 'master') {
                titleEl.innerText = `MASTER CLASS PROGRAM (GRADES 3 - 6)`;
            } else if (workspaceState.activeTab === 'summary') {
                titleEl.innerText = `TEACHING LOAD SUMMARY REPORT`;
            } else {
                const filter = workspaceState.gradelevelFilter;
                titleEl.innerText = `CLASS PROGRAM FOR ${filter}`;
            }
        });

        const populateGradelevelFilters = () => {
            const gradeSelect = document.getElementById('gradelevel-filter-select');
            gradeSelect.innerHTML = '';
            workspaceState.grades.forEach(g => {
                gradeSelect.add(new Option(g, g));
            });
            if (!workspaceState.grades.includes(workspaceState.gradelevelFilter)) {
                workspaceState.gradelevelFilter = workspaceState.grades[0] || '';
            }
            gradeSelect.value = workspaceState.gradelevelFilter;
            document.getElementById('gradelevel-day-select').value = workspaceState.gradelevelDayFilter || "mon";
        };

        const handleGradeFilterChange = (val) => {
            workspaceState.gradelevelFilter = val;
            saveState();
            renderAll();
        };

        const handleDayFilterChange = (val) => {
            workspaceState.gradelevelDayFilter = val;
            saveState();
            renderAll();
        };

        const setActiveTab = (tab) => {
            workspaceState.activeTab = tab;
            
            const tabs = ['master-kinder', 'master-g12', 'master', 'gradelevel', 'summary'];
            tabs.forEach(t => {
                const btn = document.getElementById(`tab-${t}`);
                if (!btn) return;
                const matches = t === 'master-kinder' && tab === 'master_kinder' || 
                                t === 'master-g12' && tab === 'master_g12' || 
                                t === tab;
                btn.className = matches 
                    ? 'px-4 py-2 text-xs font-bold rounded-lg border bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                    : 'px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 bg-white text-slate-700';
            });
            
            const filterBar = document.getElementById('gradelevel-selector-bar');
            if (tab === 'gradelevel') {
                filterBar.classList.remove('hidden');
                populateGradelevelFilters();
            } else {
                filterBar.classList.add('hidden');
            }

            const sidebar = document.getElementById('sidebar-container');
            const workspace = document.getElementById('workspace-container');
            const summaryDashboard = document.getElementById('summary-dashboard-container');

            if (sidebar && workspace) {
                if (tab === 'summary') {
                    sidebar.classList.add('hidden', 'xl:hidden');
                    workspace.classList.remove('xl:col-span-5');
                    workspace.classList.add('xl:col-span-6');
                    if (summaryDashboard) {
                        summaryDashboard.classList.remove('hidden');
                        summaryDashboard.classList.add('flex');
                    }
                    summaryFilter = 'all';
                    summarySearchQuery = '';
                    const searchInput = document.getElementById('summary-search-input');
                    if (searchInput) searchInput.value = '';
                    const filters = ['all', 'overload', 'optimal', 'underload'];
                    filters.forEach(f => {
                        const btn = document.getElementById(`sum-filter-${f}`);
                        if (btn) {
                            if (f === 'all') {
                                btn.className = "px-3 py-1.5 text-[11px] font-bold rounded-lg border bg-emerald-600 text-white border-emerald-600 shadow-sm transition";
                            } else {
                                btn.className = "px-3 py-1.5 text-[11px] font-bold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 bg-white transition";
                            }
                        }
                    });
                } else {
                    sidebar.classList.remove('hidden', 'xl:hidden');
                    workspace.classList.remove('xl:col-span-6');
                    workspace.classList.add('xl:col-span-5');
                    if (summaryDashboard) {
                        summaryDashboard.classList.add('hidden');
                        summaryDashboard.classList.remove('flex');
                    }
                }
            }

            // Close active inline time edits
            inlineEditingSlotId = null;

            saveState();
            renderAll();
        };

        const getLiveStatus = (teacherId) => {
            const now = new Date();
            const dayMap = [null, 'mon', 'tue', 'wed', 'thu', 'fri', null];
            const currentDayStr = dayMap[now.getDay()]; 
            
            if (!currentDayStr) return "Available (Weekend)";

            const currentMins = now.getHours() * 60 + now.getMinutes();

            const activeSlot = workspaceState.timeSlots.find(ts => {
                if (ts.type === 'universal') return false; 
                const startMins = timeToMins(ts.start);
                const endMins = timeToMins(ts.end);
                return currentMins >= startMins && currentMins < endMins;
            });

            if (activeSlot) {
                const activeClass = workspaceState.classes.find(c => 
                    c.teacherId === teacherId && 
                    (c.day === currentDayStr || c.day === 'master') && 
                    c.timeSlotId === activeSlot.id
                );
                if (activeClass) {
                    const subject = workspaceState.subjects.find(s => s.id === activeClass.subjectId);
                    const subjName = subject ? subject.name : "Class";
                    const room = activeClass.sectionId ? 
                        (workspaceState.sections.find(s => s.id === activeClass.sectionId)?.name || activeClass.grade) : 
                        activeClass.grade;
                    return `Currently teaching <span class="font-bold text-slate-800">${subjName}</span> for <span class="font-bold text-slate-800">${room}</span>`;
                }
            }
            
            const futureClasses = workspaceState.classes.filter(c => 
                c.teacherId === teacherId && 
                (c.day === currentDayStr || c.day === 'master')
            ).map(c => {
                const ts = workspaceState.timeSlots.find(slot => slot.id === c.timeSlotId);
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

        const updateTimeSlotGroup = (slotId, newGroup) => {
            const slot = workspaceState.timeSlots.find(ts => ts.id === slotId);
            if (slot) {
                slot.group = newGroup;
                saveState();
                renderAll();
                renderResourceLists();
                showToast("Time slot segment group association updated!");
            }
        };

        const setTimeSlotFilter = (filter) => {
            activeTimeSlotFilter = filter;
            const filters = ['all', 'g36', 'g12', 'kinder', 'all_shared'];
            filters.forEach(f => {
                const btn = document.getElementById(`btn-ts-filter-${f}`);
                if (!btn) return;
                if (f === filter) {
                    btn.className = "flex-1 py-1 text-[9px] font-extrabold rounded-lg transition-all bg-white text-slate-800 shadow-xs";
                } else {
                    btn.className = "flex-1 py-1 text-[9px] font-extrabold rounded-lg transition-all text-slate-500 hover:text-slate-800";
                }
            });
            renderResourceLists();
        };

        const toggleTeacherFilter = (id) => {
            if (activeTeacherFilterId === id) {
                activeTeacherFilterId = null;
                expandedTeacherId = null;
            } else {
                activeTeacherFilterId = id;
                expandedTeacherId = id;
                activeSelectedCardId = null; 
            }
            renderAll();
        };

        const toggleRippleCascade = (checked) => {
            workspaceState.rippleCascadeEnabled = checked;
            saveState();
            showToast(checked ? "Domino Ripple Cascading enabled!" : "Domino Ripple Cascading disabled!");
        };

        const renderAutopopulatePanel = () => {
            const container = document.getElementById('faculty-panel-flex');
            const titleEl = document.getElementById('faculty-panel-title');
            const clearBtn = document.getElementById('clear-highlight-btn');

            if (!container) return;

            if (!activeSelectedCardId) {
                titleEl.innerText = "Faculty Directory";
                if (activeTeacherFilterId) {
                    clearBtn.classList.remove('hidden');
                } else {
                    clearBtn.classList.add('hidden');
                }
                
                container.innerHTML = workspaceState.teachers.map(t => {
                    const badgeHex = hexBadgeColor[t.color || 'blue'];
                    const textHex = hexTextColors[t.color || 'blue'];

                    const advisoryGrades = Object.keys(workspaceState.advisers).filter(g => workspaceState.advisers[g] === t.id);
                    const advisoryText = advisoryGrades.length > 0 ? `Adviser: ${advisoryGrades.join(', ')}` : 'None';

                    const isAdviser = advisoryGrades.length > 0;
                    const adviserLoadDaily = isAdviser ? 1.00 : 0.00;

                    const getTeacherLoadHoursForDay = (teacherId, day) => {
                        const mins = workspaceState.classes
                            .filter(c => c.teacherId === teacherId && (c.day === day || c.day === 'master'))
                            .reduce((sum, c) => {
                                const ts = workspaceState.timeSlots.find(slot => slot.id === c.timeSlotId);
                                return sum + (ts ? ts.mins : 0);
                            }, 0);
                        return mins / 60.0;
                    };

                    const activeDay = (workspaceState.activeTab === 'master' || workspaceState.activeTab === 'master_g12' || workspaceState.activeTab === 'master_kinder') ? 'master' : workspaceState.gradelevelDayFilter;
                    const dailyTeachingHours = getTeacherLoadHoursForDay(t.id, activeDay);

                    const weeklyMasterMins = workspaceState.classes
                        .filter(c => c.teacherId === t.id && c.day === 'master')
                        .reduce((sum, c) => {
                            const ts = workspaceState.timeSlots.find(slot => slot.id === c.timeSlotId);
                            return sum + (ts ? ts.mins * 5 : 0);
                        }, 0);

                    const weeklySpecificMins = workspaceState.classes
                        .filter(c => c.teacherId === t.id && c.day !== 'master' && c.day !== 'pool')
                        .reduce((sum, c) => {
                            const ts = workspaceState.timeSlots.find(slot => slot.id === c.timeSlotId);
                            return sum + (ts ? ts.mins : 0);
                        }, 0);
                    
                    const weeklyTeachingHours = (weeklyMasterMins + weeklySpecificMins) / 60.0;

                    const totalDailyLoad = dailyTeachingHours + adviserLoadDaily;
                    const dailyExcess = totalDailyLoad - 6.00;
                    const excessMins = Math.round(dailyExcess * 60);

                    const isSelectedFilter = activeTeacherFilterId === t.id;
                    const highlightClass = isSelectedFilter ? 'card-teacher-highlight ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20' : '';
                    
                    const filterBadge = isSelectedFilter ? `
                        <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 animate-pulse font-semibold">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Filtering
                        </span>
                    ` : '';

                    const chevronClass = isSelectedFilter ? 'transform rotate-180 text-emerald-500' : 'text-slate-400';
                    const expandableContent = isSelectedFilter ? `
                        <div class="grid grid-cols-2 gap-1.5 bg-slate-50/70 p-2 rounded-lg border border-slate-100 text-[10px] text-slate-600 font-semibold transition-all duration-200">
                            <div>
                                <span class="block text-[8px] uppercase font-bold tracking-wider text-slate-400">Advisory</span>
                                <span class="font-bold text-slate-700 truncate block max-w-full" title="${escapeHtml(advisoryText)}">${escapeHtml(advisoryText)}</span>
                            </div>
                            <div>
                                <span class="block text-[8px] uppercase font-bold tracking-wider text-slate-400">Weekly load</span>
                                <span class="font-bold text-slate-700">${weeklyTeachingHours.toFixed(1)} hours</span>
                            </div>
                        </div>

                        <div class="flex items-start gap-1.5 pt-1.5 border-t border-slate-100 text-[11px] text-slate-500 leading-tight transition-all duration-200">
                            <i data-lucide="clock" class="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0"></i>
                            <div class="flex-1">
                                <span class="block text-[8px] uppercase font-bold tracking-wider text-slate-400">Availability Info</span>
                                <div id="live-status-${t.id}" class="text-slate-600 font-bold mt-0.5">${getLiveStatus(t.id)}</div>
                            </div>
                        </div>
                    ` : '';

                    return `
                        <div onclick="toggleTeacherFilter('${t.id}')" class="w-full flex flex-col bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 rounded-xl p-3 shadow-xs hover:shadow-md transition-all duration-200 text-xs gap-1.5 relative cursor-pointer font-semibold ${highlightClass}">
                            <div class="flex items-start justify-between gap-2 min-w-0">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <span class="w-2.5 h-2.5 rounded-full ${badgeHex} shrink-0 shadow-2xs"></span>
                                    <span class="font-extrabold text-slate-950 uppercase tracking-tight break-words text-xs select-none">${escapeHtml(t.name)}</span>
                                </div>
                                <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-250 mt-0.5 ${chevronClass}"></i>
                            </div>

                            <div class="flex items-center gap-1.5 pl-4 ml-0.5">
                                ${filterBadge ? filterBadge : `
                                    <span class="text-[9.5px] font-extrabold px-2 py-0.5 rounded-md border ${
                                        dailyExcess > 0.001 
                                        ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' 
                                        : 'bg-emerald-50 border-emerald-250 text-emerald-700'
                                    }">
                                        ${totalDailyLoad.toFixed(1)}h ${dailyExcess > 0.001 ? `(+${excessMins}m Over)` : 'Optimal'}
                                    </span>
                                `}
                            </div>
                            
                            ${expandableContent}
                        </div>
                    `;
                }).join('');
                lucide.createIcons();
                return;
            }

            const block = workspaceState.classes.find(c => c.id === activeSelectedCardId);
            if (!block) return;

            const subject = workspaceState.subjects.find(s => s.id === block.subjectId) || { name: 'Unknown' };
            titleEl.innerText = `Faculty: ${subject.name}`;
            clearBtn.classList.remove('hidden');

            const dayCode = block.day;
            const slotId = block.timeSlotId;

            const busyTeacherIds = workspaceState.classes
                .filter(c => c.id !== block.id && c.day === dayCode && c.timeSlotId === slotId && c.teacherId)
                .map(c => c.teacherId);

            const experiencedTeacherIds = Array.from(new Set(
                workspaceState.classes
                    .filter(c => c.subjectId === block.subjectId && c.teacherId)
                    .map(c => c.teacherId)
            ));

            let sortedTeachers = [...workspaceState.teachers].sort((a, b) => {
                const aExp = experiencedTeacherIds.includes(a.id) ? 1 : 0;
                const bExp = experiencedTeacherIds.includes(b.id) ? 1 : 0;
                return bExp - aExp; 
            });

            container.innerHTML = sortedTeachers.map(t => {
                const isBusy = busyTeacherIds.includes(t.id);
                const isExperienced = experiencedTeacherIds.includes(t.id);
                
                const badgeHex = hexBadgeColor[t.color || 'blue'];
                const textHex = hexTextColors[t.color || 'blue'];

                if (isBusy) {
                    return `
                        <button disabled class="px-2.5 py-1.5 rounded-xl bg-slate-200 text-slate-400 font-bold text-[11px] border border-dashed border-slate-300 opacity-45 cursor-not-allowed flex items-center gap-1 w-full text-left justify-start" title="Scheduled elsewhere during this time slot">
                            <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                            ${escapeHtml(t.name)} (Busy)
                        </button>
                    `;
                }

                const starIcon = isExperienced ? `<i data-lucide="star" class="w-3 h-3 fill-current shrink-0 text-white"></i>` : '';
                const clickAction = `onclick="assignTeacherQuick('${t.id}')"`;

                return `
                    <button ${clickAction} class="px-2.5 py-2 rounded-xl ${badgeHex} ${textHex} font-bold text-[11px] shadow-xs hover:shadow-sm border border-black/10 active:scale-95 transition-all flex items-center gap-1.5 w-full text-left justify-start">
                        <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0"></span>
                        ${starIcon}
                        <span class="truncate uppercase">${escapeHtml(t.name)}</span>
                    </button>
                `;
            }).join('');

            if (sortedTeachers.length === 0) {
                container.innerHTML = `<span class="text-xs text-slate-400 italic p-1">No teachers found</span>`;
            }

            lucide.createIcons();
        };

        const handleCardHighlightSelect = (id) => {
            if (activeSelectedCardId === id) {
                activeSelectedCardId = null;
            } else {
                activeSelectedCardId = id;
                activeTeacherFilterId = null; 
            }
            renderAll();
        };

        const clearActiveCardFilter = () => {
            activeSelectedCardId = null;
            activeTeacherFilterId = null;
            renderAll();
        };

        const assignTeacherQuick = (teacherId) => {
            if (!activeSelectedCardId) return;
            const block = workspaceState.classes.find(c => c.id === activeSelectedCardId);
            if (block) {
                block.teacherId = teacherId;
                
                const isCollision = checkTeacherCollision(block);
                if (isCollision) {
                    showToast("Warning: Teacher is double-booked on this time slot!", "error");
                } else {
                    showToast("Faculty assigned successfully!");
                }
                saveState();
                activeSelectedCardId = null; 
                renderAll();
            }
        };

        const getActiveTimeSlotsForCurrentView = () => {
            const isMasterKinder = workspaceState.activeTab === 'master_kinder';
            const isMasterG12 = workspaceState.activeTab === 'master_g12';
            const isMasterG36 = workspaceState.activeTab === 'master';
            
            if (isMasterKinder) {
                return workspaceState.timeSlots.filter(ts => ts.group === 'kinder');
            } else if (isMasterG12) {
                return workspaceState.timeSlots.filter(ts => ts.group === 'all' || ts.group === 'g12');
            } else if (isMasterG36) {
                return workspaceState.timeSlots.filter(ts => (ts.group === 'all' || ts.group === 'g36'));
            } else {
                const filterGrade = workspaceState.gradelevelFilter;
                if (filterGrade === "Kindergarten") {
                    return workspaceState.timeSlots.filter(ts => ts.group === 'kinder');
                } else if (filterGrade === "Grade 1" || filterGrade === "Grade 2") {
                    return workspaceState.timeSlots.filter(ts => ts.group === 'all' || ts.group === 'g12');
                } else {
                    return workspaceState.timeSlots.filter(ts => (ts.group === 'all' || ts.group === 'g36'));
                }
            }
        };

        // --- DIRECT INTERACTIVE CELL TIME EDITORS ---
        const startDirectTimeSlotEdit = (slotId) => {
            inlineEditingSlotId = slotId;
            renderAll();
        };

        const saveDirectTimeSlotInline = (slotId) => {
            const startInput = document.getElementById(`inline-start-${slotId}`);
            const endInput = document.getElementById(`inline-end-${slotId}`);
            const groupSelect = document.getElementById(`inline-group-${slotId}`);

            if (!startInput || !endInput) return;

            const start = startInput.value;
            const end = endInput.value;
            const startMins = timeToMins(start);
            const endMins = timeToMins(end);

            if (endMins <= startMins) {
                showToast("End time must be after start time.", "error");
                return;
            }

            const tsObj = workspaceState.timeSlots.find(t => t.id === slotId);
            if (tsObj) {
                tsObj.start = start;
                tsObj.end = end;
                tsObj.mins = endMins - startMins;
                if (groupSelect) {
                    tsObj.group = groupSelect.value;
                }

                // Run Segment Domino Cascading Engine (Proposal 2 & 3)
                if (workspaceState.rippleCascadeEnabled !== false) {
                    const targetGroup = tsObj.group;
                    const sortedSlots = [...workspaceState.timeSlots].sort((a, b) => timeToMins(a.start) - timeToMins(b.start));
                    const editIdx = sortedSlots.findIndex(t => t.id === slotId);
                    
                    let currentEndMins = endMins;
                    for (let i = editIdx + 1; i < sortedSlots.length; i++) {
                        const nextTs = sortedSlots[i];
                        if (nextTs.group === targetGroup || targetGroup === 'all' || nextTs.group === 'all') {
                            const dur = nextTs.mins;
                            const nextStartStr = minsToTime(currentEndMins);
                            const nextEndStr = minsToTime(currentEndMins + dur);
                            
                            const actualTs = workspaceState.timeSlots.find(t => t.id === nextTs.id);
                            if (actualTs) {
                                actualTs.start = nextStartStr;
                                actualTs.end = nextEndStr;
                            }
                            currentEndMins += dur;
                        }
                    }
                }

                inlineEditingSlotId = null;
                saveState();
                renderAll();
                showToast("Timeline slot and subsequent offsets updated dynamically!");
            }
        };

        const cancelDirectTimeSlotInline = () => {
            inlineEditingSlotId = null;
            renderAll();
        };

        const appendFloatingTimeSlotNext = (baseSlotId) => {
            const baseSlot = workspaceState.timeSlots.find(ts => ts.id === baseSlotId);
            if (!baseSlot) return;

            const baseEndMins = timeToMins(baseSlot.end);
            const newDuration = baseSlot.mins || 45;
            const newStartStr = baseSlot.end;
            const newEndStr = minsToTime(baseEndMins + newDuration);

            const newSlot = {
                id: generateId('ts'),
                start: newStartStr,
                end: newEndStr,
                mins: newDuration,
                type: "academic",
                group: baseSlot.group,
                label: ""
            };

            workspaceState.timeSlots.push(newSlot);
            workspaceState.timeSlots.sort((a, b) => timeToMins(a.start) - timeToMins(b.start));

            saveState();
            renderAll();
            showToast("New relative time slot row inserted successfully!");
        };

        const updateDashboardStats = () => {
            const gradeEl = document.getElementById('dash-stat-grades');
            const teacherEl = document.getElementById('dash-stat-teachers');
            const subEl = document.getElementById('dash-stat-subjects');

            if (gradeEl) gradeEl.innerText = workspaceState.grades ? workspaceState.grades.length : 0;
            if (teacherEl) teacherEl.innerText = workspaceState.teachers ? workspaceState.teachers.length : 0;
            if (subEl) subEl.innerText = workspaceState.subjects ? workspaceState.subjects.length : 0;
            // Status remains static 100% per user request
        };

        const renderAll = () => {
            const suspendedAvatars = document.querySelectorAll('#touch-drag-avatar');
            suspendedAvatars.forEach(av => av.remove());

            updateDashboardStats();
            renderPrintDOM();
            renderDynamicHeaders();
            renderAutopopulatePanel(); 
            renderDiagnostics(); 

            const tbody = document.getElementById('matrix-tbody');
            tbody.innerHTML = '';

            if (workspaceState.activeTab === 'summary') {
                renderSummaryView();
                return;
            }

            const isMasterKinder = workspaceState.activeTab === "master_kinder";
            const isMasterG12 = workspaceState.activeTab === "master_g12";
            const isMasterG36 = workspaceState.activeTab === "master";

            const gradeFilter = workspaceState.gradelevelFilter;
            const dayFilter = workspaceState.gradelevelDayFilter;

            const activeSlots = getActiveTimeSlotsForCurrentView();

            activeSlots.forEach(slot => {
                const tr = document.createElement('tr');
                tr.className = slot.type === 'universal' ? 'bg-slate-50/70 border-y border-slate-200' : 'hover:bg-slate-50/40 transition-colors';

                // TIME SLOT CELL: Interactive Inline Editor inside main program matrix
                const tdTime = document.createElement('td');
                tdTime.className = "p-3 border-r border-slate-200 text-center align-middle whitespace-nowrap relative group/slot-cell min-w-[200px] h-24";
                
                if (inlineEditingSlotId === slot.id) {
                    tdTime.innerHTML = `
                        <div class="flex flex-col gap-1.5 p-1 bg-emerald-50 rounded-lg border border-emerald-200 max-w-[190px] mx-auto print:hidden" onclick="event.stopPropagation()">
                            <div class="flex gap-1 items-center">
                                <input type="time" id="inline-start-${slot.id}" value="${slot.start}" class="bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] font-bold text-slate-800 focus:outline-none focus:border-emerald-500 w-full">
                                <span class="text-[10px] font-bold text-slate-400">to</span>
                                <input type="time" id="inline-end-${slot.id}" value="${slot.end}" class="bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] font-bold text-slate-800 focus:outline-none focus:border-emerald-500 w-full">
                            </div>
                            <select id="inline-group-${slot.id}" class="bg-white border border-slate-200 rounded px-1 py-0.5 text-[9px] font-bold text-slate-600 focus:outline-none">
                                <option value="g36" ${slot.group === 'g36' ? 'selected' : ''}>Grades 3-6 (45m)</option>
                                <option value="g12" ${slot.group === 'g12' ? 'selected' : ''}>Grades 1-2 (40m)</option>
                                <option value="kinder" ${slot.group === 'kinder' ? 'selected' : ''}>Kinder</option>
                                <option value="all" ${slot.group === 'all' ? 'selected' : ''}>Shared (All)</option>
                            </select>
                            <div class="flex gap-1 justify-end mt-0.5">
                                <button onclick="cancelDirectTimeSlotInline()" class="px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-500 uppercase">Esc</button>
                                <button onclick="saveDirectTimeSlotInline('${slot.id}')" class="px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white uppercase font-bold">Save</button>
                            </div>
                        </div>
                        <div class="hidden print:block text-slate-700 font-semibold text-xs">
                            ${formatTo12Hour(slot.start)} - ${formatTo12Hour(slot.end)}
                        </div>
                    `;
                } else {
                    tdTime.innerHTML = `
                        <div onclick="startDirectTimeSlotEdit('${slot.id}')" class="cursor-pointer hover:bg-emerald-50 hover:text-emerald-800 px-3 py-2 rounded-xl transition duration-150 inline-block font-bold text-xs text-slate-700 select-none border border-transparent hover:border-emerald-150 relative" title="Click to edit times directly">
                            ${formatTo12Hour(slot.start)} - ${formatTo12Hour(slot.end)}
                        </div>
                        
                        <button onclick="appendFloatingTimeSlotNext('${slot.id}')" class="absolute -bottom-2 right-2 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-md transform scale-0 group-hover/slot-cell:scale-100 active:scale-95 transition-all duration-200 z-30 print:hidden flex items-center justify-center border border-white" title="Add Next Time Slot">
                            <i data-lucide="plus" class="w-3.5 h-3.5 font-extrabold"></i>
                        </button>
                    `;
                }
                tr.appendChild(tdTime);

                // MINS CELL: Dynamically computes duration values based on Start & End configurations
                const tdMins = document.createElement('td');
                tdMins.className = "p-3 text-xs text-slate-500 text-center border-r border-slate-200 align-middle font-bold tracking-wide";
                tdMins.innerText = `${slot.mins}m`;
                tr.appendChild(tdMins);

                if (slot.type === 'universal') {
                    let colCount = 1;
                    if (isMasterKinder) colCount = 1;
                    else if (isMasterG12) colCount = 2;
                    else if (isMasterG36) colCount = 4;
                    else {
                        colCount = workspaceState.sections.filter(sec => sec.grade === gradeFilter).length || 1;
                    }

                    const tdUniversal = document.createElement('td');
                    tdUniversal.colSpan = colCount;
                    tdUniversal.className = "p-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100/50 align-middle font-sans";
                    tdUniversal.innerHTML = `<span class="inline-flex items-center gap-1.5"><i data-lucide="coffee" class="w-3.5 h-3.5 print:hidden"></i> ${slot.label || "SCHOOL INTERVAL"}</span>`;
                    tr.appendChild(tdUniversal);
                } else {
                    if (isMasterKinder) {
                        const tdCell = document.createElement('td');
                        tdCell.className = "p-2 border-r border-slate-200 align-middle h-24 transition-all duration-200";
                        tdCell.dataset.grade = "Kindergarten";
                        tdCell.dataset.slotId = slot.id;

                        const block = workspaceState.classes.find(c => 
                            c.day === 'master' && 
                            c.timeSlotId === slot.id && 
                            c.grade === "Kindergarten"
                        );

                        if (block) {
                            tdCell.appendChild(createDragBlock(block));
                        } else {
                            tdCell.innerHTML = `<div class="w-full h-full min-h-[60px] border border-dashed border-slate-150 rounded-xl hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-center text-[10px] text-slate-350 select-none hover:text-slate-500 font-bold print:border-none print:text-transparent" onclick="openCreateModalAtMaster('Kindergarten', '${slot.id}')">Empty Slot</div>`;
                        }

                        tdCell.addEventListener('dragover', (e) => { e.preventDefault(); tdCell.classList.add('drag-over-active'); });
                        tdCell.addEventListener('dragleave', () => { tdCell.classList.remove('drag-over-active'); });
                        tdCell.addEventListener('drop', (e) => {
                            e.preventDefault();
                            tdCell.classList.remove('drag-over-active');
                            if (draggedBlockId) executeDragMoveMaster(draggedBlockId, "Kindergarten", slot.id);
                        });

                        tr.appendChild(tdCell);
                    } else if (isMasterG12) {
                        const targetGrades = ["Grade 1", "Grade 2"];
                        targetGrades.forEach(grade => {
                            const tdCell = document.createElement('td');
                            tdCell.className = "p-2 border-r border-slate-200 align-middle h-24 transition-all duration-200";
                            tdCell.style.width = `50%`;
                            tdCell.dataset.grade = grade;
                            tdCell.dataset.slotId = slot.id;

                            const block = workspaceState.classes.find(c => 
                                c.day === 'master' && 
                                c.timeSlotId === slot.id && 
                                c.grade === grade
                            );

                            if (block) {
                                tdCell.appendChild(createDragBlock(block));
                            } else {
                                tdCell.innerHTML = `<div class="w-full h-full min-h-[60px] border border-dashed border-slate-150 rounded-xl hover:border-slate-355 transition-colors cursor-pointer flex items-center justify-center text-[10px] text-slate-355 select-none hover:text-slate-555 font-bold print:border-none print:text-transparent" onclick="openCreateModalAtMaster('${grade}', '${slot.id}')">Empty Slot</div>`;
                            }

                            tdCell.addEventListener('dragover', (e) => { e.preventDefault(); tdCell.classList.add('drag-over-active'); });
                            tdCell.addEventListener('dragleave', () => { tdCell.classList.remove('drag-over-active'); });
                            tdCell.addEventListener('drop', (e) => {
                                e.preventDefault();
                                tdCell.classList.remove('drag-over-active');
                                if (draggedBlockId) executeDragMoveMaster(draggedBlockId, grade, slot.id);
                            });

                            tr.appendChild(tdCell);
                        });
                    } else if (isMasterG36) {
                        const targetGrades = ["Grade 3", "Grade 4", "Grade 5", "Grade 6"];
                        targetGrades.forEach(grade => {
                            const tdCell = document.createElement('td');
                            tdCell.className = "p-2 border-r border-slate-200 align-middle h-24 transition-all duration-200";
                            tdCell.style.width = `25%`;
                            tdCell.dataset.grade = grade;
                            tdCell.dataset.slotId = slot.id;

                            const block = workspaceState.classes.find(c => 
                                c.day === 'master' && 
                                c.timeSlotId === slot.id && 
                                c.grade === grade
                            );

                            if (block) {
                                tdCell.appendChild(createDragBlock(block));
                            } else {
                                tdCell.innerHTML = `<div class="w-full h-full min-h-[60px] border border-dashed border-slate-150 rounded-xl hover:border-slate-350 transition-colors cursor-pointer flex items-center justify-center text-[10px] text-slate-350 select-none hover:text-slate-500 font-bold print:border-none print:text-transparent" onclick="openCreateModalAtMaster('${grade}', '${slot.id}')">Empty Slot</div>`;
                            }

                            tdCell.addEventListener('dragover', (e) => { e.preventDefault(); tdCell.classList.add('drag-over-active'); });
                            tdCell.addEventListener('dragleave', () => { tdCell.classList.remove('drag-over-active'); });
                            tdCell.addEventListener('drop', (e) => {
                                e.preventDefault();
                                tdCell.classList.remove('drag-over-active');
                                if (draggedBlockId) executeDragMoveMaster(draggedBlockId, grade, slot.id);
                            });

                            tr.appendChild(tdCell);
                        });
                    } else {
                        const activeSections = workspaceState.sections.filter(sec => sec.grade === gradeFilter);

                        if (activeSections.length === 0) {
                            const tdEmpty = document.createElement('td');
                            tdEmpty.colSpan = 1;
                            tdEmpty.className = "p-4 text-center text-xs text-slate-400 bg-slate-50 italic font-semibold";
                            tdEmpty.innerText = "No Sections configured. Add one in Settings.";
                            tr.appendChild(tdEmpty);
                        } else {
                            activeSections.forEach(section => {
                                const tdCell = document.createElement('td');
                                tdCell.className = "p-2 border-r border-slate-200 align-middle h-24 transition-all duration-200";
                                tdCell.style.width = `${100 / activeSections.length}%`;
                                tdCell.dataset.sectionId = section.id;
                                tdCell.dataset.slotId = slot.id;

                                const block = workspaceState.classes.find(c => 
                                    c.day === dayFilter && 
                                    c.timeSlotId === slot.id && 
                                    c.sectionId === section.id
                                );

                                if (block) {
                                    tdCell.appendChild(createDragBlock(block));
                                } else {
                                    tdCell.innerHTML = `<div class="w-full h-full min-h-[60px] border border-dashed border-slate-150 rounded-xl hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-center text-[10px] text-slate-350 select-none hover:text-slate-500 font-bold print:border-none print:text-transparent" onclick="openCreateModalAtSection('${section.id}', '${slot.id}')">Empty Slot</div>`;
                                }

                                tdCell.addEventListener('dragover', (e) => { e.preventDefault(); tdCell.classList.add('drag-over-active'); });
                                tdCell.addEventListener('dragleave', () => { tdCell.classList.remove('drag-over-active'); });
                                tdCell.addEventListener('drop', (e) => {
                                    e.preventDefault();
                                    tdCell.classList.remove('drag-over-active');
                                    if (draggedBlockId) executeDragMoveSection(draggedBlockId, section.id, slot.id, dayFilter);
                                });

                                tr.appendChild(tdCell);
                            });
                        }
                    }
                }

                tbody.appendChild(tr);
            });

            lucide.createIcons();
        };

        const renderSummaryView = () => {
            const tbody = document.getElementById('matrix-tbody');
            tbody.innerHTML = '';

            let totalFaculty = workspaceState.teachers.length;
            let grandTotalWeeklyTeachingMins = 0;
            let totalOverloadedCount = 0;
            let totalDailyLoadsSum = 0;

            const teacherDataList = workspaceState.teachers.map(t => {
                const advisoryGrades = Object.keys(workspaceState.advisers).filter(g => workspaceState.advisers[g] === t.id);
                
                // Formulate detailed Advisory Room text including sections
                const advisoryText = advisoryGrades.map(g => {
                    const secs = workspaceState.sections.filter(sec => sec.grade === g).map(sec => sec.name);
                    return secs.length > 0 ? `${g} (${secs.join(', ')})` : g;
                }).join(', ') || 'None';

                const isAdviser = advisoryGrades.length > 0;
                const adviserLoadDaily = isAdviser ? 1.00 : 0.00;

                const getTeacherLoadHoursForDay = (teacherId, day) => {
                    const mins = workspaceState.classes
                        .filter(c => c.teacherId === teacherId && (c.day === day || c.day === 'master'))
                        .reduce((sum, c) => {
                            const ts = workspaceState.timeSlots.find(slot => slot.id === c.timeSlotId);
                            return sum + (ts ? ts.mins : 0);
                        }, 0);
                    return mins / 60.0;
                };

                const dailyTeachingHours = getTeacherLoadHoursForDay(t.id, 'master');

                const weeklyMasterMins = workspaceState.classes
                    .filter(c => c.teacherId === t.id && c.day === 'master')
                    .reduce((sum, c) => {
                        const ts = workspaceState.timeSlots.find(slot => slot.id === c.timeSlotId);
                        return sum + (ts ? ts.mins * 5 : 0);
                    }, 0);

                const weeklySpecificMins = workspaceState.classes
                    .filter(c => c.teacherId === t.id && c.day !== 'master' && c.day !== 'pool')
                    .reduce((sum, c) => {
                        const ts = workspaceState.timeSlots.find(slot => slot.id === c.timeSlotId);
                        return sum + (ts ? ts.mins : 0);
                    }, 0);
                
                const weeklyTeachingHours = (weeklyMasterMins + weeklySpecificMins) / 60.0;
                grandTotalWeeklyTeachingMins += (weeklyMasterMins + weeklySpecificMins);

                const totalDailyLoad = dailyTeachingHours + adviserLoadDaily;
                totalDailyLoadsSum += totalDailyLoad;

                if (totalDailyLoad > 6.001) {
                    totalOverloadedCount++;
                }

                let statusType = 'optimal';
                if (totalDailyLoad > 6.001) statusType = 'overload';
                else if (totalDailyLoad < 4.0) statusType = 'underload';

                return {
                    teacher: t,
                    advisoryText,
                    isAdviser,
                    adviserLoadDaily,
                    weeklyTeachingHours,
                    dailyTeachingHours,
                    totalDailyLoad,
                    statusType,
                    advisoryGrades
                };
            });

            // Dynamic chronological sort index: Kinder up to Grade 6, Non-advisory at the bottom
            const getSortWeight = (item) => {
                const gradesOrder = workspaceState.grades || [];
                if (item.advisoryGrades && item.advisoryGrades.length > 0) {
                    let minIndex = Infinity;
                    item.advisoryGrades.forEach(g => {
                        const idx = gradesOrder.indexOf(g);
                        if (idx !== -1 && idx < minIndex) {
                            minIndex = idx;
                        }
                    });
                    return minIndex;
                }
                return Infinity; // Keeps floating supporting instructors consistently at bottom of list
            };

            teacherDataList.sort((a, b) => {
                const weightA = getSortWeight(a);
                const weightB = getSortWeight(b);
                if (weightA !== weightB) {
                    return weightA - weightB;
                }
                return a.teacher.name.localeCompare(b.teacher.name);
            });

            const grandTotalWeeklyTeachingHours = grandTotalWeeklyTeachingMins / 60.0;
            const averageDailyLoad = totalFaculty > 0 ? (totalDailyLoadsSum / totalFaculty) : 0;
            const complianceRate = totalFaculty > 0 ? (((totalFaculty - totalOverloadedCount) / totalFaculty) * 100) : 100;

            const kpiGrid = document.getElementById('summary-kpi-grid');
            if (kpiGrid) {
                kpiGrid.innerHTML = `
                    <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center gap-3.5 hover:shadow-sm transition-all">
                        <span class="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 shadow-2xs">
                            <i data-lucide="users" class="w-4.5 h-4.5"></i>
                        </span>
                        <div>
                            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Instructors</p>
                            <h4 class="text-lg font-extrabold text-slate-900 mt-0.5">${totalFaculty}</h4>
                            <span class="text-[9px] font-semibold text-indigo-500">Active roster members</span>
                        </div>
                    </div>

                    <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center gap-3.5 hover:shadow-sm transition-all">
                        <span class="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-2xs">
                            <i data-lucide="clock" class="w-4.5 h-4.5"></i>
                        </span>
                        <div>
                            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Schedule Volume</p>
                            <h4 class="text-lg font-extrabold text-slate-900 mt-0.5">${grandTotalWeeklyTeachingHours.toFixed(1)} hrs</h4>
                            <span class="text-[9px] font-semibold text-blue-500">Cumulative weekly contact</span>
                        </div>
                    </div>

                    <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center gap-3.5 hover:shadow-sm transition-all">
                        <span class="p-2.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 shadow-2xs">
                            <i data-lucide="trending-up" class="w-4.5 h-4.5"></i>
                        </span>
                        <div>
                            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Avg Workload</p>
                            <h4 class="text-lg font-extrabold text-slate-900 mt-0.5">${averageDailyLoad.toFixed(1)} hrs/day</h4>
                            <span class="text-[9px] font-semibold text-amber-500">Ideal range: 5.0 - 6.0</span>
                        </div>
                    </div>

                    <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center gap-3.5 hover:shadow-sm transition-all">
                        <span class="p-2.5 ${complianceRate >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'} rounded-lg border shadow-2xs">
                            <i data-lucide="${complianceRate >= 80 ? 'shield-check' : 'shield-alert'}" class="w-4.5 h-4.5"></i>
                        </span>
                        <div>
                            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Load Compliance</p>
                            <h4 class="text-lg font-extrabold text-slate-900 mt-0.5">${complianceRate.toFixed(0)}%</h4>
                            <span class="text-[9px] font-semibold ${complianceRate >= 80 ? 'text-emerald-600' : 'text-rose-600'}">
                                ${totalOverloadedCount === 0 ? 'Optimal distributions' : `${totalOverloadedCount} adjust suggested`}
                            </span>
                        </div>
                    </div>
                `;
            }

            const filteredTeachers = teacherDataList.filter(item => {
                if (summaryFilter !== 'all' && item.statusType !== summaryFilter) {
                    return false;
                }
                if (summarySearchQuery) {
                    const nameMatch = item.teacher.name.toLowerCase().includes(summarySearchQuery);
                    const advisoryMatch = item.advisoryText.toLowerCase().includes(summarySearchQuery);
                    return nameMatch || advisoryMatch;
                }
                return true;
            });

            if (filteredTeachers.length === 0) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td colspan="7" class="p-10 text-center text-slate-400 bg-slate-50/50 italic font-semibold">
                        <div class="flex flex-col items-center gap-2 justify-center py-4">
                            <i data-lucide="search" class="w-8 h-8 text-slate-300"></i>
                            <span>No instructors match the active filters.</span>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
                lucide.createIcons();
                return;
            }

            filteredTeachers.forEach(({ teacher, advisoryText, isAdviser, adviserLoadDaily, weeklyTeachingHours, dailyTeachingHours, totalDailyLoad, statusType }) => {
                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-50/70 transition-all border-b border-slate-200 duration-150";

                const badgeHex = hexBadgeColor[teacher.color || 'blue'];
                const dailyExcess = totalDailyLoad - 6.00;
                const excessMins = Math.round(dailyExcess * 60);
                const gaugePercentage = Math.min(100, (totalDailyLoad / 8.0) * 100);

                let barColor = 'bg-emerald-500';
                let bgBarColor = 'bg-emerald-100';
                let badgeText = 'Optimal Load';
                let badgeClasses = 'bg-emerald-50 border-emerald-200 text-emerald-700';

                if (statusType === 'overload') {
                    barColor = 'bg-rose-500';
                    bgBarColor = 'bg-rose-100';
                    badgeText = `Overload (+${excessMins}m)`;
                    badgeClasses = 'bg-rose-50 border-rose-200 text-rose-700 font-bold';
                } else if (statusType === 'underload') {
                    barColor = 'bg-sky-500';
                    bgBarColor = 'bg-sky-100';
                    badgeText = 'Underloaded';
                    badgeClasses = 'bg-sky-50 border-sky-200 text-sky-700';
                }

                const teacherClasses = workspaceState.classes.filter(c => c.teacherId === teacher.id);
                let scheduleBlocksHtml = '';
                if (teacherClasses.length === 0) {
                    scheduleBlocksHtml = '<span class="text-slate-400 italic text-[10px]">No assigned classes</span>';
                } else {
                    scheduleBlocksHtml = `<div class="flex flex-wrap gap-1">`;
                    teacherClasses.forEach(c => {
                        const sub = workspaceState.subjects.find(s => s.id === c.subjectId);
                        const ts = workspaceState.timeSlots.find(slot => slot.id === c.timeSlotId);
                        const subLabel = sub ? sub.name : 'Class';
                        const mins = ts ? ts.mins : 0;
                        const dayLabel = c.day === 'master' ? 'Daily' : c.day.toUpperCase();
                        
                        scheduleBlocksHtml += `
                            <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-50 border border-slate-200 text-slate-700 capitalize flex items-center gap-1 hover:bg-slate-100 transition-colors">
                                <strong>${subLabel}</strong> (${escapeHtml(c.grade)} - ${mins}m, ${dayLabel})
                            </span>
                        `;
                    });
                    scheduleBlocksHtml += `</div>`;
                }

                tr.innerHTML = `
                    <td class="p-3.5 border-r border-slate-200 font-bold text-slate-900 flex items-center gap-2.5 min-w-[200px] h-full align-middle font-semibold">
                        <span class="w-3 h-3 rounded-full ${badgeHex} shrink-0 shadow-2xs"></span>
                        <div class="truncate">
                            <span class="block uppercase text-xs truncate leading-snug">${escapeHtml(teacher.name)}</span>
                            ${isAdviser ? `<span class="text-[9.5px] px-1 bg-amber-100 text-amber-800 rounded font-bold uppercase block mt-0.5 tracking-wider w-max">Adviser</span>` : ''}
                        </div>
                    </td>
                    <td class="p-3.5 border-r border-slate-200 text-xs font-semibold text-slate-700 text-center align-middle whitespace-nowrap">${escapeHtml(advisoryText)}</td>
                    <td class="p-3.5 border-r border-slate-200 align-middle max-w-[340px]">${scheduleBlocksHtml}</td>
                    <td class="p-3.5 border-r border-slate-200 align-middle w-[160px] print:hidden">
                        <div class="flex flex-col gap-1">
                            <div class="flex justify-between items-center text-[9px] font-bold text-slate-500">
                                <span>${totalDailyLoad.toFixed(1)} hrs/day</span>
                                <span>${gaugePercentage.toFixed(0)}%</span>
                            </div>
                            <div class="w-full h-2.5 ${bgBarColor} rounded-full overflow-hidden relative border border-slate-100">
                                <div class="h-full ${barColor} transition-all duration-300" style="width: ${gaugePercentage}%"></div>
                                <div class="absolute left-[75%] top-0 bottom-0 w-0.5 bg-black/15" title="Optimal limit line (6 hours)"></div>
                            </div>
                        </div>
                    </td>
                    <td class="p-3.5 border-r border-slate-200 text-xs text-slate-800 font-bold text-center align-middle whitespace-nowrap">${weeklyTeachingHours.toFixed(1)} hrs</td>
                    <td class="p-3.5 border-r border-slate-200 text-xs text-slate-500 font-semibold text-center align-middle whitespace-nowrap">${adviserLoadDaily.toFixed(1)} hrs</td>
                    <td class="p-3.5 text-center align-middle">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${badgeClasses} uppercase block mx-auto w-max shadow-2xs">
                            ${badgeText}
                        </span>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            lucide.createIcons();
        };

        const setSummaryFilter = (filter) => {
            summaryFilter = filter;
            const filters = ['all', 'overload', 'optimal', 'underload'];
            filters.forEach(f => {
                const btn = document.getElementById(`sum-filter-${f}`);
                if (!btn) return;
                if (f === filter) {
                    btn.className = "px-3 py-1.5 text-[11px] font-bold rounded-lg border bg-emerald-600 text-white border-emerald-600 shadow-sm transition";
                } else {
                    btn.className = "px-3 py-1.5 text-[11px] font-bold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 bg-white transition";
                }
            });
            renderAll();
        };

        const handleSummarySearch = (val) => {
            summarySearchQuery = val.trim().toLowerCase();
            renderAll();
        };

        const renderDynamicHeaders = () => {
            const thead = document.getElementById('matrix-thead');
            thead.innerHTML = '';
            
            const tr = document.createElement('tr');
            tr.className = "bg-slate-100 text-slate-700 text-xs font-extrabold uppercase tracking-wider border-b border-slate-200";
            
            if (workspaceState.activeTab === 'summary') {
                tr.innerHTML = `
                    <th class="p-3 border-r border-slate-200 text-left font-bold w-1/4">Faculty Member</th>
                    <th class="p-3 border-r border-slate-200 text-center font-bold w-1/12">Advisory Room</th>
                    <th class="p-3 border-r border-slate-200 text-left font-bold w-1/3">Scheduled Subject Blocks</th>
                    <th class="p-3 border-r border-slate-200 text-center font-bold w-1/12 print:hidden">Workload Gauge</th>
                    <th class="p-3 border-r border-slate-200 text-center font-bold w-1/12">Weekly Teaching</th>
                    <th class="p-3 border-r border-slate-200 text-center font-bold w-1/12">Advisory Credit</th>
                    <th class="p-3 text-center font-bold w-1/12">Compliance Status</th>
                `;
            } else {
                tr.innerHTML = `
                    <th class="p-3 w-44 border-r border-slate-200 text-center font-bold">Time Slot</th>
                    <th class="p-3 w-20 border-r border-slate-200 text-center font-bold">Mins</th>
                `;

                if (workspaceState.activeTab === 'master_kinder') {
                    const th = document.createElement('th');
                    th.className = "p-3 border-r border-slate-200 text-center font-bold";
                    th.style.width = `100%`;
                    const adviserId = workspaceState.advisers["Kindergarten"];
                    const adviserTeacher = workspaceState.teachers.find(t => t.id === adviserId);
                    const adviserName = adviserTeacher ? adviserTeacher.name : "Unassigned";
                    th.innerHTML = `
                        Kindergarten (Rotational Matrix)
                        <div class="text-[10px] font-normal text-slate-500 capitalize print:font-serif print:text-black font-semibold font-semibold">Adviser: ${escapeHtml(adviserName)}</div>
                    `;
                    tr.appendChild(th);
                } else if (workspaceState.activeTab === 'master_g12') {
                    const targetGrades = ["Grade 1", "Grade 2"];
                    targetGrades.forEach(grade => {
                        const adviserId = workspaceState.advisers[grade];
                        const adviserTeacher = workspaceState.teachers.find(t => t.id === adviserId);
                        const adviserName = adviserTeacher ? adviserTeacher.name : "Unassigned";

                        const th = document.createElement('th');
                        th.className = "p-3 border-r border-slate-200 text-center font-bold";
                        th.style.width = `50%`;
                        th.innerHTML = `
                            ${escapeHtml(grade)}
                            <div class="text-[10px] font-normal text-slate-500 capitalize print:font-serif print:text-black font-semibold">Adviser: ${escapeHtml(adviserName)}</div>
                        `;
                        tr.appendChild(th);
                    });
                } else if (workspaceState.activeTab === 'master') {
                    const targetGrades = ["Grade 3", "Grade 4", "Grade 5", "Grade 6"];
                    targetGrades.forEach(grade => {
                        const adviserId = workspaceState.advisers[grade];
                        const adviserTeacher = workspaceState.teachers.find(t => t.id === adviserId);
                        const adviserName = adviserTeacher ? adviserTeacher.name : "Unassigned";

                        const th = document.createElement('th');
                        th.className = "p-3 border-r border-slate-200 text-center font-bold";
                        th.style.width = `25%`;
                        th.innerHTML = `
                            ${escapeHtml(grade)}
                            <div class="text-[10px] font-normal text-slate-500 capitalize print:font-serif print:text-black font-semibold">Adviser: ${escapeHtml(adviserName)}</div>
                        `;
                        tr.appendChild(th);
                    });
                } else {
                    const activeSections = workspaceState.sections.filter(sec => sec.grade === workspaceState.gradelevelFilter);
                    if (activeSections.length === 0) {
                        const th = document.createElement('th');
                        th.className = "p-3 text-center text-slate-400 italic font-bold text-xs";
                        th.innerText = "No active sections";
                        tr.appendChild(th);
                    } else {
                        activeSections.forEach(sec => {
                            const th = document.createElement('th');
                            th.className = "p-3 border-r border-slate-200 text-center text-xs uppercase font-bold";
                            th.style.width = `${100 / activeSections.length}%`;
                            tr.appendChild(th);
                        });
                    }
                }
            }
            thead.appendChild(tr);
        };

        const createDragBlock = (block) => {
            const subject = workspaceState.subjects.find(s => s.id === block.subjectId) || { name: 'Unknown' };
            const teacher = workspaceState.teachers.find(t => t.id === block.teacherId) || { name: 'Unknown', color: 'blue' };
            const colors = teacherColors[teacher.color || 'blue'] || teacherColors['blue'];
            
            const isCollision = checkTeacherCollision(block);
            const isDuplicate = checkDuplicateSubject(block);

            const ts = workspaceState.timeSlots.find(slot => slot.id === block.timeSlotId);
            const durationMins = ts ? ts.mins : 0;

            const el = document.createElement('div');
            el.id = block.id;
            el.draggable = true;

            let activeHighlightClass = '';
            let opacityDimClass = '';

            if (activeTeacherFilterId) {
                if (block.teacherId === activeTeacherFilterId) {
                    activeHighlightClass = 'card-active-highlight ring-4 ring-emerald-500 shadow-xl scale-[1.02] z-10';
                } else {
                    opacityDimClass = 'opacity-25 scale-95 grayscale-[30%] pointer-events-none transition-all duration-300';
                }
            } else if (activeSelectedCardId === block.id) {
                activeHighlightClass = 'card-active-highlight';
            }
            
            el.className = `p-2.5 rounded-lg border-2 ${colors.border} ${colors.bg} cursor-grab relative group shadow-xs transition hover:shadow bg-white print-card ${activeHighlightClass} ${opacityDimClass}`;
            
            let alertHtml = '';
            if (isCollision) {
                el.classList.add('border-red-500', 'bg-red-50');
                alertHtml += `<div class="text-[9px] text-red-600 font-bold flex items-center gap-1 mt-1 leading-tight print:hidden"><i data-lucide="alert-triangle" class="w-3 h-3 text-red-500 shrink-0"></i> Teacher Overlapped</div>`;
            }
            if (isDuplicate) {
                el.classList.add('border-rose-500', 'bg-rose-50');
                alertHtml += `<div class="text-[9px] text-rose-600 font-bold flex items-center gap-1 mt-0.5 leading-tight print:hidden"><i data-lucide="alert-triangle" class="w-3 h-3 text-rose-500 shrink-0"></i> Duplicate Subject</div>`;
            }

            let badgeText = block.grade;
            if (block.sectionId) {
                const sectionObj = workspaceState.sections.find(s => s.id === block.sectionId);
                if (sectionObj) {
                    badgeText = sectionObj.name;
                }
            }
            
            let gradeRomSuffix = (workspaceState.activeTab === 'master' || workspaceState.activeTab === 'master_g12') ? block.grade.replace('Grade ', '') : '';

            el.innerHTML = `
                <div class="flex justify-between items-start mb-0.5 gap-1.5 font-sans print:flex-col print:items-center print:w-full print:mb-0">
                    <div class="flex flex-col items-start print:items-center">
                        <span class="font-extrabold text-[12px] ${colors.text} leading-tight print-card-title text-center">
                            ${escapeHtml(subject.name)} <span class="hidden print:inline">${gradeRomSuffix}</span>
                        </span>
                        <span class="text-[9px] font-bold text-slate-400 mt-0.5">${durationMins}m duration</span>
                    </div>
                    <span class="text-[8px] px-1 py-0.2 rounded font-extrabold ${colors.badge} tracking-wider shrink-0 uppercase print:hidden">${escapeHtml(badgeText)}</span>
                </div>
                <div class="text-[10px] font-bold text-slate-700 flex items-center justify-start print:justify-center gap-1 leading-none mt-1 print-card-subtitle print:mt-0">
                     <i data-lucide="user" class="w-3.5 h-3.5 text-slate-500 opacity-80 shrink-0 print:hidden"></i> 
                     <span class="text-center truncate">${escapeHtml(teacher.name)}</span>
                </div>
                ${alertHtml}
                
                <div class="absolute top-1 right-1 hidden group-hover:flex gap-0.5 bg-white/95 backdrop-blur-xs rounded border border-slate-200 p-0.5 shadow-md print:hidden">
                    <button type="button" onclick="openPopover('${block.id}')" class="p-0.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded font-bold" title="Quick Move"><i data-lucide="arrow-right-left" class="w-3.5 h-3.5 font-bold"></i></button>
                    <button type="button" onclick="openEditModal('${block.id}')" class="p-0.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded font-bold" title="Edit"><i data-lucide="edit-2" class="w-3.5 h-3.5 font-bold"></i></button>
                    <button type="button" onclick="deleteBlock('${block.id}')" class="p-0.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded font-bold" title="Delete"><i data-lucide="trash" class="w-3.5 h-3.5 font-bold"></i></button>
                </div>
            `;

            el.onclick = (e) => {
                if (e.target.closest('button')) return; 
                handleCardHighlightSelect(block.id);
            };

            el.addEventListener('dragstart', (e) => {
                draggedBlockId = block.id;
                e.dataTransfer.effectAllowed = 'move';
                setTimeout(() => el.classList.add('dragging'), 0);
            });
            
            el.addEventListener('dragend', () => {
                el.classList.remove('dragging');
                document.querySelectorAll('.drag-over-active').forEach(c => c.classList.remove('drag-over-active'));
            });

            setupTouchListeners(el, block.id);
            return el;
        };

        const openResourceModal = () => {
            setResourceTab('school');
            document.getElementById('resource-modal').style.display = 'flex';
        };

        const closeResourceModal = () => {
            document.getElementById('resource-modal').style.display = 'none';
        };

        const openCreateModal = () => {
            if (workspaceState.grades.length === 0) {
                showToast("Please add at least one Grade level in Settings first.", "error");
                return;
            }
            populateSelects('create');
            
            const isKinder = workspaceState.activeTab === 'master_kinder';
            const isG12 = workspaceState.activeTab === 'master_g12';
            let targetDay = (workspaceState.activeTab === 'master' || workspaceState.activeTab === 'master_g12' || workspaceState.activeTab === 'master_kinder') ? 'master' : workspaceState.gradelevelDayFilter;
            
            let targetGrade = "Grade 4";
            if (isKinder) targetGrade = "Kindergarten";
            else if (isG12) targetGrade = "Grade 1";
            else if (workspaceState.activeTab === 'gradelevel') targetGrade = workspaceState.gradelevelFilter;

            let targetSection = "";
            if (targetDay !== 'master') {
                const availableSections = workspaceState.sections.filter(s => s.grade === targetGrade);
                if (availableSections.length > 0) targetSection = availableSections[0].id;
            }

            const activeSlots = getActiveTimeSlotsForCurrentView();
            const targetTimeSlot = activeSlots.length > 0 ? activeSlots[0].id : "";

            setupCreateModalValues(targetDay, targetGrade, targetSection, targetTimeSlot);
            document.getElementById('create-modal').style.display = 'flex';
        };

        const openCreateModalAtMaster = (grade, slotId) => {
            populateSelects('create');
            setupCreateModalValues('master', grade, '', slotId);
            document.getElementById('create-modal').style.display = 'flex';
        };

        const openCreateModalAtSection = (sectionId, slotId) => {
            populateSelects('create');
            const dayFilter = workspaceState.gradelevelDayFilter;
            const sec = workspaceState.sections.find(s => s.id === sectionId);
            const grade = sec ? sec.grade : workspaceState.gradelevelFilter;
            setupCreateModalValues(dayFilter, grade, sectionId, slotId);
            document.getElementById('create-modal').style.display = 'flex';
        };

        const setupCreateModalValues = (day, grade, sectionId, slotId) => {
            document.getElementById('create-day-hidden').value = day;
            document.getElementById('create-grade-hidden').value = grade;
            document.getElementById('create-section-hidden').value = sectionId;
            document.getElementById('create-timeslot-hidden').value = slotId;

            const infoBox = document.getElementById('create-target-info');
            const slotObj = workspaceState.timeSlots.find(s => s.id === slotId);
            const slotText = slotObj ? `${formatTo12Hour(slotObj.start)} - ${formatTo12Hour(slotObj.end)}` : 'Auto Slot';
            const dayText = day === 'master' ? 'Master Schedule' : day.toUpperCase();
            
            let locationText = grade;
            if (sectionId) {
                const secObj = workspaceState.sections.find(s => s.id === sectionId);
                if (secObj) locationText = `${grade} (Section ${secObj.name})`;
            }

            infoBox.innerHTML = `
                <i data-lucide="info" class="w-4 h-4 text-emerald-600 shrink-0"></i>
                <div>
                    Target Locked: <strong>${locationText}</strong> &bull; <strong>${dayText}</strong> &bull; <strong>${slotText}</strong>
                </div>
            `;
            lucide.createIcons();
        };

        const closeCreateModal = () => {
            document.getElementById('create-form').reset();
            document.getElementById('create-modal').style.display = 'none';
        };

        const openEditModal = (id) => {
            const block = workspaceState.classes.find(c => c.id === id);
            if (!block) return;

            populateSelects('edit');
            document.getElementById('edit-class-id').value = block.id;
            document.getElementById('edit-subject-select').value = block.subjectId;
            document.getElementById('edit-teacher-select').value = block.teacherId;
            document.getElementById('edit-timeslot-select').value = block.timeSlotId;

            document.getElementById('edit-modal').style.display = 'flex';
        };

        const closeEditModal = () => {
            document.getElementById('edit-form').reset();
            document.getElementById('edit-modal').style.display = 'none';
        };

        const openPopover = (id) => {
            activeQuickMoveId = id;
            const btnContainer = document.getElementById('quick-move-buttons');
            if (!btnContainer) return;
            btnContainer.innerHTML = '';

            const block = workspaceState.classes.find(c => c.id === id);
            if (!block) return;

            const isMasterKinder = workspaceState.activeTab === 'master_kinder';
            const isMasterG12 = workspaceState.activeTab === 'master_g12';
            const isMasterG36 = workspaceState.activeTab === 'master';

            const activeSlots = getActiveTimeSlotsForCurrentView();

            if (isMasterKinder) {
                activeSlots.forEach(slot => {
                    if (slot.type === 'universal') return;
                    const btn = document.createElement('button');
                    btn.className = "text-left py-2 px-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 rounded-lg text-[11px] font-medium transition flex justify-between";
                    btn.innerHTML = `<span>${formatTo12Hour(slot.start)} (Kinder)</span> <span class="text-[9px] text-slate-400 font-bold">Move</span>`;
                    btn.onclick = () => {
                        executeDragMoveMaster(activeQuickMoveId, "Kindergarten", slot.id);
                        closePopover();
                    };
                    btnContainer.appendChild(btn);
                });
            } else if (isMasterG12) {
                const targetGrades = ["Grade 1", "Grade 2"];
                activeSlots.forEach(slot => {
                    if (slot.type === 'universal') return;
                    targetGrades.forEach(g => {
                        const btn = document.createElement('button');
                        btn.className = "text-left py-2 px-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 rounded-lg text-[11px] font-medium transition flex justify-between";
                        btn.innerHTML = `<span>${formatTo12Hour(slot.start)} (${g})</span> <span class="text-[9px] text-slate-400 font-bold">Move</span>`;
                        btn.onclick = () => {
                            executeDragMoveMaster(activeQuickMoveId, g, slot.id);
                            closePopover();
                        };
                        btnContainer.appendChild(btn);
                    });
                });
            } else if (isMasterG36) {
                const targetGrades = ["Grade 3", "Grade 4", "Grade 5", "Grade 6"];
                activeSlots.forEach(slot => {
                    if (slot.type === 'universal') return;
                    targetGrades.forEach(g => {
                        const btn = document.createElement('button');
                        btn.className = "text-left py-2 px-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 rounded-lg text-[11px] font-medium transition flex justify-between";
                        btn.innerHTML = `<span>${formatTo12Hour(slot.start)} (${g})</span> <span class="text-[9px] text-slate-400 font-bold">Move</span>`;
                        btn.onclick = () => {
                            executeDragMoveMaster(activeQuickMoveId, g, slot.id);
                            closePopover();
                        };
                        btnContainer.appendChild(btn);
                    });
                });
            } else {
                const activeSections = workspaceState.sections.filter(sec => sec.grade === workspaceState.gradelevelFilter);
                activeSlots.forEach(slot => {
                    if (slot.type === 'universal') return;
                    activeSections.forEach(sec => {
                        const btn = document.createElement('button');
                        btn.className = "text-left py-2 px-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 rounded-lg text-[11px] font-medium transition flex justify-between font-semibold";
                        btn.innerHTML = `<span>${formatTo12Hour(slot.start)} (${sec.name})</span> <span class="text-[9px] text-slate-400 font-bold">Move</span>`;
                        btn.onclick = () => {
                            executeDragMoveSection(activeQuickMoveId, sec.id, slot.id, workspaceState.gradelevelDayFilter);
                            closePopover();
                        };
                        btnContainer.appendChild(btn);
                    });
                });
            }

            document.getElementById('quick-move-popover').style.display = 'flex';
            lucide.createIcons();
        };

        const closePopover = () => {
            activeQuickMoveId = null;
            document.getElementById('quick-move-popover').style.display = 'none';
        };

        const populateSelects = (prefix) => {
            const subSel = document.getElementById(`${prefix}-subject-select`);
            const teachSel = document.getElementById(`${prefix}-teacher-select`);

            if (!subSel || !teachSel) return;

            subSel.innerHTML = ''; teachSel.innerHTML = ''; 

            workspaceState.subjects.forEach(s => subSel.add(new Option(s.name, s.id)));
            workspaceState.teachers.forEach(t => teachSel.add(new Option(t.name, t.id)));
            
            if (prefix === 'edit') {
                const slotSel = document.getElementById(`edit-timeslot-select`);
                if (slotSel) {
                    slotSel.innerHTML = '';
                    const activeSlots = getActiveTimeSlotsForCurrentView();
                    activeSlots.forEach(slot => {
                        if(slot.type === 'universal') return;
                        const label = `${formatTo12Hour(slot.start)} - ${formatTo12Hour(slot.end)} (${slot.mins} mins)`;
                        slotSel.add(new Option(label, slot.id));
                    });
                }
            }
        };

        const setupTouchListeners = (el, blockId) => {
            let touchClone = null;
            let lastTargetCell = null;

            el.addEventListener('touchstart', (e) => {
                if (e.touches.length > 1) return;
                
                e.preventDefault();
                
                draggedBlockId = blockId;
                const touch = e.touches[0];
                el.classList.add('dragging');

                touchClone = el.cloneNode(true);
                touchClone.id = 'touch-drag-avatar';
                touchClone.style.position = 'fixed';
                touchClone.style.width = el.offsetWidth + 'px';
                touchClone.style.height = el.offsetHeight + 'px';
                touchClone.style.pointerEvents = 'none';
                touchClone.style.opacity = '0.85';
                touchClone.style.zIndex = '1000';
                touchClone.style.left = (touch.clientX - el.offsetWidth / 2) + 'px';
                touchClone.style.top = (touch.clientY - el.offsetHeight / 2) + 'px';
                document.body.appendChild(touchClone);

                currentPointerY = touch.clientY;
                startAutoScroll();

                const onTouchMove = (moveEvent) => {
                    if (!touchClone) return;
                    if (moveEvent.cancelable) moveEvent.preventDefault();

                    const t = moveEvent.touches[0];
                    touchClone.style.left = (t.clientX - touchClone.offsetWidth / 2) + 'px';
                    touchClone.style.top = (t.clientY - touchClone.offsetHeight / 2) + 'px';

                    currentPointerY = t.clientY;

                    const elementUnder = document.elementFromPoint(t.clientX, t.clientY);
                    if (!elementUnder) return;

                    const targetCell = elementUnder.closest('td[data-grade], td[data-section-id]');

                    if (lastTargetCell && lastTargetCell !== targetCell) {
                        lastTargetCell.classList.remove('drag-over-active');
                    }

                    if (targetCell) {
                        targetCell.classList.add('drag-over-active');
                        lastTargetCell = targetCell;
                    } else {
                        lastTargetCell = null;
                    }
                };

                const onTouchEnd = () => {
                    el.classList.remove('dragging');
                    if (touchClone) {
                        touchClone.remove();
                        touchClone = null;
                    }

                    stopAutoScroll();

                    if (lastTargetCell) {
                        lastTargetCell.classList.remove('drag-over-active');
                        const slotId = lastTargetCell.dataset.slotId;
                        const grade = lastTargetCell.dataset.grade;
                        const sectionId = lastTargetCell.dataset.sectionId;

                        if (workspaceState.activeTab.startsWith('master') && grade && slotId) {
                            executeDragMoveMaster(draggedBlockId, grade, slotId);
                        } else if (workspaceState.activeTab === 'gradelevel' && sectionId && slotId) {
                            executeDragMoveSection(draggedBlockId, sectionId, slotId, workspaceState.gradelevelDayFilter);
                        }
                        lastTargetCell = null;
                    }
                    draggedBlockId = null;

                    document.removeEventListener('touchmove', onTouchMove);
                    document.removeEventListener('touchend', onTouchEnd);
                    document.removeEventListener('touchcancel', onTouchEnd);
                };

                document.addEventListener('touchmove', onTouchMove, { passive: false });
                document.addEventListener('touchend', onTouchEnd, { passive: false });
                document.addEventListener('touchcancel', onTouchEnd, { passive: false });

            }, { passive: false });

            el.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
        };

        const executeDragMoveMaster = (blockId, grade, slotId) => {
            const block = workspaceState.classes.find(c => c.id === blockId);
            if (block) {
                const displaced = workspaceState.classes.find(c => 
                    c.id !== blockId && 
                    c.day === 'master' && 
                    c.timeSlotId === slotId && 
                    c.grade === grade
                );
                if (displaced) {
                    workspaceState.classes = workspaceState.classes.filter(c => c.id !== displaced.id);
                    showToast(`Displaced block was removed`);
                }

                block.grade = grade;
                block.sectionId = ''; 
                block.timeSlotId = slotId;
                block.day = 'master';
                saveState();
                renderAll();
                showToast("Schedule updated!");
            }
            draggedBlockId = null;
        };

        const executeDragMoveSection = (blockId, sectionId, slotId, dayFilter) => {
            const block = workspaceState.classes.find(c => c.id === blockId);
            const targetSection = workspaceState.sections.find(s => s.id === sectionId);
            if (block && targetSection) {
                const displaced = workspaceState.classes.find(c => 
                    c.id !== blockId && 
                    c.day === dayFilter && 
                    c.timeSlotId === slotId && 
                    c.sectionId === sectionId
                );
                if (displaced) {
                    workspaceState.classes = workspaceState.classes.filter(c => c.id !== displaced.id);
                    showToast(`Displaced block was removed`);
                }

                block.grade = targetSection.grade;
                block.sectionId = sectionId;
                block.timeSlotId = slotId;
                block.day = dayFilter;
                saveState();
                renderAll();
                showToast("Schedule updated!");
            }
            draggedBlockId = null;
        };

        const exportData = () => {
            try {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workspaceState, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", "school_program_matrix_backup.json");
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                showToast("Class program backup downloaded.");
            } catch (err) {
                showToast("Unable to export data locally.", "error");
            }
        };

        const triggerImport = () => {
            document.getElementById('import-file-input').click();
        };

        const handleImport = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedState = JSON.parse(event.target.result);
                    if (importedState.subjects && importedState.teachers) {
                        workspaceState = migrateLegacyData(importedState);
                        saveState();
                        setActiveTab(workspaceState.activeTab);
                        showToast("Class Program backup imported!");
                    } else {
                        showToast("Invalid backup file format.", "error");
                    }
                } catch (err) {
                    showToast("Failed to read the backup data.", "error");
                }
            };
            reader.readAsText(file);
            e.target.value = '';
        };

        const handleCreateClass = (e) => {
            e.preventDefault();
            const subjectId = document.getElementById('create-subject-select').value;
            const day = document.getElementById('create-day-hidden').value;
            const teacherId = document.getElementById('create-teacher-select').value;
            const timeSlotId = document.getElementById('create-timeslot-hidden').value;
            const grade = document.getElementById('create-grade-hidden').value;
            const sectionId = document.getElementById('create-section-hidden').value;

            if (timeSlotId) {
                const displaced = workspaceState.classes.find(c => {
                    if (day === 'master') {
                        return c.day === 'master' && c.timeSlotId === timeSlotId && c.grade === grade;
                    } else {
                        return c.day === day && c.timeSlotId === timeSlotId && c.sectionId === sectionId;
                    }
                });
                if (displaced) {
                    workspaceState.classes = workspaceState.classes.filter(c => c.id !== displaced.id);
                    showToast(`Displaced block was removed`);
                }
            }

            const newBlock = { id: generateId('c'), subjectId, grade, sectionId, teacherId, timeSlotId, day };
            workspaceState.classes.push(newBlock);
            
            saveState();
            closeCreateModal();
            renderAll();
            showToast("Matrix class block created!");
        };

        const handleSaveEdit = (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-class-id').value;
            const block = workspaceState.classes.find(c => c.id === id);
            
            if (block) {
                const newSlot = document.getElementById('edit-timeslot-select').value;
                const newTeacher = document.getElementById('edit-teacher-select').value;
                const newSubject = document.getElementById('edit-subject-select').value;

                if (newSlot) {
                    const displaced = workspaceState.classes.find(c => 
                        c.id !== block.id && 
                        c.day === block.day && 
                        c.timeSlotId === newSlot && 
                        (block.day === 'master' ? c.grade === block.grade : c.sectionId === block.sectionId)
                    );
                    if (displaced) {
                        workspaceState.classes = workspaceState.classes.filter(c => c.id !== displaced.id);
                    }
                }

                block.subjectId = newSubject;
                block.teacherId = newTeacher;
                block.timeSlotId = newSlot;

                saveState();
                closeEditModal();
                renderAll();
                showToast("Block program details saved.");
            }
        };

        const deleteBlock = (id) => {
            showConfirm("Delete Schedule Block", "Are you sure you want to remove this academic block?", () => {
                workspaceState.classes = workspaceState.classes.filter(c => c.id !== id);
                saveState();
                renderAll();
                showToast("Schedule block deleted.");
            });
        };

        const setResourceTab = (tab) => {
            activeResourceTab = tab;
            ['school', 'teachers', 'subjects', 'timeslots', 'grades', 'sections', 'cloud'].forEach(t => {
                const btn = document.getElementById(`res-tab-${t}`);
                const sec = document.getElementById(`res-sec-${t}`);
                if (t === tab) {
                    btn.className = "px-3 py-1.5 text-xs font-bold rounded-lg border transition-all bg-emerald-600 text-white border-emerald-600 font-semibold";
                    sec.classList.remove('hidden');
                } else {
                    btn.className = "px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 bg-white text-slate-700 font-semibold";
                    sec.classList.add('hidden');
                }
            });
            if (tab === 'school') {
                document.getElementById('cfg-region').value = workspaceState.schoolConfig.region;
                document.getElementById('cfg-division').value = workspaceState.schoolConfig.division;
                document.getElementById('cfg-district').value = workspaceState.schoolConfig.district;
                document.getElementById('cfg-schoolName').value = workspaceState.schoolConfig.schoolName;
                document.getElementById('cfg-schoolAddress').value = workspaceState.schoolConfig.schoolAddress;
                document.getElementById('cfg-sy').value = workspaceState.schoolConfig.schoolYear;
                document.getElementById('cfg-sig1-name').value = workspaceState.schoolConfig.signatory1Name;
                document.getElementById('cfg-sig1-title').value = workspaceState.schoolConfig.signatory1Title;
                document.getElementById('cfg-sig2-name').value = workspaceState.schoolConfig.signatory2Name;
                document.getElementById('cfg-sig2-title').value = workspaceState.schoolConfig.signatory2Title;
            }
            if (tab === 'timeslots') {
                document.getElementById('cfg-ripple-cascade').checked = workspaceState.rippleCascadeEnabled !== false;
            }
            renderResourceLists();
        };

        const toggleSlotLabelInput = (type) => {
            const container = document.getElementById('slot-label-container');
            if (type === 'universal') {
                container.classList.remove('hidden');
                document.getElementById('slot-label-input').required = true;
            } else {
                container.classList.add('hidden');
                document.getElementById('slot-label-input').required = false;
            }
        };

        const handleCreateTimeSlot = (e) => {
            e.preventDefault();
            const start = document.getElementById('slot-start-input').value;
            const end = document.getElementById('slot-end-input').value;
            const group = document.getElementById('slot-group-input').value;
            const type = document.getElementById('slot-type-input').value;
            const label = document.getElementById('slot-label-input').value.trim().toUpperCase();

            const startMins = timeToMins(start);
            const endMins = timeToMins(end);

            if (endMins <= startMins) {
                showToast("End time must be set chronologically after start time.", "error");
                return;
            }

            const mins = endMins - startMins;
            const newSlot = {
                id: generateId('ts'),
                start,
                end,
                mins,
                type,
                group,
                label: type === 'universal' ? label : ''
            };

            workspaceState.timeSlots.push(newSlot);
            saveState();
            renderResourceLists();
            renderAll();
            
            document.getElementById('slot-start-input').value = '';
            document.getElementById('slot-end-input').value = '';
            document.getElementById('slot-label-input').value = '';
            showToast("New Time Slot row added.");
        };

        const moveTimeSlotUp = (index) => {
            if (index <= 0) return;
            const temp = workspaceState.timeSlots[index];
            workspaceState.timeSlots[index] = workspaceState.timeSlots[index - 1];
            workspaceState.timeSlots[index - 1] = temp;
            saveState();
            renderResourceLists();
            renderAll();
            showToast("Time slot moved up.");
        };

        const moveTimeSlotDown = (index) => {
            if (index >= workspaceState.timeSlots.length - 1) return;
            const temp = workspaceState.timeSlots[index];
            workspaceState.timeSlots[index] = workspaceState.timeSlots[index + 1];
            workspaceState.timeSlots[index + 1] = temp;
            saveState();
            renderResourceLists();
            renderAll();
            showToast("Time slot moved down.");
        };

        const sortTimeSlotsChronologically = () => {
            workspaceState.timeSlots.sort((a, b) => timeToMins(a.start) - timeToMins(b.start));
            saveState();
            renderResourceLists();
            renderAll();
            showToast("Time slots sorted chronologically.");
        };

        const deleteTimeSlot = (id) => {
            const assignedClasses = workspaceState.classes.filter(c => c.timeSlotId === id);
            
            const performDelete = () => {
                workspaceState.classes = workspaceState.classes.filter(c => c.timeSlotId !== id);
                workspaceState.timeSlots = workspaceState.timeSlots.filter(ts => ts.id !== id);
                saveState();
                renderResourceLists();
                renderAll();
                showToast("Time slot row deleted successfully.");
            };

            if (assignedClasses.length > 0) {
                showConfirm(
                    "Delete Time Slot?", 
                    `There are ${assignedClasses.length} class(es) scheduled inside this slot. Deleting this slot will permanently remove those schedules. Proceed?`, 
                    performDelete
                );
            } else {
                performDelete();
            }
        };

        const handleCreateGrade = (e) => {
            e.preventDefault();
            const input = document.getElementById('grade-name-input');
            const name = input ? input.value.trim() : "";
            if(name) {
                if (workspaceState.grades.includes(name)) {
                    showToast("Grade level already exists.", "error");
                    return;
                }
                workspaceState.grades.push(name);
                input.value = '';
                saveState();
                renderResourceLists();
                renderAll();
                showToast("Grade level added.");
            }
        };

        const deleteGrade = (grade) => {
            const assignedClasses = workspaceState.classes.filter(c => c.grade === grade);
            
            const performDelete = () => {
                workspaceState.classes = workspaceState.classes.filter(c => c.grade !== grade);
                workspaceState.grades = workspaceState.grades.filter(g => g !== grade);
                workspaceState.sections = workspaceState.sections.filter(sec => sec.grade !== grade);
                if (workspaceState.advisers[grade]) {
                    delete workspaceState.advisers[grade];
                }
                saveState();
                renderResourceLists();
                renderAll();
                showToast("Grade level removed.");
            };

            if (assignedClasses.length > 0) {
                showConfirm(
                    "Delete Grade Level?",
                    `There are ${assignedClasses.length} classes scheduled for ${grade}. Removing this will permanently delete its associated sections and schedules. Proceed?`,
                    performDelete
                );
            } else {
                performDelete();
            }
        };

        const moveGradeUp = (index) => {
            if (index <= 0) return;
            const temp = workspaceState.grades[index];
            workspaceState.grades[index] = workspaceState.grades[index - 1];
            workspaceState.grades[index - 1] = temp;
            saveState();
            renderResourceLists();
            renderAll();
            showToast("Grade column reordered.");
        };

        const moveGradeDown = (index) => {
            if (index >= workspaceState.grades.length - 1) return;
            const temp = workspaceState.grades[index];
            workspaceState.grades[index] = workspaceState.grades[index + 1];
            workspaceState.grades[index + 1] = temp;
            saveState();
            renderResourceLists();
            renderAll();
            showToast("Grade column reordered.");
        };

        const handleCreateSection = (e) => {
            e.preventDefault();
            const grade = document.getElementById('section-grade-select').value;
            const input = document.getElementById('section-name-input');
            const name = input ? input.value.trim() : "";

            if (!grade) {
                showToast("Please create a Grade Level first.", "error");
                return;
            }

            if (workspaceState.sections.some(s => s.grade === grade && s.name === name)) {
                showToast("Section name already exists in this Grade Level.", "error");
                return;
            }

            workspaceState.sections.push({
                id: generateId('sec'),
                name,
                grade
            });
            if (input) input.value = '';
            saveState();
            renderResourceLists();
            renderAll();
            showToast("Section added.");
        };

        const deleteSection = (sectionId) => {
            const assignedClasses = workspaceState.classes.filter(c => c.sectionId === sectionId);
            
            const performDelete = () => {
                workspaceState.classes = workspaceState.classes.filter(c => c.sectionId !== sectionId);
                workspaceState.sections = workspaceState.sections.filter(sec => sec.id !== sectionId);
                saveState();
                renderResourceLists();
                renderAll();
                showToast("Section deleted.");
            };

            if (assignedClasses.length > 0) {
                showConfirm(
                    "Delete Section Column?",
                    `There are ${assignedClasses.length} classes scheduled for this section. Removing this column will permanently delete those blocks. Proceed?`,
                    performDelete
                );
            } else {
                performDelete();
            }
        };

        const moveSectionUp = (index, grade) => {
            const list = workspaceState.sections.filter(s => s.grade === grade);
            if (index <= 0) return;
            const globalIndex1 = workspaceState.sections.findIndex(s => s.id === list[index].id);
            const globalIndex2 = workspaceState.sections.findIndex(s => s.id === list[index - 1].id);
            
            const temp = workspaceState.sections[globalIndex1];
            workspaceState.sections[globalIndex1] = workspaceState.sections[globalIndex2];
            workspaceState.sections[globalIndex2] = temp;
            saveState();
            renderResourceLists();
            renderAll();
            showToast("Sections reordered.");
        };

        const moveSectionDown = (index, grade) => {
            const list = workspaceState.sections.filter(s => s.grade === grade);
            if (index >= list.length - 1) return;
            const globalIndex1 = workspaceState.sections.findIndex(s => s.id === list[index].id);
            const globalIndex2 = workspaceState.sections.findIndex(s => s.id === list[index + 1].id);
            
            const temp = workspaceState.sections[globalIndex1];
            workspaceState.sections[globalIndex1] = workspaceState.sections[globalIndex2];
            workspaceState.sections[globalIndex2] = temp;
            saveState();
            renderResourceLists();
            renderAll();
            showToast("Sections reordered.");
        };

        const startTeacherEdit = (id) => {
            editingTeacherId = id;
            renderResourceLists();
        };

        const cancelTeacherEdit = () => {
            editingTeacherId = null;
            renderResourceLists();
        };

        const saveTeacherEdit = (id) => {
            const input = document.getElementById(`edit-t-name-${id}`);
            if (!input) return;
            const newName = input.value.trim().toUpperCase();
            if (!newName) {
                showToast("Teacher name cannot be empty.", "error");
                return;
            }
            const teacher = workspaceState.teachers.find(t => t.id === id);
            if (teacher) {
                teacher.name = newName;
                editingTeacherId = null;
                saveState();
                renderResourceLists();
                renderAll();
                showToast("Teacher name globally updated!");
            }
        };

        const updateTeacherColorInline = (id, colorKey) => {
            const teacher = workspaceState.teachers.find(t => t.id === id);
            if (teacher) {
                teacher.color = colorKey;
                saveState();
                renderResourceLists();
                renderAll();
            }
        };

        const startSubjectEdit = (id) => {
            editingSubjectId = id;
            renderResourceLists();
        };

        const cancelSubjectEdit = () => {
            editingSubjectId = null;
            renderResourceLists();
        };

        const saveSubjectEdit = (id) => {
            const input = document.getElementById(`edit-s-name-${id}`);
            if (!input) return;
            const newName = input.value.trim().toUpperCase();
            if (!newName) {
                showToast("Subject name cannot be empty.", "error");
                return;
            }
            const subject = workspaceState.subjects.find(s => s.id === id);
            if (subject) {
                subject.name = newName;
                editingSubjectId = null;
                saveState();
                renderResourceLists();
                renderAll();
                showToast("Subject updated globally!");
            }
        };

        const startSectionEdit = (id) => {
            editingSectionId = id;
            renderResourceLists();
        };

        const cancelSectionEdit = () => {
            editingSectionId = null;
            renderResourceLists();
        };

        const saveSectionEdit = (id) => {
            const input = document.getElementById(`edit-sec-name-${id}`);
            if (!input) return;
            const newName = input.value.trim().toUpperCase();
            if (!newName) {
                showToast("Section title cannot be empty.", "error");
                return;
            }
            const section = workspaceState.sections.find(s => s.id === id);
            if (section) {
                section.name = newName;
                editingSectionId = null;
                saveState();
                renderResourceLists();
                renderAll();
                showToast("Section title updated globally!");
            }
        };

        const startTimeSlotEdit = (id) => {
            editingTimeSlotId = id;
            renderResourceLists();
        };

        const cancelTimeSlotEdit = () => {
            editingTimeSlotId = null;
            renderResourceLists();
        };

        const saveTimeSlotEdit = (id) => {
            const startInput = document.getElementById(`edit-ts-start-${id}`);
            const endInput = document.getElementById(`edit-ts-end-${id}`);
            const labelInput = document.getElementById(`edit-ts-label-${id}`);

            if (!startInput || !endInput) return;

            const start = startInput.value;
            const end = endInput.value;
            const startMins = timeToMins(start);
            const endMins = timeToMins(end);

            if (endMins <= startMins) {
                showToast("End time must be set chronologically after start time.", "error");
                return;
            }

            const tsObj = workspaceState.timeSlots.find(t => t.id === id);
            if (tsObj) {
                tsObj.start = start;
                tsObj.end = end;
                tsObj.mins = endMins - startMins;
                if (tsObj.type === 'universal' && labelInput) {
                    tsObj.label = labelInput.value.trim().toUpperCase() || "UNIVERSAL EVENT";
                }

                if (workspaceState.rippleCascadeEnabled !== false) {
                    const targetGroup = tsObj.group;
                    const sortedSlots = [...workspaceState.timeSlots].sort((a, b) => timeToMins(a.start) - timeToMins(b.start));
                    const editIdx = sortedSlots.findIndex(t => t.id === id);
                    
                    let currentEndMins = endMins;
                    for (let i = editIdx + 1; i < sortedSlots.length; i++) {
                        const nextTs = sortedSlots[i];
                        if (nextTs.group === targetGroup || targetGroup === 'all' || nextTs.group === 'all') {
                            const dur = nextTs.mins;
                            const nextStartStr = minsToTime(currentEndMins);
                            const nextEndStr = minsToTime(currentEndMins + dur);
                            
                            const actualTs = workspaceState.timeSlots.find(t => t.id === nextTs.id);
                            if (actualTs) {
                                actualTs.start = nextStartStr;
                                actualTs.end = nextEndStr;
                            }
                            currentEndMins += dur;
                        }
                    }
                }

                editingTimeSlotId = null;
                saveState();
                renderResourceLists();
                renderAll();
                showToast("Time slot row updated successfully!");
            }
        };

        const renderResourceLists = () => {
            if (activeResourceTab === 'subjects') {
                const subList = document.getElementById('subjects-list-container');
                subList.innerHTML = workspaceState.subjects.map(s => {
                    const isEditing = editingSubjectId === s.id;
                    if (isEditing) {
                        return `
                        <div class="flex items-center gap-2 p-2 bg-white border border-emerald-200 rounded-xl shadow-sm transition">
                            <input type="text" id="edit-s-name-${s.id}" value="${escapeHtml(s.name)}" class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 uppercase">
                            <button onclick="saveSubjectEdit('${s.id}')" class="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-2.5 py-1 text-xs font-bold transition">Save</button>
                            <button onclick="cancelSubjectEdit()" class="bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg px-2 py-1 text-xs font-bold transition">Cancel</button>
                        </div>
                        `;
                    } else {
                        return `
                        <div class="flex justify-between items-center p-2.5 bg-white border border-slate-150 rounded-xl shadow-xs hover:border-slate-350 transition">
                            <span class="text-xs font-bold text-slate-800 truncate">${escapeHtml(s.name)}</span>
                            <div class="flex items-center gap-1.5">
                                <button onclick="startSubjectEdit('${s.id}')" class="p-1 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition" title="Edit Subject">
                                    <i data-lucide="edit-2" class="w-3.5 h-3.5 font-bold"></i>
                                </button>
                                <button type="button" onclick="deleteSubject('${s.id}')" class="text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 p-1 font-bold transition ml-1"><i data-lucide="x" class="w-4 h-4 font-bold"></i></button>
                            </div>
                        </div>
                        `;
                    }
                }).join('');
            }

            if (activeResourceTab === 'teachers') {
                const teachList = document.getElementById('teachers-list-container');
                teachList.innerHTML = workspaceState.teachers.map(t => {
                    const isEditing = editingTeacherId === t.id;
                    
                    if (isEditing) {
                        return `
                        <div class="flex flex-col gap-2 p-3 bg-white border border-emerald-200 rounded-xl shadow-sm transition">
                            <div class="flex items-center gap-2">
                                <input type="text" id="edit-t-name-${t.id}" value="${escapeHtml(t.name)}" class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                                <button onclick="saveTeacherEdit('${t.id}')" class="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-2.5 py-1 text-xs font-bold transition">Save</button>
                                <button onclick="cancelTeacherEdit()" class="bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg px-2 py-1 text-xs font-bold transition">Cancel</button>
                            </div>
                            <div class="flex flex-col gap-1 mt-1">
                                <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Select Signature Color Theme:</span>
                                <div class="grid grid-cols-5 gap-1.5 p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                                    ${Object.keys(teacherColors).map(colorKey => {
                                        const isSelected = t.color === colorKey;
                                        const bgClass = hexBadgeColor[colorKey];
                                        return `
                                            <button onclick="updateTeacherColorInline('${t.id}', '${colorKey}')" class="w-full h-4.5 rounded ring-offset-1 ${bgClass} ${isSelected ? 'ring-2 ring-emerald-500 border border-white' : 'opacity-80 hover:opacity-100'}" title="${colorKey}"></button>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                        `;
                    } else {
                        return `
                        <div class="flex justify-between items-center p-2.5 bg-white border border-slate-150 rounded-xl shadow-xs hover:border-slate-350 transition">
                            <div class="flex items-center gap-2 min-w-0">
                                <span class="w-3 h-3 rounded-full ${hexBadgeColor[t.color || 'blue']} shrink-0"></span>
                                <span class="text-xs font-bold text-slate-800 truncate">${escapeHtml(t.name)}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <button onclick="startTeacherEdit('${t.id}')" class="p-1 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition" title="Edit Teacher Details">
                                    <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                                </button>
                                <button type="button" onclick="deleteTeacher('${t.id}')" class="text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 p-1 transition font-bold"><i data-lucide="x" class="w-4 h-4 font-bold"></i></button>
                            </div>
                        </div>
                        `;
                    }
                }).join('');
                
                const advisersSettings = document.getElementById('advisers-settings-container');
                advisersSettings.innerHTML = '';
                workspaceState.grades.forEach(grade => {
                    const blockDiv = document.createElement('div');
                    blockDiv.className = "p-3 bg-white rounded-xl border border-slate-200 shadow-sm mb-3";
                    
                    const label = document.createElement('label');
                    label.className = "block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5";
                    label.innerText = `${grade} Adviser`;
                    
                    const selectContainer = document.createElement('div');
                    selectContainer.className = "relative";
                    
                    const select = document.createElement('select');
                    select.className = "w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-700 focus:outline-none focus:border-emerald-500 appearance-none font-semibold";
                    select.onchange = (e) => updateAdviserMap(grade, e.target.value);
                    
                    select.add(new Option("-- No Adviser --", ""));
                    workspaceState.teachers.forEach(t => {
                        select.add(new Option(t.name, t.id));
                    });
                    select.value = workspaceState.advisers[grade] || '';
                    
                    const chevron = document.createElement('div');
                    chevron.className = "absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500";
                    chevron.innerHTML = `<i data-lucide="chevron-down" class="w-4 h-4"></i>`;

                    selectContainer.appendChild(select);
                    selectContainer.appendChild(chevron);

                    blockDiv.appendChild(label);
                    blockDiv.appendChild(selectContainer);
                    advisersSettings.appendChild(blockDiv);
                });
            }

            if (activeResourceTab === 'timeslots') {
                const slotsContainer = document.getElementById('timeslots-list-container');
                
                const filteredList = workspaceState.timeSlots
                    .map((ts, idx) => ({ ts, originalIndex: idx }))
                    .filter(({ ts }) => {
                        if (activeTimeSlotFilter === 'all') return true;
                        if (activeTimeSlotFilter === 'all_shared') return ts.group === 'all';
                        return ts.group === activeTimeSlotFilter;
                    });

                slotsContainer.innerHTML = filteredList.map(({ ts, originalIndex }) => {
                    const isUniversal = ts.type === 'universal';
                    const typeBadge = isUniversal 
                        ? `<span class="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-100 text-amber-800 uppercase shrink-0 font-bold">Universal Event</span>` 
                        : `<span class="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-100 text-blue-800 uppercase shrink-0 font-bold">Academic Grid</span>`;
                    
                    const isEditing = editingTimeSlotId === ts.id;
                    
                    if (isEditing) {
                        return `
                        <div class="flex flex-col gap-2 p-3 bg-white border border-emerald-200 rounded-xl shadow-sm transition">
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block text-[8px] uppercase font-bold text-slate-400 mb-0.5">Start Time</label>
                                    <input type="time" id="edit-ts-start-${ts.id}" value="${ts.start}" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                                </div>
                                <div>
                                    <label class="block text-[8px] uppercase font-bold text-slate-400 mb-0.5">End Time</label>
                                    <input type="time" id="edit-ts-end-${ts.id}" value="${ts.end}" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                                </div>
                            </div>
                            ${isUniversal ? `
                                <div>
                                    <label class="block text-[8px] uppercase font-bold text-slate-400 mb-0.5">Universal Event Label</label>
                                    <input type="text" id="edit-ts-label-${ts.id}" value="${escapeHtml(ts.label || '')}" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500 uppercase">
                                </div>
                            ` : ''}
                            <div class="flex gap-1.5 mt-1">
                                <button onclick="saveTimeSlotEdit('${ts.id}')" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-1 text-xs font-bold transition">Save</button>
                                <button onclick="cancelTimeSlotEdit()" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg py-1 text-xs font-bold transition">Cancel</button>
                            </div>
                        </div>
                        `;
                    } else {
                        const labelDisplay = isUniversal ? `<div class="text-[10px] text-amber-700 font-bold leading-tight mt-0.5 font-sans font-bold">Label: ${escapeHtml(ts.label)}</div>` : '';
                        
                        return `
                        <div class="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs flex justify-between items-center gap-2">
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="text-xs font-bold text-slate-800">${formatTo12Hour(ts.start)} - ${formatTo12Hour(ts.end)}</span>
                                    <span class="text-[10px] text-slate-500 font-bold">(${ts.mins}m)</span>
                                    ${typeBadge}
                                    <select onchange="updateTimeSlotGroup('${ts.id}', this.value)" class="bg-slate-100 border border-slate-200 hover:border-slate-350 text-slate-650 font-bold rounded px-1.5 py-0.5 text-[9px] uppercase cursor-pointer transition-colors focus:outline-none">
                                        <option value="g36" ${ts.group === 'g36' ? 'selected' : ''}>Grades 3-6</option>
                                        <option value="g12" ${ts.group === 'g12' ? 'selected' : ''}>Grades 1-2</option>
                                        <option value="kinder" ${ts.group === 'kinder' ? 'selected' : ''}>Kinder</option>
                                        <option value="all" ${ts.group === 'all' ? 'selected' : ''}>Shared</option>
                                    </select>
                                </div>
                                ${labelDisplay}
                            </div>
                            <div class="flex items-center gap-1.5 shrink-0">
                                <button type="button" onclick="startTimeSlotEdit('${ts.id}')" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition" title="Edit Time Slot Times">
                                    <i data-lucide="edit-2" class="w-3.5 h-3.5 font-bold"></i>
                                </button>
                                <button type="button" onclick="moveTimeSlotUp(${originalIndex})" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${originalIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}" ${originalIndex === 0 ? 'disabled' : ''}>
                                    <i data-lucide="arrow-up" class="w-3.5 h-3.5 font-bold"></i>
                                </button>
                                <button type="button" onclick="moveTimeSlotDown(${originalIndex})" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${originalIndex === workspaceState.timeSlots.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}" ${originalIndex === workspaceState.timeSlots.length - 1 ? 'disabled' : ''}>
                                    <i data-lucide="arrow-down" class="w-3.5 h-3.5 font-bold"></i>
                                </button>
                                <button type="button" onclick="deleteTimeSlot('${ts.id}')" class="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 transition ml-1" title="Delete Time Slot"><i data-lucide="trash-2" class="w-3.5 h-3.5 font-bold"></i></button>
                            </div>
                        </div>
                        `;
                    }
                }).join('');
            }

            if (activeResourceTab === 'grades') {
                const gradesContainer = document.getElementById('grades-list-container');
                gradesContainer.innerHTML = workspaceState.grades.map((grade, index) => `
                    <div class="flex justify-between items-center p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <span class="text-xs font-bold text-slate-700">${escapeHtml(grade)}</span>
                        <div class="flex items-center gap-1 shrink-0">
                            <button type="button" onclick="moveGradeUp(${index})" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}" ${index === 0 ? 'disabled' : ''}><i data-lucide="arrow-up" class="w-4 h-4 font-bold"></i></button>
                            <button type="button" onclick="moveGradeDown(${index})" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${index === workspaceState.grades.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}" ${index === workspaceState.grades.length - 1 ? 'disabled' : ''}><i data-lucide="arrow-down" class="w-4 h-4 font-bold"></i></button>
                            <button type="button" onclick="deleteGrade('${grade}')" class="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 transition ml-1 font-bold"><i data-lucide="x" class="w-4 h-4 font-bold"></i></button>
                        </div>
                    </div>
                `).join('');
            }

            if (activeResourceTab === 'sections') {
                const secContainer = document.getElementById('sections-list-container');
                const gradeSel = document.getElementById('section-grade-select');
                
                gradeSel.innerHTML = '';
                workspaceState.grades.forEach(g => {
                    gradeSel.add(new Option(g, g));
                });

                let sectionsHtml = '';
                workspaceState.grades.forEach(grade => {
                    const gradeSections = workspaceState.sections.filter(s => s.grade === grade);
                    if (gradeSections.length > 0) {
                        sectionsHtml += `
                            <div class="mb-3 font-semibold">
                                <h5 class="text-xs font-extrabold text-slate-500 uppercase border-b border-slate-200 pb-1 mb-1 font-bold">${escapeHtml(grade)}</h5>
                                <div class="space-y-1">
                                    ${gradeSections.map((sec, idx) => {
                                        const isEditing = editingSectionId === sec.id;
                                        if (isEditing) {
                                            return `
                                            <div class="flex items-center gap-2 p-2 bg-white border border-emerald-200 rounded-xl shadow-sm transition">
                                                <input type="text" id="edit-sec-name-${sec.id}" value="${escapeHtml(sec.name)}" class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500">
                                                <button onclick="saveSectionEdit('${sec.id}')" class="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-2.5 py-1 text-xs font-bold transition">Save</button>
                                                <button onclick="cancelSectionEdit()" class="bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg px-2 py-1 text-xs font-bold transition">Cancel</button>
                                            </div>
                                            `;
                                        } else {
                                            return `
                                            <div class="flex justify-between items-center p-2 bg-white border border-slate-150 rounded-lg shadow-xs">
                                                <span class="text-xs font-semibold text-slate-700 font-bold">Section ${escapeHtml(sec.name)}</span>
                                                <div class="flex items-center gap-1 shrink-0">
                                                    <button onclick="startSectionEdit('${sec.id}')" class="p-1 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition" title="Rename Section">
                                                        <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                                                    </button>
                                                    <button type="button" onclick="moveSectionUp(${idx}, '${grade}')" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${idx === 0 ? 'opacity-30 cursor-not-allowed' : ''}" ${idx === 0 ? 'disabled' : ''}><i data-lucide="arrow-up" class="w-3.5 h-3.5 font-bold"></i></button>
                                                    <button type="button" onclick="moveSectionDown(${idx}, '${grade}')" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${idx === gradeSections.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}" ${idx === gradeSections.length - 1 ? 'disabled' : ''}><i data-lucide="arrow-down" class="w-3.5 h-3.5 font-bold"></i></button>
                                                    <button type="button" onclick="deleteSection('${sec.id}')" class="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 transition ml-1 font-bold"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
                                                </div>
                                            </div>
                                            `;
                                        }
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }
                });
                
                secContainer.innerHTML = sectionsHtml || `<div class="text-xs text-slate-400 italic p-2 font-bold">No Sections configured yet.</div>`;
            }

            lucide.createIcons();
        };

        const handleCreateSubject = (e) => {
            e.preventDefault();
            const input = document.getElementById('subject-pool-input');
            const name = input.value.trim().toUpperCase();
            if(name) {
                workspaceState.subjects.push({ id: generateId('s'), name });
                input.value = '';
                saveState();
                renderResourceLists();
                renderAll(); 
                showToast(`Subject "${name}" added.`);
            }
        };

        const handleCreateTeacher = (e) => {
            e.preventDefault();
            const input = document.getElementById('teacher-pool-input');
            const color = document.querySelector('input[name="new-teacher-color"]:checked').value;
            const name = input.value.trim().toUpperCase();
            if(name) {
                workspaceState.teachers.push({ id: generateId('t'), name, color });
                input.value = '';
                saveState();
                renderResourceLists();
                renderAll(); 
                showToast(`Teacher "${name}" added to list.`);
            }
        };

        const deleteSubject = (id) => {
            if(workspaceState.classes.some(c => c.subjectId === id)) {
                showToast("Cannot delete subject: It is assigned to scheduled classes.", "error");
                return;
            }
            workspaceState.subjects = workspaceState.subjects.filter(s => s.id !== id);
            saveState(); 
            renderResourceLists();
            renderAll(); 
            showToast("Subject removed.");
        };

        const deleteTeacher = (id) => {
            if(workspaceState.classes.some(c => c.teacherId === id)) {
                showToast("Cannot delete teacher: They are assigned to classes.", "error");
                return;
            }
            workspaceState.teachers = workspaceState.teachers.filter(t => t.id !== id);
            saveState(); 
            renderResourceLists();
            renderAll(); 
            showToast("Teacher removed.");
        };

        const resetBoard = () => {
            showConfirm("Reset Entire Program Placements", "Are you sure you want to clear your current schedule placements? This preserves your custom resources.", () => {
                workspaceState.classes = [];
                saveState();
                renderAll();
                showToast("Workspace program placements cleared.");
            });
        };

        let scrollLoopEngine = null;
        let currentPointerY = null;

        const startAutoScroll = () => {
            if (scrollLoopEngine) return;
            scrollLoopEngine = requestAnimationFrame(function runScrollEngine() {
                if (currentPointerY !== null) {
                    const scrollBoundaryThreshold = 80; 
                    const speedMultiplier = 0.22; 
                    const screenHeight = window.innerHeight;
                    
                    let yDelta = 0;
                    if (currentPointerY < scrollBoundaryThreshold) {
                        yDelta = -Math.max(1, (scrollBoundaryThreshold - currentPointerY) * speedMultiplier);
                    } else if (currentPointerY > screenHeight - scrollBoundaryThreshold) {
                        yDelta = Math.max(1, (currentPointerY - (screenHeight - scrollBoundaryThreshold)) * speedMultiplier);
                    }
                    
                    if (yDelta !== 0) {
                        window.scrollBy(0, yDelta);
                    }
                }
                scrollLoopEngine = requestAnimationFrame(runScrollEngine);
            });
        };

        const stopAutoScroll = () => {
            if (scrollLoopEngine) {
                cancelAnimationFrame(scrollLoopEngine);
                scrollLoopEngine = null;
            }
            currentPointerY = null;
        };

        const updatePointerYForMouseDrag = (e) => {
            currentPointerY = e.clientY;
        };

        document.addEventListener('dragstart', () => {
            document.addEventListener('dragover', updatePointerYForMouseDrag);
            startAutoScroll();
        });

        document.addEventListener('dragend', () => {
            document.removeEventListener('dragover', updatePointerYForMouseDrag);
            stopAutoScroll();
        });

        setInterval(() => {
            if (!activeSelectedCardId) {
                workspaceState.teachers.forEach(t => {
                    const el = document.getElementById(`live-status-${t.id}`);
                    if (el) el.innerHTML = getLiveStatus(t.id);
                });
            }
        }, 60000);

        window.onload = function () {
            loadState();
            setActiveTab(workspaceState.activeTab || 'master');
            initCloudSync();
        };

        // --- EXPOSE MODULE FUNCTIONS TO GLOBAL WINDOW SCOPE FOR HTML HANDLERS ---
        window.openResourceModal = openResourceModal;
        window.closeResourceModal = closeResourceModal;
        window.openCreateModal = openCreateModal;
        window.triggerImport = triggerImport;
        window.handleImport = handleImport;
        window.exportData = exportData;
        window.resetBoard = resetBoard;
        window.setActiveTab = setActiveTab;
        window.handleGradeFilterChange = handleGradeFilterChange;
        window.handleDayFilterChange = handleDayFilterChange;
        window.clearActiveCardFilter = clearActiveCardFilter;
        window.setSummaryFilter = setSummaryFilter;
        window.handleSummarySearch = handleSummarySearch;
        window.updateSchoolConfig = updateSchoolConfig;
        window.handleLogoUpload = handleLogoUpload;
        window.clearLogo = clearLogo;
        window.handleCreateTeacher = handleCreateTeacher;
        window.handleCreateSubject = handleCreateSubject;
        window.handleCreateTimeSlot = handleCreateTimeSlot;
        window.sortTimeSlotsChronologically = sortTimeSlotsChronologically;
        window.setTimeSlotFilter = setTimeSlotFilter;
        window.handleCreateGrade = handleCreateGrade;
        window.handleCreateSection = handleCreateSection;
        window.closeCreateModal = closeCreateModal;
        window.handleCreateClass = handleCreateClass;
        window.closeEditModal = closeEditModal;
        window.handleSaveEdit = handleSaveEdit;
        window.closePopover = closePopover;
        window.toggleRippleCascade = toggleRippleCascade;
        window.toggleTeacherFilter = toggleTeacherFilter;
        window.assignTeacherQuick = assignTeacherQuick;
        window.startDirectTimeSlotEdit = startDirectTimeSlotEdit;
        window.cancelDirectTimeSlotInline = cancelDirectTimeSlotInline;
        window.saveDirectTimeSlotInline = saveDirectTimeSlotInline;
        window.appendFloatingTimeSlotNext = appendFloatingTimeSlotNext;
        window.openCreateModalAtMaster = openCreateModalAtMaster;
        window.openCreateModalAtSection = openCreateModalAtSection;
        window.openPopover = openPopover;
        window.openEditModal = openEditModal;
        window.deleteBlock = deleteBlock;
        window.saveSubjectEdit = saveSubjectEdit;
        window.cancelSubjectEdit = cancelSubjectEdit;
        window.startSubjectEdit = startSubjectEdit;
        window.deleteSubject = deleteSubject;
        window.saveTeacherEdit = saveTeacherEdit;
        window.cancelTeacherEdit = cancelTeacherEdit;
        window.updateTeacherColorInline = updateTeacherColorInline;
        window.startTeacherEdit = startTeacherEdit;
        window.deleteTeacher = deleteTeacher;
        window.saveTimeSlotEdit = saveTimeSlotEdit;
        window.cancelTimeSlotEdit = cancelTimeSlotEdit;
        window.updateTimeSlotGroup = updateTimeSlotGroup;
        window.startTimeSlotEdit = startTimeSlotEdit;
        window.moveTimeSlotUp = moveTimeSlotUp;
        window.moveTimeSlotDown = moveTimeSlotDown;
        window.deleteTimeSlot = deleteTimeSlot;
        window.moveGradeUp = moveGradeUp;
        window.moveGradeDown = moveGradeDown;
        window.deleteGrade = deleteGrade;
        window.saveSectionEdit = saveSectionEdit;
        window.cancelSectionEdit = cancelSectionEdit;
        window.startSectionEdit = startSectionEdit;
        window.moveSectionUp = moveSectionUp;
        window.moveSectionDown = moveSectionDown;
        window.deleteSection = deleteSection;
        window.switchCloudRoom = switchCloudRoom;
        window.setResourceTab = setResourceTab;
        window.toggleSlotLabelInput = toggleSlotLabelInput;
        window.openUpdateModal = openUpdateModal;
        window.closeUpdateModal = closeUpdateModal;
        window.dismissUpdateToast = dismissUpdateToast;
        window.startTheatricalUpdate = startTheatricalUpdate;

        // Register Service Worker for PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    })
                    .catch(err => {
                        console.log('ServiceWorker registration failed: ', err);
                    });
            });

            // Reload page when the new service worker takes over (skipWaiting + claim)
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    refreshing = true;
                    window.location.reload();
                }
            });
        }

        document.addEventListener('DOMContentLoaded', () => {
            const dropdownBtn = document.getElementById('actions-dropdown-btn');
            const dropdownMenu = document.getElementById('actions-dropdown-menu');
            
            const profileBtn = document.getElementById('profile-dropdown-btn');
            const profileMenu = document.getElementById('profile-dropdown-menu');

            if (dropdownBtn && dropdownMenu) {
                dropdownBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdownMenu.classList.toggle('hidden');
                    dropdownMenu.classList.toggle('opacity-0');
                    dropdownMenu.classList.toggle('scale-95');
                    
                    // Close profile if open
                    if (profileMenu && !profileMenu.classList.contains('hidden')) {
                        profileMenu.classList.add('hidden', 'opacity-0', 'scale-95');
                    }
                });
            }

            if (profileBtn && profileMenu) {
                profileBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    profileMenu.classList.toggle('hidden');
                    profileMenu.classList.toggle('opacity-0');
                    profileMenu.classList.toggle('scale-95');
                    
                    // Close actions if open
                    if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
                        dropdownMenu.classList.add('hidden', 'opacity-0', 'scale-95');
                    }
                });
            }

            document.addEventListener('click', (e) => {
                if (dropdownBtn && dropdownMenu && !dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.add('hidden', 'opacity-0', 'scale-95');
                }
                if (profileBtn && profileMenu && !profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
                    profileMenu.classList.add('hidden', 'opacity-0', 'scale-95');
                }
            });

});
