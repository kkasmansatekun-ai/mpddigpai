import React from 'react';
import { BookOpen, User, GraduationCap, CheckCircle, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

export const PetunjukPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 text-emerald-700 mb-2">
          <BookOpen className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Halaman 2 / 11</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Petunjuk Pembelajaran MPD-DigPAI
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Panduan operasional eksplorasi media pembelajaran digital untuk guru dan peserta didik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panduan Untuk Peserta Didik */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 text-emerald-800 pb-3 border-b border-emerald-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Panduan Untuk Peserta Didik</h2>
              <p className="text-xs text-slate-500">Langkah terarah mengikuti pembelajaran mandiri & kelas</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">1. Cek Profil & Gaya Belajar</strong>
              <p className="text-slate-600">Pastikan profil gaya belajarmu (Visual, Auditori, atau Kinestetik) sudah sesuai. Kamu dapat berganti mode di menu Aktivitas.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">2. Eksplorasi Materi 9 Representasi</strong>
              <p className="text-slate-600">Pilihlah format materi yang paling nyaman bagimu: membaca dalil & teks, melihat infografis, menonton video, mendengarkan podcast, atau menganalisis kasus nyata.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">3. Kerjakan Aktivitas & Kumpul Tugas</strong>
              <p className="text-slate-600">Selesaikan tugas sesuai gaya belajarmu: membuat poster (visual), rekaman suara podcast (auditori), atau laporan verifikasi fakta (kinestetik).</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">4. Diskusi Santun & Asesmen</strong>
              <p className="text-slate-600">Gunakan prinsip Qaulan Sadida saat berdiskusi di forum, lalu selesaikan asesmen diagnostik, formatif, dan sumatif.</p>
            </div>
          </div>
        </div>

        {/* Panduan Untuk Guru / Pengampu */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 text-slate-800 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-bold">
              <User className="w-5 h-5 text-slate-800" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Panduan Guru Pengampu (Wandra Arasdi, M.Pd.)</h2>
              <p className="text-xs text-slate-500">Pengelolaan kelas, monitoring, dan evaluasi hasil belajar</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">1. Manajemen Kredensial Siswa</strong>
              <p className="text-slate-600">Akses menu "Manajemen 36 Siswa" untuk melihat daftar username dan password awal seluruh peserta didik.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">2. Reset Password & Pemberitahuan</strong>
              <p className="text-slate-600">Jika siswa lupa sandi, gunakan tombol Reset Password di tabel siswa. Salin password baru yang muncul di modal alert untuk diberikan ke siswa.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">3. Cetak Akun & Rekapitulasi Nilai</strong>
              <p className="text-slate-600">Gunakan fitur cetak resmi (@media print) untuk mencetak kartu akun siswa sebelum pembelajaran dimulai, serta rekapitulasi nilai akhir semester.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 block">4. Fasilitasi Diskusi & Umpan Balik</strong>
              <p className="text-slate-600">Beri komentar dan nilai pada karya siswa, sematkan (pin) pesan penting di forum diskusi, dan pantau indeks keterlibatan belajar.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tata Tertib Bermuamalah di Web MPD-DigPAI */}
      <div className="bg-emerald-50 rounded-3xl p-6 sm:p-8 border border-emerald-200">
        <h3 className="font-bold text-emerald-950 text-base flex items-center space-x-2 mb-3">
          <ShieldAlert className="w-5 h-5 text-emerald-700" />
          <span>Tata Tertib & Etika Komunikasi Digital Selama Pembelajaran</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-emerald-900">
          <div className="bg-white/80 p-4 rounded-2xl border border-emerald-200/60">
            <strong className="block text-emerald-950 mb-1">Menjaga Ukhuwah & Adab</strong>
            Dilarang keras menggunakan kata kasar, sarkasme, merendahkan fisik atau opini teman di forum diskusi.
          </div>
          <div className="bg-white/80 p-4 rounded-2xl border border-emerald-200/60">
            <strong className="block text-emerald-950 mb-1">Orisinalitas Tugas</strong>
            Karya poster, rekaman audio, maupun esai harus karya pribadi, bukan hasil plagiasi tanpa mencantumkan sumber.
          </div>
          <div className="bg-white/80 p-4 rounded-2xl border border-emerald-200/60">
            <strong className="block text-emerald-950 mb-1">Disiplin Waktu Sholat</strong>
            Saat timer widget sholat di bagian atas menunjukkan masuknya waktu sholat fardhu, jeda sejenak aktivitas belajar untuk menunaikan ibadah sholat.
          </div>
        </div>
      </div>
    </div>
  );
};
