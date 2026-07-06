const fs = require('fs');
const path = require('path');

const adminFile = path.join(__dirname, 'admin_dashboard', 'code.html');
const memberDir = path.join(__dirname, '..', 'Member');

const adminHtml = fs.readFileSync(adminFile, 'utf8');

// Extract the tailwind config block
const match = adminHtml.match(/(<script id="tailwind-config">[\s\S]*?<\/script>)/);
if (!match) {
    console.error("Could not find tailwind config in admin file.");
    process.exit(1);
}

const adminConfig = match[1];

let count = 0;
const files = fs.readdirSync(memberDir);
for (const filename of files) {
    if (filename.endsWith('.html')) {
        const filepath = path.join(memberDir, filename);
        const content = fs.readFileSync(filepath, 'utf8');
        
        // Replace the existing tailwind config
        const newContent = content.replace(/<script id="tailwind-config">[\s\S]*?<\/script>/g, adminConfig);
        
        if (newContent !== content) {
            fs.writeFileSync(filepath, newContent, 'utf8');
            console.log(`Updated ${filename}`);
            count++;
        } else {
            console.log(`No config block found in ${filename}`);
        }
    }
}

console.log(`Updated ${count} files.`);
