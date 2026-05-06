window.ToolApp.register('pdf-protect', {
    meta_desc: { ar: 'تشفير وحماية ملفات PDF بكلمة مرور.', en: 'Encrypt and protect PDF files with a password.' },
    keywords: { ar: ['حماية', 'تشفير', 'كلمة مرور', 'pdf'], en: ['protect', 'encrypt', 'password', 'pdf'] },
    features: { ar: ['تشفير قوي', 'معالجة محلية بأمان'], en: ['Strong encryption', 'Safe local processing'] },
    render: function(container, lang) {
        const strings = {
            desc: { ar: 'قم بتعيين كلمة مرور لمنع فتح الملف إلا بواسطتها.', en: 'Set a password to prevent opening the file without it.' },
            sel: { ar: 'اختر ملف PDF', en: 'Select PDF File' },
            pwd: { ar: 'كلمة المرور', en: 'Password' },
            run: { ar: 'تشفير وتحميل', en: 'Encrypt & Download' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${strings.desc[lang]}</p>
                <input type="file" id="p-input" accept="application/pdf" style="display:none;">
                <div id="p-drop" style="border: 2px dashed var(--border-color); padding: 2rem; border-radius: 16px; margin-bottom: 1rem; cursor: pointer; background: var(--surface-color);">
                    <h3 id="p-name">${strings.sel[lang]}</h3>
                </div>
                <div id="p-opts" style="display:none; flex-direction:column; gap:1rem; margin-bottom:1.5rem;">
                    <input type="password" id="p-pwd" placeholder="${strings.pwd[lang]}" style="padding:0.75rem; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-primary); outline:none;">
                </div>
                <button class="primary-btn" id="p-btn" style="display:none; margin:0 auto;">${strings.run[lang]}</button>
            </div>
        `;

        let currentFile = null;
        const drop = container.querySelector('#p-drop'), inp = container.querySelector('#p-input'), btn = container.querySelector('#p-btn'), name = container.querySelector('#p-name'), opts = container.querySelector('#p-opts'), pPwd = container.querySelector('#p-pwd');

        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => {
            if(e.target.files[0]) {
                currentFile = e.target.files[0];
                name.textContent = currentFile.name;
                opts.style.display = 'flex'; btn.style.display = 'block';
            }
        });

        btn.addEventListener('click', () => {
            if(!currentFile || !pPwd.value) return;
            if(!window.PDFLib) {
                const s = document.createElement('script');
                s.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
                s.onload = runProtect; document.body.appendChild(s);
            } else runProtect();
        });

        async function runProtect() {
            btn.disabled = true;
            try {
                const { PDFDocument } = window.PDFLib;
                const arrayBuffer = await currentFile.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                
                const pdfBytes = await pdfDoc.save({
                    userPassword: pPwd.value,
                    ownerPassword: pPwd.value,
                    permissions: { printing: 'highResolution', modifying: false, copying: false }
                });
                
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'protected_' + currentFile.name; a.click();
            } catch(e) { alert('Error: The file might already be encrypted.'); }
            btn.disabled = false;
        }
    }
});
