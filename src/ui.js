        ﻿﻿                                import { State, saveState, loadState } from './state.js';
        import { executeDragMoveMaster, executeDragMoveSection, toggleRippleCascade, setupDragDrop } from './dragDrop.js';
        import { checkTeacherCollision, checkDuplicateSubject, assignTeacherQuick, getLiveStatus, setupScheduling } from './scheduling.js';
        import { exportData, triggerImport, handleImport, setupImportExport } from './importExport.js';
        import { initCloudSync, setupCloudSync, switchCloudRoom, saveToCloud, currentRoomCode, isCloudConnected } from './cloudSync.js';
        import { defaultState } from './defaults.js';
        import { readSavedState, writeSavedState } from './storage.js';
        import { migrateLegacyData } from './stateMigration.js';
        import { renderDiagnostics } from './conflictDiagnostics.js';
        import { teacherColors, hexBadgeColor, hexTextColors } from './theme.js';
        import { escapeHtml, formatTo12Hour, generateId, minsToTime, timeToMins } from './utils.js';

        // Global variables provided by the container environment
                
        
        
        
        // --- DATA DEFAULTS ---
        
        
        
        

        
        
        
         
         
         
         
         

        // Edit trackers
        
        
        
         

        // Custom palettes
        

        const showToast = (message, type = "info") => {
            const toast = document.getElementById('custom-toast');
            const msgEl = document.getElementById('toast-message');
            const iconEl = document.getElementById('toast-icon');
            
            msgEl.innerText = message;
            if (type === 'error') {
                iconEl.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 text-red-400"></i>';
                toast.className = "fixed bottom-5 right-5 bg-red-950 text-red-100 border border-red-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 transform translate-y-0 opacity-100 transition-all duration-300 z-[100] text-sm font-semibold";
            } else {
                iconEl.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i>';
                toast.className = "fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 transform translate-y-0 opacity-100 transition-all duration-300 z-[100] text-sm font-semibold";
            }
            lucide.createIcons();
            setTimeout(() => {
                toast.className = "fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 transform translate-y-20 opacity-0 transition-all duration-300 z-[100] text-sm font-semibold";
            }, 3000);
        };

        const showConfirm = (title, message, onConfirm) => {
            const modal = document.getElementById('confirm-modal');
            document.getElementById('confirm-title').innerText = title;
            document.getElementById('confirm-message').innerText = message;
            modal.style.display = 'flex';
            
            const cancelBtn = document.getElementById('confirm-cancel-btn');
            const okBtn = document.getElementById('confirm-ok-btn');
            
            const cleanup = () => {
                modal.style.display = 'none';
                const newCancelBtn = cancelBtn.cloneNode(true);
                const newOkBtn = okBtn.cloneNode(true);
                cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
                okBtn.parentNode.replaceChild(newOkBtn, okBtn);
            };
            
            document.getElementById('confirm-ok-btn').addEventListener('click', () => { onConfirm(); cleanup(); });
            document.getElementById('confirm-cancel-btn').addEventListener('click', () => { cleanup(); });
        };

        
        
        

        const updateAdviserMap = (grade, teacherId) => {
            State.workspace.advisers[grade] = teacherId;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderAll(); 
        };

        const updateSchoolConfig = (key, value) => {
            State.workspace.schoolConfig[key] = value;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderPrintDOM();
        };

        const handleLogoUpload = (e, side) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                State.workspace.schoolConfig[side] = event.target.result;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderPrintDOM();
                showToast(`${side === 'logoLeft' ? 'Left' : 'Right'} logo successfully saved.`);
            };
            reader.readAsDataURL(file);
        };

        const clearLogo = (side) => {
            State.workspace.schoolConfig[side] = "";
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderPrintDOM();
            showToast(`${side === 'logoLeft' ? 'Left' : 'Right'} logo cleared.`);
        };

        const renderPrintDOM = () => {
            const cfg = State.workspace.schoolConfig;
            
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
            const simultaneousBlocks = State.workspace.classes.filter(c => 
                c.id !== block.id && 
                c.day === block.day && 
                c.timeSlotId === block.timeSlotId
            );
            return simultaneousBlocks.some(c => c.teacherId === block.teacherId);
        };

        const checkDuplicateSubject = (block) => {
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

        window.addEventListener('beforeprint', () => {
            const titleEl = document.getElementById('print-doc-title');
            if (State.workspace.activeTab === 'master_kinder') {
                titleEl.innerText = `MASTER CLASS PROGRAM (KINDERGARTEN)`;
            } else if (State.workspace.activeTab === 'master_g12') {
                titleEl.innerText = `MASTER CLASS PROGRAM (GRADES 1 - 2)`;
            } else if (State.workspace.activeTab === 'master') {
                titleEl.innerText = `MASTER CLASS PROGRAM (GRADES 3 - 6)`;
            } else if (State.workspace.activeTab === 'summary') {
                titleEl.innerText = `TEACHING LOAD SUMMARY REPORT`;
            } else {
                const filter = State.workspace.gradelevelFilter;
                titleEl.innerText = `CLASS PROGRAM FOR ${filter}`;
            }
        });

        const populateGradelevelFilters = () => {
            const gradeSelect = document.getElementById('gradelevel-filter-select');
            gradeSelect.innerHTML = '';
            State.workspace.grades.forEach(g => {
                gradeSelect.add(new Option(g, g));
            });
            if (!State.workspace.grades.includes(State.workspace.gradelevelFilter)) {
                State.workspace.gradelevelFilter = State.workspace.grades[0] || '';
            }
            gradeSelect.value = State.workspace.gradelevelFilter;
            document.getElementById('gradelevel-day-select').value = State.workspace.gradelevelDayFilter || "mon";
        };

        const handleGradeFilterChange = (val) => {
            State.workspace.gradelevelFilter = val;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderAll();
        };

        const handleDayFilterChange = (val) => {
            State.workspace.gradelevelDayFilter = val;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderAll();
        };

        const setActiveTab = (tab) => {
            State.workspace.activeTab = tab;
            
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
                    State.summaryFilter = 'all';
                    State.summarySearchQuery = '';
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
            State.inlineEditingSlotId = null;

            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderAll();
        };

        const getLiveStatus = (teacherId) => {
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

        const updateTimeSlotGroup = (slotId, newGroup) => {
            const slot = State.workspace.timeSlots.find(ts => ts.id === slotId);
            if (slot) {
                slot.group = newGroup;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderAll();
                renderResourceLists();
                showToast("Time slot segment group association updated!");
            }
        };

        const setTimeSlotFilter = (filter) => {
            State.activeTimeSlotFilter = filter;
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
            if (State.activeTeacherFilterId === id) {
                State.activeTeacherFilterId = null;
                State.expandedTeacherId = null;
            } else {
                State.activeTeacherFilterId = id;
                State.expandedTeacherId = id;
                State.activeSelectedCardId = null; 
            }
            renderAll();
        };

        const toggleRippleCascade = (checked) => {
            State.workspace.rippleCascadeEnabled = checked;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            showToast(checked ? "Domino Ripple Cascading enabled!" : "Domino Ripple Cascading disabled!");
        };

        const renderAutopopulatePanel = () => {
            const container = document.getElementById('faculty-panel-flex');
            const titleEl = document.getElementById('faculty-panel-title');
            const clearBtn = document.getElementById('clear-highlight-btn');

            if (!container) return;

            if (!State.activeSelectedCardId) {
                titleEl.innerText = "Faculty Directory";
                if (State.activeTeacherFilterId) {
                    clearBtn.classList.remove('hidden');
                } else {
                    clearBtn.classList.add('hidden');
                }
                
                container.innerHTML = State.workspace.teachers.map(t => {
                    const badgeHex = hexBadgeColor[t.color || 'blue'];
                    const textHex = hexTextColors[t.color || 'blue'];

                    const advisoryGrades = Object.keys(State.workspace.advisers).filter(g => State.workspace.advisers[g] === t.id);
                    const advisoryText = advisoryGrades.length > 0 ? `Adviser: ${advisoryGrades.join(', ')}` : 'None';

                    const isAdviser = advisoryGrades.length > 0;
                    const adviserLoadDaily = isAdviser ? 1.00 : 0.00;

                    const getTeacherLoadHoursForDay = (teacherId, day) => {
                        const mins = State.workspace.classes
                            .filter(c => c.teacherId === teacherId && (c.day === day || c.day === 'master'))
                            .reduce((sum, c) => {
                                const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
                                return sum + (ts ? ts.mins : 0);
                            }, 0);
                        return mins / 60.0;
                    };

                    const activeDay = (State.workspace.activeTab === 'master' || State.workspace.activeTab === 'master_g12' || State.workspace.activeTab === 'master_kinder') ? 'master' : State.workspace.gradelevelDayFilter;
                    const dailyTeachingHours = getTeacherLoadHoursForDay(t.id, activeDay);

                    const weeklyMasterMins = State.workspace.classes
                        .filter(c => c.teacherId === t.id && c.day === 'master')
                        .reduce((sum, c) => {
                            const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
                            return sum + (ts ? ts.mins * 5 : 0);
                        }, 0);

                    const weeklySpecificMins = State.workspace.classes
                        .filter(c => c.teacherId === t.id && c.day !== 'master' && c.day !== 'pool')
                        .reduce((sum, c) => {
                            const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
                            return sum + (ts ? ts.mins : 0);
                        }, 0);
                    
                    const weeklyTeachingHours = (weeklyMasterMins + weeklySpecificMins) / 60.0;

                    const totalDailyLoad = dailyTeachingHours + adviserLoadDaily;
                    const dailyExcess = totalDailyLoad - 6.00;
                    const excessMins = Math.round(dailyExcess * 60);

                    const isSelectedFilter = State.activeTeacherFilterId === t.id;
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
                                    <span class="w-2 h-2 rounded-full ${badgeHex} shrink-0 shadow-2xs"></span>
                                    <span class="font-extrabold text-slate-950 uppercase tracking-tight break-words text-xs select-none">${escapeHtml(t.name)}</span>
                                </div>
                                <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-250 mt-0.5 ${chevronClass}"></i>
                            </div>

                            <div class="flex items-center gap-1.5 pl-4 ml-0.5">
                                ${filterBadge ? filterBadge : `
                                    <span class="text-[9.5px] font-extrabold px-2 py-0.5 rounded-md border ${
                                        dailyExcess > 0.001 
                                        ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' 
                                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'
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

            const block = State.workspace.classes.find(c => c.id === State.activeSelectedCardId);
            if (!block) return;

            const subject = State.workspace.subjects.find(s => s.id === block.subjectId) || { name: 'Unknown' };
            titleEl.innerText = `Faculty: ${subject.name}`;
            clearBtn.classList.remove('hidden');

            const dayCode = block.day;
            const slotId = block.timeSlotId;

            const busyTeacherIds = State.workspace.classes
                .filter(c => c.id !== block.id && c.day === dayCode && c.timeSlotId === slotId && c.teacherId)
                .map(c => c.teacherId);

            const experiencedTeacherIds = Array.from(new Set(
                State.workspace.classes
                    .filter(c => c.subjectId === block.subjectId && c.teacherId)
                    .map(c => c.teacherId)
            ));

            let sortedTeachers = [...State.workspace.teachers].sort((a, b) => {
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
            if (State.activeSelectedCardId === id) {
                State.activeSelectedCardId = null;
            } else {
                State.activeSelectedCardId = id;
                State.activeTeacherFilterId = null; 
            }
            renderAll();
        };

        const clearActiveCardFilter = () => {
            State.activeSelectedCardId = null;
            State.activeTeacherFilterId = null;
            renderAll();
        };

        const assignTeacherQuick = (teacherId) => {
            if (!State.activeSelectedCardId) return;
            const block = State.workspace.classes.find(c => c.id === State.activeSelectedCardId);
            if (block) {
                block.teacherId = teacherId;
                
                const isCollision = checkTeacherCollision(block);
                if (isCollision) {
                    showToast("Warning: Teacher is double-booked on this time slot!", "error");
                } else {
                    showToast("Faculty assigned successfully!");
                }
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                State.activeSelectedCardId = null; 
                renderAll();
            }
        };

        const getActiveTimeSlotsForCurrentView = () => {
            const isMasterKinder = State.workspace.activeTab === 'master_kinder';
            const isMasterG12 = State.workspace.activeTab === 'master_g12';
            const isMasterG36 = State.workspace.activeTab === 'master';
            
            if (isMasterKinder) {
                return State.workspace.timeSlots.filter(ts => ts.group === 'kinder');
            } else if (isMasterG12) {
                return State.workspace.timeSlots.filter(ts => ts.group === 'all' || ts.group === 'g12');
            } else if (isMasterG36) {
                return State.workspace.timeSlots.filter(ts => (ts.group === 'all' || ts.group === 'g36'));
            } else {
                const filterGrade = State.workspace.gradelevelFilter;
                if (filterGrade === "Kindergarten") {
                    return State.workspace.timeSlots.filter(ts => ts.group === 'kinder');
                } else if (filterGrade === "Grade 1" || filterGrade === "Grade 2") {
                    return State.workspace.timeSlots.filter(ts => ts.group === 'all' || ts.group === 'g12');
                } else {
                    return State.workspace.timeSlots.filter(ts => (ts.group === 'all' || ts.group === 'g36'));
                }
            }
        };

        // --- DIRECT INTERACTIVE CELL TIME EDITORS ---
        const startDirectTimeSlotEdit = (slotId) => {
            State.inlineEditingSlotId = slotId;
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

            const tsObj = State.workspace.timeSlots.find(t => t.id === slotId);
            if (tsObj) {
                tsObj.start = start;
                tsObj.end = end;
                tsObj.mins = endMins - startMins;
                if (groupSelect) {
                    tsObj.group = groupSelect.value;
                }

                // Run Segment Domino Cascading Engine (Proposal 2 & 3)
                if (State.workspace.rippleCascadeEnabled !== false) {
                    const targetGroup = tsObj.group;
                    const sortedSlots = [...State.workspace.timeSlots].sort((a, b) => timeToMins(a.start) - timeToMins(b.start));
                    const editIdx = sortedSlots.findIndex(t => t.id === slotId);
                    
                    let currentEndMins = endMins;
                    for (let i = editIdx + 1; i < sortedSlots.length; i++) {
                        const nextTs = sortedSlots[i];
                        if (nextTs.group === targetGroup || targetGroup === 'all' || nextTs.group === 'all') {
                            const dur = nextTs.mins;
                            const nextStartStr = minsToTime(currentEndMins);
                            const nextEndStr = minsToTime(currentEndMins + dur);
                            
                            const actualTs = State.workspace.timeSlots.find(t => t.id === nextTs.id);
                            if (actualTs) {
                                actualTs.start = nextStartStr;
                                actualTs.end = nextEndStr;
                            }
                            currentEndMins += dur;
                        }
                    }
                }

                State.inlineEditingSlotId = null;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderAll();
                showToast("Timeline slot and subsequent offsets updated dynamically!");
            }
        };

        const cancelDirectTimeSlotInline = () => {
            State.inlineEditingSlotId = null;
            renderAll();
        };

        const appendFloatingTimeSlotNext = (baseSlotId) => {
            const baseSlot = State.workspace.timeSlots.find(ts => ts.id === baseSlotId);
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

            State.workspace.timeSlots.push(newSlot);
            State.workspace.timeSlots.sort((a, b) => timeToMins(a.start) - timeToMins(b.start));

            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderAll();
            showToast("New relative time slot row inserted successfully!");
        };

        const renderAll = () => {
            const suspendedAvatars = document.querySelectorAll('#touch-drag-avatar');
            suspendedAvatars.forEach(av => av.remove());
            
            renderPrintDOM();
            renderDynamicHeaders();
            renderAutopopulatePanel();
            renderDiagnostics(); 

            const tbody = document.getElementById('matrix-tbody');
            tbody.innerHTML = '';

            if (State.workspace.activeTab === 'summary') { 
            if (State.workspace.activeTab === 'summary') {
                renderSummaryView(); 
                return;
            }

            const isMasterKinder = State.workspace.activeTab === "master_kinder";
            const isMasterG12 = State.workspace.activeTab === "master_g12";
            const isMasterG36 = State.workspace.activeTab === "master";

            const gradeFilter = State.workspace.gradelevelFilter;
            const dayFilter = State.workspace.gradelevelDayFilter;

            const activeSlots = getActiveTimeSlotsForCurrentView();

            activeSlots.forEach(slot => { 
            activeSlots.forEach(slot => {
                const tr = document.createElement('tr');
                tr.className = slot.type === 'universal' ? 'bg-slate-50/70 border-y border-slate-200' : 'hover:bg-slate-50/40 transition-colors';

                // TIME SLOT CELL: Interactive Inline Editor inside main program matrix
                const tdTime = document.createElement('td');
                tdTime.className = "p-3 border-r border-slate-200 text-center align-middle whitespace-nowrap relative group/slot-cell min-w-[200px] h-24";
                
                if (State.inlineEditingSlotId === slot.id) {
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
                        colCount = State.workspace.sections.filter(sec => sec.grade === gradeFilter).length || 1;
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

                        const block = State.workspace.classes.find(c => 
                            c.day === 'master' && 
                            c.timeSlotId === slot.id && 
                            c.grade === "Kindergarten"
                        );

                        if (block) {
                            tdCell.appendChild(createDragBlock(block));
                        } else {
                            tdCell.innerHTML = `<div class="w-full h-full min-h-[60px] border border-dashed border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-center text-[10px] text-slate-400 select-none hover:text-slate-500 font-bold print:border-none print:text-transparent" onclick="openCreateModalAtMaster('Kindergarten', '${slot.id}')">Empty Slot</div>`;
                        }

                        tdCell.addEventListener('dragover', (e) => { e.preventDefault(); tdCell.classList.add('drag-over-active'); });
                        tdCell.addEventListener('dragleave', () => { tdCell.classList.remove('drag-over-active'); });
                        tdCell.addEventListener('drop', (e) => {
                            e.preventDefault();
                            tdCell.classList.remove('drag-over-active');
                            if (State.draggedBlockId) executeDragMoveMaster(State.draggedBlockId, "Kindergarten", slot.id);
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

                            const block = State.workspace.classes.find(c => 
                                c.day === 'master' && 
                                c.timeSlotId === slot.id && 
                                c.grade === grade
                            );

                            if (block) {
                                tdCell.appendChild(createDragBlock(block));
                            } else {
                                tdCell.innerHTML = `<div class="w-full h-full min-h-[60px] border border-dashed border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-center text-[10px] text-slate-400 select-none hover:text-slate-500 font-bold print:border-none print:text-transparent" onclick="openCreateModalAtMaster('${grade}', '${slot.id}')">Empty Slot</div>`;
                            }

                            tdCell.addEventListener('dragover', (e) => { e.preventDefault(); tdCell.classList.add('drag-over-active'); });
                            tdCell.addEventListener('dragleave', () => { tdCell.classList.remove('drag-over-active'); });
                            tdCell.addEventListener('drop', (e) => {
                                e.preventDefault();
                                tdCell.classList.remove('drag-over-active');
                                if (State.draggedBlockId) executeDragMoveMaster(State.draggedBlockId, grade, slot.id);
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

                            const block = State.workspace.classes.find(c => 
                                c.day === 'master' && 
                                c.timeSlotId === slot.id && 
                                c.grade === grade
                            );

                            if (block) {
                                tdCell.appendChild(createDragBlock(block));
                            } else {
                                tdCell.innerHTML = `<div class="w-full h-full min-h-[60px] border border-dashed border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-center text-[10px] text-slate-400 select-none hover:text-slate-500 font-bold print:border-none print:text-transparent" onclick="openCreateModalAtMaster('${grade}', '${slot.id}')">Empty Slot</div>`;
                            }

                            tdCell.addEventListener('dragover', (e) => { e.preventDefault(); tdCell.classList.add('drag-over-active'); });
                            tdCell.addEventListener('dragleave', () => { tdCell.classList.remove('drag-over-active'); });
                            tdCell.addEventListener('drop', (e) => {
                                e.preventDefault();
                                tdCell.classList.remove('drag-over-active');
                                if (State.draggedBlockId) executeDragMoveMaster(State.draggedBlockId, grade, slot.id);
                            });

                            tr.appendChild(tdCell);
                        });
                    } else {
                        const activeSections = State.workspace.sections.filter(sec => sec.grade === gradeFilter);

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

                                const block = State.workspace.classes.find(c => 
                                    c.day === dayFilter && 
                                    c.timeSlotId === slot.id && 
                                    c.sectionId === section.id
                                );

                                if (block) {
                                    tdCell.appendChild(createDragBlock(block));
                                } else {
                                    tdCell.innerHTML = `<div class="w-full h-full min-h-[60px] border border-dashed border-slate-200 rounded-xl hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-center text-[10px] text-slate-400 select-none hover:text-slate-500 font-bold print:border-none print:text-transparent" onclick="openCreateModalAtSection('${section.id}', '${slot.id}')">Empty Slot</div>`;
                                }

                                tdCell.addEventListener('dragover', (e) => { e.preventDefault(); tdCell.classList.add('drag-over-active'); });
                                tdCell.addEventListener('dragleave', () => { tdCell.classList.remove('drag-over-active'); });
                                tdCell.addEventListener('drop', (e) => {
                                    e.preventDefault();
                                    tdCell.classList.remove('drag-over-active');
                                    if (State.draggedBlockId) executeDragMoveSection(State.draggedBlockId, section.id, slot.id, dayFilter);
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
            
            let totalFaculty = State.workspace.teachers.length;
            let grandTotalWeeklyTeachingMins = 0;
            let totalOverloadedCount = 0;
            let totalDailyLoadsSum = 0;

            const teacherDataList = State.workspace.teachers.map(t => {
                const advisoryGrades = Object.keys(State.workspace.advisers).filter(g => State.workspace.advisers[g] === t.id);
                
                // Formulate detailed Advisory Room text including sections
                const advisoryText = advisoryGrades.map(g => {
                    const secs = State.workspace.sections.filter(sec => sec.grade === g).map(sec => sec.name);
                    return secs.length > 0 ? `${g} (${secs.join(', ')})` : g;
                }).join(', ') || 'None';

                const isAdviser = advisoryGrades.length > 0;
                const adviserLoadDaily = isAdviser ? 1.00 : 0.00;

                const getTeacherLoadHoursForDay = (teacherId, day) => {
                    const mins = State.workspace.classes
                        .filter(c => c.teacherId === teacherId && (c.day === day || c.day === 'master'))
                        .reduce((sum, c) => {
                            const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
                            return sum + (ts ? ts.mins : 0);
                        }, 0);
                    return mins / 60.0;
                };

                const dailyTeachingHours = getTeacherLoadHoursForDay(t.id, 'master');

                const weeklyMasterMins = State.workspace.classes
                    .filter(c => c.teacherId === t.id && c.day === 'master')
                    .reduce((sum, c) => {
                        const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
                        return sum + (ts ? ts.mins * 5 : 0);
                    }, 0);

                const weeklySpecificMins = State.workspace.classes
                    .filter(c => c.teacherId === t.id && c.day !== 'master' && c.day !== 'pool')
                    .reduce((sum, c) => {
                        const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
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
                const gradesOrder = State.workspace.grades || [];
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
                        <span class="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 shadow-2xs">
                            <i data-lucide="users" class="w-5 h-5"></i>
                        </span>
                        <div class="flex-1">
                            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Instructors</p>
                            <h4 class="text-lg font-extrabold text-slate-900 mt-0.5">${totalFaculty}</h4>
                            <span class="text-[9px] font-semibold text-indigo-500">Active roster members</span>
                        </div>
                    </div>

                    <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center gap-3.5 hover:shadow-sm transition-all">
                        <span class="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 shadow-2xs">
                            <i data-lucide="clock" class="w-5 h-5"></i>
                        </span>
                        <div class="flex-1">
                            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Schedule Volume</p>
                            <h4 class="text-lg font-extrabold text-slate-900 mt-0.5">${grandTotalWeeklyTeachingHours.toFixed(1)} hrs</h4>
                            <span class="text-[9px] font-semibold text-blue-500">Cumulative weekly contact</span>
                        </div>
                    </div>

                    <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center gap-3.5 hover:shadow-sm transition-all">
                        <span class="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 shadow-2xs">
                            <i data-lucide="trending-up" class="w-5 h-5"></i>
                        </span>
                        <div class="flex-1">
                            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Avg Workload</p>
                            <h4 class="text-lg font-extrabold text-slate-900 mt-0.5">${averageDailyLoad.toFixed(1)} hrs/day</h4>
                            <span class="text-[9px] font-semibold text-amber-500">Ideal range: 5.0 - 6.0</span>
                        </div>
                    </div>

                    <div class="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex items-center gap-3.5 hover:shadow-sm transition-all">
                        <span class="p-2 ${complianceRate >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'} rounded-lg border shadow-2xs">
                            <i data-lucide="${complianceRate >= 80 ? 'shield-check' : 'shield-alert'}" class="w-5 h-5"></i>
                        </span>
                        <div class="flex-1">
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
                if (State.summaryFilter !== 'all' && item.statusType !== State.summaryFilter) {
                    return false;
                }
                if (State.summarySearchQuery) {
                    const nameMatch = item.teacher.name.toLowerCase().includes(State.summarySearchQuery);
                    const advisoryMatch = item.advisoryText.toLowerCase().includes(State.summarySearchQuery);
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

                const teacherClasses = State.workspace.classes.filter(c => c.teacherId === teacher.id);
                let scheduleBlocksHtml = '';
                if (teacherClasses.length === 0) {
                    scheduleBlocksHtml = '<span class="text-slate-400 italic text-[10px]">No assigned classes</span>';
                } else {
                    scheduleBlocksHtml = `<div class="flex flex-wrap gap-1">`;
                    teacherClasses.forEach(c => {
                        const sub = State.workspace.subjects.find(s => s.id === c.subjectId);
                        const ts = State.workspace.timeSlots.find(slot => slot.id === c.timeSlotId);
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
            State.summaryFilter = filter;
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
            State.summarySearchQuery = val.trim().toLowerCase();
            renderAll();
        };

        const renderDynamicHeaders = () => {
            const thead = document.getElementById('matrix-thead');
            thead.innerHTML = '';
            
            const tr = document.createElement('tr');
            tr.className = "bg-slate-100 text-slate-700 text-xs font-extrabold uppercase tracking-wider border-b border-slate-200";
            
            if (State.workspace.activeTab === 'summary') {
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

                if (State.workspace.activeTab === 'master_kinder') {
                    const th = document.createElement('th');
                    th.className = "p-3 border-r border-slate-200 text-center font-bold";
                    th.style.width = `100%`;
                    const adviserId = State.workspace.advisers["Kindergarten"];
                    const adviserTeacher = State.workspace.teachers.find(t => t.id === adviserId);
                    const adviserName = adviserTeacher ? adviserTeacher.name : "Unassigned";
                    th.innerHTML = `
                        Kindergarten (Rotational Matrix)
                        <div class="text-[10px] font-normal text-slate-500 capitalize print:font-serif print:text-black font-semibold font-semibold">Adviser: ${escapeHtml(adviserName)}</div>
                    `;
                    tr.appendChild(th);
                } else if (State.workspace.activeTab === 'master_g12') {
                    const targetGrades = ["Grade 1", "Grade 2"];
                    targetGrades.forEach(grade => {
                        const adviserId = State.workspace.advisers[grade];
                        const adviserTeacher = State.workspace.teachers.find(t => t.id === adviserId);
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
                } else if (State.workspace.activeTab === 'master') {
                    const targetGrades = ["Grade 3", "Grade 4", "Grade 5", "Grade 6"];
                    targetGrades.forEach(grade => {
                        const adviserId = State.workspace.advisers[grade];
                        const adviserTeacher = State.workspace.teachers.find(t => t.id === adviserId);
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
                    const activeSections = State.workspace.sections.filter(sec => sec.grade === State.workspace.gradelevelFilter);
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
            const subject = State.workspace.subjects.find(s => s.id === block.subjectId) || { name: 'Unknown' };
            const teacher = State.workspace.teachers.find(t => t.id === block.teacherId) || { name: 'Unknown', color: 'blue' };
            const colors = teacherColors[teacher.color || 'blue'] || teacherColors['blue'];
            
            const isCollision = checkTeacherCollision(block);
            const isDuplicate = checkDuplicateSubject(block);

            const ts = State.workspace.timeSlots.find(slot => slot.id === block.timeSlotId);
            const durationMins = ts ? ts.mins : 0;

            const el = document.createElement('div');
            el.id = block.id;
            el.draggable = true;

            let activeHighlightClass = '';
            let opacityDimClass = '';

            if (State.activeTeacherFilterId) {
                if (block.teacherId === State.activeTeacherFilterId) {
                    activeHighlightClass = 'card-active-highlight ring-4 ring-emerald-500 shadow-xl scale-[1.02] z-10';
                } else {
                    opacityDimClass = 'opacity-25 scale-95 grayscale-[30%] pointer-events-none transition-all duration-300';
                }
            } else if (State.activeSelectedCardId === block.id) {
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
                const sectionObj = State.workspace.sections.find(s => s.id === block.sectionId);
                if (sectionObj) {
                    badgeText = sectionObj.name;
                }
            }
            
            let gradeRomSuffix = (State.workspace.activeTab === 'master' || State.workspace.activeTab === 'master_g12') ? block.grade.replace('Grade ', '') : '';

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
                State.draggedBlockId = block.id;
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
            if (State.workspace.grades.length === 0) {
                showToast("Please add at least one Grade level in Settings first.", "error");
                return;
            }
            populateSelects('create');
            
            const isKinder = State.workspace.activeTab === 'master_kinder';
            const isG12 = State.workspace.activeTab === 'master_g12';
            let targetDay = (State.workspace.activeTab === 'master' || State.workspace.activeTab === 'master_g12' || State.workspace.activeTab === 'master_kinder') ? 'master' : State.workspace.gradelevelDayFilter;
            
            let targetGrade = "Grade 4";
            if (isKinder) targetGrade = "Kindergarten";
            else if (isG12) targetGrade = "Grade 1";
            else if (State.workspace.activeTab === 'gradelevel') targetGrade = State.workspace.gradelevelFilter;

            let targetSection = "";
            if (targetDay !== 'master') {
                const availableSections = State.workspace.sections.filter(s => s.grade === targetGrade);
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
            const dayFilter = State.workspace.gradelevelDayFilter;
            const sec = State.workspace.sections.find(s => s.id === sectionId);
            const grade = sec ? sec.grade : State.workspace.gradelevelFilter;
            setupCreateModalValues(dayFilter, grade, sectionId, slotId);
            document.getElementById('create-modal').style.display = 'flex';
        };

        const setupCreateModalValues = (day, grade, sectionId, slotId) => {
            document.getElementById('create-day-hidden').value = day;
            document.getElementById('create-grade-hidden').value = grade;
            document.getElementById('create-section-hidden').value = sectionId;
            document.getElementById('create-timeslot-hidden').value = slotId;

            const infoBox = document.getElementById('create-target-info');
            const slotObj = State.workspace.timeSlots.find(s => s.id === slotId);
            const slotText = slotObj ? `${formatTo12Hour(slotObj.start)} - ${formatTo12Hour(slotObj.end)}` : 'Auto Slot';
            const dayText = day === 'master' ? 'Master Schedule' : day.toUpperCase();
            
            let locationText = grade;
            if (sectionId) {
                const secObj = State.workspace.sections.find(s => s.id === sectionId);
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
            const block = State.workspace.classes.find(c => c.id === id);
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
            State.activeQuickMoveId = id;
            const btnContainer = document.getElementById('quick-move-buttons');
            if (!btnContainer) return;
            btnContainer.innerHTML = '';

            const block = State.workspace.classes.find(c => c.id === id);
            if (!block) return;

            const isMasterKinder = State.workspace.activeTab === 'master_kinder';
            const isMasterG12 = State.workspace.activeTab === 'master_g12';
            const isMasterG36 = State.workspace.activeTab === 'master';

            const activeSlots = getActiveTimeSlotsForCurrentView();

            if (isMasterKinder) {
                activeSlots.forEach(slot => {
                    if (slot.type === 'universal') return;
                    const btn = document.createElement('button');
                    btn.className = "text-left py-2 px-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 rounded-lg text-[11px] font-medium transition flex justify-between";
                    btn.innerHTML = `<span>${formatTo12Hour(slot.start)} (Kinder)</span> <span class="text-[9px] text-slate-400 font-bold">Move</span>`;
                    btn.onclick = () => {
                        executeDragMoveMaster(State.activeQuickMoveId, "Kindergarten", slot.id);
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
                            executeDragMoveMaster(State.activeQuickMoveId, g, slot.id);
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
                            executeDragMoveMaster(State.activeQuickMoveId, g, slot.id);
                            closePopover();
                        };
                        btnContainer.appendChild(btn);
                    });
                });
            } else {
                const activeSections = State.workspace.sections.filter(sec => sec.grade === State.workspace.gradelevelFilter);
                activeSlots.forEach(slot => {
                    if (slot.type === 'universal') return;
                    activeSections.forEach(sec => {
                        const btn = document.createElement('button');
                        btn.className = "text-left py-2 px-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 rounded-lg text-[11px] font-medium transition flex justify-between font-semibold";
                        btn.innerHTML = `<span>${formatTo12Hour(slot.start)} (${sec.name})</span> <span class="text-[9px] text-slate-400 font-bold">Move</span>`;
                        btn.onclick = () => {
                            executeDragMoveSection(State.activeQuickMoveId, sec.id, slot.id, State.workspace.gradelevelDayFilter);
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
            State.activeQuickMoveId = null;
            document.getElementById('quick-move-popover').style.display = 'none';
        };

        const populateSelects = (prefix) => {
            const subSel = document.getElementById(`${prefix}-subject-select`);
            const teachSel = document.getElementById(`${prefix}-teacher-select`);

            if (!subSel || !teachSel) return;

            subSel.innerHTML = ''; teachSel.innerHTML = ''; 

            State.workspace.subjects.forEach(s => subSel.add(new Option(s.name, s.id)));
            State.workspace.teachers.forEach(t => teachSel.add(new Option(t.name, t.id)));
            
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
                
                State.draggedBlockId = blockId;
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

                        if (State.workspace.activeTab.startsWith('master') && grade && slotId) {
                            executeDragMoveMaster(State.draggedBlockId, grade, slotId);
                        } else if (State.workspace.activeTab === 'gradelevel' && sectionId && slotId) {
                            executeDragMoveSection(State.draggedBlockId, sectionId, slotId, State.workspace.gradelevelDayFilter);
                        }
                        lastTargetCell = null;
                    }
                    State.draggedBlockId = null;

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
                    showToast(`Displaced block was removed`);
                }

                block.grade = grade;
                block.sectionId = ''; 
                block.timeSlotId = slotId;
                block.day = 'master';
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderAll();
                showToast("Schedule updated!");
            }
            State.draggedBlockId = null;
        };

        const executeDragMoveSection = (blockId, sectionId, slotId, dayFilter) => {
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
                    showToast(`Displaced block was removed`);
                }

                block.grade = targetSection.grade;
                block.sectionId = sectionId;
                block.timeSlotId = slotId;
                block.day = dayFilter;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderAll();
                showToast("Schedule updated!");
            }
            State.draggedBlockId = null;
        };

        const exportData = () => {
            try {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(State.workspace, null, 2));
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
                        State.workspace = migrateLegacyData(importedState);
                        saveState(isCloudConnected, currentRoomCode, saveToCloud);
                        setActiveTab(State.workspace.activeTab);
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
                const displaced = State.workspace.classes.find(c => {
                    if (day === 'master') {
                        return c.day === 'master' && c.timeSlotId === timeSlotId && c.grade === grade;
                    } else {
                        return c.day === day && c.timeSlotId === timeSlotId && c.sectionId === sectionId;
                    }
                });
                if (displaced) {
                    State.workspace.classes = State.workspace.classes.filter(c => c.id !== displaced.id);
                    showToast(`Displaced block was removed`);
                }
            }

            const newBlock = { id: generateId('c'), subjectId, grade, sectionId, teacherId, timeSlotId, day };
            State.workspace.classes.push(newBlock);
            
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            closeCreateModal();
            renderAll();
            showToast("Matrix class block created!");
        };

        const handleSaveEdit = (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-class-id').value;
            const block = State.workspace.classes.find(c => c.id === id);
            
            if (block) {
                const newSlot = document.getElementById('edit-timeslot-select').value;
                const newTeacher = document.getElementById('edit-teacher-select').value;
                const newSubject = document.getElementById('edit-subject-select').value;

                if (newSlot) {
                    const displaced = State.workspace.classes.find(c => 
                        c.id !== block.id && 
                        c.day === block.day && 
                        c.timeSlotId === newSlot && 
                        (block.day === 'master' ? c.grade === block.grade : c.sectionId === block.sectionId)
                    );
                    if (displaced) {
                        State.workspace.classes = State.workspace.classes.filter(c => c.id !== displaced.id);
                    }
                }

                block.subjectId = newSubject;
                block.teacherId = newTeacher;
                block.timeSlotId = newSlot;

                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                closeEditModal();
                renderAll();
                showToast("Block program details saved.");
            }
        };

        const deleteBlock = (id) => {
            showConfirm("Delete Schedule Block", "Are you sure you want to remove this academic block?", () => {
                State.workspace.classes = State.workspace.classes.filter(c => c.id !== id);
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderAll();
                showToast("Schedule block deleted.");
            });
        };

        const setResourceTab = (tab) => {
            State.activeResourceTab = tab;
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
                document.getElementById('cfg-region').value = State.workspace.schoolConfig.region;
                document.getElementById('cfg-division').value = State.workspace.schoolConfig.division;
                document.getElementById('cfg-district').value = State.workspace.schoolConfig.district;
                document.getElementById('cfg-schoolName').value = State.workspace.schoolConfig.schoolName;
                document.getElementById('cfg-schoolAddress').value = State.workspace.schoolConfig.schoolAddress;
                document.getElementById('cfg-sy').value = State.workspace.schoolConfig.schoolYear;
                document.getElementById('cfg-sig1-name').value = State.workspace.schoolConfig.signatory1Name;
                document.getElementById('cfg-sig1-title').value = State.workspace.schoolConfig.signatory1Title;
                document.getElementById('cfg-sig2-name').value = State.workspace.schoolConfig.signatory2Name;
                document.getElementById('cfg-sig2-title').value = State.workspace.schoolConfig.signatory2Title;
            }
            if (tab === 'timeslots') {
                document.getElementById('cfg-ripple-cascade').checked = State.workspace.rippleCascadeEnabled !== false;
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

            State.workspace.timeSlots.push(newSlot);
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            
            document.getElementById('slot-start-input').value = '';
            document.getElementById('slot-end-input').value = '';
            document.getElementById('slot-label-input').value = '';
            showToast("New Time Slot row added.");
        };

        const moveTimeSlotUp = (index) => {
            if (index <= 0) return;
            const temp = State.workspace.timeSlots[index];
            State.workspace.timeSlots[index] = State.workspace.timeSlots[index - 1];
            State.workspace.timeSlots[index - 1] = temp;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Time slot moved up.");
        };

        const moveTimeSlotDown = (index) => {
            if (index >= State.workspace.timeSlots.length - 1) return;
            const temp = State.workspace.timeSlots[index];
            State.workspace.timeSlots[index] = State.workspace.timeSlots[index + 1];
            State.workspace.timeSlots[index + 1] = temp;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Time slot moved down.");
        };

        const sortTimeSlotsChronologically = () => {
            State.workspace.timeSlots.sort((a, b) => timeToMins(a.start) - timeToMins(b.start));
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Time slots sorted chronologically.");
        };

        const deleteTimeSlot = (id) => {
            const assignedClasses = State.workspace.classes.filter(c => c.timeSlotId === id);
            
            const performDelete = () => {
                State.workspace.classes = State.workspace.classes.filter(c => c.timeSlotId !== id);
                State.workspace.timeSlots = State.workspace.timeSlots.filter(ts => ts.id !== id);
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
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
                if (State.workspace.grades.includes(name)) {
                    showToast("Grade level already exists.", "error");
                    return;
                }
                State.workspace.grades.push(name);
                input.value = '';
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
                showToast("Grade level added.");
            }
        };

        const deleteGrade = (grade) => {
            const assignedClasses = State.workspace.classes.filter(c => c.grade === grade);
            
            const performDelete = () => {
                State.workspace.classes = State.workspace.classes.filter(c => c.grade !== grade);
                State.workspace.grades = State.workspace.grades.filter(g => g !== grade);
                State.workspace.sections = State.workspace.sections.filter(sec => sec.grade !== grade);
                if (State.workspace.advisers[grade]) {
                    delete State.workspace.advisers[grade];
                }
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
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
            const temp = State.workspace.grades[index];
            State.workspace.grades[index] = State.workspace.grades[index - 1];
            State.workspace.grades[index - 1] = temp;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Grade column reordered.");
        };

        const moveGradeDown = (index) => {
            if (index >= State.workspace.grades.length - 1) return;
            const temp = State.workspace.grades[index];
            State.workspace.grades[index] = State.workspace.grades[index + 1];
            State.workspace.grades[index + 1] = temp;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
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

            if (State.workspace.sections.some(s => s.grade === grade && s.name === name)) {
                showToast("Section name already exists in this Grade Level.", "error");
                return;
            }

            State.workspace.sections.push({
                id: generateId('sec'),
                name,
                grade
            });
            if (input) input.value = '';
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Section added.");
        };

        const deleteSection = (sectionId) => {
            const assignedClasses = State.workspace.classes.filter(c => c.sectionId === sectionId);
            
            const performDelete = () => {
                State.workspace.classes = State.workspace.classes.filter(c => c.sectionId !== sectionId);
                State.workspace.sections = State.workspace.sections.filter(sec => sec.id !== sectionId);
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
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
            const list = State.workspace.sections.filter(s => s.grade === grade);
            if (index <= 0) return;
            const globalIndex1 = State.workspace.sections.findIndex(s => s.id === list[index].id);
            const globalIndex2 = State.workspace.sections.findIndex(s => s.id === list[index - 1].id);
            
            const temp = State.workspace.sections[globalIndex1];
            State.workspace.sections[globalIndex1] = State.workspace.sections[globalIndex2];
            State.workspace.sections[globalIndex2] = temp;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Sections reordered.");
        };

        const moveSectionDown = (index, grade) => {
            const list = State.workspace.sections.filter(s => s.grade === grade);
            if (index >= list.length - 1) return;
            const globalIndex1 = State.workspace.sections.findIndex(s => s.id === list[index].id);
            const globalIndex2 = State.workspace.sections.findIndex(s => s.id === list[index + 1].id);
            
            const temp = State.workspace.sections[globalIndex1];
            State.workspace.sections[globalIndex1] = State.workspace.sections[globalIndex2];
            State.workspace.sections[globalIndex2] = temp;
            saveState(isCloudConnected, currentRoomCode, saveToCloud);
            renderResourceLists();
            renderAll();
            showToast("Sections reordered.");
        };

        const startTeacherEdit = (id) => {
            State.editingTeacherId = id;
            renderResourceLists();
        };

        const cancelTeacherEdit = () => {
            State.editingTeacherId = null;
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
            const teacher = State.workspace.teachers.find(t => t.id === id);
            if (teacher) {
                teacher.name = newName;
                State.editingTeacherId = null;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
                showToast("Teacher name globally updated!");
            }
        };

        const updateTeacherColorInline = (id, colorKey) => {
            const teacher = State.workspace.teachers.find(t => t.id === id);
            if (teacher) {
                teacher.color = colorKey;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
            }
        };

        const startSubjectEdit = (id) => {
            State.editingSubjectId = id;
            renderResourceLists();
        };

        const cancelSubjectEdit = () => {
            State.editingSubjectId = null;
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
            const subject = State.workspace.subjects.find(s => s.id === id);
            if (subject) {
                subject.name = newName;
                State.editingSubjectId = null;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
                showToast("Subject updated globally!");
            }
        };

        const startSectionEdit = (id) => {
            State.editingSectionId = id;
            renderResourceLists();
        };

        const cancelSectionEdit = () => {
            State.editingSectionId = null;
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
            const section = State.workspace.sections.find(s => s.id === id);
            if (section) {
                section.name = newName;
                State.editingSectionId = null;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
                showToast("Section title updated globally!");
            }
        };

        const startTimeSlotEdit = (id) => {
            State.editingTimeSlotId = id;
            renderResourceLists();
        };

        const cancelTimeSlotEdit = () => {
            State.editingTimeSlotId = null;
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

            const tsObj = State.workspace.timeSlots.find(t => t.id === id);
            if (tsObj) {
                tsObj.start = start;
                tsObj.end = end;
                tsObj.mins = endMins - startMins;
                if (tsObj.type === 'universal' && labelInput) {
                    tsObj.label = labelInput.value.trim().toUpperCase() || "UNIVERSAL EVENT";
                }

                if (State.workspace.rippleCascadeEnabled !== false) {
                    const targetGroup = tsObj.group;
                    const sortedSlots = [...State.workspace.timeSlots].sort((a, b) => timeToMins(a.start) - timeToMins(b.start));
                    const editIdx = sortedSlots.findIndex(t => t.id === id);
                    
                    let currentEndMins = endMins;
                    for (let i = editIdx + 1; i < sortedSlots.length; i++) {
                        const nextTs = sortedSlots[i];
                        if (nextTs.group === targetGroup || targetGroup === 'all' || nextTs.group === 'all') {
                            const dur = nextTs.mins;
                            const nextStartStr = minsToTime(currentEndMins);
                            const nextEndStr = minsToTime(currentEndMins + dur);
                            
                            const actualTs = State.workspace.timeSlots.find(t => t.id === nextTs.id);
                            if (actualTs) {
                                actualTs.start = nextStartStr;
                                actualTs.end = nextEndStr;
                            }
                            currentEndMins += dur;
                        }
                    }
                }

                State.editingTimeSlotId = null;
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll();
                showToast("Time slot row updated successfully!");
            }
        };

        const renderResourceLists = () => {
            if (State.activeResourceTab === 'subjects') {
                const subList = document.getElementById('subjects-list-container');
                subList.innerHTML = State.workspace.subjects.map(s => {
                    const isEditing = State.editingSubjectId === s.id;
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
                        <div class="flex justify-between items-center p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition">
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

            if (State.activeResourceTab === 'teachers') {
                const teachList = document.getElementById('teachers-list-container');
                teachList.innerHTML = State.workspace.teachers.map(t => {
                    const isEditing = State.editingTeacherId === t.id;
                    
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
                        <div class="flex justify-between items-center p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition">
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
                State.workspace.grades.forEach(grade => {
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
                    State.workspace.teachers.forEach(t => {
                        select.add(new Option(t.name, t.id));
                    });
                    select.value = State.workspace.advisers[grade] || '';
                    
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

            if (State.activeResourceTab === 'timeslots') {
                const slotsContainer = document.getElementById('timeslots-list-container');
                
                const filteredList = State.workspace.timeSlots
                    .map((ts, idx) => ({ ts, originalIndex: idx }))
                    .filter(({ ts }) => {
                        if (State.activeTimeSlotFilter === 'all') return true;
                        if (State.activeTimeSlotFilter === 'all_shared') return ts.group === 'all';
                        return ts.group === State.activeTimeSlotFilter;
                    });

                slotsContainer.innerHTML = filteredList.map(({ ts, originalIndex }) => {
                    const isUniversal = ts.type === 'universal';
                    const typeBadge = isUniversal 
                        ? `<span class="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-100 text-amber-800 uppercase shrink-0 font-bold">Universal Event</span>` 
                        : `<span class="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-100 text-blue-800 uppercase shrink-0 font-bold">Academic Grid</span>`;
                    
                    const isEditing = State.editingTimeSlotId === ts.id;
                    
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
                                    <select onchange="updateTimeSlotGroup('${ts.id}', this.value)" class="bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-600 font-bold rounded px-1.5 py-0.5 text-[9px] uppercase cursor-pointer transition-colors focus:outline-none">
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
                                <button type="button" onclick="moveTimeSlotDown(${originalIndex})" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${originalIndex === State.workspace.timeSlots.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}" ${originalIndex === State.workspace.timeSlots.length - 1 ? 'disabled' : ''}>
                                    <i data-lucide="arrow-down" class="w-3.5 h-3.5 font-bold"></i>
                                </button>
                                <button type="button" onclick="deleteTimeSlot('${ts.id}')" class="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 transition ml-1" title="Delete Time Slot"><i data-lucide="trash-2" class="w-3.5 h-3.5 font-bold"></i></button>
                            </div>
                        </div>
                        `;
                    }
                }).join('');
            }

            if (State.activeResourceTab === 'grades') {
                const gradesContainer = document.getElementById('grades-list-container');
                gradesContainer.innerHTML = State.workspace.grades.map((grade, index) => `
                    <div class="flex justify-between items-center p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <span class="text-xs font-bold text-slate-700">${escapeHtml(grade)}</span>
                        <div class="flex items-center gap-1 shrink-0">
                            <button type="button" onclick="moveGradeUp(${index})" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}" ${index === 0 ? 'disabled' : ''}><i data-lucide="arrow-up" class="w-4 h-4 font-bold"></i></button>
                            <button type="button" onclick="moveGradeDown(${index})" class="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition ${index === State.workspace.grades.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}" ${index === State.workspace.grades.length - 1 ? 'disabled' : ''}><i data-lucide="arrow-down" class="w-4 h-4 font-bold"></i></button>
                            <button type="button" onclick="deleteGrade('${grade}')" class="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 transition ml-1 font-bold"><i data-lucide="x" class="w-4 h-4 font-bold"></i></button>
                        </div>
                    </div>
                `).join('');
            }

            if (State.activeResourceTab === 'sections') {
                const secContainer = document.getElementById('sections-list-container');
                const gradeSel = document.getElementById('section-grade-select');
                
                gradeSel.innerHTML = '';
                State.workspace.grades.forEach(g => {
                    gradeSel.add(new Option(g, g));
                });

                let sectionsHtml = '';
                State.workspace.grades.forEach(grade => {
                    const gradeSections = State.workspace.sections.filter(s => s.grade === grade);
                    if (gradeSections.length > 0) {
                        sectionsHtml += `
                            <div class="mb-3 font-semibold">
                                <h5 class="text-xs font-extrabold text-slate-500 uppercase border-b border-slate-200 pb-1 mb-1 font-bold">${escapeHtml(grade)}</h5>
                                <div class="space-y-1">
                                    ${gradeSections.map((sec, idx) => {
                                        const isEditing = State.editingSectionId === sec.id;
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
                                            <div class="flex justify-between items-center p-2 bg-white border border-slate-200 rounded-lg shadow-xs">
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
                State.workspace.subjects.push({ id: generateId('s'), name });
                input.value = '';
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
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
                State.workspace.teachers.push({ id: generateId('t'), name, color });
                input.value = '';
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
                renderResourceLists();
                renderAll(); 
                showToast(`Teacher "${name}" added to list.`);
            }
        };

        const deleteSubject = (id) => {
            if(State.workspace.classes.some(c => c.subjectId === id)) {
                showToast("Cannot delete subject: It is assigned to scheduled classes.", "error");
                return;
            }
            State.workspace.subjects = State.workspace.subjects.filter(s => s.id !== id);
            saveState(isCloudConnected, currentRoomCode, saveToCloud); 
            renderResourceLists();
            renderAll(); 
            showToast("Subject removed.");
        };

        const deleteTeacher = (id) => {
            if(State.workspace.classes.some(c => c.teacherId === id)) {
                showToast("Cannot delete teacher: They are assigned to classes.", "error");
                return;
            }
            State.workspace.teachers = State.workspace.teachers.filter(t => t.id !== id);
            saveState(isCloudConnected, currentRoomCode, saveToCloud); 
            renderResourceLists();
            renderAll(); 
            showToast("Teacher removed.");
        };

        const resetBoard = () => {
            showConfirm("Reset Entire Program Placements", "Are you sure you want to clear your current schedule placements? This preserves your custom resources.", () => {
                State.workspace.classes = [];
                saveState(isCloudConnected, currentRoomCode, saveToCloud);
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
            if (!State.activeSelectedCardId) {
                State.workspace.teachers.forEach(t => {
                    const el = document.getElementById(`live-status-${t.id}`);
                    if (el) el.innerHTML = getLiveStatus(t.id);
                });
            }
        }, 60000);

        
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        let firebaseConfig = null;
        if (typeof __firebase_config !== 'undefined' && __firebase_config) {
            try { firebaseConfig = JSON.parse(__firebase_config); } catch (e) { }
        }
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        setupCloudSync(firebaseConfig, initialAuthToken, appId, { showToast, renderAll });

        window.onload = function () {
        setupDragDrop({ showToast, renderAll });
        setupScheduling({ showToast, renderAll, renderResourceLists });
        setupImportExport({ showToast, setActiveTab });
            loadState();
            setActiveTab(State.workspace.activeTab || 'master');
            initCloudSync(initialAuthToken);
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
