import React from 'react';
import { FieldVisit } from '../data/initialData';
import { X, Printer, Edit3, Building2, Calendar, User, CheckCircle2 } from 'lucide-react';

interface VisitDetailModalProps {
  visit: FieldVisit | null;
  onClose: () => void;
  onEdit: (visit: FieldVisit) => void;
}

export const VisitDetailModal: React.FC<VisitDetailModalProps> = ({
  visit,
  onClose,
  onEdit,
}) => {
  if (!visit) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 lg:p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-400">
                دائرة التقويم التربوي — تعليمية شمال الشرقية
              </p>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                بطاقة توثيق زيارة إشرافية ميدانية
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg cursor-pointer no-print"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-5 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">المدرسة والولاية</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {visit.school} ({visit.wilayat})
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">المعلم المعني</span>
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-teal-600" />
              {visit.teacher}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">تاريخ الزيارة</span>
            <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-800" />
              {visit.date}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">الأخصائي الزائر</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {visit.specialist}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">المادة / التخصص</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {visit.specialty} · {visit.gradeLevel}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">نوع الزيارة والحالة</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {visit.visitType} ·{' '}
              <strong
                className={
                  visit.status === 'عاجلة'
                    ? 'text-red-600'
                    : visit.status === 'قيد المتابعة'
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }
              >
                {visit.status}
              </strong>
            </span>
          </div>
        </div>

        {/* 4 Rubric Scores */}
        <div className="py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              تقييم المحاور الفنية للتقويم المستمر
            </span>
            <span className="text-sm font-bold font-mono tabular-nums text-blue-900 dark:text-blue-300">
              المؤشر العام: {visit.overallScore}%
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { label: 'التخطيط للتقويم', val: visit.domainPlanning },
              { label: 'مصداقية الأدوات', val: visit.domainTools },
              { label: 'التغذية الراجعة', val: visit.domainFeedback },
              { label: 'الأثر التحصيلي', val: visit.domainAchievement },
            ].map((d) => (
              <div
                key={d.label}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <span className="text-slate-600 dark:text-slate-300">{d.label}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {d.val}/5
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Qualitative Notes */}
        <div className="py-5 space-y-4 text-xs">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
              نقاط القوة والممارسات المجيدة:
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg">
              {visit.strengths || 'التزام بالإجراءات المعتمدة للتقويم المستمر.'}
            </p>
          </div>

          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
              الملاحظات الفنية والتوصيات الإشرافية:
            </span>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 p-3 rounded-lg">
              {visit.notes}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <strong>الإجراء المتخذ:</strong> {visit.followUpOutcome || 'مستقرة'}
            </span>
            <span className="font-mono tabular-nums">
              موعد المتابعة: {visit.followUpDate || visit.date}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5 no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة البطاقة</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(visit);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>تعديل بيانات الزيارة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
