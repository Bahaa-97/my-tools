window.ToolApp.register('dev-jwt', {
    meta_desc: { ar: 'فك تشفير وعرض محتويات رموز JWT Tokens بأمان كامل في المتصفح.', en: 'Decode and view JWT Tokens payload securely in the browser.' },
    keywords: { ar: ['تشفير', 'تحليل', 'رمز', 'jwt', 'token'], en: ['jwt', 'decoder', 'token', 'auth', 'payload'] },
    features: { ar: ['تشفير محلي وآمن', 'تنسيق JSON تلقائي'], en: ['Secure local decoding', 'Auto JSON formatting'] },
    render: function(container, lang) {
        const strings = {
            inp: { ar: 'أدخل JWT Token هنا', en: 'Paste JWT Token here' },
            header: { ar: 'الترويسة (Header)', en: 'Header' },
            payload: { ar: 'البيانات (Payload)', en: 'Payload' },
            err: { ar: 'الرمز غير صالح!', en: 'Invalid Token!' }
        };

        container.innerHTML = `
            <style>
                .dj-wrap { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
                .dj-area { width: 100%; min-height: 120px; padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; font-family: monospace; resize: vertical; word-break: break-all; }
                .dj-box { background: var(--surface-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .dj-label { font-weight: bold; margin-bottom: 0.5rem; color: var(--text-secondary); display: block; text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem; }
                .dj-out { min-height: 150px; padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: rgba(var(--c-rgb, 59, 130, 246), 0.05); color: var(--accent-color); font-family: monospace; white-space: pre-wrap; word-break: break-all; }
            </style>
            
            <div class="dj-wrap">
                <div>
                    <label class="dj-label">${strings.inp[lang]}</label>
                    <textarea id="dj-in" class="dj-area" placeholder="eyJhbGciOiJIUzI1NiIsInR..."></textarea>
                </div>
                
                <div class="dj-box">
                    <label class="dj-label" style="color:#ef4444;">${strings.header[lang]}</label>
                    <div id="dj-head" class="dj-out"></div>
                </div>
                
                <div class="dj-box">
                    <label class="dj-label" style="color:#3b82f6;">${strings.payload[lang]}</label>
                    <div id="dj-pay" class="dj-out"></div>
                </div>
            </div>
        `;

        const tin = container.querySelector('#dj-in');
        const thead = container.querySelector('#dj-head');
        const tpay = container.querySelector('#dj-pay');

        const b64DecodeUnicode = (str) => {
            // Fix padding
            str = str.replace(/-/g, '+').replace(/_/g, '/');
            while (str.length % 4) { str += '='; }
            // Decode to URI components to handle unicode
            return decodeURIComponent(atob(str).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        };

        tin.addEventListener('input', () => {
            const val = tin.value.trim();
            if(!val) {
                thead.textContent = '';
                tpay.textContent = '';
                return;
            }
            
            const parts = val.split('.');
            if(parts.length < 2) {
                thead.textContent = strings.err[lang];
                tpay.textContent = '';
                return;
            }

            try {
                const header = JSON.parse(b64DecodeUnicode(parts[0]));
                const payload = JSON.parse(b64DecodeUnicode(parts[1]));
                
                thead.textContent = JSON.stringify(header, null, 4);
                tpay.textContent = JSON.stringify(payload, null, 4);
            } catch(e) {
                thead.textContent = strings.err[lang];
                tpay.textContent = '';
            }
        });
    }
});
