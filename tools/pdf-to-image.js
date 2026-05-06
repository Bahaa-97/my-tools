window.ToolApp.register('pdf-to-image', {
    meta_desc: { ar: 'تحويل صفحات PDF إلى صور PNG عالية الدقة.', en: 'Convert PDF pages to high resolution PNG images.' },
    keywords: { ar: ['pdf', 'صور', 'png', 'تحويل'], en: ['pdf', 'images', 'png', 'convert'] },
    features: { ar: ['جودة عالية', 'عرض ومعاينة', 'لا يحتاج إنترنت للعمل'], en: ['High quality', 'Preview', 'Works offline'] },
    render: function(container, lang) {
        container.innerHTML = `
            <div style="max-width:800px; margin:0 auto; text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${lang === 'ar' ? 'اختر ملف PDF لعرض صفحاته كصور وتحميلها.' : 'Select a PDF to view its pages as images and download.'}</p>
                <input type="file" id="i-input" accept="application/pdf" style="display:none;">
                <div id="i-drop" style="border: 2px dashed var(--border-color); padding: 2rem; border-radius: 16px; margin-bottom: 1rem; cursor: pointer; background: var(--surface-color);">
                    <h3 id="i-name">${lang === 'ar' ? 'اختر ملف PDF' : 'Select PDF'}</h3>
                </div>
                <div id="i-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:1rem; margin-top:1.5rem;"></div>
            </div>
        `;

        const drop = container.querySelector('#i-drop'), inp = container.querySelector('#i-input'), name = container.querySelector('#i-name'), grid = container.querySelector('#i-grid');

        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => {
            if(e.target.files[0]) processPDF(e.target.files[0]);
        });

        const loadPdfJs = (cb) => {
            if(window.pdfjsLib) return cb();
            name.textContent = lang === 'ar' ? 'جاري تحميل المكتبة...' : 'Loading library...';
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
            s.onload = () => {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                cb();
            };
            document.body.appendChild(s);
        };

        const processPDF = (file) => {
            name.textContent = file.name;
            grid.innerHTML = lang === 'ar' ? 'جاري المعالجة...' : 'Processing...';
            loadPdfJs(async () => {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                    grid.innerHTML = '';
                    
                    for(let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const viewport = page.getViewport({ scale: 1.5 });
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = viewport.width; canvas.height = viewport.height;
                        
                        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                        
                        const wrap = document.createElement('div');
                        wrap.style.cssText = 'border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; background: white; padding: 0.5rem;';
                        
                        const img = document.createElement('img');
                        img.src = canvas.toDataURL('image/png');
                        img.style.cssText = 'width: 100%; height: auto; border: 1px solid #eee; margin-bottom: 0.5rem;';
                        
                        const btn = document.createElement('button');
                        btn.className = 'primary-btn';
                        btn.style.cssText = 'width: 100%; padding: 0.5rem; font-size: 0.9rem;';
                        btn.textContent = lang === 'ar' ? `تحميل ص ${i}` : `Download P${i}`;
                        btn.onclick = () => {
                            const a = document.createElement('a');
                            a.href = img.src; a.download = `page_${i}.png`; a.click();
                        };
                        
                        wrap.appendChild(img); wrap.appendChild(btn);
                        grid.appendChild(wrap);
                    }
                } catch(e) { grid.innerHTML = 'Error loading PDF'; }
            });
        };
    }
});
