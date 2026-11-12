import React, { useMemo } from 'react';
import {
  FieldVisit,
  StaffMember,
  DEPARTMENTS,
  WILAYATS,
} from '../data/initialData';
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  MapPin,
  PlusCircle,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';

interface AnalyticsViewProps {
  visits: FieldVisit[];
  staff: StaffMember[];
  selectedDept: string;
  onSelectDept: (dept: string) => void;
  selectedWilayat: string;
  onSelectWilayat: (wilayat: string) => void;
  onOpenNewVisit: () => void;
  onInspectVisit: (visit: FieldVisit) => void;
  onExportCSV: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  visits,
  staff,
  selectedDept,
  onSelectDept,
  selectedWilayat,
  onSelectWilayat,
  onOpenNewVisit,
  onInspectVisit,
  onExportCSV,
}) => {
  const filteredVisits = useMemo(() => {
    return visits.filter((v) => {
      const deptMatch = selectedDept === 'جميع الأقسام' || v.dept === selectedDept;
      const wilayatMatch = selectedWilayat === 'جميع الولايات' || v.wilayat === selectedWilayat;
      return deptMatch && wilayatMatch;
    });
  }, [visits, selectedDept, selectedWilayat]);

  const filteredStaff = useMemo(() => {
    if (selectedDept === 'جميع الأقسام') return staff;
    return staff.filter((s) => s.dept === selectedDept);
  }, [staff, selectedDept]);

  // Core KPIs
  const totalVisits = filteredVisits.length;
  const urgentVisits = filteredVisits.filter((v) => v.status === 'عاجلة').length;
  const followUpVisits = filteredVisits.filter((v) => v.status === 'قيد المتابعة').length;
  const stableVisits = filteredVisits.filter((v) => v.status === 'مستقرة').length;

  const avgQualityScore = useMemo(() => {
    if (!filteredVisits.length) return 0;
    const sum = filteredVisits.reduce((acc, v) => acc + (v.overallScore || 0), 0);
    return Math.round(sum / filteredVisits.length);
  }, [filteredVisits]);

  const totalTargetVisits = useMemo(() => {
    return filteredStaff.reduce((acc, s) => acc + (s.targetVisits || 20), 0);
  }, [filteredStaff]);

  const planCompletionRate = totalTargetVisits
    ? Math.min(100, Math.round((totalVisits / totalTargetVisits) * 100))
    : 0;

  // 4 Domains Average (out of 5)
  const domainAverages = useMemo(() => {
    if (!filteredVisits.length) {
      return { planning: 0, tools: 0, feedback: 0, achievement: 0 };
    }
    const count = filteredVisits.length;
    const planning =
      filteredVisits.reduce((acc, v) => acc + (v.domainPlanning || 4), 0) / count;
    const tools =
      filteredVisits.reduce((acc, v) => acc + (v.domainTools || 4), 0) / count;
    const feedback =
      filteredVisits.reduce((acc, v) => acc + (v.domainFeedback || 4), 0) / count;
    const achievement =
      filteredVisits.reduce((acc, v) => acc + (v.domainAchievement || 4), 0) / count;
    return {
      planning: Number(planning.toFixed(1)),
      tools: Number(tools.toFixed(1)),
      feedback: Number(feedback.toFixed(1)),
      achievement: Number(achievement.toFixed(1)),
    };
  }, [filteredVisits]);

  // School Distribution
  const schoolStats = useMemo(() => {
    const map = new Map<
      string,
      { school: string; wilayat: string; count: number; urgent: number; avgScore: number }
    >();
    filteredVisits.forEach((v) => {
      const existing = map.get(v.school) || {
        school: v.school,
        wilayat: v.wilayat || 'إبراء',
        count: 0,
        urgent: 0,
        avgScore: 0,
      };
      const newCount = existing.count + 1;
      const newAvg = Math.round(
        (existing.avgScore * existing.count + (v.overallScore || 80)) / newCount
      );
      map.set(v.school, {
        school: v.school,
        wilayat: v.wilayat || existing.wilayat,
        count: newCount,
        urgent: existing.urgent + (v.status === 'عاجلة' ? 1 : 0),
        avgScore: newAvg,
      });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [filteredVisits]);

  // Specialty Breakdown
  const specialtyStats = useMemo(() => {
    const map = new Map<string, { specialty: string; count: number; avgScore: number }>();
    filteredVisits.forEach((v) => {
      const spec = v.specialty || 'عام';
      const cur = map.get(spec) || { specialty: spec, count: 0, avgScore: 0 };
      const nextCount = cur.count + 1;
      const nextAvg = Math.round(
        (cur.avgScore * cur.count + (v.overallScore || 80)) / nextCount
      );
      map.set(spec, { specialty: spec, count: nextCount, avgScore: nextAvg });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [filteredVisits]);

  // Urgent & Follow-up Priority Queue
  const priorityVisits = useMemo(() => {
    return filteredVisits
      .filter((v) => v.status === 'عاجلة' || v.status === 'قيد المتابعة')
      .slice(0, 5);
  }, [filteredVisits]);

  const maxSchoolCount = Math.max(...schoolStats.map((s) => s.count), 1);

  return (
    <div className="space-y-8">
      {/* Filter & Action Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => onSelectDept('جميع الأقسام')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedDept === 'جميع الأقسام'
                  ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              جميع الأقسام
            </button>
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => onSelectDept(dept)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {dept.replace('قسم تقويم تعلم مواد ', 'قسم ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <select
              value={selectedWilayat}
              onChange={(e) => onSelectWilayat(e.target.value)}
              aria-label="تصفية حسب الولاية"
              className="px-3 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-700"
            >
              <option value="جميع الولايات">جميع ولايات شمال الشرقية</option>
              {WILAYATS.map((w) => (
                <option key={w} value={w}>
                  ولاية {w}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-600" />
            <span>تصدير التقرير (Excel)</span>
          </button>
          <button
            type="button"
            onClick={onOpenNewVisit}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>توثيق زيارة جديدة</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">إجمالي الزيارات المنفذة</span>
            <ClipboardCheck className="w-4 h-4 text-blue-800 dark:text-blue-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {totalVisits}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              من أصل <span className="font-mono tabular-nums">{totalTargetVisits}</span> زيارة مستهدفة
              ({planCompletionRate}%)
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-800 dark:bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${ Math.max(8, planCompletionRate) }%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">مكتملة ومستقرة</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
              {stableVisits}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              نسبة الاستقرار{' '}
              <span className="font-mono tabular-nums">
                {totalVisits ? Math.round((stableVisits / totalVisits) * 100) : 0}%
              </span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{
                width: `${ totalVisits ? (stableVisits / totalVisits) * 100 : 0 }%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">قيد المتابعة الفنية</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              {followUpVisits}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              مراجعة أدوات أو خطط تقويم
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{
                width: `${ totalVisits ? (followUpVisits / totalVisits) * 100 : 0 }%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">تتطلب متابعة عاجلة</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 font-mono tabular-nums">
              {urgentVisits}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              نسبة الحالات الحرجة{' '}
              <span className="font-mono tabular-nums">
                {totalVisits ? Math.round((urgentVisits / totalVisits) * 100) : 0}%
              </span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-300"
              style={{
                width: `${ totalVisits ? (urgentVisits / totalVisits) * 100 : 0 }%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">مؤشر جودة التقويم العام</span>
            <Award className="w-4 h-4 text-teal-600" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {avgQualityScore}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              متوسط المحاور الأربعة ({filteredStaff.length} أخصائي)
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-300"
              style={{ width: `${ avgQualityScore }%` }}
            />
          </div>
        </div>
      </div>

      {/* Analytical Two-Column Section: School Performance & Evaluation Rubric Domains */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* School Visits Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  توزيع الزيارات الميدانية ومؤشر الجودة حسب المدارس
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  مقارنة كثافة الزيارات الإشرافية ومتوسط تحقق المعايير في مدارس المحافظة
                </p>
              </div>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                {schoolStats.length} مدرسة مزورة
              </span>
            </div>

            {schoolStats.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">
                لا توجد زيارات مسجلة ضمن هذا النطاق حالياً.
              </div>
            ) : (
              <div className="space-y-4">
                {schoolStats.slice(0, 6).map((item) => {
                  const barWidth = Math.max(12, Math.round((item.count / maxSchoolCount) * 100));
                  return (
                    <div key={item.school} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {item.school}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500 dark:text-slate-400">
                            ولاية {item.wilayat}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 font-mono tabular-nums">
                          {item.urgent > 0 && (
                            <span className="text-red-600 dark:text-red-400 font-semibold">
                              {item.urgent} عاجلة
                            </span>
                          )}
                          <span className="text-teal-700 dark:text-teal-400 font-semibold">
                            جودة {item.avgScore}%
                          </span>
                          <span className="text-slate-900 dark:text-white font-bold">
                            {item.count} زيارات
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                        <div
                          className={`h-full rounded-md transition-all duration-300 ${
                            item.urgent > 0 ? 'bg-amber-600' : 'bg-blue-900 dark:bg-blue-600'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>المدارس ذات اللون الكهرماني تتضمن حالات تتطلب متابعة عاجلة</span>
            <span className="font-mono tabular-nums">تحديث سحابي فوري</span>
          </div>
        </div>

        {/* 4 Domains Rubric Breakdown & Specialty Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  تحليل محاور استمارة التقويم التربوي
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  متوسط التقييم المعياري (من 5.0) عبر الزيارات المرصودة
                </p>
              </div>
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>

            <div className="space-y-4">
              {[
                {
                  label: '١. جودة التخطيط للتقويم المستمر',
                  score: domainAverages.planning,
                  desc: 'شمولية خطط التقويم ومواءمتها لوثيقة المادة',
                },
                {
                  label: '٢. تنوع ومصداقية أدوات التقويم',
                  score: domainAverages.tools,
                  desc: 'الاختبارات القصيرة، الأنشطة العملية، والمشاريع',
                },
                {
                  label: '٣. فاعلية التغذية الراجعة والخطط العلاجية',
                  score: domainAverages.feedback,
                  desc: 'تحليل الأخطاء الشائعة ومتابعة الطلبة دون المستوى',
                },
                {
                  label: '٤. أثر التقويم في التحصيل الدراسي',
                  score: domainAverages.achievement,
                  desc: 'اتساق درجات التقويم المستمر مع الاختبارات النهائية',
                },
              ].map((dom) => (
                <div
                  key={dom.label}
                  className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {dom.label}
                    </span>
                    <span className="text-xs font-bold font-mono tabular-nums text-blue-900 dark:text-blue-300">
                      {dom.score} / 5.0
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{dom.desc}</p>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full"
                      style={{ width: `${(dom.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specialty Summary Strip */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
              أعلى المواد والتخصصات تغطية ميدانية:
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {specialtyStats.slice(0, 5).map((sp, idx) => (
                <span key={sp.specialty} className="flex items-center gap-1">
                  {idx > 0 && <span className="text-slate-300 dark:text-slate-700">·</span>}
                  <strong className="text-slate-800 dark:text-slate-200">{sp.specialty}</strong>
                  <span className="font-mono tabular-nums">({sp.count})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Priority Action Queue: Urgent & In-Progress Visits */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              سجل المتابعة العاجلة والخطط العلاجية الجارية
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              الحالات الميدانية التي تتطلب تدخلاً إشرافياً أو زيارة تحقق ثانية
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-red-600 dark:text-red-400 font-semibold">
            {priorityVisits.length} حالات ذات أولوية
          </span>
        </div>

        {priorityVisits.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            جميع الزيارات المسجلة في هذا النطاق مستقرة ومكتملة.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-3 font-semibold">المدرسة والولاية</th>
                  <th className="py-3 px-3 font-semibold">المعلم المعني</th>
                  <th className="py-3 px-3 font-semibold">الأخصائي الزائر</th>
                  <th className="py-3 px-3 font-semibold">نوع الزيارة</th>
                  <th className="py-3 px-3 font-semibold">الحالة والمؤشر</th>
                  <th className="py-3 px-3 font-semibold">موعد المتابعة</th>
                  <th className="py-3 px-3 font-semibold">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {priorityVisits.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {v.school}
                      <span className="text-slate-400 mx-1.5">·</span>
                      <span className="font-normal text-slate-500">{v.wilayat}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                      {v.teacher}
                      <span className="text-slate-400 mx-1">·</span>
                      <span className="text-slate-500">{v.specialty}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{v.specialist}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{v.visitType}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-semibold ${
                          v.status === 'عاجلة'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {v.status === 'عاجلة' ? 'متابعة عاجلة' : 'قيد المتابعة'}
                      </span>
                      <span className="text-slate-400 mx-1.5">·</span>
                      <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400">
                        {v.overallScore}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {v.followUpDate || 'غير محدد'}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => onInspectVisit(v)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-900 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>استعراض</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
