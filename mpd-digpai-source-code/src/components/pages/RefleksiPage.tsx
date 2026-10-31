import React, { useState } from 'react';
import { User, ReflectionEntry } from '../../types';
import { Smile, Send, CheckCircle2, HeartHandshake, Sparkles, BookOpen } from 'lucide-react';

interface RefleksiPageProps {
  currentUser: User;
}

export const RefleksiPage: React.FC<RefleksiPageProps> = ({ currentUser }) => {
  const [understandingLevel, setUnderstandingLevel] = useState<
    'Sangat Paham' | 'Paham' | 'Cukup Paham' | 'Masih Bingung'
  >('Sangat Paham');
  const [challenge, setChallenge] = useState('');
  const [helpfulActivity, setHelpfulActivity] = useState(
    'Menganalisis studi kasus nyata perundungan siber dan infografis 6 langkah tabayyun.'
  );
  const [commitment, setCommitment] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const [reflections, setReflections] = useState<ReflectionEntry[]>([
    {
      id: 'ref-1',
      studentName: 'ASSYFA KIRANI ARPIS',
      understandingLevel: 'Sangat Paham',
      biggestChallenge: 'Kadang masih sulit menahan rasa penasaran saat melihat gosip viral di linimasa TikTok.',
      mostHelpfulActivity: 'Teks dalil QS. Al-Hujurat: 6 dan podcast audio Pak Wandra tentang menjaga lisan.',
      actionCommitment: 'Berjanji tidak akan pernah mem-forward pesan apa pun di grup kelas sebelum mengecek kebenarannya.',
      date: 'Kemarin',
    },
    {
      id: 'ref-2',
      studentName: 'GIBRAN ALVARO SABIL',
      understandingLevel: 'Paham',
      biggestChallenge: 'Mengingatkan teman di media sosial tanpa membuatnya tersinggung.',
      mostHelpfulActivity: 'Studi kasus kontekstual akun menfess dan kaidah Qaulan Layyina.',
      actionCommitment: 'Akan menegur teman lewat japri (private message) secara santun jika melihat postingan yang keliru.',
      date: 'Hari ini',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitment.trim()) return;

    const newRef: ReflectionEntry = {
      id: `ref-${Date.now()}`,
      studentName: currentUser.name,
      understandingLevel,
      biggestChallenge: challenge || 'Tidak ada kendala berarti.',
      mostHelpfulActivity: helpfulActivity,
      actionCommitment: commitment,
      date: 'Baru saja',
    };

    setReflections([newRef, ...reflections]);
    setChallenge('');
    setCommitment('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 5000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 text-emerald-700 mb-2">
          <Smile className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Halaman 10 / 11</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Refleksi Metakognisi & Komitmen Diri Siswa
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Bercermin pada pemahaman diri, mengevaluasi kesulitan, dan merumuskan tekad berakhlak mulia di jagat digital.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center space-x-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span className="text-xs font-semibold">
            Alhamdulillah, refleksi metakognisi Anda berhasil disimpan dan akan dievaluasi oleh Guru Pengampu!
          </span>
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

        <form onSubmit={handleSubmit} className="space-y-5">
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
                  className={`p-3 rounded-xl border text-xs font-bold transition text-center ${
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

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2 transition"
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
          <span>Kumpulan Komitmen & Refleksi Rekan Siswa</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reflections.map((ref) => (
            <div
              key={ref.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{ref.studentName}</h4>
                  <span className="text-[10px] text-slate-400">{ref.date}</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {ref.understandingLevel}
                </span>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
