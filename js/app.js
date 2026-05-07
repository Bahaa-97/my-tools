class App {
    constructor() {
        this.lang = localStorage.getItem('lang') || 'ar';
        this.theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        this.registry = window.TOOLS_REGISTRY || [];
        this.categories = window.CATEGORIES || {};
        this.strings = window.GLOBAL_STRINGS || {};
        this.isLocal = window.location.protocol === 'file:';
        
        // This is where tools register themselves once loaded
        window.ToolApp = {
            register: (toolId, toolConfig) => {
                this.loadedTools[toolId] = toolConfig;
                if (this.pendingToolRender === toolId) {
                    this.renderTool(toolId);
                    this.pendingToolRender = null;
                }
            }
        };
        
        this.loadedTools = {};
        this.pendingToolRender = null;
        this.currentTool = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateUIStrings();
        this.handleRoute();
        this.setupBackToTop();
    }
    
    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', this.theme);
            localStorage.setItem('theme', this.theme);
        });
        
        // Lang toggle
        document.getElementById('lang-toggle').addEventListener('click', () => {
            this.lang = this.lang === 'ar' ? 'en' : 'ar';
            document.documentElement.setAttribute('lang', this.lang);
            document.documentElement.setAttribute('dir', this.lang === 'ar' ? 'rtl' : 'ltr');
            localStorage.setItem('lang', this.lang);
            this.updateUIStrings();
            this.handleRoute(); // Re-render content with new lang
        });
        
        // Routing via History API (pushState) or hash (local file://)
        window.addEventListener('popstate', () => this.handleRoute());
        window.addEventListener('hashchange', () => this.handleRoute());

        // Intercept all internal link clicks for SPA navigation (no page reload)
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            if (!a) return;
            const href = a.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || a.hasAttribute('download')) return;
            e.preventDefault();
            this.navigate(href);
        });
    }

    navigate(path) {
        if (this.isLocal) {
            window.location.hash = '#' + path;
        } else {
            history.pushState(null, '', path);
            this.handleRoute();
        }
    }
    
    updateUIStrings() {
        const appName = this.strings['app_name'][this.lang];
        document.getElementById('logo-text').innerHTML = `${appName}<span class="dot">.</span>`;
        document.getElementById('lang-toggle').textContent = this.lang === 'ar' ? 'EN' : 'عربي';
        
        // Footer updates
        const fLogo = document.getElementById('footer-logo-text');
        if (fLogo) fLogo.innerHTML = `${appName}<span class="dot">.</span>`;
        
        const fSlogan = document.getElementById('footer-slogan');
        if (fSlogan) fSlogan.textContent = this.lang === 'ar' ? 'أدواتك اليومية المفضلة، أسرع وأكثر أماناً.' : 'Your favorite daily tools, faster and safer.';
        
        const fCredit = document.getElementById('footer-credit');
        if (fCredit) {
            if (this.lang === 'ar') {
                fCredit.innerHTML = `تم التصميم بواسطة <span class="heart">❤</span> بهاء الدين &copy; 2026`;
            } else {
                fCredit.innerHTML = `Designed by <span class="heart">❤</span> BahaUlddin &copy; 2026`;
            }
        }
        
        // Footer links
        const linkAbout = document.getElementById('link-about');
        const linkPrivacy = document.getElementById('link-privacy');
        const linkTerms = document.getElementById('link-terms');
        if (linkAbout) linkAbout.textContent = this.lang === 'ar' ? 'عن الموقع' : 'About Us';
        if (linkPrivacy) linkPrivacy.textContent = this.lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy';
        if (linkTerms) linkTerms.textContent = this.lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Use';
    }
    
    setupBackToTop() {
        const btn = document.getElementById('back-to-top');
        if(!btn) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    handleRoute() {
        const path = this.isLocal
            ? (window.location.hash.replace(/^#/, '') || '/')
            : window.location.pathname;
        const content = document.getElementById('app-content');
        
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        content.classList.remove('fade-in');
        void content.offsetWidth;
        content.classList.add('fade-in');

        if (this.currentTool && this.loadedTools[this.currentTool] && this.loadedTools[this.currentTool].cleanup) {
            this.loadedTools[this.currentTool].cleanup();
        }
        this.currentTool = null;

        if (path === '/' || path === '' || path.endsWith('/index.html') || path.endsWith('\\index.html')) {
            this.renderHome(content);
            this.updateSEO(this.strings['app_name'][this.lang], this.strings['app_desc'][this.lang], 'https://my-tools.online/');
        } else if (path.startsWith('/tools/')) {
            const toolId = path.replace('/tools/', '');
            this.loadAndRenderTool(toolId, content);
        } else if (path === '/about' || path === '/privacy' || path === '/terms') {
            this.renderStaticPage(path.slice(1), content);
        } else {
            content.innerHTML = `<h2 style="text-align:center; padding: 4rem;">404 - ${this.strings['not_found'][this.lang]}</h2>`;
        }
    }
    
    renderStaticPage(pageId, container) {
        const pages = {
            'about': {
                title: { ar: 'عن الموقع', en: 'About Us' },
                content: {
                    ar: `<h3>👋 مرحباً بك في أدواتي (My Tools)</h3>
                         <p>منصة "أدواتي" هي الوجهة الأولى والشاملة التي تجمع لك كافة الأدوات الرقمية التي تحتاجها في حياتك اليومية، سواء كنت طالباً، موظفاً، مستقلاً، أو مطوراً. هدفنا هو تبسيط مهامك اليومية من خلال واجهة واحدة سهلة الاستخدام.</p>
                         
                         <h3>🚀 رؤيتنا ومهمتنا</h3>
                         <p>في عالم مليء بالتطبيقات المعقدة والإعلانات المزعجة، قررنا بناء منصة <strong>خالية تماماً من المشتتات</strong>. مهمتنا هي توفير أدوات سريعة، دقيقة، ومجانية للجميع. نحن نؤمن بأن الوصول للأدوات الأساسية (مثل تحويل الملفات، الحسابات المالية، أدوات النصوص، وغيرها) يجب أن يكون متاحاً للجميع بنقرة زر وبدون أي تعقيد.</p>
                         
                         <h3>🔒 الخصوصية والتقنية (Client-Side Only)</h3>
                         <p>أكثر ما يميز "أدواتي" هو التزامنا الصارم بخصوصيتك. لقد قمنا ببناء هذه المنصة باستخدام تقنيات تعتمد بالكامل على متصفحك (Client-Side). ماذا يعني هذا؟</p>
                         <ul>
                            <li><strong>لا خوادم (No Servers):</strong> لا نقوم برفع ملفاتك أو نصوصك أو صورك إلى أي سيرفر خارجي.</li>
                            <li><strong>معالجة محلية:</strong> جميع عمليات الضغط، التحويل، والتعديل تتم مباشرة داخل ذاكرة جهازك الشخصي.</li>
                            <li><strong>العمل بدون إنترنت (Offline):</strong> بفضل تقنية PWA، يمكنك استخدام الموقع والأدوات حتى عند انقطاع الاتصال بالإنترنت!</li>
                         </ul>
                         
                         <h3>💡 مجاني ومستدام</h3>
                         <p>المنصة مجانية 100% ولا تتطلب أي اشتراكات أو إنشاء حسابات. يمكنك الدخول وإنجاز مهامك في ثوانٍ والمغادرة. نتمنى أن تساهم أدواتنا في توفير وقتك وزيادة إنتاجيتك!</p>`,
                         
                    en: `<h3>👋 Welcome to My Tools</h3>
                         <p>"My Tools" is your comprehensive, all-in-one platform gathering every digital tool you might need in your daily life—whether you are a student, employee, freelancer, or developer. Our goal is to simplify your daily tasks through one easy-to-use interface.</p>
                         
                         <h3>🚀 Our Vision & Mission</h3>
                         <p>In a world full of complex apps and annoying ads, we decided to build a platform that is <strong>completely distraction-free</strong>. Our mission is to provide fast, accurate, and free tools for everyone. We believe that access to essential tools (like file conversion, financial calculators, text tools, etc.) should be available to everyone with a single click and without any hassle.</p>
                         
                         <h3>🔒 Privacy & Technology (Client-Side Only)</h3>
                         <p>What distinguishes "My Tools" most is our strict commitment to your privacy. We built this platform using strictly browser-based (Client-Side) technologies. What does this mean?</p>
                         <ul>
                            <li><strong>No Servers:</strong> We never upload your files, texts, or images to any external server.</li>
                            <li><strong>Local Processing:</strong> All compression, conversion, and editing happen directly inside your device's memory.</li>
                            <li><strong>Offline Capability:</strong> Thanks to PWA technology, you can use the site and its tools even without an internet connection!</li>
                         </ul>
                         
                         <h3>💡 Free and Sustainable</h3>
                         <p>The platform is 100% free and requires no subscriptions or account creation. You can drop in, get your task done in seconds, and leave. We hope our tools save you time and boost your productivity!</p>`
                }
            },
            'privacy': {
                title: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
                content: {
                    ar: `<h3>1. مقدمة</h3>
                         <p>في "أدواتي"، تعتبر خصوصيتك أولوية قصوى بالنسبة لنا. صممنا هذه المنصة منذ اليوم الأول لتكون آمنة تماماً ولا تشكل أي خطر على بياناتك الشخصية أو ملفاتك الحساسة.</p>
                         
                         <h3>2. جمع واستخدام البيانات (Data Collection)</h3>
                         <p><strong>نحن لا نجمع، لا نخزن، ولا نشارك</strong> أي بيانات شخصية، نصوص، صور، أو ملفات تقوم بإدخالها في الموقع. هندسة الموقع مبنية لتكون (Client-Side)، أي أن متصفحك هو من يقوم بكل العمل، ولا يتم إرسال أي بايت من بياناتك إلى خوادمنا.</p>
                         
                         <h3>3. التخزين المحلي (Local Storage)</h3>
                         <p>لتحسين تجربة استخدامك، نستخدم خاصية التخزين المحلي (Local Storage) المتواجدة في متصفحك فقط لحفظ بعض الإعدادات، مثل:</p>
                         <ul>
                            <li>الوضع الليلي أو النهاري (Dark/Light Theme).</li>
                            <li>اللغة المفضلة (عربي/إنجليزي).</li>
                            <li>بعض التفضيلات الطفيفة للأدوات (مثل الروابط المحفوظة أو المهام في قائمة المهام).</li>
                         </ul>
                         <p>هذه البيانات تبقى في جهازك فقط، ويمكنك مسحها في أي وقت من إعدادات المتصفح الخاص بك.</p>
                         
                         <h3>4. ملفات تعريف الارتباط (Cookies)</h3>
                         <p>الموقع لا يستخدم ملفات تعريف ارتباط تتبعية (Tracking Cookies) لتعقب نشاطك على الإنترنت. قد نستخدم فقط تقنيات أساسية جداً لضمان عمل الموقع بشكل سليم.</p>
                         
                         <h3>5. التعديلات على سياسة الخصوصية</h3>
                         <p>نحتفظ بالحق في تحديث سياسة الخصوصية هذه من وقت لآخر. إذا قمنا بأي تغييرات جوهرية، سيتم تحديث هذه الصفحة فوراً. استمرارك في استخدام الموقع يعني موافقتك على سياستنا.</p>`,
                         
                    en: `<h3>1. Introduction</h3>
                         <p>At "My Tools", your privacy is our utmost priority. We designed this platform from day one to be completely secure and pose no risk to your personal data or sensitive files.</p>
                         
                         <h3>2. Data Collection and Use</h3>
                         <p><strong>We do not collect, store, or share</strong> any personal data, texts, images, or files you input into the site. The architecture of the site is built to be Client-Side, meaning your browser does all the work, and not a single byte of your data is ever sent to our servers.</p>
                         
                         <h3>3. Local Storage</h3>
                         <p>To enhance your user experience, we use your browser's Local Storage solely to save certain settings, such as:</p>
                         <ul>
                            <li>Dark or Light Theme preference.</li>
                            <li>Preferred language (Arabic/English).</li>
                            <li>Minor tool preferences (like saved links or tasks in the To-Do list).</li>
                         </ul>
                         <p>This data remains strictly on your device, and you can clear it at any time from your browser settings.</p>
                         
                         <h3>4. Cookies</h3>
                         <p>The site does not use tracking cookies to monitor your internet activity. We only use highly essential technologies to ensure the site functions properly.</p>
                         
                         <h3>5. Changes to Privacy Policy</h3>
                         <p>We reserve the right to update this privacy policy from time to time. If we make any material changes, this page will be updated immediately. Your continued use of the site signifies your acceptance of our policy.</p>`
                }
            },
            'terms': {
                title: { ar: 'شروط الاستخدام', en: 'Terms of Use' },
                content: {
                    ar: `<h3>1. قبول الشروط</h3>
                         <p>مرحباً بك في موقع "أدواتي". بوصولك واستخدامك لهذا الموقع، فإنك تقر بأنك قد قرأت وفهمت وتوافق على الالتزام بجميع هذه الشروط والأحكام. إذا كنت لا توافق على هذه الشروط، يُرجى عدم استخدام الموقع.</p>
                         
                         <h3>2. طبيعة الخدمة والاستخدام المسموح</h3>
                         <p>نحن نوفر مجموعة من الأدوات الرقمية المجانية. يُسمح لك باستخدام هذه الأدوات للأغراض الشخصية والتجارية المشروعة. يُمنع منعاً باتاً استخدام أي من هذه الأدوات لأغراض غير قانونية، احتيالية، أو تضر بالآخرين.</p>
                         
                         <h3>3. إخلاء المسؤولية (Disclaimer)</h3>
                         <p>يتم توفير جميع الأدوات والمعلومات في هذا الموقع على أساس "كما هي" (As Is) دون أي ضمانات صريحة أو ضمنية. نحن نبذل قصارى جهدنا لضمان دقة الحسابات وعمل الأدوات، ولكننا <strong>لا نتحمل أي مسؤولية قانونية</strong> عن أي أخطاء، فقدان للبيانات، أو أضرار مباشرة أو غير مباشرة تنتج عن استخدام أدواتنا (بما في ذلك الحاسبات المالية أو الطبية).</p>
                         
                         <h3>4. الملكية الفكرية</h3>
                         <p>جميع حقوق التصميم، الأكواد البرمجية، والهيكل العام للموقع هي ملكية خاصة لمطوري منصة "أدواتي". يُمنع نسخ أو استنساخ كود الموقع واستخدامه في مشاريع تجارية أخرى بدون إذن مسبق.</p>
                         
                         <h3>5. انقطاع الخدمة والتعديلات</h3>
                         <p>نحتفظ بالحق في تعديل، إيقاف، أو تحديث أي أداة أو جزء من الموقع في أي وقت دون إشعار مسبق. لن نكون مسؤولين تجاهك أو تجاه أي طرف ثالث عن أي تعديل أو إيقاف للخدمة.</p>
                         
                         <h3>6. القانون المطبق</h3>
                         <p>تخضع هذه الشروط والأحكام للقوانين المعمول بها، وأي نزاع يتعلق باستخدام هذا الموقع يخضع للاختصاص الحصري للمحاكم المختصة.</p>`,
                         
                    en: `<h3>1. Acceptance of Terms</h3>
                         <p>Welcome to "My Tools". By accessing and using this site, you acknowledge that you have read, understood, and agree to be bound by all these terms and conditions. If you do not agree, please do not use the site.</p>
                         
                         <h3>2. Nature of Service and Permitted Use</h3>
                         <p>We provide a suite of free digital tools. You are allowed to use these tools for legitimate personal and commercial purposes. It is strictly prohibited to use any of these tools for illegal, fraudulent, or harmful purposes.</p>
                         
                         <h3>3. Disclaimer</h3>
                         <p>All tools and information on this site are provided on an "As Is" basis without any warranties, express or implied. While we strive to ensure the accuracy of calculations and the proper functioning of tools, we <strong>assume no legal liability</strong> for any errors, data loss, or direct or indirect damages resulting from the use of our tools (including financial or medical calculators).</p>
                         
                         <h3>4. Intellectual Property</h3>
                         <p>All design rights, source code, and the overall structure of the site are the exclusive property of the "My Tools" developers. Copying or cloning the site's code for use in other commercial projects without prior permission is prohibited.</p>
                         
                         <h3>5. Service Interruption and Modifications</h3>
                         <p>We reserve the right to modify, suspend, or update any tool or part of the site at any time without prior notice. We shall not be liable to you or any third party for any modification or suspension of the service.</p>
                         
                         <h3>6. Governing Law</h3>
                         <p>These terms and conditions are governed by applicable laws, and any dispute relating to the use of this site is subject to the exclusive jurisdiction of the competent courts.</p>`
                }
            }
        };

        const page = pages[pageId];
        this.updateSEO(`${page.title[this.lang]} | ${this.strings['app_name'][this.lang]}`, '', window.location.href);

        container.innerHTML = `
            <div class="tool-view-header">
                <a href="/" class="back-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    ${this.strings['back'][this.lang]}
                </a>
            </div>
            <div class="glass-panel" style="max-width: 900px; margin: 0 auto; padding: 3rem;">
                <h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 3rem; text-align: center; background: linear-gradient(135deg, var(--text-primary), var(--accent-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${page.title[this.lang]}</h1>
                <div class="static-page-content">
                    ${page.content[this.lang]}
                </div>
            </div>
        `;
    }
    
    renderHome(container) {
        let html = `
            <div style="text-align: center; margin-bottom: 3.5rem; margin-top: 1rem;">
                <h1 style="font-size: 4rem; font-weight: 800; margin-bottom: 1rem; background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-color) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -2px;">${this.strings['app_name'][this.lang]}</h1>
                <p style="color: var(--text-secondary); font-size: 1.2rem; max-width: 650px; margin: 0 auto; line-height: 1.6; font-weight: 400;">
                    ${this.strings['app_desc'][this.lang]}
                </p>
            </div>
        `;
        
        const allText = this.lang === 'ar' ? 'كل الأدوات' : 'All Tools';
        
        html += `<div class="categories-nav">`;
        html += `<button class="cat-tab active" data-cat="all">${allText}</button>`;
        for (const [catId, catObj] of Object.entries(this.categories)) {
            html += `<button class="cat-tab" data-cat="${catId}">${catObj[this.lang]}</button>`;
        }
        html += `</div>`;
        
        // Search Bar
        const searchPlaceholder = this.lang === 'ar' ? 'ابحث عن أداة...' : 'Search for a tool...';
        html += `
            <div class="search-container">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" id="tool-search" class="search-input" placeholder="${searchPlaceholder}">
            </div>
        `;
        
        html += `<div class="tools-grid">`;
        
        const colors = [
            '59, 130, 246', // blue
            '245, 158, 11', // amber
            '139, 92, 246', // violet
            '16, 185, 129', // emerald
            '6, 182, 212',  // cyan
            '239, 68, 68',  // red
            '236, 72, 153'  // pink
        ];

        this.registry.forEach((tool, index) => {
            const title = tool.title ? tool.title[this.lang] : tool.id;
            const desc = tool.desc ? tool.desc[this.lang] : '';
            const colorRgb = colors[index % colors.length];
            
            html += `
                <a href="/tools/${tool.id}" class="tool-card" data-cat="${tool.category}" style="--c-rgb: ${colorRgb};">
                    <div class="tool-card-icon">${tool.icon || '🛠'}</div>
                    <div class="tool-card-title">${title}</div>
                    <div class="tool-card-desc">${desc}</div>
                </a>
            `;
        });
        html += `</div>`;
        
        const faqs = [
            {
                q: { ar: 'هل الموقع مجاني فعلاً؟', en: 'Is the site really free?' },
                a: { ar: 'نعم، المنصة مجانية 100% ولا توجد أي رسوم خفية أو اشتراكات.', en: 'Yes, the platform is 100% free with no hidden fees or subscriptions.' }
            },
            {
                q: { ar: 'هل ملفاتي آمنة وخاصة؟', en: 'Are my files safe and private?' },
                a: { ar: 'بالتأكيد. جميع الأدوات تعمل محلياً (Client-Side) على متصفحك. لا يتم رفع أي ملفات أو صور أو بيانات لأي سيرفر.', en: 'Absolutely. All tools run locally (Client-Side) on your browser. No files, images, or data are ever uploaded to any server.' }
            },
            {
                q: { ar: 'ما صيغ الملفات المدعومة؟', en: 'What file formats are supported?' },
                a: { ar: 'ندعم معظم الصيغ الشائعة: للصور (JPG, PNG, WEBP) وللمستندات (PDF, TXT) وللفيديو (MP4, WebM).', en: 'We support most common formats: images (JPG, PNG, WEBP), documents (PDF, TXT), and video (MP4, WebM).' }
            },
            {
                q: { ar: 'كيف يعمل التلخيص بالذكاء الاصطناعي؟', en: 'How does AI summarization work?' },
                a: { ar: 'نعتمد على واجهات ذكية وتقنيات متقدمة لتحليل النصوص محلياً متى ما أمكن، مما يوفر لك تلخيصاً دقيقاً وسريعاً لبياناتك.', en: 'We rely on smart interfaces and advanced techniques to analyze text locally whenever possible, providing you with an accurate and fast summary of your data.' }
            },
            {
                q: { ar: 'هل هناك حد لحجم الملف؟', en: 'Is there a file size limit?' },
                a: { ar: 'نظراً لأن المعالجة تتم على جهازك، فالحد الأقصى يعتمد على سعة ذاكرة جهازك (RAM). بشكل عام يفضل ألا تتجاوز الملفات 50 ميجابايت لأفضل أداء.', en: 'Since processing happens on your device, the limit depends on your device memory (RAM). Generally, it is best not to exceed 50MB for optimal performance.' }
            },
            {
                q: { ar: 'هل يمكنني استخدام الموقع على الهاتف؟', en: 'Can I use the site on my phone?' },
                a: { ar: 'نعم! المنصة مصممة لتكون متجاوبة تماماً مع جميع الأجهزة (الهواتف، الأجهزة اللوحية، الكمبيوتر). يمكنك أيضاً تثبيته كتطبيق.', en: 'Yes! The platform is designed to be fully responsive across all devices (phones, tablets, PCs). You can also install it as an app.' }
            },
            {
                q: { ar: 'هل أحتاج إنشاء حساب؟', en: 'Do I need to create an account?' },
                a: { ar: 'لا، لا حاجة لإنشاء حساب إطلاقاً. يمكنك البدء في استخدام جميع الأدوات فور دخولك للموقع.', en: 'No, there is absolutely no need to create an account. You can start using all tools right after entering the site.' }
            },
            {
                q: { ar: 'ما اللغات التي يدعمها الموقع؟', en: 'What languages does the site support?' },
                a: { ar: 'ندعم اللغتين العربية والإنجليزية بشكل كامل لتوفير أفضل تجربة لجميع المستخدمين.', en: 'We fully support both Arabic and English to provide the best experience for all users.' }
            }
        ];

        const reviews = [
            {
                name: { ar: 'أحمد محمود', en: 'Ahmed Mahmoud' },
                role: { ar: 'مطور ويب', en: 'Web Developer' },
                text: { ar: 'مجموعة أدوات مذهلة! أكثر ما أعجبني هو السرعة الفائقة وحقيقة أن كل شيء يعمل في المتصفح دون الحاجة للإنترنت.', en: 'Amazing toolset! What I liked most is the blazing speed and the fact that everything works in the browser without needing internet.' }
            },
            {
                name: { ar: 'سارة خالد', en: 'Sarah Khaled' },
                role: { ar: 'مصممة جرافيك', en: 'Graphic Designer' },
                text: { ar: 'أدوات الصور والوسائط أنقذت الكثير من وقتي. تحويل الصيغ وضغط الصور يتم في ثوانٍ معدودة وبجودة رائعة.', en: 'The image and media tools saved me so much time. Format conversion and compression are done in seconds with great quality.' }
            },
            {
                name: { ar: 'د. يوسف علي', en: 'Dr. Youssef Ali' },
                role: { ar: 'باحث أكاديمي', en: 'Academic Researcher' },
                text: { ar: 'أدوات النصوص والـ PDF غنية جداً. الموقع مرتب وسهل الاستخدام، أعتمد عليه يومياً في أبحاثي.', en: 'Text and PDF tools are very rich. The site is neat and easy to use, I rely on it daily for my research.' }
            }
        ];
        
        // Add FAQ Section
        html += `<section class="extra-section">
            <h2 class="section-title">${this.lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h2>
            <div class="faq-grid">`;
        faqs.forEach(f => {
            html += `
                <div class="faq-card">
                    <h3 class="faq-q">
                        <span style="display:flex; align-items:center; gap:0.5rem;"><span class="faq-icon">?</span>${f.q[this.lang]}</span>
                        <svg class="faq-chevron" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </h3>
                    <div class="faq-a-wrapper">
                        <p class="faq-a">${f.a[this.lang]}</p>
                    </div>
                </div>
            `;
        });
        html += `</div></section>`;

        // Add Testimonials Section
        html += `<section class="extra-section">
            <h2 class="section-title">${this.lang === 'ar' ? 'ماذا يقول المستخدمون؟' : 'What Users Say'}</h2>
            <div class="reviews-grid">`;
        reviews.forEach(r => {
            html += `
                <div class="review-card">
                    <div class="review-text">"${r.text[this.lang]}"</div>
                    <div class="review-author">
                        <div class="review-avatar">${r.name[this.lang].charAt(0)}</div>
                        <div>
                            <div class="review-name">${r.name[this.lang]}</div>
                            <div class="review-role">${r.role[this.lang]}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div></section>`;

        container.innerHTML = html;
        
        // Add event listeners for category filtering
        const tabs = container.querySelectorAll('.cat-tab');
        const cards = container.querySelectorAll('.tool-card');
        const searchInput = container.querySelector('#tool-search');
        
        const filterCards = () => {
            const activeTab = container.querySelector('.cat-tab.active');
            const selectedCat = activeTab ? activeTab.getAttribute('data-cat') : 'all';
            const query = searchInput.value.toLowerCase().trim();
            
            cards.forEach(card => {
                const title = card.querySelector('.tool-card-title').textContent.toLowerCase();
                const desc = card.querySelector('.tool-card-desc').textContent.toLowerCase();
                const cat = card.getAttribute('data-cat');
                
                const matchCat = (selectedCat === 'all' || cat === selectedCat);
                const matchQuery = (!query || title.includes(query) || desc.includes(query));
                
                if (matchCat && matchQuery) {
                    card.style.display = 'flex';
                    // only re-animate if it was hidden
                    if (card.style.opacity === '0') {
                        card.style.animation = 'none';
                        card.offsetHeight;
                        card.style.animation = 'fadeIn 0.3s ease forwards';
                    }
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        };
        
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                filterCards();
            });
        });
        
        if(searchInput) {
            searchInput.addEventListener('input', filterCards);
        }

        // FAQ Accordion Logic
        const faqCardsList = container.querySelectorAll('.faq-card');
        faqCardsList.forEach(card => {
            const q = card.querySelector('.faq-q');
            q.addEventListener('click', () => {
                const isActive = card.classList.contains('active');
                // Close all
                faqCardsList.forEach(c => c.classList.remove('active'));
                // Open clicked if it wasn't active
                if (!isActive) {
                    card.classList.add('active');
                }
            });
        });
    }
    
    loadAndRenderTool(toolId, container) {
        const toolEntry = this.registry.find(t => t.id === toolId);
        if (!toolEntry) {
            container.innerHTML = `<h2 style="text-align:center; padding: 4rem;">${this.strings['not_found'][this.lang]}</h2>`;
            return;
        }
        
        if (this.loadedTools[toolId]) {
            this.renderTool(toolId);
        } else {
            // Show loading state
            container.innerHTML = `<div style="text-align:center; padding: 4rem; color: var(--text-secondary); font-size: 1.2rem;">${this.strings['loading'][this.lang]}</div>`;
            
            this.pendingToolRender = toolId;
            
            // Dynamically inject script
            const script = document.createElement('script');
            const srcPath = toolEntry.path.startsWith('/') ? toolEntry.path : '/' + toolEntry.path;
            script.src = srcPath;
            script.onerror = () => {
                container.innerHTML = `<h2 style="text-align:center; padding: 4rem; color: #ef4444;">${this.strings['load_failed'][this.lang]}</h2>`;
                this.pendingToolRender = null;
            };
            document.body.appendChild(script);
        }
    }
    
    renderTool(toolId) {
        this.currentTool = toolId;
        const toolEntry = this.registry.find(t => t.id === toolId);
        const config = this.loadedTools[toolId];
        const container = document.getElementById('app-content');
        
        const title = toolEntry.title ? toolEntry.title[this.lang] : toolId;
        const seoData = (window.SEO_REGISTRY && window.SEO_REGISTRY[toolId]) ? window.SEO_REGISTRY[toolId] : {};
        const desc = (config.meta_desc && config.meta_desc[this.lang])
            ? config.meta_desc[this.lang]
            : (seoData.desc && seoData.desc[this.lang])
            ? seoData.desc[this.lang]
            : (toolEntry.desc ? toolEntry.desc[this.lang] : '');
        const _kw = (k) => Array.isArray(k) ? k.join(', ') : (k || '');
        const keywords = (config.keywords && config.keywords[this.lang])
            ? _kw(config.keywords[this.lang])
            : (seoData.keywords && seoData.keywords[this.lang])
            ? _kw(seoData.keywords[this.lang])
            : '';
        const features = (config.features && config.features[this.lang]) ? config.features[this.lang] : [];
        const appName = this.strings['app_name'][this.lang];
        
        // Update SEO Tags
        this.updateSEO(`${title} | ${appName}`, desc, window.location.href, keywords, features);
        
        // Get related tools from the same category
        const relatedTools = this.registry
            .filter(t => t.category === toolEntry.category && t.id !== toolId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
            
        let relatedHtml = '';
        if (relatedTools.length > 0) {
            relatedHtml = `
                <div class="related-tools-section" style="margin-top: 4rem;">
                    <h2 class="tool-view-title" style="font-size: 2rem; margin-bottom: 1.5rem;">${this.lang === 'ar' ? 'أدوات ذات صلة' : 'Related Tools'}</h2>
                    <div class="tools-grid">
                        ${relatedTools.map((t, idx) => {
                            const rtTitle = t.title ? t.title[this.lang] : t.id;
                            const rtDesc = t.desc ? t.desc[this.lang] : '';
                            const colors = ['59, 130, 246', '245, 158, 11', '139, 92, 246'];
                            return `
                                <a href="/tools/${t.id}" class="tool-card" style="--c-rgb: ${colors[idx % colors.length]};">                                    <div class="tool-card-icon">${t.icon || '🛠'}</div>
                                    <div class="tool-card-title">${rtTitle}</div>
                                    <div class="tool-card-desc">${rtDesc}</div>
                                </a>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        let categorySeoText = '';
        let howToSteps = '';

        if (toolEntry.category === 'pdf') {
            categorySeoText = this.lang === 'ar' ? 
                `تعتبر أدوات الـ PDF الخاصة بنا من أقوى الحلول المتاحة عبر الإنترنت للتعامل مع المستندات. سواء كنت طالباً، موظفاً، أو محترفاً، ستساعدك أداة "<strong>${title}</strong>" على توفير الوقت والجهد في إدارة وتنسيق ملفاتك. تضمن لك هذه الأداة المتقدمة الحفاظ على تنسيق المستند الأصلي بجودة عالية وبدون أي فقدان للبيانات، مما يجعلها الخيار الأول والموثوق للمهام المكتبية اليومية.` :
                `Our PDF tools are among the most powerful online solutions for document management. Whether you are a student, employee, or professional, the "<strong>${title}</strong>" tool will save you time and effort. This advanced tool guarantees retaining the original document formatting in high quality without any data loss, making it the top trusted choice for daily office tasks.`;
            howToSteps = this.lang === 'ar' ? 
                `<li style="margin-bottom: 0.5rem;">اختر ملف الـ PDF المطلوب أو قم بسحبه وإفلاته في المربع المخصص للرفع.</li>
                 <li style="margin-bottom: 0.5rem;">حدد الصفحات، التنسيق، أو الخيارات المطلوبة وفقاً لحاجتك بدقة.</li>
                 <li style="margin-bottom: 0.5rem;">انقر على زر التنفيذ وحمّل المستند النهائي المعالج مباشرة إلى جهازك الشخصي.</li>` :
                `<li style="margin-bottom: 0.5rem;">Select your PDF file or drag and drop it into the upload box.</li>
                 <li style="margin-bottom: 0.5rem;">Choose the specific pages, format, or options accurately according to your needs.</li>
                 <li style="margin-bottom: 0.5rem;">Click execute and download the final processed document directly to your device.</li>`;
                 
        } else if (toolEntry.category === 'media' || toolEntry.category === 'images') {
            categorySeoText = this.lang === 'ar' ? 
                `في عصر المحتوى الرقمي المتسارع، تعتبر معالجة الوسائط وتعديلها أمراً حيوياً للمصممين وصناع المحتوى. صُممت أداة "<strong>${title}</strong>" خصيصاً لتمنحك تحكماً كاملاً ومرناً في ملفات الوسائط الخاصة بك. استمتع بسرعة المعالجة الفائقة، الحفاظ على دقة الألوان، والجودة المتناهية التي تغنيك عن تنزيل برامج ثقيلة ومعقدة تأخذ مساحة من حاسوبك.` :
                `In the era of fast-paced digital content, media processing is vital for designers and content creators. The "<strong>${title}</strong>" tool is specifically designed to give you full, flexible control over your media files. Enjoy lightning-fast processing, color accuracy preservation, and ultimate quality that saves you from downloading heavy, complex software.`;
            howToSteps = this.lang === 'ar' ? 
                `<li style="margin-bottom: 0.5rem;">قم برفع الصور أو ملفات الوسائط المراد تعديلها بالصيغة المدعومة.</li>
                 <li style="margin-bottom: 0.5rem;">اضبط إعدادات الجودة، الأبعاد، أو الصيغة الجديدة التي ترغب بالتحويل إليها.</li>
                 <li style="margin-bottom: 0.5rem;">ابدأ المعالجة وانتظر ثوانٍ معدودة لتحصل على ملفك جاهزاً ومحسناً للاستخدام.</li>` :
                `<li style="margin-bottom: 0.5rem;">Upload the images or media files you wish to edit in a supported format.</li>
                 <li style="margin-bottom: 0.5rem;">Adjust the quality settings, dimensions, or the new format you want to convert to.</li>
                 <li style="margin-bottom: 0.5rem;">Start processing and wait a few seconds to get your optimized file ready for use.</li>`;
                 
        } else if (toolEntry.category === 'text') {
            categorySeoText = this.lang === 'ar' ? 
                `التعامل المستمر مع النصوص والكلمات يتطلب دقة، سرعة، وموثوقية عالية. توفر لك أداة "<strong>${title}</strong>" حلاً سحرياً وفعالاً لمعالجة النصوص، إعادة تنسيقها، وتحليلها بشكل فوري وتلقائي. هذه الأداة مثالية للكتاب المبدعين، المبرمجين، وصناع المحتوى الذين يبحثون عن أداة موثوقة تعمل بدون إنترنت وبأقصى درجات الخصوصية.` :
                `Constant handling of texts and words requires high accuracy, speed, and reliability. The "<strong>${title}</strong>" tool provides a magical and effective solution to process, reformat, and analyze text instantly and automatically. This tool is perfect for creative writers, programmers, and content creators looking for a reliable, offline, and highly private utility.`;
            howToSteps = this.lang === 'ar' ? 
                `<li style="margin-bottom: 0.5rem;">قم بلصق النص المراد معالجته أو كتابته مباشرة في مربع النص المخصص.</li>
                 <li style="margin-bottom: 0.5rem;">اختر الخيار أو الفلتر المراد تطبيقه على النص من القوائم المتاحة.</li>
                 <li style="margin-bottom: 0.5rem;">انسخ النص المُعدّل والجاهز بنقرة زر واحدة واستخدمه مباشرة في مشروعك أو بحثك.</li>` :
                `<li style="margin-bottom: 0.5rem;">Paste the text to be processed or type it directly into the text box.</li>
                 <li style="margin-bottom: 0.5rem;">Select the option or filter you want to apply from the available menus.</li>
                 <li style="margin-bottom: 0.5rem;">Copy the modified and ready text with a single click and use it immediately in your project.</li>`;
                 
        } else if (toolEntry.category === 'dev') {
            categorySeoText = this.lang === 'ar' ? 
                `يحتاج المطورون والمبرمجون دائماً إلى أدوات مساعدة وفعالة تسرّع من وتيرة عملهم وتقلل من الأخطاء البرمجية الشائعة. من خلال استخدامك لأداة "<strong>${title}</strong>"، ستتمكن من إنجاز مهامك البرمجية الروتينية بسرعة لا تضاهى وبدقة خالية من العيوب. تم تصميم واجهة هذه الأداة لتكون نظيفة تماماً وخالية من المشتتات البصرية لضمان أعلى درجات التركيز والإنتاجية للمطور.` :
                `Developers and programmers always need effective utility tools that speed up their workflow and reduce common coding bugs. By using the "<strong>${title}</strong>" tool, you will be able to accomplish your routine programming tasks with unmatched speed and flawless accuracy. The interface is designed to be completely clean and visually distraction-free to ensure maximum focus and developer productivity.`;
            howToSteps = this.lang === 'ar' ? 
                `<li style="margin-bottom: 0.5rem;">أدخل الكود المصدري، الـ JSON، أو البيانات البرمجية في محرر النصوص الذكي.</li>
                 <li style="margin-bottom: 0.5rem;">تأكد من اختيار التنسيق المناسب أو نوع التشفير الذي ترغب في تنفيذه.</li>
                 <li style="margin-bottom: 0.5rem;">احصل على الكود المنسق، المشفر، أو النتيجة النهائية فوراً وقم بنسخه بضغطة واحدة.</li>` :
                `<li style="margin-bottom: 0.5rem;">Input your source code, JSON, or programming data into the smart text editor.</li>
                 <li style="margin-bottom: 0.5rem;">Make sure to select the appropriate format or encoding type you wish to execute.</li>
                 <li style="margin-bottom: 0.5rem;">Get your formatted code, encoded output, or final result instantly and copy it with one click.</li>`;
                 
        } else {
            // General fallback
            categorySeoText = this.lang === 'ar' ? 
                `تعتبر أداة "<strong>${title}</strong>" إضافة استثنائية وقوية جداً لمجموعة أدواتك الرقمية اليومية. لقد حرصنا في منصتنا على توفير تجربة مستخدم سلسة، تفاعلية، وخالية تماماً من التعقيدات التقنية المزعجة. بفضل الاعتماد الكلي على تقنية المعالجة المحلية المتقدمة (Client-Side Processing)، فإنك تحصل على استجابة فورية في أجزاء من الثانية وحماية تامة لبياناتك الشخصية، مما يجعل موقعنا الخيار الأمثل والآمن لمهامك اليومية.` :
                `The "<strong>${title}</strong>" tool is an exceptional and very powerful addition to your daily digital toolkit. We ensured our platform provides a seamless, interactive, and completely complication-free user experience. Thanks to the total reliance on advanced Client-Side Processing technology, you get instant millisecond response times and full protection of your personal data, making our site the perfect, secure choice for your daily tasks.`;
            howToSteps = this.lang === 'ar' ? 
                `<li style="margin-bottom: 0.5rem;">قم بإدخال البيانات المطلوبة، أو قم برفع الملف المستهدف في المكان المخصص أعلاه.</li>
                 <li style="margin-bottom: 0.5rem;">قم بمراجعة واختيار الإعدادات المناسبة لك لتحقيق النتيجة المرجوة (إن وجدت).</li>
                 <li style="margin-bottom: 0.5rem;">احصل على النتيجة النهائية فوراً وبشكل آمن بفضل معالجة المتصفح المباشرة والمستقلة.</li>` :
                `<li style="margin-bottom: 0.5rem;">Enter the required data, or upload the target file in the designated area above.</li>
                 <li style="margin-bottom: 0.5rem;">Review and select the appropriate settings to achieve your desired outcome (if applicable).</li>
                 <li style="margin-bottom: 0.5rem;">Get the final result instantly and securely thanks to direct and independent browser processing.</li>`;
        }

        const seoContent = `
            <div class="tool-seo-content static-page-content glass-panel" style="margin-top: 3rem; padding: 2.5rem; background: rgba(var(--surface-color), 0.5);">
                <h2 style="font-size: 1.5rem; color: var(--text-primary); margin-bottom: 1rem;">${this.lang === 'ar' ? `نظرة شاملة حول أداة: ${title}` : `Comprehensive Overview: ${title}`}</h2>
                <p style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1rem;">${desc}</p>
                <p>${categorySeoText}</p>
                
                <h2 style="font-size: 1.5rem; color: var(--text-primary); margin-top: 2.5rem; margin-bottom: 1rem;">${this.lang === 'ar' ? 'خطوات الاستخدام الصحيحة' : 'Step-by-Step Usage Guide'}</h2>
                <ol style="margin-bottom: 1.5rem; padding-inline-start: 1.5rem; color: var(--text-secondary); line-height: 1.8; font-size: 1.05rem;">
                    ${howToSteps}
                </ol>
                
                <h2 style="font-size: 1.5rem; color: var(--text-primary); margin-top: 2.5rem; margin-bottom: 1rem;">${this.lang === 'ar' ? 'لماذا منصة My Tools هي خيارك الأفضل؟' : 'Why My Tools is Your Best Choice?'}</h2>
                <p>${this.lang === 'ar' ? `نحن ندرك أهمية وقتك وخصوصيتك. لذلك تم هندسة أداة <strong>${title}</strong> لتكون سريعة جداً وتعمل حتى بدون اتصال بالإنترنت في حال بقاء الصفحة مفتوحة. الأهم من ذلك، خصوصيتك مضمونة بنسبة 100%؛ فنحن نطبق بروتوكولات حماية صارمة تعتمد على أن كافة عمليات المعالجة تتم داخل ذاكرة جهازك الشخصي فقط، ولا يتم إرسال، أو حفظ، أو تحليل أي بيانات عبر خوادم خارجية إطلاقاً.` : `We understand the importance of your time and privacy. Therefore, the <strong>${title}</strong> tool is engineered to be blazing fast and functional even offline if the page remains open. Most importantly, your privacy is 100% guaranteed; we implement strict security protocols ensuring all processing occurs solely within your personal device's memory, with zero data sent, saved, or analyzed via external servers.`}</p>
            </div>
            ${relatedHtml}
        `;

        // Setup shell
        container.innerHTML = `
            <div class="tool-view-header">
                <a href="/" class="back-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    ${this.strings['back'][this.lang]}
                </a>
            </div>
            <h1 class="tool-view-title">${title}</h1>
            <div id="tool-container" class="glass-panel"></div>
            ${seoContent}
        `;
        
        // Execute tool render logic
        if (config.render) {
            config.render(document.getElementById('tool-container'), this.lang);
        }
    }
    
    updateSEO(title, description, canonicalUrl, keywords = '', features = []) {
        // Document Title
        document.title = title;
        
        // Helper for meta tags
        const setMeta = (name, content, attr='name') => {
            if (!content) return;
            let el = document.querySelector(`meta[${attr}="${name}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };
        
        setMeta('description', description);
        if (keywords) setMeta('keywords', keywords);
        setMeta('og:title', title, 'property');
        setMeta('og:description', description, 'property');
        
        // Canonical URL
        let canon = document.querySelector('link[rel="canonical"]');
        if (!canon) {
            canon = document.createElement('link');
            canon.setAttribute('rel', 'canonical');
            document.head.appendChild(canon);
        }
        canon.setAttribute('href', canonicalUrl);
        
        // JSON-LD Structured Data
        let ld = document.getElementById('json-ld');
        if (ld) {
            const schema = {
                "@context": "https://schema.org",
                "@type": this.currentTool ? "SoftwareApplication" : "WebSite",
                "name": title,
                "description": description,
                "url": canonicalUrl
            };
            if (this.currentTool) {
                schema.applicationCategory = "UtilitiesApplication";
                schema.operatingSystem = "Any";
                if (features && features.length > 0) {
                    schema.featureList = features;
                }
            }
            ld.textContent = JSON.stringify(schema, null, 2);
        }
    }
}

// Bootstrap app
document.addEventListener('DOMContentLoaded', () => {
    window.appInstance = new App();
});
