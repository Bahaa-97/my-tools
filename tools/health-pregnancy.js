window.ToolApp.register('health-pregnancy', {
    meta_desc: { ar: 'حساب موعد الولادة المتوقع وأسابيع الحمل بناءً على تاريخ آخر دورة.', en: 'Calculate estimated due date and pregnancy weeks based on LMP.' },
    keywords: { ar: ['حمل', 'ولادة', 'موعد', 'أسابيع'], en: ['pregnancy', 'due date', 'weeks', 'baby'] },
    features: { ar: ['حساب دقيق بالأسابيع والأيام', 'تحديد موعد الولادة'], en: ['Accurate weeks/days', 'Estimate due date'] },
    render: function(container, lang) {
        const strings = {
            desc: { ar: 'أدخلي تاريخ أول يوم من آخر دورة شهرية لحساب الموعد:', en: 'Enter the first day of your Last Menstrual Period (LMP):' },
            date: { ar: 'تاريخ آخر دورة', en: 'LMP Date' },
            calc: { ar: 'احسبي موعد الولادة', en: 'Calculate Due Date' },
            due: { ar: 'موعد الولادة المتوقع:', en: 'Estimated Due Date:' },
            progress: { ar: 'عمر الحمل الحالي:', en: 'Current Pregnancy Age:' },
            weeks: { ar: 'أسابيع و', en: 'weeks and' },
            days: { ar: 'أيام', en: 'days' },
            err: { ar: 'الرجاء اختيار تاريخ صحيح.', en: 'Please select a valid date.' }
        };

        container.innerHTML = `
            <div style="max-width:500px; margin:0 auto; background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); box-shadow:var(--glass-shadow);">
                <p style="color:var(--text-secondary); margin-bottom:1.5rem; text-align:center;">${strings.desc[lang]}</p>
                <div style="margin-bottom:1.5rem; text-align:start;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:bold; color:var(--text-secondary);">${strings.date[lang]}</label>
                    <input type="date" id="preg-d" style="width:100%; padding:0.75rem; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-color); color:var(--text-primary); outline:none;">
                </div>
                <button class="primary-btn" id="preg-btn" style="width:100%;">${strings.calc[lang]}</button>
                
                <div id="preg-res" style="margin-top:1.5rem; display:none;">
                    <div style="background:var(--bg-color); padding:1.5rem; border-radius:8px; border:1px solid var(--border-color); text-align:center; margin-bottom:1rem;">
                        <div style="color:var(--text-secondary); margin-bottom:0.5rem;">${strings.due[lang]}</div>
                        <div style="font-size:2rem; font-weight:bold; color:#ec4899;" id="preg-due"></div>
                    </div>
                    <div style="background:var(--bg-color); padding:1.5rem; border-radius:8px; border:1px solid var(--border-color); text-align:center;">
                        <div style="color:var(--text-secondary); margin-bottom:0.5rem;">${strings.progress[lang]}</div>
                        <div style="font-size:1.5rem; font-weight:bold; color:var(--text-primary);" id="preg-prog"></div>
                    </div>
                </div>
            </div>
        `;

        const btn = container.querySelector('#preg-btn');
        btn.addEventListener('click', () => {
            const dateVal = container.querySelector('#preg-d').value;
            if(!dateVal) return;
            
            const lmp = new Date(dateVal);
            const today = new Date();
            
            if(lmp > today) return alert(strings.err[lang]);
            
            // Naegele's rule: Add 280 days to LMP
            const dueDate = new Date(lmp.getTime());
            dueDate.setDate(dueDate.getDate() + 280);
            
            const diffTime = Math.abs(today - lmp);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            const w = Math.floor(diffDays / 7);
            const d = diffDays % 7;
            
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const dueStr = dueDate.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', dateOptions);
            
            container.querySelector('#preg-due').textContent = dueStr;
            
            if(w > 42) {
                container.querySelector('#preg-prog').textContent = lang === 'ar' ? 'اكتمل الحمل' : 'Pregnancy Completed';
            } else {
                container.querySelector('#preg-prog').textContent = `${w} ${strings.weeks[lang]} ${d} ${strings.days[lang]}`;
            }
            
            container.querySelector('#preg-res').style.display = 'block';
        });
    }
});
