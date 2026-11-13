import React, { useState, useEffect } from 'react';
import { ASSESSMENT_QUESTIONS } from '../../data/materialsData';
import { AssessmentQuestion, User } from '../../types';
import {
  getCustomAssessmentsFromFirestore,
  saveCustomAssessmentToFirestore,
  deleteCustomAssessmentFromFirestore,
} from '../../services/firebaseService';
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Plus,
  Edit3,
  Trash2,
  X,
  BookOpenCheck,
  Check,
} from 'lucide-react';

interface AsesmenPageProps {
  currentUser: User;
  onSaveSummativeScore: (score: number) => void;
}

const CUSTOM_ASSESSMENTS_STORAGE_KEY = 'mpd_custom_assessments';

export const AsesmenPage: React.FC<AsesmenPageProps> = ({
  currentUser,
  onSaveSummativeScore,
}) => {
  const isTeacherOrAdmin = currentUser.role !== 'student';

  const [activeCategory, setActiveCategory] = useState<'diagnostik' | 'formatif' | 'sumatif'>('diagnostik');
  const [answers, setAnswers] = useState<{ [id: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Soal Asesmen Tambahan (Dari Guru/Admin)
  const [customQuestions, setCustomQuestions] = useState<AssessmentQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_ASSESSMENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal Tambah / Edit Asesmen (Khusus Admin/Guru)
  const [showModal, setShowModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [formCategory, setFormCategory] = useState<'diagnostik' | 'formatif' | 'sumatif'>('diagnostik');
  const [formQuestion, setFormQuestion] = useState('');
  const [formDalil, setFormDalil] = useState('');
  const [formOptions, setFormOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState<number>(0);
  const [formExplanation, setFormExplanation] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Konfirmasi Hapus Soal & Flash Notice
  const [questionToDelete, setQuestionToDelete] = useState<AssessmentQuestion | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Sinkronisasi soal asesmen tambahan dari Firestore
  useEffect(() => {
    let mounted = true;
    getCustomAssessmentsFromFirestore().then((remote) => {
      if (!mounted || !remote) return;
      const sorted = [...remote].sort((a, b) => a.id - b.id);
      setCustomQuestions(sorted);
      localStorage.setItem(CUSTOM_ASSESSMENTS_STORAGE_KEY, JSON.stringify(sorted));
    });
    return () => {
      mounted = false;
    };
  }, []);

  const allQuestions: AssessmentQuestion[] = [...ASSESSMENT_QUESTIONS, ...customQuestions];

  const currentQuestions = allQuestions.filter((q) => q.category === activeCategory);

  const countByCategory = (cat: 'diagnostik' | 'formatif' | 'sumatif') =>
    allQuestions.filter((q) => q.category === cat).length;

  const isCustomQuestion = (id: number) => customQuestions.some((q) => q.id === id);

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 4000);
  };

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setIsSubmitted(false);
  };

  const calculateScore = () => {
    if (currentQuestions.length === 0) return 0;
    let correctCount = 0;
    currentQuestions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    return Math.round((correctCount / currentQuestions.length) * 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const score = calculateScore();
    if (activeCategory === 'sumatif') {
      onSaveSummativeScore(score);
    }
  };

  const openAddModal = () => {
    setEditingQuestionId(null);
    setFormCategory(activeCategory);
    setFormQuestion('');
    setFormDalil('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIndex(0);
    setFormExplanation('');
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (q: AssessmentQuestion) => {
    setEditingQuestionId(q.id);
    setFormCategory(q.category);
    setFormQuestion(q.question);
    setFormDalil(q.dalil || '');
    setFormOptions([
      q.options[0] || '',
      q.options[1] || '',
      q.options[2] || '',
      q.options[3] || '',
    ]);
    setFormCorrectIndex(q.correctIndex);
    setFormExplanation(q.explanation || '');
    setFormError(null);
    setShowModal(true);
  };

  const handleOptionTextChange = (idx: number, value: string) => {
    setFormOptions((prev) => {
      const next: [string, string, string, string] = [...prev] as [string, string, string, string];
      next[idx] = value;
      return next;
    });
  };

  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTeacherOrAdmin) return;

    if (!formQuestion.trim()) {
      setFormError('Pertanyaan asesmen wajib diisi.');
      return;
    }
    if (formOptions.some((opt) => !opt.trim())) {
      setFormError('Seluruh pilihan jawaban (A, B, C, dan D) wajib diisi lengkap.');
      return;
    }
    if (!formExplanation.trim()) {
      setFormError('Pembahasan / kunci penjelasan wajib diisi untuk umpan balik siswa.');
      return;
    }

    const questionObj: AssessmentQuestion = {
      id: editingQuestionId ?? Date.now(),
      category: formCategory,
      question: formQuestion.trim(),
      ...(formDalil.trim() ? { dalil: formDalil.trim() } : {}),
      options: formOptions.map((o) => o.trim()),
      correctIndex: formCorrectIndex,
      explanation: formExplanation.trim(),
    };

    const updatedList = editingQuestionId
      ? customQuestions.map((q) => (q.id === editingQuestionId ? questionObj : q))
      : [...customQuestions, questionObj];

    setCustomQuestions(updatedList);
    localStorage.setItem(CUSTOM_ASSESSMENTS_STORAGE_KEY, JSON.stringify(updatedList));
    await saveCustomAssessmentToFirestore(questionObj);

    setActiveCategory(formCategory);
    handleResetQuiz();
    setShowModal(false);
    showNotice(
      editingQuestionId
        ? 'Soal asesmen berhasil diperbarui dan disinkronkan ke akun siswa.'
        : 'Soal asesmen baru berhasil ditambahkan dan langsung tersedia untuk siswa.'
    );
  };

  const handleConfirmDeleteQuestion = async () => {
    if (!questionToDelete || !isTeacherOrAdmin) return;
    const targetId = questionToDelete.id;
    const updatedList = customQuestions.filter((q) => q.id !== targetId);
    setCustomQuestions(updatedList);
    localStorage.setItem(CUSTOM_ASSESSMENTS_STORAGE_KEY, JSON.stringify(updatedList));
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[targetId];
      return next;
    });
    setQuestionToDelete(null);
    await deleteCustomAssessmentFromFirestore(targetId);
    showNotice('Soal asesmen tambahan berhasil dihapus.');
  };

  const score = isSubmitted ? calculateScore() : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* MODAL KONFIRMASI HAPUS SOAL (KHUSUS ADMIN/GURU) */}
      {isTeacherOrAdmin && questionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-200 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                  Hapus Soal Asesmen
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                  Hapus Butir Soal Ini?
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200 line-clamp-3">
              “{questionToDelete.question}”
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setQuestionToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteQuestion}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Soal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT ASESMEN (KHUSUS ADMIN/GURU) */}
      {isTeacherOrAdmin && showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <BookOpenCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {editingQuestionId ? 'Edit Soal Asesmen PAI' : 'Tambah Asesmen PAI Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Soal akan tersimpan ke Firebase dan langsung tampil pada akun siswa.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveAssessment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Kategori Asesmen
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(e.target.value as 'diagnostik' | 'formatif' | 'sumatif')
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  >
                    <option value="diagnostik">1. Asesmen Diagnostik (Awal)</option>
                    <option value="formatif">2. Asesmen Formatif (Pemahaman)</option>
                    <option value="sumatif">3. Asesmen Sumatif (Hasil Belajar Akhir)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Dalil / Sumber Rujukan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formDalil}
                    onChange={(e) => setFormDalil(e.target.value)}
                    placeholder="Contoh: QS. Al-Hujurat: 6"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Pertanyaan Soal *
                </label>
                <textarea
                  rows={3}
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Tuliskan butir soal PAI secara jelas dan kontekstual..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Pilihan Jawaban &amp; Kunci Jawaban Benar *
                  </label>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Klik huruf A/B/C/D untuk menandai kunci jawaban
                  </span>
                </div>
                <div className="space-y-2">
                  {(['A', 'B', 'C', 'D'] as const).map((label, idx) => {
                    const isCorrect = formCorrectIndex === idx;
                    return (
                      <div key={label} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormCorrectIndex(idx)}
                          className={`w-9 h-9 rounded-xl font-extrabold text-xs flex items-center justify-center border shrink-0 transition cursor-pointer ${
                            isCorrect
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                          }`}
                          title={`Jadikan opsi ${label} sebagai kunci jawaban benar`}
                        >
                          {isCorrect ? <Check className="w-4 h-4" /> : label}
                        </button>
                        <input
                          type="text"
                          value={formOptions[idx]}
                          onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                          placeholder={`Isi pilihan jawaban ${label}...`}
                          className={`flex-1 p-2.5 rounded-xl border text-xs outline-hidden transition ${
                            isCorrect
                              ? 'border-emerald-400 bg-emerald-50/40 font-semibold'
                              : 'border-slate-300 focus:border-emerald-500'
                          }`}
                          required
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Pembahasan &amp; Penjelasan Dalil *
                </label>
                <textarea
                  rows={2}
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Jelaskan mengapa jawaban tersebut benar agar siswa memperoleh umpan balik bermakna..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingQuestionId ? 'Simpan Perubahan' : 'Simpan Soal Asesmen'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Title Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 text-emerald-700 mb-2">
              <ClipboardCheck className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-wider">Halaman 9 / 11</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Modul Asesmen &amp; Ujian Hasil Belajar PAI
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Meliputi Asesmen Awal (Diagnostik), Asesmen Formatif (Proses), dan Asesmen Sumatif (Hasil Belajar Akhir).
            </p>
          </div>

          {isTeacherOrAdmin && (
            <button
              type="button"
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition shrink-0 self-start cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Asesmen</span>
            </button>
          )}
        </div>

        {/* 3 ASESMEN TABS */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => {
              setActiveCategory('diagnostik');
              handleResetQuiz();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeCategory === 'diagnostik'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            1. Asesmen Diagnostik (Awal) ({countByCategory('diagnostik')})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('formatif');
              handleResetQuiz();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeCategory === 'formatif'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            2. Asesmen Formatif (Pemahaman) ({countByCategory('formatif')})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('sumatif');
              handleResetQuiz();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeCategory === 'sumatif'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            3. Asesmen Sumatif (Hasil Belajar Akhir) ({countByCategory('sumatif')})
          </button>
        </div>
      </div>

      {/* STATUS NOTICE */}
      {statusNotice && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center space-x-2.5 text-xs font-semibold shadow-xs animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* HASIL SKOR BANNER KETIKA SUDAH DISERAHKAN */}
      {isSubmitted && score !== null && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-2xl text-emerald-300">
              <Award className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Hasil Evaluasi Asesmen ({currentUser.name})
              </span>
              <h2 className="text-2xl font-black text-white">
                Skor Anda: {score} / 100
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                {score >= 75
                  ? 'Selamat! Nilai Anda telah memenuhi Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).'
                  : 'Tetap semangat! Pelajari kembali materi teks dan dalil sebelum mencoba lagi.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetQuiz}
            className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi Kuis</span>
          </button>
        </div>
      )}

      {/* SOAL-SOAL ASESMEN */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {currentQuestions.map((q, qIndex) => {
          const selected = answers[q.id];
          const isCustom = isCustomQuestion(q.id);
          return (
            <div
              key={q.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {qIndex + 1}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Kategori: {q.category}
                  </span>
                  {q.dalil && (
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                      {q.dalil}
                    </span>
                  )}
                  {isCustom && (
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-lg">
                      Soal Guru
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isTeacherOrAdmin && isCustom && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(q)}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-[11px] flex items-center space-x-1 transition cursor-pointer"
                        title="Edit soal asesmen ini"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuestionToDelete(q)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-[11px] flex items-center space-x-1 transition cursor-pointer"
                        title="Hapus soal asesmen ini"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  )}

                  {isSubmitted && (
                    <div>
                      {selected === q.correctIndex ? (
                        <span className="flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Jawaban Benar</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Jawaban Salah</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {q.question}
              </h3>

              {/* Pilihan Opsi A, B, C, D */}
              <div className="space-y-2 pt-1">
                {q.options.map((opt, optIndex) => {
                  const isChecked = selected === optIndex;
                  const isCorrect = optIndex === q.correctIndex;

                  let optionStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-100/80 border-emerald-400 text-emerald-950 font-bold';
                    } else if (isChecked && !isCorrect) {
                      optionStyle = 'bg-rose-100/70 border-rose-400 text-rose-950 font-semibold';
                    }
                  } else if (isChecked) {
                    optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                  }

                  const labels = ['A', 'B', 'C', 'D'];

                  return (
                    <div
                      key={optIndex}
                      onClick={() => handleSelectOption(q.id, optIndex)}
                      className={`p-3.5 rounded-2xl border flex items-center space-x-3 cursor-pointer transition text-xs ${optionStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                        {labels[optIndex]}
                      </span>
                      <span className="leading-relaxed flex-1">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Pembahasan Soal */}
              {isSubmitted && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-slate-700 space-y-1 animate-fade-in">
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                    <HelpCircle className="w-4 h-4" />
                    <span>Pembahasan &amp; Dalil Rujukan:</span>
                  </div>
                  <p className="leading-relaxed pl-5">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}

        {!isSubmitted && currentQuestions.length > 0 && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={Object.keys(answers).length < currentQuestions.length}
              className="px-8 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition cursor-pointer"
            >
              Kirim Jawaban &amp; Periksa Skor
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
