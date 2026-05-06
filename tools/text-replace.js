window.ToolApp.register('text-replace', {
    meta_desc: { ar: 'البحث عن كلمات معينة داخل النص واستبدالها دفعة واحدة بسهولة.', en: 'Find specific words in text and replace them all at once easily.' },
    keywords: { ar: ['بحث', 'استبدال', 'كلمة', 'find', 'replace'], en: ['find', 'replace', 'text', 'word', 'substitute'] },
    features: { ar: ['استبدال الكل فوراً', 'حساسية لحالة الأحرف'], en: ['Replace all instantly', 'Case sensitive toggle'] },
    render: function(container, lang) {
        const strings = {
            inp: { ar: 'النص الأصلي...', en: 'Original Text...' },
            find: { ar: 'ابحث عن:', en: 'Find:' },
            rep: { ar: 'استبدل بـ:', en: 'Replace with:' },
            case: { ar: 'مطابقة حالة الأحرف (Case Sensitive)', en: 'Case Sensitive' },
            doRep: { ar: 'استبدال الكل', en: 'Replace All' },
            res: { ar: 'النتيجة:', en: 'Result:' }
        };

        container.innerHTML = `
            <style>
                .tr-wrap { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
                .tr-area { width: 100%; min-height: 150px; padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; resize: vertical; font-size: 1rem; line-height: 1.6; }
                .tr-box { background: var(--surface-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: end; }
                @media (max-width: 600px) { .tr-box { grid-template-columns: 1fr; } }
                .tr-group { display: flex; flex-direction: column; }
                .tr-label { font-weight: bold; margin-bottom: 0.5rem; color: var(--text-secondary); }
                .tr-inp { padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; font-size: 1rem; }
                .tr-check-wrap { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; flex-wrap: wrap; gap: 1rem; }
                .tr-check { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.95rem; color: var(--text-primary); }
            </style>
            
            <div class="tr-wrap">
                <textarea id="tr-in" class="tr-area" placeholder="${strings.inp[lang]}"></textarea>
                
                <div class="tr-box">
                    <div class="tr-group">
                        <label class="tr-label">${strings.find[lang]}</label>
                        <input type="text" id="tr-f" class="tr-inp">
                    </div>
                    <div class="tr-group">
                        <label class="tr-label">${strings.rep[lang]}</label>
                        <input type="text" id="tr-r" class="tr-inp">
                    </div>
                    <div class="tr-check-wrap">
                        <label class="tr-check">
                            <input type="checkbox" id="tr-c">
                            ${strings.case[lang]}
                        </label>
                        <button id="tr-btn" class="primary-btn">${strings.doRep[lang]}</button>
                    </div>
                </div>
                
                <div class="tr-group">
                    <label class="tr-label">${strings.res[lang]}</label>
                    <textarea id="tr-out" class="tr-area" readonly></textarea>
                </div>
            </div>
        `;

        const iIn = container.querySelector('#tr-in');
        const iF = container.querySelector('#tr-f');
        const iR = container.querySelector('#tr-r');
        const iC = container.querySelector('#tr-c');
        const iOut = container.querySelector('#tr-out');
        const btn = container.querySelector('#tr-btn');

        const doReplace = () => {
            const txt = iIn.value;
            const f = iF.value;
            const r = iR.value;
            if(!txt) { iOut.value = ''; return; }
            if(!f) { iOut.value = txt; return; }

            const flags = iC.checked ? 'g' : 'gi';
            try {
                // Escape regex special chars for literal search
                const safeF = f.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\$&');
                const regex = new RegExp(safeF, flags);
                iOut.value = txt.replace(regex, r);
            } catch(e) {
                iOut.value = txt;
            }
        };

        btn.addEventListener('click', doReplace);
    }
});
