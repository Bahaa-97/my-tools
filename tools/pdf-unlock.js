window.ToolApp.register('pdf-unlock', {
    meta_desc: { ar: 'فك تشفير وإزالة كلمة المرور من ملفات PDF المفتوحة.', en: 'Decrypt and remove password from PDF files.' },
    keywords: { ar: ['فك تشفير', 'كلمة مرور', 'pdf', 'إزالة'], en: ['decrypt', 'password', 'pdf', 'remove'] },
    features: { ar: ['إزالة كلمة المرور للوصول السريع', 'آمن ومحلي'], en: ['Remove password for quick access', 'Secure & local'] },
    render: function(container, lang) {
        const strings = {
            desc: { ar: 'إذا كنت تعرف كلمة المرور، أدخلها هنا لإزالتها بشكل دائم وحفظ الملف بدون تشفير.', en: 'If you know the password, enter it here to permanently remove it and save unencrypted.' },
            sel: { ar: 'اختر ملف PDF مشفر', en: 'Select Encrypted PDF' },
            pwd: { ar: 'كلمة المرور الحالية', en: 'Current Password' },
            run: { ar: 'فك التشفير وتحميل', en: 'Unlock & Download' },
            wrong: { ar: 'كلمة المرور غير صحيحة.', en: 'Incorrect password.' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${strings.desc[lang]}</p>
                <input type="file" id="u-input" accept="application/pdf" style="display:none;">
                <div id="u-drop" style="border: 2px dashed var(--border-color); padding: 2rem; border-radius: 16px; margin-bottom: 1rem; cursor: pointer; background: var(--surface-color);">
                    <h3 id="u-name">${strings.sel[lang]}</h3>
                </div>
                <div id="u-opts" style="display:none; flex-direction:column; gap:1rem; margin-bottom:1.5rem;">
                    <input type="password" id="u-pwd" placeholder="${strings.pwd[lang]}" style="padding:0.75rem; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-primary); outline:none;">
                </div>
                <button class="primary-btn" id="u-btn" style="display:none; margin:0 auto;">${strings.run[lang]}</button>
            </div>
        `;

        let currentFile = null;
        const drop = container.querySelector('#u-drop'), inp = container.querySelector('#u-input'), btn = container.querySelector('#u-btn'), name = container.querySelector('#u-name'), opts = container.querySelector('#u-opts'), uPwd = container.querySelector('#u-pwd');

        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => {
            if(e.target.files[0]) {
                currentFile = e.target.files[0];
                name.textContent = currentFile.name;
                opts.style.display = 'flex'; btn.style.display = 'block';
            }
        });

        btn.addEventListener('click', () => {
            if(!currentFile || !uPwd.value) return;
            if(!window.PDFLib) {
                const s = document.createElement('script');
                s.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
                s.onload = runUnlock; document.body.appendChild(s);
            } else runUnlock();
        });

        async function runUnlock() {
            btn.disabled = true;
            try {
                const { PDFDocument } = window.PDFLib;
                const arrayBuffer = await currentFile.arrayBuffer();
                
                // Attempt to load with password
                const pdfDoc = await PDFDocument.load(arrayBuffer, { password: uPwd.value });
                
                // Saving it normally strips encryption if password options aren't passed
                const pdfBytes = await pdfDoc.save();
                
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'unlocked_' + currentFile.name; a.click();
            } catch(e) { 
                alert(strings.wrong[lang]); 
            }
            btn.disabled = false;
        }
    }
});
