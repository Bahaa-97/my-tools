window.ToolApp.register('pdf-merger', {
    meta_desc: {
        ar: 'أداة سريعة لدمج ملفات PDF المتعددة في ملف واحد داخل المتصفح بأمان وبدون رفع ملفاتك لأي خادم.',
        en: 'Fast tool to merge multiple PDF files into one securely in your browser without uploading.'
    },
    keywords: {
        ar: ['دمج', 'ملفات', 'pdf', 'بدون نت', 'أمان'],
        en: ['merge', 'files', 'pdf', 'offline', 'secure']
    },
    features: {
        ar: ['يعمل بدون إنترنت بعد التحميل', 'لا يتم رفع الملفات', 'سريع جداً'],
        en: ['Works offline after load', 'No file uploads', 'Very fast']
    },
    render: function(container, lang) {
        const strings = {
            title: { ar: 'دمج ملفات PDF', en: 'Merge PDFs' },
            desc: { ar: 'قم بتحديد ملفات PDF لدمجها معاً في ملف واحد.', en: 'Select PDF files to merge into a single file.' },
            sel: { ar: 'اختر الملفات', en: 'Select Files' },
            merge: { ar: 'دمج وتحميل', en: 'Merge & Download' },
            clear: { ar: 'مسح الكل', en: 'Clear All' },
            noFiles: { ar: 'لم يتم اختيار ملفات.', en: 'No files selected.' },
            loadingLib: { ar: 'جاري تحميل المكتبة...', en: 'Loading library...' },
            processing: { ar: 'جاري الدمج...', en: 'Merging...' },
            error: { ar: 'حدث خطأ أثناء الدمج.', en: 'Error during merge.' }
        };

        container.innerHTML = `
            <style>
                .pdf-wrap { max-width: 600px; margin: 0 auto; text-align: center; }
                .pdf-drop { border: 2px dashed var(--border-color); padding: 3rem 2rem; border-radius: 16px; margin-bottom: 1.5rem; transition: all 0.3s; cursor: pointer; background: var(--bg-color); }
                .pdf-drop:hover { border-color: var(--accent-color); background: var(--surface-color); }
                .pdf-list { text-align: start; margin-bottom: 1.5rem; max-height: 250px; overflow-y: auto; }
                .pdf-item { background: var(--surface-color); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; }
                .pdf-item button { color: #ef4444; border: none; background: transparent; cursor: pointer; padding: 0.2rem; }
                .pdf-actions { display: flex; gap: 1rem; justify-content: center; }
                #pdf-file-input { display: none; }
            </style>
            
            <div class="pdf-wrap">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${strings.desc[lang]}</p>
                
                <input type="file" id="pdf-file-input" multiple accept="application/pdf">
                <div class="pdf-drop" id="pdf-drop">
                    <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--accent-color)" stroke-width="1.5" fill="none" style="margin-bottom:1rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    <h3>${strings.sel[lang]}</h3>
                    <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.5rem;">(Drag & Drop)</p>
                </div>
                
                <div class="pdf-list" id="pdf-list"></div>
                
                <div class="pdf-actions">
                    <button class="primary-btn" id="btn-merge" disabled>${strings.merge[lang]}</button>
                    <button class="primary-btn" id="btn-clear" style="background:transparent; border:1px solid var(--border-color); color:var(--text-primary);">${strings.clear[lang]}</button>
                </div>
            </div>
        `;

        let files = [];
        const drop = container.querySelector('#pdf-drop');
        const input = container.querySelector('#pdf-file-input');
        const list = container.querySelector('#pdf-list');
        const btnMerge = container.querySelector('#btn-merge');
        const btnClear = container.querySelector('#btn-clear');

        const updateList = () => {
            list.innerHTML = '';
            if(files.length === 0) {
                list.innerHTML = `<div style="text-align:center; color:var(--text-secondary); font-size:0.9rem;">${strings.noFiles[lang]}</div>`;
                btnMerge.disabled = true;
                return;
            }
            files.forEach((f, i) => {
                const item = document.createElement('div');
                item.className = 'pdf-item';
                item.innerHTML = `
                    <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:85%;">${i+1}. ${f.name}</span>
                    <button data-idx="${i}" aria-label="Remove"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                `;
                item.querySelector('button').addEventListener('click', (e) => {
                    files.splice(parseInt(e.currentTarget.getAttribute('data-idx')), 1);
                    updateList();
                });
                list.appendChild(item);
            });
            btnMerge.disabled = files.length < 2; // need at least 2 to merge
        };

        const handleFiles = (newFiles) => {
            for(let f of newFiles) {
                if(f.type === 'application/pdf') files.push(f);
            }
            updateList();
        };

        drop.addEventListener('click', () => input.click());
        drop.addEventListener('dragover', e => { e.preventDefault(); drop.style.borderColor = 'var(--accent-color)'; });
        drop.addEventListener('dragleave', e => { e.preventDefault(); drop.style.borderColor = 'var(--border-color)'; });
        drop.addEventListener('drop', e => {
            e.preventDefault();
            drop.style.borderColor = 'var(--border-color)';
            if(e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        });
        input.addEventListener('change', e => {
            if(e.target.files) handleFiles(e.target.files);
            input.value = '';
        });

        btnClear.addEventListener('click', () => { files = []; updateList(); });

        const loadPDFLib = (cb) => {
            if(window.PDFLib) return cb();
            btnMerge.textContent = strings.loadingLib[lang];
            const s = document.createElement('script');
            s.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
            s.onload = cb;
            s.onerror = () => { alert('Network Error'); btnMerge.textContent = strings.merge[lang]; };
            document.body.appendChild(s);
        };

        btnMerge.addEventListener('click', () => {
            if(files.length < 2) return;
            loadPDFLib(async () => {
                btnMerge.textContent = strings.processing[lang];
                btnMerge.disabled = true;
                try {
                    const { PDFDocument } = window.PDFLib;
                    const mergedPdf = await PDFDocument.create();
                    
                    for(let f of files) {
                        const arrayBuffer = await f.arrayBuffer();
                        const pdfDoc = await PDFDocument.load(arrayBuffer);
                        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                        copiedPages.forEach(page => mergedPdf.addPage(page));
                    }
                    
                    const pdfBytes = await mergedPdf.save();
                    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'merged_document.pdf';
                    a.click();
                    
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                } catch(e) {
                    console.error(e);
                    alert(strings.error[lang]);
                }
                btnMerge.textContent = strings.merge[lang];
                btnMerge.disabled = false;
            });
        });

        updateList();
    }
});
