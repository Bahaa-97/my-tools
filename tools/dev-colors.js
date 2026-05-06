window.ToolApp.register('dev-colors', {
    meta_desc: { ar: 'التحويل بين صيغ الألوان المختلفة HEX و RGB و HSL بسهولة للمصممين والمطورين.', en: 'Convert between HEX, RGB, and HSL color formats easily for designers and developers.' },
    keywords: { ar: ['لون', 'الوان', 'محول', 'hex', 'rgb'], en: ['color', 'converter', 'hex', 'rgb', 'hsl'] },
    features: { ar: ['مزامنة حية للقيم', 'أداة التقاط ألوان'], en: ['Live value sync', 'Color picker'] },
    render: function(container, lang) {
        const strings = {
            pick: { ar: 'اختر لوناً', en: 'Pick a Color' },
            hex: { ar: 'HEX', en: 'HEX' },
            rgb: { ar: 'RGB', en: 'RGB' },
            hsl: { ar: 'HSL', en: 'HSL' }
        };

        container.innerHTML = `
            <style>
                .dc-wrap { max-width: 600px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .dc-preview { width: 100%; height: 120px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 2rem; transition: background-color 0.2s; position: relative; display: flex; align-items: center; justify-content: center; }
                .dc-picker { opacity: 0; position: absolute; inset: 0; width: 100%; height: 100%; cursor: pointer; }
                .dc-picker-btn { pointer-events: none; background: rgba(255,255,255,0.8); color: #000; padding: 0.5rem 1rem; border-radius: 8px; font-weight: bold; font-size: 0.9rem; }
                .dc-row { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
                .dc-label { width: 60px; font-weight: bold; color: var(--text-secondary); }
                .dc-inp { flex: 1; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; font-family: monospace; font-size: 1.1rem; }
            </style>
            
            <div class="dc-wrap">
                <div id="dc-preview" class="dc-preview" style="background-color: #3b82f6;">
                    <div class="dc-picker-btn">${strings.pick[lang]}</div>
                    <input type="color" id="dc-picker" class="dc-picker" value="#3b82f6">
                </div>
                
                <div class="dc-row">
                    <div class="dc-label">${strings.hex[lang]}</div>
                    <input type="text" id="dc-hex" class="dc-inp" value="#3b82f6">
                </div>
                <div class="dc-row">
                    <div class="dc-label">${strings.rgb[lang]}</div>
                    <input type="text" id="dc-rgb" class="dc-inp" value="rgb(59, 130, 246)">
                </div>
                <div class="dc-row">
                    <div class="dc-label">${strings.hsl[lang]}</div>
                    <input type="text" id="dc-hsl" class="dc-inp" value="hsl(217, 90%, 60%)">
                </div>
            </div>
        `;

        const preview = container.querySelector('#dc-preview');
        const picker = container.querySelector('#dc-picker');
        const iHex = container.querySelector('#dc-hex');
        const iRgb = container.querySelector('#dc-rgb');
        const iHsl = container.querySelector('#dc-hsl');

        // Helper: HEX to RGB
        const hexToRgb = (hex) => {
            let h = hex.replace(/^#/, '');
            if(h.length === 3) h = h.split('').map(x => x+x).join('');
            const r = parseInt(h.substring(0, 2), 16);
            const g = parseInt(h.substring(2, 4), 16);
            const b = parseInt(h.substring(4, 6), 16);
            return [r, g, b];
        };

        // Helper: RGB to HSL
        const rgbToHsl = (r, g, b) => {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            if(max === min) { h = s = 0; }
            else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch(max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
        };

        // Helper: RGB to HEX
        const rgbToHex = (r, g, b) => {
            return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
        };

        const updateAllFromHex = (hex) => {
            try {
                const rgb = hexToRgb(hex);
                if(isNaN(rgb[0])) throw 'err';
                const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
                
                preview.style.backgroundColor = hex;
                picker.value = hex;
                iRgb.value = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
                iHsl.value = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
            } catch(e) {}
        };

        picker.addEventListener('input', () => {
            iHex.value = picker.value;
            updateAllFromHex(picker.value);
        });

        iHex.addEventListener('input', () => updateAllFromHex(iHex.value));

        // Simplified: only allow editing HEX or using picker for guaranteed sync
        iRgb.addEventListener('input', () => {
            // Attempt to parse rgb(r,g,b)
            const m = iRgb.value.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
            if(m) {
                const hex = rgbToHex(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
                iHex.value = hex;
                updateAllFromHex(hex);
            }
        });
    }
});
