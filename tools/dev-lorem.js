window.ToolApp.register('dev-lorem', {
    meta_desc: { ar: 'توليد نصوص حشو تجريبية (Lorem Ipsum) بعدة لغات لتصاميم الواجهات.', en: 'Generate dummy placeholder text (Lorem Ipsum) in multiple languages for UI design.' },
    keywords: { ar: ['نص', 'تجريبي', 'حشو', 'lorem', 'ipsum'], en: ['lorem', 'ipsum', 'text', 'generator', 'dummy'] },
    features: { ar: ['دعم العربية والإنجليزية', 'تحديد الفقرات والكلمات'], en: ['Arabic & English support', 'Paragraphs or words'] },
    render: function(container, lang) {
        const strings = {
            langSel: { ar: 'لغة النص', en: 'Text Language' },
            typeSel: { ar: 'توليد بناءً على', en: 'Generate based on' },
            amt: { ar: 'العدد', en: 'Amount' },
            p: { ar: 'فقرات', en: 'Paragraphs' },
            w: { ar: 'كلمات', en: 'Words' },
            ar: { ar: 'العربية', en: 'Arabic' },
            en: { ar: 'الإنجليزية', en: 'English' },
            gen: { ar: 'توليد النص', en: 'Generate Text' },
            copy: { ar: 'نسخ', en: 'Copy' },
            copied: { ar: 'تم النسخ!', en: 'Copied!' }
        };

        const words = {
            en: ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'],
            ar: ['هذا', 'نص', 'تجريبي', 'لا', 'يعني', 'شيئا', 'بل', 'هو', 'مخصص', 'لإظهار', 'شكل', 'الخط', 'والمسافات', 'في', 'التصميم', 'النهائي', 'دون', 'التركيز', 'على', 'المحتوى', 'نفسه', 'استخدام', 'مثل', 'هذه', 'النصوص', 'يساعد', 'المصمم', 'على', 'رؤية', 'الهيكل', 'العام', 'للصفحة', 'وكيفية', 'توزيع', 'الكلمات', 'والفقرات', 'بشكل', 'متناسق', 'وجميل', 'دون', 'تشتيت', 'الانتباه', 'بمحتوى', 'مقروء', 'يفضل', 'دائما', 'استخدام', 'نص', 'لوريم', 'إيبسوم', 'في', 'المسودات', 'المبدئية']
        };

        container.innerHTML = `
            <style>
                .dl-wrap { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
                .dl-controls { display: flex; gap: 1rem; flex-wrap: wrap; background: var(--surface-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); align-items: flex-end; }
                .dl-col { flex: 1; min-width: 150px; }
                .dl-label { display: block; font-weight: bold; color: var(--text-secondary); margin-bottom: 0.5rem; font-size: 0.9rem; }
                .dl-inp { width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; }
                .dl-out { min-height: 200px; padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); line-height: 1.8; font-size: 1.1rem; white-space: pre-wrap; }
            </style>
            
            <div class="dl-wrap">
                <div class="dl-controls">
                    <div class="dl-col">
                        <label class="dl-label">${strings.langSel[lang]}</label>
                        <select id="dl-lang" class="dl-inp">
                            <option value="ar" ${lang==='ar'?'selected':''}>${strings.ar[lang]}</option>
                            <option value="en" ${lang==='en'?'selected':''}>${strings.en[lang]}</option>
                        </select>
                    </div>
                    <div class="dl-col">
                        <label class="dl-label">${strings.typeSel[lang]}</label>
                        <select id="dl-type" class="dl-inp">
                            <option value="p">${strings.p[lang]}</option>
                            <option value="w">${strings.w[lang]}</option>
                        </select>
                    </div>
                    <div class="dl-col">
                        <label class="dl-label">${strings.amt[lang]}</label>
                        <input type="number" id="dl-amt" class="dl-inp" value="3" min="1" max="100">
                    </div>
                    <div class="dl-col">
                        <button id="dl-btn" class="primary-btn" style="width:100%;">${strings.gen[lang]}</button>
                    </div>
                </div>
                
                <div style="position:relative;">
                    <button id="dl-copy" class="primary-btn" style="position:absolute; top:1rem; right:1rem; padding:0.5rem 1rem; font-size:0.9rem; background:var(--text-secondary); display:none;">${strings.copy[lang]}</button>
                    <div id="dl-out" class="dl-out"></div>
                </div>
            </div>
        `;

        const btnGen = container.querySelector('#dl-btn');
        const btnCopy = container.querySelector('#dl-copy');
        const out = container.querySelector('#dl-out');

        const getRandomWord = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const generateSentence = (arr) => {
            const length = Math.floor(Math.random() * 8) + 5; // 5 to 12 words
            let s = [];
            for(let i=0; i<length; i++) s.push(getRandomWord(arr));
            // capitalize first
            s[0] = s[0].charAt(0).toUpperCase() + s[0].slice(1);
            return s.join(' ') + '.';
        };

        const generateParagraph = (arr) => {
            const length = Math.floor(Math.random() * 4) + 4; // 4 to 7 sentences
            let p = [];
            for(let i=0; i<length; i++) p.push(generateSentence(arr));
            return p.join(' ');
        };

        btnGen.addEventListener('click', () => {
            const l = container.querySelector('#dl-lang').value;
            const t = container.querySelector('#dl-type').value;
            const amt = parseInt(container.querySelector('#dl-amt').value) || 1;
            const dict = words[l];

            let res = '';
            if(t === 'p') {
                let paras = [];
                for(let i=0; i<amt; i++) paras.push(generateParagraph(dict));
                res = paras.join('\n\n');
            } else {
                let wds = [];
                for(let i=0; i<amt; i++) wds.push(getRandomWord(dict));
                res = wds.join(' ');
                res = res.charAt(0).toUpperCase() + res.slice(1) + '.';
            }

            // Set layout dir based on language
            out.style.direction = l === 'ar' ? 'rtl' : 'ltr';
            out.style.textAlign = l === 'ar' ? 'right' : 'left';
            
            out.textContent = res;
            btnCopy.style.display = 'block';
            
            if(l === 'ar') {
                btnCopy.style.right = 'auto';
                btnCopy.style.left = '1rem';
            } else {
                btnCopy.style.left = 'auto';
                btnCopy.style.right = '1rem';
            }
        });

        btnCopy.addEventListener('click', () => {
            navigator.clipboard.writeText(out.textContent).then(() => {
                const old = btnCopy.textContent;
                btnCopy.textContent = strings.copied[lang];
                setTimeout(() => btnCopy.textContent = old, 2000);
            });
        });

        // initial
        btnGen.click();
    }
});
