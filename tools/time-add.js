window.ToolApp.register('time-add', {
    meta_desc: { ar: 'حساب التاريخ المستقبلي أو الماضي بعد إضافة أو طرح أيام معينة.', en: 'Calculate future or past dates by adding/subtracting days.' },
    keywords: { ar: ['تاريخ', 'إضافة', 'طرح', 'أيام', 'مستقبل'], en: ['date', 'add', 'subtract', 'days', 'future'] },
    features: { ar: ['عمليات مرنة على التواريخ', 'يدعم الطرح والإضافة'], en: ['Flexible date operations', 'Supports add & subtract'] },
    render: function(container, lang) {
        const strings = {
            date: { ar: 'تاريخ البداية', en: 'Start Date' },
            op: { ar: 'العملية', en: 'Operation' },
            add: { ar: 'إضافة (+)', en: 'Add (+)' },
            sub: { ar: 'طرح (-)', en: 'Subtract (-)' },
            amt: { ar: 'عدد الأيام', en: 'Number of Days' },
            calc: { ar: 'احسب التاريخ', en: 'Calculate Date' },
            res: { ar: 'التاريخ الناتج:', en: 'Resulting Date:' }
        };

        container.innerHTML = `
            <style>
                .ta-wrap { max-width: 500px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .ta-row { margin-bottom: 1.5rem; text-align: start; }
                .ta-label { display: block; margin-bottom: 0.5rem; font-weight: bold; color: var(--text-secondary); }
                .ta-inp { width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; }
                .ta-res { margin-top: 1.5rem; background: var(--bg-color); padding: 2rem; border-radius: 12px; border: 2px dashed var(--accent-color); text-align: center; display: none; }
                .ta-val { font-size: 1.8rem; font-weight: bold; color: var(--accent-color); }
            </style>
            
            <div class="ta-wrap">
                <div class="ta-row">
                    <label class="ta-label">${strings.date[lang]}</label>
                    <input type="date" id="ta-date" class="ta-inp">
                </div>
                
                <div style="display:flex; gap:1rem; margin-bottom:1.5rem;">
                    <div style="flex:1;">
                        <label class="ta-label">${strings.op[lang]}</label>
                        <select id="ta-op" class="ta-inp">
                            <option value="add">${strings.add[lang]}</option>
                            <option value="sub">${strings.sub[lang]}</option>
                        </select>
                    </div>
                    <div style="flex:1;">
                        <label class="ta-label">${strings.amt[lang]}</label>
                        <input type="number" id="ta-amt" class="ta-inp" placeholder="30">
                    </div>
                </div>
                
                <button id="ta-btn" class="primary-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="ta-res" class="ta-res">
                    <div class="ta-label">${strings.res[lang]}</div>
                    <div id="r-date" class="ta-val"></div>
                </div>
            </div>
        `;

        container.querySelector('#ta-date').value = new Date().toISOString().split('T')[0];

        container.querySelector('#ta-btn').addEventListener('click', () => {
            const dVal = container.querySelector('#ta-date').value;
            const op = container.querySelector('#ta-op').value;
            const amt = parseInt(container.querySelector('#ta-amt').value);
            
            if(!dVal || isNaN(amt)) return;
            
            const date = new Date(dVal);
            
            if(op === 'add') {
                date.setDate(date.getDate() + amt);
            } else {
                date.setDate(date.getDate() - amt);
            }
            
            const fmt = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'full' });
            
            container.querySelector('#r-date').textContent = fmt.format(date);
            container.querySelector('#ta-res').style.display = 'block';
        });
    }
});
