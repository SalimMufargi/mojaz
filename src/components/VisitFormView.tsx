import React, { useState, useEffect } from 'react';
import {
  FieldVisit,
  StaffMember,
  WILAYATS,
  VISIT_TYPES,
  GRADE_LEVELS,
  NORTH_SHARQIYAH_SCHOOLS,
  VisitStatusType,
  VisitCategoryType,
  calculateOverallScore,
} from '../data/initialData';
import { Save, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

interface VisitFormViewProps {
  staff: StaffMember[];
  currentUser: StaffMember;
  editingVisit: FieldVisit | null;
  onSaveVisit: (visit: FieldVisit, isEdit: boolean) => Promise<void>;
  onCancelEdit: () => void;
}

export const VisitFormView: React.FC<VisitFormViewProps> = ({
  staff,
  currentUser,
  editingVisit,
  onSaveVisit,
  onCancelEdit,
}) => {
  const today = new Date().toISOString().slice(0, 10);

  const [specialistName, setSpecialistName] = useState(
    editingVisit?.specialist ||
      (currentUser.id !== 'admin' ? currentUser.name : staff[1]?.name || '')
  );
  const [school, setSchool] = useState(editingVisit?.school || '');
  const [wilayat, setWilayat] = useState(editingVisit?.wilayat || 'إبراء');
  const [teacher, setTeacher] = useState(editingVisit?.teacher || '');
  const [visitType, setVisitType] = useState<VisitCategoryType>(
    editingVisit?.visitType || 'زيارة إشرافية صفية'
  );
  const [gradeLevel, setGradeLevel] = useState(
    editingVisit?.gradeLevel || 'التعليم ما بعد الأساسي (١١ - ١٢)'
  );
  const [date, setDate] = useState(editingVisit?.date || today);
  const [status, setStatus] = useState<VisitStatusType>(editingVisit?.status || 'مستقرة');

  // 4 Domains (1 to 5)
  const [domainPlanning, setDomainPlanning] = useState<number>(
    editingVisit?.domainPlanning || 4
  );
  const [domainTools, setDomainTools] = useState<number>(editingVisit?.domainTools || 4);
  const [domainFeedback, setDomainFeedback] = useState<number>(
    editingVisit?.domainFeedback || 4
  );
  const [domainAchievement, setDomainAchievement] = useState<number>(
    editingVisit?.domainAchievement || 4
  );

  const [strengths, setStrengths] = useState(editingVisit?.strengths || '');
  const [notes, setNotes] = useState(editingVisit?.notes || '');
  const [followUpDate, setFollowUpDate] = useState(editingVisit?.followUpDate || '');
  const [followUpOutcome, setFollowUpOutcome] = useState(
    editingVisit?.followUpOutcome || ''
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedBanner, setSavedBanner] = useState('');

  useEffect(() => {
    if (editingVisit) {
      setSpecialistName(editingVisit.specialist);
      setSchool(editingVisit.school);
      setWilayat(editingVisit.wilayat);
      setTeacher(editingVisit.teacher);
      setVisitType(editingVisit.visitType);
      setGradeLevel(editingVisit.gradeLevel);
      setDate(editingVisit.date);
      setStatus(editingVisit.status);
      setDomainPlanning(editingVisit.domainPlanning);
      setDomainTools(editingVisit.domainTools);
      setDomainFeedback(editingVisit.domainFeedback);
      setDomainAchievement(editingVisit.domainAchievement);
      setStrengths(editingVisit.strengths);
      setNotes(editingVisit.notes);
      setFollowUpDate(editingVisit.followUpDate);
      setFollowUpOutcome(editingVisit.followUpOutcome);
    }
  }, [editingVisit]);

  const handleSchoolPresetChange = (selectedSchoolName: string) => {
    setSchool(selectedSchoolName);
    const matched = NORTH_SHARQIYAH_SCHOOLS.find((s) => s.name === selectedSchoolName);
    if (matched) {
      setWilayat(matched.wilayat);
    }
  };

  const overallScore = calculateOverallScore(
    domainPlanning,
    domainTools,
    domainFeedback,
    domainAchievement
  );

  const resetForm = () => {
    setSchool('');
    setTeacher('');
    setDate(today);
    setStatus('مستقرة');
    setDomainPlanning(4);
    setDomainTools(4);
    setDomainFeedback(4);
    setDomainAchievement(4);
    setStrengths('');
    setNotes('');
    setFollowUpDate('');
    setFollowUpOutcome('');
    if (editingVisit) onCancelEdit();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const empObj = staff.find((s) => s.name === specialistName) || currentUser;

    const visitRecord: FieldVisit = {
      id: editingVisit ? editingVisit.id : `v-${Date.now()}`,
      specialistId: empObj.id,
      specialist: empObj.name,
      dept: empObj.dept,
      specialty: empObj.specialty || 'عام',
      school: school.trim().slice(0, 150),
      wilayat: wilayat.trim().slice(0, 80),
      teacher: teacher.trim().slice(0, 150),
      visitType,
      gradeLevel,
      date,
      status,
      domainPlanning,
      domainTools,
      domainFeedback,
      domainAchievement,
      overallScore,
      strengths: (strengths.trim() || 'التزام بالإجراءات المعتمدة للتقويم المستمر.').slice(0, 1000),
      notes: notes.trim().slice(0, 1500),
      followUpDate: followUpDate || date,
      followUpOutcome: (
        followUpOutcome.trim() ||
        (status === 'مستقرة' ? 'مستقرة ومكتملة.' : 'بانتظار تقرير المتابعة الميدانية.')
      ).slice(0, 1000),
    };

    try {
      setIsSubmitting(true);
      await onSaveVisit(visitRecord, Boolean(editingVisit));
      setSavedBanner(
        editingVisit
          ? 'تم تحديث بيانات الزيارة الميدانية في السحابة بنجاح.'
          : 'تم حفظ الزيارة الميدانية بالسحابة وتفريغ الحقول تلقائياً.'
      );
      if (!editingVisit) {
        resetForm();
      }
      setTimeout(() => setSavedBanner(''), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingVisit
                ? `تحديث بيانات الزيارة الميدانية (${editingVisit.school})`
                : 'استمارة توثيق وتقييم زيارة ميدانية جديدة'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              يتم احتساب مؤشر جودة التقويم آلياً بناءً على معايير دائرة التقويم التربوي ومزامنتها
              في السحابة
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              مؤشر الجودة المحتسب:
            </span>
            <span
              className={`text-lg font-bold font-mono tabular-nums ${
                overallScore >= 80
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : overallScore >= 60
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {overallScore}%
            </span>
          </div>
        </div>

        {savedBanner && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{savedBanner}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Visit Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                الأخصائي الزائر
              </label>
              <select
                value={specialistName}
                onChange={(e) => setSpecialistName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
              >
                {staff.map((emp) => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name} — ({emp.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                المدرسة (اختر من القائمة أو اكتب اسم المدرسة)
              </label>
              <input
                type="text"
                list="north-sharqiyah-schools"
                value={school}
                onChange={(e) => handleSchoolPresetChange(e.target.value)}
                placeholder="مثال: مدرسة المتنبي للتعليم الأساسي"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
              />
              <datalist id="north-sharqiyah-schools">
                {NORTH_SHARQIYAH_SCHOOLS.map((s) => (
                  <option key={s.name} value={s.name}>
                    ولاية {s.wilayat}
                  </option>
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                الولاية
              </label>
              <select
                value={wilayat}
                onChange={(e) => setWilayat(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
              >
                {WILAYATS.map((w) => (
                  <option key={w} value={w}>
                    ولاية {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                المعلم / المعلم الأول المعني بالزيارة
              </label>
              <input
                type="text"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="الاسم الثلاثي والقبيلة"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                نوع الزيارة الإشرافية
              </label>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value as VisitCategoryType)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
              >
                {VISIT_TYPES.map((vt) => (
                  <option key={vt} value={vt}>
                    {vt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                الحلقة / الصفوف المستهدفة
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
              >
                {GRADE_LEVELS.map((gl) => (
                  <option key={gl} value={gl}>
                    {gl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                تاريخ الزيارة الميدانية
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                حالة الزيارة ومستوى الأولوية
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as VisitStatusType)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
              >
                <option value="مستقرة">مستقرة ومكتملة</option>
                <option value="قيد المتابعة">قيد المتابعة الفنية</option>
                <option value="عاجلة">تتطلب متابعة عاجلة</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                تاريخ المتابعة القادم (اختياري)
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          {/* Section 2: 4 Evaluation Domains Rubric */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                تقييم محاور التقويم المستمر (من 1 ضعيف إلى 5 ممتاز)
              </span>
              <span className="text-xs text-slate-500">
                إجمالي النقاط: <strong className="font-mono">{domainPlanning + domainTools + domainFeedback + domainAchievement}/20</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: '١. جودة التخطيط للتقويم',
                  val: domainPlanning,
                  setter: setDomainPlanning,
                },
                {
                  label: '٢. تنوع ومصداقية الأدوات',
                  val: domainTools,
                  setter: setDomainTools,
                },
                {
                  label: '٣. فاعلية التغذية الراجعة',
                  val: domainFeedback,
                  setter: setDomainFeedback,
                },
                {
                  label: '٤. أثر التقويم في التحصيل',
                  val: domainAchievement,
                  setter: setDomainAchievement,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    {item.label}
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => item.setter(num)}
                        className={`w-8 h-8 rounded-md text-xs font-bold font-mono transition-colors cursor-pointer ${
                          item.val === num
                            ? 'bg-blue-900 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Qualitative Observations & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                نقاط القوة والممارسات المجيدة المرصودة
              </label>
              <textarea
                rows={3}
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="أبرز الجوانب الإيجابية في ملف التقويم المستمر أو أداء الحصة..."
                className="w-full p-3.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                الملاحظات الفنية والتوصيات الإشرافية (مطلوب)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أدخل التوصيات الإجرائية والخطوات التصحيحية المتفق عليها مع المعلم..."
                required
                className="w-full p-3.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                ما تم تنفيذه في المتابعة / الإجراء المتخذ
              </label>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <button
                  type="button"
                  onClick={() =>
                    setNotes((prev) =>
                      prev
                        ? `${prev} — يوصى بتحليل نتائج الاختبار القصير وبناء أنشطة علاجية موجهة.`
                        : 'يوصى بتحليل نتائج الاختبار القصير وبناء أنشطة علاجية موجهة للفروق الفردية.'
                    )
                  }
                  className="text-xs text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  + إدراج توصية تحليل الاختبارات القصيرة
                </button>
              </div>
            </div>
            <input
              type="text"
              value={followUpOutcome}
              onChange={(e) => setFollowUpOutcome(e.target.value)}
              placeholder="مثال: تم اعتماد الخطة العلاجية وتحديد موعد زيارة تحقق ثانية..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{editingVisit ? 'إلغاء التعديل' : 'تفريغ الحقول'}</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'جاري الحفظ بالسحابة...'
                  : editingVisit
                  ? 'حفظ التعديلات بالسحابة'
                  : 'حفظ الزيارة الميدانية بالسحابة'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
