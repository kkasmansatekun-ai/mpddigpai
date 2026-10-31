import React, { useState } from 'react';
import { LEARNING_MATERIALS } from '../../data/materialsData';
import { MaterialItem } from '../../types';
import {
  FileText,
  Image,
  PieChart,
  Video,
  Volume2,
  Presentation,
  AlertTriangle,
  BookOpen,
  CheckSquare,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  Share2,
} from 'lucide-react';

export const MateriPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('teks');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(25);
  const [checklistAnswers, setChecklistAnswers] = useState<{ [index: number]: boolean }>({
    0: true,
    1: true,
    2: true,
    3: true,
    7: true,
    9: true,
  });

  const mediaTypes = [
    { id: 'teks', label: 'Teks & Dalil', icon: <FileText className="w-4 h-4" /> },
    { id: 'gambar', label: 'Gambar Ilustrasi', icon: <Image className="w-4 h-4" /> },
    { id: 'infografis', label: 'Infografis Ringkas', icon: <PieChart className="w-4 h-4" /> },
    { id: 'video', label: 'Video Penjelasan', icon: <Video className="w-4 h-4" /> },
    { id: 'audio', label: 'Kajian Audio Podcast', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'presentasi', label: 'Slide Interaktif', icon: <Presentation className="w-4 h-4" /> },
    { id: 'kasus', label: 'Contoh Kasus Faktual', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'bacaan', label: 'Fatwa MUI & E-Book', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'interaktif', label: 'Checklist Mandiri', icon: <CheckSquare className="w-4 h-4" /> },
  ];

  const currentMaterial = LEARNING_MATERIALS.find((m) => m.type === activeTab) || LEARNING_MATERIALS[0];

  const toggleChecklistItem = (idx: number) => {
    setChecklistAnswers((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const checklistScore = Object.values(checklistAnswers).filter(Boolean).length * 10;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 text-emerald-700 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Halaman 4 / 11</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
            Multi-Representasi Materi Pembelajaran
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Materi PAI: Adab Bersosial Media dalam Islam
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Disediakan dalam 9 format representasi media untuk mengakomodasi berbagai preferensi dan gaya belajar peserta didik.
        </p>

        {/* 9 MEDIA TABS SELECTOR */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {mediaTypes.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-900/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MATERIAL CONTENT CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Header of Active Material */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                {currentMaterial.badge}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentMaterial.duration}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {currentMaterial.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{currentMaterial.subtitle}</p>
          </div>
        </div>

        {/* TAB 1: TEKS & DALIL */}
        {activeTab === 'teks' && (
          <div className="space-y-6">
            {/* Ayat QS. Al-Hujurat: 6 */}
            <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-950">
                  {currentMaterial.contentData.surah.name}
                </span>
                <span className="text-xs bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-semibold">
                  Kewajiban Tabayyun
                </span>
              </div>
              <p className="font-arabic text-2xl sm:text-3xl text-right dir-rtl leading-loose text-slate-900 py-3">
                {currentMaterial.contentData.surah.arabic}
              </p>
              <div className="border-t border-emerald-200/80 pt-3">
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  {currentMaterial.contentData.surah.translation}
                </p>
              </div>
            </div>

            {/* Hadis Menjaga Lisan */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">
                  Hadis Rasulullah SAW tentang Menjaga Lisan
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {currentMaterial.contentData.hadits.source}
                </span>
              </div>
              <p className="font-arabic text-xl sm:text-2xl text-right dir-rtl leading-loose text-slate-900 py-2">
                {currentMaterial.contentData.hadits.arabic}
              </p>
              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  {currentMaterial.contentData.hadits.translation}
                </p>
              </div>
            </div>

            {/* 6 Kaidah Komunikasi Al-Qur'an */}
            <div className="space-y-3">
              <h3 className="font-bold text-base text-slate-900">
                6 Kaidah Komunikasi Islami dalam Al-Qur’an (Kamus Karakter Digital)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentMaterial.contentData.kaidah.map((k: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 hover:border-emerald-300 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 text-sm">{k.term}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        {k.surah}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{k.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GAMBAR ILUSTRASI */}
        {activeTab === 'gambar' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentMaterial.contentData.map((img: any, idx: number) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className={`p-6 bg-gradient-to-br ${img.accent} text-white space-y-2`}>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-black/20 rounded">
                    {img.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">{img.title}</h3>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 leading-relaxed">{img.desc}</p>
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    {img.points.map((pt: string, pIdx: number) => (
                      <div key={pIdx} className="flex items-center space-x-2 text-xs text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: INFOGRAFIS RINGKAS */}
        {activeTab === 'infografis' && (
          <div className="space-y-6">
            <div className="bg-emerald-950 text-white p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-emerald-300">
                  Alur Verifikasi Informasi (Fact-Checking Workflow)
                </h3>
                <p className="text-xs text-emerald-200/80 mt-1">
                  6 Langkah Netizen Muslim ketika Menemukan Kabar Bombastis di Medsos
                </p>
              </div>
              <span className="hidden sm:inline text-xs bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full font-mono">
                SOP Tabayyun v2
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentMaterial.contentData.steps.map((st: any) => (
                <div
                  key={st.num}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative overflow-hidden group hover:bg-emerald-50/50 hover:border-emerald-300 transition"
                >
                  <span className="text-3xl font-black text-slate-200 group-hover:text-emerald-200 transition">
                    {st.num}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{st.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VIDEO PENJELASAN */}
        {activeTab === 'video' && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl overflow-hidden aspect-video relative flex flex-col items-center justify-center text-white p-6 shadow-xl border border-slate-800">
              <div className="w-16 h-16 rounded-full bg-emerald-500/90 hover:bg-emerald-400 flex items-center justify-center cursor-pointer shadow-lg transition hover:scale-110">
                <Play className="w-7 h-7 text-emerald-950 ml-1" />
              </div>
              <p className="text-base font-bold mt-4 text-center">
                {currentMaterial.contentData.videoTitle}
              </p>
              <p className="text-xs text-emerald-300 mt-1">
                Narasumber: {currentMaterial.contentData.speaker} • Durasi: 12 Menit
              </p>
              <span className="text-[11px] text-slate-400 mt-2 bg-slate-800/80 px-3 py-1 rounded-full">
                Simulasi Pemutar Video Interaktif HD (YouTube Embedded Responsive)
              </span>
            </div>

            {/* Timestamps & Key Takeaways */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase text-slate-600 tracking-wider">
                  Daftar Waktu Pembahasan (Timestamps)
                </h4>
                <div className="space-y-2">
                  {currentMaterial.contentData.timestamps.map((ts: any, i: number) => (
                    <div key={i} className="flex items-center space-x-3 text-xs p-2 rounded-lg bg-white border border-slate-200">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {ts.time}
                      </span>
                      <span className="text-slate-800">{ts.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <h4 className="font-bold text-xs uppercase text-emerald-800 tracking-wider">
                  Kesimpulan Pokok Video (Key Takeaways)
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {currentMaterial.contentData.keyTakeaways.map((take: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{take}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIO PODCAST */}
        {activeTab === 'audio' && (
          <div className="space-y-6">
            {/* Audio Player Component */}
            <div className="p-6 rounded-3xl bg-emerald-950 text-white space-y-5 shadow-lg border border-emerald-900">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-900 px-2.5 py-0.5 rounded-full">
                    Kajian Suara Audio PAI
                  </span>
                  <h3 className="font-bold text-lg text-white mt-1">
                    {currentMaterial.contentData.audioTitle}
                  </h3>
                  <p className="text-xs text-emerald-300">
                    Oleh: {currentMaterial.contentData.speaker}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-800 flex items-center justify-center text-emerald-200">
                  <Volume2 className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* Scrubbing Bar */}
              <div className="space-y-2">
                <div className="w-full bg-emerald-900 h-2 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all"
                    style={{ width: `${audioProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-300 font-mono">
                  <span>02:15</span>
                  <span>09:00</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs flex items-center space-x-2 shadow-md transition"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  <span>{isPlayingAudio ? 'Jeda Audio (Pause)' : 'Putar Audio (Play)'}</span>
                </button>
              </div>
            </div>

            {/* Transcript */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Transkrip Lengkap Audio</h4>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-serif italic">
                {currentMaterial.contentData.transcript}
              </p>
            </div>
          </div>
        )}

        {/* TAB 6: PRESENTASI INTERAKTIF */}
        {activeTab === 'presentasi' && (
          <div className="space-y-4">
            {/* Slide Viewer */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 min-h-[360px] flex flex-col justify-between shadow-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-emerald-300 border-b border-emerald-900/60 pb-3">
                <span className="font-mono font-bold">
                  Slide {currentSlideIndex + 1} dari {currentMaterial.contentData.slides.length}
                </span>
                <span className="uppercase tracking-wider">Slide Interaktif PAI KELAS X 3 (Fase E)</span>
              </div>

              <div className="py-6 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {currentMaterial.contentData.slides[currentSlideIndex].title}
                </h3>
                <ul className="space-y-3 mt-4">
                  {currentMaterial.contentData.slides[currentSlideIndex].bullets.map(
                    (bullet: string, i: number) => (
                      <li key={i} className="flex items-start space-x-3 text-sm text-emerald-100">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Slide Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-emerald-900/60">
                <button
                  disabled={currentSlideIndex === 0}
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                <div className="flex items-center space-x-1.5">
                  {currentMaterial.contentData.slides.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentSlideIndex ? 'bg-emerald-400 w-6' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={currentSlideIndex === currentMaterial.contentData.slides.length - 1}
                  onClick={() =>
                    setCurrentSlideIndex((prev) =>
                      Math.min(currentMaterial.contentData.slides.length - 1, prev + 1)
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: CONTOH KASUS */}
        {activeTab === 'kasus' && (
          <div className="space-y-6">
            {currentMaterial.contentData.map((kasus: any) => (
              <div
                key={kasus.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 hover:border-emerald-300 transition"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900">{kasus.title}</h3>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                    Studi Kasus Siswa
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <strong className="block text-slate-900 mb-1">Kronologi Kasus:</strong>
                  {kasus.scenario}
                </div>

                <div className="space-y-2">
                  <strong className="text-xs text-emerald-900 block">Pertanyaan Analisis:</strong>
                  <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                    {kasus.analysisQuestions.map((q: string, i: number) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-slate-800 leading-relaxed">
                  <strong className="block text-emerald-950 mb-1">Solusi & Tinjauan Syariat Islam:</strong>
                  {kasus.solution}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 8: SUMBER BACAAN / FATWA */}
        {activeTab === 'bacaan' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
              <h3 className="font-bold text-base text-emerald-950 mb-1">
                {currentMaterial.contentData.fatwaTitle}
              </h3>
              <p className="text-xs text-emerald-800">
                Tentang Hukum dan Pedoman Bermuamalah Melalui Media Sosial
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentMaterial.contentData.ketentuanHukum.map((item: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">Poin {item.poin}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        item.hukum === 'Wajib'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.hukum}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: CHECKLIST INTERAKTIF */}
        {activeTab === 'interaktif' && (
          <div className="space-y-6">
            {/* Score Display */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-white">Indeks Kesalehan Digital Anda</h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Centang setiap pernyataan di bawah sesuai kebiasaan aslimu saat menggunakan smartphone.
                </p>
              </div>
              <div className="text-center bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
                <span className="text-3xl font-extrabold text-white">{checklistScore}%</span>
                <p className="text-[10px] text-emerald-200 mt-0.5">
                  {checklistScore >= 80 ? 'Sangat Beradab' : 'Perlu Ditingkatkan'}
                </p>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2.5">
              {currentMaterial.contentData.checklistItems.map((item: string, idx: number) => {
                const isChecked = !!checklistAnswers[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleChecklistItem(idx)}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] bg-slate-200 text-slate-700">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleChecklistItem(idx)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
