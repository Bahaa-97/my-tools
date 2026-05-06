const fs = require('fs');
const path = require('path');

const registryContent = fs.readFileSync('registry.js', 'utf8');

let toolsMatch = registryContent.match(/window\.TOOLS_REGISTRY\s*=\s*\[([\s\S]*?)\];/);
if(!toolsMatch) {
    console.log('Failed to find TOOLS_REGISTRY');
    process.exit(1);
}

const toolsStrs = toolsMatch[1].split('},').map(s => s + '}');

const idRegex = /id:\s*['"]([^'"]+)['"]/;
const pathRegex = /path:\s*['"]([^'"]+)['"]/;

let hasErrors = false;
let checkedCount = 0;

console.log('--- Starting System Check ---');

for(const tStr of toolsStrs) {
    const mId = tStr.match(idRegex);
    const mPath = tStr.match(pathRegex);
    
    if(mId && mPath) {
        const id = mId[1];
        const tPath = mPath[1];
        checkedCount++;
        
        if(!fs.existsSync(tPath)) {
            console.log('❌ ERROR: File missing -> ' + tPath + ' (ID: ' + id + ')');
            hasErrors = true;
            continue;
        }
        
        const fileContent = fs.readFileSync(tPath, 'utf8');
        
        if(!fileContent.includes("window.ToolApp.register('" + id + "'") && !fileContent.includes('window.ToolApp.register("' + id + '"')) {
            console.log('❌ ERROR: Incorrect ID or missing register call in ' + tPath + ' (Expected ID: ' + id + ')');
            hasErrors = true;
        }
        
        try {
            new Function(fileContent);
        } catch(e) {
            console.log('❌ ERROR: Syntax error in ' + tPath + ' -> ' + e.message);
            hasErrors = true;
        }
    }
}

console.log('--- Check Complete ---');
console.log('Checked ' + checkedCount + ' tools.');
if(hasErrors) {
    console.log('Status: FAILED ❌');
} else {
    console.log('Status: PASSED ✅ All ' + checkedCount + ' tools are valid and error-free.');
}
