window.ToolApp.register('image-to-pdf', {
    meta_desc: {
        ar: 'تحويل الصور إلى ملف PDF واحد بسهولة مع الحفاظ على الجودة داخل المتصفح.',
        en: 'Convert images to a single PDF file easily while preserving quality in browser.'
    },
    keywords: {
        ar: ['صور', 'إلى', 'pdf', 'تحويل', 'بدون نت'],
        en: ['image', 'to', 'pdf', 'convert', 'offline']
    },
    features: {
        ar: ['دعم صيغ متعددة (JPG, PNG)', 'يعمل بالكامل بدون خوادم'],
        en: ['Supports JPG & PNG', 'Runs entirely serverless']
    },
    render: function(container, lang) {
        const strings = {
            desc: { ar: 'قم باختيار الصور لتحويلها إلى ملف PDF واحد.', en: 'Select images to convert into a single PDF.' },
            sel: { ar: 'اختر الصور', en: 'Select Images' },
            convert: { ar: 'تحويل إلى PDF', en: 'Convert to PDF' },
            clear: { ar: 'مسح الكل', en: 'Clear All' },
            noFiles: { ar: 'لم يتم اختيار صور.', en: 'No images selected.' },
            loadingLib: { ar: 'جاري تحميل المكتبة...', en: 'Loading library...' },
            processing: { ar: 'جاري التحويل...', en: 'Converting...' },
            error: { ar: 'حدث خطأ أثناء التحويل.', en: 'Error during conversion.' }
        };

        container.innerHTML = `
            <style>
                .pdf-wrap { max-width: 600px; margin: 0 auto; text-align: center; }
                .pdf-drop { border: 2px dashed var(--border-color); padding: 3rem 2rem; border-radius: 16px; margin-bottom: 1.5rem; transition: all 0.3s; cursor: pointer; background: var(--bg-color); }
                .pdf-drop:hover { border-color: var(--accent-color); background: var(--surface-color); }
                .img-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; max-height: 300px; overflow-y: auto; padding: 0.5rem; }
                .img-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); }
                .img-item img { width: 100%; height: 100%; object-fit: cover; }
                .img-item button { position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .img-item button:hover { background: #ef4444; }
                .pdf-actions { display: flex; gap: 1rem; justify-content: center; }
                #img-file-input { display: none; }
            </style>
            
            <div class="pdf-wrap">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${strings.desc[lang]}</p>
                
                <input type="file" id="img-file-input" multiple accept="image/png, image/jpeg, image/jpg">
                <div class="pdf-drop" id="pdf-drop">
                    <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--accent-color)" stroke-width="1.5" fill="none" style="margin-bottom:1rem;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    <h3>${strings.sel[lang]}</h3>
                    <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.5rem;">(JPG, PNG)</p>
                </div>
                
                <div class="img-grid" id="img-grid"></div>
                
                <div class="pdf-actions">
                    <button class="primary-btn" id="btn-convert" disabled>${strings.convert[lang]}</button>
                    <button class="primary-btn" id="btn-clear" style="background:transparent; border:1px solid var(--border-color); color:var(--text-primary);">${strings.clear[lang]}</button>
                </div>
            </div>
        `;

        let files = [];
        const drop = container.querySelector('#pdf-drop');
        const input = container.querySelector('#img-file-input');
        const grid = container.querySelector('#img-grid');
        const btnConvert = container.querySelector('#btn-convert');
        const btnClear = container.querySelector('#btn-clear');

        const updateGrid = () => {
            grid.innerHTML = '';
            if(files.length === 0) {
                grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--text-secondary); font-size:0.9rem;">${strings.noFiles[lang]}</div>`;
                btnConvert.disabled = true;
                return;
            }
            files.forEach((f, i) => {
                const item = document.createElement('div');
                item.className = 'img-item';
                const url = URL.createObjectURL(f);
                item.innerHTML = `
                    <img src="${url}" alt="img">
                    <button data-idx="${i}" aria-label="Remove"><svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                `;
                item.querySelector('button').addEventListener('click', (e) => {
                    files.splice(parseInt(e.currentTarget.getAttribute('data-idx')), 1);
                    updateGrid();
                });
                grid.appendChild(item);
            });
            btnConvert.disabled = files.length === 0;
        };

        const handleFiles = (newFiles) => {
            for(let f of newFiles) {
                if(f.type.startsWith('image/')) files.push(f);
            }
            updateGrid();
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

        btnClear.addEventListener('click', () => { files = []; updateGrid(); });

        const loadPDFLib = (cb) => {
            if(window.PDFLib) return cb();
            btnConvert.textContent = strings.loadingLib[lang];
            const s = document.createElement('script');
            s.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
            s.onload = cb;
            s.onerror = () => { alert('Network Error'); btnConvert.textContent = strings.convert[lang]; };
            document.body.appendChild(s);
        };

        btnConvert.addEventListener('click', () => {
            if(files.length === 0) return;
            loadPDFLib(async () => {
                btnConvert.textContent = strings.processing[lang];
                btnConvert.disabled = true;
                try {
                    const { PDFDocument } = window.PDFLib;
                    const pdfDoc = await PDFDocument.create();
                    
                    for(let f of files) {
                        const imgBytes = await f.arrayBuffer();
                        let pdfImage;
                        if(f.type === 'image/png') {
                            pdfImage = await pdfDoc.embedPng(imgBytes);
                        } else {
                            pdfImage = await pdfDoc.embedJpg(imgBytes);
                        }
                        
                        const { width, height } = pdfImage.scale(1);
                        const page = pdfDoc.addPage([width, height]);
                        page.drawImage(pdfImage, { x: 0, y: 0, width, height });
                    }
                    
                    const pdfBytes = await pdfDoc.save();
                    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'images_converted.pdf';
                    a.click();
                    
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                } catch(e) {
                    console.error(e);
                    alert(strings.error[lang]);
                }
                btnConvert.textContent = strings.convert[lang];
                btnConvert.disabled = false;
            });
        });

        updateGrid();
    }
});
