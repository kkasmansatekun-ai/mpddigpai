import React from 'react';
import { PageId } from '../Sidebar';
import { User, SchoolClass } from '../../types';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Layers,
  Sparkles,
  Award,
  Users,
  ShieldAlert,
  Clock,
  HeartHandshake,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  currentUser: User;
  activeClass?: SchoolClass;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, currentUser, activeClass }) => {
  const conceptualFlow = [
    { step: 1, title: 'Analisis Kebutuhan', desc: 'Pemetaan profil, gaya belajar & pemahaman awal peserta didik' },
    { step: 2, title: 'MPD-DigPAI', desc: 'Akses 9 multi-representasi materi digital & dalil syariat' },
    { step: 3, title: 'Aktivitas Web', desc: 'Eksplorasi interaktif, kuis terpadu, dan studi kasus faktual' },
    { step: 4, title: 'Diferensiasi Belajar', desc: 'Pengalaman adaptif: Visual, Auditori, atau Kinestetik' },
    { step: 5, title: 'Keterlibatan Siswa', desc: 'Diskusi aktif, karya produk, dan refleksi metakognisi' },
    { step: 6, title: 'Hasil Belajar PAI', desc: 'Pencapaian kompetensi akhlak siber & nilai asesmen' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-700/50">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Platform Pembelajaran Digital PAI Interaktif • Berbasis Web</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            MPD-DigPAI: <br className="hidden sm:inline" />
            <span className="text-emerald-300">Adab Bersosial Media</span> dalam Islam
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Studi Etika Komunikasi Digital, Prinsip Tabayyun, Menjaga Lisan Digital, serta Penanganan Hoaks & Cyberbullying berlandaskan Al-Qur’an, Hadis, dan Fatwa MUI No. 24/2017.
          </p>

          {/* Pengampu & Detail Materi */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
            <div className="flex items-center space-x-2 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-700/40">
              <span className="font-semibold text-white">Guru Pengampu:</span>
              <span>Wandra Arasdi, M.Pd.</span>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-700/40">
              <span className="font-semibold text-white">Topik Aktif:</span>
              <span className="font-bold text-emerald-300">Adab Bersosial Media</span>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-700/40">
              <span className="font-semibold text-white">Profil Anda:</span>
              <span className="capitalize">{currentUser.name} ({currentUser.role === 'teacher' ? 'Guru' : currentUser.learningStyle})</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('activities')}
              className="px-5 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-sm flex items-center space-x-2 shadow-lg shadow-emerald-950/40 transition hover:scale-102"
            >
              <span>Mulai Aktivitas Berdiferensiasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('materials')}
              className="px-5 py-3 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700/90 border border-emerald-500/50 text-white font-semibold text-sm flex items-center space-x-2 transition"
            >
              <Layers className="w-4 h-4 text-emerald-300" />
              <span>Jelajahi 9 Media Materi</span>
            </button>
            <button
              onClick={() => onNavigate('instructions')}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-emerald-100 text-sm font-medium transition"
            >
              <BookOpen className="w-4 h-4 inline mr-1.5" />
              Petunjuk Belajar
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none"></div>
      </div>

      {/* ALUR KONSEPTUAL PENGEMBANGAN PEMBELAJARAN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>Alur Konseptual Pembelajaran MPD-DigPAI</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Desain instruksional terstruktur dari analisis kebutuhan hingga capaian hasil belajar PAI
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            6 Tahap Berkelanjutan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conceptualFlow.map((flow) => (
            <div
              key={flow.step}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition group"
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center transition shadow-2xs">
                  {flow.step}
                </span>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-900 transition">
                  {flow.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-10">
                {flow.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MATERI AKTIF & KOMPONEN INTI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 & 2: Topik & Dalil Al-Qur'an Inti */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Dalil Landasan Utama
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
              Al-Qur’an & Sunnah
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-900">QS. Al-Hujurat [49] : Ayat 6</span>
              <span className="text-xs text-emerald-700 font-semibold">Prinsip Tabayyun</span>
            </div>
            <p className="font-arabic text-xl sm:text-2xl text-slate-900 leading-loose text-right dir-rtl py-2">
              يَا أَيُّهَا الَّذِينَ آمَنُوا إِنْ جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا أَنْ تُصِيبُوا قَوْمًا بِجَهَالَةٍ فَتُصْبِحُوا عَلَىٰ مَا فَعَلْتُمْ نَادِمِينَ
            </p>
            <p className="text-xs text-slate-700 italic border-t border-emerald-200/80 pt-2 leading-relaxed">
              “Wahai orang-orang yang beriman! Jika seseorang yang fasik datang kepadamu membawa suatu berita, maka telitilah kebenarannya (tabayyun), agar kamu tidak mencelakakan suatu kaum karena kebodohan, yang akhirnya kamu menyesali perbuatanmu itu.”
            </p>
          </div>

          {/* 4 Pilar Adab Digital */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-emerald-600 font-bold text-sm mb-1">Qaulan Sadida</div>
              <p className="text-[11px] text-slate-500">Perkataan Benar & Valid</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-emerald-600 font-bold text-sm mb-1">Tabayyun</div>
              <p className="text-[11px] text-slate-500">Verifikasi Fakta</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-emerald-600 font-bold text-sm mb-1">Hifzhul Lisan</div>
              <p className="text-[11px] text-slate-500">Menjaga Lisan & Jari</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-emerald-600 font-bold text-sm mb-1">Anti-Ghibah</div>
              <p className="text-[11px] text-slate-500">Bebas Bullying & Fitnah</p>
            </div>
          </div>
        </div>

        {/* Kolom 3: Petunjuk Cepat Penggunaan Web */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Petunjuk Singkat Belajar</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Panduan langkah untuk mengoptimalkan pembelajaran di MPD-DigPAI:
            </p>

            <ul className="space-y-3 mt-4 text-xs text-slate-700">
              <li className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>Periksa Tujuan & Capaian Pembelajaran (CP & TP) di menu ke-3.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>Pelajari 9 media representasi materi (Teks, Infografis, Video, Audio, Kasus).</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>Kerjakan Aktivitas Pembelajaran sesuai Gaya Belajarmu (Visual, Audio, Kinestetik).</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <span>Ikuti Asesmen interaktif dan isi lembar Refleksi Metakognisi di akhir sesi.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('instructions')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition text-center"
            >
              Baca Panduan Lengkap Guru & Siswa →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
