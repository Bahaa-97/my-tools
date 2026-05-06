window.ToolApp.register('pdf-to-word', {
    meta_desc: { ar: 'تحويل PDF إلى Word مبسط (نصوص) محلياً.', en: 'Convert PDF to simple Word (text) locally.' },
    keywords: { ar: ['pdf', 'word', 'تحويل'], en: ['pdf', 'word', 'convert'] },
    features: { ar: ['استخراج النصوص كـ DOC'], en: ['Extract text as DOC'] },
    render: function(container, lang) {
        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${lang === 'ar' ? 'يقوم هذا الأدوات باستخراج النصوص من ملف PDF وحفظها في ملف Word (.doc).' : 'Extracts text from a PDF and saves it as a Word (.doc) file.'}</p>
                <input type="file" id="pw-input" accept="application/pdf" style="display:none;">
                <div id="pw-drop" style="border: 2px dashed var(--border-color); padding: 3rem; border-radius: 16px; cursor: pointer; background: var(--surface-color);">
                    <h3 id="pw-name">${lang === 'ar' ? 'اختر ملف PDF' : 'Select PDF File'}</h3>
                </div>
            </div>
        `;
        const drop = container.querySelector('#pw-drop'), inp = container.querySelector('#pw-input'), name = container.querySelector('#pw-name');

        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => { if(e.target.files[0]) processPDF(e.target.files[0]); });

        const processPDF = (file) => {
            name.textContent = lang === 'ar' ? 'جاري التحويل...' : 'Converting...';
            if(!window.pdfjsLib) {
                const s = document.createElement('script');
                s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
                s.onload = () => {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                    convert(file);
                };
                document.body.appendChild(s);
            } else convert(file);
        };

        async function convert(file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = '';
                for(let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    fullText += content.items.map(item => item.str).join(' ') + '<br><br>';
                }
                
                const htmlContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>${fullText}</body></html>`;
                const blob = new Blob(['\\ufeff', htmlContent], { type: 'application/msword' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = file.name.replace('.pdf', '.doc'); a.click();
                
                name.textContent = lang === 'ar' ? 'تم التحويل! اختر ملفاً آخر' : 'Converted! Select another';
            } catch(e) { name.textContent = 'Error'; }
        }
    }
});
