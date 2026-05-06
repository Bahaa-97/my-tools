window.ToolApp.register('pdf-metadata', {
    meta_desc: {
        ar: 'محرر بيانات وصفية لملفات PDF. قم بتعديل العنوان، المؤلف، الكلمات المفتاحية دون الحاجة لبرامج.',
        en: 'PDF Metadata Editor. Edit Title, Author, Keywords without any software.'
    },
    keywords: {
        ar: ['تعديل', 'بيانات', 'pdf', 'metadata', 'مؤلف'],
        en: ['edit', 'metadata', 'pdf', 'author', 'title']
    },
    features: {
        ar: ['تعديل العنوان والمؤلف', 'واجهة بسيطة', 'معالجة محلية بالكامل'],
        en: ['Edit Title and Author', 'Simple interface', 'Fully local processing']
    },
    render: function(container, lang) {
        const strings = {
            desc: { ar: 'اختر ملف PDF لعرض وتعديل بياناته الوصفية.', en: 'Select a PDF file to view and edit its metadata.' },
            sel: { ar: 'اختر ملف PDF', en: 'Select PDF File' },
            save: { ar: 'حفظ وتحميل', en: 'Save & Download' },
            loadingLib: { ar: 'جاري التحميل...', en: 'Loading...' },
            processing: { ar: 'جاري المعالجة...', en: 'Processing...' },
            error: { ar: 'حدث خطأ. تأكد أن الملف ليس محمياً بكلمة مرور.', en: 'Error. Ensure the file is not password protected.' },
            meta: {
                title: { ar: 'العنوان (Title)', en: 'Title' },
                author: { ar: 'المؤلف (Author)', en: 'Author' },
                subject: { ar: 'الموضوع (Subject)', en: 'Subject' },
                keywords: { ar: 'الكلمات المفتاحية (Keywords)', en: 'Keywords' },
                creator: { ar: 'المنشئ (Creator)', en: 'Creator' }
            }
        };

        container.innerHTML = `
            <style>
                .pdf-wrap { max-width: 600px; margin: 0 auto; text-align: center; }
                .pdf-drop { border: 2px dashed var(--border-color); padding: 2rem; border-radius: 16px; margin-bottom: 1.5rem; transition: all 0.3s; cursor: pointer; background: var(--bg-color); }
                .pdf-drop:hover { border-color: var(--accent-color); background: var(--surface-color); }
                #pdf-file-input { display: none; }
                .meta-form { text-align: start; display: none; flex-direction: column; gap: 1rem; background: var(--surface-color); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border-color); margin-bottom: 1.5rem; }
                .meta-field { display: flex; flex-direction: column; gap: 0.5rem; }
                .meta-field label { font-size: 0.9rem; font-weight: 600; color: var(--text-secondary); }
                .meta-input { padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; }
            </style>
            
            <div class="pdf-wrap">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${strings.desc[lang]}</p>
                
                <input type="file" id="pdf-file-input" accept="application/pdf">
                <div class="pdf-drop" id="pdf-drop">
                    <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--accent-color)" stroke-width="1.5" fill="none" style="margin-bottom:1rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
                    <h3 id="file-name-disp">${strings.sel[lang]}</h3>
                </div>
                
                <div class="meta-form" id="meta-form">
                    <div class="meta-field">
                        <label>${strings.meta.title[lang]}</label>
                        <input type="text" id="m-title" class="meta-input">
                    </div>
                    <div class="meta-field">
                        <label>${strings.meta.author[lang]}</label>
                        <input type="text" id="m-author" class="meta-input">
                    </div>
                    <div class="meta-field">
                        <label>${strings.meta.subject[lang]}</label>
                        <input type="text" id="m-subject" class="meta-input">
                    </div>
                    <div class="meta-field">
                        <label>${strings.meta.keywords[lang]}</label>
                        <input type="text" id="m-keywords" class="meta-input">
                    </div>
                    <div class="meta-field">
                        <label>${strings.meta.creator[lang]}</label>
                        <input type="text" id="m-creator" class="meta-input">
                    </div>
                </div>
                
                <button class="primary-btn" id="btn-save" style="display:none; margin: 0 auto;">${strings.save[lang]}</button>
            </div>
        `;

        let currentFile = null;
        let pdfDoc = null;
        
        const drop = container.querySelector('#pdf-drop');
        const input = container.querySelector('#pdf-file-input');
        const form = container.querySelector('#meta-form');
        const btnSave = container.querySelector('#btn-save');
        const fileDisp = container.querySelector('#file-name-disp');
        
        const iTitle = container.querySelector('#m-title');
        const iAuthor = container.querySelector('#m-author');
        const iSubject = container.querySelector('#m-subject');
        const iKeywords = container.querySelector('#m-keywords');
        const iCreator = container.querySelector('#m-creator');

        const loadPDFLib = (cb) => {
            if(window.PDFLib) return cb();
            fileDisp.textContent = strings.loadingLib[lang];
            const s = document.createElement('script');
            s.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
            s.onload = cb;
            s.onerror = () => { alert('Network Error'); fileDisp.textContent = strings.sel[lang]; };
            document.body.appendChild(s);
        };

        const handleFile = (file) => {
            if(file.type !== 'application/pdf') return;
            currentFile = file;
            fileDisp.textContent = file.name;
            
            loadPDFLib(async () => {
                fileDisp.textContent = strings.processing[lang];
                try {
                    const { PDFDocument } = window.PDFLib;
                    const arrayBuffer = await file.arrayBuffer();
                    pdfDoc = await PDFDocument.load(arrayBuffer);
                    
                    iTitle.value = pdfDoc.getTitle() || '';
                    iAuthor.value = pdfDoc.getAuthor() || '';
                    iSubject.value = pdfDoc.getSubject() || '';
                    iKeywords.value = pdfDoc.getKeywords() || '';
                    iCreator.value = pdfDoc.getCreator() || '';
                    
                    form.style.display = 'flex';
                    btnSave.style.display = 'inline-block';
                    fileDisp.textContent = file.name;
                } catch(e) {
                    console.error(e);
                    alert(strings.error[lang]);
                    fileDisp.textContent = strings.sel[lang];
                    form.style.display = 'none';
                    btnSave.style.display = 'none';
                    pdfDoc = null;
                }
            });
        };

        drop.addEventListener('click', () => input.click());
        drop.addEventListener('dragover', e => { e.preventDefault(); drop.style.borderColor = 'var(--accent-color)'; });
        drop.addEventListener('dragleave', e => { e.preventDefault(); drop.style.borderColor = 'var(--border-color)'; });
        drop.addEventListener('drop', e => {
            e.preventDefault();
            drop.style.borderColor = 'var(--border-color)';
            if(e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        });
        input.addEventListener('change', e => {
            if(e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
            input.value = '';
        });

        btnSave.addEventListener('click', async () => {
            if(!pdfDoc) return;
            btnSave.textContent = strings.processing[lang];
            btnSave.disabled = true;
            try {
                if(iTitle.value) pdfDoc.setTitle(iTitle.value);
                if(iAuthor.value) pdfDoc.setAuthor(iAuthor.value);
                if(iSubject.value) pdfDoc.setSubject(iSubject.value);
                if(iKeywords.value) pdfDoc.setKeywords([iKeywords.value]);
                if(iCreator.value) pdfDoc.setCreator(iCreator.value);
                
                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = currentFile.name.replace('.pdf', '_meta.pdf');
                a.click();
                
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            } catch(e) {
                console.error(e);
                alert(strings.error[lang]);
            }
            btnSave.textContent = strings.save[lang];
            btnSave.disabled = false;
        });
    }
});
