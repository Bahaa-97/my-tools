window.ToolApp.register('dev-encoder', {
    meta_desc: { ar: 'تشفير وفك تشفير النصوص بسرعة باستخدام Base64 و URL Encoding.', en: 'Fast encode and decode strings using Base64 and URL encoding.' },
    keywords: { ar: ['تشفير', 'فك تشفير', 'نص', 'base64', 'url'], en: ['encode', 'decode', 'base64', 'url', 'string'] },
    features: { ar: ['دعم Base64 و URL', 'سريع وآمن محلياً'], en: ['Base64 & URL support', 'Fast & local secure'] },
    render: function(container, lang) {
        const strings = {
            in: { ar: 'النص الأصلي', en: 'Original Text' },
            out: { ar: 'النتيجة', en: 'Result' },
            b64e: { ar: 'تشفير Base64', en: 'Base64 Encode' },
            b64d: { ar: 'فك Base64', en: 'Base64 Decode' },
            urle: { ar: 'تشفير URL', en: 'URL Encode' },
            urld: { ar: 'فك URL', en: 'URL Decode' },
            err: { ar: 'خطأ في النص المدخل للفصل!', en: 'Invalid input for decoding!' }
        };

        container.innerHTML = `
            <style>
                .de-wrap { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
                .de-area { width: 100%; min-height: 150px; padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; font-family: monospace; resize: vertical; margin-bottom: 1rem; }
                .de-label { font-weight: bold; margin-bottom: 0.5rem; color: var(--text-secondary); display: block; }
                .de-controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem; margin-bottom: 1rem; }
            </style>
            
            <div class="de-wrap">
                <div>
                    <label class="de-label">${strings.in[lang]}</label>
                    <textarea id="de-in" class="de-area" placeholder="Hello World"></textarea>
                </div>
                
                <div class="de-controls">
                    <button id="btn-b64e" class="primary-btn">${strings.b64e[lang]}</button>
                    <button id="btn-b64d" class="primary-btn" style="background:var(--text-secondary);">${strings.b64d[lang]}</button>
                    <button id="btn-urle" class="primary-btn">${strings.urle[lang]}</button>
                    <button id="btn-urld" class="primary-btn" style="background:var(--text-secondary);">${strings.urld[lang]}</button>
                </div>
                
                <div>
                    <label class="de-label">${strings.out[lang]}</label>
                    <textarea id="de-out" class="de-area" readonly></textarea>
                </div>
            </div>
        `;

        const tin = container.querySelector('#de-in');
        const tout = container.querySelector('#de-out');

        const doOp = (op) => {
            const val = tin.value;
            if(!val) { tout.value = ''; return; }
            try {
                if(op === 'b64e') tout.value = btoa(unescape(encodeURIComponent(val)));
                if(op === 'b64d') tout.value = decodeURIComponent(escape(atob(val)));
                if(op === 'urle') tout.value = encodeURIComponent(val);
                if(op === 'urld') tout.value = decodeURIComponent(val);
            } catch(e) {
                tout.value = strings.err[lang];
            }
        };

        container.querySelector('#btn-b64e').addEventListener('click', () => doOp('b64e'));
        container.querySelector('#btn-b64d').addEventListener('click', () => doOp('b64d'));
        container.querySelector('#btn-urle').addEventListener('click', () => doOp('urle'));
        container.querySelector('#btn-urld').addEventListener('click', () => doOp('urld'));
    }
});
