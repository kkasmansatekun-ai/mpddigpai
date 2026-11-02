import React, { useState, useEffect } from 'react';
import {
  Globe,
  ExternalLink,
  BookMarked,
  ShieldCheck,
  Database,
  Award,
  PlusCircle,
  X,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import {
  getResourcesFromFirestore,
  saveResourceToFirestore,
} from '../../services/firebaseService';

interface ResourceItem {
  id?: string;
  title: string;
  category: string;
  desc: string;
  url: string;
  badge: string;
  accent: string;
  isCustom?: boolean;
}

const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Quran Kemenag Digital RI',
    category: 'Tafsir & Terjemahan Resmi',
    desc: 'Layanan mushaf standar Indonesia digital resmi Kementerian Agama RI dengan tafsir tahlili & wajiz.',
    url: 'https://quran.kemenag.go.id',
    badge: 'Resmi Kemenag',
    accent: 'border-emerald-200 bg-emerald-50/40',
  },
  {
    id: 'res-2',
    title: 'Fatwa MUI No. 24 Tahun 2017',
    category: 'Fatwa Syariah',
    desc: 'Naskah fatwa Komisi Fatwa Majelis Ulama Indonesia tentang Hukum dan Pedoman Bermuamalah Melalui Media Sosial.',
    url: 'https://mui.or.id/fatwa',
    badge: 'Majelis Ulama Indonesia',
    accent: 'border-teal-200 bg-teal-50/40',
  },
  {
    id: 'res-3',
    title: 'Portal TurnBackHoax.ID (Mafindo)',
    category: 'Cek Fakta & Tabayyun Digital',
    desc: 'Pangkalan data periksa fakta dan klarifikasi hoaks nasional oleh Masyarakat Anti Fitnah Indonesia.',
    url: 'https://turnbackhoax.id',
    badge: 'Fact-Check Mitra',
    accent: 'border-blue-200 bg-blue-50/40',
  },
  {
    id: 'res-4',
    title: 'Katalog Hadits Shahih Digital (Lidwa)',
    category: 'Ensiklopedi Sunnah',
    desc: 'Akses digital Kutubus Sittah (Shahih Bukhari, Muslim, Abu Dawud, Tirmidzi, dll.) dengan derajat keshahihan.',
    url: 'https://hadits.in',
    badge: 'Hadis Shahih',
    accent: 'border-indigo-200 bg-indigo-50/40',
  },
  {
    id: 'res-5',
    title: 'Modul PAI & BP Fase F Kemendikbudristek',
    category: 'Kurikulum Merdeka',
    desc: 'Buku teks utama Pendidikan Agama Islam dan Budi Pekerti untuk SMA/SMK Kelas XI Kurikulum Merdeka.',
    url: 'https://buku.kemdikbud.go.id',
    badge: 'Buku Resmi',
    accent: 'border-amber-200 bg-amber-50/40',
  },
  {
    id: 'res-6',
    title: 'Aduan Konten Kominfo RI',
    category: 'Perlindungan Siber',
    desc: 'Kanal resmi pengaduan konten negatif, perundungan siber, dan penipuan online Kementerian Komdigi.',
    url: 'https://aduankonten.id',
    badge: 'Layanan Pengaduan',
    accent: 'border-rose-200 bg-rose-50/40',
  },
];

export const SumberBelajarPage: React.FC = () => {
  const [customResources, setCustomResources] = useState<ResourceItem[]>(() => {
    const saved = localStorage.getItem('mpd_custom_resources');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  });

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form inputs
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Tafsir & Rujukan Syariah');
  const [newUrl, setNewUrl] = useState('');
  const [newBadge, setNewBadge] = useState('Rujukan Baru');
  const [newDesc, setNewDesc] = useState('');

  // Load from Firestore
  useEffect(() => {
    getResourcesFromFirestore().then((cloudRes) => {
      if (cloudRes && cloudRes.length > 0) {
        setCustomResources((prev) => {
          const map = new Map<string, ResourceItem>();
          cloudRes.forEach((r: any) => map.set(r.id || r.url, r));
          prev.forEach((r) => {
            const key = r.id || r.url;
            if (!map.has(key)) map.set(key, r);
          });
          const merged = Array.from(map.values());
          localStorage.setItem('mpd_custom_resources', JSON.stringify(merged));
          return merged;
        });
      }
    });
  }, []);

  const handleAddResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let validUrl = newUrl.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = 'https://' + validUrl;
    }

    const newItem: ResourceItem = {
      id: `res-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      url: validUrl,
      badge: newBadge.trim() || 'Rujukan Baru',
      desc: newDesc.trim() || 'Sumber belajar digital tambahan materi PAI.',
      accent: 'border-emerald-300 bg-emerald-50/50',
      isCustom: true,
    };

    const updated = [newItem, ...customResources];
    setCustomResources(updated);
    localStorage.setItem('mpd_custom_resources', JSON.stringify(updated));

    // Save to Firestore
    saveResourceToFirestore(newItem).catch(console.warn);

    setShowAddModal(false);
    setNewTitle('');
    setNewUrl('');
    setNewDesc('');
    setNewBadge('Rujukan Baru');

    setToastMessage(`Sumber belajar "${newItem.title}" berhasil ditambahkan dan disimpan ke database!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleDeleteCustomResource = (id?: string) => {
    if (!id) return;
    const updated = customResources.filter((r) => r.id !== id);
    setCustomResources(updated);
    localStorage.setItem('mpd_custom_resources', JSON.stringify(updated));
    setToastMessage('Sumber belajar tambahan berhasil dihapus.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const allResources = [...customResources, ...INITIAL_RESOURCES];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center space-x-2.5 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Title & Tambah Sumber Belajar Button */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
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

          {/* TOMBOL "TAMBAH SUMBER BELAJAR" */}
          <div className="shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition hover:scale-102 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-200" />
              <span>Tambah Sumber Belajar</span>
            </button>
          </div>
        </div>
      </div>

      {/* GRID SUMBER BELAJAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {allResources.map((res, idx) => (
          <div
            key={res.id || idx}
            className={`p-6 rounded-3xl border ${res.accent} shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4 relative group`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                    {res.badge}
                  </span>
                  {res.isCustom && (
                    <span className="text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.2 rounded-full">
                      Baru
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">{res.category}</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 leading-snug">{res.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{res.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
              >
                <span>Buka Referensi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {res.isCustom && (
                <button
                  onClick={() => handleDeleteCustomResource(res.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition"
                  title="Hapus sumber belajar ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FORM TAMBAH SUMBER BELAJAR */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-emerald-800">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">Tambah Sumber Belajar Digital</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddResourceSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Nama / Judul Sumber Belajar *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Portal Fikih Informasi MUI Digital"
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Kategori Rujukan</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  >
                    <option value="Tafsir & Rujukan Syariah">Tafsir & Rujukan Syariah</option>
                    <option value="Fatwa Syariah">Fatwa Syariah</option>
                    <option value="Cek Fakta & Tabayyun">Cek Fakta & Tabayyun</option>
                    <option value="Ensiklopedi Sunnah">Ensiklopedi Sunnah</option>
                    <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                    <option value="Perlindungan Siber">Perlindungan Siber</option>
                    <option value="Jurnal Riset PAI">Jurnal Riset PAI</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Label Badge</label>
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    placeholder="Contoh: Majelis Ulama / Mitra Cek Fakta"
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">URL / Tautan Website *</label>
                <input
                  type="text"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Deskripsi Singkat Rujukan</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Jelaskan isi rujukan atau manfaat referensi ini bagi pembelajaran siswa..."
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
                  <span>Simpan Sumber Belajar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
