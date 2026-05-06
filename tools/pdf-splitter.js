window.ToolApp.register('pdf-splitter', {
    meta_desc: { ar: 'تقسيم واستخراج صفحات معينة من ملف PDF.', en: 'Split and extract specific pages from a PDF file.' },
    keywords: { ar: ['تقسيم', 'pdf', 'استخراج'], en: ['split', 'extract', 'pdf'] },
    features: { ar: ['استخراج سريع', 'معالجة محلية'], en: ['Fast extraction', 'Local processing'] },
    render: function(container, lang) {
        const strings = {
            desc: { ar: 'اختر ملف PDF وحدد نطاق الصفحات لاستخراجها في ملف جديد.', en: 'Select a PDF and specify a page range to extract.' },
            sel: { ar: 'اختر ملف PDF', en: 'Select PDF File' },
            from: { ar: 'من صفحة', en: 'From Page' },
            to: { ar: 'إلى صفحة', en: 'To Page' },
            split: { ar: 'تقسيم وتحميل', en: 'Split & Download' },
            loadingLib: { ar: 'جاري التحميل...', en: 'Loading...' },
            processing: { ar: 'جاري التقسيم...', en: 'Splitting...' },
            error: { ar: 'حدث خطأ. تأكد من صحة الصفحات.', en: 'Error. Ensure valid pages.' }
        };

        container.innerHTML = `
            <style>
                .wrap { max-width: 600px; margin: 0 auto; text-align: center; }
                .drop { border: 2px dashed var(--border-color); padding: 2rem; border-radius: 16px; margin-bottom: 1.5rem; cursor: pointer; }
                .drop:hover { border-color: var(--accent-color); background: var(--surface-color); }
                #f-input { display: none; }
                .form { display: none; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-bottom: 1.5rem; }
                .form input { padding: 0.5rem; width: 100px; text-align: center; border-radius: 8px; border: 1px solid var(--border-color); }
            </style>
            <div class="wrap">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${strings.desc[lang]}</p>
                <input type="file" id="f-input" accept="application/pdf">
                <div class="drop" id="drop-area"><h3 id="fname">${strings.sel[lang]}</h3></div>
                
                <div class="form" id="options">
                    <div><label>${strings.from[lang]}</label><br><input type="number" id="p-from" min="1" value="1"></div>
                    <div><label>${strings.to[lang]}</label><br><input type="number" id="p-to" min="1" value="1"></div>
                </div>
                <button class="primary-btn" id="btn-run" style="display:none; margin:0 auto;">${strings.split[lang]}</button>
            </div>
        `;

        let currentFile = null, pdfDoc = null, pageCount = 0;
        const drop = container.querySelector('#drop-area'), inp = container.querySelector('#f-input'), form = container.querySelector('#options'), btn = container.querySelector('#btn-run'), fname = container.querySelector('#fname'), pFrom = container.querySelector('#p-from'), pTo = container.querySelector('#p-to');

        const loadPDFLib = (cb) => {
            if(window.PDFLib) return cb();
            fname.textContent = strings.loadingLib[lang];
            const s = document.createElement('script');
            s.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
            s.onload = cb;
            s.onerror = () => { alert('Network Error'); fname.textContent = strings.sel[lang]; };
            document.body.appendChild(s);
        };

        const handleFile = (f) => {
            if(f.type !== 'application/pdf') return;
            currentFile = f;
            fname.textContent = f.name;
            loadPDFLib(async () => {
                fname.textContent = strings.processing[lang];
                try {
                    const arrayBuffer = await f.arrayBuffer();
                    pdfDoc = await window.PDFLib.PDFDocument.load(arrayBuffer);
                    pageCount = pdfDoc.getPageCount();
                    pTo.value = pageCount;
                    pTo.max = pageCount; pFrom.max = pageCount;
                    form.style.display = 'flex'; btn.style.display = 'block';
                    fname.textContent = f.name + ` (${pageCount} Pages)`;
                } catch(e) { alert(strings.error[lang]); form.style.display = 'none'; btn.style.display = 'none'; }
            });
        };

        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => { if(e.target.files[0]) handleFile(e.target.files[0]); });

        btn.addEventListener('click', async () => {
            if(!pdfDoc) return;
            let start = parseInt(pFrom.value) - 1;
            let end = parseInt(pTo.value) - 1;
            if(start < 0 || end >= pageCount || start > end) return alert(strings.error[lang]);
            
            btn.textContent = strings.processing[lang]; btn.disabled = true;
            try {
                const newPdf = await window.PDFLib.PDFDocument.create();
                const indices = []; for(let i = start; i <= end; i++) indices.push(i);
                const copied = await newPdf.copyPages(pdfDoc, indices);
                copied.forEach(p => newPdf.addPage(p));
                const pdfBytes = await newPdf.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'split_' + currentFile.name; a.click();
            } catch(e) { alert(strings.error[lang]); }
            btn.textContent = strings.split[lang]; btn.disabled = false;
        });
    }
});
