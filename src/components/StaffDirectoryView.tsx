import React, { useState, useMemo } from 'react';
import {
  StaffMember,
  FieldVisit,
  DEPARTMENTS,
  DepartmentType,
} from '../data/initialData';
import { UserPlus, Search, CheckCircle2, Users } from 'lucide-react';

interface StaffDirectoryViewProps {
  staff: StaffMember[];
  visits: FieldVisit[];
  onAddStaff: (newMember: StaffMember) => Promise<void>;
  onFilterVisitsBySpecialist: (specialistName: string) => void;
}

export const StaffDirectoryView: React.FC<StaffDirectoryViewProps> = ({
  staff,
  visits,
  onAddStaff,
  onFilterVisitsBySpecialist,
}) => {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('جميع الأقسام');
  const [showAddForm, setShowAddForm] = useState(false);

  // Add Employee Form State
  const [empId, setEmpId] = useState('');
  const [empName, setEmpName] = useState('');
  const [empDept, setEmpDept] = useState<DepartmentType>(DEPARTMENTS[0]);
  const [empRole, setEmpRole] = useState('');
  const [empSpecialty, setEmpSpecialty] = useState('');
  const [empTarget, setEmpTarget] = useState(22);
  const [statusMsg, setStatusMsg] = useState('');

  const staffWithMetrics = useMemo(() => {
    const q = search.trim().toLowerCase();
    return staff
      .filter((emp) => {
        const matchDept = deptFilter === 'جميع الأقسام' || emp.dept === deptFilter;
        const matchSearch =
          !q ||
          emp.name.toLowerCase().includes(q) ||
          emp.id.toLowerCase().includes(q) ||
          emp.role.toLowerCase().includes(q) ||
          (emp.specialty || '').toLowerCase().includes(q);
        return matchDept && matchSearch;
      })
      .map((emp) => {
        const empVisits = visits.filter(
          (v) => v.specialistId === emp.id || v.specialist === emp.name
        );
        const count = empVisits.length;
        const target = emp.targetVisits || 20;
        const completion = Math.min(100, Math.round((count / target) * 100));
        return {
          ...emp,
          executedVisits: count,
          completionRate: completion,
        };
      });
  }, [staff, visits, search, deptFilter]);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = empId.trim().replace(/[^a-zA-Z0-9_\-]/g, '');
    if (!cleanId) return;

    const newStaff: StaffMember = {
      id: cleanId.slice(0, 64),
      name: empName.trim().slice(0, 150),
      dept: empDept,
      role: empRole.trim().slice(0, 150),
      specialty: (empSpecialty.trim() || 'تقويم تربوي').slice(0, 100),
      targetVisits: Number(empTarget) || 20,
    };

    await onAddStaff(newStaff);
    setStatusMsg(`تمت إضافة الأخصائي (${newStaff.name}) إلى قائمة المستفيدين بالسحابة.`);
    setEmpId('');
    setEmpName('');
    setEmpRole('');
    setEmpSpecialty('');
    setTimeout(() => setStatusMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Toggle Add Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم، الرقم الوظيفي، التخصص، أو المسمى الوظيفي..."
              className="w-full pr-9 pl-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            aria-label="تصفية الموظفين حسب القسم"
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
          >
            <option value="جميع الأقسام">جميع الأقسام ({staff.length} موظفاً)</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showAddForm ? 'إغلاق نموذج الإضافة' : 'إضافة أخصائي جديد'}</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Collapsible Add New Specialist Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            إضافة أخصائي تقويم / موظف مصرح له جديد بالسحابة
          </h3>
          <form onSubmit={handleCreateStaff} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                الرقم الوظيفي (يستخدم ككلمة مرور)
              </label>
              <input
                type="text"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                placeholder="مثال: 1686553"
                required
                className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                الاسم الرباعي والقبيلة
              </label>
              <input
                type="text"
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                placeholder="الاسم الكامل للأخصائي"
                required
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                القسم الإشرافي
              </label>
              <select
                value={empDept}
                onChange={(e) => setEmpDept(e.target.value as DepartmentType)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                المسمى الوظيفي
              </label>
              <input
                type="text"
                value={empRole}
                onChange={(e) => setEmpRole(e.target.value)}
                placeholder="مثال: أخصائي تقويم مادة الكيمياء أول"
                required
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                المادة / التخصص الدقيق
              </label>
              <input
                type="text"
                value={empSpecialty}
                onChange={(e) => setEmpSpecialty(e.target.value)}
                placeholder="مثال: الكيمياء ، اللغة العربية"
                required
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                النصاب الفصلي المستهدف للزيارات
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={empTarget}
                  onChange={(e) => setEmpTarget(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-600 rounded-lg whitespace-nowrap cursor-pointer"
                >
                  حفظ وإضافة
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Staff Directory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-900 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              سجل الأخصائيين ورؤساء الأقسام المصرح لهم ({staffWithMetrics.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            انقر على عدد الزيارات لاستعراض سجل الأخصائي
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4 font-semibold">اسم الدخول</th>
                <th className="py-3.5 px-4 font-semibold">الرقم الوظيفي</th>
                <th className="py-3.5 px-4 font-semibold">الاسم الكامل</th>
                <th className="py-3.5 px-4 font-semibold">التخصص والمسمى الوظيفي</th>
                <th className="py-3.5 px-4 font-semibold">القسم</th>
                <th className="py-3.5 px-4 font-semibold">الزيارات المنفذة / المستهدفة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {staffWithMetrics.map((emp) => {
                const firstName = emp.id === 'admin' ? 'admin' : emp.name.split(' ')[0];
                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/90 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-blue-900 dark:text-blue-300">
                      {firstName}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {emp.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {emp.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {emp.specialty}
                      </span>
                      <span className="text-slate-400 mx-1.5">·</span>
                      <span className="text-slate-500 dark:text-slate-400">{emp.role}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {emp.dept}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onFilterVisitsBySpecialist(emp.name)}
                          className="font-mono tabular-nums font-bold text-blue-900 dark:text-blue-300 hover:underline cursor-pointer"
                        >
                          {emp.executedVisits} / {emp.targetVisits || 20}
                        </button>
                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-600 rounded-full"
                            style={{ width: `${Math.max(5, emp.completionRate)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
