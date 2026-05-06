window.ToolApp.register('health-calories', {
    meta_desc: { ar: 'حساب احتياجك اليومي من السعرات الحرارية بناءً على نشاطك وأهدافك.', en: 'Calculate daily calorie needs based on activity and goals.' },
    keywords: { ar: ['سعرات', 'حرارية', 'دايت', 'تغذية'], en: ['calories', 'diet', 'nutrition'] },
    features: { ar: ['معادلة ميفلين سانت جيور', 'احتساب النشاط البدني'], en: ['Mifflin-St Jeor Equation', 'Physical activity factored'] },
    render: function(container, lang) {
        const strings = {
            gender: { ar: 'الجنس', en: 'Gender' },
            m: { ar: 'ذكر', en: 'Male' },
            f: { ar: 'أنثى', en: 'Female' },
            age: { ar: 'العمر', en: 'Age' },
            weight: { ar: 'الوزن (كجم)', en: 'Weight (kg)' },
            height: { ar: 'الطول (سم)', en: 'Height (cm)' },
            activity: { ar: 'النشاط البدني', en: 'Activity Level' },
            a1: { ar: 'بدون نشاط / خامل', en: 'Sedentary' },
            a2: { ar: 'نشاط خفيف (1-3 أيام/أسبوع)', en: 'Light Exercise (1-3 days)' },
            a3: { ar: 'نشاط متوسط (3-5 أيام/أسبوع)', en: 'Moderate (3-5 days)' },
            a4: { ar: 'نشاط عالي (6-7 أيام/أسبوع)', en: 'Active (6-7 days)' },
            calc: { ar: 'احسب السعرات', en: 'Calculate Calories' },
            resDesc: { ar: 'للحفاظ على وزنك الحالي:', en: 'To maintain current weight:' },
            cal: { ar: 'سُعرة / يوم', en: 'kcal / day' }
        };

        container.innerHTML = `
            <style>
                .c-wrap { max-width: 500px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .c-group { margin-bottom: 1.25rem; text-align: start; }
                .c-label { display: block; margin-bottom: 0.5rem; font-weight: bold; color: var(--text-secondary); }
                .c-input { width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-color); color: var(--text-primary); outline: none; }
                .c-res { margin-top: 1.5rem; padding: 1.5rem; border-radius: 8px; background: var(--bg-color); text-align: center; display: none; border: 1px solid var(--border-color); }
            </style>
            <div class="c-wrap">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div class="c-group">
                        <label class="c-label">${strings.gender[lang]}</label>
                        <select id="cal-g" class="c-input">
                            <option value="m">${strings.m[lang]}</option>
                            <option value="f">${strings.f[lang]}</option>
                        </select>
                    </div>
                    <div class="c-group">
                        <label class="c-label">${strings.age[lang]}</label>
                        <input type="number" id="cal-a" class="c-input" placeholder="25" min="1">
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div class="c-group">
                        <label class="c-label">${strings.weight[lang]}</label>
                        <input type="number" id="cal-w" class="c-input" placeholder="70" min="1">
                    </div>
                    <div class="c-group">
                        <label class="c-label">${strings.height[lang]}</label>
                        <input type="number" id="cal-h" class="c-input" placeholder="170" min="1">
                    </div>
                </div>
                <div class="c-group">
                    <label class="c-label">${strings.activity[lang]}</label>
                    <select id="cal-act" class="c-input">
                        <option value="1.2">${strings.a1[lang]}</option>
                        <option value="1.375">${strings.a2[lang]}</option>
                        <option value="1.55">${strings.a3[lang]}</option>
                        <option value="1.725">${strings.a4[lang]}</option>
                    </select>
                </div>
                <button class="primary-btn" id="cal-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div class="c-res" id="cal-res">
                    <div style="color:var(--text-secondary); margin-bottom:0.5rem;">${strings.resDesc[lang]}</div>
                    <div style="font-size:2.5rem; font-weight:bold; color:var(--accent-color);" id="cal-val"></div>
                    <div style="color:var(--text-secondary);">${strings.cal[lang]}</div>
                </div>
            </div>
        `;

        const btn = container.querySelector('#cal-btn');
        btn.addEventListener('click', () => {
            const g = container.querySelector('#cal-g').value;
            const a = parseFloat(container.querySelector('#cal-a').value);
            const w = parseFloat(container.querySelector('#cal-w').value);
            const h = parseFloat(container.querySelector('#cal-h').value);
            const act = parseFloat(container.querySelector('#cal-act').value);
            
            if(!a || !w || !h) return;
            
            // Mifflin-St Jeor
            let bmr = (10 * w) + (6.25 * h) - (5 * a);
            bmr += (g === 'm') ? 5 : -161;
            
            const tdee = bmr * act;
            
            container.querySelector('#cal-val').textContent = Math.round(tdee).toLocaleString();
            container.querySelector('#cal-res').style.display = 'block';
        });
    }
});
