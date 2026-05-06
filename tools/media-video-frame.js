window.ToolApp.register('media-video-frame', {
    meta_desc: { ar: 'التقاط واستخراج أي لقطة من فيديو كصورة عالية الدقة دون الحاجة للبرامج.', en: 'Extract any frame from a video as a high-quality image without software.' },
    keywords: { ar: ['فيديو', 'صورة', 'لقطة', 'استخراج', 'video'], en: ['video', 'frame', 'image', 'extract', 'capture'] },
    features: { ar: ['يعمل محلياً بالكامل', 'أعلى دقة ممكنة للإطار'], en: ['Fully local', 'Highest frame resolution'] },
    render: function(container, lang) {
        const strings = {
            upload: { ar: 'اختر ملف فيديو (MP4, WebM)', en: 'Choose Video (MP4, WebM)' },
            desc: { ar: 'قم بتشغيل الفيديو أو إيقافه عند اللقطة المطلوبة واضغط على الزر.', en: 'Play or seek to the desired frame, then click capture.' },
            cap: { ar: '📸 التقاط الإطار (كصورة)', en: '📸 Capture Frame (Image)' }
        };

        container.innerHTML = `
            <style>
                .vf-wrap { max-width: 800px; margin: 0 auto; text-align: center; }
                .vf-file { background: var(--surface-color); border: 2px dashed var(--border-color); padding: 2rem; border-radius: 16px; cursor: pointer; margin-bottom: 1.5rem; transition: border-color 0.2s; position: relative; overflow: hidden; }
                .vf-file:hover { border-color: var(--accent-color); }
                .vf-file input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
                .vf-file span { font-weight: bold; color: var(--text-primary); pointer-events: none; font-size: 1.2rem; }
                
                .vf-vid { width: 100%; max-height: 500px; background: #000; border-radius: 12px; display: none; outline: none; }
                .vf-controls { margin-top: 1.5rem; display: none; flex-direction: column; gap: 1rem; align-items: center; }
                .vf-desc { color: var(--text-secondary); font-size: 0.95rem; }
            </style>
            
            <div class="vf-wrap">
                <div class="vf-file">
                    <span>${strings.upload[lang]}</span>
                    <input type="file" id="vf-file" accept="video/mp4, video/webm, video/ogg">
                </div>
                
                <video id="vf-vid" class="vf-vid" controls></video>
                
                <div id="vf-controls" class="vf-controls">
                    <div class="vf-desc">${strings.desc[lang]}</div>
                    <button id="vf-btn" class="primary-btn" style="font-size:1.1rem; padding:1rem 2rem;">${strings.cap[lang]}</button>
                </div>
            </div>
        `;

        const iFile = container.querySelector('#vf-file');
        const vid = container.querySelector('#vf-vid');
        const ctrls = container.querySelector('#vf-controls');
        const btn = container.querySelector('#vf-btn');
        let origName = '';

        iFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(!file) return;
            origName = file.name.split('.')[0];
            
            const url = URL.createObjectURL(file);
            vid.src = url;
            vid.style.display = 'block';
            ctrls.style.display = 'flex';
        });

        btn.addEventListener('click', () => {
            if(!vid.videoWidth) return; // Not loaded yet
            
            const canvas = document.createElement('canvas');
            canvas.width = vid.videoWidth;
            canvas.height = vid.videoHeight;
            const ctx = canvas.getContext('2d');
            
            ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
            
            const data = canvas.toDataURL('image/jpeg', 1.0);
            const a = document.createElement('a');
            a.href = data;
            const t = Math.floor(vid.currentTime);
            a.download = origName + `_frame_${t}s.jpg`;
            a.click();
        });
    }
});
