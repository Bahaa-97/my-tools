window.ToolApp.register('time-workdays', {
    meta_desc: { ar: 'حساب أيام العمل الفعلية بين تاريخين مع استبعاد عطلات نهاية الأسبوع.', en: 'Calculate actual working days between two dates excluding weekends.' },
    keywords: { ar: ['عمل', 'أيام', 'عطلة', 'نهاية أسبوع', 'حاسبة'], en: ['work', 'days', 'weekend', 'business days'] },
    features: { ar: ['استبعاد السبت والأحد (أو الجمعة)', 'حساب دقيق للموظفين'], en: ['Exclude weekends', 'Accurate for employees'] },
    render: function(container, lang) {
        const strings = {
            d1: { ar: 'تاريخ البداية', en: 'Start Date' },
            d2: { ar: 'تاريخ النهاية', en: 'End Date' },
            we: { ar: 'عطلة نهاية الأسبوع', en: 'Weekend Days' },
            we_fs: { ar: 'الجمعة والسبت', en: 'Friday & Saturday' },
            we_ss: { ar: 'السبت والأحد', en: 'Saturday & Sunday' },
            calc: { ar: 'احسب أيام العمل', en: 'Calculate Working Days' },
            res: { ar: 'إجمالي أيام العمل:', en: 'Total Working Days:' },
            holidays: { ar: 'عطلات مرصودة:', en: 'Weekends excluded:' }
        };

        container.innerHTML = `
            <style>
                .tw-wrap { max-width: 500px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .tw-row { margin-bottom: 1.5rem; text-align: start; }
                .tw-label { display: block; margin-bottom: 0.5rem; font-weight: bold; color: var(--text-secondary); }
                .tw-inp { width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; }
                .tw-res { margin-top: 1.5rem; background: var(--bg-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); text-align: center; display: none; }
            </style>
            
            <div class="tw-wrap">
                <div class="tw-row">
                    <label class="tw-label">${strings.d1[lang]}</label>
                    <input type="date" id="tw-d1" class="tw-inp">
                </div>
                <div class="tw-row">
                    <label class="tw-label">${strings.d2[lang]}</label>
                    <input type="date" id="tw-d2" class="tw-inp">
                </div>
                <div class="tw-row">
                    <label class="tw-label">${strings.we[lang]}</label>
                    <select id="tw-we" class="tw-inp">
                        <option value="5,6">${strings.we_fs[lang]}</option>
                        <option value="6,0">${strings.we_ss[lang]}</option>
                    </select>
                </div>
                
                <button id="tw-btn" class="primary-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="tw-res" class="tw-res">
                    <div class="tw-label">${strings.res[lang]}</div>
                    <div id="r-work" style="font-size:3rem; font-weight:bold; color:#10b981; margin-bottom:0.5rem;">0</div>
                    <div style="font-size:0.9rem; color:var(--text-secondary);">${strings.holidays[lang]} <span id="r-hol" style="font-weight:bold; color:#ef4444;">0</span></div>
                </div>
            </div>
        `;

        container.querySelector('#tw-btn').addEventListener('click', () => {
            const d1Val = container.querySelector('#tw-d1').value;
            const d2Val = container.querySelector('#tw-d2').value;
            const weVal = container.querySelector('#tw-we').value.split(',').map(Number); // e.g. [5,6] or [6,0]
            
            if(!d1Val || !d2Val) return;
            
            let d1 = new Date(d1Val);
            let d2 = new Date(d2Val);
            
            if(d1 > d2) {
                const temp = d1;
                d1 = d2;
                d2 = temp;
            }
            
            let workDays = 0;
            let weekends = 0;
            
            let curr = new Date(d1);
            while(curr <= d2) {
                const day = curr.getDay(); // 0 = Sun, 1 = Mon ... 5 = Fri, 6 = Sat
                if(weVal.includes(day)) {
                    weekends++;
                } else {
                    workDays++;
                }
                curr.setDate(curr.getDate() + 1);
            }
            
            container.querySelector('#r-work').textContent = workDays;
            container.querySelector('#r-hol').textContent = weekends;
            container.querySelector('#tw-res').style.display = 'block';
        });
    }
});
