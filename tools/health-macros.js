window.ToolApp.register('health-macros', {
    meta_desc: { ar: 'توزيع السعرات الحرارية إلى ماكروز (بروتين، كارب، دهون) حسب أهدافك.', en: 'Distribute calories into macros (protein, carbs, fat) based on goals.' },
    keywords: { ar: ['ماكروز', 'بروتين', 'كارب', 'تنشيف', 'تضخيم'], en: ['macros', 'protein', 'carbs', 'cutting', 'bulking'] },
    features: { ar: ['توزيع دقيق', 'أنظمة متعددة الأهداف'], en: ['Accurate split', 'Multiple goal systems'] },
    render: function(container, lang) {
        const strings = {
            tdee: { ar: 'السعرات الحرارية اليومية (TDEE)', en: 'Daily Calories (TDEE)' },
            goal: { ar: 'الهدف الرياضي', en: 'Fitness Goal' },
            g1: { ar: 'تنشيف (إنقاص وزن)', en: 'Cutting (Lose weight)' },
            g2: { ar: 'محافظة (ثبات)', en: 'Maintain weight' },
            g3: { ar: 'تضخيم (زيادة عضل)', en: 'Bulking (Gain muscle)' },
            calc: { ar: 'احسب الماكروز', en: 'Calculate Macros' },
            pro: { ar: 'بروتين', en: 'Protein' },
            car: { ar: 'كاربوهيدرات', en: 'Carbs' },
            fat: { ar: 'دهون', en: 'Fat' },
            g: { ar: 'جرام / يوم', en: 'g / day' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                <div style="margin-bottom:1.5rem; text-align:start;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.tdee[lang]}</label>
                    <input type="number" id="m-tdee" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="2000">
                </div>
                <div style="margin-bottom:1.5rem; text-align:start;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.goal[lang]}</label>
                    <select id="m-goal" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;">
                        <option value="cut">${strings.g1[lang]}</option>
                        <option value="main" selected>${strings.g2[lang]}</option>
                        <option value="bulk">${strings.g3[lang]}</option>
                    </select>
                </div>
                <button class="primary-btn" id="m-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="m-res" style="margin-top:1.5rem; display:none;">
                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:1rem; text-align:center;">
                        <div style="background:var(--bg-color); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                            <div style="color:var(--text-secondary); font-weight:bold; margin-bottom:0.5rem;">${strings.pro[lang]}</div>
                            <div style="font-size:1.5rem; font-weight:bold; color:#ef4444;" id="r-pro"></div>
                            <div style="font-size:0.8rem; color:var(--text-secondary);">${strings.g[lang]}</div>
                        </div>
                        <div style="background:var(--bg-color); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                            <div style="color:var(--text-secondary); font-weight:bold; margin-bottom:0.5rem;">${strings.car[lang]}</div>
                            <div style="font-size:1.5rem; font-weight:bold; color:#3b82f6;" id="r-car"></div>
                            <div style="font-size:0.8rem; color:var(--text-secondary);">${strings.g[lang]}</div>
                        </div>
                        <div style="background:var(--bg-color); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                            <div style="color:var(--text-secondary); font-weight:bold; margin-bottom:0.5rem;">${strings.fat[lang]}</div>
                            <div style="font-size:1.5rem; font-weight:bold; color:#f59e0b;" id="r-fat"></div>
                            <div style="font-size:0.8rem; color:var(--text-secondary);">${strings.g[lang]}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const btn = container.querySelector('#m-btn');
        btn.addEventListener('click', () => {
            let tdee = parseFloat(container.querySelector('#m-tdee').value);
            const goal = container.querySelector('#m-goal').value;
            
            if(!tdee) return;
            
            // Adjust calories based on goal
            if(goal === 'cut') tdee *= 0.80; // 20% deficit
            else if(goal === 'bulk') tdee *= 1.15; // 15% surplus
            
            // Macro percentages
            let pPct, cPct, fPct;
            if(goal === 'cut') { pPct = 0.40; cPct = 0.30; fPct = 0.30; }
            else if(goal === 'main') { pPct = 0.30; cPct = 0.40; fPct = 0.30; }
            else { pPct = 0.30; cPct = 0.50; fPct = 0.20; }
            
            // Grams
            const proGrams = Math.round((tdee * pPct) / 4);
            const carGrams = Math.round((tdee * cPct) / 4);
            const fatGrams = Math.round((tdee * fPct) / 9);
            
            container.querySelector('#r-pro').textContent = proGrams;
            container.querySelector('#r-car').textContent = carGrams;
            container.querySelector('#r-fat').textContent = fatGrams;
            container.querySelector('#m-res').style.display = 'block';
        });
    }
});
