window.ToolApp.register('health-1rm', {
    meta_desc: { ar: 'حساب أقصى وزن يمكنك رفعه لمرة واحدة (1RM) بدقة.', en: 'Calculate your One Rep Max (1RM) accurately.' },
    keywords: { ar: ['أقصى رفعة', 'جيم', 'حديد', '1rm'], en: ['1rm', 'gym', 'lifting', 'max'] },
    features: { ar: ['معادلة برزيكي المعتمدة', 'جدول النسب المئوية'], en: ['Brzycki formula', 'Percentages table'] },
    render: function(container, lang) {
        const strings = {
            weight: { ar: 'الوزن المرفوع', en: 'Weight Lifted' },
            reps: { ar: 'عدد التكرارات', en: 'Repetitions' },
            calc: { ar: 'احسب 1RM', en: 'Calculate 1RM' },
            resDesc: { ar: 'أقصى وزن لرفعة واحدة (1RM):', en: 'One Rep Max (1RM):' },
            zones: { ar: 'نطاقات التدريب:', en: 'Training Zones:' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem; text-align:start;">
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.weight[lang]}</label>
                        <input type="number" id="rm-w" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="100">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.reps[lang]}</label>
                        <input type="number" id="rm-r" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="5" min="1" max="20">
                    </div>
                </div>
                <button class="primary-btn" id="rm-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="rm-res" style="margin-top:1.5rem; display:none;">
                    <div style="background:var(--bg-color); padding:1.5rem; border-radius:8px; border:1px solid var(--border-color); text-align:center; margin-bottom:1rem;">
                        <div style="color:var(--text-secondary); margin-bottom:0.5rem;">${strings.resDesc[lang]}</div>
                        <div style="font-size:2.5rem; font-weight:bold; color:var(--accent-color);" id="rm-val"></div>
                    </div>
                    <div style="text-align:start;">
                        <div style="font-weight:bold; margin-bottom:0.5rem; color:var(--text-secondary);">${strings.zones[lang]}</div>
                        <div id="rm-list" style="display:flex; flex-direction:column; gap:0.5rem;"></div>
                    </div>
                </div>
            </div>
        `;

        const btn = container.querySelector('#rm-btn');
        btn.addEventListener('click', () => {
            const w = parseFloat(container.querySelector('#rm-w').value);
            const r = parseInt(container.querySelector('#rm-r').value);
            
            if(!w || !r || r < 1) return;
            
            // Brzycki Formula
            let max = w * (36 / (37 - r));
            if(r === 1) max = w; // Exact
            
            container.querySelector('#rm-val').textContent = Math.round(max);
            
            const list = container.querySelector('#rm-list');
            list.innerHTML = '';
            
            const percentages = [95, 90, 85, 80, 75, 70, 65, 60, 50];
            percentages.forEach(p => {
                const weight = Math.round(max * (p / 100));
                list.innerHTML += `
                    <div style="display:flex; justify-content:space-between; background:var(--bg-color); padding:0.5rem 1rem; border-radius:6px; border:1px solid var(--border-color);">
                        <span style="font-weight:bold; color:var(--accent-color);">${p}%</span>
                        <span style="font-weight:bold;">${weight}</span>
                    </div>
                `;
            });
            
            container.querySelector('#rm-res').style.display = 'block';
        });
    }
});
