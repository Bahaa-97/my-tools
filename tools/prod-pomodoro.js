window.ToolApp.register('prod-pomodoro', {
    meta_desc: { ar: 'مؤقت بومودورو لتعزيز التركيز والإنتاجية مع فترات راحة مبرمجة.', en: 'Pomodoro timer to boost focus and productivity with breaks.' },
    keywords: { ar: ['بومودورو', 'مؤقت', 'تركيز', 'إنتاجية', 'دراسة'], en: ['pomodoro', 'timer', 'focus', 'study', 'productivity'] },
    features: { ar: ['أوضاع عمل وراحة متعددة', 'إشعارات صوتية'], en: ['Work & break modes', 'Audio notifications'] },
    render: function(container, lang) {
        const strings = {
            pomodoro: { ar: 'تركيز', en: 'Pomodoro' },
            shortBreak: { ar: 'راحة قصيرة', en: 'Short Break' },
            longBreak: { ar: 'راحة طويلة', en: 'Long Break' },
            start: { ar: 'ابدأ', en: 'Start' },
            pause: { ar: 'إيقاف مؤقت', en: 'Pause' },
            reset: { ar: 'إعادة ضبط', en: 'Reset' }
        };

        const MODES = {
            pomo: 25 * 60,
            short: 5 * 60,
            long: 15 * 60
        };

        container.innerHTML = `
            <style>
                .pom-wrap { max-width: 450px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 24px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); text-align: center; }
                .pom-tabs { display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; background: var(--bg-color); padding: 0.5rem; border-radius: 12px; }
                .pom-tab { flex: 1; padding: 0.5rem; border: none; background: transparent; color: var(--text-secondary); font-weight: bold; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
                .pom-tab.active { background: var(--accent-color); color: white; }
                .pom-time { font-size: 6rem; font-weight: bold; color: var(--text-primary); margin-bottom: 2rem; font-variant-numeric: tabular-nums; letter-spacing: -2px; }
                .pom-controls { display: flex; gap: 1rem; justify-content: center; }
                .pom-btn { padding: 1rem 2rem; border: none; border-radius: 12px; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: all 0.2s; }
                .pom-start { background: var(--text-primary); color: var(--bg-color); }
                .pom-start:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .pom-reset { background: transparent; color: var(--text-secondary); border: 2px solid var(--border-color); }
                .pom-reset:hover { border-color: var(--text-secondary); }
            </style>
            
            <div class="pom-wrap">
                <div class="pom-tabs">
                    <button class="pom-tab active" data-mode="pomo">${strings.pomodoro[lang]}</button>
                    <button class="pom-tab" data-mode="short">${strings.shortBreak[lang]}</button>
                    <button class="pom-tab" data-mode="long">${strings.longBreak[lang]}</button>
                </div>
                
                <div id="pom-time" class="pom-time">25:00</div>
                
                <div class="pom-controls">
                    <button id="pom-start" class="pom-btn pom-start">${strings.start[lang]}</button>
                    <button id="pom-reset" class="pom-btn pom-reset">${strings.reset[lang]}</button>
                </div>
            </div>
        `;

        let timeLeft = MODES.pomo;
        let timerId = null;
        let isRunning = false;
        let currentMode = 'pomo';

        const timeEl = container.querySelector('#pom-time');
        const startBtn = container.querySelector('#pom-start');
        const resetBtn = container.querySelector('#pom-reset');
        const tabs = container.querySelectorAll('.pom-tab');

        const formatTime = (secs) => {
            const m = Math.floor(secs / 60).toString().padStart(2, '0');
            const s = (secs % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        };

        const updateDisplay = () => {
            timeEl.textContent = formatTime(timeLeft);
            document.title = `${formatTime(timeLeft)} - Daily Tools`;
        };

        const switchMode = (mode) => {
            currentMode = mode;
            timeLeft = MODES[mode];
            isRunning = false;
            clearInterval(timerId);
            startBtn.textContent = strings.start[lang];
            updateDisplay();
            
            tabs.forEach(t => t.classList.remove('active'));
            container.querySelector(`.pom-tab[data-mode="${mode}"]`).classList.add('active');
            
            let color = '';
            if(mode === 'pomo') color = 'var(--accent-color)';
            else if(mode === 'short') color = '#10b981';
            else color = '#3b82f6';
            
            container.style.setProperty('--accent-color', color);
        };

        tabs.forEach(t => t.addEventListener('click', () => switchMode(t.getAttribute('data-mode'))));

        const playAlarm = () => {
            try {
                const actx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = actx.createOscillator();
                const gain = actx.createGain();
                osc.connect(gain);
                gain.connect(actx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, actx.currentTime);
                gain.gain.setValueAtTime(0, actx.currentTime);
                gain.gain.linearRampToValueAtTime(1, actx.currentTime + 0.05);
                gain.gain.linearRampToValueAtTime(0, actx.currentTime + 0.5);
                osc.start(actx.currentTime);
                osc.stop(actx.currentTime + 0.5);
            } catch(e) {}
        };

        startBtn.addEventListener('click', () => {
            if(isRunning) {
                clearInterval(timerId);
                isRunning = false;
                startBtn.textContent = strings.start[lang];
            } else {
                if(timeLeft <= 0) timeLeft = MODES[currentMode];
                isRunning = true;
                startBtn.textContent = strings.pause[lang];
                
                timerId = setInterval(() => {
                    timeLeft--;
                    updateDisplay();
                    
                    if(timeLeft <= 0) {
                        clearInterval(timerId);
                        isRunning = false;
                        startBtn.textContent = strings.start[lang];
                        playAlarm();
                        // alert('Time is up!');
                    }
                }, 1000);
            }
        });

        resetBtn.addEventListener('click', () => {
            switchMode(currentMode); // Resets to current mode's default time
        });

        // Cleanup on navigate away
        const observer = new MutationObserver((mutations) => {
            if(!document.body.contains(container)) {
                clearInterval(timerId);
                document.title = 'أدواتي | Daily Tools';
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Initial setup
        container.style.setProperty('--accent-color', '#ef4444');
    }
});
