import React, { useState, useEffect } from 'react';
import { User, PrayerSchedule, SchoolClass } from '../types';
import { Clock, ChevronDown, Sparkles, MapPin, Building2, Database, LogOut, User as UserIcon, ShieldCheck, GraduationCap } from 'lucide-react';

interface HeaderTopbarProps {
  currentUser: User;
  allUsers: User[];
  activeClass: SchoolClass;
  allClasses: SchoolClass[];
  onSelectClass: (c: SchoolClass) => void;
  onSelectUser: (user: User) => void;
  onOpenLaravelCode: () => void;
  onOpenDatabaseBackup?: () => void;
  onLogout?: () => void;
}

export const HeaderTopbar: React.FC<HeaderTopbarProps> = ({
  currentUser,
  allUsers,
  activeClass,
  allClasses,
  onSelectClass,
  onSelectUser,
  onOpenLaravelCode,
  onOpenDatabaseBackup,
  onLogout,
}) => {
  const [timeStr, setTimeStr] = useState<string>('--:--:--');
  const [nextPrayerName, setNextPrayerName] = useState<string>('Dzuhur');
  const [nextPrayerTime, setNextPrayerTime] = useState<string>('12:10');
  const [countdownStr, setCountdownStr] = useState<string>('00:00:00');
  const [showScheduleDropdown, setShowScheduleDropdown] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const [showClassDropdown, setShowClassDropdown] = useState<boolean>(false);

  // Standard Prayer Times (WIB)
  const prayers: PrayerSchedule[] = [
    { name: 'Subuh', arabicName: 'الفجر', timeStr: '04:52', hours: 4, minutes: 52 },
    { name: 'Dzuhur', arabicName: 'الظهر', timeStr: '12:10', hours: 12, minutes: 10 },
    { name: 'Ashar', arabicName: 'العصر', timeStr: '15:25', hours: 15, minutes: 25 },
    { name: 'Maghrib', arabicName: 'المغرب', timeStr: '18:15', hours: 18, minutes: 15 },
    { name: 'Isya', arabicName: 'العشاء', timeStr: '19:28', hours: 19, minutes: 28 },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      setTimeStr(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} WIB`);

      const currentSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      let targetPrayer = prayers[0];
      let targetSec = 0;

      for (const p of prayers) {
        const pSec = p.hours * 3600 + p.minutes * 60;
        if (pSec > currentSec) {
          targetPrayer = p;
          targetSec = pSec;
          break;
        }
      }

      // If all passed today, target tomorrow's Subuh (+24h)
      if (!targetSec) {
        targetPrayer = prayers[0];
        targetSec = 24 * 3600 + (prayers[0].hours * 3600 + prayers[0].minutes * 60);
      }

      setNextPrayerName(targetPrayer.name);
      setNextPrayerTime(targetPrayer.timeStr);

      const diff = Math.max(0, targetSec - currentSec);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setCountdownStr(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="no-print bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 px-4 md:px-8 py-2.5 transition-all shadow-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Dynamic Class Badge with Switcher & Active Topic */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center space-x-2">
            {/* Dynamic Class Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowClassDropdown(!showClassDropdown)}
                className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center space-x-1.5 hover:bg-emerald-200 transition"
                title="Klik untuk memilih kelas aktif dinamis"
              >
                <Building2 className="w-3 h-3 text-emerald-700" />
                <span>{activeClass.name}</span>
                <span className="text-[10px] text-emerald-700 font-semibold">({activeClass.phase})</span>
                <ChevronDown className="w-3 h-3 text-emerald-700" />
              </button>

              {/* Class Dropdown */}
              {showClassDropdown && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    Pilih Kelas Aktif
                  </div>
                  {allClasses.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => {
                        onSelectClass(cls);
                        setShowClassDropdown(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition ${
                        activeClass.id === cls.id
                          ? 'bg-emerald-50 text-emerald-900 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{cls.name}</span>
                      <span className="text-[10px] text-slate-400">{cls.phase}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-xs text-slate-500 hidden md:inline font-medium">
              Topik: <strong className="text-slate-800">Adab Bersosial Media dalam Islam</strong>
            </span>
          </div>
        </div>

        {/* Center & Right: Prayer Countdown, Small Laravel Badge & User Switcher */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
          {/* TOPBAR WIDGET WAKTU SHOLAT */}
          <div className="relative">
            <button
              onClick={() => setShowScheduleDropdown(!showScheduleDropdown)}
              className="bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-200/90 rounded-xl px-3 py-1.5 flex items-center space-x-3 text-xs shadow-2xs transition group"
              title="Klik untuk melihat seluruh jadwal sholat hari ini"
            >
              {/* Jam Digital WIB */}
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span className="font-mono font-bold text-slate-900 text-xs tracking-tight">
                  {timeStr}
                </span>
              </div>

              <div className="h-3.5 w-px bg-emerald-200"></div>

              {/* Countdown Menuju Sholat */}
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-slate-600 text-[11px]">
                  Menuju <strong className="text-emerald-900">{nextPrayerName}</strong> ({nextPrayerTime}):
                </span>
                <span className="font-mono font-bold text-emerald-800 text-xs bg-emerald-100/80 px-1.5 py-0.5 rounded">
                  {countdownStr}
                </span>
                <ChevronDown className="w-3 h-3 text-emerald-700 ml-0.5" />
              </div>
            </button>

            {/* Dropdown 5 Jadwal Sholat */}
            {showScheduleDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-emerald-100 p-4 z-40 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Jadwal Sholat Hari Ini (WIB)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Padang / Jakarta</span>
                </div>
                <div className="divide-y divide-slate-100 mt-2">
                  {prayers.map((p) => {
                    const isNext = p.name === nextPrayerName;
                    return (
                      <div
                        key={p.name}
                        className={`flex items-center justify-between py-2 text-xs px-2 rounded-lg ${
                          isNext ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${isNext ? 'bg-emerald-600' : 'bg-slate-300'}`}></span>
                          <span>{p.name}</span>
                          <span className="font-arabic text-slate-400 text-xs">{p.arabicName}</span>
                        </div>
                        <div className="flex items-center space-x-2 font-mono">
                          <span>{p.timeStr} WIB</span>
                          {isNext && (
                            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-sans font-bold">
                              Berikutnya
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 text-center">
                  “Sesungguhnya shalat itu adalah fardhu yang ditentukan waktunya atas orang-orang yang beriman.” (QS. An-Nisa: 103)
                </div>
              </div>
            )}
          </div>

          {/* Penanda / Badge Tulisan 'Laravel PHP' Berukuran KECIL & Ringkas */}
          <button
            onClick={onOpenLaravelCode}
            className="text-[10px] font-mono font-bold bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-900 px-2 py-1 rounded-lg border border-slate-200 hover:border-amber-300 transition flex items-center space-x-1"
            title="Lihat Arsitektur Kode PHP Laravel"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            <span>Laravel PHP</span>
          </button>

          {/* Database .SQL Download Button */}
          {onOpenDatabaseBackup && (
            <button
              onClick={onOpenDatabaseBackup}
              className="text-[10px] font-mono font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg border border-emerald-300 hover:border-emerald-400 transition flex items-center space-x-1 shadow-2xs"
              title="Download & Lihat Database MySQL / phpMyAdmin"
            >
              <Database className="w-3 h-3 text-emerald-600" />
              <span>Database .SQL</span>
            </button>
          )}

          {/* User Switcher Dropdown (Guru & Siswa) */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50 shadow-2xs transition"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
                  currentUser.role === 'teacher' ? 'bg-emerald-700' : 'bg-teal-600'
                }`}
              >
                {currentUser.role === 'teacher' ? 'GP' : currentUser.name.slice(0, 2)}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500 capitalize leading-none mt-0.5">
                  {currentUser.role === 'teacher' ? 'Guru Pengampu' : `Siswa (${currentUser.learningStyle})`}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown User Profile & Logout */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-40 animate-fade-in">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white ${
                      currentUser.role === 'teacher' ? 'bg-emerald-700' : 'bg-teal-600'
                    }`}
                  >
                    {currentUser.role === 'teacher' ? 'GP' : currentUser.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">@{currentUser.username}</p>
                    <span
                      className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        currentUser.role === 'teacher'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-teal-100 text-teal-900 border border-teal-200'
                      }`}
                    >
                      {currentUser.role === 'teacher' ? 'Guru Pengampu' : `Siswa (${currentUser.learningStyle})`}
                    </span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="py-2.5 space-y-1.5 text-[11px] text-slate-600 border-b border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kelas Aktif:</span>
                    <strong className="text-slate-800">{activeClass.name}</strong>
                  </div>
                  {(currentUser as any).nisn && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">NISN:</span>
                      <span className="font-mono text-slate-800">{(currentUser as any).nisn}</span>
                    </div>
                  )}
                  {currentUser.role === 'teacher' && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="text-emerald-700 font-semibold">Administrator & Pendidik</span>
                    </div>
                  )}
                </div>

                {/* Teacher-only Student Preview Dropdown (Optional Preview) */}
                {currentUser.role === 'teacher' && (
                  <div className="pt-2 pb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Mode Pratinjau Siswa (Fitur Guru)
                    </p>
                    <select
                      className="w-full text-[11px] p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-hidden focus:border-emerald-600"
                      onChange={(e) => {
                        const target = allUsers.find((u) => u.id === e.target.value);
                        if (target) {
                          onSelectUser(target);
                          setShowUserDropdown(false);
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Pilih siswa untuk uji coba tampilan...
                      </option>
                      {allUsers
                        .filter((u) => u.role === 'student')
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.learningStyle})
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Logout Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 text-xs font-bold transition flex items-center justify-center space-x-1.5 border border-rose-200 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
