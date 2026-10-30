import React from 'react';
import { StudentProgress, User } from '../../types';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Users,
} from 'lucide-react';

interface PerkembanganPageProps {
  progressList: StudentProgress[];
  currentUser: User;
}

export const PerkembanganPage: React.FC<PerkembanganPageProps> = ({
  progressList,
  currentUser,
}) => {
  // Find current student's progress or use first
  const myProgress =
    progressList.find((p) => p.studentId === currentUser.id) || progressList[0];

  const total = progressList.length;
  const avgFinal = Math.round(
    progressList.reduce((acc, p) => acc + p.finalScore, 0) / total
  );
  const avgEngagement = Math.round(
    progressList.reduce((acc, p) => acc + p.engagementPercent, 0) / total
  );
  const tuntasCount = progressList.filter((p) => p.status === 'Tuntas').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 text-emerald-700 mb-2">
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Halaman 11 / 11</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Informasi Perkembangan Belajar & Analitik Siswa
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Laporan rekapitulasi nilai, capaian kompetensi, dan tingkat keterlibatan peserta didik dalam pembelajaran digital PAI.
        </p>
      </div>

      {/* INDIVIDUAL PROGRESS CARD */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Profil Kemajuan Anda
            </span>
            <h2 className="text-2xl font-black text-white mt-1">{myProgress.studentName}</h2>
            <p className="text-xs text-emerald-200">
              KELAS X 3 (Fase E) • Guru Pengampu: Wandra Arasdi, M.Pd.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] text-emerald-200 uppercase font-semibold">Predikat</span>
              <p className="text-2xl font-extrabold text-amber-300">{myProgress.grade}</p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] text-emerald-200 uppercase font-semibold">Nilai Akhir</span>
              <p className="text-2xl font-extrabold text-white">{myProgress.finalScore}</p>
            </div>
          </div>
        </div>

        {/* 4 Score Breakdown Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-700/50 space-y-1">
            <span className="text-[11px] text-emerald-300 font-semibold">Asesmen Awal (15%)</span>
            <p className="text-xl font-black text-white">{myProgress.diagnostikScore}</p>
            <div className="w-full bg-emerald-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${myProgress.diagnostikScore}%` }} />
            </div>
          </div>
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-700/50 space-y-1">
            <span className="text-[11px] text-emerald-300 font-semibold">Asesmen Formatif (25%)</span>
            <p className="text-xl font-black text-white">{myProgress.formatifScore}</p>
            <div className="w-full bg-emerald-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${myProgress.formatifScore}%` }} />
            </div>
          </div>
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-700/50 space-y-1">
            <span className="text-[11px] text-emerald-300 font-semibold">Tugas / Produk (30%)</span>
            <p className="text-xl font-black text-white">{myProgress.tugasScore}</p>
            <div className="w-full bg-emerald-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${myProgress.tugasScore}%` }} />
            </div>
          </div>
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-700/50 space-y-1">
            <span className="text-[11px] text-emerald-300 font-semibold">Asesmen Sumatif (30%)</span>
            <p className="text-xl font-black text-white">{myProgress.sumatifScore}</p>
            <div className="w-full bg-emerald-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${myProgress.sumatifScore}%` }} />
            </div>
          </div>
        </div>

        {/* Engagement & Materials Completed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-white/10 p-4 rounded-2xl border border-white/20 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-200">Indeks Keterlibatan Siswa</p>
              <h4 className="text-lg font-bold text-white mt-0.5">
                {myProgress.engagementPercent}% Aktif
              </h4>
            </div>
            <TrendingUp className="w-7 h-7 text-emerald-300" />
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/20 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-200">Multi-Media Terselesaikan</p>
              <h4 className="text-lg font-bold text-white mt-0.5">
                {myProgress.completedMaterialsCount} dari 9 Representasi
              </h4>
            </div>
            <CheckCircle2 className="w-7 h-7 text-emerald-300" />
          </div>
        </div>
      </div>

      {/* STATISTIK KESELURUHAN KELAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Rata-rata Nilai Kelas
          </span>
          <p className="text-3xl font-black text-slate-900">{avgFinal} / 100</p>
          <span className="text-xs text-emerald-600 font-medium">Berdasarkan 36 Siswa</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Ketuntasan Belajar KKTP
          </span>
          <p className="text-3xl font-black text-emerald-700">
            {tuntasCount} <span className="text-sm font-normal text-slate-500">/ {total} Siswa</span>
          </p>
          <span className="text-xs text-slate-500 font-medium">KKTP Minimum: 75.00</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Rata-rata Keterlibatan
          </span>
          <p className="text-3xl font-black text-teal-700">{avgEngagement}%</p>
          <span className="text-xs text-teal-600 font-medium">Tingkat Interaksi Aktif</span>
        </div>
      </div>
    </div>
  );
};
