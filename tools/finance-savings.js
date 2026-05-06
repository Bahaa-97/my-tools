window.ToolApp.register('finance-savings', {
    meta_desc: { ar: 'حساب العوائد المستقبلية لمدخراتك مع الفائدة المركبة.', en: 'Calculate future returns on your savings with compound interest.' },
    keywords: { ar: ['ادخار', 'فائدة', 'مركبة', 'عوائد', 'استثمار'], en: ['savings', 'compound', 'interest', 'investment'] },
    features: { ar: ['حساب الفائدة المركبة', 'دعم المساهمة الشهرية'], en: ['Compound interest calculation', 'Monthly contribution support'] },
    render: function(container, lang) {
        const strings = {
            init: { ar: 'المبلغ المبدئي', en: 'Initial Amount' },
            pmt: { ar: 'المساهمة الشهرية الإضافية', en: 'Monthly Contribution' },
            rate: { ar: 'معدل العائد السنوي (%)', en: 'Annual Interest Rate (%)' },
            yrs: { ar: 'عدد السنوات', en: 'Years to Grow' },
            calc: { ar: 'احسب العوائد', en: 'Calculate Returns' },
            final: { ar: 'المبلغ النهائي:', en: 'Final Amount:' },
            dep: { ar: 'إجمالي ما أودعته:', en: 'Total Deposited:' },
            int: { ar: 'إجمالي الأرباح:', en: 'Total Interest Earned:' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; text-align:start;">
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.init[lang]}</label>
                        <input type="number" id="s-init" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="1000">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.pmt[lang]}</label>
                        <input type="number" id="s-pmt" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="100">
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem; text-align:start;">
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.rate[lang]}</label>
                        <input type="number" id="s-rate" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="5">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.yrs[lang]}</label>
                        <input type="number" id="s-yrs" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="10">
                    </div>
                </div>
                <button class="primary-btn" id="s-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="s-res" style="margin-top:1.5rem; background:var(--bg-color); padding:1.5rem; border-radius:8px; border:1px solid var(--border-color); display:none; text-align:start;">
                    <div style="color:var(--text-secondary); margin-bottom:0.5rem;">${strings.final[lang]}</div>
                    <div id="r-fin" style="font-size:2.5rem; font-weight:bold; color:var(--accent-color); margin-bottom:1rem;">0</div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.9rem;">
                        <span>${strings.dep[lang]}</span>
                        <span id="r-dep" style="font-weight:bold;">0</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                        <span>${strings.int[lang]}</span>
                        <span id="r-int" style="font-weight:bold; color:#10b981;">0</span>
                    </div>
                </div>
            </div>
        `;

        const btn = container.querySelector('#s-btn');
        btn.addEventListener('click', () => {
            const P = parseFloat(container.querySelector('#s-init').value) || 0;
            const PMT = parseFloat(container.querySelector('#s-pmt').value) || 0;
            const r = (parseFloat(container.querySelector('#s-rate').value) || 0) / 100;
            const t = parseFloat(container.querySelector('#s-yrs').value) || 0;
            const n = 12; // monthly compounding
            
            if(!P && !PMT) return;
            if(!t) return;
            
            // Compound Interest Formula
            let A = P * Math.pow(1 + r/n, n*t);
            if(r > 0) {
                A += PMT * ((Math.pow(1 + r/n, n*t) - 1) / (r/n));
            } else {
                A += PMT * (n * t);
            }
            
            const totalDep = P + (PMT * n * t);
            const totalInt = Math.max(0, A - totalDep);
            
            container.querySelector('#r-fin').textContent = A.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
            container.querySelector('#r-dep').textContent = totalDep.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
            container.querySelector('#r-int').textContent = totalInt.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
            container.querySelector('#s-res').style.display = 'block';
        });
    }
});
