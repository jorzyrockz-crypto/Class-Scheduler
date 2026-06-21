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
            ['dashboard', 'schedule', 'summary'].forEach(v => {
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
            const horizontalTabs = document.querySelector('.flex.gap-2.mb-4.border-b');

            if (view === 'dashboard') {
                if (workspace) workspace.style.display = 'none';
                if (horizontalTabs) horizontalTabs.style.display = 'none';
                if (dashboard) dashboard.style.display = 'flex';
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
                if (horizontalTabs) horizontalTabs.style.display = 'flex';
                if (dashboard) dashboard.style.display = 'none';
                if (typeof setActiveTab === 'function') setActiveTab('summary');
            }
        };

        setTimeout(() => {
            if(typeof setMainView === 'function') setMainView('schedule');
            renderSavedSchedules();
        }, 100);

