import React, { useState, useEffect } from 'react';
import { User, ReflectionEntry, ReflectionPrompt } from '../../types';
import {
  getReflectionsFromFirestore,
  saveReflectionToFirestore,
  deleteReflectionFromFirestore,
  getReflectionPromptsFromFirestore,
  saveReflectionPromptToFirestore,
  deleteReflectionPromptFromFirestore,
} from '../../services/firebaseService';
import {
  Smile,
  Send,
  CheckCircle2,
  HeartHandshake,
  Plus,
  Trash2,
  X,
  MessageSquarePlus,
  Sparkles,
} from 'lucide-react';

interface RefleksiPageProps {
  currentUser: User;
}

const REFLECTIONS_STORAGE_KEY = 'mpd_reflections';
const REFLECTION_PROMPTS_STORAGE_KEY = 'mpd_reflection_prompts';

const DEFAULT_REFLECTIONS: ReflectionEntry[] = [
  {
    id: 'ref-1',
    studentName: 'ASSYFA KIRANI ARPIS',
    authorRole: 'student',
    understandingLevel: 'Sangat Paham',
    biggestChallenge: 'Kadang masih sulit menahan rasa penasaran saat melihat gosip viral di linimasa TikTok.',
    mostHelpfulActivity: 'Teks dalil QS. Al-Hujurat: 6 dan podcast audio Pak Wandra tentang menjaga lisan.',
    actionCommitment: 'Berjanji tidak akan pernah mem-forward pesan apa pun di grup kelas sebelum mengecek kebenarannya.',
    date: 'Kemarin',
  },
  {
    id: 'ref-2',
    studentName: 'GIBRAN ALVARO SABIL',
    authorRole: 'student',
    understandingLevel: 'Paham',
    biggestChallenge: 'Mengingatkan teman di media sosial tanpa membuatnya tersinggung.',
    mostHelpfulActivity: 'Studi kasus kontekstual akun menfess dan kaidah Qaulan Layyina.',
    actionCommitment: 'Akan menegur teman lewat japri (private message) secara santun jika melihat postingan yang keliru.',
    date: 'Hari ini',
  },
];

export const RefleksiPage: React.FC<RefleksiPageProps> = ({ currentUser }) => {
  const isTeacherOrAdmin = currentUser.role !== 'student';

  // Form inline state
  const [understandingLevel, setUnderstandingLevel] = useState<
    'Sangat Paham' | 'Paham' | 'Cukup Paham' | 'Masih Bingung'
  >('Sangat Paham');
  const [challenge, setChallenge] = useState('');
  const [helpfulActivity, setHelpfulActivity] = useState(
    'Menganalisis studi kasus nyata perundungan siber dan infografis 6 langkah tabayyun.'
  );
  const [commitment, setCommitment] = useState('');
  const [promptAnswers, setPromptAnswers] = useState<{ [promptId: string]: string }>({});
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Kumpulan refleksi (localStorage + Firestore)
  const [reflections, setReflections] = useState<ReflectionEntry[]>(() => {
    try {
      const saved = localStorage.getItem(REFLECTIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_REFLECTIONS;
    } catch {
      return DEFAULT_REFLECTIONS;
    }
  });

  // Topik / Pertanyaan Refleksi Tambahan dari Guru/Admin
  const [reflectionPrompts, setReflectionPrompts] = useState<ReflectionPrompt[]>(() => {
    try {
      const saved = localStorage.getItem(REFLECTION_PROMPTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal Tambah Refleksi
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<'prompt' | 'entry'>(
    isTeacherOrAdmin ? 'prompt' : 'entry'
  );

  // State untuk form modal Pertanyaan Refleksi Guru
  const [promptTitle, setPromptTitle] = useState('');
  const [promptQuestion, setPromptQuestion] = useState('');
  const [promptCategory, setPromptCategory] = useState<ReflectionPrompt['category']>('Refleksi Harian');

  // State untuk form modal Tambah Catatan Refleksi
  const [modalUnderstanding, setModalUnderstanding] = useState<
    'Sangat Paham' | 'Paham' | 'Cukup Paham' | 'Masih Bingung'
  >('Sangat Paham');
  const [modalChallenge, setModalChallenge] = useState('');
  const [modalHelpful, setModalHelpful] = useState(
    'Diskusi dan materi berdiferensiasi di MPD-DigPAI.'
  );
  const [modalCommitment, setModalCommitment] = useState('');

  // Load dari Firestore saat halaman dibuka
  useEffect(() => {
    let mounted = true;
    getReflectionsFromFirestore().then((remote) => {
      if (!mounted || !remote || remote.length === 0) return;
      setReflections(remote);
      localStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(remote));
    });
    getReflectionPromptsFromFirestore().then((remotePrompts) => {
      if (!mounted || !remotePrompts) return;
      setReflectionPrompts(remotePrompts);
      localStorage.setItem(REFLECTION_PROMPTS_STORAGE_KEY, JSON.stringify(remotePrompts));
    });
    return () => {
      mounted = false;
    };
  }, []);

  const flashNotice = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(null), 5000);
  };

  const formatNowDate = () => {
    const now = new Date();
    return now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const saveNewReflectionEntry = async (
    level: ReflectionEntry['understandingLevel'],
    ch: string,
    helpful: string,
    comm: string
  ) => {
    const answeredPrompts = reflectionPrompts
      .filter((p) => (promptAnswers[p.id] || '').trim().length > 0)
      .map((p) => ({
        promptId: p.id,
        title: p.title,
        answer: promptAnswers[p.id].trim(),
      }));

    const newRef: ReflectionEntry = {
      id: `ref-${Date.now()}`,
      studentName: currentUser.name,
      authorRole: currentUser.role,
      understandingLevel: level,
      biggestChallenge: ch.trim() || 'Tidak ada kendala berarti.',
      mostHelpfulActivity: helpful.trim() || 'Aktivitas pembelajaran MPD-DigPAI.',
      actionCommitment: comm.trim(),
      ...(answeredPrompts.length > 0 ? { promptAnswers: answeredPrompts } : {}),
      date: formatNowDate(),
    };

    const updated = [newRef, ...reflections];
    setReflections(updated);
    localStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(updated));
    await saveReflectionToFirestore(newRef);
  };

  const handleSubmitInline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitment.trim()) return;

    await saveNewReflectionEntry(understandingLevel, challenge, helpfulActivity, commitment);
    setChallenge('');
    setCommitment('');
    setPromptAnswers({});
    flashNotice(
      'Alhamdulillah, refleksi metakognisi Anda berhasil disimpan dan akan dievaluasi oleh Guru Pengampu!'
    );
  };

  const handleOpenAddModal = () => {
    setModalMode(isTeacherOrAdmin ? 'prompt' : 'entry');
    setPromptTitle('');
    setPromptQuestion('');
    setPromptCategory('Refleksi Harian');
    setModalUnderstanding('Sangat Paham');
    setModalChallenge('');
    setModalCommitment('');
    setShowAddModal(true);
  };

  const handleSavePromptModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTeacherOrAdmin || !promptTitle.trim() || !promptQuestion.trim()) return;

    const newPrompt: ReflectionPrompt = {
      id: `prompt-${Date.now()}`,
      title: promptTitle.trim(),
      question: promptQuestion.trim(),
      category: promptCategory,
      createdBy: currentUser.name,
      createdAt: formatNowDate(),
    };

    const updated = [newPrompt, ...reflectionPrompts];
    setReflectionPrompts(updated);
    localStorage.setItem(REFLECTION_PROMPTS_STORAGE_KEY, JSON.stringify(updated));
    await saveReflectionPromptToFirestore(newPrompt);

    setShowAddModal(false);
    flashNotice('Pertanyaan / topik refleksi baru berhasil ditambahkan untuk dijawab siswa.');
  };

  const handleSaveEntryModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalCommitment.trim()) return;

    await saveNewReflectionEntry(
      modalUnderstanding,
      modalChallenge,
      modalHelpful,
      modalCommitment
    );
    setShowAddModal(false);
    flashNotice('Catatan refleksi baru berhasil ditambahkan dan tersimpan ke database.');
  };

  const handleDeleteReflection = async (id: string) => {
    if (!isTeacherOrAdmin) return;
    const updated = reflections.filter((r) => r.id !== id);
    setReflections(updated);
    localStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(updated));
    await deleteReflectionFromFirestore(id);
    flashNotice('Catatan refleksi berhasil dihapus.');
  };

  const handleDeletePrompt = async (id: string) => {
    if (!isTeacherOrAdmin) return;
    const updated = reflectionPrompts.filter((p) => p.id !== id);
    setReflectionPrompts(updated);
    localStorage.setItem(REFLECTION_PROMPTS_STORAGE_KEY, JSON.stringify(updated));
    await deleteReflectionPromptFromFirestore(id);
    flashNotice('Topik refleksi tambahan berhasil dihapus.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* MODAL TAMBAH REFLEKSI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <MessageSquarePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Tambah Refleksi Baru
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isTeacherOrAdmin
                      ? 'Buat pertanyaan refleksi baru untuk siswa atau tambahkan catatan refleksi.'
                      : 'Tuliskan evaluasi pemahaman dan komitmen akhlak digital Anda.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isTeacherOrAdmin && (
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setModalMode('prompt')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                    modalMode === 'prompt'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Topik Pertanyaan Siswa
                </button>
                <button
                  type="button"
                  onClick={() => setModalMode('entry')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                    modalMode === 'entry'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Catatan Refleksi Baru
                </button>
              </div>
            )}

            {isTeacherOrAdmin && modalMode === 'prompt' ? (
              <form onSubmit={handleSavePromptModal} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Kategori Topik Refleksi
                  </label>
                  <select
                    value={promptCategory}
                    onChange={(e) =>
                      setPromptCategory(e.target.value as ReflectionPrompt['category'])
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  >
                    <option value="Refleksi Harian">Refleksi Harian</option>
                    <option value="Pemahaman">Pemahaman Konsep &amp; Dalil</option>
                    <option value="Tantangan">Tantangan &amp; Pengalaman Nyata</option>
                    <option value="Komitmen">Komitmen Perubahan Sikap</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Judul / Tema Refleksi *
                  </label>
                  <input
                    type="text"
                    value={promptTitle}
                    onChange={(e) => setPromptTitle(e.target.value)}
                    placeholder="Contoh: Muhasabah Penggunaan Media Sosial Pekan Ini"
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Pertanyaan Pemantik untuk Siswa *
                  </label>
                  <textarea
                    rows={3}
                    value={promptQuestion}
                    onChange={(e) => setPromptQuestion(e.target.value)}
                    placeholder="Contoh: Ceritakan satu situasi minggu ini di mana Anda menerapkan prinsip Tabayyun sebelum membagikan informasi..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Terbitkan Topik Refleksi</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveEntryModal} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Tingkat Pemahaman Materi
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Sangat Paham', 'Paham', 'Cukup Paham', 'Masih Bingung'] as const).map(
                      (lvl) => (
                        <button
                          type="button"
                          key={lvl}
                          onClick={() => setModalUnderstanding(lvl)}
                          className={`p-2.5 rounded-xl border text-[11px] font-bold transition cursor-pointer ${
                            modalUnderstanding === lvl
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {lvl}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Tantangan / Hal yang Perlu Dikuatkan
                  </label>
                  <input
                    type="text"
                    value={modalChallenge}
                    onChange={(e) => setModalChallenge(e.target.value)}
                    placeholder="Contoh: Menjaga lisan dan komentar di media sosial..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Aktivitas yang Paling Membantu
                  </label>
                  <input
                    type="text"
                    value={modalHelpful}
                    onChange={(e) => setModalHelpful(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Komitmen / Pesan Refleksi *
                  </label>
                  <textarea
                    rows={3}
                    value={modalCommitment}
                    onChange={(e) => setModalCommitment(e.target.value)}
                    placeholder="Tuliskan komitmen nyata atau refleksi pembelajaran Anda..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Simpan Refleksi</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Title Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 text-emerald-700 mb-2">
              <Smile className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-wider">Halaman 10 / 11</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Refleksi Metakognisi &amp; Komitmen Diri Siswa
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Bercermin pada pemahaman diri, mengevaluasi kesulitan, dan merumuskan tekad berakhlak mulia di jagat digital.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition shrink-0 self-start cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Refleksi</span>
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center space-x-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span className="text-xs font-semibold">{savedMessage}</span>
        </div>
      )}

      {/* TOPIK REFLEKSI TAMBAHAN DARI GURU */}
      {reflectionPrompts.length > 0 && (
        <div className="bg-emerald-50/60 rounded-3xl p-6 border border-emerald-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-emerald-950 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Pertanyaan Refleksi Tambahan dari Guru ({reflectionPrompts.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reflectionPrompts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      {p.category}
                    </span>
                    <h3 className="font-bold text-xs text-slate-900 mt-1">{p.title}</h3>
                  </div>
                  {isTeacherOrAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeletePrompt(p.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                      title="Hapus pertanyaan refleksi ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{p.question}</p>
                <div className="text-[10px] text-slate-400">
                  Oleh {p.createdBy} • {p.createdAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FORMULIR REFLEKSI */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="font-bold text-base text-slate-900">
            Formulir Evaluasi Diri ({currentUser.name})
          </h2>
          <p className="text-xs text-slate-500">
            Jawablah dengan jujur sesuai apa yang Anda rasakan selama proses pembelajaran.
          </p>
        </div>

        <form onSubmit={handleSubmitInline} className="space-y-5">
          {/* 1. Tingkat Pemahaman */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              1. Seberapa paham Anda terhadap materi Adab Bersosial Media dalam Islam?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['Sangat Paham', 'Paham', 'Cukup Paham', 'Masih Bingung'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setUnderstandingLevel(lvl)}
                  className={`p-3 rounded-xl border text-xs font-bold transition text-center cursor-pointer ${
                    understandingLevel === lvl
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Kesulitan yang Dihadapi */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              2. Apa kesulitan atau tantangan terbesar yang Anda hadapi saat mempraktikkan materi ini?
            </label>
            <input
              type="text"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="Contoh: Menahan diri dari membalas komentar toxic dengan nada emosi..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
              required
            />
          </div>

          {/* 3. Aktivitas yang Paling Membantu */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              3. Aktivitas pembelajaran mana di MPD-DigPAI yang paling membantu pemahaman Anda?
            </label>
            <input
              type="text"
              value={helpfulActivity}
              onChange={(e) => setHelpfulActivity(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
              required
            />
          </div>

          {/* 4. Komitmen Aksi Nyata */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              4. Apa rencana aksi nyata / komitmen Anda saat berinteraksi di media sosial mulai hari ini?
            </label>
            <textarea
              rows={3}
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              placeholder="Tuliskan komitmen moralmu, misalnya: 'Saya berkomitmen untuk saring sebelum sharing dan mematikan notifikasi saat waktu sholat tiba'..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
              required
            />
          </div>

          {/* PERTANYAAN TAMBAHAN DARI GURU */}
          {reflectionPrompts.map((p, idx) => (
            <div key={p.id} className="space-y-1.5 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200">
              <label className="text-xs font-bold text-emerald-950 block">
                {5 + idx}. [{p.category}] {p.title}
              </label>
              <p className="text-[11px] text-emerald-800 mb-1.5">{p.question}</p>
              <textarea
                rows={2}
                value={promptAnswers[p.id] || ''}
                onChange={(e) =>
                  setPromptAnswers((prev) => ({ ...prev, [p.id]: e.target.value }))
                }
                placeholder="Tuliskan jawaban refleksi Anda untuk pertanyaan guru ini..."
                className="w-full p-3 rounded-xl border border-emerald-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
              />
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simpan Lembar Refleksi</span>
            </button>
          </div>
        </form>
      </div>

      {/* CATATAN REFLEKSI REKAN KELAS */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
          <HeartHandshake className="w-5 h-5 text-emerald-600" />
          <span>Kumpulan Komitmen &amp; Refleksi Rekan Siswa ({reflections.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reflections.map((ref) => (
            <div
              key={ref.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-slate-900">{ref.studentName}</h4>
                    {ref.authorRole === 'teacher' && (
                      <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
                        Guru
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{ref.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {ref.understandingLevel}
                  </span>
                  {isTeacherOrAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteReflection(ref.id)}
                      className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                      title="Hapus refleksi ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-700 space-y-2">
                <p>
                  <strong className="text-slate-900">Kendala:</strong> {ref.biggestChallenge}
                </p>
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 italic text-emerald-950">
                  <strong className="not-italic block text-emerald-900 text-[11px] mb-0.5">
                    Komitmen Aksi:
                  </strong>
                  “{ref.actionCommitment}”
                </div>
                {ref.promptAnswers && ref.promptAnswers.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {ref.promptAnswers.map((pa) => (
                      <div
                        key={pa.promptId}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px]"
                      >
                        <strong className="block text-slate-800">{pa.title}:</strong>
                        <span className="text-slate-600">{pa.answer}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
