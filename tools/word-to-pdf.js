window.ToolApp.register('word-to-pdf', {
    meta_desc: { ar: 'تحويل ملفات Word إلى PDF داخل المتصفح.', en: 'Convert Word files to PDF in browser.' },
    keywords: { ar: ['word', 'pdf', 'تحويل'], en: ['word', 'pdf', 'convert'] },
    features: { ar: ['تحويل سريع (نصوص وصور أساسية)'], en: ['Fast conversion (text & basic images)'] },
    render: function(container, lang) {
        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; text-align:center;">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem;">${lang === 'ar' ? 'اختر ملف Word (DOCX) لتحويله إلى PDF عبر طباعته.' : 'Select a Word (DOCX) file to convert to PDF via printing.'}</p>
                <input type="file" id="wp-input" accept=".docx" style="display:none;">
                <div id="wp-drop" style="border: 2px dashed var(--border-color); padding: 3rem; border-radius: 16px; cursor: pointer; background: var(--surface-color);">
                    <h3 id="wp-name">${lang === 'ar' ? 'اختر ملف DOCX' : 'Select DOCX File'}</h3>
                </div>
                <div id="wp-content" style="display:none; background:white; color:black; padding:2rem; text-align:left; margin-top:2rem;"></div>
            </div>
        `;
        const drop = container.querySelector('#wp-drop'), inp = container.querySelector('#wp-input'), name = container.querySelector('#wp-name'), contentDiv = container.querySelector('#wp-content');

        drop.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => { if(e.target.files[0]) processWord(e.target.files[0]); });

        const processWord = (file) => {
            name.textContent = lang === 'ar' ? 'جاري القراءة...' : 'Reading...';
            if(!window.mammoth) {
                const s = document.createElement('script');
                s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.21/mammoth.browser.min.js';
                s.onload = () => convert(file);
                document.body.appendChild(s);
            } else convert(file);
        };

        async function convert(file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
                contentDiv.innerHTML = result.value;
                contentDiv.style.display = 'block';
                name.textContent = lang === 'ar' ? 'اضغط Ctrl+P للحفظ كـ PDF' : 'Press Ctrl+P to Save as PDF';
                setTimeout(() => window.print(), 1000);
            } catch(e) { name.textContent = 'Error loading document'; }
        }
    }
});
