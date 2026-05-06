window.ToolApp.register('finance-salary', {
    meta_desc: { ar: 'تحويل الراتب بين أجر سنوي، شهري، أسبوعي، ويومي أو بالساعة.', en: 'Convert salary between annual, monthly, weekly, daily, or hourly rates.' },
    keywords: { ar: ['راتب', 'أجر', 'محول', 'ساعة', 'شهري'], en: ['salary', 'wage', 'converter', 'hourly'] },
    features: { ar: ['تحويل فوري لكل الفترات', 'تخصيص ساعات العمل'], en: ['Instant conversion', 'Custom work hours'] },
    render: function(container, lang) {
        const strings = {
            amt: { ar: 'المبلغ', en: 'Amount' },
            per: { ar: 'يُدفع لكل', en: 'Paid Per' },
            yr: { ar: 'سنة', en: 'Year' },
            mo: { ar: 'شهر', en: 'Month' },
            wk: { ar: 'أسبوع', en: 'Week' },
            dy: { ar: 'يوم', en: 'Day' },
            hr: { ar: 'ساعة', en: 'Hour' },
            hw: { ar: 'ساعات العمل/أسبوع', en: 'Hours/Week' },
            dw: { ar: 'أيام العمل/أسبوع', en: 'Days/Week' },
            calc: { ar: 'تحويل', en: 'Convert' }
        };

        container.innerHTML = `
            <div style="max-width:600px; margin:0 auto; background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                <div style="display:grid; grid-template-columns:2fr 1fr; gap:1rem; margin-bottom:1.5rem; text-align:start;">
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.amt[lang]}</label>
                        <input type="number" id="s-amt" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="5000">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.per[lang]}</label>
                        <select id="s-per" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;">
                            <option value="mo">${strings.mo[lang]}</option>
                            <option value="yr">${strings.yr[lang]}</option>
                            <option value="wk">${strings.wk[lang]}</option>
                            <option value="dy">${strings.dy[lang]}</option>
                            <option value="hr">${strings.hr[lang]}</option>
                        </select>
                    </div>
                </div>
                
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; text-align:start; padding-top:1rem; border-top:1px dashed var(--border-color);">
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.hw[lang]}</label>
                        <input type="number" id="s-hw" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" value="40">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.dw[lang]}</label>
                        <input type="number" id="s-dw" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" value="5">
                    </div>
                </div>
                
                <button class="primary-btn" id="s-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="s-res" style="margin-top:1.5rem; display:none; flex-direction:column; gap:0.5rem;"></div>
            </div>
        `;

        const btn = container.querySelector('#s-btn');
        btn.addEventListener('click', () => {
            const amt = parseFloat(container.querySelector('#s-amt').value);
            const per = container.querySelector('#s-per').value;
            const hw = parseFloat(container.querySelector('#s-hw').value) || 40;
            const dw = parseFloat(container.querySelector('#s-dw').value) || 5;
            
            if(!amt) return;
            
            const weeksPerYear = 52.1429;
            const hoursPerDay = hw / dw;
            
            // First, convert everything to Yearly
            let yearly = 0;
            if(per === 'yr') yearly = amt;
            else if(per === 'mo') yearly = amt * 12;
            else if(per === 'wk') yearly = amt * weeksPerYear;
            else if(per === 'dy') yearly = amt * dw * weeksPerYear;
            else if(per === 'hr') yearly = amt * hw * weeksPerYear;
            
            const monthly = yearly / 12;
            const weekly = yearly / weeksPerYear;
            const daily = weekly / dw;
            const hourly = weekly / hw;
            
            const res = [
                { k: strings.yr[lang], v: yearly },
                { k: strings.mo[lang], v: monthly },
                { k: strings.wk[lang], v: weekly },
                { k: strings.dy[lang], v: daily },
                { k: strings.hr[lang], v: hourly }
            ];
            
            const resDiv = container.querySelector('#s-res');
            resDiv.innerHTML = '';
            
            res.forEach(item => {
                resDiv.innerHTML += `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-color); padding:1rem; border-radius:8px; border:1px solid var(--border-color);">
                        <span style="font-weight:bold; color:var(--text-secondary);">${strings.per[lang]} ${item.k}</span>
                        <span style="font-size:1.25rem; font-weight:bold; color:var(--text-primary);">${item.v.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                    </div>
                `;
            });
            
            resDiv.style.display = 'flex';
        });
    }
});
