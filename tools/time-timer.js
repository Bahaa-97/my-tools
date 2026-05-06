window.ToolApp.register('time-timer', {
    meta_desc: { ar: 'ساعة إيقاف ومؤقت تنازلي مرن لإدارة الوقت بكفاءة.', en: 'Flexible stopwatch and countdown timer to manage time efficiently.' },
    keywords: { ar: ['مؤقت', 'ساعة', 'إيقاف', 'وقت', 'timer'], en: ['timer', 'stopwatch', 'time', 'countdown'] },
    features: { ar: ['مؤقت تصاعدي وتنازلي', 'دقة عالية'], en: ['Stopwatch and Countdown', 'High precision'] },
    render: function(container, lang) {
        const strings = {
            sw: { ar: 'ساعة الإيقاف', en: 'Stopwatch' },
            cd: { ar: 'المؤقت', en: 'Timer' },
            start: { ar: 'ابدأ', en: 'Start' },
            pause: { ar: 'إيقاف', en: 'Pause' },
            reset: { ar: 'إعادة', en: 'Reset' },
            set: { ar: 'تعيين الوقت', en: 'Set Time' }
        };

        container.innerHTML = `
            <style>
                .t-wrap { max-width: 450px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 24px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); text-align: center; }
                .t-tabs { display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; background: var(--bg-color); padding: 0.5rem; border-radius: 12px; }
                .t-tab { flex: 1; padding: 0.5rem; border: none; background: transparent; color: var(--text-secondary); font-weight: bold; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
                .t-tab.active { background: var(--accent-color); color: white; }
                
                .t-display { font-size: 5rem; font-weight: bold; color: var(--text-primary); margin-bottom: 2rem; font-variant-numeric: tabular-nums; letter-spacing: -2px; }
                .t-ms { font-size: 2rem; color: var(--text-secondary); }
                
                .t-controls { display: flex; gap: 1rem; justify-content: center; margin-bottom: 1rem; }
                .t-btn { padding: 1rem 2rem; border: none; border-radius: 12px; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: all 0.2s; }
                .t-start { background: var(--text-primary); color: var(--bg-color); }
                .t-start:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .t-reset { background: transparent; color: var(--text-secondary); border: 2px solid var(--border-color); }
                .t-reset:hover { border-color: var(--text-secondary); }
                
                .t-setup { display: none; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem; }
                .t-inp { width: 60px; padding: 0.5rem; text-align: center; font-size: 1.2rem; font-weight: bold; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; }
            </style>
            
            <div class="t-wrap">
                <div class="t-tabs">
                    <button class="t-tab active" data-mode="sw">${strings.sw[lang]}</button>
                    <button class="t-tab" data-mode="cd">${strings.cd[lang]}</button>
                </div>
                
                <div class="t-setup" id="t-setup">
                    <input type="number" id="t-h" class="t-inp" placeholder="HH" min="0" max="99"> :
                    <input type="number" id="t-m" class="t-inp" placeholder="MM" min="0" max="59"> :
                    <input type="number" id="t-s" class="t-inp" placeholder="SS" min="0" max="59">
                </div>
                
                <div id="t-display" class="t-display">00:00:00<span class="t-ms">.00</span></div>
                
                <div class="t-controls">
                    <button id="t-start" class="t-btn t-start">${strings.start[lang]}</button>
                    <button id="t-reset" class="t-btn t-reset">${strings.reset[lang]}</button>
                </div>
            </div>
        `;

        let mode = 'sw'; // sw or cd
        let isRunning = false;
        let startTime = 0;
        let elapsedTime = 0;
        let timerId = null;
        let cdDuration = 0; // target duration for countdown

        const dispEl = container.querySelector('#t-display');
        const startBtn = container.querySelector('#t-start');
        const setupEl = container.querySelector('#t-setup');

        const formatTime = (time) => {
            const h = Math.floor(time / 3600000).toString().padStart(2, '0');
            const m = Math.floor((time % 3600000) / 60000).toString().padStart(2, '0');
            const s = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
            const ms = Math.floor((time % 1000) / 10).toString().padStart(2, '0');
            return `${h}:${m}:${s}<span class="t-ms">.${ms}</span>`;
        };

        const updateDisplay = () => {
            if (mode === 'sw') {
                dispEl.innerHTML = formatTime(elapsedTime);
            } else {
                let left = cdDuration - elapsedTime;
                if (left <= 0) {
                    left = 0;
                    if(isRunning) {
                        isRunning = false;
                        clearInterval(timerId);
                        startBtn.textContent = strings.start[lang];
                        // Play beep
                        try {
                            const actx = new (window.AudioContext || window.webkitAudioContext)();
                            const osc = actx.createOscillator();
                            osc.connect(actx.destination);
                            osc.frequency.setValueAtTime(800, actx.currentTime);
                            osc.start();
                            osc.stop(actx.currentTime + 1);
                        } catch(e){}
                    }
                }
                dispEl.innerHTML = formatTime(left);
            }
        };

        const loop = () => {
            const now = Date.now();
            elapsedTime += now - startTime;
            startTime = now;
            updateDisplay();
        };

        container.querySelectorAll('.t-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                isRunning = false;
                clearInterval(timerId);
                startBtn.textContent = strings.start[lang];
                mode = tab.getAttribute('data-mode');
                
                container.querySelectorAll('.t-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                if (mode === 'cd') {
                    setupEl.style.display = 'flex';
                    elapsedTime = 0;
                    cdDuration = 0;
                    updateDisplay();
                } else {
                    setupEl.style.display = 'none';
                    elapsedTime = 0;
                    updateDisplay();
                }
            });
        });

        startBtn.addEventListener('click', () => {
            if (mode === 'cd' && !isRunning && cdDuration === 0) {
                // Apply setup
                const h = parseInt(container.querySelector('#t-h').value) || 0;
                const m = parseInt(container.querySelector('#t-m').value) || 0;
                const s = parseInt(container.querySelector('#t-s').value) || 0;
                cdDuration = (h * 3600 + m * 60 + s) * 1000;
                elapsedTime = 0;
                if (cdDuration === 0) return;
            }

            if (isRunning) {
                clearInterval(timerId);
                isRunning = false;
                startBtn.textContent = strings.start[lang];
            } else {
                startTime = Date.now();
                timerId = setInterval(loop, 10); // Update every 10ms for smooth ms
                isRunning = true;
                startBtn.textContent = strings.pause[lang];
            }
        });

        container.querySelector('#t-reset').addEventListener('click', () => {
            isRunning = false;
            clearInterval(timerId);
            startBtn.textContent = strings.start[lang];
            elapsedTime = 0;
            if(mode === 'cd') {
                container.querySelector('#t-h').value = '';
                container.querySelector('#t-m').value = '';
                container.querySelector('#t-s').value = '';
                cdDuration = 0;
            }
            updateDisplay();
        });
        
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
