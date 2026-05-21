window.TOOLS_REGISTRY = [
    {
        id: 'pdf-merger',
        path: 'tools/pdf-merger.js',
        category: 'pdf',
        title: { ar: 'دمج ملفات PDF', en: 'Merge PDF' },
        desc: { ar: 'دمج عدة ملفات PDF في ملف واحد بسهولة وسرعة.', en: 'Merge multiple PDF files into one easily and quickly.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line><line x1="12" y1="12" x2="12" y2="18"></line></svg>'
    },
    {
        id: 'image-to-pdf',
        path: 'tools/image-to-pdf.js',
        category: 'pdf',
        title: { ar: 'تحويل الصور إلى PDF', en: 'Images to PDF' },
        desc: { ar: 'تحويل مجموعة من الصور إلى ملف PDF واحد مع ترتيبها.', en: 'Convert a batch of images into a single PDF file with ordering.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'
    },
    {
        id: 'pdf-splitter',
        path: 'tools/pdf-splitter.js',
        category: 'pdf',
        title: { ar: 'تقسيم PDF', en: 'Split PDF' },
        desc: { ar: 'استخراج صفحات محددة من ملف PDF أو تقسيمه.', en: 'Extract specific pages from a PDF or split it.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="15" x2="16" y2="15"></line><line x1="12" y1="12" x2="12" y2="18" stroke-dasharray="2 2"></line></svg>'
    },
    {
        id: 'pdf-to-image',
        path: 'tools/pdf-to-image.js',
        category: 'pdf',
        title: { ar: 'PDF إلى صور', en: 'PDF to Images' },
        desc: { ar: 'تحويل صفحات PDF إلى صور عالية الجودة.', en: 'Convert PDF pages into high-quality images.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'
    },
    {
        id: 'pdf-viewer',
        path: 'tools/pdf-viewer.js',
        category: 'pdf',
        title: { ar: 'عارض PDF', en: 'PDF Viewer' },
        desc: { ar: 'عرض ملفات PDF وقراءتها بأمان داخل المتصفح.', en: 'View and read PDF files securely within the browser.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
    },
    {
        id: 'pdf-compress',
        path: 'tools/pdf-compress.js',
        category: 'pdf',
        title: { ar: 'ضغط PDF', en: 'Compress PDF' },
        desc: { ar: 'محاولة تقليل حجم ملف PDF للاستخدام عبر الويب.', en: 'Attempt to reduce PDF file size for web usage.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>'
    },
    {
        id: 'pdf-text-extract',
        path: 'tools/pdf-text-extract.js',
        category: 'pdf',
        title: { ar: 'استخراج النصوص', en: 'Extract Text' },
        desc: { ar: 'استخراج النصوص القابلة للنسخ من ملفات PDF.', en: 'Extract copyable text from PDF files.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
    },
    {
        id: 'pdf-watermark',
        path: 'tools/pdf-watermark.js',
        category: 'pdf',
        title: { ar: 'إضافة علامة مائية', en: 'Add Watermark' },
        desc: { ar: 'إضافة نص شفاف كعلامة مائية على صفحات PDF.', en: 'Add transparent text as a watermark on PDF pages.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><line x1="2" y1="12" x2="22" y2="12"></line></svg>'
    },
    {
        id: 'pdf-sign',
        path: 'tools/pdf-sign.js',
        category: 'pdf',
        title: { ar: 'إضافة توقيع', en: 'Sign PDF' },
        desc: { ar: 'رسم توقيعك وإضافته كصورة إلى وثيقة PDF.', en: 'Draw your signature and add it to a PDF document.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>'
    },
    {
        id: 'pdf-protect',
        path: 'tools/pdf-protect.js',
        category: 'pdf',
        title: { ar: 'تشفير وحماية', en: 'Protect PDF' },
        desc: { ar: 'إضافة أو إزالة كلمة مرور لملفات PDF.', en: 'Add or remove passwords from PDF files.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'
    },
    {
        id: 'pdf-to-word',
        path: 'tools/pdf-to-word.js',
        category: 'pdf',
        title: { ar: 'PDF إلى Word', en: 'PDF to Word' },
        desc: { ar: 'استخراج محتوى PDF وحفظه كمستند وورد قابل للتحرير.', en: 'Extract PDF content and save as editable Word doc.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 13l2 4 2-4m2 0l2 4 2-4"></path></svg>'
    },
    {
        id: 'word-to-pdf',
        path: 'tools/word-to-pdf.js',
        category: 'pdf',
        title: { ar: 'Word إلى PDF', en: 'Word to PDF' },
        desc: { ar: 'تحويل مستندات وورد (DOCX) إلى ملفات PDF.', en: 'Convert Word documents (DOCX) to PDF files.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 13h8M8 17h8"></path></svg>'
    },
    {
        id: 'pdf-to-ppt',
        path: 'tools/pdf-to-ppt.js',
        category: 'pdf',
        title: { ar: 'PDF إلى PowerPoint', en: 'PDF to PPT' },
        desc: { ar: 'تحويل صفحات PDF إلى شرائح عرض باوربوينت.', en: 'Convert PDF pages into PowerPoint slides.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><rect x="8" y="13" width="8" height="4"></rect></svg>'
    },
    {
        id: 'ppt-to-pdf',
        path: 'tools/ppt-to-pdf.js',
        category: 'pdf',
        title: { ar: 'PowerPoint إلى PDF', en: 'PPT to PDF' },
        desc: { ar: 'استخراج نصوص شرائح الباوربوينت وتحويلها لملف PDF.', en: 'Extract text from PPT slides and convert to PDF.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><rect x="8" y="11" width="8" height="4"></rect><line x1="12" y1="15" x2="12" y2="19"></line></svg>'
    },
    {
        id: 'pdf-metadata',
        path: 'tools/pdf-metadata.js',
        category: 'pdf',
        title: { ar: 'محرر بيانات PDF', en: 'PDF Metadata Editor' },
        desc: { ar: 'تعديل البيانات الوصفية لملفات PDF مثل العنوان والمؤلف.', en: 'Edit PDF metadata such as Title, Author, and Subject.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>'
    },
    {
        id: 'pdf-rotate',
        path: 'tools/pdf-rotate.js',
        category: 'pdf',
        title: { ar: 'تدوير PDF', en: 'Rotate PDF' },
        desc: { ar: 'تدوير صفحات PDF وتصحيح اتجاهها.', en: 'Rotate PDF pages and fix orientation.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.32-9.83l5.67-5.67"></path></svg>'
    },
    {
        id: 'pdf-remove-pages',
        path: 'tools/pdf-remove-pages.js',
        category: 'pdf',
        title: { ar: 'حذف صفحات PDF', en: 'Remove PDF Pages' },
        desc: { ar: 'حذف صفحات معينة من ملف PDF بسهولة.', en: 'Remove specific pages from a PDF file easily.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>'
    },
    {
        id: 'pdf-page-numbers',
        path: 'tools/pdf-page-numbers.js',
        category: 'pdf',
        title: { ar: 'ترقيم الصفحات', en: 'Add Page Numbers' },
        desc: { ar: 'إضافة أرقام الصفحات تلقائياً لملفات PDF.', en: 'Automatically add page numbers to PDF files.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><text x="12" y="16" text-anchor="middle" font-size="12" fill="currentColor" font-family="sans-serif">1</text></svg>'
    },
    {
        id: 'pdf-unlock',
        path: 'tools/pdf-unlock.js',
        category: 'pdf',
        title: { ar: 'فك حماية PDF', en: 'Unlock PDF' },
        desc: { ar: 'فك تشفير وإزالة كلمة المرور من ملفات PDF المفتوحة.', en: 'Decrypt and remove password from PDF files.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>'
    },
    {
        id: 'health-bmi',
        path: 'tools/health-bmi.js',
        category: 'health',
        title: { ar: 'حاسبة مؤشر الكتلة', en: 'BMI Calculator' },
        desc: { ar: 'حساب مؤشر كتلة الجسم لمعرفة الوزن المثالي وتصنيف الحالة الصحية.', en: 'Calculate Body Mass Index to find ideal weight and health status.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>'
    },
    {
        id: 'health-calories',
        path: 'tools/health-calories.js',
        category: 'health',
        title: { ar: 'حاسبة السعرات', en: 'Calorie Calculator' },
        desc: { ar: 'حساب احتياجك اليومي من السعرات الحرارية بناءً على نشاطك وأهدافك.', en: 'Calculate daily calorie needs based on activity and goals.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2c-3 4-5 8-5 12a5 5 0 0 0 10 0c0-4-2-8-5-12z"></path></svg>'
    },
    {
        id: 'health-water',
        path: 'tools/health-water.js',
        category: 'health',
        title: { ar: 'احتياج الماء', en: 'Water Intake' },
        desc: { ar: 'حساب الكمية المثالية للماء التي يحتاجها جسمك يومياً.', en: 'Calculate the ideal amount of water your body needs daily.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>'
    },
    {
        id: 'health-bodyfat',
        path: 'tools/health-bodyfat.js',
        category: 'health',
        title: { ar: 'حاسبة الدهون', en: 'Body Fat %' },
        desc: { ar: 'تقدير نسبة الدهون في الجسم باستخدام قياسات المحيط.', en: 'Estimate body fat percentage using circumference measurements.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>'
    },
    {
        id: 'health-ideal-weight',
        path: 'tools/health-ideal-weight.js',
        category: 'health',
        title: { ar: 'الوزن المثالي', en: 'Ideal Weight' },
        desc: { ar: 'تحديد نطاق الوزن المثالي والصحي بناءً على طولك.', en: 'Determine your ideal and healthy weight range based on height.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="12" y1="11" x2="12" y2="17"></line></svg>'
    },
    {
        id: 'health-macros',
        path: 'tools/health-macros.js',
        category: 'health',
        title: { ar: 'حاسبة الماكروز', en: 'Macro Calculator' },
        desc: { ar: 'توزيع السعرات إلى بروتين، كارب، ودهون حسب هدفك الرياضي.', en: 'Distribute calories into protein, carbs, and fat based on your goal.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>'
    },
    {
        id: 'health-1rm',
        path: 'tools/health-1rm.js',
        category: 'health',
        title: { ar: 'حاسبة أقصى رفعة', en: '1RM Calculator' },
        desc: { ar: 'حساب أقصى وزن يمكنك رفعه لمرة واحدة (1RM) في التمارين.', en: 'Calculate your One Rep Max (1RM) for weightlifting.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M6 5v14M18 5v14M4 7h4M16 7h4M4 17h4M16 17h4M6 12h12"></path></svg>'
    },
    {
        id: 'health-pregnancy',
        path: 'tools/health-pregnancy.js',
        category: 'health',
        title: { ar: 'موعد الولادة', en: 'Due Date Calc' },
        desc: { ar: 'حساب موعد الولادة المتوقع وأسابيع الحمل الحالية بدقة.', en: 'Calculate estimated due date and current pregnancy weeks.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg>'
    },
    {
        id: 'health-heartrate',
        path: 'tools/health-heartrate.js',
        category: 'health',
        title: { ar: 'نبضات القلب', en: 'Target Heart Rate' },
        desc: { ar: 'تحديد النطاق الأمثل لنبضات قلبك أثناء التمرين لحرق الدهون.', en: 'Determine your optimal target heart rate zones for exercising.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>'
    },
    {
        id: 'finance-budget',
        path: 'tools/finance-budget.js',
        category: 'finance',
        title: { ar: 'تتبع الميزانية', en: 'Budget Tracker' },
        desc: { ar: 'تتبع دخلك ومصروفاتك اليومية لمعرفة رصيدك المتبقي.', en: 'Track your daily income and expenses to know your balance.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>'
    },
    {
        id: 'finance-tax',
        path: 'tools/finance-tax.js',
        category: 'finance',
        title: { ar: 'حاسبة الضرائب', en: 'Tax Calculator' },
        desc: { ar: 'حساب صافي الدخل بعد خصم الضرائب والخصومات.', en: 'Calculate net income after deducting taxes and deductions.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>'
    },
    {
        id: 'finance-savings',
        path: 'tools/finance-savings.js',
        category: 'finance',
        title: { ar: 'حاسبة الادخار', en: 'Savings Calculator' },
        desc: { ar: 'حساب العوائد المستقبلية لمدخراتك مع الفائدة المركبة.', en: 'Calculate future returns on your savings with compound interest.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>'
    },
    {
        id: 'finance-crypto',
        path: 'tools/finance-crypto.js',
        category: 'finance',
        title: { ar: 'أسعار العملات الرقمية', en: 'Crypto Prices' },
        desc: { ar: 'تحويل ومتابعة أسعار العملات الرقمية مباشرة (يتطلب إنترنت).', en: 'Convert and track live crypto prices (requires internet).' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>'
    },
    {
        id: 'finance-compare',
        path: 'tools/finance-compare.js',
        category: 'finance',
        title: { ar: 'مقارنة الأسعار', en: 'Price Comparator' },
        desc: { ar: 'مقارنة أسعار المنتجات لمعرفة العرض الأوفر (سعر الوحدة).', en: 'Compare product prices to find the best deal (unit price).' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>'
    },
    {
        id: 'finance-loan',
        path: 'tools/finance-loan.js',
        category: 'finance',
        title: { ar: 'حاسبة القروض', en: 'Loan Calculator' },
        desc: { ar: 'حساب القسط الشهري للقرض وإجمالي الفوائد المستحقة.', en: 'Calculate monthly loan EMI and total interest payable.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>'
    },
    {
        id: 'finance-discount',
        path: 'tools/finance-discount.js',
        category: 'finance',
        title: { ar: 'الخصم والضريبة', en: 'Discount & VAT' },
        desc: { ar: 'حساب السعر النهائي بعد الخصم وإضافة ضريبة القيمة المضافة.', en: 'Calculate final price after discount and adding VAT.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>'
    },
    {
        id: 'finance-salary',
        path: 'tools/finance-salary.js',
        category: 'finance',
        title: { ar: 'محول الراتب', en: 'Salary Converter' },
        desc: { ar: 'تحويل الراتب بين أجر سنوي، شهري، ويومي أو بالساعة.', en: 'Convert salary between annual, monthly, daily, or hourly rates.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line><path d="M8 14h.01M12 14h.01M16 14h.01"></path></svg>'
    },
    {
        id: 'finance-inflation',
        path: 'tools/finance-inflation.js',
        category: 'finance',
        title: { ar: 'حاسبة التضخم', en: 'Inflation Calculator' },
        desc: { ar: 'حساب القوة الشرائية وتأثير التضخم على مدخراتك مستقبلاً.', en: 'Calculate purchasing power and inflation impact on savings.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>'
    },
    {
        id: 'prod-todo',
        path: 'tools/prod-todo.js',
        category: 'productivity',
        title: { ar: 'قائمة المهام', en: 'Todo List' },
        desc: { ar: 'إدارة مهامك اليومية بسهولة مع خاصية الحفظ التلقائي.', en: 'Manage your daily tasks easily with auto-save.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>'
    },
    {
        id: 'prod-notes',
        path: 'tools/prod-notes.js',
        category: 'productivity',
        title: { ar: 'الملاحظات السريعة', en: 'Quick Notes' },
        desc: { ar: 'كتابة وحفظ ملاحظاتك وأفكارك السريعة في المتصفح.', en: 'Write and save your quick notes and ideas in the browser.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
    },
    {
        id: 'prod-password',
        path: 'tools/prod-password.js',
        category: 'productivity',
        title: { ar: 'مولّد كلمات المرور', en: 'Password Generator' },
        desc: { ar: 'توليد كلمات مرور قوية وآمنة وقابلة للتخصيص.', en: 'Generate strong, secure, and customizable passwords.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'
    },
    {
        id: 'prod-links',
        path: 'tools/prod-links.js',
        category: 'productivity',
        title: { ar: 'منظم الروابط', en: 'Bookmark Manager' },
        desc: { ar: 'حفظ وتنظيم روابطك المهمة للوصول السريع إليها.', en: 'Save and organize your important links for quick access.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>'
    },
    {
        id: 'prod-pomodoro',
        path: 'tools/prod-pomodoro.js',
        category: 'productivity',
        title: { ar: 'مؤقت بومودورو', en: 'Pomodoro Timer' },
        desc: { ar: 'تعزيز تركيزك وإنتاجيتك باستخدام تقنية بومودورو.', en: 'Boost your focus and productivity using the Pomodoro technique.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
    },
    {
        id: 'prod-habit',
        path: 'tools/prod-habit.js',
        category: 'productivity',
        title: { ar: 'متتبع العادات', en: 'Habit Tracker' },
        desc: { ar: 'بناء وتتبع عاداتك اليومية مع حفظ تلقائي لمستواك.', en: 'Build and track your daily habits with auto-save.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>'
    },

    {
        id: 'prod-sounds',
        path: 'tools/prod-sounds.js',
        category: 'productivity',
        title: { ar: 'أصوات التركيز', en: 'Focus Sounds' },
        desc: { ar: 'مشغل أصوات طبيعية وضوضاء بيضاء للمساعدة في التركيز.', en: 'Play natural sounds and white noise to help focus.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3v4z"></path><path d="M3 19a2 2 0 0 0 2 2h1v-6H3v4z"></path></svg>'
    },
    {
        id: 'prod-whiteboard',
        path: 'tools/prod-whiteboard.js',
        category: 'productivity',
        title: { ar: 'السبورة البيضاء', en: 'Quick Whiteboard' },
        desc: { ar: 'لوحة رسم سريعة لتوضيح الأفكار والشخبطة بحرية.', en: 'Quick drawing board for sketching and explaining ideas.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'
    },
    {
        id: 'time-timer',
        path: 'tools/time-timer.js',
        category: 'time',
        title: { ar: 'ساعة توقف ومؤقت', en: 'Stopwatch & Timer' },
        desc: { ar: 'أداة لحساب الوقت المنقضي أو العد التنازلي بدقة.', en: 'Tool to track elapsed time or countdown accurately.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="13" r="8"></circle><polyline points="12 9 12 13 14 15"></polyline><line x1="12" y1="2" x2="12" y2="4"></line></svg>'
    },
    {
        id: 'time-zones',
        path: 'tools/time-zones.js',
        category: 'time',
        title: { ar: 'المناطق الزمنية', en: 'Timezones' },
        desc: { ar: 'تحويل الوقت ومقارنته بين مختلف مدن ودول العالم.', en: 'Convert and compare time across global cities.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>'
    },
    {
        id: 'time-diff',
        path: 'tools/time-diff.js',
        category: 'time',
        title: { ar: 'الفرق بين التواريخ', en: 'Date Difference' },
        desc: { ar: 'حساب المدة الدقيقة بين تاريخين بالأيام والشهور والسنوات.', en: 'Calculate exact duration between two dates.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'
    },
    {
        id: 'time-hijri',
        path: 'tools/time-hijri.js',
        category: 'time',
        title: { ar: 'التقويم الهجري', en: 'Hijri Calendar' },
        desc: { ar: 'تحويل التاريخ بين الهجري والميلادي وعرض التقويم.', en: 'Convert between Hijri and Gregorian dates.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
    },
    {
        id: 'time-events',
        path: 'tools/time-events.js',
        category: 'time',
        title: { ar: 'الأعياد والمناسبات', en: 'Events & Holidays' },
        desc: { ar: 'عد تنازلي لأهم المناسبات والأعياد القادمة.', en: 'Countdown to major upcoming events and holidays.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"></path></svg>'
    },
    {
        id: 'time-age',
        path: 'tools/time-age.js',
        category: 'time',
        title: { ar: 'حاسبة العمر التفصيلية', en: 'Detailed Age' },
        desc: { ar: 'معرفة عمرك بدقة متناهية والوقت المتبقي لعيد ميلادك القادم.', en: 'Know your exact age and time until next birthday.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
    },
    {
        id: 'time-add',
        path: 'tools/time-add.js',
        category: 'time',
        title: { ar: 'إضافة وطرح الأيام', en: 'Date Add/Subtract' },
        desc: { ar: 'حساب التاريخ المستقبلي أو الماضي بعد إضافة أو طرح الأيام.', en: 'Calculate future or past dates by adding/subtracting days.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M12 14v4M10 16h4"></path></svg>'
    },
    {
        id: 'time-workdays',
        path: 'tools/time-workdays.js',
        category: 'time',
        title: { ar: 'حاسبة أيام العمل', en: 'Working Days' },
        desc: { ar: 'حساب أيام العمل الفعلية بين تاريخين مع استبعاد العطلات.', en: 'Calculate actual working days excluding weekends.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><path d="M12 11v4"></path></svg>'
    },
    {
        id: 'time-world',
        path: 'tools/time-world.js',
        category: 'time',
        title: { ar: 'الساعة العالمية', en: 'World Clock' },
        desc: { ar: 'لوحة تفاعلية تعرض الوقت الحي لأهم مدن العالم في شاشة واحدة.', en: 'Interactive dashboard showing live time in major global cities.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>'
    },
    {
        id: 'dev-formatter',
        path: 'tools/dev-formatter.js',
        category: 'dev',
        title: { ar: 'تنسيق JSON', en: 'JSON Formatter' },
        desc: { ar: 'ترتيب وتنسيق أكواد JSON لتصبح قابلة للقراءة.', en: 'Beautify and format JSON code for readability.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>'
    },
    {
        id: 'dev-encoder',
        path: 'tools/dev-encoder.js',
        category: 'dev',
        title: { ar: 'تشفير Base64', en: 'Base64 Encoder' },
        desc: { ar: 'تشفير وفك تشفير النصوص بصيغة Base64 و URL.', en: 'Encode and decode strings using Base64 and URL encoding.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'
    },
    {
        id: 'dev-uuid',
        path: 'tools/dev-uuid.js',
        category: 'dev',
        title: { ar: 'منشئ UUID', en: 'UUID Generator' },
        desc: { ar: 'توليد معرّفات فريدة عالمياً (UUID) بسرعة وسهولة.', en: 'Generate Universally Unique Identifiers (UUID) quickly.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>'
    },
    {
        id: 'dev-regex',
        path: 'tools/dev-regex.js',
        category: 'dev',
        title: { ar: 'أداة Regex', en: 'Regex Tester' },
        desc: { ar: 'اختبار التعابير النمطية (Regular Expressions) على النصوص.', en: 'Test and debug Regular Expressions against text.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>'
    },
    {
        id: 'dev-colors',
        path: 'tools/dev-colors.js',
        category: 'dev',
        title: { ar: 'محوّل الألوان', en: 'Color Converter' },
        desc: { ar: 'التحويل بين صيغ الألوان HEX و RGB و HSL.', en: 'Convert between HEX, RGB, and HSL color formats.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>'
    },
    {
        id: 'dev-jwt',
        path: 'tools/dev-jwt.js',
        category: 'dev',
        title: { ar: 'محلل رموز JWT', en: 'JWT Decoder' },
        desc: { ar: 'فك تشفير وعرض محتويات JWT Tokens محلياً وبأمان.', en: 'Decode and view JWT Tokens payload locally and securely.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>'
    },
    {
        id: 'dev-url',
        path: 'tools/dev-url.js',
        category: 'dev',
        title: { ar: 'محلل الروابط', en: 'URL Parser' },
        desc: { ar: 'تفكيك الروابط المعقدة لاستخراج المتغيرات والمسارات.', en: 'Parse complex URLs to extract parameters and paths.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>'
    },
    {
        id: 'dev-css',
        path: 'tools/dev-css.js',
        category: 'dev',
        title: { ar: 'محوّل وحدات CSS', en: 'CSS Unit Converter' },
        desc: { ar: 'تحويل القيم بين px و rem و em بناءً على حجم الخط الأساسي.', en: 'Convert values between px, rem, and em based on base size.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>'
    },
    {
        id: 'dev-lorem',
        path: 'tools/dev-lorem.js',
        category: 'dev',
        title: { ar: 'مولّد نصوص تجريبية', en: 'Lorem Ipsum Generator' },
        desc: { ar: 'توليد نصوص حشو تجريبية بعدة لغات لتصاميم الواجهات.', en: 'Generate dummy placeholder text in multiple languages for UI design.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
    },
    {
        id: 'media-compress',
        path: 'tools/media-compress.js',
        category: 'media',
        title: { ar: 'ضاغط الصور', en: 'Image Compressor' },
        desc: { ar: 'تقليل حجم الصور بشكل كبير مع الحفاظ على الجودة.', en: 'Reduce image file size significantly while maintaining quality.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>'
    },
    {
        id: 'media-convert',
        path: 'tools/media-convert.js',
        category: 'media',
        title: { ar: 'محوّل صيغ الصور', en: 'Image Converter' },
        desc: { ar: 'تحويل الصور بين الصيغ الشهيرة JPG, PNG, WEBP.', en: 'Convert images between popular formats JPG, PNG, WEBP.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>'
    },
    {
        id: 'media-resize',
        path: 'tools/media-resize.js',
        category: 'media',
        title: { ar: 'تغيير أبعاد الصورة', en: 'Image Resizer' },
        desc: { ar: 'تصغير وتكبير أبعاد وعرض الصور بدقة عالية.', en: 'Resize image dimensions accurately.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>'
    },
    {
        id: 'media-video-frame',
        path: 'tools/media-video-frame.js',
        category: 'media',
        title: { ar: 'مستخرج إطارات الفيديو', en: 'Video Frame Extractor' },
        desc: { ar: 'التقاط واستخراج أي لقطة من فيديو كصورة عالية الدقة.', en: 'Extract any frame from a video as a high-quality image.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>'
    },
    {
        id: 'media-color',
        path: 'tools/media-color.js',
        category: 'media',
        title: { ar: 'مستخرج ألوان الصورة', en: 'Image Color Picker' },
        desc: { ar: 'التقاط كود اللون (HEX/RGB) من أي جزء في الصورة بدقة.', en: 'Pick accurate HEX/RGB color codes from any part of an image.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>'
    },
    {
        id: 'text-counter',
        path: 'tools/text-counter.js',
        category: 'text',
        title: { ar: 'عداد الكلمات والحروف', en: 'Word & Char Counter' },
        desc: { ar: 'إحصائيات دقيقة لعدد الكلمات، الحروف، الأسطر، والفقرات في النص.', en: 'Accurate statistics for words, characters, lines, and paragraphs.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>'
    },
    {
        id: 'text-case',
        path: 'tools/text-case.js',
        category: 'text',
        title: { ar: 'تحويل حالة الأحرف', en: 'Text Case Converter' },
        desc: { ar: 'تحويل النصوص الإنجليزية بين الأحرف الكبيرة والصغيرة.', en: 'Convert English text between UPPERCASE, lowercase, and Capitalized.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>'
    },
    {
        id: 'text-spaces',
        path: 'tools/text-spaces.js',
        category: 'text',
        title: { ar: 'مزيل الفراغات', en: 'Whitespace Remover' },
        desc: { ar: 'إزالة المسافات الزائدة، والأسطر الفارغة، وترتيب النص.', en: 'Remove extra spaces, empty lines, and clean up text formatting.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="21" y1="9" x2="3" y2="9"></line><line x1="21" y1="15" x2="3" y2="15"></line><line x1="10" y1="3" x2="10" y2="21"></line><line x1="14" y1="3" x2="14" y2="21"></line></svg>'
    },
    {
        id: 'text-replace',
        path: 'tools/text-replace.js',
        category: 'text',
        title: { ar: 'البحث والاستبدال', en: 'Find & Replace' },
        desc: { ar: 'البحث عن كلمات معينة داخل النص واستبدالها دفعة واحدة.', en: 'Find specific words in text and replace them all at once.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>'
    },
    {
        id: 'text-reverse',
        path: 'tools/text-reverse.js',
        category: 'text',
        title: { ar: 'عكس النص', en: 'Text Reverser' },
        desc: { ar: 'قراءة النص وعكس حروفه أو كلماته من النهاية للبداية.', en: 'Reverse the letters or words of a text from end to start.' },
        icon: '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path></svg>'
    }
];

window.CATEGORIES = {
    'pdf': { ar: 'أدوات PDF', en: 'PDF Tools' },
    'health': { ar: 'الصحة واللياقة', en: 'Health & Fitness' },
    'finance': { ar: 'المالية الشخصية', en: 'Personal Finance' },
    'productivity': { ar: 'الإنتاجية', en: 'Productivity' },
    'time': { ar: 'الوقت والتاريخ', en: 'Time & Date' },
    'dev': { ar: 'أدوات المطورين', en: 'Developer Tools' },
    'media': { ar: 'الوسائط والصور', en: 'Media & Images' },
    'text': { ar: 'أدوات النصوص', en: 'Text Tools' }
};

window.GLOBAL_STRINGS = {
    'app_name': { ar: 'أدواتي', en: 'My Tools' },
    'app_desc': { ar: 'مجموعة من الأدوات اليومية المفيدة في مكان واحد، تعمل بالكامل على متصفحك (Client-Side). لا خوادم، لا قواعد بيانات، خصوصية تامة.', en: 'A collection of useful daily tools in one place, running entirely in your browser (Client-Side). No servers, no databases, complete privacy.' },
    'back': { ar: 'العودة', en: 'Back' },
    'footer': { ar: 'تم البناء بحب. Client-Side Only.', en: 'Built with love. Client-Side Only.' },
    'loading': { ar: 'جاري التحميل...', en: 'Loading...' },
    'not_found': { ar: 'لم يتم العثور على الأداة.', en: 'Tool not found.' },
    'load_failed': { ar: 'فشل تحميل الأداة.', en: 'Failed to load tool.' }
};
