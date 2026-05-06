window.ToolApp.register('pdf-rotate', {
    meta_desc: { ar: 'تدوير صفحات PDF وتصحيح اتجاهها.', en: 'Rotate PDF pages and fix orientation.' },
    keywords: { ar: ['تدوير', 'pdf', 'اتجاه', 'rotate'], en: ['rotate', 'pdf', 'orientation'] },
    features: { ar: ['تدوير 90/180/270 درجة', 'تصحيح الاتجاه'], en: ['Rotate 90/180/270 degrees', 'Fix orientation'] },
    render: function(container, lang) {
        const strings = {
            desc: { ar: 'قم بتدوير كل الصفحات بالزاوية التي تناسبك بنقرة واحدة.', en: 'Rotate all pages by your preferred angle in one click.' },
            sel: { ar: 'اختر ملف PDF', en: 'Select PDF File' },
            angle: { ar: 'زاوية التدوير', en: 'Rotation Angle' },
            r90: { ar: '90 درجة لليمين', en: '90 Degrees Right' },
            r180: { ar: '180 درجة (قلب)', en: '180 Degrees (Flip)' },
            r270: { ar: '90 درجة لليسار', en: '90 Degrees Left' },
            run: { ar: 'تدوير وتحميل', en: 'Rotate & Download' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${strings.desc[lang]}</p>
                <input type="file" id="r-input" accept="application/pdf" style="display:none;">
                <div id="r-drop" style="border: 2px dashed var(--border-color); padding: 2rem; border-radius: 16px; margin-bottom: 1rem; cursor: pointer; background: var(--surface-color);">
                    <h3 id="r-name">${strings.sel[lang]}</h3>
                </div>
                <div id="r-opts" style="display:none; flex-direction:column; gap:1rem; margin-bottom:1.5rem;">
                    <label style="font-weight:bold; color:var(--text-secondary);">${strings.angle[lang]}</label>
                    <select id="r-angle" style="padding:0.75rem; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-primary); outline:none;">
                        <option value="90">${strings.r90[lang]}</option>
                        <option value="180">${strings.r180[lang]}</option>
                        <option value="270">${strings.r270[lang]}</option>
                    </select>
                </div>
                <button class="primary-btn" id="r-btn" style="display:none; margin:0 auto;">${strings.run[lang]}</button>
            </div>
        `;

        let currentFile = null;
        const drop = container.querySelector('#r-drop'), inp = container.querySelector('#r-input'), btn = container.querySelector('#r-btn'), name = container.querySelector('#r-name'), opts = container.querySelector('#r-opts'), angleSel = container.querySelector('#r-angle');

        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => {
            if(e.target.files[0]) {
                currentFile = e.target.files[0];
                name.textContent = currentFile.name;
                opts.style.display = 'flex'; btn.style.display = 'block';
            }
        });

        btn.addEventListener('click', () => {
            if(!currentFile) return;
            if(!window.PDFLib) {
                const s = document.createElement('script');
                s.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
                s.onload = runRotate; document.body.appendChild(s);
            } else runRotate();
        });

        async function runRotate() {
            btn.disabled = true;
            try {
                const { PDFDocument, degrees } = window.PDFLib;
                const arrayBuffer = await currentFile.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                const pages = pdfDoc.getPages();
                const angle = parseInt(angleSel.value);
                
                pages.forEach(p => {
                    const currentRotation = p.getRotation().angle;
                    p.setRotation(degrees(currentRotation + angle));
                });
                
                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'rotated_' + currentFile.name; a.click();
            } catch(e) { alert('Error'); }
            btn.disabled = false;
        }
    }
});
