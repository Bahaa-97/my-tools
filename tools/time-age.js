window.ToolApp.register('time-age', {
    meta_desc: { ar: 'معرفة عمرك بدقة متناهية والوقت المتبقي لعيد ميلادك القادم بالدقائق والثواني.', en: 'Know your exact age and time until next birthday in minutes and seconds.' },
    keywords: { ar: ['عمر', 'حاسبة العمر', 'ميلاد', 'تفصيلي', 'سنوات'], en: ['age', 'calculator', 'birthday', 'detailed'] },
    features: { ar: ['تفاصيل دقيقة للعمر', 'عد تنازلي للميلاد القادم'], en: ['Detailed age facts', 'Next birthday countdown'] },
    render: function(container, lang) {
        const strings = {
            dob: { ar: 'تاريخ وسنة الميلاد', en: 'Date of Birth' },
            calc: { ar: 'احسب العمر', en: 'Calculate Age' },
            age: { ar: 'عمرك بالضبط هو:', en: 'Your exact age is:' },
            y: { ar: 'سنة', en: 'Years' },
            m: { ar: 'شهر', en: 'Months' },
            d: { ar: 'يوم', en: 'Days' },
            next: { ar: 'عيد ميلادك القادم بعد:', en: 'Your next birthday is in:' },
            facts: { ar: 'حقائق ممتعة:', en: 'Fun Facts:' },
            totalDays: { ar: 'عشت (بالأيام):', en: 'Total days lived:' },
            totalWeeks: { ar: 'عشت (بالأسابيع):', en: 'Total weeks lived:' }
        };

        container.innerHTML = `
            <style>
                .ag-wrap { max-width: 600px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .ag-row { margin-bottom: 1.5rem; text-align: start; }
                .ag-label { display: block; margin-bottom: 0.5rem; font-weight: bold; color: var(--text-secondary); }
                .ag-inp { width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; }
                .ag-res { margin-top: 1.5rem; display: none; }
                .ag-main { background: var(--bg-color); padding: 1.5rem; border-radius: 12px; border: 2px solid var(--accent-color); text-align: center; margin-bottom: 1rem; }
                .ag-val { font-size: 2.5rem; font-weight: bold; color: var(--accent-color); }
                .ag-sub { color: var(--text-secondary); font-size: 1.1rem; }
                .ag-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .ag-box { background: var(--bg-color); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); text-align: center; }
                .ag-box-title { font-size: 0.85rem; color: var(--text-secondary); font-weight: bold; margin-bottom: 0.5rem; }
                .ag-box-val { font-size: 1.25rem; font-weight: bold; color: var(--text-primary); }
            </style>
            
            <div class="ag-wrap">
                <div class="ag-row">
                    <label class="ag-label">${strings.dob[lang]}</label>
                    <input type="date" id="ag-dob" class="ag-inp">
                </div>
                <button id="ag-btn" class="primary-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="ag-res" class="ag-res">
                    <div class="ag-main">
                        <div class="ag-label">${strings.age[lang]}</div>
                        <div id="r-age" class="ag-val"></div>
                        <div id="r-sub" class="ag-sub"></div>
                    </div>
                    
                    <div class="ag-grid">
                        <div class="ag-box">
                            <div class="ag-box-title" style="color:#ef4444;">${strings.next[lang]}</div>
                            <div id="r-next" class="ag-box-val"></div>
                        </div>
                        <div class="ag-box">
                            <div class="ag-box-title">${strings.facts[lang]}</div>
                            <div style="font-size:0.9rem; color:var(--text-primary);">
                                <div>${strings.totalDays[lang]} <span id="r-tdays" style="font-weight:bold;"></span></div>
                                <div>${strings.totalWeeks[lang]} <span id="r-tweeks" style="font-weight:bold;"></span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const btn = container.querySelector('#ag-btn');
        btn.addEventListener('click', () => {
            const dobVal = container.querySelector('#ag-dob').value;
            if(!dobVal) return;
            
            const dob = new Date(dobVal);
            const now = new Date();
            
            if(dob > now) return alert('Invalid Date');

            // Exact age Y/M/D
            let y = now.getFullYear() - dob.getFullYear();
            let m = now.getMonth() - dob.getMonth();
            let d = now.getDate() - dob.getDate();
            
            if(d < 0) {
                m--;
                d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            }
            if(m < 0) {
                y--;
                m += 12;
            }
            
            const ageStr = `${y} ${strings.y[lang]}, ${m} ${strings.m[lang]}, ${d} ${strings.d[lang]}`;
            
            // Next Birthday
            let nextBday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
            if(now > nextBday) {
                nextBday.setFullYear(now.getFullYear() + 1);
            }
            const diffNext = Math.ceil((nextBday - now) / (1000 * 60 * 60 * 24));
            
            // Facts
            const totalDays = Math.floor((now - dob) / (1000 * 60 * 60 * 24));
            const totalWeeks = Math.floor(totalDays / 7);
            
            container.querySelector('#r-age').textContent = y;
            container.querySelector('#r-sub').textContent = `${strings.y[lang]} (${m} ${strings.m[lang]}, ${d} ${strings.d[lang]})`;
            
            container.querySelector('#r-next').textContent = `${diffNext} ${strings.d[lang]}`;
            container.querySelector('#r-tdays').textContent = totalDays.toLocaleString();
            container.querySelector('#r-tweeks').textContent = totalWeeks.toLocaleString();
            
            container.querySelector('#ag-res').style.display = 'block';
        });
    }
});
