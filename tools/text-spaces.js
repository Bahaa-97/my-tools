window.ToolApp.register('text-spaces', {
    meta_desc: { ar: 'إزالة الفراغات الزائدة، الأسطر الفارغة، وترتيب النص بضغطة زر.', en: 'Remove extra spaces, empty lines, and clean up text formatting instantly.' },
    keywords: { ar: ['مسافات', 'فراغات', 'مزيل', 'ترتيب', 'spaces'], en: ['remove', 'spaces', 'whitespace', 'trim', 'text'] },
    features: { ar: ['إزالة مسافات متعددة', 'إزالة الأسطر الفارغة'], en: ['Remove multiple spaces', 'Remove empty lines'] },
    render: function(container, lang) {
        const strings = {
            inp: { ar: 'أدخل النص ذو الفراغات الزائدة هنا...', en: 'Enter text with extra spaces here...' },
            rmSpaces: { ar: 'إزالة المسافات الزائدة', en: 'Remove Extra Spaces' },
            rmLines: { ar: 'إزالة الأسطر الفارغة', en: 'Remove Empty Lines' },
            trim: { ar: 'إزالة فراغات البداية/النهاية', en: 'Trim Start/End' },
            all: { ar: 'تنظيف شامل', en: 'Clean All' },
            copy: { ar: 'نسخ النتيجة', en: 'Copy' },
            copied: { ar: 'تم النسخ!', en: 'Copied!' }
        };

        container.innerHTML = `
            <style>
                .ts-wrap { max-width: 800px; margin: 0 auto; display: grid; grid-template-columns: 3fr 1fr; gap: 1.5rem; }
                @media (max-width: 768px) { .ts-wrap { grid-template-columns: 1fr; } }
                .ts-area { width: 100%; min-height: 300px; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); font-size: 1.1rem; outline: none; resize: vertical; }
                .ts-ctrls { display: flex; flex-direction: column; gap: 1rem; background: var(--surface-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .ts-btn { width: 100%; }
            </style>
            
            <div class="ts-wrap">
                <textarea id="ts-area" class="ts-area" placeholder="${strings.inp[lang]}"></textarea>
                
                <div class="ts-ctrls">
                    <button class="primary-btn ts-btn" data-act="spaces">${strings.rmSpaces[lang]}</button>
                    <button class="primary-btn ts-btn" data-act="lines">${strings.rmLines[lang]}</button>
                    <button class="primary-btn ts-btn" data-act="trim">${strings.trim[lang]}</button>
                    <button class="primary-btn ts-btn" data-act="all" style="background:var(--accent-color); margin-top:1rem;">${strings.all[lang]}</button>
                    
                    <button id="ts-copy" class="primary-btn ts-btn" style="background:var(--text-secondary); margin-top:2rem;">${strings.copy[lang]}</button>
                </div>
            </div>
        `;

        const area = container.querySelector('#ts-area');
        const btns = container.querySelectorAll('.ts-btn[data-act]');
        const btnCopy = container.querySelector('#ts-copy');

        btns.forEach(b => {
            b.addEventListener('click', () => {
                let text = area.value;
                if(!text) return;
                
                const act = b.getAttribute('data-act');
                if(act === 'spaces' || act === 'all') {
                    // replace multiple spaces with single space, but keep newlines intact
                    text = text.replace(/ +/g, ' ');
                }
                if(act === 'lines' || act === 'all') {
                    // remove multiple newlines
                    text = text.replace(/\n\s*\n/g, '\n');
                }
                if(act === 'trim' || act === 'all') {
                    text = text.trim();
                    // trim each line
                    text = text.split('\n').map(l => l.trim()).join('\n');
                }
                
                area.value = text;
            });
        });

        btnCopy.addEventListener('click', () => {
            if(!area.value) return;
            navigator.clipboard.writeText(area.value).then(() => {
                const old = btnCopy.textContent;
                btnCopy.textContent = strings.copied[lang];
                setTimeout(() => btnCopy.textContent = old, 2000);
            });
        });
    }
});
