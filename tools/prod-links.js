window.ToolApp.register('prod-links', {
    meta_desc: { ar: 'حفظ وتنظيم الروابط المهمة والمواقع المفضلة للوصول السريع.', en: 'Save and organize your important links and bookmarks for quick access.' },
    keywords: { ar: ['روابط', 'منظم', 'مفضلات', 'bookmark', 'links'], en: ['links', 'bookmarks', 'manager', 'organizer'] },
    features: { ar: ['أيقونات تلقائية للمواقع', 'حفظ محلي آمن'], en: ['Auto website icons', 'Secure local saving'] },
    render: function(container, lang) {
        const strings = {
            addTitle: { ar: 'عنوان الرابط (اختياري)', en: 'Link Title (Optional)' },
            addUrl: { ar: 'أدخل الرابط (URL)', en: 'Enter URL' },
            addBtn: { ar: 'إضافة', en: 'Add' },
            empty: { ar: 'لم تقم بإضافة أية روابط بعد.', en: "You haven't added any links yet." },
            invalid: { ar: 'رابط غير صحيح.', en: 'Invalid URL.' }
        };

        container.innerHTML = `
            <style>
                .l-wrap { max-width: 800px; margin: 0 auto; }
                .l-form { display: flex; gap: 1rem; margin-bottom: 2rem; background: var(--surface-color); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--glass-shadow); flex-wrap: wrap; }
                .l-inp { flex: 1; min-width: 200px; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-primary); outline: none; }
                .l-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
                .l-card { display: flex; align-items: center; gap: 1rem; background: var(--surface-color); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); transition: all 0.2s; text-decoration: none; color: inherit; box-shadow: 0 2px 4px rgba(0,0,0,0.05); position: relative; }
                .l-card:hover { border-color: var(--accent-color); transform: translateY(-3px); }
                .l-icon { width: 32px; height: 32px; border-radius: 6px; background: var(--bg-color); display: flex; align-items: center; justify-content: center; overflow: hidden; }
                .l-icon img { width: 100%; height: 100%; object-fit: contain; }
                .l-info { flex: 1; overflow: hidden; }
                .l-title { font-weight: bold; font-size: 1rem; margin-bottom: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-primary); }
                .l-url { font-size: 0.8rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .l-del { position: absolute; top: 8px; right: 8px; background: transparent; border: none; color: #ef4444; font-size: 1.2rem; cursor: pointer; opacity: 0; transition: opacity 0.2s; }
                [dir="rtl"] .l-del { right: auto; left: 8px; }
                .l-card:hover .l-del { opacity: 1; }
            </style>
            
            <div class="l-wrap">
                <div class="l-form">
                    <input type="text" id="l-title" class="l-inp" placeholder="${strings.addTitle[lang]}">
                    <input type="text" id="l-url" class="l-inp" placeholder="${strings.addUrl[lang]}">
                    <button id="l-add" class="primary-btn">${strings.addBtn[lang]}</button>
                </div>
                <div id="l-list" class="l-grid"></div>
            </div>
        `;

        let links = JSON.parse(localStorage.getItem('myTools_links')) || [];
        const listEl = container.querySelector('#l-list');
        const tInp = container.querySelector('#l-title');
        const uInp = container.querySelector('#l-url');

        const renderLinks = () => {
            listEl.innerHTML = '';
            if(links.length === 0) {
                listEl.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--text-secondary); padding:2rem;">${strings.empty[lang]}</div>`;
                return;
            }
            
            links.forEach((l, i) => {
                const div = document.createElement('a');
                div.className = 'l-card';
                div.href = l.url;
                div.target = '_blank';
                
                let domain = '';
                try { domain = new URL(l.url).hostname; } catch(e) {}
                
                div.innerHTML = `
                    <div class="l-icon">
                        <img src="https://www.google.com/s2/favicons?domain=${domain}&sz=32" alt="icon" onerror="this.style.display='none'">
                    </div>
                    <div class="l-info">
                        <div class="l-title">${l.title || domain || l.url}</div>
                        <div class="l-url">${domain || l.url}</div>
                    </div>
                    <button class="l-del" data-idx="${i}">✕</button>
                `;
                
                listEl.appendChild(div);
            });

            container.querySelectorAll('.l-del').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault(); // Prevent navigating
                    const idx = parseInt(btn.getAttribute('data-idx'));
                    links.splice(idx, 1);
                    localStorage.setItem('myTools_links', JSON.stringify(links));
                    renderLinks();
                });
            });
        };

        container.querySelector('#l-add').addEventListener('click', () => {
            let url = uInp.value.trim();
            if(!url) return;
            if(!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            
            try { new URL(url); } catch(e) { return alert(strings.invalid[lang]); }
            
            links.unshift({ title: tInp.value.trim(), url: url });
            localStorage.setItem('myTools_links', JSON.stringify(links));
            tInp.value = ''; uInp.value = '';
            renderLinks();
        });

        renderLinks();
    }
});
