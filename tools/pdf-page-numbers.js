window.ToolApp.register('pdf-page-numbers', {
    meta_desc: { ar: 'إضافة أرقام الصفحات تلقائياً لملفات PDF.', en: 'Automatically add page numbers to PDF files.' },
    keywords: { ar: ['ترقيم', 'صفحات', 'pdf', 'أرقام'], en: ['page numbers', 'pdf', 'pagination'] },
    features: { ar: ['ترقيم آلي', 'محاذاة في المنتصف أسفل الصفحة'], en: ['Auto numbering', 'Bottom-center alignment'] },
    render: function(container, lang) {
        const strings = {
            desc: { ar: 'أضف أرقاماً متسلسلة في أسفل منتصف كل صفحة في المستند بضغطة زر.', en: 'Add sequential numbers at the bottom center of each page with one click.' },
            sel: { ar: 'اختر ملف PDF', en: 'Select PDF File' },
            run: { ar: 'ترقيم وتحميل', en: 'Number & Download' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${strings.desc[lang]}</p>
                <input type="file" id="n-input" accept="application/pdf" style="display:none;">
                <div id="n-drop" style="border: 2px dashed var(--border-color); padding: 3rem; border-radius: 16px; margin-bottom: 1rem; cursor: pointer; background: var(--surface-color);">
                    <h3 id="n-name">${strings.sel[lang]}</h3>
                </div>
                <button class="primary-btn" id="n-btn" style="display:none; margin:0 auto;">${strings.run[lang]}</button>
            </div>
        `;

        let currentFile = null;
        const drop = container.querySelector('#n-drop'), inp = container.querySelector('#n-input'), btn = container.querySelector('#n-btn'), name = container.querySelector('#n-name');

        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => {
            if(e.target.files[0]) {
                currentFile = e.target.files[0];
                name.textContent = currentFile.name;
                btn.style.display = 'block';
            }
        });

        btn.addEventListener('click', () => {
            if(!currentFile) return;
            if(!window.PDFLib) {
                const s = document.createElement('script');
                s.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
                s.onload = runNumbering; document.body.appendChild(s);
            } else runNumbering();
        });

        async function runNumbering() {
            btn.disabled = true;
            try {
                const { PDFDocument, rgb } = window.PDFLib;
                const arrayBuffer = await currentFile.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                const pages = pdfDoc.getPages();
                
                pages.forEach((p, index) => {
                    const { width } = p.getSize();
                    const text = String(index + 1);
                    p.drawText(text, {
                        x: width / 2 - 5,
                        y: 20, // 20 units from bottom
                        size: 12,
                        color: rgb(0, 0, 0)
                    });
                });
                
                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'numbered_' + currentFile.name; a.click();
            } catch(e) { alert('Error'); }
            btn.disabled = false;
        }
    }
});
