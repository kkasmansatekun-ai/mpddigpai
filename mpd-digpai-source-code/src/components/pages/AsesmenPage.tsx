import React, { useState } from 'react';
import { ASSESSMENT_QUESTIONS } from '../../data/materialsData';
import { AssessmentQuestion, User } from '../../types';
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface AsesmenPageProps {
  currentUser: User;
  onSaveSummativeScore: (score: number) => void;
}

export const AsesmenPage: React.FC<AsesmenPageProps> = ({
  currentUser,
  onSaveSummativeScore,
}) => {
  const [activeCategory, setActiveCategory] = useState<'diagnostik' | 'formatif' | 'sumatif'>('diagnostik');
  const [answers, setAnswers] = useState<{ [id: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const currentQuestions = ASSESSMENT_QUESTIONS.filter(
    (q) => q.category === activeCategory
  );

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

  const score = isSubmitted ? calculateScore() : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 text-emerald-700 mb-2">
          <ClipboardCheck className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Halaman 9 / 11</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Modul Asesmen & Ujian Hasil Belajar PAI
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Meliputi Asesmen Awal (Diagnostik), Asesmen Formatif (Proses), dan Asesmen Sumatif (Hasil Belajar Akhir).
        </p>

        {/* 3 ASESMEN TABS */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <button
            onClick={() => {
              setActiveCategory('diagnostik');
              handleResetQuiz();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeCategory === 'diagnostik'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            1. Asesmen Diagnostik (Awal)
          </button>
          <button
            onClick={() => {
              setActiveCategory('formatif');
              handleResetQuiz();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeCategory === 'formatif'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            2. Asesmen Formatif (Pemahaman)
          </button>
          <button
            onClick={() => {
              setActiveCategory('sumatif');
              handleResetQuiz();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeCategory === 'sumatif'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            3. Asesmen Sumatif (Hasil Belajar Akhir)
          </button>
        </div>
      </div>

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
            onClick={handleResetQuiz}
            className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center space-x-1.5 transition"
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
          return (
            <div
              key={q.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {qIndex + 1}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Kategori: {q.category}
                  </span>
                </div>
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
                    <span>Pembahasan & Dalil Rujukan:</span>
                  </div>
                  <p className="leading-relaxed pl-5">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}

        {!isSubmitted && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={Object.keys(answers).length < currentQuestions.length}
              className="px-8 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition"
            >
              Kirim Jawaban & Periksa Skor
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
