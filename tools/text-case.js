window.ToolApp.register('text-case', {
    meta_desc: { ar: 'تحويل النصوص الإنجليزية بين الأحرف الكبيرة والصغيرة وتكبير بداية الكلمات.', en: 'Convert English text between UPPERCASE, lowercase, and Capitalized easily.' },
    keywords: { ar: ['تحويل', 'حروف', 'كابيتال', 'سمول', 'case'], en: ['case', 'converter', 'uppercase', 'lowercase', 'capitalize'] },
    features: { ar: ['تحويل فوري', 'يدعم تحويلات متعددة'], en: ['Instant convert', 'Multiple case types'] },
    render: function(container, lang) {
        const strings = {
            inp: { ar: 'أدخل النص هنا...', en: 'Enter text here...' },
            up: { ar: 'UPPERCASE', en: 'UPPERCASE' },
            low: { ar: 'lowercase', en: 'lowercase' },
            cap: { ar: 'Capitalize Words', en: 'Capitalize Words' },
            alt: { ar: 'aLtErNaTiNg', en: 'aLtErNaTiNg' },
            copy: { ar: 'نسخ النتيجة', en: 'Copy Result' },
            copied: { ar: 'تم النسخ!', en: 'Copied!' }
        };

        container.innerHTML = `
            <style>
                .tca-wrap { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
                .tca-area { width: 100%; min-height: 200px; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); font-size: 1.1rem; outline: none; transition: border-color 0.2s; resize: vertical; }
                .tca-area:focus { border-color: var(--accent-color); }
                .tca-ctrls { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; background: var(--surface-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
            </style>
            
            <div class="tca-wrap">
                <textarea id="tca-area" class="tca-area" placeholder="${strings.inp[lang]}"></textarea>
                
                <div class="tca-ctrls">
                    <button class="primary-btn tca-btn" data-act="up">${strings.up[lang]}</button>
                    <button class="primary-btn tca-btn" data-act="low">${strings.low[lang]}</button>
                    <button class="primary-btn tca-btn" data-act="cap">${strings.cap[lang]}</button>
                    <button class="primary-btn tca-btn" data-act="alt">${strings.alt[lang]}</button>
                    <div style="flex-basis:100%; height:0;"></div>
                    <button id="tca-copy" class="primary-btn" style="background:var(--text-secondary); width:100%; max-width:200px;">${strings.copy[lang]}</button>
                </div>
            </div>
        `;

        const area = container.querySelector('#tca-area');
        const btns = container.querySelectorAll('.tca-btn');
        const btnCopy = container.querySelector('#tca-copy');

        btns.forEach(b => {
            b.addEventListener('click', () => {
                const text = area.value;
                if(!text) return;
                
                const act = b.getAttribute('data-act');
                if(act === 'up') area.value = text.toUpperCase();
                else if(act === 'low') area.value = text.toLowerCase();
                else if(act === 'cap') {
                    area.value = text.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase());
                }
                else if(act === 'alt') {
                    area.value = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
                }
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
