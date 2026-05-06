window.ToolApp.register('prod-notes', {
    meta_desc: { ar: 'كتابة وحفظ ملاحظاتك وأفكارك السريعة في المتصفح أمان تام.', en: 'Write and save your quick notes and ideas in the browser securely.' },
    keywords: { ar: ['ملاحظات', 'أفكار', 'نوتس', 'notes', 'حفظ'], en: ['notes', 'ideas', 'quick notes', 'productivity'] },
    features: { ar: ['حفظ تلقائي للملاحظات', 'واجهة خالية من التشتيت'], en: ['Auto-saving notes', 'Distraction-free interface'] },
    render: function(container, lang) {
        const strings = {
            title: { ar: 'ملاحظاتك', en: 'Your Notes' },
            new: { ar: '+ ملاحظة جديدة', en: '+ New Note' },
            phTitle: { ar: 'عنوان الملاحظة...', en: 'Note Title...' },
            phBody: { ar: 'اكتب ملاحظاتك هنا...', en: 'Write your notes here...' },
            back: { ar: 'العودة للملاحظات', en: 'Back to Notes' },
            empty: { ar: 'ليس لديك ملاحظات بعد.', en: 'You have no notes yet.' },
            del: { ar: 'حذف الملاحظة', en: 'Delete Note' }
        };

        container.innerHTML = `
            <style>
                .n-wrap { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
                .n-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
                .n-card { background: var(--surface-color); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; height: 180px; box-shadow: var(--glass-shadow); }
                .n-card:hover { border-color: var(--accent-color); transform: translateY(-4px); }
                .n-card-title { font-weight: bold; font-size: 1.1rem; margin-bottom: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-primary); }
                .n-card-body { color: var(--text-secondary); font-size: 0.9rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; flex: 1; }
                .n-card-date { font-size: 0.75rem; color: var(--text-secondary); opacity: 0.7; margin-top: auto; padding-top: 0.5rem; }
                
                .n-editor { display: none; background: var(--surface-color); padding: 2rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); flex-direction: column; gap: 1rem; height: 60vh; }
                .n-editor-head { display: flex; justify-content: space-between; align-items: center; }
                .n-inp-title { width: 100%; font-size: 1.5rem; font-weight: bold; background: transparent; border: none; color: var(--text-primary); outline: none; border-bottom: 1px solid transparent; transition: border-color 0.2s; padding-bottom: 0.5rem; }
                .n-inp-title:focus { border-bottom-color: var(--accent-color); }
                .n-inp-body { width: 100%; flex: 1; resize: none; background: transparent; border: none; color: var(--text-primary); font-size: 1rem; line-height: 1.6; outline: none; font-family: inherit; }
            </style>
            
            <div class="n-wrap" id="n-main">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h2 style="margin:0;">${strings.title[lang]}</h2>
                    <button class="primary-btn" id="n-add">${strings.new[lang]}</button>
                </div>
                <div id="n-list" class="n-grid"></div>
            </div>

            <div class="n-wrap n-editor" id="n-edit-view">
                <div class="n-editor-head">
                    <button id="n-back" style="background:transparent; border:none; color:var(--text-secondary); cursor:pointer; font-weight:bold;">&larr; ${strings.back[lang]}</button>
                    <button id="n-del" style="background:transparent; border:none; color:#ef4444; cursor:pointer;">${strings.del[lang]}</button>
                </div>
                <input type="text" id="n-title" class="n-inp-title" placeholder="${strings.phTitle[lang]}">
                <textarea id="n-body" class="n-inp-body" placeholder="${strings.phBody[lang]}"></textarea>
            </div>
        `;

        let notes = JSON.parse(localStorage.getItem('myTools_notes')) || [];
        let activeIdx = -1;

        const mainView = container.querySelector('#n-main');
        const editView = container.querySelector('#n-edit-view');
        const listEl = container.querySelector('#n-list');
        const tInp = container.querySelector('#n-title');
        const bInp = container.querySelector('#n-body');

        const saveNotes = () => localStorage.setItem('myTools_notes', JSON.stringify(notes));

        const renderList = () => {
            listEl.innerHTML = '';
            if(notes.length === 0) {
                listEl.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--text-secondary); padding:3rem;">${strings.empty[lang]}</div>`;
                return;
            }
            
            notes.forEach((n, i) => {
                const div = document.createElement('div');
                div.className = 'n-card';
                div.innerHTML = `
                    <div class="n-card-title">${n.title || (lang === 'ar' ? 'بدون عنوان' : 'Untitled')}</div>
                    <div class="n-card-body">${n.body}</div>
                    <div class="n-card-date">${new Date(n.date).toLocaleDateString()}</div>
                `;
                div.addEventListener('click', () => openNote(i));
                listEl.appendChild(div);
            });
        };

        const openNote = (idx) => {
            activeIdx = idx;
            const n = notes[idx];
            tInp.value = n.title;
            bInp.value = n.body;
            mainView.style.display = 'none';
            editView.style.display = 'flex';
        };

        container.querySelector('#n-add').addEventListener('click', () => {
            notes.unshift({ title: '', body: '', date: Date.now() });
            saveNotes();
            openNote(0);
        });

        container.querySelector('#n-back').addEventListener('click', () => {
            // Trim and clean empty note
            const n = notes[activeIdx];
            if(!n.title.trim() && !n.body.trim()) {
                notes.splice(activeIdx, 1);
            }
            saveNotes();
            editView.style.display = 'none';
            mainView.style.display = 'flex';
            renderList();
        });

        container.querySelector('#n-del').addEventListener('click', () => {
            if(confirm('Are you sure?')) {
                notes.splice(activeIdx, 1);
                saveNotes();
                editView.style.display = 'none';
                mainView.style.display = 'flex';
                renderList();
            }
        });

        const autoSave = () => {
            if(activeIdx > -1) {
                notes[activeIdx].title = tInp.value;
                notes[activeIdx].body = bInp.value;
                notes[activeIdx].date = Date.now();
                saveNotes();
            }
        };

        tInp.addEventListener('input', autoSave);
        bInp.addEventListener('input', autoSave);

        renderList();
    }
});
