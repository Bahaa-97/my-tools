window.ToolApp.register('dev-url', {
    meta_desc: { ar: 'تفكيك الروابط المعقدة لاستخراج المتغيرات والمسارات والبروتوكولات.', en: 'Parse complex URLs to extract parameters, paths, and protocols.' },
    keywords: { ar: ['رابط', 'تحليل', 'متغيرات', 'url', 'parser'], en: ['url', 'parser', 'extract', 'query', 'parameters'] },
    features: { ar: ['استخراج المعاملات لجدول', 'تفكيك الدومين والمسار'], en: ['Extract params to table', 'Parse domain & path'] },
    render: function(container, lang) {
        const strings = {
            inp: { ar: 'أدخل الرابط كاملاً', en: 'Enter Full URL' },
            protocol: { ar: 'البروتوكول', en: 'Protocol' },
            host: { ar: 'النطاق (Host)', en: 'Host' },
            path: { ar: 'المسار (Path)', en: 'Path' },
            hash: { ar: 'الجزء (Hash)', en: 'Hash' },
            params: { ar: 'المتغيرات (Query Params)', en: 'Query Parameters' },
            key: { ar: 'المفتاح', en: 'Key' },
            val: { ar: 'القيمة', en: 'Value' },
            err: { ar: 'رابط غير صالح', en: 'Invalid URL' },
            none: { ar: 'لا يوجد', en: 'None' }
        };

        container.innerHTML = `
            <style>
                .du-wrap { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
                .du-inp { width: 100%; padding: 1rem; border-radius: 12px; border: 2px solid var(--accent-color); background: var(--bg-color); color: var(--text-primary); font-size: 1.1rem; outline: none; }
                .du-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
                .du-box { background: var(--surface-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .du-label { font-size: 0.85rem; color: var(--text-secondary); font-weight: bold; margin-bottom: 0.5rem; text-transform: uppercase; }
                .du-val { font-weight: bold; color: var(--text-primary); word-break: break-all; }
                .du-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                .du-table th, .du-table td { padding: 0.75rem; border: 1px solid var(--border-color); text-align: start; }
                .du-table th { background: var(--bg-color); color: var(--text-secondary); }
            </style>
            
            <div class="du-wrap">
                <input type="text" id="du-url" class="du-inp" placeholder="https://example.com/path?page=1&sort=asc">
                <div id="du-err" style="color:#ef4444; font-weight:bold; display:none;">${strings.err[lang]}</div>
                
                <div class="du-grid" id="du-parts" style="display:none;">
                    <div class="du-box"><div class="du-label">${strings.protocol[lang]}</div><div id="p-prot" class="du-val"></div></div>
                    <div class="du-box"><div class="du-label">${strings.host[lang]}</div><div id="p-host" class="du-val"></div></div>
                    <div class="du-box"><div class="du-label">${strings.path[lang]}</div><div id="p-path" class="du-val"></div></div>
                    <div class="du-box"><div class="du-label">${strings.hash[lang]}</div><div id="p-hash" class="du-val"></div></div>
                </div>
                
                <div class="du-box" id="du-params-box" style="display:none;">
                    <div class="du-label">${strings.params[lang]}</div>
                    <table class="du-table" id="du-table">
                        <thead>
                            <tr><th>${strings.key[lang]}</th><th>${strings.val[lang]}</th></tr>
                        </thead>
                        <tbody id="du-tbody"></tbody>
                    </table>
                </div>
            </div>
        `;

        const iUrl = container.querySelector('#du-url');
        const errEl = container.querySelector('#du-err');
        const partsEl = container.querySelector('#du-parts');
        const paramsBox = container.querySelector('#du-params-box');
        const tbody = container.querySelector('#du-tbody');

        iUrl.addEventListener('input', () => {
            const val = iUrl.value.trim();
            if(!val) {
                partsEl.style.display = 'none';
                paramsBox.style.display = 'none';
                errEl.style.display = 'none';
                return;
            }

            try {
                let urlStr = val;
                if(!urlStr.startsWith('http')) urlStr = 'https://' + urlStr; // Auto protocol
                
                const u = new URL(urlStr);
                
                errEl.style.display = 'none';
                partsEl.style.display = 'grid';
                
                container.querySelector('#p-prot').textContent = u.protocol;
                container.querySelector('#p-host').textContent = u.host;
                container.querySelector('#p-path').textContent = u.pathname || strings.none[lang];
                container.querySelector('#p-hash').textContent = u.hash || strings.none[lang];

                tbody.innerHTML = '';
                const params = Array.from(u.searchParams.entries());
                if(params.length > 0) {
                    params.forEach(([k, v]) => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `<td style="color:var(--accent-color); font-weight:bold;">${k}</td><td>${v}</td>`;
                        tbody.appendChild(tr);
                    });
                    paramsBox.style.display = 'block';
                } else {
                    paramsBox.style.display = 'none';
                }
                
            } catch(e) {
                errEl.style.display = 'block';
                partsEl.style.display = 'none';
                paramsBox.style.display = 'none';
            }
        });
    }
});
