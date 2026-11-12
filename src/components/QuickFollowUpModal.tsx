import React, { useState, useEffect } from 'react';
import { FieldVisit, VisitStatusType } from '../data/initialData';
import { X, CheckCircle2, AlertOctagon, Clock, Calendar, Building2, User, Save } from 'lucide-react';

interface QuickFollowUpModalProps {
  visit: FieldVisit | null;
  onClose: () => void;
  onSave: (updatedVisit: FieldVisit) => Promise<void>;
}

export const QuickFollowUpModal: React.FC<QuickFollowUpModalProps> = ({
  visit,
  onClose,
  onSave,
}) => {
  if (!visit) return null;

  const [status, setStatus] = useState<VisitStatusType>(visit.status);
  const [outcome, setOutcome] = useState(
    visit.followUpOutcome && !visit.followUpOutcome.includes('بانتظار')
      ? visit.followUpOutcome
      : ''
  );
  const [followUpDate, setFollowUpDate] = useState(visit.followUpDate || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visit) {
      setStatus(visit.status);
      setOutcome(
        visit.followUpOutcome && !visit.followUpOutcome.includes('بانتظار')
          ? visit.followUpOutcome
          : ''
      );
      setFollowUpDate(visit.followUpDate || '');
    }
  }, [visit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated: FieldVisit = {
        ...visit,
        status,
        followUpOutcome: outcome.trim() || (status === 'مستقرة' ? 'تم استيفاء الملاحظات واعتماد استقرار الزيارة.' : 'تمت المتابعة الميدانية وبانتظار اكتمال الشواهد.'),
        followUpDate: followUpDate || visit.followUpDate,
      };
      await onSave(updated);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const setPresetResolution = (text: string, newStatus: VisitStatusType) => {
    setOutcome(text);
    setStatus(newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold text-blue-900 dark:text-blue-400">
              متابعة الزيارة الميدانية
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              تسجيل الإجراء المتخذ وتحديث حالة المتابعة
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visit Context Card */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-800 dark:text-blue-400" />
              {visit.school} ({visit.wilayat})
            </span>
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              تاريخ الزيارة: {visit.date}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-teal-600" />
              المعلم: <strong>{visit.teacher}</strong> ({visit.specialty})
            </span>
            <span>الأخصائي: {visit.specialist}</span>
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
              التوصيات المرصودة:
            </span>
            <p className="line-clamp-2 text-slate-600 dark:text-slate-400">{visit.notes}</p>
          </div>
        </div>

        {/* Quick Resolution Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              تحديث حالة الزيارة
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'مستقرة' as VisitStatusType, label: 'مستقرة ومكتملة', icon: CheckCircle2, color: 'text-emerald-700 dark:text-emerald-300' },
                { val: 'قيد المتابعة' as VisitStatusType, label: 'قيد المتابعة', icon: Clock, color: 'text-amber-700 dark:text-amber-300' },
                { val: 'عاجلة' as VisitStatusType, label: 'تتطلب متابعة عاجلة', icon: AlertOctagon, color: 'text-red-700 dark:text-red-300' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = status === item.val;
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setStatus(item.val)}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-900 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                الإجراء المتخذ في المتابعة (تفاصيل التقرير)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPresetResolution(
                      'تم تنفيذ زيارة متابعة ثانية والتحقق من تدارك الملاحظات واستيفاء الخطط العلاجية بنجاح.',
                      'مستقرة'
                    )
                  }
                  className="text-[11px] text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  + استيفاء كامل للملاحظات
                </button>
              </div>
            </div>
            <textarea
              rows={3}
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="اكتب الإجراء الذي تم اتخاذه مع المعلم أو إدارة المدرسة، أو نتيجة زيارة التحقق..."
              required
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              تاريخ المتابعة القادم (في حال استمرار المتابعة)
            </label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'جاري الحفظ بالسحابة...' : 'حفظ الإجراء في السحابة'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
