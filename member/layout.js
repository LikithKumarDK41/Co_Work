document.addEventListener("DOMContentLoaded", () => {
    if (window.layoutInjected) return;

    const pathname = window.location.pathname;
    const filename = pathname.substring(pathname.lastIndexOf("/") + 1) || "dashboard.html";
    if (filename === "login.html") return;

    window.layoutInjected = true;

    const navItems = [
        { label: "Dashboard", icon: "dashboard", href: "dashboard.html", activePatterns: ["dashboard.html"] },
        { label: "Workspaces", icon: "meeting_room", href: "meeting_rooms.html", activePatterns: ["meeting_rooms.html", "book_rooms.html", "book_meeting_room.html", "booking_confirm.html"] },
        { label: "My Bookings", icon: "event_available", href: "my_booking.html", activePatterns: ["my_booking.html"] },
        { label: "Visitors", icon: "group", href: "visitor_history.html", activePatterns: ["visitor_history.html", "invite_visitor.html", "visitor_checkin.html"] },
        { label: "Support", icon: "help_center", href: "help_center.html", activePatterns: ["help_center.html", "raise_support.html", "ticket_history.html", "ticket_detail.html"] }
    ];

    const isActive = (item) => item.activePatterns.some(p => filename.includes(p));

    const navLinksHTML = () => navItems.map(item => {
        const active = isActive(item);

        return `
            <a href="${item.href}" class="nav-link ${active ? "nav-link--active" : ""}">
                <span class="nav-icon material-symbols-outlined ${active ? "fill" : ""}">${item.icon}</span>
                <span class="nav-label">${item.label}</span>
            </a>
        `;
    }).join("");

    // Dynamic stylesheet is loaded statically in <head> to prevent layout shifts.

    const avatarSrc = "https://lh3.googleusercontent.com/aida-public/AB6AXuCMcxjiNxxKH9JboiNEy6xCaBkCW9AcbWgp1y7nFDgc6o2aO0wHh7tprbtjptkG5B3UZ7VHvuuw7rznDVSipybakmC-UIw1z7LGDM-WWPLE86rmNPbAw2Tvu2gPNwBLr8Sk9HStV0G-YylVMiW92Ih4zHlDZuMcngmlTHkz6ZL3dUUsfB9SICT8XusoFT17eYD-LVynZ5dK30uhC2n8Pa4nSonGfsx2bmLE_eccK4jfMgkS6k5_RVf5VJSQz6j2H5DhqbRTHqE0yiMl";

    const footerLinksHTML = `
        <a id="settings-btn" href="settings.html" class="sidebar-footer-link">
            <span class="nav-icon material-symbols-outlined">settings</span>
            <span>Settings</span>
        </a>

        <a href="login.html" class="sidebar-footer-link danger">
            <span class="nav-icon material-symbols-outlined">logout</span>
            <span>Logout</span>
        </a>
    `;

    const sidebar = document.createElement("nav");
    sidebar.id = "layout-sidebar";
    sidebar.innerHTML = `
        <div class="sidebar-brand">
            <h1 class="sidebar-brand-title">
                <span class="material-symbols-outlined icon-fill">domain</span>
                <span class="truncate">Nichi-In</span>
            </h1>
            <p class="sidebar-brand-tagline">Member Portal</p>
        </div>

        <a class="sidebar-profile" href="profile.html">
            <img class="profile-avatar" src="${avatarSrc}" alt="Alex Rivera">
            <div>
                <div class="sidebar-profile-name profile-name">Alex Rivera</div>
                <div class="sidebar-profile-role profile-role">Premium Member</div>
            </div>
        </a>

        <div class="sidebar-nav">
            ${navLinksHTML()}
        </div>

        <div class="sidebar-footer">
            ${footerLinksHTML}
        </div>
    `;
    document.body.insertBefore(sidebar, document.body.firstChild);

    const mobileHeader = document.createElement("header");
    mobileHeader.id = "layout-mobile-header";
    mobileHeader.innerHTML = `
        <div class="mobile-header-left">
            <button id="layout-drawer-toggle" class="mobile-icon-btn" aria-label="Open menu">
                <span class="material-symbols-outlined" style="font-size:22px;">menu</span>
            </button>
            <span class="mobile-brand-text">Nichi-In</span>
        </div>

        <div class="mobile-header-right">
            <button id="layout-notif-btn" class="mobile-icon-btn" style="position:relative;">
                <span class="material-symbols-outlined" style="font-size:22px;">notifications</span>
                <span style="position:absolute;top:8px;right:8px;width:7px;height:7px;background:#ba1a1a;border-radius:50%;border:1.5px solid #fff;"></span>
            </button>

            <a href="profile.html" class="mobile-profile-avatar">
                <img class="profile-avatar" src="${avatarSrc}" alt="Profile">
            </a>
        </div>
    `;
    document.body.insertBefore(mobileHeader, sidebar.nextSibling);

    const backdrop = document.createElement("div");
    backdrop.id = "layout-backdrop";
    document.body.appendChild(backdrop);

    const drawer = document.createElement("nav");
    drawer.id = "layout-drawer";
    drawer.innerHTML = `
        <div class="drawer-brand-row">
            <div class="sidebar-brand">
                <h1 class="sidebar-brand-title">
                    <span class="material-symbols-outlined icon-fill">domain</span>
                    <span class="truncate">Nichi-In</span>
                </h1>
                <p class="sidebar-brand-tagline">Member Portal</p>
            </div>

            <button id="layout-drawer-close" class="mobile-icon-btn">
                <span class="material-symbols-outlined" style="font-size:20px;">close</span>
            </button>
        </div>

        <a class="sidebar-profile" href="profile.html" style="margin:14px 10px 12px;">
            <img class="profile-avatar" src="${avatarSrc}" alt="Alex Rivera">
            <div>
                <div class="sidebar-profile-name profile-name">Alex Rivera</div>
                <div class="sidebar-profile-role profile-role">Premium Member</div>
            </div>
        </a>

        <div class="drawer-nav">
            ${navLinksHTML()}
        </div>

        <div class="sidebar-footer">
            ${footerLinksHTML.replace('id="settings-btn"', 'id="drawer-settings-btn"')}
        </div>
    `;
    document.body.appendChild(drawer);

    async function loadProfile() {
        let profile = sessionStorage.getItem("profile");
        if (profile) return JSON.parse(profile);
        try {
            const res = await fetch("data/profile.json");
            const data = await res.json();
            sessionStorage.setItem("profile", JSON.stringify(data));
            return data;
        } catch (e) {
            console.error("Failed to load profile.json", e);
            return null;
        }
    }

    loadProfile().then(profile => {
        if (profile) {
            document.querySelectorAll(".profile-avatar").forEach(img => img.src = profile.avatar);
            document.querySelectorAll(".profile-name").forEach(el => el.textContent = profile.name);
            document.querySelectorAll(".profile-role").forEach(el => el.textContent = profile.role);
        }
    });

    // const fab = document.createElement("a");
    // fab.id = "layout-fab";
    // fab.href = "meeting_rooms.html";
    // fab.innerHTML = `
    //     <span class="fab-icon material-symbols-outlined">add</span>
    //     <span>Book Now</span>
    // `;
    // document.body.appendChild(fab);

    const injectedIds = new Set([
        "layout-sidebar",
        "layout-mobile-header",
        "layout-backdrop",
        "layout-drawer",
        "layout-fab"
    ]);

    Array.from(document.body.children).forEach(el => {
        if (injectedIds.has(el.id)) return;

        if (!el.classList.contains("page-layout")) {
            el.classList.add("layout-content");
        }
    });

    // Create dynamic footer
    const footer = document.createElement("footer");
    footer.className = "layout-footer";
    footer.innerHTML = `
        <p>© 2026 Nichi-In. All Rights Reserved. | <a href="help_center.html">Help Center</a> | <a href="#">Privacy Policy</a> | <a href="#">Terms of Use</a></p>
    `;

    // Append footer to content containers
    Array.from(document.body.children).forEach(el => {
        if (injectedIds.has(el.id)) return;
        if (el.tagName === "SCRIPT" || el.tagName === "NOSCRIPT") return;

        if (el.classList.contains("page-layout") || el.classList.contains("layout-content")) {
            if (!el.querySelector(".layout-footer")) {
                el.appendChild(footer.cloneNode(true));
            }
        }
    });

    // SPA Router logic
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");
        if (!href || 
            href.startsWith("http") || 
            href.startsWith("#") || 
            href.startsWith("mailto:") || 
            href.startsWith("tel:") ||
            href.includes("logout") || 
            href === "login.html") {
            return;
        }

        e.preventDefault();
        navigateTo(href);
    });

    function showLoader() {
        let loader = document.getElementById("layout-loader");
        if (!loader) {
            loader = document.createElement("div");
            loader.id = "layout-loader";
            document.body.appendChild(loader);
        }
        loader.classList.add("active");
        loader.style.width = "0%";
        // Force reflow
        void loader.offsetWidth;
        loader.style.width = "30%";

        const currentMain = document.querySelector("main.page-layout") || document.querySelector(".layout-content");
        if (currentMain) {
            currentMain.classList.add("layout-content-loading");
        }

        // Slowly increment width to look dynamic
        if (window.layoutLoaderInterval) clearInterval(window.layoutLoaderInterval);
        window.layoutLoaderInterval = setInterval(() => {
            const currentWidth = parseFloat(loader.style.width) || 0;
            if (currentWidth < 85) {
                loader.style.width = (currentWidth + (90 - currentWidth) * 0.1) + "%";
            }
        }, 120);
    }

    function hideLoader() {
        if (window.layoutLoaderInterval) {
            clearInterval(window.layoutLoaderInterval);
            window.layoutLoaderInterval = null;
        }
        const loader = document.getElementById("layout-loader");
        if (loader) {
            loader.style.width = "100%";
            setTimeout(() => {
                loader.classList.remove("active");
                setTimeout(() => {
                    loader.style.width = "0%";
                }, 200);
            }, 180);
        }

        const currentMain = document.querySelector("main.page-layout") || document.querySelector(".layout-content");
        if (currentMain) {
            currentMain.classList.remove("layout-content-loading");
        }
    }

    async function navigateTo(url, push = true) {
        try {
            showLoader();

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch target page");
            const htmlText = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");

            const newMain = doc.querySelector("main.page-layout") || doc.querySelector(".layout-content");
            const currentMain = document.querySelector("main.page-layout") || document.querySelector(".layout-content");

            if (newMain && currentMain) {
                document.title = doc.title || document.title;
                currentMain.innerHTML = newMain.innerHTML;
                currentMain.className = newMain.className;

                // Reset scroll position to top immediately on page load
                window.scrollTo(0, 0);

                if (push) {
                    history.pushState({ url }, "", url);
                }

                updateActiveLink(url);
                executeScripts(currentMain);
                
                if (!currentMain.querySelector(".layout-footer")) {
                    currentMain.appendChild(footer.cloneNode(true));
                }
            } else {
                hideLoader();
                window.location.href = url;
                return;
            }
        } catch (err) {
            console.error("SPA dynamic reload failed:", err);
            hideLoader();
            window.location.href = url;
            return;
        }
        hideLoader();
    }

    function updateActiveLink(url) {
        const filename = url.substring(url.lastIndexOf("/") + 1) || "dashboard.html";
        document.querySelectorAll(".nav-link").forEach(link => {
            const href = link.getAttribute("href");
            const item = navItems.find(i => i.href === href);
            if (item) {
                const active = item.activePatterns.some(p => filename.includes(p));
                if (active) {
                    link.classList.add("nav-link--active");
                    const icon = link.querySelector(".nav-icon");
                    if (icon) icon.classList.add("fill");
                } else {
                    link.classList.remove("nav-link--active");
                    const icon = link.querySelector(".nav-icon");
                    if (icon) icon.classList.remove("fill");
                }
            }
        });
    }

    function executeScripts(container) {
        const scripts = container.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.textContent = oldScript.textContent;
            document.body.appendChild(newScript);
            newScript.remove();
        });
    }

    window.addEventListener("popstate", (e) => {
        const url = (e.state && e.state.url) || window.location.pathname;
        navigateTo(url, false);
    });

    const openDrawer = () => {
        drawer.classList.add("open");
        backdrop.classList.add("open");
        document.body.style.overflow = "hidden";
    };

    const closeDrawer = () => {
        drawer.classList.remove("open");
        backdrop.classList.remove("open");
        document.body.style.overflow = "";
    };

    document.getElementById("layout-drawer-toggle")?.addEventListener("click", openDrawer);
    document.getElementById("layout-drawer-close")?.addEventListener("click", closeDrawer);
    backdrop.addEventListener("click", closeDrawer);

    drawer.querySelectorAll("a[href]").forEach(a => {
        a.addEventListener("click", () => {
            if (a.getAttribute("href") !== "#") closeDrawer();
        });
    });


    document.getElementById("layout-notif-btn")?.addEventListener("click", () => {
        alert("No new notifications.");
    });

});