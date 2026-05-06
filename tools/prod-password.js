window.ToolApp.register('prod-password', {
    meta_desc: { ar: 'توليد كلمات مرور قوية وآمنة وقابلة للتخصيص لمنع الاختراق.', en: 'Generate strong, secure, and customizable passwords to prevent hacking.' },
    keywords: { ar: ['كلمة مرور', 'توليد', 'باسورد', 'أمان', 'حماية'], en: ['password', 'generator', 'security', 'secure'] },
    features: { ar: ['توليد فوري آمن', 'تحكم بنوع الحروف والرموز'], en: ['Instant secure generation', 'Control char types'] },
    render: function(container, lang) {
        const strings = {
            len: { ar: 'طول كلمة المرور:', en: 'Password Length:' },
            uc: { ar: 'حروف كبيرة (A-Z)', en: 'Uppercase (A-Z)' },
            lc: { ar: 'حروف صغيرة (a-z)', en: 'Lowercase (a-z)' },
            num: { ar: 'أرقام (0-9)', en: 'Numbers (0-9)' },
            sym: { ar: 'رموز (!@#$%)', en: 'Symbols (!@#$%)' },
            gen: { ar: 'توليد كلمة المرور', en: 'Generate Password' },
            copy: { ar: 'نسخ', en: 'Copy' },
            copied: { ar: 'تم النسخ!', en: 'Copied!' }
        };

        container.innerHTML = `
            <style>
                .pg-wrap { max-width: 450px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .pg-res { position: relative; margin-bottom: 2rem; }
                .pg-val { width: 100%; padding: 1rem; padding-inline-end: 80px; font-size: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--accent-color); font-weight: bold; outline: none; letter-spacing: 2px; text-align: center; }
                .pg-copy { position: absolute; right: 8px; top: 8px; bottom: 8px; border: none; background: var(--card-color-light); color: var(--accent-color); border-radius: 8px; padding: 0 1rem; cursor: pointer; font-weight: bold; transition: all 0.2s; }
                .pg-copy:hover { background: var(--accent-color); color: white; }
                [dir="rtl"] .pg-copy { right: auto; left: 8px; }
                
                .pg-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; color: var(--text-primary); }
                .pg-check { width: 20px; height: 20px; accent-color: var(--accent-color); cursor: pointer; }
                .pg-slider { width: 100%; margin-top: 0.5rem; accent-color: var(--accent-color); cursor: pointer; }
            </style>
            
            <div class="pg-wrap">
                <div class="pg-res">
                    <input type="text" id="pg-val" class="pg-val" readonly>
                    <button id="pg-copy" class="pg-copy">${strings.copy[lang]}</button>
                </div>
                
                <div style="margin-bottom:2rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                        <span style="font-weight:bold; color:var(--text-secondary);">${strings.len[lang]}</span>
                        <span id="pg-len-val" style="font-weight:bold; color:var(--accent-color);">16</span>
                    </div>
                    <input type="range" id="pg-len" min="8" max="64" value="16" class="pg-slider">
                </div>
                
                <div class="pg-row">
                    <label style="cursor:pointer; flex:1;">${strings.uc[lang]}</label>
                    <input type="checkbox" id="pg-uc" class="pg-check" checked>
                </div>
                <div class="pg-row">
                    <label style="cursor:pointer; flex:1;">${strings.lc[lang]}</label>
                    <input type="checkbox" id="pg-lc" class="pg-check" checked>
                </div>
                <div class="pg-row">
                    <label style="cursor:pointer; flex:1;">${strings.num[lang]}</label>
                    <input type="checkbox" id="pg-num" class="pg-check" checked>
                </div>
                <div class="pg-row">
                    <label style="cursor:pointer; flex:1;">${strings.sym[lang]}</label>
                    <input type="checkbox" id="pg-sym" class="pg-check" checked>
                </div>
                
                <button id="pg-gen" class="primary-btn" style="width:100%; margin-top:1rem;">${strings.gen[lang]}</button>
            </div>
        `;

        const valInp = container.querySelector('#pg-val');
        const lenInp = container.querySelector('#pg-len');
        const lenVal = container.querySelector('#pg-len-val');
        
        lenInp.addEventListener('input', () => { lenVal.textContent = lenInp.value; generate(); });

        const generate = () => {
            const length = parseInt(lenInp.value);
            const hasUc = container.querySelector('#pg-uc').checked;
            const hasLc = container.querySelector('#pg-lc').checked;
            const hasNum = container.querySelector('#pg-num').checked;
            const hasSym = container.querySelector('#pg-sym').checked;
            
            const uc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const lc = 'abcdefghijklmnopqrstuvwxyz';
            const num = '0123456789';
            const sym = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
            
            let allowed = '';
            if(hasUc) allowed += uc;
            if(hasLc) allowed += lc;
            if(hasNum) allowed += num;
            if(hasSym) allowed += sym;
            
            if(allowed === '') {
                container.querySelector('#pg-lc').checked = true;
                allowed = lc;
            }
            
            let pass = '';
            for(let i=0; i<length; i++) {
                pass += allowed.charAt(Math.floor(Math.random() * allowed.length));
            }
            
            valInp.value = pass;
        };

        container.querySelector('#pg-gen').addEventListener('click', generate);
        
        const copyBtn = container.querySelector('#pg-copy');
        copyBtn.addEventListener('click', () => {
            valInp.select();
            document.execCommand('copy');
            const oldTxt = copyBtn.textContent;
            copyBtn.textContent = strings.copied[lang];
            setTimeout(() => copyBtn.textContent = oldTxt, 2000);
        });

        generate(); // initial
    }
});
