import React, { useState, useMemo } from 'react';
import {
  FieldVisit,
  DEPARTMENTS,
  WILAYATS,
  VisitStatusType,
  AlertType,
  getVisitAlertInfo,
} from '../data/initialData';
import { QuickFollowUpModal } from './QuickFollowUpModal';
import {
  Search,
  FileSpreadsheet,
  Printer,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  AlertOctagon,
  Clock,
  AlertCircle,
  FileCheck2,
  Calendar,
} from 'lucide-react';

interface VisitsLogViewProps {
  visits: FieldVisit[];
  onInspectVisit: (visit: FieldVisit) => void;
  onEditVisit: (visit: FieldVisit) => void;
  onDeleteVisit: (id: string) => Promise<void>;
  onQuickStatusToggle: (visit: FieldVisit, nextStatus: VisitStatusType) => Promise<void>;
  onExportCSV: (subset: FieldVisit[]) => void;
  onSaveVisit?: (visit: FieldVisit, isEdit: boolean) => Promise<void>;
}

export const VisitsLogView: React.FC<VisitsLogViewProps> = ({
  visits,
  onInspectVisit,
  onEditVisit,
  onDeleteVisit,
  onQuickStatusToggle,
  onExportCSV,
  onSaveVisit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('جميع الأقسام');
  const [wilayatFilter, setWilayatFilter] = useState('جميع الولايات');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [alertFilter, setAlertFilter] = useState<AlertType | 'all'>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [quickFollowUpVisit, setQuickFollowUpVisit] = useState<FieldVisit | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string>('');

  // Calculate alert counts across the current dataset
  const alertCounts = useMemo(() => {
    let overdue = 0;
    let dueSoon = 0;
    let pendingAction = 0;
    let stable = 0;

    visits.forEach((v) => {
      const info = getVisitAlertInfo(v);
      if (info.type === 'overdue') overdue++;
      else if (info.type === 'due_soon') dueSoon++;
      else if (info.type === 'pending_action') pendingAction++;
      else if (info.type === 'stable') stable++;
    });

    return {
      overdue,
      dueSoon,
      pendingAction,
      stable,
      totalNeedingAttention: overdue + dueSoon + pendingAction,
    };
  }, [visits]);

  // Combined Filtering
  const filteredVisits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return visits.filter((v) => {
      const matchDept = deptFilter === 'جميع الأقسام' || v.dept === deptFilter;
      const matchWilayat = wilayatFilter === 'جميع الولايات' || v.wilayat === wilayatFilter;
      const matchStatus = statusFilter === 'الكل' || v.status === statusFilter;

      const alertInfo = getVisitAlertInfo(v);
      const matchAlert = alertFilter === 'all' || alertInfo.type === alertFilter;

      const matchSearch =
        !q ||
        v.specialist.toLowerCase().includes(q) ||
        v.school.toLowerCase().includes(q) ||
        v.teacher.toLowerCase().includes(q) ||
        v.notes.toLowerCase().includes(q) ||
        (v.followUpOutcome || '').toLowerCase().includes(q) ||
        (v.specialty || '').toLowerCase().includes(q);

      return matchDept && matchWilayat && matchStatus && matchAlert && matchSearch;
    });
  }, [visits, searchQuery, deptFilter, wilayatFilter, statusFilter, alertFilter]);

  const handleSaveFollowUpAction = async (updatedVisit: FieldVisit) => {
    if (onSaveVisit) {
      await onSaveVisit(updatedVisit, true);
    } else {
      await onQuickStatusToggle(updatedVisit, updatedVisit.status);
    }
    setActionFeedback(`تم تحديث إجراء المتابعة لمدرسة (${updatedVisit.school}) بنجاح.`);
    setTimeout(() => setActionFeedback(''), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Actionable Alert Notification & Filter Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>نظام التنبيهات والإشعارات الميدانية للزيارات</span>
              {alertCounts.totalNeedingAttention > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-mono tabular-nums">
                  {alertCounts.totalNeedingAttention} حالة تتطلب انتباهاً
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              رصد آلي لمواعيد المتابعة والزيارات التي لم تستوفِ الإجراءات الإشرافية بعد
            </p>
          </div>
          {alertFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setAlertFilter('all')}
              className="text-xs font-semibold text-blue-900 dark:text-blue-400 hover:underline cursor-pointer"
            >
              إلغاء تصفية التنبيهات (عرض الكل)
            </button>
          )}
        </div>

        {/* 4 Interactive Alert Filter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Overdue Alerts */}
          <button
            type="button"
            onClick={() => setAlertFilter(alertFilter === 'overdue' ? 'all' : 'overdue')}
            className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
              alertFilter === 'overdue'
                ? 'bg-red-50 dark:bg-red-950/40 border-red-400 dark:border-red-600 shadow-xs'
                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-red-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-red-600" />
                <span>متأخرة عن الموعد</span>
              </span>
              <span className="font-mono tabular-nums font-bold text-sm px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300">
                {alertCounts.overdue}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              تجاوزت تاريخ المتابعة المقرر دون تسجيل تقرير إنجاز
            </p>
          </button>

          {/* 2. Approaching Follow-up */}
          <button
            type="button"
            onClick={() => setAlertFilter(alertFilter === 'due_soon' ? 'all' : 'due_soon')}
            className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
              alertFilter === 'due_soon'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 shadow-xs'
                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>اقترب موعدها (خلال ٧ أيام)</span>
              </span>
              <span className="font-mono tabular-nums font-bold text-sm px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                {alertCounts.dueSoon}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              تستحق الزيارة الاستدراكية أو تدقيق الخطة قريباً
            </p>
          </button>

          {/* 3. Pending Action */}
          <button
            type="button"
            onClick={() =>
              setAlertFilter(alertFilter === 'pending_action' ? 'all' : 'pending_action')
            }
            className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
              alertFilter === 'pending_action'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 shadow-xs'
                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span>بانتظار اتخاذ إجراء</span>
              </span>
              <span className="font-mono tabular-nums font-bold text-sm px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">
                {alertCounts.pendingAction}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              حالات عاجلة أو قيد المتابعة لم يوثق لها إجراء معتمد
            </p>
          </button>

          {/* 4. Stable & Complete */}
          <button
            type="button"
            onClick={() => setAlertFilter(alertFilter === 'stable' ? 'all' : 'stable')}
            className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
              alertFilter === 'stable'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 shadow-xs'
                : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>مستقرة ومكتملة</span>
              </span>
              <span className="font-mono tabular-nums font-bold text-sm px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                {alertCounts.stable}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              تم استيفاء معايير التقويم ولا تتطلب تدخلات إضافية
            </p>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Search & Multi-Filter Control Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4 no-print">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الأخصائي، المدرسة، المعلم، التخصص، أو نص التوصيات..."
              className="w-full pr-10 pl-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-2.5" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              aria-label="تصفية حسب القسم"
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              <option value="جميع الأقسام">جميع الأقسام</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={wilayatFilter}
              onChange={(e) => setWilayatFilter(e.target.value)}
              aria-label="تصفية حسب الولاية"
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              <option value="جميع الولايات">جميع الولايات</option>
              {WILAYATS.map((w) => (
                <option key={w} value={w}>
                  ولاية {w}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {['الكل', 'مستقرة', 'قيد المتابعة', 'عاجلة'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span>
            النتائج المعروضة:{' '}
            <strong className="font-mono tabular-nums text-slate-900 dark:text-white">
              {filteredVisits.length}
            </strong>{' '}
            من أصل <span className="font-mono tabular-nums">{visits.length}</span> زيارة مسجلة
            {alertFilter !== 'all' && (
              <span className="text-blue-900 dark:text-blue-400 font-semibold mr-1.5">
                (مصفاة حسب تصنيف التنبيه المختار)
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة السجل</span>
            </button>
            <button
              type="button"
              onClick={() => onExportCSV(filteredVisits)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-600 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>تصدير الملاحظات (Excel CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visits Table with Enhanced Alert Badges & Quick Action Trigger */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        {filteredVisits.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              لا توجد زيارات ميدانية مطابقة لمعايير البحث والتنبيه المحددة
            </p>
            <p className="text-xs text-slate-500 mt-1">
              يمكنك النقر على "عرض الكل" بالأعلى لمشاهدة جميع سجلات الزيارات.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-4 font-semibold">المدرسة والولاية</th>
                  <th className="py-3.5 px-4 font-semibold">المعلم والأخصائي</th>
                  <th className="py-3.5 px-4 font-semibold">تاريخ الزيارة</th>
                  <th className="py-3.5 px-4 font-semibold">مؤشر الجودة</th>
                  <th className="py-3.5 px-4 font-semibold">إشعار المتابعة والحالة</th>
                  <th className="py-3.5 px-4 font-semibold">الإجراء والتوصيات</th>
                  <th className="py-3.5 px-4 font-semibold no-print">إجراءات الميدان</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredVisits.map((v) => {
                  const alert = getVisitAlertInfo(v);
                  return (
                    <tr
                      key={v.id}
                      className={`hover:bg-slate-50/90 dark:hover:bg-slate-800/40 transition-colors ${
                        alert.type === 'overdue'
                          ? 'border-r-3 border-r-red-500'
                          : alert.type === 'due_soon'
                          ? 'border-r-3 border-r-amber-500'
                          : alert.type === 'pending_action'
                          ? 'border-r-3 border-r-blue-500'
                          : ''
                      }`}
                    >
                      {/* School & Wilayat */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {v.school}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                          ولاية {v.wilayat} · {v.gradeLevel}
                        </div>
                      </td>

                      {/* Teacher & Specialist */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {v.teacher} ({v.specialty})
                        </div>
                        <div className="text-slate-500 mt-0.5 text-[11px]">
                          الزائر: {v.specialist}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {v.date}
                      </td>

                      {/* Overall Score */}
                      <td className="py-3.5 px-4 font-mono tabular-nums">
                        <span
                          className={`font-bold ${
                            v.overallScore >= 80
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : v.overallScore >= 60
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {v.overallScore}%
                        </span>
                      </td>

                      {/* Follow-up Alert Notification Badge */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border whitespace-nowrap ${alert.badgeClass}`}
                          >
                            {alert.type === 'overdue' && (
                              <AlertOctagon className="w-3.5 h-3.5 shrink-0 text-red-600" />
                            )}
                            {alert.type === 'due_soon' && (
                              <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                            )}
                            {alert.type === 'pending_action' && (
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                            )}
                            {alert.type === 'stable' && (
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                            )}
                            <span>{alert.label}</span>
                          </span>

                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono tabular-nums">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{alert.subLabel || `المتابعة: ${v.followUpDate || v.date}`}</span>
                          </div>
                        </div>
                      </td>

                      {/* Recommendations & Follow-up Outcome */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-700 dark:text-slate-300 line-clamp-1 font-medium">
                          {v.notes}
                        </p>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {v.followUpOutcome ? (
                            <span className="flex items-center gap-1">
                              <strong className="text-slate-700 dark:text-slate-300">
                                الإجراء:
                              </strong>{' '}
                              {v.followUpOutcome}
                            </span>
                          ) : (
                            <span className="text-amber-700 dark:text-amber-400">
                              بانتظار توثيق الإجراء المتخذ
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Field Action Buttons */}
                      <td className="py-3.5 px-4 whitespace-nowrap no-print">
                        {confirmDeleteId === v.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={async () => {
                                await onDeleteVisit(v.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer"
                            >
                              تأكيد الحذف
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            {/* Quick Follow-up Action Logger Button */}
                            <button
                              type="button"
                              onClick={() => setQuickFollowUpVisit(v)}
                              title="تسجيل أو تحديث إجراء المتابعة"
                              className={`px-2 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                                alert.needsAttention
                                  ? 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/70 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <FileCheck2 className="w-3.5 h-3.5" />
                              <span>إجراء</span>
                            </button>

                            {/* Inspect Card */}
                            <button
                              type="button"
                              onClick={() => onInspectVisit(v)}
                              title="بطاقة الزيارة التفصيلية والطباعة"
                              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Full Edit */}
                            <button
                              type="button"
                              onClick={() => onEditVisit(v)}
                              title="تعديل الزيارة بالكامل"
                              className="p-1.5 text-blue-800 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Quick Mark Complete */}
                            {v.status !== 'مستقرة' && (
                              <button
                                type="button"
                                onClick={() => onQuickStatusToggle(v, 'مستقرة')}
                                title="اعتماد فوري كزيارة مستقرة ومكتملة"
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(v.id)}
                              title="حذف الزيارة"
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Follow-Up Modal */}
      <QuickFollowUpModal
        visit={quickFollowUpVisit}
        onClose={() => setQuickFollowUpVisit(null)}
        onSave={handleSaveFollowUpAction}
      />
    </div>
  );
};
