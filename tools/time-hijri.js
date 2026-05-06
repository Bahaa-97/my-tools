window.ToolApp.register('time-hijri', {
    meta_desc: { ar: 'تحويل التاريخ بين الهجري والميلادي وعرض التقويم بدقة عالية.', en: 'Convert between Hijri and Gregorian dates accurately.' },
    keywords: { ar: ['هجري', 'ميلادي', 'تاريخ', 'تقويم', 'تحويل'], en: ['hijri', 'gregorian', 'date', 'calendar'] },
    features: { ar: ['تحويل فوري ودقيق', 'يعتمد تقويم أم القرى'], en: ['Instant accurate conversion', 'Umm al-Qura calendar'] },
    render: function(container, lang) {
        const strings = {
            title: { ar: 'اختر تاريخاً ميلادياً لتحويله للهجري:', en: 'Select a Gregorian date to convert:' },
            greg: { ar: 'الميلادي', en: 'Gregorian' },
            hijri: { ar: 'الهجري', en: 'Hijri' },
            day: { ar: 'اليوم', en: 'Day' }
        };

        container.innerHTML = `
            <style>
                .h-wrap { max-width: 500px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); text-align: center; }
                .h-inp { width: 100%; max-width: 300px; padding: 1rem; border-radius: 12px; border: 2px solid var(--accent-color); background: var(--bg-color); color: var(--text-primary); font-size: 1.2rem; outline: none; margin-bottom: 2rem; text-align: center; font-family: inherit; }
                .h-res { background: var(--bg-color); padding: 2rem; border-radius: 12px; border: 1px solid var(--border-color); }
                .h-label { color: var(--text-secondary); font-size: 0.9rem; font-weight: bold; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; }
                .h-val { font-size: 1.8rem; font-weight: bold; color: var(--text-primary); margin-bottom: 1.5rem; }
                .h-val.primary { color: var(--accent-color); font-size: 2.2rem; }
            </style>
            
            <div class="h-wrap">
                <div class="h-label" style="margin-bottom:1rem; color:var(--text-primary);">${strings.title[lang]}</div>
                <input type="date" id="th-inp" class="h-inp">
                
                <div class="h-res">
                    <div class="h-label">${strings.hijri[lang]}</div>
                    <div id="th-hijri" class="h-val primary">-</div>
                    
                    <div class="h-label">${strings.day[lang]}</div>
                    <div id="th-day" class="h-val" style="font-size:1.5rem;">-</div>
                </div>
            </div>
        `;

        const inp = container.querySelector('#th-inp');
        const rHijri = container.querySelector('#th-hijri');
        const rDay = container.querySelector('#th-day');

        // Defaults to today
        inp.value = new Date().toISOString().split('T')[0];

        const convert = () => {
            if(!inp.value) return;
            const d = new Date(inp.value);
            
            const localeAr = 'ar-SA-u-ca-islamic-umalqura';
            const localeEn = 'en-US-u-ca-islamic-umalqura';
            const loc = lang === 'ar' ? localeAr : localeEn;
            
            const fmtHijri = new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long', year: 'numeric' });
            const fmtDay = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long' });
            
            rHijri.textContent = fmtHijri.format(d);
            rDay.textContent = fmtDay.format(d);
        };

        inp.addEventListener('input', convert);
        convert();
    }
});
