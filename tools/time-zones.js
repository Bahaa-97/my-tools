window.ToolApp.register('time-zones', {
    meta_desc: { ar: 'تحويل الوقت ومقارنته بين مختلف مدن ودول العالم بسهولة.', en: 'Convert and compare time across global cities easily.' },
    keywords: { ar: ['وقت', 'زمن', 'مناطق', 'تحويل', 'توقيت'], en: ['time', 'timezone', 'convert', 'world'] },
    features: { ar: ['دعم جميع مناطق العالم', 'تحويل دقيق ومباشر'], en: ['All global timezones', 'Accurate live conversion'] },
    render: function(container, lang) {
        const strings = {
            src: { ar: 'المنطقة الزمنية (المصدر)', en: 'Source Timezone' },
            dst: { ar: 'المنطقة الزمنية (الهدف)', en: 'Target Timezone' },
            time: { ar: 'الوقت المحدد', en: 'Specific Time' },
            now: { ar: 'استخدم الوقت الحالي', en: 'Use Current Time' },
            calc: { ar: 'تحويل الوقت', en: 'Convert Time' },
            res: { ar: 'الوقت في المنطقة الهدف:', en: 'Time in Target Zone:' }
        };

        const tzs = Intl.supportedValuesOf('timeZone');
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

        container.innerHTML = `
            <style>
                .tz-wrap { max-width: 500px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .tz-row { margin-bottom: 1.5rem; text-align: start; }
                .tz-label { display: block; margin-bottom: 0.5rem; font-weight: bold; color: var(--text-secondary); }
                .tz-inp { width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; }
                .tz-res { margin-top: 1.5rem; background: var(--bg-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); text-align: center; display: none; }
                .tz-time { font-size: 2.5rem; font-weight: bold; color: var(--accent-color); margin-top: 0.5rem; }
                .tz-date { color: var(--text-secondary); font-size: 1rem; margin-top: 0.5rem; }
            </style>
            
            <div class="tz-wrap">
                <div class="tz-row">
                    <label class="tz-label">${strings.src[lang]}</label>
                    <select id="tz-src" class="tz-inp">
                        ${tzs.map(tz => `<option value="${tz}" ${tz===userTz ? 'selected' : ''}>${tz}</option>`).join('')}
                    </select>
                </div>
                
                <div class="tz-row">
                    <label class="tz-label">${strings.time[lang]}</label>
                    <div style="display:flex; gap:1rem;">
                        <input type="datetime-local" id="tz-time" class="tz-inp" style="flex:1;">
                        <button id="tz-now" class="primary-btn" style="white-space:nowrap; padding:0 1rem;">${strings.now[lang]}</button>
                    </div>
                </div>

                <div class="tz-row">
                    <label class="tz-label">${strings.dst[lang]}</label>
                    <select id="tz-dst" class="tz-inp">
                        ${tzs.map(tz => `<option value="${tz}" ${tz==='UTC' ? 'selected' : ''}>${tz}</option>`).join('')}
                    </select>
                </div>
                
                <button id="tz-btn" class="primary-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="tz-res" class="tz-res">
                    <div class="tz-label">${strings.res[lang]}</div>
                    <div id="tz-res-time" class="tz-time"></div>
                    <div id="tz-res-date" class="tz-date"></div>
                </div>
            </div>
        `;

        const setNow = () => {
            const now = new Date();
            const offset = now.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(now - offset)).toISOString().slice(0, 16);
            container.querySelector('#tz-time').value = localISOTime;
        };

        container.querySelector('#tz-now').addEventListener('click', setNow);
        setNow(); // Initialize with current time

        container.querySelector('#tz-btn').addEventListener('click', () => {
            const srcTz = container.querySelector('#tz-src').value;
            const dstTz = container.querySelector('#tz-dst').value;
            const timeVal = container.querySelector('#tz-time').value;
            
            if(!timeVal) return;
            
            // To convert from an arbitrary timezone, we construct the date as if it was in UTC
            // then we figure out the offset. 
            // The easiest way is to parse the local time string, format it in srcTz to see its offset,
            // or just use a simpler approach:
            
            // 1. Create a date assuming it's in the browser's local time (just to hold values).
            const d = new Date(timeVal);
            
            // This requires some manual offset math because JS doesn't natively parse "Time X in TZ Y".
            // A common trick: Get the formatter for srcTz, find the offset, apply it to get UTC, then format in dstTz.
            // Let's use a robust approximation:
            
            const invDate = new Date(d.toLocaleString('en-US', { timeZone: srcTz }));
            const diff = d.getTime() - invDate.getTime();
            const realUtcDate = new Date(d.getTime() + diff);

            const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
            
            const formatterTime = new Intl.DateTimeFormat(locale, { timeStyle: 'short', timeZone: dstTz });
            const formatterDate = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: dstTz });
            
            container.querySelector('#tz-res-time').textContent = formatterTime.format(realUtcDate);
            container.querySelector('#tz-res-date').textContent = formatterDate.format(realUtcDate);
            
            container.querySelector('#tz-res').style.display = 'block';
        });
    }
});
