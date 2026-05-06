window.ToolApp.register('health-bodyfat', {
    meta_desc: { ar: 'تقدير نسبة الدهون في الجسم باستخدام قياسات المحيط.', en: 'Estimate body fat percentage using circumference measurements.' },
    keywords: { ar: ['دهون', 'جسم', 'نسبة', 'صحة'], en: ['fat', 'body fat', 'percentage', 'health'] },
    features: { ar: ['معادلة البحرية الأمريكية', 'لا يحتاج أدوات خاصة'], en: ['US Navy Method', 'No special tools needed'] },
    render: function(container, lang) {
        const strings = {
            gender: { ar: 'الجنس', en: 'Gender' },
            m: { ar: 'ذكر', en: 'Male' },
            f: { ar: 'أنثى', en: 'Female' },
            height: { ar: 'الطول (سم)', en: 'Height (cm)' },
            neck: { ar: 'محيط الرقبة (سم)', en: 'Neck (cm)' },
            waist: { ar: 'محيط الخصر (سم)', en: 'Waist (cm)' },
            hip: { ar: 'محيط الحوض (سم) - للإناث فقط', en: 'Hip (cm) - Female only' },
            calc: { ar: 'احسب نسبة الدهون', en: 'Calculate Body Fat' },
            resDesc: { ar: 'نسبة الدهون التقديرية:', en: 'Estimated Body Fat:' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; text-align:start;">
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.gender[lang]}</label>
                        <select id="bf-g" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;">
                            <option value="m">${strings.m[lang]}</option>
                            <option value="f">${strings.f[lang]}</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.height[lang]}</label>
                        <input type="number" id="bf-h" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="170">
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; text-align:start;">
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.neck[lang]}</label>
                        <input type="number" id="bf-n" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="38">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.waist[lang]}</label>
                        <input type="number" id="bf-w" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="85">
                    </div>
                </div>
                <div id="bf-hip-group" style="margin-bottom:1.5rem; text-align:start; display:none;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.hip[lang]}</label>
                    <input type="number" id="bf-hip" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="95">
                </div>
                <button class="primary-btn" id="bf-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="bf-res" style="margin-top:1.5rem; padding:1.5rem; border-radius:8px; background:var(--bg-color); text-align:center; display:none; border:1px solid var(--border-color);">
                    <div style="color:var(--text-secondary); margin-bottom:0.5rem;">${strings.resDesc[lang]}</div>
                    <div style="font-size:2.5rem; font-weight:bold; color:var(--accent-color);" id="bf-val"></div>
                </div>
            </div>
        `;

        const genderSel = container.querySelector('#bf-g');
        const hipGroup = container.querySelector('#bf-hip-group');
        
        genderSel.addEventListener('change', () => {
            if(genderSel.value === 'f') hipGroup.style.display = 'block';
            else hipGroup.style.display = 'none';
        });

        const btn = container.querySelector('#bf-btn');
        btn.addEventListener('click', () => {
            const g = genderSel.value;
            const h = parseFloat(container.querySelector('#bf-h').value);
            const n = parseFloat(container.querySelector('#bf-n').value);
            const w = parseFloat(container.querySelector('#bf-w').value);
            const hip = parseFloat(container.querySelector('#bf-hip').value) || 0;
            
            if(!h || !n || !w || (g === 'f' && !hip)) return;
            
            let bf = 0;
            if(g === 'm') {
                bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
            } else {
                bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hip - n) + 0.22100 * Math.log10(h)) - 450;
            }
            
            if(isNaN(bf) || bf < 0 || bf > 100) bf = 0;
            
            container.querySelector('#bf-val').textContent = bf.toFixed(1) + ' %';
            container.querySelector('#bf-res').style.display = 'block';
        });
    }
});
