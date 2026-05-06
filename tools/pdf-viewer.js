window.ToolApp.register('pdf-viewer', {
    meta_desc: { ar: 'عارض سريع وآمن لملفات PDF محلياً.', en: 'Fast and secure local PDF viewer.' },
    keywords: { ar: ['عرض', 'pdf', 'قراءة'], en: ['view', 'pdf', 'read'] },
    features: { ar: ['سرعة فائقة', 'أمان 100%'], en: ['Ultra fast', '100% Secure'] },
    render: function(container, lang) {
        container.innerHTML = `
            <style>
                .vw-wrap { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
                .vw-btn { padding: 0.75rem 2rem; background: var(--accent-color); color: white; border-radius: 8px; border: none; cursor: pointer; font-weight: bold; }
                #vw-frame { width: 100%; height: 80vh; border: 1px solid var(--border-color); border-radius: 12px; display: none; background: white; }
                #vw-input { display: none; }
            </style>
            <div class="vw-wrap">
                <input type="file" id="vw-input" accept="application/pdf">
                <button class="vw-btn" id="vw-btn" style="margin-bottom:1rem;">${lang === 'ar' ? 'افتح ملف PDF للقرائة' : 'Open PDF to Read'}</button>
                <iframe id="vw-frame"></iframe>
            </div>
        `;
        const inp = container.querySelector('#vw-input');
        const btn = container.querySelector('#vw-btn');
        const frame = container.querySelector('#vw-frame');
        
        btn.addEventListener('click', () => inp.click());
        inp.addEventListener('change', e => {
            const f = e.target.files[0];
            if(!f || f.type !== 'application/pdf') return;
            const url = URL.createObjectURL(f);
            frame.src = url;
            frame.style.display = 'block';
            btn.textContent = lang === 'ar' ? 'تغيير الملف' : 'Change File';
            btn.style.background = 'var(--surface-color)';
            btn.style.color = 'var(--text-primary)';
            btn.style.border = '1px solid var(--border-color)';
        });
        
        // Add cleanup
        container.cleanup = () => { if(frame.src) URL.revokeObjectURL(frame.src); };
    }
});
