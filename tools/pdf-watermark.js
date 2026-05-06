window.ToolApp.register('pdf-watermark', {
    meta_desc: { ar: 'إضافة نص كعلامة مائية على جميع صفحات PDF.', en: 'Add text as watermark on all PDF pages.' },
    keywords: { ar: ['علامة', 'مائية', 'pdf', 'حقوق'], en: ['watermark', 'pdf', 'rights'] },
    features: { ar: ['تخصيص كامل', 'حفظ الحقوق'], en: ['Full customization', 'Protect rights'] },
    render: function(container, lang) {
        const strings = {
            desc: { ar: 'أضف علامة مائية نصية شفافة لحماية مستنداتك.', en: 'Add a transparent text watermark to protect documents.' },
            sel: { ar: 'اختر ملف PDF', en: 'Select PDF File' },
            text: { ar: 'نص العلامة المائية', en: 'Watermark Text' },
            run: { ar: 'إضافة وتحميل', en: 'Add & Download' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${strings.desc[lang]}</p>
                <input type="file" id="w-input" accept="application/pdf" style="display:none;">
                <div id="w-drop" style="border: 2px dashed var(--border-color); padding: 2rem; border-radius: 16px; margin-bottom: 1rem; cursor: pointer; background: var(--surface-color);">
                    <h3 id="w-name">${strings.sel[lang]}</h3>
                </div>
                <div id="w-opts" style="display:none; flex-direction:column; gap:1rem; margin-bottom:1.5rem;">
                    <input type="text" id="w-text" placeholder="${strings.text[lang]}" style="padding:0.75rem; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-primary); outline:none;">
                </div>
                <button class="primary-btn" id="w-btn" style="display:none; margin:0 auto;">${strings.run[lang]}</button>
            </div>
        `;

        let currentFile = null;
        const drop = container.querySelector('#w-drop'), inp = container.querySelector('#w-input'), btn = container.querySelector('#w-btn'), name = container.querySelector('#w-name'), opts = container.querySelector('#w-opts'), wText = container.querySelector('#w-text');

        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => {
            if(e.target.files[0]) {
                currentFile = e.target.files[0];
                name.textContent = currentFile.name;
                opts.style.display = 'flex'; btn.style.display = 'block';
            }
        });

        btn.addEventListener('click', () => {
            if(!currentFile || !wText.value.trim()) return;
            if(!window.PDFLib) {
                const s = document.createElement('script');
                s.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
                s.onload = runWatermark; document.body.appendChild(s);
            } else runWatermark();
        });

        async function runWatermark() {
            btn.disabled = true;
            try {
                const { PDFDocument, rgb, degrees } = window.PDFLib;
                const arrayBuffer = await currentFile.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                const pages = pdfDoc.getPages();
                const text = wText.value.trim();
                
                pages.forEach(p => {
                    const { width, height } = p.getSize();
                    p.drawText(text, {
                        x: width / 4,
                        y: height / 4,
                        size: 50,
                        color: rgb(0.5, 0.5, 0.5),
                        opacity: 0.3,
                        rotate: degrees(45)
                    });
                });
                
                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'watermarked_' + currentFile.name; a.click();
            } catch(e) { alert('Error'); }
            btn.disabled = false;
        }
    }
});
