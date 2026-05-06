window.ToolApp.register('prod-sounds', {
    meta_desc: { ar: 'مشغل أصوات طبيعية وضوضاء بيضاء للمساعدة في الاسترخاء والتركيز.', en: 'Play natural sounds and white noise to help relax and focus.' },
    keywords: { ar: ['أصوات', 'تركيز', 'ضوضاء', 'مطر', 'استرخاء'], en: ['sounds', 'focus', 'noise', 'rain', 'relax'] },
    features: { ar: ['مكتبة أصوات نقية', 'تشغيل في الخلفية'], en: ['Clean sound library', 'Background play'] },
    render: function(container, lang) {
        const strings = {
            title: { ar: 'اختر صوتاً للتركيز', en: 'Choose a focus sound' },
            play: { ar: 'تشغيل', en: 'Play' },
            stop: { ar: 'إيقاف', en: 'Stop' },
            vol: { ar: 'مستوى الصوت', en: 'Volume' }
        };

        const sounds = [
            { id: 'rain', name: { ar: 'مطر غزير', en: 'Heavy Rain' }, icon: '🌧️', url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=heavy-rain-nature-sounds-8186.mp3' },
            { id: 'cafe', name: { ar: 'مقهى هادئ', en: 'Quiet Cafe' }, icon: '☕', url: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_17b3d95eb1.mp3?filename=restaurant-ambience-chatting-125027.mp3' },
            { id: 'waves', name: { ar: 'أمواج البحر', en: 'Ocean Waves' }, icon: '🌊', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_6234b6b158.mp3?filename=ocean-waves-112906.mp3' },
            { id: 'forest', name: { ar: 'غابة وطيور', en: 'Forest Birds' }, icon: '🌲', url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_9968da9db8.mp3?filename=birds-in-forest-16781.mp3' }
        ];

        container.innerHTML = `
            <style>
                .s-wrap { max-width: 600px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); text-align: center; }
                .s-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
                .s-card { background: var(--bg-color); border: 2px solid var(--border-color); border-radius: 16px; padding: 1.5rem; cursor: pointer; transition: all 0.2s; user-select: none; }
                .s-card:hover { border-color: var(--accent-color); transform: translateY(-3px); }
                .s-card.active { border-color: var(--accent-color); background: rgba(var(--c-rgb, 59, 130, 246), 0.1); }
                .s-icon { font-size: 3rem; margin-bottom: 0.5rem; }
                .s-name { font-weight: bold; color: var(--text-primary); font-size: 0.9rem; }
                
                .s-controls { background: var(--bg-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; gap: 2rem; flex-wrap: wrap; }
                .s-btn { width: 64px; height: 64px; border-radius: 50%; border: none; background: var(--accent-color); color: white; cursor: pointer; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
                .s-btn:hover { transform: scale(1.05); }
                .s-vol { width: 150px; accent-color: var(--accent-color); }
            </style>
            
            <div class="s-wrap">
                <h3 style="margin-top:0; margin-bottom:1.5rem; color:var(--text-secondary);">${strings.title[lang]}</h3>
                <div class="s-grid" id="s-grid">
                    ${sounds.map(s => `
                        <div class="s-card" data-id="${s.id}">
                            <div class="s-icon">${s.icon}</div>
                            <div class="s-name">${s.name[lang]}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="s-controls">
                    <button class="s-btn" id="s-play">▶</button>
                    <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem;">
                        <span style="font-size:0.8rem; font-weight:bold; color:var(--text-secondary);">${strings.vol[lang]}</span>
                        <input type="range" id="s-vol" class="s-vol" min="0" max="1" step="0.05" value="0.5">
                    </div>
                </div>
            </div>
        `;

        let activeId = sounds[0].id;
        let isPlaying = false;
        let audio = new Audio();
        audio.loop = true;

        const grid = container.querySelector('#s-grid');
        const playBtn = container.querySelector('#s-play');
        const volInp = container.querySelector('#s-vol');

        const setActive = (id) => {
            activeId = id;
            grid.querySelectorAll('.s-card').forEach(c => c.classList.remove('active'));
            grid.querySelector(`.s-card[data-id="${id}"]`).classList.add('active');
            
            const snd = sounds.find(s => s.id === id);
            audio.src = snd.url;
            
            if(isPlaying) audio.play();
        };

        grid.querySelectorAll('.s-card').forEach(c => {
            c.addEventListener('click', () => {
                setActive(c.getAttribute('data-id'));
                if(!isPlaying) {
                    isPlaying = true;
                    playBtn.textContent = '⏸';
                    audio.play();
                }
            });
        });

        playBtn.addEventListener('click', () => {
            if(isPlaying) {
                audio.pause();
                isPlaying = false;
                playBtn.textContent = '▶';
            } else {
                audio.play();
                isPlaying = true;
                playBtn.textContent = '⏸';
            }
        });

        volInp.addEventListener('input', () => {
            audio.volume = volInp.value;
        });

        // Init
        audio.volume = volInp.value;
        setActive(activeId);
        // Do not auto play.
        
        // Cleanup
        const observer = new MutationObserver(() => {
            if(!document.body.contains(container)) {
                audio.pause();
                audio.src = '';
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
});
