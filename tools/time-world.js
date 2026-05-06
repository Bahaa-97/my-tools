window.ToolApp.register('time-world', {
    meta_desc: { ar: 'لوحة تفاعلية تعرض الوقت الحي لأهم مدن العالم لتسهيل متابعة التوقيت العالمي.', en: 'Interactive dashboard showing live time in major global cities.' },
    keywords: { ar: ['وقت', 'عالمي', 'ساعة', 'مدن', 'نيويورك', 'دبي'], en: ['world', 'clock', 'time', 'cities', 'global'] },
    features: { ar: ['تحديث لحظي', 'أهم المدن العالمية'], en: ['Live updates', 'Major global cities'] },
    render: function(container, lang) {
        const strings = {
            title: { ar: 'الساعة العالمية', en: 'World Clock' },
            local: { ar: 'وقتك المحلي', en: 'Your Local Time' }
        };

        const cities = [
            { name: { ar: 'نيويورك', en: 'New York' }, tz: 'America/New_York', flag: '🇺🇸' },
            { name: { ar: 'لندن', en: 'London' }, tz: 'Europe/London', flag: '🇬🇧' },
            { name: { ar: 'دبي', en: 'Dubai' }, tz: 'Asia/Dubai', flag: '🇦🇪' },
            { name: { ar: 'طوكيو', en: 'Tokyo' }, tz: 'Asia/Tokyo', flag: '🇯🇵' },
            { name: { ar: 'سيدني', en: 'Sydney' }, tz: 'Australia/Sydney', flag: '🇦🇺' },
            { name: { ar: 'باريس', en: 'Paris' }, tz: 'Europe/Paris', flag: '🇫🇷' }
        ];

        container.innerHTML = `
            <style>
                .tc-wrap { max-width: 800px; margin: 0 auto; }
                .tc-local { background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 2px solid var(--accent-color); text-align: center; margin-bottom: 2rem; box-shadow: var(--glass-shadow); }
                .tc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
                .tc-card { background: var(--surface-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: transform 0.2s; }
                .tc-card:hover { transform: translateY(-4px); border-color: var(--text-secondary); }
                .tc-time { font-size: 2rem; font-weight: bold; color: var(--text-primary); margin: 0.5rem 0; font-variant-numeric: tabular-nums; letter-spacing: -1px; }
                .tc-date { font-size: 0.85rem; color: var(--text-secondary); }
                .tc-name { font-weight: bold; color: var(--text-secondary); font-size: 1.1rem; }
            </style>
            
            <div class="tc-wrap">
                <div class="tc-local">
                    <div style="color:var(--text-secondary); font-weight:bold; margin-bottom:0.5rem; text-transform:uppercase;">${strings.local[lang]}</div>
                    <div id="tc-lt" style="font-size:3rem; font-weight:bold; color:var(--accent-color); font-variant-numeric:tabular-nums; letter-spacing:-2px;">--:--:--</div>
                    <div id="tc-ld" style="color:var(--text-secondary); margin-top:0.5rem;">---</div>
                </div>
                
                <div class="tc-grid">
                    ${cities.map((c, i) => `
                        <div class="tc-card">
                            <div class="tc-name">${c.flag} ${c.name[lang]}</div>
                            <div class="tc-time" id="t-time-${i}">--:--</div>
                            <div class="tc-date" id="t-date-${i}">---</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        let timerId = null;

        const updateClocks = () => {
            const now = new Date();
            const loc = lang === 'ar' ? 'ar-SA' : 'en-US';
            
            // Local
            container.querySelector('#tc-lt').textContent = new Intl.DateTimeFormat(loc, {timeStyle: 'medium'}).format(now);
            container.querySelector('#tc-ld').textContent = new Intl.DateTimeFormat(loc, {dateStyle: 'full'}).format(now);
            
            // Cities
            cities.forEach((c, i) => {
                const fTime = new Intl.DateTimeFormat(loc, { timeStyle: 'short', timeZone: c.tz });
                const fDate = new Intl.DateTimeFormat(loc, { dateStyle: 'medium', timeZone: c.tz });
                
                container.querySelector(`#t-time-${i}`).textContent = fTime.format(now);
                container.querySelector(`#t-date-${i}`).textContent = fDate.format(now);
            });
        };

        updateClocks();
        timerId = setInterval(updateClocks, 1000);

        // Cleanup
        const observer = new MutationObserver(() => {
            if(!document.body.contains(container)) {
                clearInterval(timerId);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
});
