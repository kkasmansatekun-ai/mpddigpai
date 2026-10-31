import React, { useState, useRef, useEffect } from 'react';
import { User, SubmissionItem } from '../../types';
import { Html5VideoPlayer } from '../common/Html5VideoPlayer';
import {
  UploadCloud,
  CheckCircle2,
  Filter,
  FileText,
  Image as ImageIcon,
  Video,
  Award,
  Sparkles,
  Paperclip,
  Trash2,
  Eye,
  Download,
  AlertCircle,
  Music,
  File,
  X,
  Play,
  RotateCcw,
  Check,
} from 'lucide-react';

interface TugasProdukPageProps {
  currentUser: User;
}

export const TugasProdukPage: React.FC<TugasProdukPageProps> = ({ currentUser }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submissions, setSubmissions] = useState<SubmissionItem[]>([
    {
      id: 'sub-1',
      studentId: 'std-01',
      studentName: 'ASSYFA KIRANI ARPIS',
      title: 'Infografis: 5 Filter Sebelum Menekan Tombol Share',
      category: 'Poster Digital',
      style: 'visual',
      fileName: 'Infografis_Filter_Tabayyun.png',
      fileType: 'image/png',
      fileSize: '3.4 MB',
      fileUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
      description: 'Poster berukuran A3 dibuat dengan Canva memuat dalil QS. Al-Hujurat ayat 6 dan 5 langkah cek fakta turnbackhoax.',
      submittedAt: 'Kemarin, 14:20 WIB',
      score: 95,
      status: 'Dinilai',
      feedback: 'Desain visual sangat rapi, komposisi warna serasi, dan penempatan dalil sangat jelas. Pertahankan!',
    },
    {
      id: 'sub-2',
      studentId: 'std-02',
      studentName: 'AULIA RAHMADANI',
      title: 'Video Edukasi: Diam Adalah Emas di Kolom Komentar',
      category: 'Video Narasi',
      style: 'auditory',
      fileName: 'Video_Edukasi_Adab_Komentar.mp4',
      fileType: 'video/mp4',
      fileSize: '12.4 MB',
      fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      description: 'Video narasi berdurasi 2 menit 45 detik membahas hadis Bukhari tentang menjaga lisan dan etika digital.',
      submittedAt: 'Kemarin, 16:05 WIB',
      score: 92,
      status: 'Dinilai',
      feedback: 'Artikulasi suara sangat jelas, intonasi menyentuh, dan pesan moral tersampaikan dengan hangat.',
    },
    {
      id: 'sub-3',
      studentId: 'std-10',
      studentName: 'GIBRAN ALVARO SABIL',
      title: 'Laporan Aksi: Fact-Check Berita Hoaks Donasi Gempa',
      category: 'Artikel Opini',
      style: 'kinesthetic',
      fileName: 'Laporan_Uji_Fakta_Gempa.pdf',
      fileType: 'application/pdf',
      fileSize: '1.5 MB',
      description: 'Dokumentasi langkah uji fakta broadcast WhatsApp palsu menggunakan Google Lens dan situs Kominfo.',
      submittedAt: 'Hari ini, 08:30 WIB',
      status: 'Menunggu Penilaian',
    },
    {
      id: 'sub-4',
      studentId: 'std-12',
      studentName: 'HAFIZ RAMADAN HAKIM',
      title: 'Kajian Video: Bahaya Dosa Jariyah Fitnah Digital',
      category: 'Video Narasi',
      style: 'auditory',
      fileName: 'Kajian_Video_Dosa_Jariyah.mp4',
      fileType: 'video/mp4',
      fileSize: '16.8 MB',
      fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      description: 'Pembahasan fenomena screenshot obrolan rahasia yang diunggah ke akun menfess sekolah.',
      submittedAt: 'Hari ini, 09:12 WIB',
      score: 88,
      status: 'Dinilai',
      feedback: 'Analisis hukum syar’i sangat tajam, diksi yang digunakan sangat mendidik.',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Poster Digital' | 'Video Narasi' | 'Artikel Opini'>('Poster Digital');
  const [newDesc, setNewDesc] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showUploadAlert, setShowUploadAlert] = useState(false);

  // File upload state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    file?: File;
    name: string;
    size: string;
    type: string;
    previewUrl?: string;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Modal states
  const [previewModalSub, setPreviewModalSub] = useState<SubmissionItem | null>(null);
  const [submissionToDelete, setSubmissionToDelete] = useState<SubmissionItem | null>(null);
  const [isConfirmingDeleteStaged, setIsConfirmingDeleteStaged] = useState<boolean>(false);
  const [deleteToast, setDeleteToast] = useState<string | null>(null);

  // Keyboard shortcut: close modals on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (submissionToDelete) {
          setSubmissionToDelete(null);
        } else if (isConfirmingDeleteStaged) {
          setIsConfirmingDeleteStaged(false);
        } else if (previewModalSub) {
          setPreviewModalSub(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [submissionToDelete, isConfirmingDeleteStaged, previewModalSub]);

  // Format file size helper
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper to determine media type
  const isVideoSub = (sub: SubmissionItem) => {
    const fn = (sub.fileName || '').toLowerCase();
    const ft = (sub.fileType || '').toLowerCase();
    return (
      ft.startsWith('video') ||
      fn.endsWith('.mp4') ||
      fn.endsWith('.webm') ||
      fn.endsWith('.mov') ||
      fn.endsWith('.mkv') ||
      fn.endsWith('.m4v') ||
      (sub.category === 'Video Narasi' && !fn.endsWith('.mp3') && !fn.endsWith('.wav'))
    );
  };

  const isAudioSub = (sub: SubmissionItem) => {
    const fn = (sub.fileName || '').toLowerCase();
    const ft = (sub.fileType || '').toLowerCase();
    return ft.startsWith('audio') || fn.endsWith('.mp3') || fn.endsWith('.wav') || fn.endsWith('.ogg');
  };

  const isImageSub = (sub: SubmissionItem) => {
    const fn = (sub.fileName || '').toLowerCase();
    const ft = (sub.fileType || '').toLowerCase();
    return (
      ft.startsWith('image') ||
      fn.endsWith('.png') ||
      fn.endsWith('.jpg') ||
      fn.endsWith('.jpeg') ||
      fn.endsWith('.webp') ||
      sub.category === 'Poster Digital'
    );
  };

  // Process selected file
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setFileError(null);

    // Max 25 MB
    if (file.size > 25 * 1024 * 1024) {
      setFileError('Ukuran file melebihi batas maksimal 25MB. Silakan pilih file yang lebih kecil.');
      return;
    }

    // Auto-fill title if empty
    if (!newTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setNewTitle(cleanName);
    }

    // Auto-suggest category
    if (file.type.startsWith('image/')) {
      setNewCategory('Poster Digital');
    } else if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
      setNewCategory('Video Narasi');
    } else if (file.type.includes('pdf') || file.type.includes('word') || file.type.includes('text')) {
      setNewCategory('Artikel Opini');
    }

    // Clean up previous preview url if blob
    if (uploadedFile?.previewUrl && uploadedFile.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedFile.previewUrl);
    }

    // Generate preview URL for all media types (video, audio, image)
    let previewUrl: string | undefined = undefined;
    if (
      file.type.startsWith('image/') ||
      file.type.startsWith('video/') ||
      file.type.startsWith('audio/') ||
      file.name.match(/\.(mp4|webm|mov|mkv|m4v|mp3|wav|ogg|png|jpg|jpeg|webp)$/i)
    ) {
      try {
        previewUrl = URL.createObjectURL(file);
      } catch (err) {
        console.warn('Could not create ObjectURL', err);
      }
    }

    // Fast simulated progress
    setUploadProgress(25);
    setTimeout(() => setUploadProgress(70), 100);
    setTimeout(() => {
      setUploadProgress(100);
      setUploadedFile({
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || 'application/octet-stream',
        previewUrl,
      });
      setTimeout(() => setUploadProgress(null), 300);
    }, 250);
  };

  // Quick preset samples for easy testing
  const handleUseSampleFile = (type: 'poster' | 'video' | 'podcast' | 'laporan') => {
    setFileError(null);
    if (type === 'poster') {
      setNewTitle('Poster Infografis: Adab Bermedia Sosial & Cek Fakta');
      setNewCategory('Poster Digital');
      setNewDesc('Infografis memuat 5 etika bermedia sosial sesuai QS. Al-Hujurat ayat 6, prinsip Qaulan Sadida, serta panduan verifikasi tabayyun.');
      setUploadedFile({
        name: 'Poster_Edukasi_Tabayyun_FaseE.png',
        size: '2.4 MB',
        type: 'image/png',
        previewUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
      });
    } else if (type === 'video') {
      setNewTitle('Video Edukasi: Praktik Tabayyun & Menangkal Hoaks');
      setNewCategory('Video Narasi');
      setNewDesc('Video penjelasan 2 menit tentang bahaya penyebaran disinformasi dan panduan klarifikasi tabayyun dalam pergaulan digital generasi muda.');
      setUploadedFile({
        name: 'Video_Edukasi_Tabayyun.mp4',
        size: '14.2 MB',
        type: 'video/mp4',
        previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      });
    } else if (type === 'podcast') {
      setNewTitle('Podcast Suara: Menjaga Lisan Digital & Mengikis Gibah');
      setNewCategory('Video Narasi');
      setNewDesc('Rekaman audio 3 menit tentang bahaya jejak digital dan penerapan adab Islam saat berinteraksi di kolom komentar.');
      setUploadedFile({
        name: 'Podcast_Adab_Lisan_Digital.mp3',
        size: '4.8 MB',
        type: 'audio/mp3',
        previewUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
      });
    } else {
      setNewTitle('Laporan Praktik Tabayyun: Analisis Kasus Disinformasi');
      setNewCategory('Artikel Opini');
      setNewDesc('Kajian kritis 3 kasus disinformasi di media sosial dan langkah verifikasi menggunakan mesin pencari dan cekfakta.');
      setUploadedFile({
        name: 'Laporan_Uji_Fakta_PAI.pdf',
        size: '1.2 MB',
        type: 'application/pdf',
      });
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const fallbackFileName =
      newCategory === 'Poster Digital'
        ? 'Poster_Karya_Digital.png'
        : newCategory === 'Video Narasi'
        ? 'Video_Edukasi_Digital.mp4'
        : 'Laporan_Kajian_Tabayyun.pdf';

    const fallbackFileType =
      newCategory === 'Poster Digital'
        ? 'image/png'
        : newCategory === 'Video Narasi'
        ? 'video/mp4'
        : 'application/pdf';

    const fallbackUrl =
      newCategory === 'Video Narasi'
        ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        : newCategory === 'Poster Digital'
        ? 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80'
        : undefined;

    const newSub: SubmissionItem = {
      id: `sub-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      title: newTitle,
      category: newCategory,
      style: currentUser.learningStyle || 'visual',
      fileName: uploadedFile?.name || fallbackFileName,
      fileType: uploadedFile?.type || fallbackFileType,
      fileSize: uploadedFile?.size || '2.1 MB',
      fileUrl: uploadedFile?.previewUrl || fallbackUrl,
      description: newDesc || 'Karya tugas telah diunggah melalui formulir MPD-DigPAI.',
      submittedAt: 'Baru saja',
      status: 'Menunggu Penilaian',
    };

    setSubmissions([newSub, ...submissions]);
    setNewTitle('');
    setNewDesc('');
    setUploadedFile(null);
    setShowUploadAlert(true);
    setTimeout(() => setShowUploadAlert(false), 5000);
  };

  // Confirm delete of staged file
  const confirmDeleteStagedFile = () => {
    if (!uploadedFile) return;
    const fileName = uploadedFile.name;
    if (uploadedFile.previewUrl && uploadedFile.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedFile.previewUrl);
    }
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsConfirmingDeleteStaged(false);
    setDeleteToast(`Berkas "${fileName}" berhasil dihapus dari formulir.`);
    setTimeout(() => setDeleteToast(null), 4000);
  };

  // Delete submission handler with confirmation
  const confirmDeleteSubmission = () => {
    if (!submissionToDelete) return;
    const title = submissionToDelete.title;
    const fileName = submissionToDelete.fileName;

    if (submissionToDelete.fileUrl && submissionToDelete.fileUrl.startsWith('blob:')) {
      URL.revokeObjectURL(submissionToDelete.fileUrl);
    }

    setSubmissions((prev) => prev.filter((s) => s.id !== submissionToDelete.id));

    if (previewModalSub?.id === submissionToDelete.id) {
      setPreviewModalSub(null);
    }

    setSubmissionToDelete(null);
    setDeleteToast(`Berkas & portofolio karya "${fileName || title}" berhasil dihapus dari galeri.`);
    setTimeout(() => setDeleteToast(null), 4000);
  };

  const filtered =
    filterCategory === 'all'
      ? submissions
      : submissions.filter((s) => s.category === filterCategory);

  const getFileIcon = (sub: SubmissionItem) => {
    if (isVideoSub(sub)) {
      return <Video className="w-4 h-4 text-blue-600" />;
    }
    if (isAudioSub(sub)) {
      return <Music className="w-4 h-4 text-purple-600" />;
    }
    if (isImageSub(sub)) {
      return <ImageIcon className="w-4 h-4 text-emerald-600" />;
    }
    if ((sub.fileName || '').toLowerCase().endsWith('.pdf')) {
      return <FileText className="w-4 h-4 text-rose-600" />;
    }
    return <File className="w-4 h-4 text-slate-600" />;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 text-emerald-700 mb-2">
          <UploadCloud className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Halaman 7 / 11</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Pengumpulan Tugas & Galeri Produk Siswa
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Modul portofolio karya kreatif Adab Bersosial Media sesuai profil gaya belajar peserta didik (dilengkapi pemutar video HTML5 interaktif & fitur hapus berkas aman).
        </p>
      </div>

      {/* Toast Alert Sukses Upload */}
      {showUploadAlert && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center space-x-3 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span className="text-xs font-semibold">
            Karya tugas dan berkas berhasil diunggah! Berkas kini dapat langsung dilihat & diputar pada Galeri Portofolio di bawah.
          </span>
        </div>
      )}

      {/* Toast Alert Sukses Hapus */}
      {deleteToast && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 flex items-center space-x-3 shadow-xs animate-fade-in">
          <Trash2 className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="text-xs font-semibold">{deleteToast}</span>
        </div>
      )}

      {/* FORM UPLOAD KARYA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="font-bold text-base text-slate-900 flex items-center space-x-2">
            <UploadCloud className="w-5 h-5 text-emerald-600" />
            <span>Formulir Pengumpulan Karya Siswa</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Pengunggah: {currentUser.name}</span>
        </div>

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Judul Karya / Produk</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Video Edukasi Tabayyun & Anti Hoaks"
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Format Produk</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden bg-white"
              >
                <option value="Poster Digital">Poster Digital / Infografis (Gaya Visual)</option>
                <option value="Video Narasi">Video Narasi / Podcast Suara (Gaya Auditori)</option>
                <option value="Artikel Opini">Laporan Uji Fakta / Roleplay (Gaya Kinestetik)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Deskripsi Singkat Karya & Refleksi Dalil</label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Jelaskan pesan inti yang ingin kamu sampaikan serta dalil yang kamu jadikan rujukan..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
              required
            />
          </div>

          {/* DRAG AND DROP / FILE UPLOADER */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unggah Berkas Karya (Video, Audio, Gambar, PDF)</span>
              </label>

              {/* Preset Sampel Cepat */}
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[10px] text-slate-400 hidden sm:inline">Uji Coba Cepat:</span>
                <button
                  type="button"
                  onClick={() => handleUseSampleFile('video')}
                  className="px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-semibold transition flex items-center space-x-1"
                >
                  <Video className="w-3 h-3" />
                  <span>+ Contoh Video (MP4)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUseSampleFile('poster')}
                  className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-semibold transition flex items-center space-x-1"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span>+ Poster (PNG)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUseSampleFile('podcast')}
                  className="px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-semibold transition flex items-center space-x-1"
                >
                  <Music className="w-3 h-3" />
                  <span>+ Podcast (MP3)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleUseSampleFile('laporan')}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition flex items-center space-x-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>+ PDF</span>
                </button>
              </div>
            </div>

            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".mp4,.webm,.mov,.m4v,.mkv,.ogg,.mp3,.wav,.jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = '';
              }}
            />

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFiles(e.dataTransfer.files);
                }
              }}
              onClick={() => {
                fileInputRef.current?.click();
              }}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center select-none relative ${
                isDragging
                  ? 'border-emerald-600 bg-emerald-50/90 scale-[1.01] shadow-sm'
                  : uploadedFile
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-300 bg-slate-50/70 hover:bg-slate-100/80 hover:border-emerald-400'
              }`}
            >
              {uploadedFile ? (
                /* FILE SUDAH TERPILIH */
                <div
                  className="space-y-3 p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        {uploadedFile.type.startsWith('video') || uploadedFile.name.match(/\.(mp4|webm|mov|mkv)$/i) ? (
                          <Video className="w-6 h-6 text-blue-600" />
                        ) : uploadedFile.type.startsWith('audio') || uploadedFile.name.match(/\.(mp3|wav)$/i) ? (
                          <Music className="w-6 h-6 text-purple-600" />
                        ) : uploadedFile.type.includes('pdf') ? (
                          <FileText className="w-6 h-6 text-rose-600" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-emerald-700" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[280px]">
                            {uploadedFile.name}
                          </p>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {uploadedFile.size}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-700 flex items-center space-x-1 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Berkas terdeteksi & siap dikumpulkan</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                      >
                        Ganti Berkas
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsConfirmingDeleteStaged(true)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition flex items-center space-x-1"
                        title="Hapus / Batalkan Berkas dengan Konfirmasi"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Hapus File</span>
                      </button>
                    </div>
                  </div>

                  {/* Native HTML5 Video Player Preview jika file bertipe video */}
                  {(uploadedFile.type.startsWith('video') || uploadedFile.name.match(/\.(mp4|webm|mov|mkv|m4v)$/i)) &&
                    uploadedFile.previewUrl && (
                      <div className="mt-3">
                        <Html5VideoPlayer
                          src={uploadedFile.previewUrl}
                          mimeType={uploadedFile.type}
                          fileName={uploadedFile.name}
                          fileSize={uploadedFile.size}
                          autoPlay={false}
                          showMetaBar={true}
                        />
                        <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-[11px] text-emerald-800 font-medium mt-2 flex items-center justify-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Pratinjau HTML5 Video Berfungsi — Anda dapat memutar berkas sebelum mengirim tugas</span>
                        </div>
                      </div>
                    )}

                  {/* Inline Preview Audio jika file bertipe audio */}
                  {(uploadedFile.type.startsWith('audio') || uploadedFile.name.match(/\.(mp3|wav)$/i)) &&
                    uploadedFile.previewUrl && (
                      <div className="mt-2 p-2 rounded-xl bg-purple-50 border border-purple-200">
                        <audio controls className="w-full" src={uploadedFile.previewUrl} />
                      </div>
                    )}

                  {/* Inline Preview Image jika file bertipe gambar */}
                  {uploadedFile.type.startsWith('image') && uploadedFile.previewUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-50 flex items-center justify-center">
                      <img
                        src={uploadedFile.previewUrl}
                        alt="Preview"
                        className="w-full max-h-48 object-contain"
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* DROPZONE KOSONG */
                <div className="space-y-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-700 mx-auto flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-700">
                      {isDragging ? 'Lepaskan berkas di sini...' : 'Seret file karyamu ke sini atau klik untuk memilih file'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Mendukung: Video (MP4, WEBM, MOV, MKV), Audio (MP3), Gambar (PNG, JPG), PDF (Maks. 25MB)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 text-xs font-semibold shadow-2xs transition"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pilih Berkas dari Komputer / HP</span>
                  </button>
                </div>
              )}

              {/* Progress bar jika sedang proses */}
              {uploadProgress !== null && (
                <div className="mt-3 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Warning Error */}
            {fileError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Kumpulkan Tugas</span>
            </button>
          </div>
        </form>
      </div>

      {/* GALERI KARYA TERKUMPUL */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-lg text-slate-900">Galeri Portofolio Produk Siswa</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik &quot;Putar Video&quot; untuk memutar media di pemutar HTML5 asli atau klik &quot;Hapus&quot; untuk mengelola berkas portofolio.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 rounded-xl border border-slate-300 bg-white text-xs outline-hidden"
            >
              <option value="all">Semua Format Produk</option>
              <option value="Poster Digital">Poster Digital (Visual)</option>
              <option value="Video Narasi">Video Narasi & Podcast (Auditori)</option>
              <option value="Artikel Opini">Laporan Uji Fakta (Kinestetik)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((sub) => {
            const isVideo = isVideoSub(sub);
            const isAudio = isAudioSub(sub);
            return (
              <div
                key={sub.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-emerald-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                      {getFileIcon(sub)}
                      <span>{sub.category}</span>
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        sub.status === 'Dinilai'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sub.status === 'Dinilai' ? `Nilai: ${sub.score} / 100` : 'Menunggu Penilaian'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{sub.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Oleh: {sub.studentName}</p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{sub.description}</p>

                  {/* File Attachment Card */}
                  {sub.fileName && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        {getFileIcon(sub)}
                        <span className="font-semibold text-slate-800 truncate text-[11px] max-w-[170px]">
                          {sub.fileName}
                        </span>
                        {sub.fileSize && (
                          <span className="text-[10px] text-slate-400 shrink-0">({sub.fileSize})</span>
                        )}
                      </div>

                      {/* Action buttons on card: Lihat/Putar and Hapus */}
                      <div className="flex items-center space-x-1.5 shrink-0 justify-end">
                        <button
                          type="button"
                          onClick={() => setPreviewModalSub(sub)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center space-x-1 ${
                            isVideo
                              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                          }`}
                        >
                          {isVideo ? <Play className="w-3 h-3 fill-white" /> : <Eye className="w-3 h-3" />}
                          <span>{isVideo ? 'Putar Video' : isAudio ? 'Putar Audio' : 'Lihat Berkas'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSubmissionToDelete(sub)}
                          className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-semibold transition flex items-center space-x-1"
                          title="Hapus file dan karya dari galeri"
                        >
                          <Trash2 className="w-3 h-3 text-rose-600" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {sub.feedback && (
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-slate-700">
                    <strong className="text-emerald-900 block mb-0.5">Umpan Balik Guru (Pak Wandra):</strong>
                    &ldquo;{sub.feedback}&rdquo;
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL PREVIEW & PEMUTAR VIDEO / AUDIO / BERKAS */}
      {previewModalSub && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 border border-slate-200 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                {getFileIcon(previewModalSub)}
                <h3 className="font-bold text-sm text-slate-900 truncate max-w-[320px]">
                  {previewModalSub.fileName || previewModalSub.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewModalSub(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Playable Video / Audio / Image Player */}
            <div className="space-y-3">
              {isVideoSub(previewModalSub) ? (
                /* PEMUTAR VIDEO ASLI HTML5 DENGAN VALID SOURCE HANDLING */
                <Html5VideoPlayer
                  src={
                    previewModalSub.fileUrl ||
                    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                  }
                  mimeType={previewModalSub.fileType || 'video/mp4'}
                  fileName={previewModalSub.fileName}
                  title={previewModalSub.title}
                  fileSize={previewModalSub.fileSize}
                  autoPlay={true}
                  showMetaBar={true}
                />
              ) : isAudioSub(previewModalSub) ? (
                /* PEMUTAR AUDIO ASLI (HTML5 AUDIO) */
                <div className="p-6 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-700 mx-auto flex items-center justify-center shadow-xs">
                    <Music className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-purple-900">{previewModalSub.fileName}</h4>
                    <p className="text-[11px] text-purple-600 mt-0.5">Pemutar Audio Podcast Edukasi PAI</p>
                  </div>
                  <audio
                    controls
                    autoPlay
                    className="w-full mt-2"
                    src={
                      previewModalSub.fileUrl ||
                      'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg'
                    }
                  >
                    Browser Anda tidak mendukung pemutar audio.
                  </audio>
                </div>
              ) : isImageSub(previewModalSub) ? (
                /* PRATINJAU GAMBAR */
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-80 bg-slate-50 flex items-center justify-center">
                  <img
                    src={
                      previewModalSub.fileUrl ||
                      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80'
                    }
                    alt={previewModalSub.title}
                    className="w-full h-auto max-h-80 object-contain"
                  />
                </div>
              ) : (
                /* PRATINJAU DOKUMEN */
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <FileText className="w-12 h-12 text-rose-600 mx-auto" />
                  <h4 className="font-bold text-xs text-slate-900">{previewModalSub.fileName}</h4>
                  <p className="text-[11px] text-slate-500">Berkas Dokumen Laporan Tugas Portofolio (PDF/DOCX)</p>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-slate-50 text-xs space-y-1.5 border border-slate-200">
                <p>
                  <strong>Judul Karya:</strong> {previewModalSub.title}
                </p>
                <p>
                  <strong>Peserta Didik:</strong> {previewModalSub.studentName}
                </p>
                <p>
                  <strong>Format & Ukuran:</strong> {previewModalSub.category} (
                  {previewModalSub.fileSize || '2.4 MB'})
                </p>
                <p className="text-slate-600 pt-1">
                  <strong>Refleksi & Deskripsi:</strong> {previewModalSub.description}
                </p>
              </div>
            </div>

            {/* Modal Actions: Hapus File, Unduh, Tutup */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSubmissionToDelete(previewModalSub);
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center justify-center space-x-1.5 border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Karya & Berkas Ini</span>
              </button>

              <div className="flex items-center space-x-2 justify-end">
                <a
                  href={previewModalSub.fileUrl || '#'}
                  download={previewModalSub.fileName || 'Karya_Siswa'}
                  onClick={(e) => {
                    if (!previewModalSub.fileUrl) {
                      e.preventDefault();
                      alert(`Mengunduh file: ${previewModalSub.fileName || 'Karya_Siswa'}`);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewModalSub(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS BERKAS YANG BARU DIUNGGAH DI FORM */}
      {isConfirmingDeleteStaged && uploadedFile && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-rose-100 shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-base text-slate-900">Hapus Berkas Yang Dipilih?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin membatalkan dan menghapus berkas{' '}
                <strong className="text-slate-900">&quot;{uploadedFile.name}&quot;</strong> ({uploadedFile.size}) dari formulir pengumpulan?
              </p>
              <p className="text-[11px] text-rose-600 font-medium">
                Berkas ini belum disimpan ke galeri tugas. Pilihan berkas akan di-reset.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDeleteStaged(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={confirmDeleteStagedFile}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS BERKAS / SUBMISSION GALERI */}
      {submissionToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-rose-100 shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-bold text-base text-slate-900">Hapus Berkas Karya Siswa?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus berkas dan tugas{' '}
                <strong className="text-slate-900">&quot;{submissionToDelete.title}&quot;</strong> milik{' '}
                <strong className="text-slate-900">{submissionToDelete.studentName}</strong>?
              </p>
              {submissionToDelete.fileName && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-center justify-center space-x-2">
                  <span className="font-mono">{submissionToDelete.fileName}</span>
                  {submissionToDelete.fileSize && (
                    <span className="text-slate-400">({submissionToDelete.fileSize})</span>
                  )}
                </div>
              )}
              <p className="text-[11px] text-rose-600 font-medium">
                Berkas yang telah dihapus tidak dapat dipulihkan kembali dari galeri portofolio.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSubmissionToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={confirmDeleteSubmission}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
