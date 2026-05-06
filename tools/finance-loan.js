window.ToolApp.register('finance-loan', {
    meta_desc: { ar: 'حساب القسط الشهري للقرض وإجمالي الفوائد المستحقة بدقة.', en: 'Calculate monthly loan EMI and total interest payable.' },
    keywords: { ar: ['قرض', 'قسط', 'فائدة', 'تمويل', 'عقاري'], en: ['loan', 'emi', 'mortgage', 'interest', 'finance'] },
    features: { ar: ['حساب دقيق للأقساط', 'إظهار إجمالي الفوائد'], en: ['Accurate EMI calculation', 'Show total interest'] },
    render: function(container, lang) {
        const strings = {
            amt: { ar: 'مبلغ القرض', en: 'Loan Amount' },
            rate: { ar: 'نسبة الفائدة السنوية (%)', en: 'Annual Interest Rate (%)' },
            yrs: { ar: 'مدة السداد (بالسنوات)', en: 'Loan Term (Years)' },
            calc: { ar: 'احسب القسط', en: 'Calculate EMI' },
            emi: { ar: 'القسط الشهري:', en: 'Monthly Payment (EMI):' },
            totInt: { ar: 'إجمالي الفوائد:', en: 'Total Interest Payable:' },
            totAmt: { ar: 'إجمالي المبلغ المسدد:', en: 'Total Amount Payable:' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                <div style="margin-bottom:1.5rem; text-align:start;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.amt[lang]}</label>
                    <input type="number" id="l-amt" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="100000">
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; text-align:start;">
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.rate[lang]}</label>
                        <input type="number" id="l-rate" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="5">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.yrs[lang]}</label>
                        <input type="number" id="l-yrs" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="10">
                    </div>
                </div>
                <button class="primary-btn" id="l-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="l-res" style="margin-top:1.5rem; background:var(--bg-color); padding:1.5rem; border-radius:12px; border:1px solid var(--border-color); display:none; text-align:start;">
                    <div style="color:var(--text-secondary); margin-bottom:0.5rem;">${strings.emi[lang]}</div>
                    <div id="r-emi" style="font-size:2.5rem; font-weight:bold; color:#10b981; margin-bottom:1.5rem;">0</div>
                    
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem;">
                        <span style="color:var(--text-secondary);">${strings.totInt[lang]}</span>
                        <span id="r-int" style="font-weight:bold; color:#ef4444;">0</span>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span style="color:var(--text-secondary);">${strings.totAmt[lang]}</span>
                        <span id="r-tot" style="font-weight:bold;">0</span>
                    </div>
                </div>
            </div>
        `;

        const btn = container.querySelector('#l-btn');
        btn.addEventListener('click', () => {
            const p = parseFloat(container.querySelector('#l-amt').value);
            const rate = parseFloat(container.querySelector('#l-rate').value);
            const yrs = parseFloat(container.querySelector('#l-yrs').value);
            
            if(!p || !yrs) return;
            
            let emi = 0;
            let total = 0;
            let totalInt = 0;

            if(rate === 0 || isNaN(rate)) {
                total = p;
                emi = p / (yrs * 12);
                totalInt = 0;
            } else {
                const r = (rate / 100) / 12; // Monthly rate
                const n = yrs * 12; // Total months
                
                // EMI formula
                emi = p * r * (Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                total = emi * n;
                totalInt = total - p;
            }
            
            container.querySelector('#r-emi').textContent = emi.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
            container.querySelector('#r-int').textContent = totalInt.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
            container.querySelector('#r-tot').textContent = total.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
            container.querySelector('#l-res').style.display = 'block';
        });
    }
});
