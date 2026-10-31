import React from 'react';
import { Target, CheckCircle2, Award, BookCheck, ShieldCheck, Sparkles } from 'lucide-react';

export const TujuanPage: React.FC = () => {
  const learningObjectives = [
    {
      id: 'TP-1',
      code: 'TP 10.1',
      title: 'Menganalisis Dalil & Prinsip Tabayyun dalam Islam',
      desc: 'Peserta didik mampu menganalisis kandungan QS. Al-Hujurat [49]: 6, QS. Al-Isra [17]: 36, serta hadis terkait kewajiban verifikasi informasi (tabayyun) dan menjaga lisan di media sosial dengan benar.',
      evidence: 'Kemampuan menjelaskan makna perkata, asbabun nuzul, dan konteks aplikasi ayat di dunia maya.'
    },
    {
      id: 'TP-2',
      code: 'TP 10.2',
      title: 'Mengidentifikasi Kaidah Etika Komunikasi Islami',
      desc: 'Peserta didik mampu mengidentifikasi dan membedakan 6 kaidah komunikasi Al-Qur’an (Qaulan Sadida, Baligha, Ma’rufa, Karima, Layyina, Maysura) serta implikasinya dalam interaksi di platform digital.',
      evidence: 'Menyusun perbandingan pesan yang beradab vs postingan yang mengandung unsur ghibah/namimah.'
    },
    {
      id: 'TP-3',
      code: 'TP 10.3',
      title: 'Mengevaluasi Fenomena Hoaks & Cyberbullying Secara Kritis',
      desc: 'Peserta didik mampu mengevaluasi studi kasus hoaks, doxxing, dan cyberbullying di kalangan remaja berdasarkan perspektif Fatwa MUI No. 24 Tahun 2017 dan regulasi hukum positif yang berlaku.',
      evidence: 'Merumuskan solusi pencegahan dan langkah konkrit penanganan kasus perundungan siber di lingkungan sekolah.'
    },
    {
      id: 'TP-4',
      code: 'TP 10.4',
      title: 'Membuat Produk Kampanye Kreatif Bermedia Sosial yang Beradab',
      desc: 'Peserta didik mampu menghasilkan karya kampanye digital (poster/infografis visual, podcast audio, atau laporan aksi fact-checking kinestetik) yang menginspirasi netizen berakhlak mulia.',
      evidence: 'Portofolio karya yang dinilai melalui rubrik asesmen autentik.'
    }
  ];

  const pancasilaProfiles = [
    { name: 'Beriman, Bertakwa & Berakhlak Mulia', desc: 'Meyakini hisab Allah atas seluruh jejak digital lisan dan ketukan jemari.' },
    { name: 'Bernalar Kritis', desc: 'Tidak mudah percaya pada berita sensasional dan terbiasa menguji validitas sumber data (tabayyun).' },
    { name: 'Kreatif', desc: 'Mampu mentransformasikan dalil syariat ke dalam media dakwah modern yang menarik dan komunikatif.' },
    { name: 'Bergotong Royong', desc: 'Membangun ekosistem siber yang aman, saling menguatkan, dan bebas dari perundungan online.' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 text-emerald-700 mb-2">
          <Target className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Halaman 3 / 11</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Capaian Pembelajaran (CP) & Tujuan Pembelajaran (TP)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Standar kompetensi Kurikulum Merdeka Pendidikan Agama Islam dan Budi Pekerti (Fase E - Kelas X SMA/SMK • KELAS X 3).
        </p>
      </div>

      {/* Capaian Pembelajaran (CP) Fase E */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center space-x-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
          <BookCheck className="w-4 h-4" />
          <span>Capaian Pembelajaran (CP) Elemen Akhlak - Fase E (Kelas X)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
          Elemen Akhlak: Menjaga Martabat Kemanusiaan & Adab di Ruang Publik Digital (KELAS X 3)
        </h2>
        <p className="text-emerald-100/90 text-sm leading-relaxed">
          “Pada akhir Fase E, peserta didik mampu menganalisis ketentuan dan etika bermuamalah di era digital, membiasakan diri menerapkan prinsip tabayyun saat menerima informasi, menghindari perilaku ghibah, fitnah, hoaks, ujaran kebencian, dan cyberbullying, serta menampilkan karya kampanye moderasi beragama dan kesalehan digital dalam kehidupan sehari-hari.”
        </p>
      </div>

      {/* Rincian 4 Tujuan Pembelajaran (TP) */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
          <Award className="w-5 h-5 text-emerald-600" />
          <span>Rincian 4 Tujuan Pembelajaran (TP) Khusus Topik</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningObjectives.map((tp) => (
            <div
              key={tp.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-emerald-300 shadow-xs flex flex-col justify-between space-y-3 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {tp.code}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Tuntas KKTP</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {tp.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {tp.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl">
                <strong className="text-emerald-900 block mb-0.5">Bukti Ketercapaian (Evidence):</strong>
                {tp.evidence}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profil Pelajar Pancasila & Rahmatan lil 'Alamin */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-emerald-700">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Integrasi Dimensi Profil Pelajar Pancasila & Rahmatan lil ’Alamin
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {pancasilaProfiles.map((p, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              <h4 className="font-bold text-xs text-emerald-950 pt-1">{p.name}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
