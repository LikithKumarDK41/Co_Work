import os

file_path = r"d:\Nichi-In\Experimental\SP_Telecom\stitch_sb_telecom_co_work_space_management_admin\Member\login.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace custom classes with standard ones
replacements = {
    "text-textMain": "text-on-surface",
    "text-textMuted": "text-on-surface-variant",
    "border-borderSoft": "border-outline-variant",
    "border-accentDark": "border-primary",
    "focus:border-accentDark": "focus:border-primary",
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated login.html colors!")
