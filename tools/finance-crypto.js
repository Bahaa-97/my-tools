window.ToolApp.register('finance-crypto', {
    meta_desc: { ar: 'تحويل ومتابعة أسعار العملات الرقمية مباشرة (يتطلب اتصال بالإنترنت).', en: 'Convert and track live crypto prices (requires internet).' },
    keywords: { ar: ['عملات', 'رقمية', 'بتكوين', 'كريبتو', 'تحويل'], en: ['crypto', 'bitcoin', 'converter', 'prices'] },
    features: { ar: ['أسعار مباشرة (Live)', 'دعم لأهم العملات'], en: ['Live prices via API', 'Top coins supported'] },
    render: function(container, lang) {
        const strings = {
            title: { ar: 'أسعار العملات المباشرة', en: 'Live Crypto Prices' },
            loading: { ar: 'جاري جلب الأسعار...', en: 'Fetching prices...' },
            err: { ar: 'حدث خطأ في الاتصال بالخادم. حاول لاحقاً.', en: 'Error connecting to server. Try again later.' },
            refresh: { ar: 'تحديث الأسعار', en: 'Refresh Prices' },
            convTitle: { ar: 'حاسبة التحويل', en: 'Converter Calculator' },
            amt: { ar: 'المبلغ', en: 'Amount' },
            from: { ar: 'من', en: 'From' },
            to: { ar: 'إلى', en: 'To' },
            calc: { ar: 'تحويل', en: 'Convert' }
        };

        const coins = [
            { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
            { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
            { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
            { id: 'solana', symbol: 'SOL', name: 'Solana' },
            { id: 'ripple', symbol: 'XRP', name: 'XRP' }
        ];
        
        const fiats = ['USD', 'EUR', 'SAR', 'AED'];

        container.innerHTML = `
            <div style="max-width:600px; margin:0 auto; display:flex; flex-direction:column; gap:1.5rem;">
                
                <!-- Live Prices -->
                <div style="background:var(--surface-color); padding:1.5rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                        <h3 style="margin:0;">${strings.title[lang]}</h3>
                        <button id="cr-ref" style="background:transparent; border:none; color:var(--accent-color); cursor:pointer; font-weight:bold;">${strings.refresh[lang]}</button>
                    </div>
                    <div id="cr-status" style="color:var(--text-secondary); text-align:center; padding:2rem;">${strings.loading[lang]}</div>
                    <div id="cr-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:1rem; display:none;"></div>
                </div>

                <!-- Converter -->
                <div style="background:var(--surface-color); padding:1.5rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                    <h3 style="margin-top:0; margin-bottom:1rem;">${strings.convTitle[lang]}</h3>
                    <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:1rem;">
                        <div style="flex:1; min-width:120px;">
                            <label style="display:block; margin-bottom:0.5rem; font-size:0.9rem;">${strings.amt[lang]}</label>
                            <input type="number" id="cr-amt" value="1" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;">
                        </div>
                        <div style="flex:1; min-width:100px;">
                            <label style="display:block; margin-bottom:0.5rem; font-size:0.9rem;">${strings.from[lang]}</label>
                            <select id="cr-from" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;">
                                ${coins.map(c => `<option value="${c.id}">${c.symbol}</option>`).join('')}
                                ${fiats.map(f => `<option value="${f.toLowerCase()}">${f}</option>`).join('')}
                            </select>
                        </div>
                        <div style="flex:1; min-width:100px;">
                            <label style="display:block; margin-bottom:0.5rem; font-size:0.9rem;">${strings.to[lang]}</label>
                            <select id="cr-to" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;">
                                ${fiats.map(f => `<option value="${f.toLowerCase()}">${f}</option>`).join('')}
                                ${coins.map(c => `<option value="${c.id}">${c.symbol}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <button class="primary-btn" id="cr-btn" style="width:100%;">${strings.calc[lang]}</button>
                    
                    <div id="cr-res" style="margin-top:1.5rem; text-align:center; display:none;">
                        <div style="font-size:2rem; font-weight:bold; color:#10b981;" id="cr-val"></div>
                    </div>
                </div>
            </div>
        `;

        let prices = {};
        const fetchPrices = async () => {
            const grid = container.querySelector('#cr-grid');
            const status = container.querySelector('#cr-status');
            
            grid.style.display = 'none';
            status.style.display = 'block';
            status.textContent = strings.loading[lang];
            
            try {
                const ids = coins.map(c => c.id).join(',');
                const vs = fiats.join(',').toLowerCase();
                const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${vs}`);
                prices = await res.json();
                
                grid.innerHTML = '';
                coins.forEach(c => {
                    const usdPrice = prices[c.id]?.usd || 0;
                    grid.innerHTML += `
                        <div style="background:var(--bg-color); padding:1rem; border-radius:8px; border:1px solid var(--border-color); text-align:center;">
                            <div style="font-weight:bold; margin-bottom:0.25rem;">${c.symbol}</div>
                            <div style="color:var(--text-secondary); font-size:0.8rem; margin-bottom:0.5rem;">${c.name}</div>
                            <div style="color:var(--accent-color); font-weight:bold;">$${usdPrice.toLocaleString()}</div>
                        </div>
                    `;
                });
                
                status.style.display = 'none';
                grid.style.display = 'grid';
            } catch(e) {
                status.textContent = strings.err[lang];
                status.style.color = '#ef4444';
            }
        };

        container.querySelector('#cr-ref').addEventListener('click', fetchPrices);
        
        container.querySelector('#cr-btn').addEventListener('click', () => {
            if(Object.keys(prices).length === 0) return alert(strings.err[lang]);
            
            const amt = parseFloat(container.querySelector('#cr-amt').value);
            const from = container.querySelector('#cr-from').value;
            const to = container.querySelector('#cr-to').value;
            if(!amt) return;

            let usdValue = 0;
            
            // Convert 'from' to USD
            if(coins.find(c => c.id === from)) {
                usdValue = amt * (prices[from]?.usd || 0);
            } else if(from === 'usd') {
                usdValue = amt;
            } else {
                // It's a fiat. Find exchange rate via bitcoin as intermediate? No, we have fiat to usd... wait.
                // prices.bitcoin[fiat] = x
                // 1 BTC = x Fiat.  So 1 Fiat = 1/x BTC.
                // 1 BTC = y USD.   So 1 Fiat = (y/x) USD.
                const btcUsd = prices.bitcoin.usd;
                const btcFiat = prices.bitcoin[from];
                usdValue = amt * (btcUsd / btcFiat);
            }

            let finalValue = 0;
            // Convert USD to 'to'
            if(to === 'usd') {
                finalValue = usdValue;
            } else if(coins.find(c => c.id === to)) {
                finalValue = usdValue / (prices[to]?.usd || 1);
            } else {
                const btcUsd = prices.bitcoin.usd;
                const btcFiat = prices.bitcoin[to];
                finalValue = usdValue * (btcFiat / btcUsd);
            }
            
            const resDiv = container.querySelector('#cr-res');
            const valDiv = container.querySelector('#cr-val');
            
            // Format intelligently based on size
            let displayVal = finalValue;
            if(finalValue < 0.01) displayVal = finalValue.toPrecision(4);
            else displayVal = finalValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
            
            valDiv.textContent = `${displayVal} ${to.toUpperCase()}`;
            resDiv.style.display = 'block';
        });

        // Initial fetch
        fetchPrices();
    }
});
