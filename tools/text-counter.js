window.ToolApp.register('text-counter', {
    meta_desc: { ar: 'إحصائيات دقيقة لعدد الكلمات، الحروف، الأسطر، والفقرات في النصوص الخاصة بك.', en: 'Accurate statistics for words, characters, lines, and paragraphs in your text.' },
    keywords: { ar: ['عداد', 'كلمات', 'حروف', 'نص', 'word', 'counter'], en: ['word', 'counter', 'character', 'text', 'stats'] },
    features: { ar: ['إحصائيات فورية', 'حساب المسافات والأسطر'], en: ['Instant live stats', 'Counts spaces & lines'] },
    render: function(container, lang) {
        const strings = {
            inp: { ar: 'أدخل أو انسخ النص هنا...', en: 'Type or paste text here...' },
            words: { ar: 'كلمات', en: 'Words' },
            chars: { ar: 'حروف', en: 'Characters' },
            charsNoSpace: { ar: 'حروف (بدون مسافات)', en: 'Chars (No Spaces)' },
            lines: { ar: 'أسطر', en: 'Lines' },
            paras: { ar: 'فقرات', en: 'Paragraphs' },
            clear: { ar: 'مسح النص', en: 'Clear Text' }
        };

        container.innerHTML = `
            <style>
                .tc-wrap { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
                .tc-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; }
                .tc-stat-box { background: var(--surface-color); padding: 1.5rem 1rem; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); text-align: center; }
                .tc-stat-val { font-size: 2rem; font-weight: bold; color: var(--accent-color); margin-bottom: 0.5rem; }
                .tc-stat-lbl { font-size: 0.9rem; color: var(--text-secondary); font-weight: bold; text-transform: uppercase; }
                .tc-area { width: 100%; min-height: 250px; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); font-size: 1.1rem; line-height: 1.6; outline: none; transition: border-color 0.2s; resize: vertical; }
                .tc-area:focus { border-color: var(--accent-color); }
                .tc-ctrl { display: flex; justify-content: flex-end; }
            </style>
            
            <div class="tc-wrap">
                <div class="tc-stats">
                    <div class="tc-stat-box">
                        <div id="v-words" class="tc-stat-val">0</div>
                        <div class="tc-stat-lbl">${strings.words[lang]}</div>
                    </div>
                    <div class="tc-stat-box">
                        <div id="v-chars" class="tc-stat-val">0</div>
                        <div class="tc-stat-lbl">${strings.chars[lang]}</div>
                    </div>
                    <div class="tc-stat-box">
                        <div id="v-chars-ns" class="tc-stat-val">0</div>
                        <div class="tc-stat-lbl">${strings.charsNoSpace[lang]}</div>
                    </div>
                    <div class="tc-stat-box">
                        <div id="v-lines" class="tc-stat-val">0</div>
                        <div class="tc-stat-lbl">${strings.lines[lang]}</div>
                    </div>
                    <div class="tc-stat-box">
                        <div id="v-paras" class="tc-stat-val">0</div>
                        <div class="tc-stat-lbl">${strings.paras[lang]}</div>
                    </div>
                </div>
                
                <textarea id="tc-area" class="tc-area" placeholder="${strings.inp[lang]}"></textarea>
                
                <div class="tc-ctrl">
                    <button id="tc-clear" class="primary-btn" style="background:var(--text-secondary);">${strings.clear[lang]}</button>
                </div>
            </div>
        `;

        const area = container.querySelector('#tc-area');
        const vWords = container.querySelector('#v-words');
        const vChars = container.querySelector('#v-chars');
        const vCharsNs = container.querySelector('#v-chars-ns');
        const vLines = container.querySelector('#v-lines');
        const vParas = container.querySelector('#v-paras');
        const btnClear = container.querySelector('#tc-clear');

        const updateStats = () => {
            const text = area.value;
            if(!text) {
                vWords.textContent = '0'; vChars.textContent = '0'; vCharsNs.textContent = '0';
                vLines.textContent = '0'; vParas.textContent = '0'; return;
            }

            vChars.textContent = text.length;
            vCharsNs.textContent = text.replace(/\s/g, '').length;
            
            // Words logic: split by spaces/newlines
            const words = text.trim().split(/\s+/);
            vWords.textContent = text.trim() === '' ? '0' : words.length;
            
            const lines = text.split('\n');
            vLines.textContent = lines.length;
            
            // Paragraphs logic: split by multiple newlines
            const paras = text.split(/\n\s*\n/).filter(p => p.trim() !== '');
            vParas.textContent = paras.length;
        };

        area.addEventListener('input', updateStats);
        
        btnClear.addEventListener('click', () => {
            area.value = '';
            updateStats();
            area.focus();
        });
    }
});
