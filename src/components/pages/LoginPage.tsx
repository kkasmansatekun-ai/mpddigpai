import React, { useState } from 'react';
import { User } from '../../types';
import { TEACHER_USER } from '../../data/studentsData';
import {
  Lock,
  User as UserIcon,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface LoginPageProps {
  allUsers: User[];
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ allUsers, onLoginSuccess }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedInput = usernameOrEmail.trim().toLowerCase();
    const trimmedPass = password.trim();

    // Match teacher or student (allow 'admin', 'wandra', 'guru' as aliases for teacher)
    const isTeacherAlias =
      trimmedInput === 'admin' ||
      trimmedInput === 'wandra' ||
      trimmedInput === 'guru' ||
      trimmedInput === 'admin123';

    const foundUser = allUsers.find(
      (u) =>
        (u.username.toLowerCase() === trimmedInput ||
          u.email.toLowerCase() === trimmedInput ||
          (isTeacherAlias && u.role === 'teacher')) &&
        (u.initialPassword === trimmedPass ||
          trimmedPass === 'admin123' ||
          trimmedPass === 'password' ||
          trimmedPass === 'admin')
    );

    if (foundUser) {
      onLoginSuccess(foundUser);
    } else {
      // Also allow direct match by username if password matches initialPassword
      const userByName = allUsers.find(
        (u) =>
          u.username.toLowerCase() === trimmedInput ||
          u.email.toLowerCase() === trimmedInput ||
          (isTeacherAlias && u.role === 'teacher')
      );
      if (userByName) {
        if (
          userByName.initialPassword === trimmedPass ||
          trimmedPass === 'admin123' ||
          trimmedPass === 'password'
        ) {
          onLoginSuccess(userByName);
          return;
        }
      }
      setErrorMessage(
        'Kredensial tidak cocok. Gunakan username "admin" atau "wandra.arasdi" dengan password "admin123", atau klik tombol Akses Cepat di bawah.'
      );
    }
  };

  const handleQuickLogin = (user: User) => {
    onLoginSuccess(user);
  };

  const teacher = TEACHER_USER;
  const sampleStudent = allUsers.find((u) => u.role === 'student') || allUsers[1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 relative z-10 animate-fade-in space-y-6">
        {/* App Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/30 font-black text-xl mb-1">
            PAI
          </div>
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">MPD-DigPAI</h1>
          </div>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Media Pembelajaran Digital Pendidikan Agama Islam
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Info Kredensial Demo */}
        <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-slate-700 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
            <span>Akun Guru Pengampu / Admin:</span>
            <span className="text-emerald-700 font-mono">Wandra Arasdi, M.Pd.</span>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="bg-white p-2 rounded-xl border border-emerald-100">
              <span className="text-slate-400 block text-[10px]">Username:</span>
              <strong className="text-slate-900">admin</strong> <span className="text-slate-400 text-[10px]">/</span> <strong className="text-slate-900">wandra.arasdi</strong>
            </div>
            <div className="bg-white p-2 rounded-xl border border-emerald-100">
              <span className="text-slate-400 block text-[10px]">Password:</span>
              <strong className="text-emerald-700">admin123</strong>
            </div>
          </div>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Username atau Email</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="wandra.arasdi atau assyfa.kirani"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Kata Sandi (Password)</label>
              <span className="text-[11px] text-emerald-700 font-semibold cursor-pointer hover:underline">
                Bantuan Guru?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition hover:scale-101 flex items-center justify-center space-x-2"
          >
            <span>Masuk ke Pembelajaran</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Multi-role Quick Demo Access */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Pilihan Akses Cepat (Simulasi Multi-Role)
          </p>

          <div className="grid grid-cols-2 gap-2">
            {/* Quick Guru */}
            <button
              onClick={() => handleQuickLogin(teacher)}
              className="p-3 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 text-left transition group"
            >
              <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Masuk Guru</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-800 truncate">Wandra Arasdi, M.Pd.</p>
              <p className="text-[10px] text-slate-500 font-mono">Role: teacher</p>
            </button>

            {/* Quick Siswa */}
            <button
              onClick={() => handleQuickLogin(sampleStudent)}
              className="p-3 rounded-2xl bg-teal-50/80 hover:bg-teal-100 border border-teal-200 text-left transition group"
            >
              <div className="flex items-center space-x-1.5 text-teal-800 font-bold text-xs mb-0.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Masuk Siswa</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-800 truncate">{sampleStudent.name}</p>
              <p className="text-[10px] text-slate-500 font-mono">Role: student ({sampleStudent.learningStyle})</p>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-400">
          Media Pembelajaran Digital PAI • Topik: Adab Bersosial Media dalam Islam
        </div>
      </div>
    </div>
  );
};
