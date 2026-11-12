import React, { useState, useEffect } from 'react';
import { ACTIVITIES_DATA } from '../../data/materialsData';
import { LearningStyle, User, MaterialItem } from '../../types';
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
  BookOpen,
  Volume2,
  ExternalLink,
  Calendar,
  Layers,
  Download,
  FileText,
  FileSpreadsheet,
  Music,
  Film,
  File,
} from 'lucide-react';
import { getMaterialsFromFirestore } from '../../services/firebaseService';

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

  // Load custom materials added by teacher
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

  // Filter materials based on selected learning style
  const teacherMaterialsForSelectedStyle = customMaterials.filter((m) => {
    const cat =
      m.learningStyleCategory ||
      (m.contentData as any)?.learningStyleCategory ||
      (m.contentData as any)?.category;

    if (selectedStyle === 'auditory') {
      return cat === 'auditory' || cat === 'audio' || m.type === 'audio';
    }
    if (selectedStyle === 'visual') {
      return (
        cat === 'visual' ||
        m.type === 'gambar' ||
        m.type === 'infografis' ||
        m.type === 'presentasi'
      );
    }
    if (selectedStyle === 'kinesthetic') {
      return (
        cat === 'kinesthetic' ||
        cat === 'kinestetik' ||
        m.type === 'kasus' ||
        m.type === 'interaktif'
      );
    }
    return false;
  });

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

      {/* SECTION MATERI TERINTEGRASI DARI GURU SESUAI KATEGORI GAYA BELAJAR */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                selectedStyle === 'auditory'
                  ? 'bg-blue-100 text-blue-700'
                  : selectedStyle === 'visual'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {selectedStyle === 'auditory' ? (
                <Volume2 className="w-5 h-5" />
              ) : selectedStyle === 'visual' ? (
                <Eye className="w-5 h-5" />
              ) : (
                <Footprints className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Materi PAI Guru: Kategori {selectedStyle === 'auditory' ? 'Audio (Gaya AUDITORI)' : selectedStyle === 'visual' ? 'Visual (Gaya VISUAL)' : 'Kinestetik (Gaya KINESTETIK)'}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedStyle === 'auditory'
                  ? 'Materi kategori Audio dari guru pengampu yang siap dipelajari untuk gaya belajar AUDITORI'
                  : selectedStyle === 'visual'
                  ? 'Materi kategori Visual dari guru pengampu yang siap dipelajari untuk gaya belajar VISUAL'
                  : 'Materi kategori Kinestetik dari guru pengampu yang siap dipelajari untuk gaya belajar KINESTETIK'}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
              selectedStyle === 'auditory'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : selectedStyle === 'visual'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {teacherMaterialsForSelectedStyle.length} Materi Tersedia
          </span>
        </div>

        {teacherMaterialsForSelectedStyle.length > 0 ? (
          <div className="space-y-4">
            {teacherMaterialsForSelectedStyle.map((m) => (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border transition space-y-3 ${
                  selectedStyle === 'auditory'
                    ? 'bg-blue-50/50 border-blue-200 hover:border-blue-400'
                    : selectedStyle === 'visual'
                    ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400'
                    : 'bg-amber-50/50 border-amber-200 hover:border-amber-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                        Materi Guru • {selectedStyle === 'auditory' ? 'Kategori Audio' : selectedStyle === 'visual' ? 'Kategori Visual' : 'Kategori Kinestetik'}
                      </span>
                      {m.gradeLevel && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                          {m.gradeLevel === 'all' ? 'Semua Tingkat' : `Kelas ${m.gradeLevel}`}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900">{m.title}</h4>
                    <p className="text-xs text-slate-600">{m.subtitle}</p>
                  </div>

                  {(m.contentData as any)?.mediaUrl && (
                    <a
                      href={(m.contentData as any).mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition self-start shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{selectedStyle === 'auditory' ? 'Buka / Putar Audio' : 'Buka Tautan Media'}</span>
                    </a>
                  )}
                </div>

                {m.summary && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 block mb-0.5">Ringkasan Materi:</strong>
                    {m.summary}
                  </div>
                )}

                {(m.contentData as any)?.text && (
                  <div className="p-3.5 bg-white/90 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                    <strong className="text-slate-900 block mb-1">Uraian Pembahasan:</strong>
                    {(m.contentData as any).text}
                  </div>
                )}

                {/* Berkas Materi Multi-Format (Audio, Video, Gambar, Dokumen, Tabel) */}
                {(m.contentData as any)?.fileAttachment && (
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                          {(m.contentData as any).fileAttachment.extension}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {(m.contentData as any).fileAttachment.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Berkas Penunjang Gaya Belajar • {(m.contentData as any).fileAttachment.size}
                          </p>
                        </div>
                      </div>
                      <a
                        href={(m.contentData as any).fileAttachment.dataUrl}
                        download={(m.contentData as any).fileAttachment.name}
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition self-start sm:self-auto shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Berkas</span>
                      </a>
                    </div>

                    {/* AUDIO PLAYER: .mp3, .wav, .m4a, .ogg */}
                    {['mp3', 'wav', 'm4a', 'ogg', 'aac'].includes(
                      (m.contentData as any).fileAttachment.extension
                    ) && (
                      <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1.5">
                        <span className="text-[11px] font-bold text-blue-900 flex items-center space-x-1.5">
                          <Volume2 className="w-4 h-4 text-blue-700" />
                          <span>Pemutar Audio Kajian / Podcast (Gaya Auditori):</span>
                        </span>
                        <audio
                          controls
                          className="w-full h-10 rounded-lg outline-hidden"
                          src={(m.contentData as any).fileAttachment.dataUrl}
                        />
                      </div>
                    )}

                    {/* VIDEO PLAYER: .mp4, .webm, .mov */}
                    {['mp4', 'webm', 'mov'].includes(
                      (m.contentData as any).fileAttachment.extension
                    ) && (
                      <div className="rounded-xl overflow-hidden border border-slate-300 bg-black">
                        <video
                          controls
                          className="w-full max-h-72 object-contain mx-auto"
                          src={(m.contentData as any).fileAttachment.dataUrl}
                        />
                      </div>
                    )}

                    {/* IMAGE PREVIEW: .jpg, .png, .webp, .gif */}
                    {['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(
                      (m.contentData as any).fileAttachment.extension
                    ) && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-white p-2 text-center">
                        <img
                          src={(m.contentData as any).fileAttachment.dataUrl}
                          alt={(m.contentData as any).fileAttachment.name}
                          className="max-h-72 w-auto max-w-full object-contain mx-auto rounded-lg"
                        />
                      </div>
                    )}

                    {/* DOKUMEN / SPREADSHEET / CSV: .pdf, .xlsx, .csv, .docx */}
                    {['pdf', 'xlsx', 'xls', 'csv', 'docx', 'pptx'].includes(
                      (m.contentData as any).fileAttachment.extension
                    ) && (
                      <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                        <span className="text-emerald-950 font-semibold flex items-center space-x-1.5">
                          {['xlsx', 'xls', 'csv'].includes(
                            (m.contentData as any).fileAttachment.extension
                          ) ? (
                            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                          ) : (
                            <FileText className="w-4 h-4 text-emerald-700" />
                          )}
                          <span>
                            Berkas Penunjang ({((m.contentData as any).fileAttachment.extension).toUpperCase()}): Siap dipelajari untuk aktivitas diferensiasi
                          </span>
                        </span>
                        <a
                          href={(m.contentData as any).fileAttachment.dataUrl}
                          download={(m.contentData as any).fileAttachment.name}
                          className="text-emerald-700 hover:text-emerald-800 font-bold underline ml-2"
                        >
                          Buka / Simpan
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
            <p className="text-xs font-bold text-slate-700">
              Belum ada materi tambahan khusus kategori {selectedStyle === 'auditory' ? 'Audio' : selectedStyle === 'visual' ? 'Visual' : 'Kinestetik'} dari guru.
            </p>
            <p className="text-[11px] text-slate-400 max-w-lg mx-auto">
              Ketika guru menambahkan Materi PAI Baru dan memilih kategori{' '}
              <strong>{selectedStyle === 'auditory' ? 'Audio' : selectedStyle === 'visual' ? 'Visual' : 'Kinestetik'}</strong>,
              materi tersebut akan otomatis tampil di tab ini.
            </p>
          </div>
        )}
      </div>

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
