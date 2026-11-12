import React, { useState } from 'react';
import { StaffMember, normalizeArabic } from '../data/initialData';
import { signInWithGoogle } from '../firebase';
import { Building2, KeyRound, UserCheck, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  staffList: StaffMember[];
  onLoginSuccess: (user: StaffMember) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ staffList, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const handleTraditionalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const normUser = normalizeArabic(username);
    const trimmedPass = password.trim();

    const found = staffList.find((emp) => {
      const firstName = normalizeArabic(emp.name.split(' ')[0]);
      const fullNorm = normalizeArabic(emp.name);
      return (
        (normUser === 'admin' || normUser === firstName || normUser === fullNorm) &&
        emp.id === trimmedPass
      );
    });

    if (found) {
      onLoginSuccess(found);
    } else {
      setError('بيانات الدخول غير صحيحة. تأكد من إدخال الاسم الأول والرقم الوظيفي بشكل صحيح.');
    }
  };

  const handleQuickSelect = (emp: StaffMember) => {
    const firstName = emp.id === 'admin' ? 'admin' : emp.name.split(' ')[0];
    setUsername(firstName);
    setPassword(emp.id);
    setError('');
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoadingGoogle(true);
      setError('');
      const result = await signInWithGoogle();
      const email = result.user.email || '';
      const displayName = result.user.displayName || 'مستخدم سحابي';
      // Match with admin or create session profile
      const adminProfile = staffList.find((s) => s.id === 'admin') || staffList[0];
      onLoginSuccess({
        ...adminProfile,
        name: displayName,
        role: email ? `حساب موثق (${email})` : adminProfile.role,
      });
    } catch (err) {
      setError('تعذر تسجيل الدخول عبر Google، يمكنك استخدام الدخول السريع بالرقم الوظيفي أدناه.');
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* Right Side: Directorate Branding & Architectural Overview */}
      <div className="lg:w-7/12 p-8 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 border-b lg:border-b-0 lg:border-l border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-900/60 border border-blue-700/50 flex items-center justify-center text-blue-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-300">سلطنة عُمان — وزارة التعليم</p>
              <p className="text-xs text-slate-400 mt-0.5">
                المديرية العامة للتربية والتعليم بمحافظة شمال الشرقية · دائرة التقويم التربوي
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono tabular-nums">MOJAZ // 2026</span>
        </div>

        <div className="my-12 max-w-2xl">
          <p className="text-xs font-medium text-teal-400 mb-3">
            منظومة التقويم التربوي والإشراف الميداني
          </p>
          <h1
            className="text-3xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-6"
            style={{ textWrap: 'balance' }}
          >
            منصة موجز لإدارة وتحليل الزيارات الميدانية
          </h1>
          <p className="text-base text-slate-300 leading-relaxed mb-8">
            بيئة رقمية سحابية موحدة لأخصائيي تقويم تعلم مواد العلوم التطبيقية والعلوم الإنسانية
            والمهارات الفردية، تتيح التوثيق الفوري للزيارات الإشرافية، تقييم معايير الأداء الصفي،
            ورصد التوصيات والخطط العلاجية عبر مدارس المحافظة.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
            <div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">
                {staffList.length}
              </div>
              <div className="text-xs text-slate-400 mt-1">أخصائي تقويم ورئيس قسم مصرح</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal-400 font-mono tabular-nums">4 محاور</div>
              <div className="text-xs text-slate-400 mt-1">معايير تقييم جودة التقويم المستمر</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">7 ولايات</div>
              <div className="text-xs text-slate-400 mt-1">تغطية ميدانية لمدارس شمال الشرقية</div>
            </div>
          </div>
        </div>

        {/* Quick Demo Access Strip for Evaluators */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              تعبئة سريعة لبيانات الدخول (اختر حساباً للتجربة الفورية):
            </span>
            <span className="text-xs text-slate-400">الاسم الأول + الرقم الوظيفي</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {staffList.slice(0, 6).map((emp) => (
              <button
                key={emp.id}
                type="button"
                onClick={() => handleQuickSelect(emp)}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-blue-900/60 text-slate-200 hover:text-white border border-slate-700 hover:border-blue-600 rounded-lg transition-colors whitespace-nowrap"
              >
                {emp.id === 'admin' ? 'مدير النظام (admin)' : emp.name.split(' ').slice(0, 2).join(' ')}{' '}
                <span className="font-mono text-slate-400">({emp.id})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Left Side: Authentication Form */}
      <div className="lg:w-5/12 p-8 lg:p-16 flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              تسجيل الدخول إلى النظام
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              أدخل الاسم الأول للأخصائي والرقم الوظيفي للوصول إلى لوحة موجز
            </p>
          </div>

          <form onSubmit={handleTraditionalLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                اسم المستخدم (الاسم الأول أو admin)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: سلطان ، ابراهيم ، يوسف ، admin"
                  required
                  className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-700 dark:focus:border-blue-500"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                كلمة المرور (الرقم الوظيفي أو admin)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل الرقم الوظيفي (مثال: 16143371)"
                  required
                  className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-700 dark:focus:border-blue-500"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>دخول لوحة القيادة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs text-slate-400">أو المصادقة السحابية</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoadingGoogle}
            className="w-full py-2.5 px-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>
              {isLoadingGoogle ? 'جاري التحقق...' : 'الدخول الموحد بحساب Google السحابي'}
            </span>
          </button>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>قسم العلوم التطبيقية · قسم العلوم الإنسانية</span>
            <span className="font-mono tabular-nums">v2.5 Cloud</span>
          </div>
        </div>
      </div>
    </div>
  );
};
