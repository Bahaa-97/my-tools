window.ToolApp.register('pdf-remove-pages', {
    meta_desc: { ar: 'حذف صفحات معينة من ملف PDF بسهولة.', en: 'Remove specific pages from a PDF file easily.' },
    keywords: { ar: ['حذف', 'صفحات', 'pdf', 'إزالة'], en: ['remove', 'pages', 'pdf', 'delete'] },
    features: { ar: ['تحديد متعدد للصفحات', 'معالجة محلية سريعة'], en: ['Multi-page selection', 'Fast local processing'] },
    render: function(container, lang) {
        const strings = {
            desc: { ar: 'أدخل أرقام الصفحات التي تود حذفها مفصولة بفاصلة (مثال: 1, 3, 5).', en: 'Enter page numbers to remove separated by commas (e.g. 1, 3, 5).' },
            sel: { ar: 'اختر ملف PDF', en: 'Select PDF File' },
            pages: { ar: 'أرقام الصفحات (مثال: 1, 3)', en: 'Page numbers (e.g. 1, 3)' },
            run: { ar: 'حذف وتحميل', en: 'Remove & Download' },
            errFormat: { ar: 'تنسيق أرقام غير صحيح.', en: 'Invalid numbers format.' },
            errOOB: { ar: 'بعض الصفحات غير موجودة في الملف.', en: 'Some pages do not exist in the file.' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${strings.desc[lang]}</p>
                <input type="file" id="rp-input" accept="application/pdf" style="display:none;">
                <div id="rp-drop" style="border: 2px dashed var(--border-color); padding: 2rem; border-radius: 16px; margin-bottom: 1rem; cursor: pointer; background: var(--surface-color);">
                    <h3 id="rp-name">${strings.sel[lang]}</h3>
                </div>
                <div id="rp-opts" style="display:none; flex-direction:column; gap:1rem; margin-bottom:1.5rem;">
                    <input type="text" id="rp-pages" placeholder="${strings.pages[lang]}" style="padding:0.75rem; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-primary); outline:none;">
                </div>
                <button class="primary-btn" id="rp-btn" style="display:none; margin:0 auto;">${strings.run[lang]}</button>
            </div>
        `;

        let currentFile = null, pageCount = 0;
        const drop = container.querySelector('#rp-drop'), inp = container.querySelector('#rp-input'), btn = container.querySelector('#rp-btn'), name = container.querySelector('#rp-name'), opts = container.querySelector('#rp-opts'), pagesInp = container.querySelector('#rp-pages');

        const loadPDFLib = (cb) => {
            if(window.PDFLib) return cb();
            const s = document.createElement('script');
            s.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
            s.onload = cb; document.body.appendChild(s);
        };

        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => {
            if(e.target.files[0]) {
                currentFile = e.target.files[0];
                name.textContent = lang === 'ar' ? 'جاري قراءة الملف...' : 'Reading file...';
                loadPDFLib(async () => {
                    try {
                        const arrayBuffer = await currentFile.arrayBuffer();
                        const pdfDoc = await window.PDFLib.PDFDocument.load(arrayBuffer);
                        pageCount = pdfDoc.getPageCount();
                        name.textContent = currentFile.name + ` (${pageCount} Pages)`;
                        opts.style.display = 'flex'; btn.style.display = 'block';
                    } catch(err) { name.textContent = 'Error loading file'; }
                });
            }
        });

        btn.addEventListener('click', async () => {
            if(!currentFile || !pagesInp.value) return;
            const str = pagesInp.value;
            // Parse pages
            const pagesToRemove = str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            if(pagesToRemove.length === 0) return alert(strings.errFormat[lang]);
            
            // Check out of bounds
            if(pagesToRemove.some(n => n < 1 || n > pageCount)) return alert(strings.errOOB[lang]);
            
            btn.disabled = true;
            try {
                const arrayBuffer = await currentFile.arrayBuffer();
                const pdfDoc = await window.PDFLib.PDFDocument.load(arrayBuffer);
                
                // Sort descending to remove without affecting indices of earlier pages
                const uniquePages = [...new Set(pagesToRemove)].sort((a,b) => b - a);
                
                for(let pNum of uniquePages) {
                    pdfDoc.removePage(pNum - 1); // 0-indexed
                }
                
                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'cleaned_' + currentFile.name; a.click();
            } catch(e) { alert('Error processing document'); }
            btn.disabled = false;
        });
    }
});
