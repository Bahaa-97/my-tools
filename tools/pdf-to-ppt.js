window.ToolApp.register('pdf-to-ppt', {
    meta_desc: { 
        ar: 'تحويل ملفات PDF إلى PowerPoint (PPTX) محلياً داخل المتصفح، حيث تصبح صفحات الـ PDF شرائح.', 
        en: 'Convert PDF files to PowerPoint (PPTX) locally in browser, turning PDF pages into slides.' 
    },
    keywords: { ar: ['pdf', 'ppt', 'pptx', 'تحويل', 'باوربوينت'], en: ['pdf', 'ppt', 'pptx', 'convert', 'powerpoint'] },
    features: { ar: ['تحويل دقيق ومطابق للأصل (كصور)'], en: ['Accurate conversion (as images)'] },
    render: function(container, lang) {
        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">
                    ${lang === 'ar' ? 'قم بتحويل ملف PDF الخاص بك إلى عرض تقديمي (PowerPoint). سيتم تحويل كل صفحة إلى صورة مطابقة ووضعها في شريحة مستقلة حفاظاً على التنسيق.' : 'Convert your PDF into a PowerPoint presentation. Each page will be converted to an exact image and placed on a separate slide to preserve formatting.'}
                </p>
                <input type="file" id="ppt-input" accept="application/pdf" style="display:none;">
                <div id="ppt-drop" style="border: 2px dashed var(--border-color); padding: 3rem; border-radius: 16px; cursor: pointer; background: var(--surface-color);">
                    <h3 id="ppt-name">${lang === 'ar' ? 'اختر ملف PDF' : 'Select PDF File'}</h3>
                </div>
                <div id="ppt-progress" style="margin-top: 1rem; color: var(--text-secondary); display:none;"></div>
            </div>
        `;

        const drop = container.querySelector('#ppt-drop');
        const inp = container.querySelector('#ppt-input');
        const name = container.querySelector('#ppt-name');
        const progress = container.querySelector('#ppt-progress');

        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => { 
            if(e.target.files[0]) processPDF(e.target.files[0]); 
        });

        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = src;
                s.onload = resolve;
                s.onerror = reject;
                document.body.appendChild(s);
            });
        };

        const processPDF = async (file) => {
            name.textContent = lang === 'ar' ? 'جاري تجهيز الأدوات...' : 'Preparing tools...';
            progress.style.display = 'block';
            progress.textContent = '';
            
            try {
                // Load PDF.js if not loaded
                if(!window.pdfjsLib) {
                    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js');
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                }
                
                // Load JSZip (required by pptxgenjs)
                if(!window.JSZip) {
                    await loadScript('https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@3.12.0/libs/jszip.min.js');
                }
                
                // Load PptxGenJS
                if(!window.PptxGenJS) {
                    await loadScript('https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@3.12.0/dist/pptxgen.min.js');
                }

                await convertToPptx(file);
            } catch (err) {
                console.error(err);
                name.textContent = lang === 'ar' ? 'حدث خطأ في التحميل' : 'Loading Error';
                progress.style.display = 'none';
            }
        };

        async function convertToPptx(file) {
            name.textContent = lang === 'ar' ? 'جاري التحويل...' : 'Converting...';
            
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                
                let pres = new window.PptxGenJS();
                
                for(let i = 1; i <= pdf.numPages; i++) {
                    progress.textContent = lang === 'ar' ? \`معالجة صفحة \${i} من \${pdf.numPages}\` : \`Processing page \${i} of \${pdf.numPages}\`;
                    
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2.0 }); // High resolution scale
                    
                    // Create canvas for rendering
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    
                    await page.render({ canvasContext: context, viewport: viewport }).promise;
                    
                    const imgData = canvas.toDataURL('image/jpeg', 0.9);
                    
                    // Set custom slide layout based on PDF page aspect ratio (1 point = 1/72 inch)
                    const widthInches = viewport.width / 72 / 2; // dividing by scale
                    const heightInches = viewport.height / 72 / 2;
                    
                    // define layout on the first page
                    if(i === 1) {
                        pres.defineLayout({ name: 'CUSTOM_LAYOUT', width: widthInches, height: heightInches });
                        pres.layout = 'CUSTOM_LAYOUT';
                    }

                    let slide = pres.addSlide();
                    slide.addImage({ data: imgData, x: 0, y: 0, w: '100%', h: '100%' });
                }
                
                progress.textContent = lang === 'ar' ? 'جاري حفظ الملف...' : 'Saving file...';
                
                const outputFileName = file.name.replace('.pdf', '.pptx');
                await pres.writeFile({ fileName: outputFileName });
                
                name.textContent = lang === 'ar' ? 'تم التحويل بنجاح! اختر ملفاً آخر' : 'Converted Successfully! Select another';
                progress.style.display = 'none';
                inp.value = ''; // Reset
                
            } catch(e) { 
                console.error(e);
                name.textContent = lang === 'ar' ? 'حدث خطأ أثناء التحويل' : 'Error during conversion'; 
                progress.style.display = 'none';
            }
        }
    }
});
