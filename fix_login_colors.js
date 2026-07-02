const fs = require('fs');

const filePath = String.raw`d:\Nichi-In\Experimental\SP_Telecom\stitch_sb_telecom_co_work_space_management_admin\Member\login.html`;

let content = fs.readFileSync(filePath, 'utf-8');

const replacements = {
    "text-textMain": "text-on-surface",
    "text-textMuted": "text-on-surface-variant",
    "border-borderSoft": "border-outline-variant",
    "border-accentDark": "border-primary",
    "focus:border-accentDark": "focus:border-primary",
};

for (const [oldClass, newClass] of Object.entries(replacements)) {
    content = content.split(oldClass).join(newClass);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Updated login.html colors!");
