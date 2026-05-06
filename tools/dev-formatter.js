window.ToolApp.register('dev-formatter', {
    meta_desc: { ar: 'تنسيق وترتيب أكواد JSON لتصبح قابلة للقراءة، مع اكتشاف الأخطاء.', en: 'Beautify and format JSON code for readability, with syntax validation.' },
    keywords: { ar: ['تنسيق', 'كود', 'ترتيب', 'مطور', 'json'], en: ['format', 'beautify', 'json', 'developer', 'code'] },
    features: { ar: ['تنسيق JSON الدقيق', 'اكتشاف الأخطاء اللغوية'], en: ['Precise JSON formatting', 'Syntax error detection'] },
    render: function(container, lang) {
        const strings = {
            in: { ar: 'أدخل الكود (JSON)', en: 'Input Code (JSON)' },
            out: { ar: 'النتيجة', en: 'Result' },
            fmt: { ar: 'تنسيق JSON', en: 'Format JSON' },
            minify: { ar: 'ضغط JSON', en: 'Minify JSON' },
            copy: { ar: 'نسخ النتيجة', en: 'Copy Result' },
            err: { ar: 'يوجد خطأ في كود JSON:', en: 'Invalid JSON:' },
            copied: { ar: 'تم النسخ!', en: 'Copied!' }
        };

        container.innerHTML = `
            <style>
                .df-wrap { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
                .df-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                @media (max-width: 768px) { .df-grid { grid-template-columns: 1fr; } }
                .df-box { background: var(--surface-color); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); display: flex; flex-direction: column; box-shadow: var(--glass-shadow); }
                .df-label { font-weight: bold; margin-bottom: 0.5rem; color: var(--text-secondary); }
                .df-area { flex: 1; min-height: 400px; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; font-family: monospace; resize: vertical; line-height: 1.5; }
                .df-controls { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; margin: 1rem 0; }
                .df-err { color: #ef4444; font-size: 0.9rem; margin-top: 0.5rem; min-height: 1.5rem; }
            </style>
            
            <div class="df-wrap">
                <div class="df-controls">
                    <button id="df-fmt" class="primary-btn">${strings.fmt[lang]}</button>
                    <button id="df-min" class="primary-btn" style="background:var(--text-secondary);">${strings.minify[lang]}</button>
                    <button id="df-copy" class="primary-btn" style="background:var(--accent-color);">${strings.copy[lang]}</button>
                </div>
                
                <div class="df-grid">
                    <div class="df-box">
                        <div class="df-label">${strings.in[lang]}</div>
                        <textarea id="df-in" class="df-area" placeholder='{"name": "Daily Tools"}'></textarea>
                        <div id="df-err" class="df-err"></div>
                    </div>
                    <div class="df-box">
                        <div class="df-label">${strings.out[lang]}</div>
                        <textarea id="df-out" class="df-area" readonly></textarea>
                    </div>
                </div>
            </div>
        `;

        const tin = container.querySelector('#df-in');
        const tout = container.querySelector('#df-out');
        const terr = container.querySelector('#df-err');

        const processJson = (space) => {
            terr.textContent = '';
            const val = tin.value.trim();
            if(!val) {
                tout.value = '';
                return;
            }
            try {
                const parsed = JSON.parse(val);
                tout.value = JSON.stringify(parsed, null, space);
            } catch(e) {
                terr.textContent = `${strings.err[lang]} ${e.message}`;
            }
        };

        container.querySelector('#df-fmt').addEventListener('click', () => processJson(4));
        container.querySelector('#df-min').addEventListener('click', () => processJson(0));

        const btnCopy = container.querySelector('#df-copy');
        btnCopy.addEventListener('click', () => {
            if(!tout.value) return;
            navigator.clipboard.writeText(tout.value).then(() => {
                const old = btnCopy.textContent;
                btnCopy.textContent = strings.copied[lang];
                setTimeout(() => btnCopy.textContent = old, 2000);
            });
        });
    }
});
