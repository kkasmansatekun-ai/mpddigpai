import React, { useState } from 'react';
import {
  Home,
  BookOpen,
  Target,
  Layers,
  Globe,
  Compass,
  UploadCloud,
  MessageSquare,
  ClipboardCheck,
  Smile,
  BarChart3,
  Users,
  Building2,
  Code2,
  Printer,
  ChevronRight,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  GraduationCap,
  Database,
} from 'lucide-react';
import { User, SchoolClass } from '../types';

export type PageId =
  | 'classes-management'
  | 'students-management'
  | 'database-backup'
  | 'home'
  | 'instructions'
  | 'objectives'
  | 'materials'
  | 'resources'
  | 'activities'
  | 'submissions'
  | 'discussions'
  | 'assessments'
  | 'reflections'
  | 'progress'
  | 'print-accounts'
  | 'print-grades'
  | 'laravel-code';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  currentUser: User;
  activeClass: SchoolClass;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  currentUser,
  activeClass,
  isMobileOpen,
  onCloseMobile,
  onLogout,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // MENU MANAJEMEN GURU / ADMIN (Tanpa Nomor)
  const teacherNavItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'classes-management', label: 'Kelola Kelas', icon: <Building2 className="w-4 h-4" /> },
    { id: 'students-management', label: 'Kelola Siswa', icon: <Users className="w-4 h-4" /> },
    { id: 'database-backup', label: 'Database & Unduh Data', icon: <Database className="w-4 h-4" />, badge: '.SQL' },
  ];

  // MENU PEMBELAJARAN SISWA & GURU (Murni Tanpa Nomor)
  const learningNavItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Beranda', icon: <Home className="w-4 h-4" /> },
    { id: 'instructions', label: 'Petunjuk Pembelajaran', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'objectives', label: 'Tujuan Pembelajaran', icon: <Target className="w-4 h-4" /> },
    { id: 'materials', label: 'Materi PAI', icon: <Layers className="w-4 h-4" />, badge: '9 Media' },
    { id: 'resources', label: 'Sumber Belajar Digital', icon: <Globe className="w-4 h-4" /> },
    { id: 'activities', label: 'Aktivitas Pembelajaran', icon: <Compass className="w-4 h-4" />, badge: 'Diferensiasi' },
    { id: 'submissions', label: 'Tugas / Produk', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'discussions', label: 'Diskusi / Interaksi', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'assessments', label: 'Asesmen', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'reflections', label: 'Refleksi', icon: <Smile className="w-4 h-4" /> },
    { id: 'progress', label: 'Informasi Perkembangan Belajar', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleItemClick = (id: PageId) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="no-print fixed inset-0 bg-emerald-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`no-print fixed lg:static inset-y-0 left-0 z-50 bg-emerald-950 text-white flex flex-col shrink-0 border-r border-emerald-900 transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        {/* App Logo & Collapsible Button */}
        <div className="p-4 border-b border-emerald-800/80 flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-emerald-950 text-base shadow-md">
                PAI
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">MPD-DigPAI</span>
                </div>
                <p className="text-[10.5px] text-emerald-300/80 truncate">
                  Media Pembelajaran PAI
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-black text-emerald-950 text-base shadow-md">
              PAI
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 items-center justify-center text-emerald-300 transition"
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User & Active Class Badge Info */}
        {!isCollapsed && (
          <div className="px-4 py-2.5 bg-emerald-900/40 border-b border-emerald-800/60 mx-3 my-2 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-200 font-bold text-xs shrink-0">
                {currentUser.role === 'teacher' ? 'WA' : currentUser.name.slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-emerald-300/80 capitalize truncate">
                  {currentUser.role === 'teacher' ? 'Guru Pengampu' : `Siswa (${currentUser.learningStyle})`}
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-800 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold shrink-0">
              {activeClass.name}
            </span>
          </div>
        )}

        {/* Navigation Links - MURNI TANPA NOMOR ANGKA */}
        <div className="flex-1 px-2.5 py-1 space-y-3 overflow-y-auto text-xs font-medium scrollbar-thin scrollbar-thumb-emerald-800">
          
          {/* SECTION 1: MANAJEMEN GURU/ADMIN */}
          <div>
            {!isCollapsed && (
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 flex items-center justify-between">
                <span>Manajemen Guru / Admin</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            )}
            <div className="space-y-0.5 mt-0.5">
              {teacherNavItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center py-2.5 px-0' : 'justify-between px-3 py-2'
                    } rounded-xl text-left transition-all group ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-900'
                        : 'text-emerald-100/90 hover:bg-emerald-900/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="text-emerald-300 group-hover:text-white transition">
                        {item.icon}
                      </div>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: PEMBELAJARAN SISWA & GURU (MURNI TANPA NOMOR) */}
          <div className="pt-2 border-t border-emerald-900/80">
            {!isCollapsed && (
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
                Pembelajaran Siswa & Guru
              </div>
            )}
            <div className="space-y-0.5 mt-0.5">
              {learningNavItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center py-2.5 px-0' : 'justify-between px-3 py-2'
                    } rounded-xl text-left transition-all group ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-900'
                        : 'text-emerald-100/90 hover:bg-emerald-900/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="text-emerald-300 group-hover:text-white transition">
                        {item.icon}
                      </div>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                          isActive ? 'bg-white text-emerald-900' : 'bg-emerald-900 text-emerald-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Quick Print & Laravel Architecture Code */}
          <div className="pt-2 border-t border-emerald-900/80 space-y-1.5">
            {!isCollapsed && (
              <div className="grid grid-cols-2 gap-1.5 px-1">
                <button
                  onClick={() => handleItemClick('print-accounts')}
                  className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg bg-emerald-900/70 hover:bg-emerald-800 text-[10px] text-emerald-200 transition"
                  title="Cetak kartu akun kelas aktif"
                >
                  <Printer className="w-3 h-3" />
                  <span className="truncate">Cetak Akun</span>
                </button>
                <button
                  onClick={() => handleItemClick('print-grades')}
                  className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-lg bg-emerald-900/70 hover:bg-emerald-800 text-[10px] text-emerald-200 transition"
                  title="Cetak rekap nilai kelas aktif"
                >
                  <Printer className="w-3 h-3" />
                  <span className="truncate">Cetak Nilai</span>
                </button>
              </div>
            )}

            <button
              onClick={() => handleItemClick('laravel-code')}
              title={isCollapsed ? 'Kode Laravel PHP' : undefined}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center py-2.5 px-0' : 'justify-between px-3 py-2'
              } rounded-xl text-left transition-all ${
                activePage === 'laravel-code'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-emerald-900/40 text-amber-200 hover:bg-amber-950/60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Code2 className="w-4 h-4 text-amber-300" />
                {!isCollapsed && <span className="font-semibold">Kode Laravel PHP</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] bg-amber-400/20 text-amber-200 px-1.5 py-0.5 rounded">
                  12 File
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Section: Logout Button */}
        <div className="p-3 border-t border-emerald-900/90 flex flex-col gap-2">
          <button
            onClick={onLogout}
            title={isCollapsed ? 'Keluar / Ganti Akun' : undefined}
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center py-2 px-0' : 'space-x-2.5 px-3 py-2'
            } rounded-xl text-rose-300 hover:bg-rose-950/50 hover:text-white transition text-xs font-semibold`}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Keluar / Ganti Akun</span>}
          </button>
          {!isCollapsed && (
            <div className="text-center text-[10px] text-emerald-400/60">
              {activeClass.name} • {activeClass.phase} • SMA
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
