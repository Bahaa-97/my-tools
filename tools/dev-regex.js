window.ToolApp.register('dev-regex', {
    meta_desc: { ar: 'اختبار التعابير النمطية (Regex) على النصوص بشكل مباشر مع توضيح التطابقات.', en: 'Test Regular Expressions live against text with match highlighting.' },
    keywords: { ar: ['تعبير', 'نمطي', 'بحث', 'regex', 'tester'], en: ['regex', 'regular expression', 'tester', 'match'] },
    features: { ar: ['تظليل التطابقات حياً', 'دعم الأعلام (Flags)'], en: ['Live match highlighting', 'Flags support'] },
    render: function(container, lang) {
        const strings = {
            expr: { ar: 'التعبير النمطي (Regex)', en: 'Regular Expression' },
            flags: { ar: 'الأعلام (Flags)', en: 'Flags' },
            text: { ar: 'نص الاختبار', en: 'Test Text' },
            res: { ar: 'التطابقات:', en: 'Matches:' }
        };

        container.innerHTML = `
            <style>
                .dr-wrap { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
                .dr-box { background: var(--surface-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .dr-label { font-weight: bold; margin-bottom: 0.5rem; color: var(--text-secondary); display: block; }
                .dr-inp { width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; font-family: monospace; }
                .dr-area { width: 100%; min-height: 150px; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; resize: vertical; }
                .dr-highlight { background: rgba(var(--c-rgb, 59, 130, 246), 0.2); border: 1px solid var(--accent-color); border-radius: 4px; padding: 0 2px; }
                .dr-out { min-height: 150px; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); white-space: pre-wrap; word-break: break-all; }
            </style>
            
            <div class="dr-wrap">
                <div class="dr-box">
                    <div style="display:flex; gap:1rem;">
                        <div style="flex:3;">
                            <label class="dr-label">${strings.expr[lang]}</label>
                            <input type="text" id="dr-exp" class="dr-inp" placeholder="[a-zA-Z]+">
                        </div>
                        <div style="flex:1;">
                            <label class="dr-label">${strings.flags[lang]}</label>
                            <input type="text" id="dr-flags" class="dr-inp" value="g">
                        </div>
                    </div>
                </div>
                
                <div class="dr-box">
                    <label class="dr-label">${strings.text[lang]}</label>
                    <textarea id="dr-txt" class="dr-area" placeholder="Enter text here to test..."></textarea>
                </div>
                
                <div class="dr-box">
                    <label class="dr-label">${strings.res[lang]}</label>
                    <div id="dr-out" class="dr-out"></div>
                </div>
            </div>
        `;

        const tExp = container.querySelector('#dr-exp');
        const tFlags = container.querySelector('#dr-flags');
        const tTxt = container.querySelector('#dr-txt');
        const tOut = container.querySelector('#dr-out');

        const escapeHtml = (unsafe) => {
            return unsafe
                 .replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
        };

        const update = () => {
            const exp = tExp.value;
            const flags = tFlags.value;
            const txt = tTxt.value;
            
            if(!txt) { tOut.innerHTML = ''; return; }
            if(!exp) { tOut.innerHTML = escapeHtml(txt); return; }

            try {
                const regex = new RegExp(exp, flags);
                let lastIndex = 0;
                let match;
                let html = '';
                
                // Need to ensure global flag is present for iterative matching, or handle single match
                if(regex.global) {
                    while((match = regex.exec(txt)) !== null) {
                        if(match[0].length === 0) {
                            regex.lastIndex++; // Prevent infinite loop on zero-length matches
                            continue;
                        }
                        html += escapeHtml(txt.substring(lastIndex, match.index));
                        html += `<span class="dr-highlight">${escapeHtml(match[0])}</span>`;
                        lastIndex = regex.lastIndex;
                    }
                    html += escapeHtml(txt.substring(lastIndex));
                } else {
                    match = regex.exec(txt);
                    if(match) {
                        html += escapeHtml(txt.substring(0, match.index));
                        html += `<span class="dr-highlight">${escapeHtml(match[0])}</span>`;
                        html += escapeHtml(txt.substring(match.index + match[0].length));
                    } else {
                        html = escapeHtml(txt);
                    }
                }
                
                tOut.innerHTML = html;
            } catch(e) {
                tOut.innerHTML = `<span style="color:#ef4444;">${escapeHtml(e.message)}</span>`;
            }
        };

        tExp.addEventListener('input', update);
        tFlags.addEventListener('input', update);
        tTxt.addEventListener('input', update);
    }
});
