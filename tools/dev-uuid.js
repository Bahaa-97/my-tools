window.ToolApp.register('dev-uuid', {
    meta_desc: { ar: 'توليد معرّفات فريدة عالمياً (UUID v4) بسرعة لتطبيقاتك ومشاريعك.', en: 'Generate Universally Unique Identifiers (UUID v4) quickly for your apps.' },
    keywords: { ar: ['توليد', 'معرف', 'فريد', 'uuid', 'guid'], en: ['generate', 'uuid', 'guid', 'unique', 'identifier'] },
    features: { ar: ['توليد UUID v4 المتوافق', 'نسخ بضغطة زر'], en: ['Standard UUID v4', 'One-click copy'] },
    render: function(container, lang) {
        const strings = {
            gen: { ar: 'توليد UUID جديد', en: 'Generate New UUID' },
            copy: { ar: 'نسخ', en: 'Copy' },
            hist: { ar: 'السجل (آخر 10):', en: 'History (Last 10):' }
        };

        container.innerHTML = `
            <style>
                .du-wrap { max-width: 600px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); text-align: center; }
                .du-val { font-size: 1.5rem; font-family: monospace; background: var(--bg-color); padding: 1.5rem; border-radius: 12px; border: 2px dashed var(--border-color); color: var(--accent-color); margin-bottom: 1.5rem; word-break: break-all; }
                .du-hist { margin-top: 2rem; text-align: start; }
                .du-hist-title { font-weight: bold; color: var(--text-secondary); margin-bottom: 0.5rem; }
                .du-list { list-style: none; padding: 0; margin: 0; }
                .du-item { padding: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 0.5rem; font-family: monospace; display: flex; justify-content: space-between; align-items: center; }
                .du-item-copy { background: transparent; border: none; color: var(--accent-color); cursor: pointer; font-size: 0.9rem; }
            </style>
            
            <div class="du-wrap">
                <div id="du-val" class="du-val">xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</div>
                
                <div style="display:flex; gap:1rem; justify-content:center;">
                    <button id="du-gen" class="primary-btn">${strings.gen[lang]}</button>
                    <button id="du-copy" class="primary-btn" style="background:var(--text-secondary);">${strings.copy[lang]}</button>
                </div>
                
                <div class="du-hist">
                    <div class="du-hist-title">${strings.hist[lang]}</div>
                    <ul id="du-list" class="du-list"></ul>
                </div>
            </div>
        `;

        const generateUUID = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };

        const valEl = container.querySelector('#du-val');
        const listEl = container.querySelector('#du-list');
        let history = [];

        const renderHistory = () => {
            listEl.innerHTML = '';
            history.forEach(u => {
                const li = document.createElement('li');
                li.className = 'du-item';
                li.innerHTML = `<span>${u}</span> <button class="du-item-copy">${strings.copy[lang]}</button>`;
                li.querySelector('button').addEventListener('click', () => {
                    navigator.clipboard.writeText(u);
                });
                listEl.appendChild(li);
            });
        };

        const generateAndSet = () => {
            const u = generateUUID();
            valEl.textContent = u;
            history.unshift(u);
            if(history.length > 10) history.pop();
            renderHistory();
        };

        container.querySelector('#du-gen').addEventListener('click', generateAndSet);
        
        container.querySelector('#du-copy').addEventListener('click', () => {
            navigator.clipboard.writeText(valEl.textContent);
        });

        // Initial
        generateAndSet();
    }
});
