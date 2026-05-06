window.ToolApp.register('media-convert', {
    meta_desc: { ar: 'تحويل الصور بين الصيغ الشهيرة JPG, PNG, WEBP مجاناً وبسرعة.', en: 'Convert images between popular formats JPG, PNG, WEBP for free and fast.' },
    keywords: { ar: ['تحويل', 'صيغة', 'صور', 'convert', 'format'], en: ['convert', 'image', 'format', 'png', 'jpg'] },
    features: { ar: ['تحويل آمن بالمستعرض', 'يدعم الصور الشفافة'], en: ['Secure browser convert', 'Supports transparency'] },
    render: function(container, lang) {
        const strings = {
            upload: { ar: 'اختر صورة للتحويل', en: 'Choose image to convert' },
            fmt: { ar: 'الصيغة المطلوبة:', en: 'Target Format:' },
            conv: { ar: 'تحويل وتحميل', en: 'Convert & Download' }
        };

        container.innerHTML = `
            <style>
                .mcv-wrap { max-width: 600px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); text-align: center; }
                .mcv-btn-file { position: relative; overflow: hidden; display: inline-block; background: var(--text-primary); color: var(--bg-color); padding: 1rem 2rem; border-radius: 12px; font-weight: bold; cursor: pointer; transition: all 0.2s; margin-bottom: 2rem; }
                .mcv-btn-file:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
                .mcv-btn-file input[type=file] { position: absolute; left: 0; top: 0; opacity: 0; cursor: pointer; height: 100%; width: 100%; }
                
                .mcv-preview { width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px; margin-bottom: 1.5rem; display: none; }
                .mcv-controls { display: none; gap: 1rem; align-items: center; justify-content: center; flex-wrap: wrap; }
                .mcv-select { padding: 0.75rem 2rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); font-weight: bold; outline: none; }
            </style>
            
            <div class="mcv-wrap">
                <div class="mcv-btn-file">
                    ${strings.upload[lang]}
                    <input type="file" id="mcv-file" accept="image/*">
                </div>
                
                <img id="mcv-img" class="mcv-preview">
                
                <div id="mcv-controls" class="mcv-controls">
                    <span style="font-weight:bold; color:var(--text-secondary);">${strings.fmt[lang]}</span>
                    <select id="mcv-fmt" class="mcv-select">
                        <option value="image/png">PNG</option>
                        <option value="image/jpeg">JPEG (JPG)</option>
                        <option value="image/webp">WEBP</option>
                    </select>
                    
                    <button id="mcv-btn" class="primary-btn">${strings.conv[lang]}</button>
                </div>
            </div>
        `;

        const iFile = container.querySelector('#mcv-file');
        const img = container.querySelector('#mcv-img');
        const ctrls = container.querySelector('#mcv-controls');
        const selFmt = container.querySelector('#mcv-fmt');
        const btn = container.querySelector('#mcv-btn');
        let origName = '';

        iFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(!file) return;
            origName = file.name.split('.')[0];
            
            const reader = new FileReader();
            reader.onload = (ev) => {
                img.src = ev.target.result;
                img.style.display = 'block';
                ctrls.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        });

        btn.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            const fmt = selFmt.value;
            // Fill background with white if JPEG to prevent black transparent areas
            if(fmt === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            ctx.drawImage(img, 0, 0);
            
            const ext = fmt.split('/')[1];
            const data = canvas.toDataURL(fmt, 0.9);
            
            const a = document.createElement('a');
            a.href = data;
            a.download = origName + '_converted.' + (ext === 'jpeg' ? 'jpg' : ext);
            a.click();
        });
    }
});
