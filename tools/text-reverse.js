window.ToolApp.register('text-reverse', {
    meta_desc: { ar: 'قراءة النص وعكس حروفه أو كلماته من النهاية للبداية.', en: 'Reverse the letters or words of a text from end to start.' },
    keywords: { ar: ['عكس', 'نص', 'مقلوب', 'reverse', 'text'], en: ['reverse', 'text', 'flip', 'words', 'letters'] },
    features: { ar: ['عكس الحروف', 'عكس ترتيب الكلمات'], en: ['Reverse letters', 'Reverse word order'] },
    render: function(container, lang) {
        const strings = {
            inp: { ar: 'أدخل النص لعكسه...', en: 'Enter text to reverse...' },
            revChar: { ar: 'عكس الحروف', en: 'Reverse Letters' },
            revWord: { ar: 'عكس الكلمات', en: 'Reverse Words' },
            revBoth: { ar: 'عكس الكلمات والحروف', en: 'Reverse Both' },
            copy: { ar: 'نسخ النتيجة', en: 'Copy' },
            copied: { ar: 'تم النسخ!', en: 'Copied!' }
        };

        container.innerHTML = `
            <style>
                .trv-wrap { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
                .trv-area { width: 100%; min-height: 180px; padding: 1.5rem; border-radius: 12px; border: 2px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); font-size: 1.1rem; outline: none; transition: border-color 0.2s; resize: vertical; }
                .trv-area:focus { border-color: var(--accent-color); }
                .trv-ctrls { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }
            </style>
            
            <div class="trv-wrap">
                <textarea id="trv-in" class="trv-area" placeholder="${strings.inp[lang]}"></textarea>
                
                <div class="trv-ctrls">
                    <button class="primary-btn trv-btn" data-act="char">${strings.revChar[lang]}</button>
                    <button class="primary-btn trv-btn" data-act="word">${strings.revWord[lang]}</button>
                    <button class="primary-btn trv-btn" data-act="both">${strings.revBoth[lang]}</button>
                </div>
                
                <div style="position:relative;">
                    <button id="trv-copy" class="primary-btn" style="position:absolute; top:1rem; right:1rem; padding:0.5rem 1rem; font-size:0.9rem; background:var(--text-secondary); display:none;">${strings.copy[lang]}</button>
                    <textarea id="trv-out" class="trv-area" readonly></textarea>
                </div>
            </div>
        `;

        const iIn = container.querySelector('#trv-in');
        const iOut = container.querySelector('#trv-out');
        const btns = container.querySelectorAll('.trv-btn');
        const btnCopy = container.querySelector('#trv-copy');

        const doRev = (act) => {
            const t = iIn.value;
            if(!t) { iOut.value = ''; btnCopy.style.display = 'none'; return; }
            
            let res = '';
            if(act === 'char') {
                res = t.split('').reverse().join('');
            } else if (act === 'word') {
                res = t.split(' ').reverse().join(' ');
            } else if (act === 'both') {
                res = t.split(' ').reverse().map(w => w.split('').reverse().join('')).join(' ');
            }
            
            iOut.value = res;
            btnCopy.style.display = 'block';
            
            // Set text alignment based on language context
            if(lang === 'ar') {
                btnCopy.style.right = 'auto';
                btnCopy.style.left = '1rem';
            }
        };

        btns.forEach(b => {
            b.addEventListener('click', () => doRev(b.getAttribute('data-act')));
        });

        btnCopy.addEventListener('click', () => {
            if(!iOut.value) return;
            navigator.clipboard.writeText(iOut.value).then(() => {
                const old = btnCopy.textContent;
                btnCopy.textContent = strings.copied[lang];
                setTimeout(() => btnCopy.textContent = old, 2000);
            });
        });
    }
});
