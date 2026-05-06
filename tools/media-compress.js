window.ToolApp.register('media-compress', {
    meta_desc: { ar: 'تقليل حجم الصور بصيغة JPEG و WEBP في متصفحك مباشرة وبسرعة.', en: 'Compress JPEG and WEBP images directly in your browser quickly.' },
    keywords: { ar: ['ضغط', 'صور', 'تقليل', 'حجم', 'compress'], en: ['compress', 'image', 'reduce', 'size', 'jpeg'] },
    features: { ar: ['حفاظ على الجودة', 'يعمل بدون سيرفر'], en: ['Maintain quality', 'No server needed'] },
    render: function(container, lang) {
        const strings = {
            upload: { ar: 'اختر صورة', en: 'Choose Image' },
            quality: { ar: 'مستوى الجودة', en: 'Quality Level' },
            compress: { ar: 'ضغط الصورة', en: 'Compress Image' },
            orig: { ar: 'الحجم الأصلي:', en: 'Original Size:' },
            new: { ar: 'الحجم الجديد:', en: 'New Size:' },
            save: { ar: 'حفظ الصورة', en: 'Save Image' },
            kb: { ar: 'ك.ب', en: 'KB' }
        };

        container.innerHTML = `
            <style>
                .mc-wrap { max-width: 600px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); text-align: center; }
                .mc-btn-file { position: relative; overflow: hidden; display: inline-block; background: var(--accent-color); color: white; padding: 1rem 2rem; border-radius: 12px; font-weight: bold; cursor: pointer; transition: all 0.2s; margin-bottom: 2rem; }
                .mc-btn-file:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
                .mc-btn-file input[type=file] { position: absolute; left: 0; top: 0; opacity: 0; cursor: pointer; height: 100%; width: 100%; }
                
                .mc-preview { width: 100%; max-height: 300px; object-fit: contain; border-radius: 8px; margin-bottom: 1.5rem; display: none; background: var(--bg-color); border: 1px solid var(--border-color); padding: 0.5rem; }
                
                .mc-controls { display: none; flex-direction: column; gap: 1.5rem; margin-bottom: 1.5rem; }
                .mc-label { font-weight: bold; color: var(--text-secondary); margin-bottom: 0.5rem; display: block; }
                .mc-range { width: 100%; accent-color: var(--accent-color); }
                
                .mc-res { background: var(--bg-color); padding: 1.5rem; border-radius: 12px; border: 1px dashed var(--accent-color); display: none; gap: 1rem; flex-direction: column; }
                .mc-stat { font-size: 1.1rem; font-weight: bold; color: var(--text-primary); }
            </style>
            
            <div class="mc-wrap">
                <div class="mc-btn-file">
                    ${strings.upload[lang]}
                    <input type="file" id="mc-file" accept="image/jpeg, image/png, image/webp">
                </div>
                
                <img id="mc-img" class="mc-preview">
                
                <div id="mc-controls" class="mc-controls">
                    <div>
                        <label class="mc-label">${strings.quality[lang]}: <span id="mc-q-val">80%</span></label>
                        <input type="range" id="mc-q" class="mc-range" min="10" max="100" value="80">
                    </div>
                    <button id="mc-btn" class="primary-btn">${strings.compress[lang]}</button>
                </div>
                
                <div id="mc-res" class="mc-res">
                    <div class="mc-stat">${strings.orig[lang]} <span id="r-orig"></span></div>
                    <div class="mc-stat" style="color:#10b981;">${strings.new[lang]} <span id="r-new"></span></div>
                    <a id="mc-dl" class="primary-btn" style="text-decoration:none; display:inline-block; margin-top:1rem;">${strings.save[lang]}</a>
                </div>
            </div>
        `;

        const iFile = container.querySelector('#mc-file');
        const img = container.querySelector('#mc-img');
        const ctrls = container.querySelector('#mc-controls');
        const qInp = container.querySelector('#mc-q');
        const qVal = container.querySelector('#mc-q-val');
        const btn = container.querySelector('#mc-btn');
        const res = container.querySelector('#mc-res');
        const dl = container.querySelector('#mc-dl');
        
        let origSize = 0;
        let origName = '';

        iFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(!file) return;
            
            origSize = file.size;
            origName = file.name.split('.')[0];
            
            const reader = new FileReader();
            reader.onload = (ev) => {
                img.src = ev.target.result;
                img.style.display = 'block';
                ctrls.style.display = 'flex';
                res.style.display = 'none';
            };
            reader.readAsDataURL(file);
        });

        qInp.addEventListener('input', () => {
            qVal.textContent = qInp.value + '%';
        });

        btn.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            // Draw image on canvas
            ctx.drawImage(img, 0, 0);
            
            // Get quality
            const q = parseInt(qInp.value) / 100;
            
            // Compress as JPEG (works best)
            const compressed = canvas.toDataURL('image/jpeg', q);
            
            // Calculate size
            const head = 'data:image/jpeg;base64,';
            const size = Math.round((compressed.length - head.length) * 3 / 4);
            
            container.querySelector('#r-orig').textContent = (origSize / 1024).toFixed(2) + ' ' + strings.kb[lang];
            container.querySelector('#r-new').textContent = (size / 1024).toFixed(2) + ' ' + strings.kb[lang];
            
            dl.href = compressed;
            dl.download = origName + '_compressed.jpg';
            
            res.style.display = 'flex';
        });
    }
});
