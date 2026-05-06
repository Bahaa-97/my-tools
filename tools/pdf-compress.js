window.ToolApp.register('pdf-compress', {
    meta_desc: { ar: 'ضغط خفيف لملفات PDF وإزالة البيانات غير الضرورية.', en: 'Light compression for PDF files by removing unnecessary data.' },
    keywords: { ar: ['ضغط', 'pdf', 'تقليل'], en: ['compress', 'pdf', 'reduce'] },
    features: { ar: ['معالجة محلية', 'بدون رفع للإنترنت'], en: ['Local processing', 'No upload'] },
    render: function(container, lang) {
        const strings = {
            desc: { ar: 'قم بتقليل حجم ملف PDF قليلاً عن طريق إزالة الهياكل والبيانات الوصفية غير الضرورية.', en: 'Slightly reduce PDF size by stripping unneeded structures and metadata.' },
            sel: { ar: 'اختر ملف PDF', en: 'Select PDF File' },
            compress: { ar: 'ضغط وتحميل', en: 'Compress & Download' },
            loadingLib: { ar: 'جاري التحميل...', en: 'Loading...' },
            processing: { ar: 'جاري الضغط...', en: 'Compressing...' },
            error: { ar: 'حدث خطأ أثناء المعالجة.', en: 'Error during processing.' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${strings.desc[lang]}</p>
                <input type="file" id="c-input" accept="application/pdf" style="display:none;">
                <div id="c-drop" style="border: 2px dashed var(--border-color); padding: 3rem; border-radius: 16px; margin-bottom: 1.5rem; cursor: pointer; transition: all 0.3s; background: var(--surface-color);">
                    <h3 id="c-name">${strings.sel[lang]}</h3>
                </div>
                <button class="primary-btn" id="c-btn" style="display:none; margin:0 auto;">${strings.compress[lang]}</button>
                <p id="c-res" style="margin-top:1rem; font-weight:bold; color:var(--accent-color);"></p>
            </div>
        `;

        let currentFile = null;
        const drop = container.querySelector('#c-drop'), inp = container.querySelector('#c-input'), btn = container.querySelector('#c-btn'), name = container.querySelector('#c-name'), res = container.querySelector('#c-res');

        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => {
            if(e.target.files[0]) {
                currentFile = e.target.files[0];
                name.textContent = currentFile.name + ` (${(currentFile.size / 1024 / 1024).toFixed(2)} MB)`;
                btn.style.display = 'block';
                res.textContent = '';
            }
        });

        btn.addEventListener('click', () => {
            if(!currentFile) return;
            if(!window.PDFLib) {
                name.textContent = strings.loadingLib[lang];
                const s = document.createElement('script');
                s.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
                s.onload = runCompress;
                document.body.appendChild(s);
            } else runCompress();
        });

        async function runCompress() {
            btn.textContent = strings.processing[lang]; btn.disabled = true;
            try {
                const arrayBuffer = await currentFile.arrayBuffer();
                const pdfDoc = await window.PDFLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                
                // Remove basic metadata to save space
                pdfDoc.setTitle(''); pdfDoc.setAuthor(''); pdfDoc.setSubject(''); pdfDoc.setKeywords([]);
                
                // Save without object streams can sometimes increase or decrease size depending on the PDF. 
                // We use useObjectStreams: false which is standard but might not "compress" images. 
                // Client side compression is highly limited.
                const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
                
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'compressed_' + currentFile.name; a.click();
                
                res.textContent = lang === 'ar' ? `الحجم الجديد: ${(blob.size / 1024 / 1024).toFixed(2)} MB` : `New Size: ${(blob.size / 1024 / 1024).toFixed(2)} MB`;
            } catch(e) { alert(strings.error[lang]); }
            btn.textContent = strings.compress[lang]; btn.disabled = false;
        }
    }
});
