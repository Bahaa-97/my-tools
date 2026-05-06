window.ToolApp.register('finance-inflation', {
    meta_desc: { ar: 'حساب القوة الشرائية وتأثير التضخم على مدخراتك في المستقبل.', en: 'Calculate purchasing power and inflation impact on savings.' },
    keywords: { ar: ['تضخم', 'أموال', 'قوة شرائية', 'استثمار'], en: ['inflation', 'purchasing power', 'money', 'value'] },
    features: { ar: ['توضيح فقدان القيمة', 'توعية استثمارية'], en: ['Value loss illustration', 'Investment awareness'] },
    render: function(container, lang) {
        const strings = {
            amt: { ar: 'المبلغ الحالي', en: 'Current Amount' },
            rate: { ar: 'نسبة التضخم السنوية المتوقعة (%)', en: 'Expected Annual Inflation (%)' },
            yrs: { ar: 'عدد السنوات', en: 'Years from now' },
            calc: { ar: 'احسب القوة الشرائية', en: 'Calculate Purchasing Power' },
            desc: { ar: 'سيصبح هذا المبلغ بعد هذه السنوات يعادل قيمته اليوم:', en: 'After these years, this amount will have the purchasing power of:' },
            lost: { ar: 'القيمة المفقودة بسبب التضخم:', en: 'Value lost due to inflation:' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                <div style="margin-bottom:1.5rem; text-align:start;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.amt[lang]}</label>
                    <input type="number" id="i-amt" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="10000">
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; text-align:start;">
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:#ef4444;">${strings.rate[lang]}</label>
                        <input type="number" id="i-rate" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="3">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.yrs[lang]}</label>
                        <input type="number" id="i-yrs" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="10">
                    </div>
                </div>
                <button class="primary-btn" id="i-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="i-res" style="margin-top:1.5rem; background:var(--bg-color); padding:1.5rem; border-radius:12px; border:1px solid var(--border-color); display:none; text-align:center;">
                    <div style="color:var(--text-secondary); margin-bottom:0.5rem;">${strings.desc[lang]}</div>
                    <div id="r-pow" style="font-size:3rem; font-weight:bold; color:var(--accent-color); margin-bottom:1rem;">0</div>
                    <div style="display:flex; justify-content:space-between; color:#ef4444; font-size:0.9rem;">
                        <span>${strings.lost[lang]}</span>
                        <span id="r-lost" style="font-weight:bold;">0</span>
                    </div>
                </div>
            </div>
        `;

        const btn = container.querySelector('#i-btn');
        btn.addEventListener('click', () => {
            const amt = parseFloat(container.querySelector('#i-amt').value);
            const rate = (parseFloat(container.querySelector('#i-rate').value) || 0) / 100;
            const yrs = parseFloat(container.querySelector('#i-yrs').value) || 0;
            
            if(!amt) return;
            
            // Formula: Future Value = Present Value / (1 + i)^n
            const futurePower = amt / Math.pow(1 + rate, yrs);
            const lostValue = amt - futurePower;
            
            container.querySelector('#r-pow').textContent = futurePower.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
            container.querySelector('#r-lost').textContent = lostValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
            container.querySelector('#i-res').style.display = 'block';
        });
    }
});
