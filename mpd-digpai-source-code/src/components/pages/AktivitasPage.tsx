import React, { useState } from 'react';
import { ACTIVITIES_DATA } from '../../data/materialsData';
import { LearningStyle, User } from '../../types';
import {
  Compass,
  Eye,
  Headphones,
  Footprints,
  CheckCircle2,
  FileCheck,
  Send,
  Upload,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface AktivitasPageProps {
  currentUser: User;
  onUpdateLearningStyle: (style: LearningStyle) => void;
  onSubmitProductSuccess: (title: string, style: LearningStyle) => void;
}

export const AktivitasPage: React.FC<AktivitasPageProps> = ({
  currentUser,
  onUpdateLearningStyle,
  onSubmitProductSuccess,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<LearningStyle>(
    currentUser.learningStyle || 'visual'
  );
  const [responseText, setResponseText] = useState<string>('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const currentActivity =
    ACTIVITIES_DATA.find((a) => a.style === selectedStyle) || ACTIVITIES_DATA[0];

  const handleStyleChange = (style: LearningStyle) => {
    setSelectedStyle(style);
    onUpdateLearningStyle(style);
  };

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    setSubmittedMessage(
      `Alhamdulillah! Jawaban / ide karya tugas untuk profil ${selectedStyle.toUpperCase()} berhasil dikirimkan ke Guru Pengampu Wandra Arasdi, M.Pd.`
    );
    onSubmitProductSuccess(
      `Karya ${selectedStyle.toUpperCase()}: ${responseText.slice(0, 30)}...`,
      selectedStyle
    );
    setResponseText('');
    setTimeout(() => {
      setSubmittedMessage(null);
    }, 6000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 text-emerald-700 mb-2">
          <Compass className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Halaman 6 / 11</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
            Diferensiasi Pengalaman Belajar
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Aktivitas Belajar Berdiferensiasi Gaya Belajar
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Pilih preferensi gaya belajarmu untuk mendapatkan sajian konten aktivitas yang paling cocok dengan potensimu.
        </p>

        {/* 3 STYLE SELECTORS */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-5">
          <button
            onClick={() => handleStyleChange('visual')}
            className={`p-4 rounded-2xl border text-left transition flex items-center space-x-3 ${
              selectedStyle === 'visual'
                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedStyle === 'visual'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Gaya VISUAL</p>
              <p className="text-[11px] text-slate-500">Desain Infografis & Mind Map</p>
            </div>
          </button>

          <button
            onClick={() => handleStyleChange('auditory')}
            className={`p-4 rounded-2xl border text-left transition flex items-center space-x-3 ${
              selectedStyle === 'auditory'
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedStyle === 'auditory'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Gaya AUDITORI</p>
              <p className="text-[11px] text-slate-500">Podcast & Narasi Lisan</p>
            </div>
          </button>

          <button
            onClick={() => handleStyleChange('kinesthetic')}
            className={`p-4 rounded-2xl border text-left transition flex items-center space-x-3 ${
              selectedStyle === 'kinesthetic'
                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedStyle === 'kinesthetic'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Gaya KINESTETIK</p>
              <p className="text-[11px] text-slate-500">Uji Fakta & Simulasi Aksi</p>
            </div>
          </button>
        </div>
      </div>

      {/* SUCCESS FLASH MESSAGE */}
      {submittedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center space-x-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <p className="text-xs font-semibold">{submittedMessage}</p>
        </div>
      )}

      {/* ADAPTIVE CONTENT CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            Aktivitas Terpilih: {selectedStyle.toUpperCase()}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            {currentActivity.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{currentActivity.subtitle}</p>
        </div>

        {/* 1. Tujuan Aktivitas */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
          <strong className="text-xs font-bold text-emerald-950 block">🎯 Tujuan Aktivitas:</strong>
          <p className="text-xs text-slate-700 leading-relaxed">{currentActivity.objective}</p>
        </div>

        {/* 2. Petunjuk Pengerjaan Langkah demi Langkah */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Petunjuk Pengerjaan Aktivitas:</span>
          </h3>
          <div className="space-y-2">
            {currentActivity.instructions.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700"
              >
                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Output yang Diharapkan & Rubrik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <strong className="text-xs font-bold text-slate-900 block">
              📦 Produk Akhir yang Dikumpulkan:
            </strong>
            <p className="text-xs text-slate-700">{currentActivity.expectedOutput}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <strong className="text-xs font-bold text-slate-900 block">
              ⭐ Kriteria Rubrik Penilaian:
            </strong>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              {currentActivity.rubric.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Ruang Respons Siswa (Formulir Pengerjaan Cepat) */}
        <div className="pt-4 border-t border-slate-100">
          <form onSubmit={handleSubmitResponse} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900">
                📝 Ruang Respons / Ide Pengerjaan ({currentUser.name}):
              </label>
              <p className="text-xs text-slate-500">{currentActivity.actionPrompt}</p>
              <textarea
                rows={4}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Ketikkan ide konsep, rancangan karya, atau hasil analisis verifikasimu di sini..."
                className="w-full p-4 rounded-2xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs text-slate-800 placeholder:text-slate-400 outline-hidden transition"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-400">
                Jawaban akan langsung tercatat di portofolio siswa & dinilai oleh Pak Wandra.
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Respons Aktivitas</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
