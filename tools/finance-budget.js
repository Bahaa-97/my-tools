window.ToolApp.register('finance-budget', {
    meta_desc: { ar: 'تتبع دخلك ومصروفاتك اليومية لمعرفة رصيدك المتبقي.', en: 'Track your daily income and expenses to know your balance.' },
    keywords: { ar: ['ميزانية', 'مصروفات', 'دخل', 'مالية'], en: ['budget', 'expenses', 'income', 'finance'] },
    features: { ar: ['تخزين محلي آمن', 'حساب تلقائي للرصيد'], en: ['Secure local storage', 'Auto balance calculation'] },
    render: function(container, lang) {
        const strings = {
            bal: { ar: 'الرصيد الحالي', en: 'Current Balance' },
            inc: { ar: 'إجمالي الدخل', en: 'Total Income' },
            exp: { ar: 'إجمالي المصروفات', en: 'Total Expenses' },
            addInc: { ar: '+ إضافة دخل', en: '+ Add Income' },
            addExp: { ar: '- إضافة مصروف', en: '- Add Expense' },
            title: { ar: 'الوصف', en: 'Description' },
            amount: { ar: 'المبلغ', en: 'Amount' },
            save: { ar: 'حفظ', en: 'Save' },
            noItems: { ar: 'لا توجد عمليات مسجلة.', en: 'No transactions recorded.' },
            del: { ar: 'حذف', en: 'Delete' },
            clr: { ar: 'مسح الكل', en: 'Clear All' }
        };

        container.innerHTML = `
            <div style="max-width:600px; margin:0 auto; display:flex; flex-direction:column; gap:1.5rem;">
                <!-- Summary Card -->
                <div style="background:var(--surface-color); padding:2rem; border-radius:16px; border:1px solid var(--border-color); text-align:center; box-shadow:var(--glass-shadow);">
                    <div style="color:var(--text-secondary); margin-bottom:0.5rem; font-weight:bold;">${strings.bal[lang]}</div>
                    <div id="b-bal" style="font-size:3rem; font-weight:bold; color:var(--text-primary); margin-bottom:1.5rem;">0.00</div>
                    <div style="display:flex; justify-content:space-around;">
                        <div>
                            <div style="color:var(--text-secondary); font-size:0.9rem;">${strings.inc[lang]}</div>
                            <div id="b-inc" style="color:#10b981; font-weight:bold; font-size:1.25rem;">0.00</div>
                        </div>
                        <div>
                            <div style="color:var(--text-secondary); font-size:0.9rem;">${strings.exp[lang]}</div>
                            <div id="b-exp" style="color:#ef4444; font-weight:bold; font-size:1.25rem;">0.00</div>
                        </div>
                    </div>
                </div>

                <!-- Controls -->
                <div style="display:flex; gap:1rem;">
                    <button class="primary-btn" id="btn-inc" style="flex:1; background:#10b981;">${strings.addInc[lang]}</button>
                    <button class="primary-btn" id="btn-exp" style="flex:1; background:#ef4444;">${strings.addExp[lang]}</button>
                </div>

                <!-- Input Form -->
                <div id="b-form" style="display:none; background:var(--surface-color); padding:1.5rem; border-radius:12px; border:1px solid var(--border-color);">
                    <div style="display:flex; gap:1rem; margin-bottom:1rem;">
                        <input type="text" id="b-title" placeholder="${strings.title[lang]}" style="flex:2; padding:0.75rem; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-primary); outline:none;">
                        <input type="number" id="b-amount" placeholder="${strings.amount[lang]}" style="flex:1; padding:0.75rem; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-color); color:var(--text-primary); outline:none;">
                    </div>
                    <button class="primary-btn" id="btn-save" style="width:100%;">${strings.save[lang]}</button>
                </div>

                <!-- Transactions List -->
                <div style="background:var(--surface-color); padding:1.5rem; border-radius:16px; border:1px solid var(--border-color);">
                    <div style="display:flex; justify-content:space-between; margin-bottom:1rem; align-items:center;">
                        <h3 style="margin:0;">السجل</h3>
                        <button id="btn-clr" style="background:transparent; color:#ef4444; border:none; cursor:pointer; font-size:0.9rem;">${strings.clr[lang]}</button>
                    </div>
                    <div id="b-list" style="display:flex; flex-direction:column; gap:0.5rem;"></div>
                </div>
            </div>
        `;

        let transactions = JSON.parse(localStorage.getItem('myTools_budget')) || [];
        let currentType = 'inc';

        const balEl = container.querySelector('#b-bal');
        const incEl = container.querySelector('#b-inc');
        const expEl = container.querySelector('#b-exp');
        const formEl = container.querySelector('#b-form');
        const titleInp = container.querySelector('#b-title');
        const amtInp = container.querySelector('#b-amount');
        const listEl = container.querySelector('#b-list');

        const renderUI = () => {
            let inc = 0, exp = 0;
            listEl.innerHTML = '';
            
            if(transactions.length === 0) {
                listEl.innerHTML = `<div style="text-align:center; color:var(--text-secondary); padding:1rem;">${strings.noItems[lang]}</div>`;
            } else {
                transactions.forEach((t, i) => {
                    if(t.type === 'inc') inc += t.amount;
                    else exp += t.amount;
                    
                    const sign = t.type === 'inc' ? '+' : '-';
                    const color = t.type === 'inc' ? '#10b981' : '#ef4444';
                    
                    listEl.innerHTML += `
                        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-color); padding:0.75rem 1rem; border-radius:8px; border:1px solid var(--border-color);">
                            <div style="flex:1;">${t.title}</div>
                            <div style="font-weight:bold; color:${color}; margin-right:1rem;">${sign} ${t.amount.toFixed(2)}</div>
                            <button onclick="window.delTx(${i})" style="background:transparent; border:none; color:var(--text-secondary); cursor:pointer;">✕</button>
                        </div>
                    `;
                });
            }
            
            const bal = inc - exp;
            incEl.textContent = inc.toFixed(2);
            expEl.textContent = exp.toFixed(2);
            balEl.textContent = bal.toFixed(2);
            balEl.style.color = bal >= 0 ? 'var(--text-primary)' : '#ef4444';
            
            localStorage.setItem('myTools_budget', JSON.stringify(transactions));
        };

        window.delTx = (idx) => {
            transactions.splice(idx, 1);
            renderUI();
        };

        container.querySelector('#btn-inc').addEventListener('click', () => { currentType = 'inc'; formEl.style.display = 'block'; });
        container.querySelector('#btn-exp').addEventListener('click', () => { currentType = 'exp'; formEl.style.display = 'block'; });

        container.querySelector('#btn-save').addEventListener('click', () => {
            const t = titleInp.value.trim() || (currentType === 'inc' ? 'Income' : 'Expense');
            const a = parseFloat(amtInp.value);
            if(!a || a <= 0) return;
            
            transactions.unshift({ type: currentType, title: t, amount: a });
            titleInp.value = ''; amtInp.value = '';
            formEl.style.display = 'none';
            renderUI();
        });

        container.querySelector('#btn-clr').addEventListener('click', () => {
            if(confirm('Are you sure?')) { transactions = []; renderUI(); }
        });

        renderUI();
    }
});
