window.ToolApp.register('media-resize', {
    meta_desc: { ar: 'تصغير وتكبير أبعاد الصور لتناسب مقاسات المواقع والتواصل الاجتماعي.', en: 'Resize image dimensions to fit websites and social media requirements.' },
    keywords: { ar: ['تغيير', 'ابعاد', 'صور', 'resize', 'image'], en: ['resize', 'image', 'dimensions', 'width', 'height'] },
    features: { ar: ['تغيير دقيق بالبكسل', 'الحفاظ على الأبعاد (Ratio)'], en: ['Precise pixel sizing', 'Lock aspect ratio'] },
    render: function(container, lang) {
        const strings = {
            upload: { ar: 'اختر صورة', en: 'Upload Image' },
            w: { ar: 'العرض (W)', en: 'Width' },
            h: { ar: 'الطول (H)', en: 'Height' },
            lock: { ar: 'ربط الأبعاد', en: 'Lock Ratio' },
            save: { ar: 'تحميل الصورة', en: 'Download Image' }
        };

        container.innerHTML = `
            <style>
                .mr-wrap { max-width: 600px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); text-align: center; }
                .mr-file { background: var(--bg-color); border: 2px dashed var(--border-color); padding: 2rem; border-radius: 12px; cursor: pointer; margin-bottom: 2rem; transition: border-color 0.2s; position: relative; overflow: hidden; }
                .mr-file:hover { border-color: var(--accent-color); }
                .mr-file input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
                .mr-file span { font-weight: bold; color: var(--text-secondary); pointer-events: none; }
                
                .mr-img { max-width: 100%; max-height: 200px; margin-bottom: 1.5rem; border-radius: 8px; display: none; }
                .mr-controls { display: none; flex-direction: column; gap: 1rem; }
                .mr-row { display: flex; gap: 1rem; align-items: flex-end; justify-content: center; }
                .mr-group { display: flex; flex-direction: column; text-align: start; flex: 1; max-width: 150px; }
                .mr-label { font-size: 0.85rem; font-weight: bold; color: var(--text-secondary); margin-bottom: 0.5rem; }
                .mr-inp { padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-color); color: var(--text-primary); font-weight: bold; text-align: center; }
                .mr-lock { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-secondary); font-size: 0.9rem; justify-content: center; margin-bottom: 1rem; }
            </style>
            
            <div class="mr-wrap">
                <div class="mr-file">
                    <span>${strings.upload[lang]}</span>
                    <input type="file" id="mr-file" accept="image/*">
                </div>
                
                <img id="mr-img" class="mr-img">
                
                <div id="mr-controls" class="mr-controls">
                    <label class="mr-lock">
                        <input type="checkbox" id="mr-lock" checked>
                        ${strings.lock[lang]}
                    </label>
                    <div class="mr-row">
                        <div class="mr-group">
                            <label class="mr-label">${strings.w[lang]} (px)</label>
                            <input type="number" id="mr-w" class="mr-inp">
                        </div>
                        <div class="mr-group">
                            <label class="mr-label">${strings.h[lang]} (px)</label>
                            <input type="number" id="mr-h" class="mr-inp">
                        </div>
                    </div>
                    <button id="mr-btn" class="primary-btn" style="margin-top:1rem;">${strings.save[lang]}</button>
                </div>
            </div>
        `;

        const iFile = container.querySelector('#mr-file');
        const img = container.querySelector('#mr-img');
        const ctrls = container.querySelector('#mr-controls');
        const wInp = container.querySelector('#mr-w');
        const hInp = container.querySelector('#mr-h');
        const lock = container.querySelector('#mr-lock');
        const btn = container.querySelector('#mr-btn');
        
        let ratio = 1;
        let origName = '';

        iFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(!file) return;
            origName = file.name.split('.')[0];
            
            const reader = new FileReader();
            reader.onload = (ev) => {
                img.src = ev.target.result;
                img.onload = () => {
                    img.style.display = 'inline-block';
                    ctrls.style.display = 'flex';
                    wInp.value = img.naturalWidth;
                    hInp.value = img.naturalHeight;
                    ratio = img.naturalWidth / img.naturalHeight;
                };
            };
            reader.readAsDataURL(file);
        });

        wInp.addEventListener('input', () => {
            if(lock.checked && wInp.value) {
                hInp.value = Math.round(wInp.value / ratio);
            }
        });

        hInp.addEventListener('input', () => {
            if(lock.checked && hInp.value) {
                wInp.value = Math.round(hInp.value * ratio);
            }
        });

        btn.addEventListener('click', () => {
            const w = parseInt(wInp.value);
            const h = parseInt(hInp.value);
            if(!w || !h) return;
            
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            
            ctx.drawImage(img, 0, 0, w, h);
            
            const data = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = data;
            a.download = origName + '_resized.png';
            a.click();
        });
    }
});
