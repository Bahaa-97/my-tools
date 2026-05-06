window.ToolApp.register('time-events', {
    meta_desc: { ar: 'عد تنازلي مخصص لأهم المناسبات والأعياد الخاصة بك.', en: 'Custom countdown for your most important events and holidays.' },
    keywords: { ar: ['أعياد', 'مناسبات', 'عد تنازلي', 'حدث', 'مخطط'], en: ['events', 'holidays', 'countdown', 'planner'] },
    features: { ar: ['إضافة أحداث مخصصة', 'عد تنازلي دقيق'], en: ['Add custom events', 'Precise countdown'] },
    render: function(container, lang) {
        const strings = {
            addTitle: { ar: 'اسم المناسبة', en: 'Event Name' },
            addDate: { ar: 'تاريخ المناسبة', en: 'Event Date' },
            addBtn: { ar: 'إضافة للعد التنازلي', en: 'Add Countdown' },
            d: { ar: 'يوم', en: 'd' },
            h: { ar: 'ساعة', en: 'h' },
            m: { ar: 'دقيقة', en: 'm' },
            s: { ar: 'ثانية', en: 's' },
            passed: { ar: 'انتهى الحدث!', en: 'Event Passed!' },
            empty: { ar: 'لم تقم بإضافة أحداث بعد.', en: 'No events added yet.' }
        };

        container.innerHTML = `
            <style>
                .ev-wrap { max-width: 800px; margin: 0 auto; }
                .ev-form { display: flex; gap: 1rem; margin-bottom: 2rem; background: var(--surface-color); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); flex-wrap: wrap; }
                .ev-inp { flex: 1; min-width: 200px; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; }
                .ev-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
                .ev-card { background: var(--surface-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); position: relative; box-shadow: var(--glass-shadow); overflow: hidden; }
                .ev-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--accent-color); }
                .ev-title { font-weight: bold; font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--text-primary); padding-inline-end: 2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .ev-date { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.5rem; }
                .ev-timer { display: flex; gap: 0.5rem; justify-content: space-between; }
                .ev-box { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.5rem; text-align: center; flex: 1; }
                .ev-val { font-size: 1.5rem; font-weight: bold; color: var(--text-primary); }
                .ev-unit { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; }
                .ev-del { position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; color: #ef4444; font-size: 1.2rem; cursor: pointer; opacity: 0.5; transition: opacity 0.2s; }
                [dir="rtl"] .ev-del { right: auto; left: 1rem; }
                .ev-card:hover .ev-del { opacity: 1; }
                .ev-passed { color: #ef4444; font-weight: bold; font-size: 1.2rem; text-align: center; padding: 1rem 0; }
            </style>
            
            <div class="ev-wrap">
                <div class="ev-form">
                    <input type="text" id="ev-title" class="ev-inp" placeholder="${strings.addTitle[lang]}">
                    <input type="datetime-local" id="ev-date" class="ev-inp">
                    <button id="ev-add" class="primary-btn">${strings.addBtn[lang]}</button>
                </div>
                <div id="ev-list" class="ev-grid"></div>
            </div>
        `;

        let events = JSON.parse(localStorage.getItem('myTools_events')) || [];
        const listEl = container.querySelector('#ev-list');
        let timerId = null;

        const saveEvents = () => localStorage.setItem('myTools_events', JSON.stringify(events));

        const renderEvents = () => {
            listEl.innerHTML = '';
            if(events.length === 0) {
                listEl.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--text-secondary); padding:2rem;">${strings.empty[lang]}</div>`;
                return;
            }

            const now = new Date().getTime();

            events.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach((ev, i) => {
                const target = new Date(ev.date).getTime();
                const dist = target - now;

                const div = document.createElement('div');
                div.className = 'ev-card';

                if(dist < 0) {
                    div.innerHTML = `
                        <div class="ev-title">${ev.title}</div>
                        <div class="ev-date">${new Date(ev.date).toLocaleString()}</div>
                        <div class="ev-passed">${strings.passed[lang]}</div>
                        <button class="ev-del" data-idx="${i}">✕</button>
                    `;
                } else {
                    const d = Math.floor(dist / (1000 * 60 * 60 * 24));
                    const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
                    const s = Math.floor((dist % (1000 * 60)) / 1000);

                    div.innerHTML = `
                        <div class="ev-title">${ev.title}</div>
                        <div class="ev-date">${new Date(ev.date).toLocaleString()}</div>
                        <div class="ev-timer">
                            <div class="ev-box"><div class="ev-val">${d}</div><div class="ev-unit">${strings.d[lang]}</div></div>
                            <div class="ev-box"><div class="ev-val">${h}</div><div class="ev-unit">${strings.h[lang]}</div></div>
                            <div class="ev-box"><div class="ev-val">${m}</div><div class="ev-unit">${strings.m[lang]}</div></div>
                            <div class="ev-box"><div class="ev-val">${s}</div><div class="ev-unit">${strings.s[lang]}</div></div>
                        </div>
                        <button class="ev-del" data-idx="${i}">✕</button>
                    `;
                }

                listEl.appendChild(div);
            });

            container.querySelectorAll('.ev-del').forEach(btn => {
                btn.addEventListener('click', () => {
                    if(confirm('Delete?')) {
                        const idx = parseInt(btn.getAttribute('data-idx'));
                        events.splice(idx, 1);
                        saveEvents();
                        renderEvents();
                    }
                });
            });
        };

        container.querySelector('#ev-add').addEventListener('click', () => {
            const t = container.querySelector('#ev-title').value.trim();
            const d = container.querySelector('#ev-date').value;
            if(!t || !d) return;
            
            events.push({ title: t, date: d });
            saveEvents();
            
            container.querySelector('#ev-title').value = '';
            container.querySelector('#ev-date').value = '';
            renderEvents();
        });

        // Tick every second
        renderEvents();
        timerId = setInterval(renderEvents, 1000);

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
