        const mockSavedSchedules = [
            {
                id: 'folder-1',
                name: 'School Year 2025-2026',
                type: 'folder',
                expanded: true,
                children: [
                    { id: 'sch-1', name: 'Draft: Sectioning A (Optimized)', type: 'schedule', timestamp: 'now', active: true },
                    { id: 'sch-2', name: 'Final Master Schedule v1', type: 'schedule', timestamp: '5h', active: false },
                    { id: 'sch-3', name: 'Kindergarten Morning Session Only', type: 'schedule', timestamp: '1d', active: false }
                ]
            },
            {
                id: 'folder-2',
                name: 'School Year 2024-2025',
                type: 'folder',
                expanded: false,
                children: [
                    { id: 'sch-4', name: 'Approved Final Matrix', type: 'schedule', timestamp: '8mo', active: false }
                ]
            }
        ];

        window.toggleFolder = function(folderId) {
            const folder = mockSavedSchedules.find(f => f.id === folderId);
            if (folder) {
                folder.expanded = !folder.expanded;
                renderSavedSchedules();
            }
        };

        window.renderSavedSchedules = function() {
            const treeContainer = document.getElementById('saved-schedules-tree');
            if (!treeContainer) return;
            
            let html = '';
            mockSavedSchedules.forEach(folder => {
                // Folder node
                html += `
                    <div>
                        <button onclick="toggleFolder('${folder.id}')" class="flex items-center w-full py-1.5 px-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors group">
                            <i data-lucide="${folder.expanded ? 'chevron-down' : 'chevron-right'}" class="w-3.5 h-3.5 text-slate-400 mr-1.5 transition-transform"></i>
                            <i data-lucide="${folder.expanded ? 'folder-open' : 'folder'}" class="w-4 h-4 text-slate-400 mr-2 group-hover:text-emerald-600 transition-colors"></i>
                            <span class="truncate font-medium text-[13px]">${folder.name}</span>
                        </button>
                `;
                
                // Children
                if (folder.expanded && folder.children) {
                    html += `<div class="ml-4 mt-0.5 space-y-0.5 border-l border-slate-200 pl-2">`;
                    folder.children.forEach(child => {
                        const activeClass = child.active ? 'bg-slate-200/60 text-slate-900 font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';
                        const timeClass = child.active ? 'text-slate-500' : 'text-slate-400';
                        html += `
                            <button class="flex items-center justify-between w-full py-1.5 px-2 text-[13px] rounded-md transition-colors group ${activeClass}">
                                <span class="truncate pr-2">${child.name}</span>
                                <span class="text-[10px] shrink-0 ${timeClass}">${child.timestamp}</span>
                            </button>
                        `;
                    });
                    html += `</div>`;
                }
                html += `</div>`;
            });
            
            treeContainer.innerHTML = html;
            if (window.lucide) lucide.createIcons();
        };

