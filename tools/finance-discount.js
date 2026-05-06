window.ToolApp.register('finance-discount', {
    meta_desc: { ar: 'حساب السعر النهائي بعد الخصم وإضافة ضريبة القيمة المضافة.', en: 'Calculate final price after discount and adding VAT.' },
    keywords: { ar: ['خصم', 'ضريبة', 'تخفيض', 'تسوق', 'سعر'], en: ['discount', 'tax', 'vat', 'sale', 'price'] },
    features: { ar: ['حساب الضريبة والخصم معاً', 'توفير الوقت للمتسوقين'], en: ['Combines discount & tax', 'Saves time for shoppers'] },
    render: function(container, lang) {
        const strings = {
            price: { ar: 'السعر الأصلي', en: 'Original Price' },
            disc: { ar: 'نسبة الخصم (%)', en: 'Discount (%)' },
            tax: { ar: 'ضريبة القيمة المضافة (%)', en: 'VAT / Tax (%)' },
            calc: { ar: 'احسب السعر النهائي', en: 'Calculate Final Price' },
            saved: { ar: 'لقد وفرت:', en: 'You saved:' },
            final: { ar: 'السعر النهائي المكتوب على الفاتورة:', en: 'Final Price to Pay:' }
        };

        container.innerHTML = `
            <div style="max-width:400px; margin:0 auto; background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                <div style="margin-bottom:1.5rem; text-align:start;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.price[lang]}</label>
                    <input type="number" id="d-price" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="100">
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem; text-align:start;">
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:#ef4444;">${strings.disc[lang]}</label>
                        <input type="number" id="d-disc" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="20">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.tax[lang]}</label>
                        <input type="number" id="d-tax" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;" placeholder="15">
                    </div>
                </div>
                <button class="primary-btn" id="d-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="d-res" style="margin-top:1.5rem; background:var(--bg-color); padding:1.5rem; border-radius:12px; border:1px solid var(--border-color); display:none; text-align:center;">
                    <div style="color:#10b981; margin-bottom:0.5rem; font-weight:bold;">${strings.saved[lang]} <span id="r-saved">0</span></div>
                    <div style="color:var(--text-secondary); margin-bottom:0.5rem; margin-top:1rem;">${strings.final[lang]}</div>
                    <div id="r-fin" style="font-size:3rem; font-weight:bold; color:var(--accent-color);">0</div>
                </div>
            </div>
        `;

        const btn = container.querySelector('#d-btn');
        btn.addEventListener('click', () => {
            const price = parseFloat(container.querySelector('#d-price').value);
            const disc = parseFloat(container.querySelector('#d-disc').value) || 0;
            const tax = parseFloat(container.querySelector('#d-tax').value) || 0;
            
            if(!price) return;
            
            // Apply discount first
            const discountAmt = price * (disc / 100);
            const priceAfterDisc = price - discountAmt;
            
            // Then apply tax
            const taxAmt = priceAfterDisc * (tax / 100);
            const finalPrice = priceAfterDisc + taxAmt;
            
            container.querySelector('#r-saved').textContent = discountAmt.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
            container.querySelector('#r-fin').textContent = finalPrice.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
            container.querySelector('#d-res').style.display = 'block';
        });
    }
});
