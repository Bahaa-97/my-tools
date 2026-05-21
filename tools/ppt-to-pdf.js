window.ToolApp.register('ppt-to-pdf', {
    meta_desc: { 
        ar: 'تحويل ملفات PowerPoint (PPTX) إلى PDF مبسط (نصوص) داخل المتصفح.', 
        en: 'Convert PowerPoint (PPTX) to simple PDF (text) in browser.' 
    },
    keywords: { ar: ['ppt', 'pptx', 'pdf', 'تحويل', 'باوربوينت'], en: ['ppt', 'pptx', 'pdf', 'convert', 'powerpoint'] },
    features: { ar: ['استخراج سريع للنصوص كـ PDF'], en: ['Fast text extraction as PDF'] },
    render: function(container, lang) {
        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">
                    ${lang === 'ar' ? 'اختر عرضاً تقديمياً (PPTX) لاستخراج النصوص وتحويلها إلى PDF. سيطلب منك المتصفح حفظ النتيجة كملف PDF.' : 'Select a PPTX presentation to extract texts and convert to PDF. Your browser will prompt you to print/save as PDF.'}
                </p>
                <input type="file" id="ptp-input" accept=".pptx" style="display:none;">
                <div id="ptp-drop" style="border: 2px dashed var(--border-color); padding: 3rem; border-radius: 16px; cursor: pointer; background: var(--surface-color);">
                    <h3 id="ptp-name">${lang === 'ar' ? 'اختر ملف PPTX' : 'Select PPTX File'}</h3>
                </div>
                <div id="ptp-content" style="display:none; background:white; color:black; padding:2rem; text-align:left; margin-top:2rem;"></div>
            </div>
            
            <style>
                @media print {
                    body * { visibility: hidden; }
                    #ptp-content, #ptp-content * { visibility: visible; }
                    #ptp-content { position: absolute; left: 0; top: 0; width: 100%; padding: 0; }
                    .ppt-slide-print { page-break-after: always; padding: 2rem; border-bottom: 1px solid #ccc; font-family: sans-serif; }
                }
            </style>
        `;

        const drop = container.querySelector('#ptp-drop');
        const inp = container.querySelector('#ptp-input');
        const name = container.querySelector('#ptp-name');
        const contentDiv = container.querySelector('#ptp-content');

        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => { 
            if(e.target.files[0]) processPPTX(e.target.files[0]); 
        });

        const processPPTX = (file) => {
            name.textContent = lang === 'ar' ? 'جاري القراءة...' : 'Reading...';
            
            if(!window.JSZip) {
                const s = document.createElement('script');
                s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
                s.onload = () => convert(file);
                s.onerror = () => { name.textContent = 'Error loading JSZip'; };
                document.body.appendChild(s);
            } else {
                convert(file);
            }
        };

        async function convert(file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const zip = await JSZip.loadAsync(arrayBuffer);
                
                // Find all slide xml files
                let slideFiles = [];
                zip.folder("ppt/slides/").forEach(function (relativePath, file) {
                    if (relativePath.match(/slide\\d+\\.xml$/)) {
                        slideFiles.push(file);
                    }
                });
                
                // Sort by slide number
                slideFiles.sort((a, b) => {
                    const numA = parseInt(a.name.match(/slide(\\d+)\\.xml/)[1]);
                    const numB = parseInt(b.name.match(/slide(\\d+)\\.xml/)[1]);
                    return numA - numB;
                });
                
                let htmlOutput = '';
                
                for(let i = 0; i < slideFiles.length; i++) {
                    const content = await slideFiles[i].async("string");
                    
                    // Simple regex to extract <a:t>...</a:t> text nodes
                    const textMatches = content.match(/<a:t>.*?<\\/a:t>/g) || [];
                    let slideText = textMatches.map(t => {
                        return t.replace('<a:t>', '').replace('</a:t>', '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
                    }).join('<br>');
                    
                    if(!slideText.trim()) slideText = '<i>[Empty Slide / No Text]</i>';
                    
                    htmlOutput += \`
                        <div class="ppt-slide-print">
                            <h2 style="color:#666; font-size:14px; border-bottom:1px solid #eee; padding-bottom:10px;">Slide \${i+1}</h2>
                            <div style="font-size: 18px; line-height: 1.6; margin-top:20px;">\${slideText}</div>
                        </div>
                    \`;
                }
                
                contentDiv.innerHTML = htmlOutput;
                contentDiv.style.display = 'block';
                contentDiv.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
                
                name.textContent = lang === 'ar' ? 'اضغط Ctrl+P للحفظ كـ PDF' : 'Press Ctrl+P to Save as PDF';
                
                // Trigger print dialog
                setTimeout(() => window.print(), 1000);
                
            } catch(e) { 
                console.error(e);
                name.textContent = lang === 'ar' ? 'خطأ في قراءة الملف' : 'Error loading document'; 
            }
        }
    }
});
