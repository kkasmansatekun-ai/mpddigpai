import React, { useState, useEffect } from 'react';
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
  PlusCircle,
  Trash2,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  saveMaterialToFirestore,
  getMaterialsFromFirestore,
} from '../../services/firebaseService';

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

  // Custom materials added by teacher
  const [customMaterials, setCustomMaterials] = useState<MaterialItem[]>(() => {
    const saved = localStorage.getItem('mpd_custom_materials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [addFeedback, setAddFeedback] = useState<string | null>(null);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newType, setNewType] = useState('teks');
  const [newBadge, setNewBadge] = useState('Materi Tambahan');
  const [newDuration, setNewDuration] = useState('10 Menit');
  const [newSummary, setNewSummary] = useState('');
  const [newContentText, setNewContentText] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');

  // Load from Firestore
  useEffect(() => {
    getMaterialsFromFirestore().then((cloudMats) => {
      if (cloudMats && cloudMats.length > 0) {
        setCustomMaterials((prev) => {
          const map = new Map<string, MaterialItem>();
          cloudMats.forEach((m: any) => map.set(m.id, m));
          prev.forEach((m) => {
            if (!map.has(m.id)) map.set(m.id, m);
          });
          const merged = Array.from(map.values());
          localStorage.setItem('mpd_custom_materials', JSON.stringify(merged));
          return merged;
        });
      }
    });
  }, []);

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

  const allAvailableMaterials = [...LEARNING_MATERIALS, ...customMaterials];
  const currentMaterial =
    allAvailableMaterials.find((m) => m.id === activeTab || m.type === activeTab) ||
    LEARNING_MATERIALS[0];

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newId = `custom-mat-${Date.now()}`;
    const newItem: MaterialItem = {
      id: newId,
      type: newType as any,
      title: newTitle,
      subtitle: newSubtitle || 'Materi Tambahan Guru PAI',
      badge: newBadge || 'Materi Baru',
      duration: newDuration || '10 Menit',
      summary: newSummary || 'Ringkasan materi pembelajaran PAI.',
      contentData: {
        isCustom: true,
        text: newContentText,
        mediaUrl: newMediaUrl,
        addedAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      },
    };

    const updated = [newItem, ...customMaterials];
    setCustomMaterials(updated);
    localStorage.setItem('mpd_custom_materials', JSON.stringify(updated));

    // Save to Firestore
    saveMaterialToFirestore(newItem).catch(console.warn);

    // Reset & activate
    setActiveTab(newId);
    setShowAddModal(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewSummary('');
    setNewContentText('');
    setNewMediaUrl('');

    setAddFeedback(`Materi "${newItem.title}" berhasil ditambahkan dan disimpan ke database!`);
    setTimeout(() => setAddFeedback(null), 5000);
  };

  const handleDeleteCustomMaterial = (matId: string) => {
    const updated = customMaterials.filter((m) => m.id !== matId);
    setCustomMaterials(updated);
    localStorage.setItem('mpd_custom_materials', JSON.stringify(updated));
    setActiveTab('teks');
    setAddFeedback('Materi tambahan berhasil dihapus.');
    setTimeout(() => setAddFeedback(null), 4000);
  };

  const toggleChecklistItem = (idx: number) => {
    setChecklistAnswers((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const checklistScore = Object.values(checklistAnswers).filter(Boolean).length * 10;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Toast Feedback */}
      {addFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center space-x-2.5 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{addFeedback}</span>
        </div>
      )}

      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
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
              Disediakan dalam berbagai representasi media untuk mengakomodasi berbagai preferensi dan gaya belajar peserta didik.
            </p>
          </div>

          {/* TOMBOL "TAMBAH MATERI" */}
          <div className="shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition hover:scale-102 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-200" />
              <span>Tambah Materi</span>
            </button>
          </div>
        </div>

        {/* 9 MEDIA TABS SELECTOR + CUSTOM MATERIALS */}
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

          {/* TAB MATERI TAMBAHAN GURU */}
          {customMaterials.map((cm) => {
            const isActive = activeTab === cm.id;
            return (
              <button
                key={cm.id}
                onClick={() => setActiveTab(cm.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="truncate max-w-[140px]">{cm.title}</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded">Baru</span>
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

        {/* CUSTOM MATERIAL DISPLAY */}
        {(currentMaterial as any)?.contentData?.isCustom && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                  Materi Tambahan Guru
                </span>
                <button
                  onClick={() => handleDeleteCustomMaterial(currentMaterial.id)}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center space-x-1 border border-rose-200 transition"
                  title="Hapus materi ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Materi</span>
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">{currentMaterial.title}</h3>
                <p className="text-xs text-slate-600 font-medium">{currentMaterial.subtitle}</p>
              </div>

              {currentMaterial.summary && (
                <div className="p-3.5 bg-white rounded-xl border border-amber-200 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-amber-950 block mb-0.5">Ringkasan Materi:</strong>
                  {currentMaterial.summary}
                </div>
              )}
            </div>

            {/* Content text */}
            {(currentMaterial as any).contentData?.text && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <h4 className="font-bold text-sm text-slate-900">Uraian Materi & Pembahasan:</h4>
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {(currentMaterial as any).contentData.text}
                </div>
              </div>
            )}

            {/* Media Link / Embedded if provided */}
            {(currentMaterial as any).contentData?.mediaUrl && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-700">
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
                  <span>Tautan Media Rujukan:</span>
                  <span className="font-mono text-emerald-800 truncate max-w-xs sm:max-w-md">
                    {(currentMaterial as any).contentData.mediaUrl}
                  </span>
                </div>
                <a
                  href={(currentMaterial as any).contentData.mediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition shrink-0"
                >
                  Buka Tautan
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL FORM TAMBAH MATERI */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-emerald-800">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">Tambah Materi PAI Baru</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMaterialSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Judul Materi PAI *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Menjaga Kehormatan & Membendung Gibah Digital"
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Subjudul / Topik</label>
                  <input
                    type="text"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    placeholder="Contoh: Kajian Hadis Shahih & Etika Siber"
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Format Representasi Media</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  >
                    <option value="teks">Teks & Dalil Syar'i</option>
                    <option value="video">Video Penjelasan</option>
                    <option value="audio">Kajian Audio Podcast</option>
                    <option value="infografis">Infografis & Gambar</option>
                    <option value="kasus">Studi Kasus Faktual</option>
                    <option value="bacaan">E-Book & Artikel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Label Badge</label>
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    placeholder="Contoh: Video Interaktif / Modul Tambahan"
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Estimasi Durasi Belajar</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="Contoh: 12 Menit Belajar"
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Ringkasan Materi *</label>
                <textarea
                  rows={2}
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Ringkasan singkat mengenai pesan utama materi ini..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Isi Pembahasan / Teks Materi *</label>
                <textarea
                  rows={4}
                  required
                  value={newContentText}
                  onChange={(e) => setNewContentText(e.target.value)}
                  placeholder="Tuliskan uraian materi, dalil Al-Qur'an/Hadits, atau poin-poin penjelasan di sini..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Link Video / Audio / Rujukan Online (Opsional)</label>
                <input
                  type="url"
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  placeholder="https://youtube.com/... atau https://..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition flex items-center space-x-1.5 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Simpan Materi ke Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
