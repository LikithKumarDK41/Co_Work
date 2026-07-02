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

const NAV_ORDER = ['dashboard', 'users', 'rooms', 'visitors', 'bookings', 'tickets', 'announcements', 'reports', 'reception'];

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

    NAV_ORDER.forEach(pageKey => {
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
