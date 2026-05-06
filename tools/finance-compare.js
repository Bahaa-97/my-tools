window.ToolApp.register('finance-compare', {
    meta_desc: { ar: 'مقارنة أسعار المنتجات لمعرفة العرض الأوفر والأفضل (سعر الوحدة).', en: 'Compare product prices to find the best deal based on unit price.' },
    keywords: { ar: ['مقارنة', 'أسعار', 'منتجات', 'توفير', 'عروض'], en: ['compare', 'prices', 'products', 'deals', 'savings'] },
    features: { ar: ['حساب سعر الوحدة السريع', 'مقارنة دقيقة للتوفير'], en: ['Fast unit price calculation', 'Accurate savings comparison'] },
    render: function(container, lang) {
        const strings = {
            itemA: { ar: 'المنتج (أ)', en: 'Product (A)' },
            itemB: { ar: 'المنتج (ب)', en: 'Product (B)' },
            price: { ar: 'السعر', en: 'Price' },
            qty: { ar: 'الكمية / الحجم (جم، مل، إلخ)', en: 'Quantity / Size' },
            calc: { ar: 'قارن الآن', en: 'Compare Now' },
            winner: { ar: 'هو العرض الأفضل!', en: 'is the better deal!' },
            save: { ar: 'يوفر لك', en: 'Saves you' },
            unit: { ar: 'لكل وحدة', en: 'per unit' },
            equal: { ar: 'العرضان متطابقان في القيمة.', en: 'Both deals have the same value.' }
        };

        container.innerHTML = `
            <div style="max-width:600px; margin:0 auto; background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                    
                    <!-- Item A -->
                    <div style="background:var(--bg-color); padding:1rem; border-radius:12px; border:1px solid var(--border-color);">
                        <h4 style="margin-top:0; color:var(--text-secondary); text-align:center;">${strings.itemA[lang]}</h4>
                        <div style="margin-bottom:1rem;">
                            <label style="display:block; margin-bottom:0.5rem; font-size:0.9rem;">${strings.price[lang]}</label>
                            <input type="number" id="cmp-pa" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--surface-color); color:var(--text-primary); outline:none;" placeholder="15">
                        </div>
                        <div>
                            <label style="display:block; margin-bottom:0.5rem; font-size:0.9rem;">${strings.qty[lang]}</label>
                            <input type="number" id="cmp-qa" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--surface-color); color:var(--text-primary); outline:none;" placeholder="500">
                        </div>
                    </div>

                    <!-- Item B -->
                    <div style="background:var(--bg-color); padding:1rem; border-radius:12px; border:1px solid var(--border-color);">
                        <h4 style="margin-top:0; color:var(--text-secondary); text-align:center;">${strings.itemB[lang]}</h4>
                        <div style="margin-bottom:1rem;">
                            <label style="display:block; margin-bottom:0.5rem; font-size:0.9rem;">${strings.price[lang]}</label>
                            <input type="number" id="cmp-pb" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--surface-color); color:var(--text-primary); outline:none;" placeholder="25">
                        </div>
                        <div>
                            <label style="display:block; margin-bottom:0.5rem; font-size:0.9rem;">${strings.qty[lang]}</label>
                            <input type="number" id="cmp-qb" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--surface-color); color:var(--text-primary); outline:none;" placeholder="1000">
                        </div>
                    </div>
                </div>

                <button class="primary-btn" id="cmp-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="cmp-res" style="margin-top:1.5rem; display:none; text-align:center; padding:1.5rem; border-radius:12px; border:2px solid var(--accent-color); background:rgba(var(--c-rgb, 59, 130, 246), 0.1);">
                    <div id="cmp-win" style="font-size:1.5rem; font-weight:bold; color:var(--accent-color); margin-bottom:0.5rem;"></div>
                    <div id="cmp-det" style="color:var(--text-secondary); font-size:1rem;"></div>
                </div>
            </div>
        `;

        const btn = container.querySelector('#cmp-btn');
        btn.addEventListener('click', () => {
            const pa = parseFloat(container.querySelector('#cmp-pa').value);
            const qa = parseFloat(container.querySelector('#cmp-qa').value);
            const pb = parseFloat(container.querySelector('#cmp-pb').value);
            const qb = parseFloat(container.querySelector('#cmp-qb').value);
            
            if(!pa || !qa || !pb || !qb) return;
            
            const upA = pa / qa; // Unit price A
            const upB = pb / qb; // Unit price B
            
            const resDiv = container.querySelector('#cmp-res');
            const winDiv = container.querySelector('#cmp-win');
            const detDiv = container.querySelector('#cmp-det');
            
            if(Math.abs(upA - upB) < 0.000001) {
                winDiv.textContent = strings.equal[lang];
                winDiv.style.color = 'var(--text-primary)';
                resDiv.style.borderColor = 'var(--border-color)';
                resDiv.style.background = 'var(--bg-color)';
                detDiv.textContent = `${upA.toFixed(4)} ${strings.unit[lang]}`;
            } else if(upA < upB) {
                const diffPct = ((upB - upA) / upB) * 100;
                winDiv.textContent = `${strings.itemA[lang]} ${strings.winner[lang]}`;
                winDiv.style.color = '#10b981';
                resDiv.style.borderColor = '#10b981';
                resDiv.style.background = 'rgba(16, 185, 129, 0.1)';
                detDiv.textContent = `${strings.save[lang]} ${diffPct.toFixed(1)}% (${upA.toFixed(4)} vs ${upB.toFixed(4)} ${strings.unit[lang]})`;
            } else {
                const diffPct = ((upA - upB) / upA) * 100;
                winDiv.textContent = `${strings.itemB[lang]} ${strings.winner[lang]}`;
                winDiv.style.color = '#10b981';
                resDiv.style.borderColor = '#10b981';
                resDiv.style.background = 'rgba(16, 185, 129, 0.1)';
                detDiv.textContent = `${strings.save[lang]} ${diffPct.toFixed(1)}% (${upB.toFixed(4)} vs ${upA.toFixed(4)} ${strings.unit[lang]})`;
            }
            
            resDiv.style.display = 'block';
        });
    }
});
