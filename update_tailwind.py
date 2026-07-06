import os
import re

admin_file = r"admin_dashboard\code.html"
member_dir = r"..\Member"

with open(admin_file, 'r', encoding='utf-8') as f:
    admin_html = f.read()

# Extract the tailwind config block
match = re.search(r'(<script id="tailwind-config">.*?</script>)', admin_html, re.DOTALL)
if not match:
    print("Could not find tailwind config in admin file.")
    exit(1)

admin_config = match.group(1)

count = 0
for filename in os.listdir(member_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(member_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the existing tailwind config
        new_content, num_subs = re.subn(r'<script id="tailwind-config">.*?</script>', admin_config, content, flags=re.DOTALL)
        
        if num_subs > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
            count += 1
        else:
            print(f"No config block found in {filename}")

print(f"Updated {count} files.")
