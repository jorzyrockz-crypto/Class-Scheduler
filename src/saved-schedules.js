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
                html += `
                    <button
                        onclick="window.switchSchoolYear('${year}')"
                        class="flex items-center gap-2 w-full py-2 px-3 text-[13px] rounded-lg transition-colors text-left group ${isActive ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'}"
                    >
                        <i data-lucide="${isActive ? 'folder-open' : 'folder'}" class="w-4 h-4 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'} transition-colors"></i>
                        <span class="truncate flex-1">${year}</span>
                        ${isActive ? '<span class="text-[9px] font-bold bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full shrink-0">Active</span>' : ''}
                    </button>
                `;
            });

            treeContainer.innerHTML = html;
            if (window.lucide) lucide.createIcons();
        };
