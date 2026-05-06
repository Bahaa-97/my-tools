window.ToolApp.register('finance-tax', {
    meta_desc: { ar: 'حساب صافي الدخل بعد خصم الضرائب والخصومات.', en: 'Calculate net income after taxes and deductions.' },
    keywords: { ar: ['ضريبة', 'دخل', 'راتب', 'صافي'], en: ['tax', 'income', 'salary', 'net'] },
    features: { ar: ['حساب سريع', 'دعم الخصومات الإضافية'], en: ['Fast calculation', 'Supports deductions'] },
    render: function(container, lang) {
        const strings = {
            gross: { ar: 'الدخل الإجمالي (قبل الضريبة)', en: 'Gross Income (Before Tax)' },
            rate: { ar: 'نسبة الضريبة المئوية (%)', en: 'Tax Rate (%)' },
            deduct: { ar: 'خصومات أخرى (إختياري)', en: 'Other Deductions (Optional)' },
            calc: { ar: 'احسب صافي الدخل', en: 'Calculate Net Income' },
            resTitle: { ar: 'تفاصيل الحساب:', en: 'Calculation Details:' },
            net: { ar: 'صافي الدخل:', en: 'Net Income:' },
            taxAmt: { ar: 'مبلغ الضريبة المخصوم:', en: 'Tax Amount Deducted:' }
        };

        container.innerHTML = `
            <div style="max-width:400px; margin:0 auto; background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                <div style="margin-bottom:1.25rem; text-align:start;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.gross[lang]}</label>
                    <input type="number" id="t-gross" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="5000">
                </div>
                <div style="margin-bottom:1.25rem; text-align:start;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.rate[lang]}</label>
                    <input type="number" id="t-rate" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="15">
                </div>
                <div style="margin-bottom:1.5rem; text-align:start;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.deduct[lang]}</label>
                    <input type="number" id="t-deduct" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="0">
                </div>
                <button class="primary-btn" id="t-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="t-res" style="margin-top:1.5rem; background:var(--bg-color); padding:1.5rem; border-radius:8px; border:1px solid var(--border-color); display:none; text-align:start;">
                    <div style="font-weight:bold; color:var(--text-secondary); margin-bottom:1rem;">${strings.resTitle[lang]}</div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                        <span>${strings.taxAmt[lang]}</span>
                        <span id="r-tax" style="color:#ef4444; font-weight:bold;">0</span>
                    </div>
                    <hr style="border:none; border-top:1px solid var(--border-color); margin:1rem 0;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:1.1rem; font-weight:bold;">${strings.net[lang]}</span>
                        <span id="r-net" style="font-size:1.5rem; font-weight:bold; color:#10b981;">0</span>
                    </div>
                </div>
            </div>
        `;

        const btn = container.querySelector('#t-btn');
        btn.addEventListener('click', () => {
            const gross = parseFloat(container.querySelector('#t-gross').value);
            const rate = parseFloat(container.querySelector('#t-rate').value) || 0;
            const deduct = parseFloat(container.querySelector('#t-deduct').value) || 0;
            
            if(!gross) return;
            
            const taxable = gross - deduct;
            const taxAmount = Math.max(0, taxable * (rate / 100));
            const net = gross - deduct - taxAmount;
            
            container.querySelector('#r-tax').textContent = taxAmount.toFixed(2);
            container.querySelector('#r-net').textContent = net.toFixed(2);
            container.querySelector('#t-res').style.display = 'block';
        });
    }
});
