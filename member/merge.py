import re

with open('profile.html', 'r', encoding='utf-8') as f:
    prof = f.read()

with open('notifications.html', 'r', encoding='utf-8') as f:
    notif = f.read()

with open('settings.html', 'r', encoding='utf-8') as f:
    sett = f.read()

def get_grid(html):
    m = re.search(r'<div class="grid .*?</main>', html, re.DOTALL)
    if m:
        c = m.group(0)
        return c[:c.rfind('</main>')]
    return ""

def get_space_y(html):
    m = re.search(r'<div class="space-y-4".*?</main>', html, re.DOTALL)
    if m:
        c = m.group(0)
        return c[:c.rfind('</main>')]
    return ""

sett_content = get_grid(sett)
prof_content = get_grid(prof)
notif_content = get_space_y(notif)


new_html = sett[:sett.find('<div class="mb-8">')] + f'''                <div class="mb-8">
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
{sett_content}
                </div>
                
                <div id="tab-profile" class="tab-pane hidden">
{prof_content}
                </div>
                
                <div id="tab-notifications" class="tab-pane hidden">
{notif_content}
                </div>

                <script>
                        document.addEventListener('DOMContentLoaded', () => {{
                                const tabs = document.querySelectorAll('.tab-btn');
                                const panes = document.querySelectorAll('.tab-pane');

                                tabs.forEach(tab => {{
                                        tab.addEventListener('click', () => {{
                                                tabs.forEach(t => {{
                                                        t.classList.remove('border-primary', 'text-on-surface');
                                                        t.classList.add('border-transparent', 'text-on-surface-variant');
                                                }});
                                                panes.forEach(p => {{
                                                        p.classList.remove('block');
                                                        p.classList.add('hidden');
                                                }});

                                                tab.classList.remove('border-transparent', 'text-on-surface-variant');
                                                tab.classList.add('border-primary', 'text-on-surface');

                                                const targetId = tab.getAttribute('data-target');
                                                document.getElementById(targetId).classList.remove('hidden');
                                                document.getElementById(targetId).classList.add('block');
                                        }});
                                }});
                        }});
                </script>
        </main>
</body>
</html>
'''

with open('settings.html', 'w', encoding='utf-8') as f:
    f.write(new_html)
