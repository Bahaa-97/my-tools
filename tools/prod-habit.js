window.ToolApp.register('prod-habit', {
    meta_desc: { ar: 'تتبع عاداتك اليومية والأسبوعية وبناء روتين ناجح بسهولة.', en: 'Track your daily habits and build a successful routine easily.' },
    keywords: { ar: ['عادات', 'تتبع', 'روتين', 'نجاح', 'يومية'], en: ['habits', 'tracker', 'routine', 'daily'] },
    features: { ar: ['تتبع أسبوعي بصري', 'حفظ تلقائي للمستوى'], en: ['Visual weekly tracking', 'Auto-save progress'] },
    render: function(container, lang) {
        const strings = {
            addTitle: { ar: 'اكتب عادة جديدة...', en: 'Add a new habit...' },
            addBtn: { ar: 'إضافة', en: 'Add' },
            empty: { ar: 'لم تقم بإضافة أي عادات بعد.', en: 'No habits added yet.' },
            days: {
                ar: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
                en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            }
        };

        container.innerHTML = `
            <style>
                .h-wrap { max-width: 700px; margin: 0 auto; background: var(--surface-color); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .h-inp-group { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
                .h-inp { flex: 1; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; }
                .h-card { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 1rem; padding: 1rem; position: relative; transition: all 0.2s; }
                .h-card-title { font-size: 1.1rem; font-weight: bold; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; color: var(--text-primary); }
                .h-del { background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 1rem; opacity: 0.5; transition: opacity 0.2s; }
                .h-card:hover .h-del { opacity: 1; }
                .h-grid { display: flex; justify-content: space-between; }
                .h-day { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
                .h-day-label { font-size: 0.75rem; color: var(--text-secondary); font-weight: bold; }
                .h-check { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--border-color); cursor: pointer; display: flex; align-items: center; justify-content: center; background: transparent; transition: all 0.2s; }
                .h-check.active { background: var(--accent-color); border-color: var(--accent-color); }
                .h-check.active::after { content: '✓'; color: white; font-weight: bold; font-size: 14px; }
            </style>
            <div class="h-wrap">
                <div class="h-inp-group">
                    <input type="text" id="h-inp" class="h-inp" placeholder="${strings.addTitle[lang]}">
                    <button id="h-add" class="primary-btn">${strings.addBtn[lang]}</button>
                </div>
                <div id="h-list"></div>
            </div>
        `;

        let habits = JSON.parse(localStorage.getItem('myTools_habits')) || [];
        const listEl = container.querySelector('#h-list');
        const inpEl = container.querySelector('#h-inp');

        const saveHabits = () => localStorage.setItem('myTools_habits', JSON.stringify(habits));

        const renderHabits = () => {
            listEl.innerHTML = '';
            if(habits.length === 0) {
                listEl.innerHTML = `<div style="text-align:center; color:var(--text-secondary); padding:2rem;">${strings.empty[lang]}</div>`;
                return;
            }

            habits.forEach((h, i) => {
                const div = document.createElement('div');
                div.className = 'h-card';
                
                let daysHtml = '';
                for(let d = 0; d < 7; d++) {
                    const isActive = h.days.includes(d) ? 'active' : '';
                    daysHtml += `
                        <div class="h-day">
                            <span class="h-day-label">${strings.days[lang][d]}</span>
                            <div class="h-check ${isActive}" data-day="${d}"></div>
                        </div>
                    `;
                }

                div.innerHTML = `
                    <div class="h-card-title">
                        <span>${h.title}</span>
                        <button class="h-del">✕</button>
                    </div>
                    <div class="h-grid">${daysHtml}</div>
                `;

                div.querySelectorAll('.h-check').forEach(chk => {
                    chk.addEventListener('click', () => {
                        const d = parseInt(chk.getAttribute('data-day'));
                        if(h.days.includes(d)) {
                            h.days = h.days.filter(day => day !== d);
                        } else {
                            h.days.push(d);
                        }
                        saveHabits();
                        renderHabits();
                    });
                });

                div.querySelector('.h-del').addEventListener('click', () => {
                    if(confirm('Are you sure?')) {
                        habits.splice(i, 1);
                        saveHabits();
                        renderHabits();
                    }
                });

                listEl.appendChild(div);
            });
        };

        container.querySelector('#h-add').addEventListener('click', () => {
            const val = inpEl.value.trim();
            if(!val) return;
            habits.unshift({ title: val, days: [] });
            inpEl.value = '';
            saveHabits();
            renderHabits();
        });

        inpEl.addEventListener('keypress', e => { if(e.key === 'Enter') container.querySelector('#h-add').click(); });

        renderHabits();
    }
});
