window.ToolApp.register('prod-whiteboard', {
    meta_desc: { ar: 'سبورة بيضاء للرسم السريع، وتدوين الأفكار بصرياً.', en: 'Quick whiteboard for sketching and noting down ideas visually.' },
    keywords: { ar: ['رسم', 'سبورة', 'بيضاء', 'شخبطة', 'أفكار'], en: ['draw', 'whiteboard', 'sketch', 'ideas'] },
    features: { ar: ['رسم سلس وسريع', 'تحميل كصورة PNG'], en: ['Smooth fast drawing', 'Download as PNG'] },
    render: function(container, lang) {
        const strings = {
            clear: { ar: 'مسح اللوحة', en: 'Clear Board' },
            save: { ar: 'تحميل كصورة', en: 'Download Image' },
            colors: { ar: 'الألوان:', en: 'Colors:' }
        };

        container.innerHTML = `
            <style>
                .wb-wrap { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
                .wb-canvas { width: 100%; height: 500px; background: white; border-radius: 12px; border: 2px solid var(--border-color); cursor: crosshair; touch-action: none; box-shadow: var(--glass-shadow); }
                .wb-toolbar { display: flex; justify-content: space-between; align-items: center; background: var(--surface-color); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); flex-wrap: wrap; gap: 1rem; }
                .wb-colors { display: flex; gap: 0.5rem; align-items: center; }
                .wb-color { width: 32px; height: 32px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: transform 0.2s; }
                .wb-color:hover { transform: scale(1.1); }
                .wb-color.active { border-color: var(--text-primary); transform: scale(1.1); }
                .wb-actions { display: flex; gap: 0.5rem; }
            </style>
            
            <div class="wb-wrap">
                <div class="wb-toolbar">
                    <div class="wb-colors">
                        <span style="font-weight:bold; font-size:0.9rem; color:var(--text-secondary); margin-inline-end:0.5rem;">${strings.colors[lang]}</span>
                        <div class="wb-color active" style="background:#000000;" data-color="#000000"></div>
                        <div class="wb-color" style="background:#ef4444;" data-color="#ef4444"></div>
                        <div class="wb-color" style="background:#3b82f6;" data-color="#3b82f6"></div>
                        <div class="wb-color" style="background:#10b981;" data-color="#10b981"></div>
                        <div class="wb-color" style="background:#f59e0b;" data-color="#f59e0b"></div>
                        <div class="wb-color" style="background:#ffffff; border-color:#ccc;" data-color="#ffffff"></div> <!-- Eraser essentially -->
                    </div>
                    <div class="wb-actions">
                        <button class="primary-btn" id="wb-clear" style="background:transparent; color:#ef4444; border:1px solid #ef4444;">${strings.clear[lang]}</button>
                        <button class="primary-btn" id="wb-save">${strings.save[lang]}</button>
                    </div>
                </div>
                
                <canvas id="wb-canvas" class="wb-canvas"></canvas>
            </div>
        `;

        const canvas = container.querySelector('#wb-canvas');
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let currentColor = '#000000';
        let currentSize = 3;

        // Set canvas physical size
        const resize = () => {
            // Keep content logic
            const rect = canvas.getBoundingClientRect();
            // Create a temp canvas to store image
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            if(canvas.width > 0) tempCtx.drawImage(canvas, 0, 0);
            
            canvas.width = rect.width;
            canvas.height = rect.height;
            
            // Fill white background initially
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Restore drawing
            if(tempCanvas.width > 0) {
                ctx.drawImage(tempCanvas, 0, 0);
            }
            
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        };

        // Delay resize to ensure CSS is applied
        setTimeout(resize, 100);
        window.addEventListener('resize', resize);

        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            let clientX, clientY;
            if(e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const startDraw = (e) => {
            isDrawing = true;
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            e.preventDefault();
        };

        const draw = (e) => {
            if(!isDrawing) return;
            const pos = getPos(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentColor === '#ffffff' ? 20 : 3; // Eraser is thicker
            ctx.stroke();
            e.preventDefault();
        };

        const stopDraw = () => {
            if(isDrawing) {
                ctx.closePath();
                isDrawing = false;
            }
        };

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDraw);

        canvas.addEventListener('touchstart', startDraw, {passive: false});
        canvas.addEventListener('touchmove', draw, {passive: false});
        window.addEventListener('touchend', stopDraw);

        // Color picking
        container.querySelectorAll('.wb-color').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.wb-color').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                currentColor = btn.getAttribute('data-color');
            });
        });

        // Clear
        container.querySelector('#wb-clear').addEventListener('click', () => {
            if(confirm('Clear whiteboard?')) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        });

        // Save
        container.querySelector('#wb-save').addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'whiteboard.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });

        const observer = new MutationObserver(() => {
            if(!document.body.contains(container)) {
                window.removeEventListener('resize', resize);
                window.removeEventListener('mouseup', stopDraw);
                window.removeEventListener('touchend', stopDraw);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
});
