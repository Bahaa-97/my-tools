window.ToolApp.register('pdf-text-extract', {
    meta_desc: { ar: 'استخراج النصوص من ملفات PDF لنسخها والتعديل عليها.', en: 'Extract text from PDF files to copy and edit.' },
    keywords: { ar: ['استخراج', 'نص', 'pdf'], en: ['extract', 'text', 'pdf'] },
    features: { ar: ['سريع جداً', 'دعم النصوص البسيطة'], en: ['Very fast', 'Supports plain text'] },
    render: function(container, lang) {
        container.innerHTML = `
            <div style="max-width:800px; margin:0 auto; text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${lang === 'ar' ? 'استخرج النص من أي ملف PDF.' : 'Extract text from any PDF file.'}</p>
                <input type="file" id="t-input" accept="application/pdf" style="display:none;">
                <div id="t-drop" style="border: 2px dashed var(--border-color); padding: 2rem; border-radius: 16px; margin-bottom: 1rem; cursor: pointer; background: var(--surface-color);">
                    <h3 id="t-name">${lang === 'ar' ? 'اختر ملف PDF' : 'Select PDF'}</h3>
                </div>
                <textarea id="t-res" style="width:100%; height:300px; padding:1rem; border-radius:12px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-primary); resize:vertical; display:none;"></textarea>
            </div>
        `;
        const drop = container.querySelector('#t-drop'), inp = container.querySelector('#t-input'), name = container.querySelector('#t-name'), res = container.querySelector('#t-res');

        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => { if(e.target.files[0]) processPDF(e.target.files[0]); });

        const processPDF = (file) => {
            name.textContent = file.name;
            res.style.display = 'block';
            res.value = lang === 'ar' ? 'جاري استخراج النص...' : 'Extracting text...';
            
            if(!window.pdfjsLib) {
                const s = document.createElement('script');
                s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
                s.onload = () => {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                    extract(file);
                };
                document.body.appendChild(s);
            } else extract(file);
        };

        async function extract(file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = '';
                for(let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const strings = content.items.map(item => item.str);
                    fullText += strings.join(' ') + '\\n\\n';
                }
                res.value = fullText;
            } catch(e) { res.value = 'Error extracting text. Ensure it is not a scanned image PDF.'; }
        }
    }
});
