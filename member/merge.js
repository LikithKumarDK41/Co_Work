const fs = require('fs');

const prof = fs.readFileSync('profile.html', 'utf8');
const notif = fs.readFileSync('notifications.html', 'utf8');
const sett = fs.readFileSync('settings.html', 'utf8');

function getGrid(html) {
    const match = html.match(/<div class="grid [^]*?<\/main>/);
    if (match) {
        return match[0].replace('</main>', '');
    }
    return '';
}

function getSpaceY(html) {
    const match = html.match(/<div class="space-y-4"[^]*?<\/main>/);
    if (match) {
        return match[0].replace('</main>', '');
    }
    return '';
}

const settContent = getGrid(sett);
const profContent = getGrid(prof);
const notifContent = getSpaceY(notif);

const newHtml = sett.substring(0, sett.indexOf('<div class="mb-8">')) + `                <div class="mb-8">
                        <h2 class="text-3xl font-bold text-[#004ac6] tracking-tight mb-2">
                                Settings & Profile
                        </h2>
                        <p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                                Manage your personal information, portal preferences, and notifications.
                        </p>
                </div>

                <!-- Tabs Navigation -->
                <div class="flex space-x-8 border-b border-surface-variant mb-6" id="settings-tabs">
                        <button class="tab-btn pb-2 font-headline-sm text-on-surface border-b-2 border-primary transition-colors" data-target="tab-settings">Settings</button>
                        <button class="tab-btn pb-2 font-headline-sm text-on-surface-variant border-b-2 border-transparent hover:text-on-surface transition-colors" data-target="tab-profile">Profile</button>
                        <button class="tab-btn pb-2 font-headline-sm text-on-surface-variant border-b-2 border-transparent hover:text-on-surface transition-colors" data-target="tab-notifications">Notifications</button>
                </div>

                <!-- Tab Contents -->
                <div id="tab-settings" class="tab-pane block">
${settContent}
                </div>
                
                <div id="tab-profile" class="tab-pane hidden">
${profContent}
                </div>
                
                <div id="tab-notifications" class="tab-pane hidden">
${notifContent}
                </div>

                <script>
                        document.addEventListener('DOMContentLoaded', () => {
                                const tabs = document.querySelectorAll('.tab-btn');
                                const panes = document.querySelectorAll('.tab-pane');

                                tabs.forEach(tab => {
                                        tab.addEventListener('click', () => {
                                                tabs.forEach(t => {
                                                        t.classList.remove('border-primary', 'text-on-surface');
                                                        t.classList.add('border-transparent', 'text-on-surface-variant');
                                                });
                                                panes.forEach(p => {
                                                        p.classList.remove('block');
                                                        p.classList.add('hidden');
                                                });

                                                tab.classList.remove('border-transparent', 'text-on-surface-variant');
                                                tab.classList.add('border-primary', 'text-on-surface');

                                                const targetId = tab.getAttribute('data-target');
                                                document.getElementById(targetId).classList.remove('hidden');
                                                document.getElementById(targetId).classList.add('block');
                                        });
                                });
                        });
                </script>
        </main>
</body>
</html>
`;

fs.writeFileSync('settings.html', newHtml, 'utf8');
