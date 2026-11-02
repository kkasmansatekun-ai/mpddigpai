import React, { useState } from 'react';
import { User } from '../../types';
import {
  Lock,
  User as UserIcon,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
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
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedInput = usernameOrEmail.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedInput || !trimmedPass) {
      setErrorMessage('Silakan isi username/NISN dan kata sandi Anda.');
      return;
    }

    // Match teacher alias
    const isTeacherAlias =
      trimmedInput === 'admin' ||
      trimmedInput === 'wandra' ||
      trimmedInput === 'guru' ||
      trimmedInput === 'guru@mpd.id' ||
      trimmedInput === 'admin123';

    // Match student demo alias
    const isStudentDemoAlias =
      trimmedInput === 'siswa' ||
      trimmedInput === 'siswa1' ||
      trimmedInput === 'siswa1@mpd.id';

    const foundUser = allUsers.find((u) => {
      if (isStudentDemoAlias && u.role === 'student' && (trimmedPass === 'siswa123' || trimmedPass === 'siswa')) {
        return u.id === 'std-01'; // Matches first student ASSYFA KIRANI ARPIS
      }

      const matchUsername = u.username.toLowerCase() === trimmedInput;
      const matchEmail = u.email.toLowerCase() === trimmedInput;
      const matchNisn = (u as any).nisn && (u as any).nisn.toLowerCase() === trimmedInput;
      const matchTeacher = isTeacherAlias && u.role === 'teacher';

      const userMatches = matchUsername || matchEmail || matchNisn || matchTeacher;
      if (!userMatches) return false;

      // Password matching
      const matchRealPass = u.initialPassword === trimmedPass;
      const matchDefaultTeacherPass =
        u.role === 'teacher' &&
        (trimmedPass === 'admin123' || trimmedPass === 'admin' || trimmedPass === 'guru123');

      return matchRealPass || matchDefaultTeacherPass;
    });

    if (foundUser) {
      onLoginSuccess(foundUser);
    } else {
      setErrorMessage(
        'Username, NISN, atau kata sandi tidak cocok. Silakan periksa kembali kredensial Anda.'
      );
    }
  };

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
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
            Portal Masuk Siswa & Guru
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Username, Email, atau NISN</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="Masukkan username, email, atau NISN..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Kata Sandi (Password)</label>
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center space-x-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Bantuan Akun?</span>
              </button>
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
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Collapsible Help / Petunjuk Akun */}
          {showHelp && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs space-y-2 animate-fade-in">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-900 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Petunjuk Kredensial Masuk:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1 leading-relaxed">
                <li>
                  <strong className="text-slate-800">Guru / Admin:</strong> Gunakan username{' '}
                  <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">admin</code>{' '}
                  atau{' '}
                  <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">wandra.arasdi</code>{' '}
                  dengan kata sandi{' '}
                  <code className="bg-slate-200 px-1 py-0.5 rounded text-emerald-700 font-mono">admin123</code>.
                </li>
                <li>
                  <strong className="text-slate-800">Peserta Didik:</strong> Gunakan username atau NISN yang tertera pada Kartu Akun Siswa (dapat dicetak oleh Guru dari menu Manajemen Siswa).
                </li>
                <li>
                  Jika lupa kata sandi, hubungi Guru Pengampu (Bpk. Wandra Arasdi, M.Pd.) untuk reset kata sandi.
                </li>
              </ul>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Masuk ke Pembelajaran</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security & footer info */}
        <div className="pt-2 border-t border-slate-100 text-center space-y-1">
          <p className="text-[11px] text-slate-500">
            SMP / SMA Negeri • Kurikulum Merdeka (Fase E & F)
          </p>
          <p className="text-[10px] text-slate-400">
            Media Pembelajaran Digital PAI • Terintegrasi Asesmen & Diferensiasi
          </p>
        </div>
      </div>
    </div>
  );
};
