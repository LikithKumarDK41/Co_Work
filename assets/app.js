// App configuration
const APP_CONFIG = {
    partials: {
        sidebar: './partials/sidebar.html',
        header: './partials/header.html',
        footer: './partials/footer.html'
    },
    pages: {
        dashboard: {
            title: 'Dashboard',
            icon: 'dashboard',
            path: '../admin_dashboard_co_work_manager/content.html'
        },
        users: {
            title: 'User Management',
            icon: 'group',
            path: '../user_management_co_work_manager/content.html'
        },
        rooms: {
            title: 'Workspace',
            icon: 'meeting_room',
            path: '../meeting_room_management_co_work_manager/content.html'
        },
        visitors: {
            title: 'Visitor Management',
            icon: 'person_add',
            path: '../visitor_management_co_work_manager/content.html'
        },
        bookings: {
            title: 'Booking Management',
            icon: 'event_available',
            path: '../booking_management_co_work_manager/content.html'
        },
        tickets: {
            title: 'Support Tickets',
            icon: 'confirmation_number',
            path: '../support_tickets_co_work_manager/content.html'
        },
        announcements: {
            title: 'Announcements',
            icon: 'campaign',
            path: '../announcements_co_work_manager/content.html'
        },
        reports: {
            title: 'Reports & Analytics',
            icon: 'assessment',
            path: '../reports_analytics_co_work_manager/content.html'
        },
        reception: {
            title: 'Reception Dashboard',
            icon: 'badge',
            path: '../reception_dashboard_co_work_manager/content.html'
        },
        roles: {
            title: 'Roles & Permissions',
            icon: 'security',
            path: '../roles_permissions_co_work_manager/content.html'
        },
        settings: {
            title: 'Settings',
            icon: 'settings',
            path: '../settings_co_work_manager/content.html'
        }
    }
};

const TOP_NAV_ORDER = ['dashboard', 'bookings', 'visitors', 'users'];
const DROPDOWN_NAV_ORDER = ['rooms','roles', 'tickets', 'announcements', 'reports', 'reception'];

let currentPageKey = null;
let sidebarOpen = false;

document.addEventListener('DOMContentLoaded', function () {
    bootstrapApp();
});

async function bootstrapApp() {
    if (!localStorage.getItem('coworkUserLoggedIn')) {
        window.location.href = '../login_co_work_manager_1/code.html';
        return;
    }

    try {
        await ensureMockDatabaseInitialized();
        await loadLayoutPartials();
        initializeApp();
        renderNavigation();
        syncHeaderUserEmail();
        setupResponsiveSidebar();

        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') || 'dashboard';
        navigateTo(page, { replaceHistory: true });
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showBootstrapError();
    }
}

async function ensureMockDatabaseInitialized() {
    let db = localStorage.getItem('coworkMockDatabase');
    if (db) {
        try {
            const parsed = JSON.parse(db);
            if (parsed && parsed.members && parsed.members.length >= 145 && parsed.visitors && parsed.visitors.length >= 45) {
                return parsed;
            }
        } catch (e) {
            console.error('Failed to parse database, reloading from JSON files...', e);
        }
    }

    try {
        const [usersRes, visitorsRes] = await Promise.all([
            fetch('../member/data/users.json'),
            fetch('../member/data/visitors.json')
        ]);

        if (!usersRes.ok || !visitorsRes.ok) {
            throw new Error('Failed to fetch user or visitor JSON files');
        }

        const members = await usersRes.json();
        let visitors = await visitorsRes.json();

        // Normalize visitor structure for Admin panel integration
        visitors = visitors.map(v => {
            return {
                id: v.id,
                name: v.name,
                companyName: v.company || 'Independent',
                hostName: v.hostName || 'Marcus Reed',
                expectedArrival: v.time || '10:00 AM',
                status: v.status === 'Registered' || v.status === 'Confirmed' ? 'Expected' : 
                        v.status === 'Checked-In' ? 'Checked-In' : 'Checked-Out',
                shuffled: true
            };
        });

        const roomsList = [
            { name: 'The Boardroom', capacity: 16 },
            { name: 'Meeting Room A', capacity: 8 },
            { name: 'Meeting Room B', capacity: 6 },
            { name: 'Focus Room A', capacity: 2 },
            { name: 'Focus Room B', capacity: 2 }
        ];
        const bookings = [];
        const today = new Date().toISOString().split('T')[0];
        for (let i = 1; i <= 15; i++) {
            const member = members[Math.floor(Math.random() * members.length)];
            const room = roomsList[Math.floor(Math.random() * roomsList.length)];
            const startHour = 9 + Math.floor(Math.random() * 8);
            const duration = 1 + Math.floor(Math.random() * 2);
            const endHour = startHour + duration;
            
            bookings.push({
                id: i,
                memberName: member.name,
                companyName: member.company,
                roomName: room.name,
                date: today,
                timeSlot: `${startHour}:00 ${startHour >= 12 ? 'PM' : 'AM'} - ${endHour}:00 ${endHour >= 12 ? 'PM' : 'AM'}`,
                status: Math.random() > 0.2 ? 'Approved' : 'Pending'
            });
        }

        const newDb = { members, bookings, visitors };
        localStorage.setItem('coworkMockDatabase', JSON.stringify(newDb));
        return newDb;
    } catch (err) {
        console.error('Error fetching mock database seed JSONs:', err);
        return { members: [], bookings: [], visitors: [] };
    }
}

async function loadLayoutPartials() {
    const loads = [
        { containerId: 'sidebarContainer', path: APP_CONFIG.partials.sidebar },
        { containerId: 'headerContainer', path: APP_CONFIG.partials.header },
        { containerId: 'footerContainer', path: APP_CONFIG.partials.footer }
    ];

    await Promise.all(loads.map(async ({ containerId, path }) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load ${path}`);

        const html = await response.text();
        container.innerHTML = html;
    }));
}

function initializeApp() {
    document.addEventListener('click', function (e) {
        const dropdownToggle = e.target.closest('.nav-dropdown-toggle');
        if (dropdownToggle) {
            e.preventDefault();
            toggleMasterSettingsDropdown();
            return;
        }

        const navItem = e.target.closest('.nav-item');
        if (navItem) {
            const pageKey = navItem.dataset.page;
            if (pageKey) {
                e.preventDefault();
                navigateTo(pageKey);
                closeSidebar();
            }
        }
    });
}

function renderNavigation() {
    const mainNav = document.getElementById('mainNav');
    if (!mainNav) return;

    mainNav.innerHTML = '';

    // Render top-level navigation items
    TOP_NAV_ORDER.forEach(pageKey => {
        if (!APP_CONFIG.pages[pageKey]) return;

        const page = APP_CONFIG.pages[pageKey];
        const navItem = document.createElement('a');
        navItem.className = 'nav-item';
        navItem.dataset.page = pageKey;
        navItem.href = '#';
        navItem.innerHTML = `
            <span class="material-symbols-outlined flex-shrink-0">${page.icon}</span>
            <span class="truncate">${page.title}</span>
        `;

        mainNav.appendChild(navItem);
    });

    // Create collapsible Master Settings Dropdown container
    const dropdownWrapper = document.createElement('div');
    dropdownWrapper.className = 'flex flex-col gap-1 mt-2';

    // Dropdown Toggler Button
    const dropdownToggle = document.createElement('button');
    dropdownToggle.id = 'masterSettingsToggle';
    dropdownToggle.className = 'nav-dropdown-toggle nav-item w-full flex items-center justify-between text-on-surface-variant hover:text-primary transition-all duration-200';
    dropdownToggle.setAttribute('aria-expanded', 'false');
    dropdownToggle.innerHTML = `
        <span class="flex items-center gap-3">
            <span class="material-symbols-outlined flex-shrink-0">tune</span>
            <span class="truncate font-medium">Master Settings</span>
        </span>
        <span id="masterSettingsArrow" class="material-symbols-outlined dropdown-arrow text-[18px]">expand_more</span>
    `;

    // Dropdown Content Panel
    const dropdownContent = document.createElement('div');
    dropdownContent.id = 'masterSettingsContent';
    dropdownContent.className = 'flex flex-col gap-1 pl-2 border-l border-outline-variant/40 ml-6 mt-1';

    // Render sub-navigation items inside the dropdown
    DROPDOWN_NAV_ORDER.forEach(pageKey => {
        if (!APP_CONFIG.pages[pageKey]) return;

        const page = APP_CONFIG.pages[pageKey];
        const navItem = document.createElement('a');
        navItem.className = 'nav-item sub-nav-item';
        navItem.dataset.page = pageKey;
        navItem.href = '#';
        navItem.innerHTML = `
            <span class="material-symbols-outlined flex-shrink-0 text-[18px]">${page.icon}</span>
            <span class="truncate">${page.title}</span>
        `;

        dropdownContent.appendChild(navItem);
    });

    dropdownWrapper.appendChild(dropdownToggle);
    dropdownWrapper.appendChild(dropdownContent);
    mainNav.appendChild(dropdownWrapper);
}

function navigateTo(pageKey, options = {}) {
    if (!APP_CONFIG.pages[pageKey]) {
        console.error('Page not found:', pageKey);
        return;
    }

    currentPageKey = pageKey;
    const page = APP_CONFIG.pages[pageKey];

    document.title = `${page.title} - CoWork Manager`;
    const pageTitleEl = document.getElementById('pageTitle');
    if (pageTitleEl) pageTitleEl.textContent = `${page.title} - CoWork Manager`;

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageKey);
    });

    // Check if current page is inside the Master Settings dropdown
    const isSubPage = DROPDOWN_NAV_ORDER.includes(pageKey);
    const dropdownToggle = document.getElementById('masterSettingsToggle');
    if (isSubPage) {
        toggleMasterSettingsDropdown(true);
        if (dropdownToggle) dropdownToggle.classList.add('child-active');
    } else {
        if (dropdownToggle) dropdownToggle.classList.remove('child-active');
    }

    loadPageContent(page.path, page.title);

    const url = `?page=${pageKey}`;
    if (options.replaceHistory) {
        window.history.replaceState({ page: pageKey }, page.title, url);
    } else {
        window.history.pushState({ page: pageKey }, page.title, url);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadPageContent(contentPath, pageTitle) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div class="page-content">
            <div class="flex items-center justify-center min-h-[50vh]">
                <div class="text-center">
                    <div class="inline-block animate-spin">
                        <span class="material-symbols-outlined text-4xl text-primary">progress_activity</span>
                    </div>
                    <p class="mt-4 text-on-surface-variant font-body-sm">Loading ${pageTitle}...</p>
                </div>
            </div>
        </div>
    `;

    fetch(contentPath)
        .then(response => {
            if (!response.ok) throw new Error('Content not found');
            return response.text();
        })
        .then(html => {
            mainContent.innerHTML = `
                <div class="page-content content-area animate-fade-in">
                    ${html}
                </div>
            `;
            initializePageMockData(currentPageKey);
            executeScripts(mainContent);
        })
        .catch(error => {
            console.error('Error loading content:', error);
            mainContent.innerHTML = `
                <div class="page-content">
                    <div class="bg-error-container border border-error rounded-xl content-card">
                        <h2 class="font-headline-md text-headline-md text-on-error-container mb-md">Error Loading Page</h2>
                        <p class="text-on-error-container font-body-md">${pageTitle} content is not available yet. Please check back later.</p>
                    </div>
                </div>
            `;
        });
}

function executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        if (oldScript.src) {
            newScript.src = oldScript.src;
        } else {
            newScript.textContent = oldScript.textContent;
        }
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}


function setupResponsiveSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const backdrop = document.getElementById('sidebarBackdrop');

    if (toggle) {
        toggle.addEventListener('click', toggleSidebar);
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeSidebar);
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeSidebar();
    });

    window.addEventListener('resize', debounce(handleResize, 150));
    handleResize();
}

function handleResize() {
    if (window.innerWidth >= 768) {
        closeSidebar(false);
    }
}

function toggleSidebar() {
    if (sidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    if (window.innerWidth >= 768) return;

    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    const toggle = document.getElementById('sidebarToggle');

    sidebarOpen = true;
    sidebar?.classList.add('is-open');
    backdrop?.classList.add('is-visible');
    backdrop?.setAttribute('aria-hidden', 'false');
    toggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeSidebar(restoreScroll = true) {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    const toggle = document.getElementById('sidebarToggle');

    sidebarOpen = false;
    sidebar?.classList.remove('is-open');
    backdrop?.classList.remove('is-visible');
    backdrop?.setAttribute('aria-hidden', 'true');
    toggle?.setAttribute('aria-expanded', 'false');

    if (restoreScroll) {
        document.body.style.overflow = '';
    }
}

function syncHeaderUserEmail() {
    const email = localStorage.getItem('coworkUserEmail') || 'admin@cowork.com';
    const el = document.getElementById('headerUserEmail');
    if (el) el.textContent = email;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('coworkUserLoggedIn');
        localStorage.removeItem('coworkUserEmail');
        window.location.href = '../login_co_work_manager_1/code.html';
    }
}

function toggleMasterSettingsDropdown(shouldOpen) {
    const content = document.getElementById('masterSettingsContent');
    const arrow = document.getElementById('masterSettingsArrow');
    const toggle = document.getElementById('masterSettingsToggle');
    if (!content || !arrow || !toggle) return;

    const isOpen = shouldOpen !== undefined ? shouldOpen : !content.classList.contains('open');

    if (isOpen) {
        content.classList.add('open');
        arrow.classList.add('rotated');
        toggle.setAttribute('aria-expanded', 'true');
    } else {
        content.classList.remove('open');
        arrow.classList.remove('rotated');
        toggle.setAttribute('aria-expanded', 'false');
    }
}

function showBootstrapError() {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="page-content">
                <div class="bg-error-container border border-error rounded-xl content-card">
                    <h2 class="font-headline-md text-headline-md text-on-error-container mb-md">Application Error</h2>
                    <p class="text-on-error-container font-body-md">Failed to load layout templates. Please refresh the page.</p>
                </div>
            </div>
        `;
    }
}

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

window.addEventListener('popstate', function (e) {
    const pageKey = (e.state && e.state.page) || new URLSearchParams(window.location.search).get('page') || 'dashboard';
    navigateTo(pageKey, { replaceHistory: true });
});

// Expose for inline handlers in content partials
window.navigateTo = navigateTo;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.logout = logout;
window.toggleMasterSettingsDropdown = toggleMasterSettingsDropdown;

// -------------------------------------------------------------
// Realistic Mock Database based on 145 Members
// -------------------------------------------------------------
function getOrInitializeMockDatabase() {
    let db = localStorage.getItem('coworkMockDatabase');
    if (db) {
        try {
            return JSON.parse(db);
        } catch (e) {
            console.error('Failed to parse mock database', e);
        }
    }
    return { members: [], bookings: [], visitors: [] };
}

let membersCurrentPage = 1;
let membersSearchQuery = '';
let visitorsCurrentPage = 1;
let visitorsSearchQuery = '';
let visitorsActiveTab = 'all';

function initializePageMockData(pageKey) {
    const db = getOrInitializeMockDatabase();

    if (pageKey === 'dashboard') {
        const spans = Array.from(document.querySelectorAll('span'));
        const membersLabel = spans.find(s => s.textContent.trim() === 'Total Members');
        if (membersLabel) {
            const card = membersLabel.closest('div').parentElement;
            const valEl = card.querySelector('.text-4xl, span[class*="text-slate-900"]');
            if (valEl) valEl.textContent = db.members.length;
        }

        const visitorsLabel = spans.find(s => s.textContent.trim() === 'Visitors Today');
        if (visitorsLabel) {
            const card = visitorsLabel.closest('div').parentElement;
            const valEl = card.querySelector('.text-4xl, span[class*="text-slate-900"]');
            if (valEl) valEl.textContent = db.visitors.length;
            const subtext = card.querySelector('.text-emerald-600, .text-xs, div');
            if (subtext) {
                const expectedCount = db.visitors.filter(v => v.status === 'Expected').length;
                subtext.innerHTML = `<span class="material-symbols-outlined text-[16px]">trending_up</span><span class="font-medium text-xs">+${expectedCount} expected later</span>`;
            }
        }

    } else if (pageKey === 'users') {
        membersCurrentPage = 1;
        membersSearchQuery = '';
        renderMembersTable(db);

        const searchInput = document.querySelector('input[placeholder="Search members..."]');
        if (searchInput) {
            searchInput.onkeyup = (e) => {
                membersSearchQuery = e.target.value;
                membersCurrentPage = 1;
                renderMembersTable(db);
            };
        }

        window.showMemberProfile = showMemberProfile;
        window.submitRegistration = submitRegistrationOverride;

    } else if (pageKey === 'visitors') {
        visitorsCurrentPage = 1;
        visitorsSearchQuery = '';
        visitorsActiveTab = 'all';

        renderVisitorsTable(db);

        window.confirmCheckInStatus = confirmCheckInStatusOverride;
        window.deleteVisitor = deleteVisitorOverride;
        window.submitPreRegister = submitPreRegisterOverride;
        
        window.filterVisitors = function(status) {
            document.querySelectorAll('.visitor-tab').forEach(tab => {
                tab.classList.remove('text-primary', 'font-bold', 'border-primary');
                tab.classList.add('text-on-surface-variant', 'border-transparent');
            });
            const activeTab = document.getElementById(`tab-${status}`);
            if (activeTab) {
                activeTab.classList.remove('text-on-surface-variant', 'border-transparent');
                activeTab.classList.add('text-primary', 'font-bold', 'border-primary');
            }

            visitorsActiveTab = status;
            visitorsCurrentPage = 1;
            renderVisitorsTable(db);
        };

        window.searchVisitors = function(query) {
            visitorsSearchQuery = query;
            visitorsCurrentPage = 1;
            renderVisitorsTable(db);
        };
    }
}

function renderMembersTable(db) {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filteredMembers = db.members.filter(m => {
        const q = membersSearchQuery.toLowerCase();
        return m.name.toLowerCase().includes(q) || 
               m.email.toLowerCase().includes(q) || 
               m.company.toLowerCase().includes(q) ||
               m.role.toLowerCase().includes(q);
    });

    const itemsPerPage = 8;
    const totalItems = filteredMembers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    
    if (membersCurrentPage > totalPages) membersCurrentPage = totalPages;
    if (membersCurrentPage < 1) membersCurrentPage = 1;

    const startIdx = (membersCurrentPage - 1) * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, totalItems);

    const pageItems = filteredMembers.slice(startIdx, endIdx);

    pageItems.forEach(m => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-surface-container-low/50 transition-colors cursor-pointer group';
        tr.onclick = () => showMemberProfile(m);

        let statusBadge = '';
        if (m.status === 'Active') {
            statusBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-secondary/10 text-secondary">Active</span>`;
        } else if (m.status === 'Past Due') {
            statusBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-error/10 text-error">Past Due</span>`;
        } else {
            statusBadge = `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-surface-variant text-on-surface-variant border border-outline-variant/50">Inactive</span>`;
        }

        let avatarHTML = '';
        if (m.avatar) {
            avatarHTML = `<img alt="Avatar" class="w-8 h-8 rounded-full object-cover shrink-0" src="${m.avatar}">`;
        } else {
            const initials = m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const bgClasses = ['bg-primary-container text-on-primary-container', 'bg-tertiary-container text-on-tertiary-container', 'bg-secondary-container text-on-secondary-container'];
            const bgClass = bgClasses[m.id % bgClasses.length];
            avatarHTML = `<div class="w-8 h-8 rounded-full ${bgClass} flex items-center justify-center font-bold text-label-md shrink-0">${initials}</div>`;
        }

        tr.innerHTML = `
            <td class="px-md py-sm">
                <div class="flex items-center gap-sm">
                    ${avatarHTML}
                    <span class="font-label-md text-label-md font-semibold">${m.name}</span>
                </div>
            </td>
            <td class="px-md py-sm text-on-surface-variant">${m.email}</td>
            <td class="px-md py-sm">${m.role}</td>
            <td class="px-md py-sm">${statusBadge}</td>
            <td class="px-md py-sm text-on-surface-variant">${m.joinDate}</td>
            <td class="px-md py-sm text-right">
                <button class="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity p-xs hover:bg-surface-variant rounded-md">
                    <span class="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const infoEl = document.getElementById('paginationInfo');
    if (infoEl) {
        infoEl.textContent = `Showing ${totalItems > 0 ? startIdx + 1 : 0} to ${endIdx} of ${totalItems} entries`;
    }

    renderPaginationButtons(totalPages, db);
}

function renderPaginationButtons(totalPages, db) {
    const flexGap = document.querySelector('.flex.gap-xs');
    if (!flexGap) return;

    flexGap.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'p-1 rounded hover:bg-surface-container-low text-on-surface-variant disabled:opacity-50';
    prevBtn.disabled = membersCurrentPage === 1;
    prevBtn.innerHTML = `<span class="material-symbols-outlined">chevron_left</span>`;
    prevBtn.onclick = (e) => {
        e.stopPropagation();
        if (membersCurrentPage > 1) {
            membersCurrentPage--;
            renderMembersTable(db);
        }
    };
    flexGap.appendChild(prevBtn);

    const startPage = Math.max(1, membersCurrentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === membersCurrentPage) {
            btn.className = 'pagination-btn w-8 h-8 rounded bg-primary text-on-primary font-label-sm flex items-center justify-center';
        } else {
            btn.className = 'pagination-btn w-8 h-8 rounded hover:bg-surface-container-low text-on-surface font-label-sm flex items-center justify-center';
        }
        btn.onclick = (e) => {
            e.stopPropagation();
            membersCurrentPage = i;
            renderMembersTable(db);
        };
        flexGap.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'p-1 rounded hover:bg-surface-container-low text-on-surface-variant disabled:opacity-50';
    nextBtn.disabled = membersCurrentPage === totalPages;
    nextBtn.innerHTML = `<span class="material-symbols-outlined">chevron_right</span>`;
    nextBtn.onclick = (e) => {
        e.stopPropagation();
        if (membersCurrentPage < totalPages) {
            membersCurrentPage++;
            renderMembersTable(db);
        }
    };
    flexGap.appendChild(nextBtn);
}

function showMemberProfile(member) {
    const modal = document.getElementById('profileModal');
    if (!modal) return;

    const img = modal.querySelector('img');
    if (img) {
        if (member.avatar) {
            img.src = member.avatar;
            img.classList.remove('hidden');
        } else {
            img.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZCcT7H-bQ61oRgCHVcahYF1YmF_ZcSFEVrhDbsRCVaSAdLFk3UsZLGh81Tpg9uhRmfB1wmYVWXtgW7LobGRURnS9tlzIHC7roVPb9BVNGf_kWv_R-Ln7DZVppJgcPNbqJ6pJHeluMPaCjqR9_BCuSHB5I0d4i23pK0_-0Qtw3jSM5_uK2JAyQ81XKdWXZki1TMr_glpZw17OqilwoYqo2F8OtzYadCSaPm1Aw1IF9a-7AvKcTkswMe5i4e6GfWe0_UH1hAhpyRkY';
        }
        img.alt = `${member.name} Profile`;
    }

    const nameEl = modal.querySelector('h4');
    if (nameEl) nameEl.textContent = member.name;

    const emailEl = modal.querySelector('h4 + p');
    if (emailEl) emailEl.textContent = member.email;

    const statusEl = modal.querySelector('h4 + p + span');
    if (statusEl) {
        statusEl.textContent = `${member.status} Member`;
        statusEl.className = 'inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold ' + 
            (member.status === 'Active' ? 'bg-secondary/10 text-secondary' :
             member.status === 'Past Due' ? 'bg-error/10 text-error' :
             'bg-surface-variant text-on-surface-variant border border-outline-variant/50');
    }

    const bentoBoxes = modal.querySelectorAll('.grid-cols-2 > div');
    bentoBoxes.forEach(box => {
        const labelEl = box.querySelector('p:first-child');
        if (!labelEl) return;
        const label = labelEl.textContent.trim().toLowerCase();
        const valEl = box.querySelector('p:last-child');
        if (!valEl) return;
        if (label === 'plan') {
            valEl.textContent = member.role === 'Admin' ? 'Enterprise' : 'Hot Desk';
        } else if (label === 'join date') {
            valEl.textContent = member.joinDate;
        } else if (label === 'company') {
            valEl.textContent = member.company || 'Independent';
        } else if (label === 'access level') {
            valEl.textContent = member.role === 'Admin' ? '24/7 Unlimited' : '24/7 Standard';
        }
    });

    if (typeof window.openProfileModal === 'function') {
        window.openProfileModal();
    } else {
        const scrim = document.getElementById('profileScrim');
        const modalEl = document.getElementById('profileModal');
        if (scrim && modalEl) {
            scrim.classList.remove('hidden');
            setTimeout(() => {
                scrim.classList.remove('opacity-0');
                modalEl.classList.remove('translate-x-full');
            }, 10);
            document.body.style.overflow = 'hidden';
        }
    }
}

function submitRegistrationOverride() {
    const form = document.getElementById('registerMemberForm');
    if (!form) return;

    if (form.checkValidity()) {
        const firstNameInput = form.querySelector('input[placeholder="John"]');
        const lastNameInput = form.querySelector('input[placeholder="Doe"]');
        const emailInput = form.querySelector('input[placeholder="john@example.com"]');
        const roleSelect = document.getElementById('userRoleSelect');
        const companyInput = form.querySelector('input[placeholder="e.g. Acme Corp"]');

        const firstName = firstNameInput ? firstNameInput.value : '';
        const lastName = lastNameInput ? lastNameInput.value : '';
        const name = `${firstName} ${lastName}`;
        const email = emailInput ? emailInput.value : '';
        const roleVal = roleSelect ? roleSelect.value : 'end_user';
        const roleMap = { 'end_user': 'End User', 'staff': 'Staff', 'admin': 'Admin' };
        const role = roleMap[roleVal] || 'End User';
        const company = companyInput ? companyInput.value : 'Independent';

        const db = getOrInitializeMockDatabase();
        const newMember = {
            id: db.members.length + 1,
            name,
            email,
            role,
            status: 'Active',
            joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            company,
            avatar: null
        };
        db.members.push(newMember);
        localStorage.setItem('coworkMockDatabase', JSON.stringify(db));

        alert('Member registered successfully!');
        
        if (typeof window.closeRegisterModal === 'function') {
            window.closeRegisterModal();
        } else {
            const wrapper = document.getElementById('registerModalWrapper');
            const scrim = document.getElementById('registerScrim');
            const content = document.getElementById('registerModalContent');
            if (scrim && wrapper && content) {
                scrim.classList.add('opacity-0');
                wrapper.classList.add('opacity-0');
                content.classList.remove('scale-100');
                content.classList.add('scale-95');
                setTimeout(() => {
                    scrim.classList.add('hidden');
                    wrapper.classList.add('hidden');
                    wrapper.classList.remove('flex');
                    document.body.style.overflow = '';
                }, 300);
            }
        }
        form.reset();

        membersCurrentPage = Math.ceil(db.members.length / 8);
        renderMembersTable(db);
    } else {
        form.reportValidity();
    }
}

function confirmCheckInStatusOverride() {
    const db = getOrInitializeMockDatabase();
    const rowId = window.currentActionRowId;
    const actionStatus = window.currentActionStatus;
    
    const visitor = db.visitors.find(v => v.id === rowId);
    if (!visitor) return;

    if (actionStatus === 'expected') {
        visitor.status = 'Checked-In';
        alert("Checked in successfully via QR code.");
    } else if (actionStatus === 'checked-in') {
        visitor.status = 'Checked-Out';
        alert("Checked out successfully.");
    }

    localStorage.setItem('coworkMockDatabase', JSON.stringify(db));
    
    if (typeof window.closeCheckInModal === 'function') {
        window.closeCheckInModal();
    } else {
        const overlay = document.getElementById('checkInModalOverlay');
        const modal = document.getElementById('checkInModal');
        if (overlay && modal) {
            overlay.classList.remove('opacity-100');
            modal.classList.remove('scale-100', 'opacity-100');
            modal.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 300);
        }
    }

    // Rerender table
    initializePageMockData('visitors');
    
    // Re-apply tab filtering
    const activeTab = document.querySelector('.visitor-tab.text-primary');
    if (activeTab) {
        const currentTabId = activeTab.id.replace('tab-', '');
        if (typeof window.filterVisitors === 'function') {
            window.filterVisitors(currentTabId);
        }
    }
}

function deleteVisitorOverride(id) {
    if (confirm("Are you sure you want to delete this visitor?")) {
        const db = getOrInitializeMockDatabase();
        db.visitors = db.visitors.filter(v => v.id !== id);
        localStorage.setItem('coworkMockDatabase', JSON.stringify(db));

        // Rerender table
        initializePageMockData('visitors');
        
        // Re-apply tab filtering
        const activeTab = document.querySelector('.visitor-tab.text-primary');
        if (activeTab) {
            const currentTabId = activeTab.id.replace('tab-', '');
            if (typeof window.filterVisitors === 'function') {
                window.filterVisitors(currentTabId);
            }
        }
        alert("Visitor deleted successfully.");
    }
}

function submitPreRegisterOverride() {
    const submitBtn = document.getElementById('pr_submit_btn');
    const name = document.getElementById('pr_name').value;
    const company = document.getElementById('pr_company').value;
    const host = document.getElementById('pr_host').value;
    const time = document.getElementById('pr_time').value;
    const purpose = document.getElementById('pr_purpose').value;

    const db = getOrInitializeMockDatabase();

    if (submitBtn && submitBtn.innerText === 'Update Visitor') {
        const visitor = db.visitors.find(v => v.name === name);
        if (visitor) {
            visitor.companyName = company;
            visitor.hostName = host;
            visitor.expectedArrival = time;
        }
        alert("Visitor updated successfully!");
    } else {
        const newVisitor = {
            id: db.visitors.length + 1,
            name: name,
            hostName: host,
            companyName: company,
            expectedArrival: time || '12:00 PM',
            status: 'Expected'
        };
        db.visitors.push(newVisitor);
        alert("Visitor Pre-registered! A QR code invite has been sent.");
    }

    localStorage.setItem('coworkMockDatabase', JSON.stringify(db));
    
    if (typeof window.closePreRegisterModal === 'function') {
        window.closePreRegisterModal();
    } else {
        const modal = document.getElementById('preRegisterModal');
        const overlay = document.getElementById('preRegisterModalOverlay');
        if (modal && overlay) {
            modal.classList.add('translate-x-full');
            overlay.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
                overlay.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }
    }
    
    const form = document.getElementById('preRegisterForm');
    if (form) form.reset();

    // Rerender table
    initializePageMockData('visitors');
    
    // Re-apply tab filtering
    const activeTab = document.querySelector('.visitor-tab.text-primary');
    if (activeTab) {
        const currentTabId = activeTab.id.replace('tab-', '');
        if (typeof window.filterVisitors === 'function') {
            window.filterVisitors(currentTabId);
        }
    }
}

function renderVisitorsTable(db) {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    // Update Tab count badges dynamically
    const expectedCount = db.visitors.filter(v => v.status === 'Expected').length;
    const checkedInCount = db.visitors.filter(v => v.status === 'Checked-In').length;
    const checkedOutCount = db.visitors.filter(v => v.status === 'Checked-Out').length;

    const tabExpected = document.getElementById('tab-expected');
    if (tabExpected) tabExpected.textContent = `Expected (${expectedCount})`;

    const tabCheckedIn = document.getElementById('tab-checked-in');
    if (tabCheckedIn) tabCheckedIn.textContent = `Checked-In (${checkedInCount})`;

    const tabCheckedOut = document.getElementById('tab-checked-out');
    if (tabCheckedOut) tabCheckedOut.textContent = `Checked-Out (${checkedOutCount})`;

    tbody.innerHTML = '';

    const filteredVisitors = db.visitors.filter(v => {
        const matchesTab = visitorsActiveTab === 'all' || v.status.toLowerCase() === visitorsActiveTab;
        const q = visitorsSearchQuery.toLowerCase();
        const matchesSearch = v.name.toLowerCase().includes(q) || 
                              v.hostName.toLowerCase().includes(q) || 
                              (v.companyName && v.companyName.toLowerCase().includes(q));
        return matchesTab && matchesSearch;
    });

    const itemsPerPage = 4;
    const totalItems = filteredVisitors.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    if (visitorsCurrentPage > totalPages) visitorsCurrentPage = totalPages;
    if (visitorsCurrentPage < 1) visitorsCurrentPage = 1;

    const startIdx = (visitorsCurrentPage - 1) * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, totalItems);

    const pageItems = filteredVisitors.slice(startIdx, endIdx);

    pageItems.forEach(v => {
        const tr = document.createElement('tr');
        tr.className = 'visitor-row hover:bg-surface-container-low transition-colors group cursor-pointer';
        tr.dataset.status = v.status.toLowerCase();
        tr.dataset.id = v.id;

        const initials = v.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        let statusBadge = '';
        if (v.status === 'Checked-In') {
            statusBadge = `<span class="status-badge inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-primary-container text-on-primary-container border border-primary/20">CHECKED-IN</span>`;
        } else if (v.status === 'Expected') {
            statusBadge = `<span class="status-badge inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-container/30">EXPECTED</span>`;
        } else {
            statusBadge = `<span class="status-badge inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-surface-variant text-on-surface-variant border border-outline-variant">CHECKED-OUT</span>`;
        }

        const bgClasses = ['bg-primary-fixed text-on-primary-fixed', 'bg-secondary-fixed text-on-secondary-fixed', 'bg-tertiary-fixed text-on-tertiary-fixed'];
        const bgClass = bgClasses[v.id % bgClasses.length];

        let actionBtnHTML = '';
        if (v.status === 'Expected') {
            actionBtnHTML = `
                <button onclick="openCheckInModal(${v.id}, '${v.name}', '${v.companyName}', '${v.hostName}', 'expected')" class="action-btn w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors" title="Check In">
                    <span class="material-symbols-outlined text-[18px]">login</span>
                </button>
            `;
        } else if (v.status === 'Checked-In') {
            actionBtnHTML = `
                <button onclick="openCheckInModal(${v.id}, '${v.name}', '${v.companyName}', '${v.hostName}', 'checked-in')" class="action-btn w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors" title="Check Out">
                    <span class="material-symbols-outlined text-[18px]">logout</span>
                </button>
            `;
        } else {
            actionBtnHTML = `
                <button class="action-btn w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors" title="Check Out" style="visibility: hidden;">
                    <span class="material-symbols-outlined text-[18px]">logout</span>
                </button>
            `;
        }

        tr.innerHTML = `
            <td class="py-3 px-md">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full ${bgClass} flex items-center justify-center font-label-md font-semibold shrink-0">${initials}</div>
                    <div>
                        <p class="font-body-sm text-body-sm font-semibold text-on-background">${v.name}</p>
                        <p class="font-label-sm text-label-sm text-on-surface-variant">${v.companyName || 'Freelance'}</p>
                    </div>
                </div>
            </td>
            <td class="py-3 px-md">
                <p class="font-body-sm text-body-sm font-medium text-on-background">${v.hostName}</p>
                <p class="font-label-sm text-label-sm text-on-surface-variant">${v.companyName || 'Host'}</p>
            </td>
            <td class="py-3 px-md font-body-sm text-body-sm text-on-surface-variant">${v.expectedArrival}</td>
            <td class="py-3 px-md">${statusBadge}</td>
            <td class="py-3 px-md">
                <div class="flex items-center justify-end gap-2">
                    ${actionBtnHTML}
                    <button onclick="openPreRegisterModal('${v.name}', '${v.companyName}', '${v.hostName}', '${v.expectedArrival.split(' ')[0]}', 'Meeting')" class="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/30 transition-colors" title="Edit">
                        <span class="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onclick="deleteVisitor(${v.id})" class="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error/10 transition-colors" title="Delete">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const infoLabel = document.querySelector('.p-md.border-t.border-outline-variant span');
    if (infoLabel) {
        infoLabel.textContent = `Showing ${totalItems > 0 ? startIdx + 1 : 0} to ${endIdx} of ${totalItems} entries`;
    }

    renderVisitorsPaginationButtons(totalPages, db);
}

function renderVisitorsPaginationButtons(totalPages, db) {
    const paginationContainer = document.querySelector('.p-md.border-t.border-outline-variant .flex.items-center.gap-1');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'p-1 rounded hover:bg-surface-container-low transition-colors disabled:opacity-50';
    prevBtn.disabled = visitorsCurrentPage === 1;
    prevBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">chevron_left</span>`;
    prevBtn.onclick = (e) => {
        e.stopPropagation();
        if (visitorsCurrentPage > 1) {
            visitorsCurrentPage--;
            renderVisitorsTable(db);
        }
    };
    paginationContainer.appendChild(prevBtn);

    const startPage = Math.max(1, visitorsCurrentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === visitorsCurrentPage) {
            btn.className = 'w-8 h-8 rounded bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center';
        } else {
            btn.className = 'w-8 h-8 rounded hover:bg-surface-container-low font-label-sm text-label-sm flex items-center justify-center transition-colors';
        }
        btn.onclick = (e) => {
            e.stopPropagation();
            visitorsCurrentPage = i;
            renderVisitorsTable(db);
        };
        paginationContainer.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'p-1 rounded hover:bg-surface-container-low transition-colors disabled:opacity-50';
    nextBtn.disabled = visitorsCurrentPage === totalPages;
    nextBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">chevron_right</span>`;
    nextBtn.onclick = (e) => {
        e.stopPropagation();
        if (visitorsCurrentPage < totalPages) {
            visitorsCurrentPage++;
            renderVisitorsTable(db);
        }
    };
    paginationContainer.appendChild(nextBtn);
}
