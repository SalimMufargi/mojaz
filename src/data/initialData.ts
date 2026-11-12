export type DepartmentType =
  | 'قسم تقويم تعلم مواد العلوم التطبيقية'
  | 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية';

export type VisitStatusType = 'مستقرة' | 'عاجلة' | 'قيد المتابعة';

export type VisitCategoryType =
  | 'زيارة إشرافية صفية'
  | 'تدقيق تقويم مستمر'
  | 'متابعة خطة علاجية'
  | 'اعتماد أدوات تقويم'
  | 'ورشة فنية ميدانية';

export interface StaffMember {
  id: string;
  name: string;
  dept: DepartmentType;
  role: string;
  specialty: string;
  targetVisits: number;
}

export interface FieldVisit {
  id: string;
  specialistId: string;
  specialist: string;
  dept: DepartmentType;
  specialty: string;
  school: string;
  wilayat: string;
  teacher: string;
  visitType: VisitCategoryType;
  gradeLevel: string;
  date: string;
  status: VisitStatusType;
  domainPlanning: number; // 1 to 5
  domainTools: number; // 1 to 5
  domainFeedback: number; // 1 to 5
  domainAchievement: number; // 1 to 5
  overallScore: number; // 0 to 100
  strengths: string;
  notes: string;
  followUpDate: string;
  followUpOutcome: string;
}

export const DEPARTMENTS: DepartmentType[] = [
  'قسم تقويم تعلم مواد العلوم التطبيقية',
  'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
];

export const WILAYATS: string[] = [
  'إبراء',
  'المضيبي',
  'سناو',
  'بدية',
  'القابل',
  'وادي بني خالد',
  'دماء والطائيين',
];

export const VISIT_TYPES: VisitCategoryType[] = [
  'زيارة إشرافية صفية',
  'تدقيق تقويم مستمر',
  'متابعة خطة علاجية',
  'اعتماد أدوات تقويم',
  'ورشة فنية ميدانية',
];

export const GRADE_LEVELS: string[] = [
  'الحلقة الأولى (١ - ٤)',
  'الحلقة الثانية (٥ - ٨)',
  'التعليم الأساسي (٩ - ١٠)',
  'التعليم ما بعد الأساسي (١١ - ١٢)',
];

export const NORTH_SHARQIYAH_SCHOOLS: { name: string; wilayat: string }[] = [
  { name: 'مدرسة المتنبي للتعليم الأساسي (١٠-١٢)', wilayat: 'إبراء' },
  { name: 'مدرسة سمية للتعليم الأساسي (١٠-١٢)', wilayat: 'إبراء' },
  { name: 'مدرسة الثابتي للتعليم الأساسي (٥-١٠)', wilayat: 'إبراء' },
  { name: 'مدرسة المنير بن النير للتعليم الأساسي (٩-١٢)', wilayat: 'سناو' },
  { name: 'مدرسة سناو للتعليم الأساسي (٥-١٢)', wilayat: 'سناو' },
  { name: 'مدرسة المهنا بن جيفر للتعليم الأساسي (٥-١٢)', wilayat: 'المضيبي' },
  { name: 'مدرسة الشارق للتعليم الأساسي (١-٤)', wilayat: 'المضيبي' },
  { name: 'مدرسة جلهمة بن العباس للتعليم الأساسي (٥-١٢)', wilayat: 'بدية' },
  { name: 'مدرسة رقية للتعليم الأساسي (٩-١٢)', wilayat: 'بدية' },
  { name: 'مدرسة صلاح الدين للتعليم الأساسي (٥-١٠)', wilayat: 'القابل' },
  { name: 'مدرسة الغبيراء للتعليم الأساسي (١-٤)', wilayat: 'القابل' },
  { name: 'مدرسة أبو مالك للتعليم الأساسي (٥-١٢)', wilayat: 'وادي بني خالد' },
  { name: 'مدرسة الشيخ حمدان بن خميس اليوسفي (٥-١٢)', wilayat: 'دماء والطائيين' },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'admin',
    name: 'admin مدير النظام',
    dept: 'قسم تقويم تعلم مواد العلوم التطبيقية',
    role: 'مشرف عام النظام',
    specialty: 'الإدارة والإشراف التربوي',
    targetVisits: 24,
  },
  {
    id: '1686553',
    name: 'ابراهيم بدر سيف سعود الشبيبي',
    dept: 'قسم تقويم تعلم مواد العلوم التطبيقية',
    role: 'رئيس قسم',
    specialty: 'إدارة تقويم العلوم التطبيقية',
    targetVisits: 18,
  },
  {
    id: '16128287',
    name: 'فاطمه سالم هدوب معيوف المغيرية',
    dept: 'قسم تقويم تعلم مواد العلوم التطبيقية',
    role: 'اخصائي تقويم مادة الفيزياء أول',
    specialty: 'الفيزياء',
    targetVisits: 22,
  },
  {
    id: '16119223',
    name: 'نصراء بنت مبارك بن سلطان',
    dept: 'قسم تقويم تعلم مواد العلوم التطبيقية',
    role: 'أخصائي تقويم مادة تقنية المعلومات أول',
    specialty: 'تقنية المعلومات',
    targetVisits: 20,
  },
  {
    id: '16128341',
    name: 'وليد بن مالك بن محمد الجهضمي',
    dept: 'قسم تقويم تعلم مواد العلوم التطبيقية',
    role: 'أخصائي تقويم مادة الأحياء أول',
    specialty: 'الأحياء',
    targetVisits: 22,
  },
  {
    id: '16177726',
    name: 'أفراح بنت مبارك بن ناجم الحجرية',
    dept: 'قسم تقويم تعلم مواد العلوم التطبيقية',
    role: 'اخصائي تقويم مجال ثان',
    specialty: 'المجال الثاني (علوم ورياضيات)',
    targetVisits: 24,
  },
  {
    id: '1682354',
    name: 'علي بن صابح بن سالم بني عرابه',
    dept: 'قسم تقويم تعلم مواد العلوم التطبيقية',
    role: 'أخصائي تقويم مادة الرياضيات أول',
    specialty: 'الرياضيات',
    targetVisits: 24,
  },
  {
    id: '1696508',
    name: 'يوسف بن سليمان بن سالم المفرجي',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    role: 'رئيس قسم',
    specialty: 'إدارة تقويم العلوم الإنسانية',
    targetVisits: 18,
  },
  {
    id: '16143371',
    name: 'سلطان محمد ناصر حمد الحارثي',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    role: 'أخصائي تقويم مادة الرياضة المدرسية ثان',
    specialty: 'الرياضة المدرسية',
    targetVisits: 20,
  },
  {
    id: '16125123',
    name: 'رحمه محمد خالد علي المسكرية',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    role: 'أخصائي تقويم مادة اللغة الإنجليزية ثان',
    specialty: 'اللغة الإنجليزية',
    targetVisits: 24,
  },
  {
    id: '1686518',
    name: 'زبانه راشد محمد راشد البوسعيدية',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    role: 'أخصائي تقويم مادة التاريخ أول',
    specialty: 'التاريخ والجغرافيا',
    targetVisits: 20,
  },
  {
    id: '1686654',
    name: 'اسماء حمود ناصر حمود السناوية',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    role: 'أخصائي تقويم مادة اللغة العربية أول',
    specialty: 'اللغة العربية',
    targetVisits: 24,
  },
  {
    id: '16142588',
    name: 'راشد بن محمد بن سالم الحارثي',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    role: 'أخصائي تقويم مادة جغرافيا ثاني',
    specialty: 'الجغرافيا',
    targetVisits: 20,
  },
  {
    id: '16143513',
    name: 'نسرين بنت حمد سيف الرواحية',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    role: 'اخصائي تقويم مجال أول / ٢',
    specialty: 'المجال الأول / الجغرافيا',
    targetVisits: 22,
  },
  {
    id: '16175869',
    name: 'وردة بنت مبروك سويدان الحجرية',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    role: 'اخصائي تقويم فنون تشكيلية / ٤',
    specialty: 'الفنون التشكيلية',
    targetVisits: 18,
  },
  {
    id: '1686397',
    name: 'محمد بن سالم بن محمد اليزيدي',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    role: 'أخصائي تقويم مادة التربية الإسلامية أول',
    specialty: 'التربية الإسلامية',
    targetVisits: 22,
  },
  {
    id: '1694487',
    name: 'سالم بن حميد بن سالم الحارثي',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    role: 'أخصائي تقويم مادة التربية الإسلامية',
    specialty: 'التربية الإسلامية',
    targetVisits: 22,
  },
];

export const INITIAL_VISITS: FieldVisit[] = [
  {
    id: 'v-1001',
    specialistId: '16128287',
    specialist: 'فاطمه سالم هدوب معيوف المغيرية',
    dept: 'قسم تقويم تعلم مواد العلوم التطبيقية',
    specialty: 'الفيزياء',
    school: 'مدرسة سمية للتعليم الأساسي (١٠-١٢)',
    wilayat: 'إبراء',
    teacher: 'عائشة بنت سالم الحارثية',
    visitType: 'تدقيق تقويم مستمر',
    gradeLevel: 'التعليم ما بعد الأساسي (١١ - ١٢)',
    date: '2026-10-14',
    status: 'مستقرة',
    domainPlanning: 5,
    domainTools: 4,
    domainFeedback: 5,
    domainAchievement: 4,
    overallScore: 90,
    strengths: 'تنوع متميز في صياغة مفردات الاختبارات القصيرة وتوظيف العملي المخبري بدقة.',
    notes: 'الاستمرار في تحليل نتائج الطالبات في أسئلة القدرات العليا وتوثيق الشواهد الرقمية.',
    followUpDate: '2026-11-25',
    followUpOutcome: 'تم استكمال ملف أعمال الطالبات بنجاح وفق وثيقة التقويم.',
  },
  {
    id: 'v-1002',
    specialistId: '1682354',
    specialist: 'علي بن صابح بن سالم بني عرابه',
    dept: 'قسم تقويم تعلم مواد العلوم التطبيقية',
    specialty: 'الرياضيات',
    school: 'مدرسة المتنبي للتعليم الأساسي (١٠-١٢)',
    wilayat: 'إبراء',
    teacher: 'سعيد بن راشد المسروري',
    visitType: 'متابعة خطة علاجية',
    gradeLevel: 'التعليم الأساسي (٩ - ١٠)',
    date: '2026-10-18',
    status: 'عاجلة',
    domainPlanning: 3,
    domainTools: 2,
    domainFeedback: 2,
    domainAchievement: 2,
    overallScore: 45,
    strengths: 'التزام المعلم بالجدول الزمني للحصص وتوافر السجلات الأساسية.',
    notes: 'تباين ملحوظ بين درجات التقويم المستمر ونتائج الاختبار التشخيصي؛ يلزم إعادة بناء الأنشطة العلاجية وتفعيل التغذية الراجعة الكتابية فوراً.',
    followUpDate: '2026-11-15',
    followUpOutcome: 'تحتاج إلى زيارة ميدانية ثانية للتحقق من تعديل درجات الأعمال الصفية.',
  },
  {
    id: 'v-1003',
    specialistId: '1686654',
    specialist: 'اسماء حمود ناصر حمود السناوية',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    specialty: 'اللغة العربية',
    school: 'مدرسة سناو للتعليم الأساسي (٥-١٢)',
    wilayat: 'سناو',
    teacher: 'مريم بنت عبدالله المحروقية',
    visitType: 'زيارة إشرافية صفية',
    gradeLevel: 'الحلقة الثانية (٥ - ٨)',
    date: '2026-10-21',
    status: 'مستقرة',
    domainPlanning: 5,
    domainTools: 5,
    domainFeedback: 4,
    domainAchievement: 5,
    overallScore: 95,
    strengths: 'تطبيق استراتيجيات التقويم التكويني أثناء القراءة الجهرية وبناء سلالم تقدير واضحة للكتابة.',
    notes: 'تعميم تجربة المعلمة في تصميم ملف الإنجاز القرائي على معلمات المجال بالمدرسة.',
    followUpDate: '2026-12-01',
    followUpOutcome: 'تم تنفيذ ورشة مصغرة لتبادل الخبرات داخل المدرسة.',
  },
  {
    id: 'v-1004',
    specialistId: '16125123',
    specialist: 'رحمه محمد خالد علي المسكرية',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    specialty: 'اللغة الإنجليزية',
    school: 'مدرسة رقية للتعليم الأساسي (٩-١٢)',
    wilayat: 'بدية',
    teacher: 'هدى بنت ناصر الحجرية',
    visitType: 'اعتماد أدوات تقويم',
    gradeLevel: 'التعليم ما بعد الأساسي (١١ - ١٢)',
    date: '2026-10-25',
    status: 'قيد المتابعة',
    domainPlanning: 4,
    domainTools: 3,
    domainFeedback: 3,
    domainAchievement: 4,
    overallScore: 70,
    strengths: 'شمولية خطة التقويم المستمر لمهارات الاستماع والتحدث.',
    notes: 'مراجعة مواصفات اختبار القراءة والكتابة للفترة الثانية لضمان توازن مستويات بلوم المعرفية.',
    followUpDate: '2026-11-18',
    followUpOutcome: 'جاري تعديل نماذج الاختبار القصير الثاني وإرسالها للاعتماد.',
  },
  {
    id: 'v-1005',
    specialistId: '16128341',
    specialist: 'وليد بن مالك بن محمد الجهضمي',
    dept: 'قسم تقويم تعلم مواد العلوم التطبيقية',
    specialty: 'الأحياء',
    school: 'مدرسة المنير بن النير للتعليم الأساسي (٩-١٢)',
    wilayat: 'سناو',
    teacher: 'خالد بن حمد الصوافي',
    visitType: 'تدقيق تقويم مستمر',
    gradeLevel: 'التعليم ما بعد الأساسي (١١ - ١٢)',
    date: '2026-10-29',
    status: 'مستقرة',
    domainPlanning: 4,
    domainTools: 5,
    domainFeedback: 4,
    domainAchievement: 4,
    overallScore: 85,
    strengths: 'دقة رصد الدرجات في البوابة التعليمية ومطابقتها لأوراق استجابات الطلاب.',
    notes: 'تعزيز الأنشطة الإثرائية للطلاب المجيدين في وحدة الوراثة الجزيئية.',
    followUpDate: '2026-11-30',
    followUpOutcome: 'مستقرة ومكتملة.',
  },
  {
    id: 'v-1006',
    specialistId: '16143371',
    specialist: 'سلطان محمد ناصر حمد الحارثي',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    specialty: 'الرياضة المدرسية',
    school: 'مدرسة جلهمة بن العباس للتعليم الأساسي (٥-١٢)',
    wilayat: 'بدية',
    teacher: 'أحمد بن سالم الحجري',
    visitType: 'زيارة إشرافية صفية',
    gradeLevel: 'الحلقة الثانية (٥ - ٨)',
    date: '2026-11-02',
    status: 'مستقرة',
    domainPlanning: 4,
    domainTools: 4,
    domainFeedback: 4,
    domainAchievement: 5,
    overallScore: 85,
    strengths: 'تطبيق بطاقات الملاحظة الميدانية لقياس المهارات الحركية واللياقة البدنية بدقة.',
    notes: 'توثيق نتائج اختبارات اللياقة البدنية القبلية والبعدية.',
    followUpDate: '2026-12-05',
    followUpOutcome: 'مكتملة.',
  },
  {
    id: 'v-1007',
    specialistId: '16142588',
    specialist: 'راشد بن محمد بن سالم الحارثي',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    specialty: 'الجغرافيا',
    school: 'مدرسة المهنا بن جيفر للتعليم الأساسي (٥-١٢)',
    wilayat: 'المضيبي',
    teacher: 'سليمان بن عامر الحبسي',
    visitType: 'متابعة خطة علاجية',
    gradeLevel: 'التعليم ما بعد الأساسي (١١ - ١٢)',
    date: '2026-11-05',
    status: 'عاجلة',
    domainPlanning: 2,
    domainTools: 3,
    domainFeedback: 2,
    domainAchievement: 2,
    overallScore: 45,
    strengths: 'توافر الخرائط والوسائل المكانية داخل غرفة مصادر الجغرافيا.',
    notes: 'تأخر في تسليم تقارير المشاريع الطلابية وضعف في تغذية راجعة مهارات قراءة الخرائط ونظم المعلومات الجغرافية.',
    followUpDate: '2026-11-16',
    followUpOutcome: 'تم تحديد موعد جلسة فنية مع المعلم الأول لمتابعة الإنجاز.',
  },
  {
    id: 'v-1008',
    specialistId: '1686397',
    specialist: 'محمد بن سالم بن محمد اليزيدي',
    dept: 'قسم تقويم تعلم مواد العلوم الإنسانية والمهارات الفردية',
    specialty: 'التربية الإسلامية',
    school: 'مدرسة صلاح الدين للتعليم الأساسي (٥-١٠)',
    wilayat: 'القابل',
    teacher: 'ياسر بن عبدالله البوسعيدي',
    visitType: 'تدقيق تقويم مستمر',
    gradeLevel: 'التعليم الأساسي (٩ - ١٠)',
    date: '2026-11-08',
    status: 'مستقرة',
    domainPlanning: 5,
    domainTools: 4,
    domainFeedback: 4,
    domainAchievement: 5,
    overallScore: 90,
    strengths: 'انتظام تقييم التلاوة والحفظ وفق بطاقات المعايير المعتمدة وتنوع الأسئلة الصفية.',
    notes: 'مواصلة تفعيل المسابقات المنهجية المساندة لرفع التحصيل الدراسي.',
    followUpDate: '2026-12-10',
    followUpOutcome: 'مكتملة ومستقرة.',
  },
  {
    id: 'v-1009',
    specialistId: '16119223',
    specialist: 'نصراء بنت مبارك بن سلطان',
    dept: 'قسم تقويم تعلم مواد العلوم التطبيقية',
    specialty: 'تقنية المعلومات',
    school: 'مدرسة الثابتي للتعليم الأساسي (٥-١٠)',
    wilayat: 'إبراء',
    teacher: 'موزة بنت سعيد الهاشمية',
    visitType: 'متابعة خطة علاجية',
    gradeLevel: 'الحلقة الثانية (٥ - ٨)',
    date: '2026-10-28',
    status: 'عاجلة',
    domainPlanning: 2,
    domainTools: 2,
    domainFeedback: 2,
    domainAchievement: 3,
    overallScore: 45,
    strengths: 'تفعيل معمل الحاسوب للأنشطة التطبيقية.',
    notes: 'تأخر في رصد درجات المشروع العملي وضعف في متابعة الطلبة دون المستوى؛ تتطلب تدخلاً عاجلاً.',
    followUpDate: '2026-11-08',
    followUpOutcome: 'بانتظار تنفيذ الزيارة الاستدراكية ورفع تقرير تعديل الدرجات.',
  },
];

export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase();
}

export function calculateOverallScore(
  planning: number,
  tools: number,
  feedback: number,
  achievement: number
): number {
  const sum = planning + tools + feedback + achievement; // max 20
  return Math.round((sum / 20) * 100);
}

export type AlertType = 'overdue' | 'due_soon' | 'pending_action' | 'stable';

export interface VisitAlertInfo {
  type: AlertType;
  label: string;
  subLabel?: string;
  badgeClass: string;
  borderClass: string;
  daysDiff: number | null;
  needsAttention: boolean;
  priority: number; // 1: overdue, 2: due_soon, 3: pending_action, 4: stable
}

export function getVisitAlertInfo(visit: FieldVisit, todayStr?: string): VisitAlertInfo {
  const today = todayStr || new Date().toISOString().slice(0, 10);

  if (visit.status === 'مستقرة') {
    return {
      type: 'stable',
      label: 'مستقرة ومكتملة',
      subLabel: 'تم استيفاء الملاحظات',
      badgeClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
      borderClass: 'border-emerald-500',
      daysDiff: null,
      needsAttention: false,
      priority: 4,
    };
  }

  // Calculate days difference if followUpDate exists
  if (visit.followUpDate) {
    const todayTime = new Date(`${today}T00:00:00`).getTime();
    const targetTime = new Date(`${visit.followUpDate}T00:00:00`).getTime();
    const diffDays = Math.round((targetTime - todayTime) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const absDays = Math.abs(diffDays);
      const daysText = absDays === 1 ? 'يوم واحد' : absDays === 2 ? 'يومان' : `${absDays} أيام`;
      return {
        type: 'overdue',
        label: `متأخرة عن الموعد (${daysText})`,
        subLabel: `الموعد المحدد كان: ${visit.followUpDate}`,
        badgeClass: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800',
        borderClass: 'border-red-500',
        daysDiff: diffDays,
        needsAttention: true,
        priority: 1,
      };
    }

    if (diffDays <= 7) {
      const daysText = diffDays === 0 ? 'اليوم' : diffDays === 1 ? 'غداً' : `خلال ${diffDays} أيام`;
      return {
        type: 'due_soon',
        label: `اقترب موعد المتابعة (${daysText})`,
        subLabel: `الموعد المحدد: ${visit.followUpDate}`,
        badgeClass: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
        borderClass: 'border-amber-500',
        daysDiff: diffDays,
        needsAttention: true,
        priority: 2,
      };
    }
  }

  const isOutcomePending =
    !visit.followUpOutcome ||
    visit.followUpOutcome.trim() === '' ||
    visit.followUpOutcome.includes('بانتظار') ||
    visit.followUpOutcome.includes('تحتاج إلى');

  if (isOutcomePending || visit.status === 'عاجلة' || visit.status === 'قيد المتابعة') {
    return {
      type: 'pending_action',
      label: 'بانتظار اتخاذ إجراء',
      subLabel: visit.followUpDate ? `موعد المتابعة: ${visit.followUpDate}` : 'لم يحدد موعد للمتابعة',
      badgeClass: 'text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
      borderClass: 'border-blue-500',
      daysDiff: null,
      needsAttention: true,
      priority: 3,
    };
  }

  return {
    type: 'stable',
    label: visit.status,
    badgeClass: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    borderClass: 'border-slate-400',
    daysDiff: null,
    needsAttention: false,
    priority: 4,
  };
}

