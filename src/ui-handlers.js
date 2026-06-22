        // --- 3-COLUMN LAYOUT LOGIC ---
        window.toggleSidebar = function(side) {
            const sidebar = document.getElementById('global-' + side + '-sidebar');
            const toggleBtn = document.getElementById(side + '-sidebar-toggle');
            const icon = toggleBtn ? toggleBtn.querySelector('i, svg') : null;
            
            if (side === 'left') {
                const isExpanded = sidebar.classList.contains('w-64');
                const texts = sidebar.querySelectorAll('.nav-text');
                const labels = sidebar.querySelectorAll('.nav-label');
                const tooltips = sidebar.querySelectorAll('.nav-tooltip');
                const navBtns = sidebar.querySelectorAll('.nav-btn');
                const bottomArea = document.getElementById('nav-bottom-area');
                const savedSchedulesSection = document.getElementById('saved-schedules-section');
                const savedSchedulesCollapsed = document.getElementById('saved-schedules-collapsed-icon');

                if (!isExpanded) {
                    // Expand Left Sidebar
                    sidebar.classList.remove('w-[72px]');
                    const logoExpanded = document.getElementById('sidebar-logo-expanded');
                    const logoCollapsed = document.getElementById('sidebar-logo-collapsed');
                    if (logoExpanded) logoExpanded.classList.remove('hidden');
                    if (logoCollapsed) logoCollapsed.classList.add('hidden');
                    sidebar.classList.add('w-64');
                    if (icon) icon.style.transform = 'rotate(0deg)';
                    if (bottomArea) bottomArea.classList.replace('justify-center', 'justify-end');
                    
                    if (savedSchedulesCollapsed) savedSchedulesCollapsed.classList.add('hidden');
                    if (savedSchedulesSection) {
                        savedSchedulesSection.classList.remove('hidden');
                        setTimeout(() => savedSchedulesSection.style.opacity = '1', 50);
                    }

                    navBtns.forEach(b => {
                        b.classList.remove('justify-center', 'px-0');
                        b.classList.add('justify-start', 'px-3');
                    });
                    
                    texts.forEach(t => { t.style.display = 'block'; setTimeout(() => t.style.opacity = '1', 50); });
                    labels.forEach(l => { l.style.display = 'block'; setTimeout(() => l.style.opacity = '1', 50); });
                    tooltips.forEach(t => t.classList.add('hidden'));
                } else {
                    // Collapse Left Sidebar
                    sidebar.classList.remove('w-64');
                    const logoExpanded = document.getElementById('sidebar-logo-expanded');
                    const logoCollapsed = document.getElementById('sidebar-logo-collapsed');
                    if (logoExpanded) logoExpanded.classList.add('hidden');
                    if (logoCollapsed) logoCollapsed.classList.remove('hidden');
                    sidebar.classList.add('w-[72px]');
                    if (icon) icon.style.transform = 'rotate(180deg)';
                    if (bottomArea) bottomArea.classList.replace('justify-end', 'justify-center');
                    
                    if (savedSchedulesSection) {
                        savedSchedulesSection.style.opacity = '0';
                        setTimeout(() => {
                            savedSchedulesSection.classList.add('hidden');
                            if (savedSchedulesCollapsed) savedSchedulesCollapsed.classList.remove('hidden');
                            if (savedSchedulesCollapsed) savedSchedulesCollapsed.classList.add('flex');
                        }, 300);
                    }

                    navBtns.forEach(b => {
                        b.classList.remove('justify-start', 'px-3');
                        b.classList.add('justify-center', 'px-0');
                    });
                    
                    texts.forEach(t => { t.style.opacity = '0'; setTimeout(() => t.style.display = 'none', 300); });
                    labels.forEach(l => { l.style.opacity = '0'; setTimeout(() => l.style.display = 'none', 300); });
                    tooltips.forEach(t => t.classList.remove('hidden'));
                }
            } else {
                // Right Sidebar Logic (Completely hide/show)
                if (sidebar.classList.contains('w-0')) {
                    sidebar.classList.remove('w-0', 'border-none', 'px-0');
                    sidebar.classList.add('w-72', 'border-l');
                    icon.setAttribute('data-lucide', 'chevron-right');
                    Array.from(sidebar.children).forEach(c => {
                        if (c.tagName !== 'BUTTON') c.style.opacity = '1';
                    });
                } else {
                    sidebar.classList.add('w-0', 'border-none', 'px-0');
                    sidebar.classList.remove('w-72', 'border-l');
                    icon.setAttribute('data-lucide', 'chevron-left');
                    Array.from(sidebar.children).forEach(c => {
                        if (c.tagName !== 'BUTTON') c.style.opacity = '0';
                    });
                }
            }
            if (window.lucide) lucide.createIcons();
        };

        window.setMainView = function(view) {
            ['dashboard', 'schedule', 'summary', 'teachers'].forEach(v => {
                const btn = document.getElementById('nav-btn-' + v);
                if (btn) {
                    if (v === view) {
                        btn.classList.remove('text-slate-600', 'hover:bg-slate-50');
                        btn.classList.add('bg-emerald-50', 'text-emerald-700');
                    } else {
                        btn.classList.add('text-slate-600', 'hover:bg-slate-50');
                        btn.classList.remove('bg-emerald-50', 'text-emerald-700', 'hover:bg-emerald-100');
                    }
                }
                
                const toolContainer = document.getElementById('right-tools-' + v);
                if (toolContainer) {
                    if (v === view) toolContainer.classList.remove('hidden');
                    else toolContainer.classList.add('hidden');
                }
            });

            const workspace = document.getElementById('workspace-container');
            const dashboard = document.getElementById('center-dashboard');
            const teachersView = document.getElementById('center-teachers');
            const horizontalTabs = document.querySelector('.flex.gap-2.mb-4.border-b');

            if (view === 'dashboard') {
                if (workspace) workspace.style.display = 'none';
                if (horizontalTabs) horizontalTabs.style.display = 'none';
                if (teachersView) teachersView.style.display = 'none';
                if (dashboard) dashboard.style.display = 'flex';
            } else if (view === 'teachers') {
                if (workspace) workspace.style.display = 'none';
                if (horizontalTabs) horizontalTabs.style.display = 'none';
                if (dashboard) dashboard.style.display = 'none';
                if (teachersView) teachersView.style.display = 'flex';
                if (typeof window.renderTeacherDashboard === 'function') window.renderTeacherDashboard();
            } else if (view === 'schedule') {
                if (workspace) workspace.style.display = 'flex';
                if (horizontalTabs) horizontalTabs.style.display = 'flex';
                if (dashboard) dashboard.style.display = 'none';
                
                const activeTab = document.querySelector('.tab-active');
                if (!activeTab || activeTab.id === 'tab-summary') {
                    if (typeof setActiveTab === 'function') setActiveTab('master_kinder');
                }
            } else if (view === 'summary') {
                if (workspace) workspace.style.display = 'flex';
                if (horizontalTabs) horizontalTabs.style.display = 'none';
                if (dashboard) dashboard.style.display = 'none';
                if (teachersView) teachersView.style.display = 'none';
                if (typeof setActiveTab === 'function') setActiveTab('summary');
            }
        };

        setTimeout(() => {
            renderSavedSchedules();
        }, 100);

        // --- CLASS PROGRAM ARCHITECTURE HANDLERS ---

        window.populateSectionsDropdownForProgramCreate = function(grade) {
            const select = document.getElementById('cp-section');
            if (!select) return;
            select.innerHTML = '';
            
            const sections = (window.workspaceState?.sections || []).filter(s => s.grade === grade);
            sections.forEach(sec => {
                const opt = document.createElement('option');
                opt.value = sec.id;
                opt.innerText = sec.name;
                select.appendChild(opt);
            });
        };

        window.handleProgramTypeChange = function(type) {
            const indDiv = document.getElementById('cp-ind-config');
            const multiDiv = document.getElementById('cp-multi-config');
            const masterDiv = document.getElementById('cp-master-config');
            
            if (indDiv) indDiv.style.display = type === 'individual' ? 'flex' : 'none';
            if (multiDiv) multiDiv.style.display = type === 'multigrade' ? 'block' : 'none';
            if (masterDiv) masterDiv.style.display = type === 'master' ? 'block' : 'none';
        };

        window.openCreateProgramModal = function(programId = null) {
            const modal = document.getElementById('create-program-modal');
            const title = document.getElementById('create-program-modal-title');
            const idInput = document.getElementById('cp-id');
            const nameInput = document.getElementById('cp-name');
            const typeSelect = document.getElementById('cp-type');
            const gradeSelect = document.getElementById('cp-grade');
            const saveBtnText = document.getElementById('cp-save-btn-text');
            
            if (!modal) return;
            
            // Populate Grades select
            if (gradeSelect) {
                gradeSelect.innerHTML = '';
                const grades = window.workspaceState?.grades || [];
                grades.forEach(g => {
                    const opt = document.createElement('option');
                    opt.value = g;
                    opt.innerText = g;
                    gradeSelect.appendChild(opt);
                });
            }
            
            // Populate Multi-Grade Sections checklists
            const multiContainer = document.getElementById('cp-multi-sections-container');
            if (multiContainer) {
                multiContainer.innerHTML = '';
                const sections = window.workspaceState?.sections || [];
                sections.forEach(sec => {
                    const div = document.createElement('label');
                    div.className = 'flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 p-1.5 rounded-lg';
                    div.innerHTML = `
                        <input type="checkbox" name="cp-multi-sections" value="${sec.id}" class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500">
                        <span>${sec.grade} - ${sec.name}</span>
                    `;
                    multiContainer.appendChild(div);
                });
            }
            
            // Populate Master sub-programs checklist (exclude master programs themselves to prevent recursion)
            const masterContainer = document.getElementById('cp-master-programs-container');
            if (masterContainer) {
                masterContainer.innerHTML = '';
                const programs = (window.workspaceState?.programs || []).filter(p => p.type !== 'master');
                programs.forEach(prog => {
                    const div = document.createElement('label');
                    div.className = 'flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 p-1.5 rounded-lg';
                    div.innerHTML = `
                        <input type="checkbox" name="cp-master-progs" value="${prog.id}" class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500">
                        <span>${prog.name} (${prog.type})</span>
                    `;
                    masterContainer.appendChild(div);
                });
            }

            if (programId) {
                // Edit Mode
                const prog = window.workspaceState.programs.find(p => p.id === programId);
                if (!prog) return;
                
                title.innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-emerald-500"></i> Edit Class Program`;
                idInput.value = prog.id;
                nameInput.value = prog.name || '';
                typeSelect.value = prog.type;
                typeSelect.disabled = true; // Block switching type of existing program to prevent mapping errors
                saveBtnText.innerText = 'Save Changes';
                
                window.handleProgramTypeChange(prog.type);
                
                if (prog.type === 'individual') {
                    if (gradeSelect) {
                        gradeSelect.value = prog.grade || '';
                        window.populateSectionsDropdownForProgramCreate(prog.grade);
                        const secSelect = document.getElementById('cp-section');
                        if (secSelect) secSelect.value = prog.sectionId || '';
                    }
                } else if (prog.type === 'multigrade') {
                    const checkboxes = document.querySelectorAll('input[name="cp-multi-sections"]');
                    checkboxes.forEach(cb => {
                        cb.checked = (prog.sectionIds || []).includes(cb.value);
                    });
                } else if (prog.type === 'master') {
                    const checkboxes = document.querySelectorAll('input[name="cp-master-progs"]');
                    checkboxes.forEach(cb => {
                        cb.checked = (prog.subProgramIds || []).includes(cb.value);
                    });
                }
            } else {
                // Create Mode
                title.innerHTML = `<i data-lucide="file-plus" class="w-5 h-5 text-emerald-500"></i> Create Class Program`;
                idInput.value = '';
                nameInput.value = '';
                typeSelect.value = 'individual';
                typeSelect.disabled = false;
                saveBtnText.innerText = 'Create Program';
                
                window.handleProgramTypeChange('individual');
                
                const grades = window.workspaceState?.grades || [];
                if (grades.length > 0) {
                    if (gradeSelect) gradeSelect.value = grades[0];
                    window.populateSectionsDropdownForProgramCreate(grades[0]);
                }
            }
            
            modal.style.display = 'flex';
            if (window.lucide) lucide.createIcons();
        };

        window.closeCreateProgramModal = function() {
            const modal = document.getElementById('create-program-modal');
            if (modal) modal.style.display = 'none';
        };

        window.handleSaveProgram = function() {
            const id = document.getElementById('cp-id').value;
            const name = document.getElementById('cp-name').value.trim();
            const type = document.getElementById('cp-type').value;
            
            if (!name) {
                if (typeof window.showToast === 'function') window.showToast("Please enter a program name.", "error");
                return;
            }
            
            let programData = { id: id || `prog-${Math.random().toString(36).substr(2, 9)}`, name, type };
            
            if (type === 'individual') {
                const grade = document.getElementById('cp-grade').value;
                const sectionId = document.getElementById('cp-section').value;
                if (!grade || !sectionId) {
                    if (typeof window.showToast === 'function') window.showToast("Please configure grade and section.", "error");
                    return;
                }
                programData.grade = grade;
                programData.sectionId = sectionId;
            } else if (type === 'multigrade') {
                const checked = Array.from(document.querySelectorAll('input[name="cp-multi-sections"]:checked')).map(cb => cb.value);
                if (checked.length === 0) {
                    if (typeof window.showToast === 'function') window.showToast("Please select at least one section to combine.", "error");
                    return;
                }
                programData.sectionIds = checked;
            } else if (type === 'master') {
                const checked = Array.from(document.querySelectorAll('input[name="cp-master-progs"]:checked')).map(cb => cb.value);
                if (checked.length === 0) {
                    if (typeof window.showToast === 'function') window.showToast("Please select at least one program to combine.", "error");
                    return;
                }
                programData.subProgramIds = checked;
            }
            
            if (!window.workspaceState.programs) window.workspaceState.programs = [];
            
            if (id) {
                // Update
                const idx = window.workspaceState.programs.findIndex(p => p.id === id);
                if (idx !== -1) window.workspaceState.programs[idx] = programData;
            } else {
                // Insert
                window.workspaceState.programs.push(programData);
            }
            
            window.workspaceState.activeProgramId = programData.id;
            
            // Sync activeTab
            if (programData.id === 'prog-master-kinder') {
                window.workspaceState.activeTab = 'master_kinder';
            } else if (programData.id === 'prog-master-g12') {
                window.workspaceState.activeTab = 'master_g12';
            } else if (programData.id === 'prog-master-g36') {
                window.workspaceState.activeTab = 'master';
            } else {
                window.workspaceState.activeTab = 'program';
            }

            if (typeof window.saveState === 'function') window.saveState();
            if (typeof window.renderAll === 'function') window.renderAll();
            if (typeof window.renderSavedSchedules === 'function') window.renderSavedSchedules();
            
            window.closeCreateProgramModal();
            if (typeof window.showToast === 'function') window.showToast(`Saved program "${name}"`);
        };

        window.handleDeleteProgram = function(programId) {
            const prog = window.workspaceState?.programs?.find(p => p.id === programId);
            if (!prog) return;
            
            if (typeof window.showConfirm === 'function') {
                window.showConfirm(
                    "Delete Class Program", 
                    `Are you sure you want to delete the program "${prog.name}"? Scheduled class blocks within this program will also be deleted.`, 
                    () => {
                        window.workspaceState.programs = window.workspaceState.programs.filter(p => p.id !== programId);
                        
                        // Clear associated classes
                        if (window.workspaceState.classes) {
                            window.workspaceState.classes = window.workspaceState.classes.filter(c => c.programId !== programId);
                        }
                        
                        // Re-route active program
                        if (window.workspaceState.activeProgramId === programId) {
                            window.workspaceState.activeProgramId = window.workspaceState.programs[0]?.id || "";
                            if (window.workspaceState.activeProgramId) {
                                const activeProg = window.workspaceState.programs[0];
                                if (activeProg.id === 'prog-master-kinder') window.workspaceState.activeTab = 'master_kinder';
                                else if (activeProg.id === 'prog-master-g12') window.workspaceState.activeTab = 'master_g12';
                                else if (activeProg.id === 'prog-master-g36') window.workspaceState.activeTab = 'master';
                                else window.workspaceState.activeTab = 'program';
                            }
                        }
                        
                        if (typeof window.saveState === 'function') window.saveState();
                        if (typeof window.renderAll === 'function') window.renderAll();
                        if (typeof window.renderSavedSchedules === 'function') window.renderSavedSchedules();
                        if (typeof window.showToast === 'function') window.showToast(`Deleted program "${prog.name}"`);
                    }
                );
            }
        };

        window.handleSplitProgram = function(programId) {
            const prog = window.workspaceState?.programs?.find(p => p.id === programId);
            if (!prog) return;
            
            if (prog.type === 'master') {
                if (typeof window.showConfirm === 'function') {
                    window.showConfirm(
                        "Dissolve Master Program",
                        `Are you sure you want to dissolve the Master Program "${prog.name}"? The individual sub-programs will remain intact.`,
                        () => {
                            window.workspaceState.programs = window.workspaceState.programs.filter(p => p.id !== programId);
                            if (window.workspaceState.activeProgramId === programId) {
                                window.workspaceState.activeProgramId = window.workspaceState.programs[0]?.id || "";
                                window.workspaceState.activeTab = 'program';
                            }
                            if (typeof window.saveState === 'function') window.saveState();
                            if (typeof window.renderAll === 'function') window.renderAll();
                            if (typeof window.renderSavedSchedules === 'function') window.renderSavedSchedules();
                            if (typeof window.showToast === 'function') window.showToast(`Dissolved Master Program`);
                        }
                    );
                }
            } else if (prog.type === 'multigrade') {
                if (typeof window.showConfirm === 'function') {
                    window.showConfirm(
                        "Split Multi-Grade Program",
                        `Are you sure you want to split "${prog.name}" into separate individual programs? This will copy all scheduled classes to each section so you can customize them separately.`,
                        () => {
                            const newPrograms = [];
                            
                            (prog.sectionIds || []).forEach(secId => {
                                const sectionObj = window.workspaceState.sections.find(s => s.id === secId);
                                if (!sectionObj) return;
                                
                                const newProgId = `prog-sec-${secId}`;
                                if (!window.workspaceState.programs.some(p => p.id === newProgId)) {
                                    window.workspaceState.programs.push({
                                        id: newProgId,
                                        name: `${sectionObj.grade} - ${sectionObj.name}`,
                                        type: 'individual',
                                        grade: sectionObj.grade,
                                        sectionId: secId
                                    });
                                }
                                
                                // Clone class blocks
                                const classesToClone = (window.workspaceState.classes || []).filter(c => c.programId === programId);
                                classesToClone.forEach(c => {
                                    window.workspaceState.classes.push({
                                        ...c,
                                        id: `c-split-${Math.random().toString(36).substr(2, 9)}`,
                                        sectionId: secId,
                                        programId: newProgId
                                    });
                                });
                            });
                            
                            // Delete multi-grade program and classes
                            window.workspaceState.programs = window.workspaceState.programs.filter(p => p.id !== programId);
                            window.workspaceState.classes = window.workspaceState.classes.filter(c => c.programId !== programId);
                            
                            window.workspaceState.activeProgramId = `prog-sec-${prog.sectionIds[0]}` || '';
                            window.workspaceState.activeTab = 'program';
                            
                            if (typeof window.saveState === 'function') window.saveState();
                            if (typeof window.renderAll === 'function') window.renderAll();
                            if (typeof window.renderSavedSchedules === 'function') window.renderSavedSchedules();
                            if (typeof window.showToast === 'function') window.showToast(`Split multi-grade program into individual sections.`);
                        }
                    );
                }
            }
        };

