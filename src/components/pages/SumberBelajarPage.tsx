import React from 'react';
import { Globe, ExternalLink, BookMarked, ShieldCheck, Database, Award } from 'lucide-react';

export const SumberBelajarPage: React.FC = () => {
  const resources = [
    {
      title: 'Quran Kemenag Digital RI',
      category: 'Tafsir & Terjemahan Resmi',
      desc: 'Layanan mushaf standar Indonesia digital resmi Kementerian Agama RI dengan tafsir tahlili & wajiz.',
      url: 'https://quran.kemenag.go.id',
      badge: 'Resmi Kemenag',
      accent: 'border-emerald-200 bg-emerald-50/40',
    },
    {
      title: 'Fatwa MUI No. 24 Tahun 2017',
      category: 'Fatwa Syariah',
      desc: 'Naskah fatwa Komisi Fatwa Majelis Ulama Indonesia tentang Hukum dan Pedoman Bermuamalah Melalui Media Sosial.',
      url: 'https://mui.or.id/fatwa',
      badge: 'Majelis Ulama Indonesia',
      accent: 'border-teal-200 bg-teal-50/40',
    },
    {
      title: 'Portal TurnBackHoax.ID (Mafindo)',
      category: 'Cek Fakta & Tabayyun Digital',
      desc: 'Pangkalan data periksa fakta dan klarifikasi hoaks nasional oleh Masyarakat Anti Fitnah Indonesia.',
      url: 'https://turnbackhoax.id',
      badge: 'Fact-Check Mitra',
      accent: 'border-blue-200 bg-blue-50/40',
    },
    {
      title: 'Katalog Hadits Shahih Digital (Lidwa)',
      category: 'Ensiklopedi Sunnah',
      desc: 'Akses digital Kutubus Sittah (Shahih Bukhari, Muslim, Abu Dawud, Tirmidzi, dll.) dengan derajat keshahihan.',
      url: 'https://hadits.in',
      badge: 'Hadis Shahih',
      accent: 'border-indigo-200 bg-indigo-50/40',
    },
    {
      title: 'Modul PAI & BP Fase F Kemendikbudristek',
      category: 'Kurikulum Merdeka',
      desc: 'Buku teks utama Pendidikan Agama Islam dan Budi Pekerti untuk SMA/SMK Kelas XI Kurikulum Merdeka.',
      url: 'https://buku.kemdikbud.go.id',
      badge: 'Buku Resmi',
      accent: 'border-amber-200 bg-amber-50/40',
    },
    {
      title: 'Aduan Konten Kominfo RI',
      category: 'Perlindungan Siber',
      desc: 'Kanal resmi pengaduan konten negatif, perundungan siber, dan penipuan online Kementerian Komdigi.',
      url: 'https://aduankonten.id',
      badge: 'Layanan Pengaduan',
      accent: 'border-rose-200 bg-rose-50/40',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 text-emerald-700 mb-2">
          <Globe className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Halaman 5 / 11</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Sumber Belajar Digital & Repository PAI
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kumpulan referensi primer, dokumen fatwa, tafsir Al-Qur’an digital, dan alat cek fakta terpercaya untuk memperkaya wawasan etika siber.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((res, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl border ${res.accent} shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                  {res.badge}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{res.category}</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 leading-snug">{res.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{res.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-200/60">
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
              >
                <span>Buka Referensi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
