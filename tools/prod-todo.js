window.ToolApp.register('prod-todo', {
    meta_desc: { ar: 'قائمة مهام يومية سهلة مع حفظ تلقائي للمتصفح.', en: 'Easy daily todo list with auto-save in browser.' },
    keywords: { ar: ['مهام', 'قائمة', 'تودو', 'todo', 'إنتاجية'], en: ['todo', 'tasks', 'list', 'productivity'] },
    features: { ar: ['حفظ تلقائي محلي', 'سهولة الاستخدام'], en: ['Local auto-save', 'Easy to use'] },
    render: function(container, lang) {
        const strings = {
            add: { ar: 'أضف مهمة...', en: 'Add a task...' },
            addBtn: { ar: 'إضافة', en: 'Add' },
            empty: { ar: 'لا توجد مهام حالياً. أضف مهمة جديدة لتنطلق!', en: 'No tasks currently. Add a new task to get started!' },
            clr: { ar: 'مسح المكتملة', en: 'Clear Completed' }
        };

        container.innerHTML = `
            <style>
                .td-wrap { max-width: 500px; margin: 0 auto; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); }
                .td-inp-group { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
                .td-inp { flex: 1; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; }
                .td-item { display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: var(--bg-color); border-radius: 8px; margin-bottom: 0.5rem; border: 1px solid var(--border-color); transition: all 0.2s; }
                .td-item.done { opacity: 0.6; }
                .td-item.done .td-text { text-decoration: line-through; color: var(--text-secondary); }
                .td-check { width: 20px; height: 20px; cursor: pointer; accent-color: var(--accent-color); margin-inline-end: 1rem; }
                .td-text { flex: 1; font-size: 1rem; cursor: pointer; user-select: none; }
                .td-del { background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 1.2rem; opacity: 0.6; transition: opacity 0.2s; }
                .td-del:hover { opacity: 1; }
            </style>
            <div class="td-wrap">
                <div class="td-inp-group">
                    <input type="text" id="td-inp" class="td-inp" placeholder="${strings.add[lang]}">
                    <button id="td-add" class="primary-btn">${strings.addBtn[lang]}</button>
                </div>
                <div id="td-list"></div>
                <div style="text-align:end; margin-top:1rem;">
                    <button id="td-clr" style="background:transparent; border:none; color:var(--text-secondary); cursor:pointer; font-size:0.9rem; text-decoration:underline; display:none;">${strings.clr[lang]}</button>
                </div>
            </div>
        `;

        let tasks = JSON.parse(localStorage.getItem('myTools_todo')) || [];
        const listEl = container.querySelector('#td-list');
        const inpEl = container.querySelector('#td-inp');
        const clrBtn = container.querySelector('#td-clr');

        const renderTasks = () => {
            listEl.innerHTML = '';
            if (tasks.length === 0) {
                listEl.innerHTML = `<div style="text-align:center; color:var(--text-secondary); padding:2rem 0;">${strings.empty[lang]}</div>`;
                clrBtn.style.display = 'none';
                return;
            }

            let hasCompleted = false;
            tasks.forEach((t, i) => {
                if (t.done) hasCompleted = true;
                const div = document.createElement('div');
                div.className = `td-item ${t.done ? 'done' : ''}`;
                
                div.innerHTML = `
                    <input type="checkbox" class="td-check" ${t.done ? 'checked' : ''}>
                    <div class="td-text">${t.text}</div>
                    <button class="td-del">✕</button>
                `;

                div.querySelector('.td-check').addEventListener('change', (e) => {
                    tasks[i].done = e.target.checked;
                    saveAndRender();
                });
                
                div.querySelector('.td-text').addEventListener('click', () => {
                    tasks[i].done = !tasks[i].done;
                    saveAndRender();
                });

                div.querySelector('.td-del').addEventListener('click', () => {
                    tasks.splice(i, 1);
                    saveAndRender();
                });

                listEl.appendChild(div);
            });

            clrBtn.style.display = hasCompleted ? 'inline-block' : 'none';
        };

        const saveAndRender = () => {
            localStorage.setItem('myTools_todo', JSON.stringify(tasks));
            renderTasks();
        };

        const addTask = () => {
            const txt = inpEl.value.trim();
            if(!txt) return;
            tasks.unshift({ text: txt, done: false });
            inpEl.value = '';
            saveAndRender();
        };

        container.querySelector('#td-add').addEventListener('click', addTask);
        inpEl.addEventListener('keypress', e => { if(e.key === 'Enter') addTask(); });
        
        clrBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => !t.done);
            saveAndRender();
        });

        renderTasks();
    }
});
