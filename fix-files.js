const fs = require('fs');
const path = require('path');
const dir = 'tools';
const files = fs.readdirSync(dir);
let fixedCount = 0;
for(const f of files) {
    if(f.endsWith('.js')) {
        const fp = path.join(dir, f);
        let content = fs.readFileSync(fp, 'utf8');
        // Replace \` with `
        let newContent = content.replace(/\\`/g, '`');
        // Replace \$ with $
        newContent = newContent.replace(/\\\$/g, '$');
        if(content !== newContent) {
            fs.writeFileSync(fp, newContent);
            fixedCount++;
        }
    }
}
console.log('Fixed files: ' + fixedCount);
