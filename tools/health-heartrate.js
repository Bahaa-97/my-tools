window.ToolApp.register('health-heartrate', {
    meta_desc: { ar: 'حساب مناطق نبضات القلب المستهدفة أثناء الرياضة لحرق الدهون أو اللياقة.', en: 'Calculate target heart rate zones for fat burn or cardio.' },
    keywords: { ar: ['نبض', 'قلب', 'رياضة', 'حرق'], en: ['heart rate', 'cardio', 'zones', 'burn'] },
    features: { ar: ['معادلة كارفونين الدقيقة', 'تحديد مناطق التدريب'], en: ['Karvonen Formula', 'Training zones mapping'] },
    render: function(container, lang) {
        const strings = {
            age: { ar: 'العمر', en: 'Age' },
            rhr: { ar: 'نبض القلب وقت الراحة (RHR)', en: 'Resting Heart Rate (RHR)' },
            rhrHelp: { ar: 'دقة القلب في الدقيقة عند الاستيقاظ (عادة 60-80)', en: 'Beats per minute upon waking (usually 60-80)' },
            calc: { ar: 'احسب مناطق النبض', en: 'Calculate HR Zones' },
            z1: { ar: 'إحماء خفيف (50-60%)', en: 'Warmup (50-60%)' },
            z2: { ar: 'حرق الدهون (60-70%)', en: 'Fat Burn (60-70%)' },
            z3: { ar: 'كارديو / لياقة (70-80%)', en: 'Cardio / Aerobic (70-80%)' },
            z4: { ar: 'تمرين قاسي (80-90%)', en: 'Hardcore / Anaerobic (80-90%)' },
            z5: { ar: 'الحد الأقصى (90-100%)', en: 'Maximum (90-100%)' },
            bpm: { ar: 'نبضة/د', en: 'bpm' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem; text-align:start;">
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.age[lang]}</label>
                        <input type="number" id="hr-a" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="25">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.2rem; font-weight:bold; color:var(--text-secondary);">${strings.rhr[lang]}</label>
                        <span style="display:block; font-size:0.7rem; color:var(--text-secondary); margin-bottom:0.3rem;">${strings.rhrHelp[lang]}</span>
                        <input type="number" id="hr-r" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="70">
                    </div>
                </div>
                <button class="primary-btn" id="hr-btn" style="width:100%; margin-bottom:1.5rem;">${strings.calc[lang]}</button>
                
                <div id="hr-res" style="display:none; flex-direction:column; gap:0.5rem; text-align:start;"></div>
            </div>
        `;

        const btn = container.querySelector('#hr-btn');
        btn.addEventListener('click', () => {
            const age = parseInt(container.querySelector('#hr-a').value);
            const rhr = parseInt(container.querySelector('#hr-r').value);
            
            if(!age || !rhr) return;
            
            // Karvonen Formula
            const maxHR = 220 - age;
            const hrr = maxHR - rhr;
            
            const calcZone = (minP, maxP) => {
                const min = Math.round((hrr * minP) + rhr);
                const max = Math.round((hrr * maxP) + rhr);
                return `${min} - ${max} ${strings.bpm[lang]}`;
            };

            const zones = [
                { name: strings.z1[lang], range: calcZone(0.5, 0.6), color: '#9ca3af' },
                { name: strings.z2[lang], range: calcZone(0.6, 0.7), color: '#10b981' },
                { name: strings.z3[lang], range: calcZone(0.7, 0.8), color: '#3b82f6' },
                { name: strings.z4[lang], range: calcZone(0.8, 0.9), color: '#f59e0b' },
                { name: strings.z5[lang], range: calcZone(0.9, 1.0), color: '#ef4444' }
            ];

            const resDiv = container.querySelector('#hr-res');
            resDiv.innerHTML = '';
            
            zones.forEach(z => {
                resDiv.innerHTML += `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-color); padding:1rem; border-radius:8px; border-left:4px solid ${z.color}; border-top:1px solid var(--border-color); border-right:1px solid var(--border-color); border-bottom:1px solid var(--border-color);">
                        <span style="font-weight:bold; color:var(--text-primary);">${z.name}</span>
                        <span style="font-weight:bold; color:${z.color};">${z.range}</span>
                    </div>
                `;
            });
            
            resDiv.style.display = 'flex';
        });
    }
});
