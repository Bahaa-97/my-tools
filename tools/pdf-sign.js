window.ToolApp.register('pdf-sign', {
    meta_desc: { ar: 'إضافة توقيعك على ملف PDF محلياً.', en: 'Add your signature to a PDF locally.' },
    keywords: { ar: ['توقيع', 'pdf', 'رسم'], en: ['sign', 'pdf', 'draw'] },
    features: { ar: ['لوحة رسم للتوقيع', 'آمن ومحلي'], en: ['Drawing pad', 'Secure & local'] },
    render: function(container, lang) {
        container.innerHTML = `
            <div style="max-width:600px; margin:0 auto; text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${lang === 'ar' ? 'ارسم توقيعك واختر ملف PDF لإضافته عليه.' : 'Draw your signature and select a PDF to add it.'}</p>
                <div style="background: white; border: 2px solid var(--border-color); border-radius: 12px; margin-bottom: 1rem; width: 100%; height: 200px; overflow: hidden; touch-action: none;">
                    <canvas id="s-canvas" width="600" height="200" style="width:100%; height:100%; cursor:crosshair;"></canvas>
                </div>
                <button class="primary-btn" id="s-clear" style="background:transparent; border:1px solid var(--border-color); color:var(--text-primary); margin-bottom:1.5rem;">${lang === 'ar' ? 'مسح التوقيع' : 'Clear Signature'}</button>
                
                <input type="file" id="s-input" accept="application/pdf" style="display:none;">
                <div id="s-drop" style="border: 2px dashed var(--border-color); padding: 2rem; border-radius: 16px; cursor: pointer; background: var(--surface-color);">
                    <h3 id="s-name">${lang === 'ar' ? 'أضف التوقيع إلى PDF' : 'Add Signature to PDF'}</h3>
                </div>
            </div>
        `;
        
        const canvas = container.querySelector('#s-canvas');
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.strokeStyle = '#000000';
        let painting = false;

        const startPos = e => { painting = true; draw(e); };
        const endPos = () => { painting = false; ctx.beginPath(); };
        const draw = e => {
            if(!painting) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;
            ctx.lineTo(x, y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x, y);
        };

        canvas.addEventListener('mousedown', startPos);
        canvas.addEventListener('mouseup', endPos);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('touchstart', startPos);
        canvas.addEventListener('touchend', endPos);
        canvas.addEventListener('touchmove', draw);

        container.querySelector('#s-clear').addEventListener('click', () => {
            ctx.clearRect(0,0, canvas.width, canvas.height);
        });

        const drop = container.querySelector('#s-drop'), inp = container.querySelector('#s-input');
        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => { if(e.target.files[0]) signPDF(e.target.files[0]); });

        async function signPDF(file) {
            const btnText = drop.querySelector('#s-name');
            btnText.textContent = lang === 'ar' ? 'جاري المعالجة...' : 'Processing...';
            if(!window.PDFLib) {
                const s = document.createElement('script');
                s.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
                s.onload = () => doSign(file, btnText);
                document.body.appendChild(s);
            } else doSign(file, btnText);
        }

        async function doSign(file, btnText) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await window.PDFLib.PDFDocument.load(arrayBuffer);
                
                const sigDataUri = canvas.toDataURL('image/png');
                const sigImage = await pdfDoc.embedPng(sigDataUri);
                
                const pages = pdfDoc.getPages();
                const firstPage = pages[0]; // Stamp on first page bottom
                
                firstPage.drawImage(sigImage, {
                    x: 50, y: 50, width: 150, height: 50
                });
                
                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'signed_' + file.name; a.click();
                
                btnText.textContent = lang === 'ar' ? 'تم! اختر ملفاً آخر' : 'Done! Select another';
            } catch(e) { btnText.textContent = 'Error'; }
        }
    }
});
