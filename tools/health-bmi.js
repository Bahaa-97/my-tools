window.ToolApp.register('health-bmi', {
    meta_desc: { ar: 'حاسبة مؤشر كتلة الجسم لمعرفة الوزن المثالي وتصنيف الحالة الصحية.', en: 'Calculate Body Mass Index to find ideal weight and health status.' },
    keywords: { ar: ['bmi', 'كتلة الجسم', 'وزن', 'صحة'], en: ['bmi', 'body mass', 'weight', 'health'] },
    features: { ar: ['نتائج فورية', 'تصنيف دقيق للحالة'], en: ['Instant results', 'Accurate status classification'] },
    render: function(container, lang) {
        const strings = {
            weight: { ar: 'الوزن (كجم)', en: 'Weight (kg)' },
            height: { ar: 'الطول (سم)', en: 'Height (cm)' },
            calc: { ar: 'احسب BMI', en: 'Calculate BMI' },
            res: { ar: 'النتيجة:', en: 'Result:' },
            status: {
                uw: { ar: 'نقص في الوزن', en: 'Underweight' },
                nw: { ar: 'وزن طبيعي', en: 'Normal weight' },
                ow: { ar: 'زيادة في الوزن', en: 'Overweight' },
                ob: { ar: 'سمنة', en: 'Obese' }
            }
        };

        container.innerHTML = `
            <style>
                .h-wrap { max-width: 400px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .h-group { margin-bottom: 1.5rem; text-align: start; }
                .h-label { display: block; margin-bottom: 0.5rem; font-weight: bold; color: var(--text-secondary); }
                .h-input { width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-color); color: var(--text-primary); font-size: 1rem; outline: none; transition: border-color 0.2s; }
                .h-input:focus { border-color: var(--accent-color); }
                .h-res { margin-top: 1.5rem; padding: 1.5rem; border-radius: 8px; background: var(--bg-color); text-align: center; display: none; border: 1px solid var(--border-color); }
                .h-val { font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem; }
            </style>
            <div class="h-wrap">
                <div class="h-group">
                    <label class="h-label">${strings.weight[lang]}</label>
                    <input type="number" id="bmi-w" class="h-input" placeholder="70" min="1">
                </div>
                <div class="h-group">
                    <label class="h-label">${strings.height[lang]}</label>
                    <input type="number" id="bmi-h" class="h-input" placeholder="170" min="1">
                </div>
                <button class="primary-btn" id="bmi-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div class="h-res" id="bmi-res">
                    <div style="color:var(--text-secondary); margin-bottom:0.5rem;">${strings.res[lang]}</div>
                    <div class="h-val" id="bmi-val"></div>
                    <div id="bmi-status" style="font-weight:bold; font-size:1.1rem;"></div>
                </div>
            </div>
        `;

        const wInp = container.querySelector('#bmi-w');
        const hInp = container.querySelector('#bmi-h');
        const btn = container.querySelector('#bmi-btn');
        const resBox = container.querySelector('#bmi-res');
        const valDiv = container.querySelector('#bmi-val');
        const statusDiv = container.querySelector('#bmi-status');

        btn.addEventListener('click', () => {
            const w = parseFloat(wInp.value);
            const h = parseFloat(hInp.value) / 100;
            if(!w || !h) return;
            
            const bmi = w / (h * h);
            valDiv.textContent = bmi.toFixed(1);
            
            let status = '', color = '';
            if(bmi < 18.5) { status = strings.status.uw[lang]; color = '#3b82f6'; }
            else if(bmi < 25) { status = strings.status.nw[lang]; color = '#10b981'; }
            else if(bmi < 30) { status = strings.status.ow[lang]; color = '#f59e0b'; }
            else { status = strings.status.ob[lang]; color = '#ef4444'; }
            
            valDiv.style.color = color;
            statusDiv.textContent = status;
            statusDiv.style.color = color;
            resBox.style.display = 'block';
        });
    }
});
