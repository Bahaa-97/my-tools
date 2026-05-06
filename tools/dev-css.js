window.ToolApp.register('dev-css', {
    meta_desc: { ar: 'تحويل القيم بين px و rem و em بناءً على حجم الخط الأساسي بسهولة.', en: 'Convert values between px, rem, and em based on base font size easily.' },
    keywords: { ar: ['وحدات', 'تحويل', 'سي اس اس', 'px', 'rem', 'em'], en: ['css', 'unit', 'converter', 'px', 'rem', 'em'] },
    features: { ar: ['مزامنة حية للقيم', 'تحديد Base Size'], en: ['Live syncing', 'Custom Base Size'] },
    render: function(container, lang) {
        const strings = {
            base: { ar: 'حجم الخط الأساسي (Base Size px)', en: 'Base Font Size (px)' },
            px: { ar: 'بكسل (px)', en: 'Pixels (px)' },
            rem: { ar: 'ريم (rem)', en: 'Rem (rem)' },
            em: { ar: 'إيم (em)', en: 'Em (em)' },
            desc: { ar: '* تغيير أي قيمة سيقوم بتحديث القيم الأخرى فوراً.', en: '* Changing any value will update the others instantly.' }
        };

        container.innerHTML = `
            <style>
                .dc-wrap { max-width: 500px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .dc-row { margin-bottom: 1.5rem; }
                .dc-label { display: block; margin-bottom: 0.5rem; font-weight: bold; color: var(--text-secondary); font-size: 0.9rem; text-transform: uppercase; }
                .dc-inp { width: 100%; padding: 1rem; border-radius: 8px; border: 2px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; font-size: 1.2rem; font-weight: bold; text-align: center; transition: border-color 0.2s; }
                .dc-inp:focus { border-color: var(--accent-color); }
                .dc-base { background: rgba(var(--c-rgb, 59, 130, 246), 0.1); padding: 1rem; border-radius: 8px; margin-bottom: 2rem; text-align: center; }
                .dc-base-inp { width: 60px; padding: 0.5rem; text-align: center; border-radius: 6px; border: 1px solid var(--accent-color); font-weight: bold; margin-inline-start: 0.5rem; background: var(--bg-color); color: var(--text-primary); }
            </style>
            
            <div class="dc-wrap">
                <div class="dc-base">
                    <label style="font-weight:bold; color:var(--text-primary);">${strings.base[lang]}</label>
                    <input type="number" id="dc-base" class="dc-base-inp" value="16" min="1">
                </div>
                
                <div class="dc-row">
                    <label class="dc-label">${strings.px[lang]}</label>
                    <input type="number" id="dc-px" class="dc-inp" placeholder="16">
                </div>
                
                <div class="dc-row">
                    <label class="dc-label">${strings.rem[lang]} / ${strings.em[lang]}</label>
                    <input type="number" id="dc-rem" class="dc-inp" placeholder="1">
                </div>
                
                <div style="font-size:0.8rem; color:var(--text-secondary); text-align:center;">${strings.desc[lang]}</div>
            </div>
        `;

        const iBase = container.querySelector('#dc-base');
        const iPx = container.querySelector('#dc-px');
        const iRem = container.querySelector('#dc-rem');

        const getBase = () => parseFloat(iBase.value) || 16;

        iPx.addEventListener('input', () => {
            const v = parseFloat(iPx.value);
            if(!isNaN(v)) {
                iRem.value = +(v / getBase()).toFixed(4);
            } else {
                iRem.value = '';
            }
        });

        iRem.addEventListener('input', () => {
            const v = parseFloat(iRem.value);
            if(!isNaN(v)) {
                iPx.value = +(v * getBase()).toFixed(4);
            } else {
                iPx.value = '';
            }
        });

        iBase.addEventListener('input', () => {
            // Trigger recalculation from px
            if(iPx.value) iPx.dispatchEvent(new Event('input'));
        });
    }
});
