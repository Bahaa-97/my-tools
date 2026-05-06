window.ToolApp.register('media-color', {
    meta_desc: { ar: 'استخراج الألوان من أي صورة (HEX/RGB) بالضغط عليها.', en: 'Extract colors from any image (HEX/RGB) by clicking on it.' },
    keywords: { ar: ['لون', 'الوان', 'صورة', 'استخراج', 'color', 'picker'], en: ['color', 'picker', 'image', 'extract', 'hex'] },
    features: { ar: ['مكبر لوني دقيق', 'نسخ فوري للـ HEX'], en: ['Accurate color magnifier', 'Instant HEX copy'] },
    render: function(container, lang) {
        const strings = {
            upload: { ar: 'ارفع صورة لاستخراج الألوان', en: 'Upload image to extract colors' },
            inst: { ar: 'حرك الماوس واضغط لنسخ كود اللون (HEX)', en: 'Move mouse and click to copy HEX color' },
            copied: { ar: 'تم النسخ!', en: 'Copied!' }
        };

        container.innerHTML = `
            <style>
                .cpi-wrap { max-width: 800px; margin: 0 auto; text-align: center; }
                .cpi-file { background: var(--surface-color); border: 2px dashed var(--border-color); padding: 2rem; border-radius: 16px; cursor: pointer; margin-bottom: 1.5rem; transition: border-color 0.2s; position: relative; overflow: hidden; }
                .cpi-file:hover { border-color: var(--accent-color); }
                .cpi-file input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
                .cpi-file span { font-weight: bold; color: var(--text-primary); pointer-events: none; font-size: 1.1rem; }
                
                .cpi-workspace { display: none; position: relative; border-radius: 12px; border: 1px solid var(--border-color); overflow: hidden; background: #eee; cursor: crosshair; }
                .cpi-canvas { width: 100%; height: auto; display: block; }
                
                .cpi-panel { background: var(--surface-color); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); display: none; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; box-shadow: var(--glass-shadow); }
                .cpi-swatch { width: 50px; height: 50px; border-radius: 8px; border: 2px solid var(--border-color); background: #fff; }
                .cpi-info { text-align: start; }
                .cpi-hex { font-size: 1.5rem; font-weight: bold; color: var(--text-primary); font-family: monospace; }
                .cpi-rgb { color: var(--text-secondary); font-size: 0.9rem; font-family: monospace; }
                .cpi-msg { color: #10b981; font-weight: bold; font-size: 0.9rem; opacity: 0; transition: opacity 0.2s; }
            </style>
            
            <div class="cpi-wrap">
                <div class="cpi-file">
                    <span>${strings.upload[lang]}</span>
                    <input type="file" id="cpi-file" accept="image/*">
                </div>
                
                <div style="color:var(--text-secondary); margin-bottom:1rem; font-size:0.9rem;">${strings.inst[lang]}</div>
                
                <div id="cpi-ws" class="cpi-workspace">
                    <canvas id="cpi-canvas" class="cpi-canvas"></canvas>
                </div>
                
                <div id="cpi-panel" class="cpi-panel">
                    <div id="cpi-swatch" class="cpi-swatch"></div>
                    <div class="cpi-info">
                        <div id="cpi-hex" class="cpi-hex">#FFFFFF</div>
                        <div id="cpi-rgb" class="cpi-rgb">rgb(255, 255, 255)</div>
                    </div>
                    <div id="cpi-msg" class="cpi-msg">${strings.copied[lang]}</div>
                </div>
            </div>
        `;

        const iFile = container.querySelector('#cpi-file');
        const ws = container.querySelector('#cpi-ws');
        const canvas = container.querySelector('#cpi-canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const panel = container.querySelector('#cpi-panel');
        const swatch = container.querySelector('#cpi-swatch');
        const tHex = container.querySelector('#cpi-hex');
        const tRgb = container.querySelector('#cpi-rgb');
        const tMsg = container.querySelector('#cpi-msg');

        let imgObj = new Image();

        iFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                imgObj.src = ev.target.result;
                imgObj.onload = () => {
                    // Set canvas actual size
                    canvas.width = imgObj.naturalWidth;
                    canvas.height = imgObj.naturalHeight;
                    ctx.drawImage(imgObj, 0, 0);
                    
                    ws.style.display = 'block';
                    panel.style.display = 'flex';
                };
            };
            reader.readAsDataURL(file);
        });

        const rgbToHex = (r, g, b) => "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();

        const getColorAtEvent = (e) => {
            const rect = canvas.getBoundingClientRect();
            // Scale mouse coordinates to canvas internal resolution
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const r = pixel[0], g = pixel[1], b = pixel[2];
            return { r, g, b, hex: rgbToHex(r,g,b) };
        };

        canvas.addEventListener('mousemove', (e) => {
            const c = getColorAtEvent(e);
            swatch.style.backgroundColor = c.hex;
            tHex.textContent = c.hex;
            tRgb.textContent = `rgb(${c.r}, ${c.g}, ${c.b})`;
        });

        canvas.addEventListener('click', (e) => {
            const c = getColorAtEvent(e);
            navigator.clipboard.writeText(c.hex).then(() => {
                tMsg.style.opacity = '1';
                setTimeout(() => tMsg.style.opacity = '0', 2000);
            });
        });
    }
});
