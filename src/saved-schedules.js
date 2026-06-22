        window.collapsedYears = window.collapsedYears || [];

        window.toggleYearExpansion = function(year) {
            const idx = window.collapsedYears.indexOf(year);
            if (idx !== -1) {
                window.collapsedYears.splice(idx, 1);
            } else {
                window.collapsedYears.push(year);
            }
            window.renderSavedSchedules();
        };

        window.renderSavedSchedules = function() {
            const treeContainer = document.getElementById('saved-schedules-tree');
            if (!treeContainer) return;

            const years = (window.getAllSchoolYears && window.getAllSchoolYears()) || [];
            const activeYear = window.workspaceState?.schoolConfig?.schoolYear || '';

            if (years.length === 0) {
                treeContainer.innerHTML = `
                    <div class="px-3 py-4 text-center">
                        <p class="text-[11px] text-slate-400 font-medium">No school years found.</p>
                        <button onclick="window.openNewSYModal()" class="mt-2 text-[11px] text-emerald-600 font-bold hover:underline">+ Create one</button>
                    </div>
                `;
                if (window.lucide) lucide.createIcons();
                return;
            }

            let html = '';
            years.forEach(year => {
                const isActive = year === activeYear;
                const isCollapsed = window.collapsedYears.includes(year);
                html += `
                    <div class="mb-1">
                        <button
                            onclick="${isActive ? `window.toggleYearExpansion('${year}')` : `window.switchSchoolYear('${year}')`}"
                            class="flex items-center gap-2 w-full py-2 px-3 text-[13px] rounded-lg transition-colors text-left group ${isActive ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'}"
                        >
                            <i data-lucide="${isActive && !isCollapsed ? 'folder-open' : 'folder'}" class="w-4 h-4 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'} transition-colors"></i>
                            <span class="truncate flex-1">${year}</span>
                            ${isActive ? '<span class="text-[9px] font-bold bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full shrink-0">Active</span>' : ''}
                        </button>
                `;

                if (isActive && !isCollapsed) {
                    html += `<div class="pl-4 mt-1 mb-2 space-y-[2px] border-l border-slate-200 ml-5">`;
                    const programs = window.workspaceState?.programs || [];
                    const activeProgId = window.workspaceState?.activeProgramId || '';
                    programs.forEach(prog => {
                        const isProgActive = prog.id === activeProgId;
                        let iconName = 'file-text';
                        if (prog.type === 'multigrade') iconName = 'layers';
                        else if (prog.type === 'master') iconName = 'layout-grid';

                        html += `
                            <div class="group relative flex items-center justify-between w-full py-1.5 px-2 rounded-md transition-colors ${isProgActive ? 'bg-emerald-50/50 text-emerald-800 font-bold shadow-xs' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}">
                                <button
                                    onclick="window.switchClassProgram('${prog.id}')"
                                    class="flex items-center gap-1.5 flex-1 min-w-0 text-[12px] text-left"
                                >
                                    <i data-lucide="${iconName}" class="w-3.5 h-3.5 shrink-0 ${isProgActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'}"></i>
                                    <span class="truncate">${prog.name}</span>
                                </button>
                                
                                <div class="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 ml-1 transition-opacity">
                                    <button onclick="event.stopPropagation(); window.openCreateProgramModal('${prog.id}')" class="p-0.5 hover:text-emerald-600 rounded" title="Edit Program">
                                        <i data-lucide="edit-3" class="w-3 h-3"></i>
                                    </button>
                                    ${prog.type === 'master' ? `
                                        <button onclick="event.stopPropagation(); window.handleSplitProgram('${prog.id}')" class="p-0.5 hover:text-blue-600 rounded" title="Split Master Program">
                                            <i data-lucide="split" class="w-3 h-3"></i>
                                        </button>
                                    ` : ''}
                                    ${prog.type === 'multigrade' ? `
                                        <button onclick="event.stopPropagation(); window.handleSplitProgram('${prog.id}')" class="p-0.5 hover:text-blue-600 rounded" title="Split Multi-Grade Program">
                                            <i data-lucide="scissors" class="w-3 h-3"></i>
                                        </button>
                                    ` : ''}
                                    <button onclick="event.stopPropagation(); window.handleDeleteProgram('${prog.id}')" class="p-0.5 hover:text-rose-600 rounded" title="Delete Program">
                                        <i data-lucide="trash-2" class="w-3 h-3"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    });

                    // Add "Create Program" action button
                    html += `
                        <button
                            onclick="window.openCreateProgramModal()"
                            class="flex items-center gap-1.5 w-full py-1.5 px-2 text-[11px] text-slate-400 hover:text-emerald-600 hover:bg-slate-50 rounded-md transition-colors text-left font-bold"
                        >
                            <i data-lucide="plus" class="w-3.5 h-3.5 shrink-0"></i>
                            <span>Create Program</span>
                        </button>
                    `;
                    html += `</div>`;
                }

                html += `</div>`;
            });

            treeContainer.innerHTML = html;
            if (window.lucide) lucide.createIcons();
        };
