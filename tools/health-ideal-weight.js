window.ToolApp.register('health-ideal-weight', {
    meta_desc: { ar: 'تحديد نطاق الوزن المثالي والصحي بناءً على طولك.', en: 'Determine your ideal and healthy weight range based on height.' },
    keywords: { ar: ['وزن', 'مثالي', 'طول', 'صحة'], en: ['ideal', 'weight', 'height', 'health'] },
    features: { ar: ['معادلة روبنسون المعتمدة', 'نتائج دقيقة'], en: ['Robinson Formula', 'Accurate results'] },
    render: function(container, lang) {
        const strings = {
            gender: { ar: 'الجنس', en: 'Gender' },
            m: { ar: 'ذكر', en: 'Male' },
            f: { ar: 'أنثى', en: 'Female' },
            height: { ar: 'الطول (سم)', en: 'Height (cm)' },
            calc: { ar: 'احسب الوزن المثالي', en: 'Calculate Ideal Weight' },
            resDesc: { ar: 'الوزن المثالي التقديري:', en: 'Estimated Ideal Weight:' },
            kg: { ar: 'كجم', en: 'kg' }
        };

        container.innerHTML = `
            <div style="max-width:400px; margin:0 auto; background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                <div style="margin-bottom:1.5rem; text-align:start;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.gender[lang]}</label>
                    <select id="iw-g" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;">
                        <option value="m">${strings.m[lang]}</option>
                        <option value="f">${strings.f[lang]}</option>
                    </select>
                </div>
                <div style="margin-bottom:1.5rem; text-align:start;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.height[lang]}</label>
                    <input type="number" id="iw-h" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="170">
                </div>
                <button class="primary-btn" id="iw-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="iw-res" style="margin-top:1.5rem; padding:1.5rem; border-radius:8px; background:var(--bg-color); text-align:center; display:none; border:1px solid var(--border-color);">
                    <div style="color:var(--text-secondary); margin-bottom:0.5rem;">${strings.resDesc[lang]}</div>
                    <div style="font-size:2.5rem; font-weight:bold; color:#10b981; margin-bottom:0.5rem;" id="iw-val"></div>
                </div>
            </div>
        `;

        const btn = container.querySelector('#iw-btn');
        btn.addEventListener('click', () => {
            const g = container.querySelector('#iw-g').value;
            const hCm = parseFloat(container.querySelector('#iw-h').value);
            
            if(!hCm) return;
            
            // Convert height to inches
            const hInches = hCm / 2.54;
            let iw = 0;
            
            // J. D. Robinson Formula (1983)
            // Men: 52 kg + 1.9 kg per inch over 5 feet
            // Women: 49 kg + 1.7 kg per inch over 5 feet
            // 5 feet = 60 inches
            
            if(g === 'm') {
                iw = 52 + (1.9 * (hInches - 60));
            } else {
                iw = 49 + (1.7 * (hInches - 60));
            }
            
            // Sanity check for very short people
            if(hInches < 60) {
                if(g === 'm') iw = 52 - (1.9 * (60 - hInches));
                else iw = 49 - (1.7 * (60 - hInches));
            }
            
            container.querySelector('#iw-val').textContent = iw.toFixed(1) + ' ' + strings.kg[lang];
            container.querySelector('#iw-res').style.display = 'block';
        });
    }
});
