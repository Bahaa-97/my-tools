window.ToolApp.register('time-diff', {
    meta_desc: { ar: 'حساب المدة الدقيقة بين تاريخين بالأيام والشهور والسنوات.', en: 'Calculate exact duration between two dates in days, months, and years.' },
    keywords: { ar: ['تاريخ', 'فرق', 'مدة', 'أيام', 'عمر'], en: ['date', 'difference', 'duration', 'days', 'age'] },
    features: { ar: ['حساب دقيق للعمر', 'إظهار إجمالي الأيام'], en: ['Accurate age calc', 'Show total days'] },
    render: function(container, lang) {
        const strings = {
            d1: { ar: 'التاريخ الأول (البداية)', en: 'First Date (Start)' },
            d2: { ar: 'التاريخ الثاني (النهاية)', en: 'Second Date (End)' },
            calc: { ar: 'احسب الفرق', en: 'Calculate Difference' },
            res: { ar: 'المدة بين التاريخين:', en: 'Duration between dates:' },
            y: { ar: 'سنوات', en: 'Years' },
            m: { ar: 'أشهر', en: 'Months' },
            d: { ar: 'أيام', en: 'Days' },
            total: { ar: 'إجمالي الأيام:', en: 'Total Days:' }
        };

        container.innerHTML = `
            <style>
                .td-wrap { max-width: 500px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .td-row { margin-bottom: 1.5rem; text-align: start; }
                .td-label { display: block; margin-bottom: 0.5rem; font-weight: bold; color: var(--text-secondary); }
                .td-inp { width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; }
                .td-res { margin-top: 1.5rem; background: var(--bg-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); display: none; }
                .td-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center; margin-bottom: 1.5rem; }
                .td-box { background: var(--surface-color); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); }
                .td-val { font-size: 2rem; font-weight: bold; color: var(--accent-color); }
                .td-unit { font-size: 0.9rem; color: var(--text-secondary); }
            </style>
            
            <div class="td-wrap">
                <div class="td-row">
                    <label class="td-label">${strings.d1[lang]}</label>
                    <input type="date" id="td-d1" class="td-inp">
                </div>
                <div class="td-row">
                    <label class="td-label">${strings.d2[lang]}</label>
                    <input type="date" id="td-d2" class="td-inp">
                </div>
                <button id="td-btn" class="primary-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="td-res" class="td-res">
                    <div style="text-align:center; margin-bottom:1rem; font-weight:bold;">${strings.res[lang]}</div>
                    <div class="td-grid">
                        <div class="td-box">
                            <div id="r-y" class="td-val">0</div>
                            <div class="td-unit">${strings.y[lang]}</div>
                        </div>
                        <div class="td-box">
                            <div id="r-m" class="td-val">0</div>
                            <div class="td-unit">${strings.m[lang]}</div>
                        </div>
                        <div class="td-box">
                            <div id="r-d" class="td-val">0</div>
                            <div class="td-unit">${strings.d[lang]}</div>
                        </div>
                    </div>
                    <div style="text-align:center; color:var(--text-secondary);">
                        ${strings.total[lang]} <span id="r-tot" style="font-weight:bold; color:var(--text-primary);">0</span>
                    </div>
                </div>
            </div>
        `;

        // Default to today and a month ago
        const today = new Date();
        const past = new Date(today);
        past.setMonth(past.getMonth() - 1);
        
        container.querySelector('#td-d1').value = past.toISOString().split('T')[0];
        container.querySelector('#td-d2').value = today.toISOString().split('T')[0];

        container.querySelector('#td-btn').addEventListener('click', () => {
            const val1 = container.querySelector('#td-d1').value;
            const val2 = container.querySelector('#td-d2').value;
            
            if(!val1 || !val2) return;
            
            let d1 = new Date(val1);
            let d2 = new Date(val2);
            
            if(d1 > d2) {
                // swap
                const temp = d1;
                d1 = d2;
                d2 = temp;
            }
            
            const diffTime = Math.abs(d2 - d1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Calc Years, Months, Days
            let y = d2.getFullYear() - d1.getFullYear();
            let m = d2.getMonth() - d1.getMonth();
            let d = d2.getDate() - d1.getDate();
            
            if(d < 0) {
                m--;
                const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
                d += prevMonth;
            }
            
            if(m < 0) {
                y--;
                m += 12;
            }
            
            container.querySelector('#r-y').textContent = y;
            container.querySelector('#r-m').textContent = m;
            container.querySelector('#r-d').textContent = d;
            container.querySelector('#r-tot').textContent = diffDays.toLocaleString();
            
            container.querySelector('#td-res').style.display = 'block';
        });
    }
});
