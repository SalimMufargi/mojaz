import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  db,
  OperationType,
  handleFirestoreError,
  testFirestoreConnection,
  logOutFirebase,
} from './firebase';
import {
  StaffMember,
  FieldVisit,
  INITIAL_STAFF,
  INITIAL_VISITS,
  VisitStatusType,
  getVisitAlertInfo,
} from './data/initialData';
import { LoginScreen } from './components/LoginScreen';
import { AnalyticsView } from './components/AnalyticsView';
import { VisitFormView } from './components/VisitFormView';
import { VisitsLogView } from './components/VisitsLogView';
import { StaffDirectoryView } from './components/StaffDirectoryView';
import { VisitDetailModal } from './components/VisitDetailModal';
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  Users,
  LogOut,
  Moon,
  Sun,
  Plus,
  AlertTriangle,
} from 'lucide-react';

type ActiveTab = 'analytics' | 'add-visit' | 'visits-log' | 'staff';

export default function App() {
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('mojaz_v2_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [visits, setVisits] = useState<FieldVisit[]>(() => {
    const saved = localStorage.getItem('mojaz_v2_visits');
    return saved ? JSON.parse(saved) : INITIAL_VISITS;
  });

  const [currentUser, setCurrentUser] = useState<StaffMember | null>(() => {
    const saved = localStorage.getItem('mojaz_v2_user');
    return saved ? JSON.parse(saved) : INITIAL_STAFF[0]; // Default signed-in as admin for immediate inspection, with full logout support
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('analytics');
  const [selectedDept, setSelectedDept] = useState<string>('جميع الأقسام');
  const [selectedWilayat, setSelectedWilayat] = useState<string>('جميع الولايات');
  const [editingVisit, setEditingVisit] = useState<FieldVisit | null>(null);
  const [inspectingVisit, setInspectingVisit] = useState<FieldVisit | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    const rootEl = document.documentElement;
    if (darkMode) {
      rootEl.classList.add('dark');
    } else {
      rootEl.classList.remove('dark');
    }
  }, [darkMode]);

  // Firestore Real-time Sync & Initial Seed
  useEffect(() => {
    testFirestoreConnection();

    const staffCol = collection(db, 'staff');
    const visitsCol = collection(db, 'visits');

    const unsubStaff = onSnapshot(
      staffCol,
      async (snapshot) => {
        if (snapshot.empty) {
          // Seed initial 17 staff members into Firestore
          try {
            const batch = writeBatch(db);
            INITIAL_STAFF.forEach((emp) => {
              batch.set(doc(db, 'staff', emp.id), emp);
            });
            await batch.commit();
          } catch (err) {
            console.warn('Initial staff seed fallback to local state:', err);
          }
          return;
        }

        const staffMap = new Map<string, StaffMember>();
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as StaffMember;
          if (data && data.id) {
            staffMap.set(data.id, data);
          }
        });
        INITIAL_STAFF.forEach((def) => {
          if (!staffMap.has(def.id)) {
            staffMap.set(def.id, def);
          }
        });
        const merged = Array.from(staffMap.values());
        setStaff(merged);
        localStorage.setItem('mojaz_v2_staff', JSON.stringify(merged));
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'staff');
        } catch {
          // Fallback to local state if rules or network restrict anonymous listener
        }
      }
    );

    const unsubVisits = onSnapshot(
      visitsCol,
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            const batch = writeBatch(db);
            INITIAL_VISITS.forEach((v) => {
              batch.set(doc(db, 'visits', v.id), v);
            });
            await batch.commit();
          } catch (err) {
            console.warn('Initial visits seed fallback to local state:', err);
          }
          return;
        }

        const visitsList: FieldVisit[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as FieldVisit;
          if (data && data.id) {
            visitsList.push(data);
          }
        });
        visitsList.sort((a, b) => b.date.localeCompare(a.date));
        setVisits(visitsList);
        localStorage.setItem('mojaz_v2_visits', JSON.stringify(visitsList));
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'visits');
        } catch {
          // Fallback to local state
        }
      }
    );

    return () => {
      unsubStaff();
      unsubVisits();
    };
  }, []);

  const handleLoginSuccess = (user: StaffMember) => {
    setCurrentUser(user);
    localStorage.setItem('mojaz_v2_user', JSON.stringify(user));
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    setCurrentUser(null);
    localStorage.removeItem('mojaz_v2_user');
    try {
      await logOutFirebase();
    } catch {
      // Ignore if not signed in via Google
    }
  };

  const handleSaveVisit = async (visitRecord: FieldVisit, isEdit: boolean) => {
    const nextVisits = isEdit
      ? visits.map((v) => (v.id === visitRecord.id ? visitRecord : v))
      : [visitRecord, ...visits];
    setVisits(nextVisits);
    localStorage.setItem('mojaz_v2_visits', JSON.stringify(nextVisits));
    setEditingVisit(null);

    try {
      await setDoc(doc(db, 'visits', visitRecord.id), visitRecord);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `visits/${visitRecord.id}`);
    }
  };

  const handleDeleteVisit = async (id: string) => {
    const nextVisits = visits.filter((v) => v.id !== id);
    setVisits(nextVisits);
    localStorage.setItem('mojaz_v2_visits', JSON.stringify(nextVisits));

    try {
      await deleteDoc(doc(db, 'visits', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `visits/${id}`);
    }
  };

  const handleQuickStatusToggle = async (
    visit: FieldVisit,
    nextStatus: VisitStatusType
  ) => {
    const updated: FieldVisit = {
      ...visit,
      status: nextStatus,
      followUpOutcome:
        nextStatus === 'مستقرة'
          ? 'تم استيفاء الملاحظات واعتماد استقرار الزيارة.'
          : visit.followUpOutcome,
    };
    await handleSaveVisit(updated, true);
  };

  const handleAddStaff = async (newMember: StaffMember) => {
    const exists = staff.some((s) => s.id === newMember.id);
    const nextStaff = exists
      ? staff.map((s) => (s.id === newMember.id ? newMember : s))
      : [...staff, newMember];
    setStaff(nextStaff);
    localStorage.setItem('mojaz_v2_staff', JSON.stringify(nextStaff));

    try {
      await setDoc(doc(db, 'staff', newMember.id), newMember);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `staff/${newMember.id}`);
    }
  };

  const handleExportCSV = (subset?: FieldVisit[]) => {
    const listToExport = subset || visits;
    if (!listToExport.length) return;

    let csv = '\uFEFF';
    csv +=
      'الأخصائي,الرقم الوظيفي,التخصص,القسم,المدرسة,الولاية,المعلم,نوع الزيارة,الحلقة,التاريخ,الحالة,مؤشر الجودة %,نقاط القوة,الملاحظات والتوصيات,موعد المتابعة,الإجراء المتخذ\n';

    listToExport.forEach((v) => {
      const cleanStrengths = `"${(v.strengths || '').replace(/"/g, '""')}"`;
      const cleanNotes = `"${(v.notes || '').replace(/"/g, '""')}"`;
      const cleanOutcome = `"${(v.followUpOutcome || '').replace(/"/g, '""')}"`;
      csv += `"${v.specialist}","${v.specialistId}","${v.specialty}","${v.dept}","${v.school}","${v.wilayat}","${v.teacher}","${v.visitType}","${v.gradeLevel}","${v.date}","${v.status}","${v.overallScore}",${cleanStrengths},${cleanNotes},"${v.followUpDate}",${cleanOutcome}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `سجل_زيارات_موجز_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentUser) {
    return <LoginScreen staffList={staff} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Right Sidebar Navigation (260px on Desktop) */}
      <aside className="lg:w-64 bg-white dark:bg-slate-900 border-b lg:border-b-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 no-print">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="text-lg font-bold tracking-tight text-blue-950 dark:text-white whitespace-nowrap">
              منصة موجز الإشرافية
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              دائرة التقويم التربوي · شمال الشرقية
            </p>
          </div>

          {/* Primary Navigation */}
          <nav className="p-3 space-y-1">
            {(() => {
              const attentionCount = visits.filter((v) => getVisitAlertInfo(v).needsAttention).length;
              return [
                {
                  id: 'analytics' as ActiveTab,
                  label: 'الإحصائيات والمؤشرات',
                  icon: LayoutDashboard,
                },
                {
                  id: 'add-visit' as ActiveTab,
                  label: editingVisit ? 'تعديل زيارة ميدانية' : 'تسجيل زيارة جديدة',
                  icon: FilePlus2,
                },
                {
                  id: 'visits-log' as ActiveTab,
                  label: 'سجل الزيارات والتوصيات',
                  icon: ClipboardList,
                  count: visits.length,
                  attentionCount: attentionCount,
                },
                {
                  id: 'staff' as ActiveTab,
                  label: 'بيانات الأخصائيين',
                  icon: Users,
                  count: staff.length,
                },
              ];
            })().map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-900 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5 whitespace-nowrap">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {item.attentionCount !== undefined && item.attentionCount > 0 && (
                      <span
                        title={`${item.attentionCount} زيارات تتطلب متابعة أو اتخاذ إجراء`}
                        className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-mono tabular-nums flex items-center gap-0.5"
                      >
                        <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                        <span>{item.attentionCount}</span>
                      </span>
                    )}
                    {item.count !== undefined && (
                      <span
                        className={`font-mono tabular-nums text-xs ${
                          isActive ? 'text-blue-200' : 'text-slate-400'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Logout Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="px-2">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {currentUser.name}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {currentUser.role} · {currentUser.specialty}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{darkMode ? 'نهاري' : 'ليلي'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="py-2 px-3 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Contract: Breadcrumb on Right (RTL start), Primary Action on Left (RTL end) */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between gap-8 no-print">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate">
            <span className="font-semibold text-slate-900 dark:text-white">
              تعليمية شمال الشرقية
            </span>
            <span>/</span>
            <span>دائرة التقويم التربوي</span>
            <span>/</span>
            <span className="text-blue-900 dark:text-blue-300 font-semibold">
              {activeTab === 'analytics' && 'لوحة المؤشرات والإحصائيات العامة'}
              {activeTab === 'add-visit' && 'استمارة توثيق الزيارة الميدانية'}
              {activeTab === 'visits-log' && 'سجل الزيارات الميدانية والتوصيات'}
              {activeTab === 'staff' && 'قاعدة بيانات الأخصائيين والموظفين'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setEditingVisit(null);
                setActiveTab('add-visit');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>زيارة ميدانية جديدة</span>
            </button>
          </div>
        </header>

        {/* Active View Content */}
        <main className="p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'analytics' && (
            <AnalyticsView
              visits={visits}
              staff={staff}
              selectedDept={selectedDept}
              onSelectDept={setSelectedDept}
              selectedWilayat={selectedWilayat}
              onSelectWilayat={setSelectedWilayat}
              onOpenNewVisit={() => {
                setEditingVisit(null);
                setActiveTab('add-visit');
              }}
              onInspectVisit={(v) => setInspectingVisit(v)}
              onExportCSV={() => handleExportCSV()}
            />
          )}

          {activeTab === 'add-visit' && (
            <VisitFormView
              staff={staff}
              currentUser={currentUser}
              editingVisit={editingVisit}
              onSaveVisit={async (visit, isEdit) => {
                await handleSaveVisit(visit, isEdit);
                if (isEdit) {
                  setActiveTab('visits-log');
                }
              }}
              onCancelEdit={() => {
                setEditingVisit(null);
                setActiveTab('visits-log');
              }}
            />
          )}

          {activeTab === 'visits-log' && (
            <VisitsLogView
              visits={visits}
              onInspectVisit={(v) => setInspectingVisit(v)}
              onEditVisit={(v) => {
                setEditingVisit(v);
                setActiveTab('add-visit');
              }}
              onDeleteVisit={handleDeleteVisit}
              onQuickStatusToggle={handleQuickStatusToggle}
              onExportCSV={handleExportCSV}
              onSaveVisit={handleSaveVisit}
            />
          )}

          {activeTab === 'staff' && (
            <StaffDirectoryView
              staff={staff}
              visits={visits}
              onAddStaff={handleAddStaff}
              onFilterVisitsBySpecialist={() => {
                setActiveTab('visits-log');
              }}
            />
          )}
        </main>
      </div>

      {/* Visit Inspection & Printable Report Modal */}
      <VisitDetailModal
        visit={inspectingVisit}
        onClose={() => setInspectingVisit(null)}
        onEdit={(v) => {
          setEditingVisit(v);
          setActiveTab('add-visit');
        }}
      />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm w-full p-6 text-center shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              تأكيد تسجيل الخروج
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              هل أنت متأكد من رغبتك في الخروج من منصة موجز لإدارة الزيارات الميدانية؟
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
              >
                نعم، تسجيل الخروج
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
