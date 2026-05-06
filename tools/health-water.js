window.ToolApp.register('health-water', {
    meta_desc: { ar: 'حساب الكمية المثالية للماء التي يحتاجها جسمك يومياً.', en: 'Calculate the ideal amount of water your body needs daily.' },
    keywords: { ar: ['ماء', 'شرب', 'صحة', 'احتياج'], en: ['water', 'hydration', 'health', 'intake'] },
    features: { ar: ['حساب دقيق حسب الوزن', 'مراعاة وقت التمرين'], en: ['Accurate by weight', 'Considers exercise time'] },
    render: function(container, lang) {
        const strings = {
            weight: { ar: 'الوزن (كجم)', en: 'Weight (kg)' },
            exercise: { ar: 'التمرين اليومي (دقيقة)', en: 'Daily Exercise (mins)' },
            calc: { ar: 'احسب احتياج الماء', en: 'Calculate Water Intake' },
            resDesc: { ar: 'الكمية الموصى بها يومياً:', en: 'Recommended daily intake:' },
            liter: { ar: 'لتر', en: 'Liters' },
            cups: { ar: 'أكواب (250 مل)', en: 'Cups (250ml)' }
        };

        container.innerHTML = `
            <div style="max-width:400px; margin:0 auto; background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                <div style="margin-bottom:1.5rem; text-align:start;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.weight[lang]}</label>
                    <input type="number" id="wat-w" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="70">
                </div>
                <div style="margin-bottom:1.5rem; text-align:start;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.exercise[lang]}</label>
                    <input type="number" id="wat-e" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="30" value="0">
                </div>
                <button class="primary-btn" id="wat-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="wat-res" style="margin-top:1.5rem; padding:1.5rem; border-radius:8px; background:var(--bg-color); text-align:center; display:none; border:1px solid var(--border-color);">
                    <div style="color:var(--text-secondary); margin-bottom:0.5rem;">${strings.resDesc[lang]}</div>
                    <div style="font-size:2.5rem; font-weight:bold; color:#0ea5e9; margin-bottom:0.5rem;" id="wat-val"></div>
                    <div style="color:var(--text-secondary); font-weight:bold;" id="wat-cups"></div>
                </div>
            </div>
        `;

        const btn = container.querySelector('#wat-btn');
        btn.addEventListener('click', () => {
            const w = parseFloat(container.querySelector('#wat-w').value);
            const e = parseFloat(container.querySelector('#wat-e').value) || 0;
            
            if(!w) return;
            
            // Formula: Weight * 0.033 + (Exercise mins / 30) * 0.35
            const liters = (w * 0.033) + (e / 30 * 0.35);
            const cups = Math.round(liters * 1000 / 250);
            
            container.querySelector('#wat-val').textContent = liters.toFixed(1) + ' ' + strings.liter[lang];
            container.querySelector('#wat-cups').textContent = `(~ ${cups} ${strings.cups[lang]})`;
            container.querySelector('#wat-res').style.display = 'block';
        });
    }
});
