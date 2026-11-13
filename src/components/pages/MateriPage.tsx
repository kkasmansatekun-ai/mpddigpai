import React, { useState, useEffect, useRef } from 'react';
import { LEARNING_MATERIALS } from '../../data/materialsData';
import { MaterialItem, SchoolClass, User } from '../../types';
import {
  FileText,
  Image,
  PieChart,
  Video,
  Volume2,
  Presentation,
  AlertTriangle,
  BookOpen,
  CheckSquare,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  Share2,
  PlusCircle,
  Trash2,
  X,
  CheckCircle2,
  GraduationCap,
  Filter,
  Layers,
  Eye,
  Footprints,
  Upload,
  Download,
  FileSpreadsheet,
  FileUp,
  File,
  Music,
  Film,
  Loader2,
  Edit3,
  AlertCircle,
} from 'lucide-react';
import {
  saveMaterialWithMedia,
  loadAllMaterialsWithMedia,
  deleteMaterialWithMedia,
  saveMaterialsToLocalCache,
  getMaterialsFromLocalCache,
} from '../../services/mediaStorageService';
import { MediaDocumentViewer } from '../common/MediaDocumentViewer';

interface MateriPageProps {
  activeClass?: SchoolClass;
  currentUser?: User;
}

export function detectGradeLevel(className?: string, phase?: string): 'X' | 'XI' | 'XII' {
  const upper = `${className || ''} ${phase || ''}`.toUpperCase();
  if (upper.includes('XII') || upper.includes('12')) return 'XII';
  if (upper.includes('XI') || upper.includes('11')) return 'XI';
  return 'X';
}

export const MateriPage: React.FC<MateriPageProps> = ({ activeClass, currentUser }) => {
  const isStudent = currentUser?.role === 'student';
  const studentGrade = detectGradeLevel(currentUser?.className || activeClass?.name, activeClass?.phase);
  const activeClassGrade = detectGradeLevel(activeClass?.name, activeClass?.phase);

  const [activeTab, setActiveTab] = useState<string>('mat-teks');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(25);
  const [checklistAnswers, setChecklistAnswers] = useState<{ [index: number]: boolean }>({
    0: true,
    1: true,
    2: true,
    3: true,
    7: true,
    9: true,
  });

  // Filter grade for teacher view
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'all' | 'X' | 'XI' | 'XII'>(activeClassGrade);

  // Custom materials added by teacher
  const [customMaterials, setCustomMaterials] = useState<MaterialItem[]>(() =>
    getMaterialsFromLocalCache()
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
  const [addFeedback, setAddFeedback] = useState<string | null>(null);

  // Form states for new/edited material
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newType, setNewType] = useState('teks');
  const [newCategory, setNewCategory] = useState<'visual' | 'auditory' | 'kinesthetic'>('visual');
  const [newSummary, setNewSummary] = useState('');
  const [newContentText, setNewContentText] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newGradeLevel, setNewGradeLevel] = useState<'X' | 'XI' | 'XII' | 'all'>(activeClassGrade);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
    extension: string;
    dataUrl: string;
    isChunked?: boolean;
    chunkCount?: number;
  } | null>(null);

  // Upload & Save loading states (specifically visible for Admin/Guru uploading Video/PDF/Word)
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [fileReadProgress, setFileReadProgress] = useState(0);
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [saveProgressLabel, setSaveProgressLabel] = useState('');
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper untuk membaca upload file berbagai format (video, word, pdf, audio, visual, excel)
  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileUploadError(null);

    // Maksimal 25 MB
    if (file.size > 25 * 1024 * 1024) {
      setFileUploadError('Ukuran berkas melebihi batas maksimal 25 MB. Pilih berkas yang lebih ringkas.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const ext =
      file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase() || 'file';
    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    // Otomatis sinkronkan format dan kategori berdasarkan jenis berkas
    if (['mp3', 'wav', 'm4a', 'ogg', 'aac'].includes(ext)) {
      setNewCategory('auditory');
      setNewType('audio');
    } else if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
      setNewCategory('visual');
      setNewType('gambar');
    } else if (['pdf', 'doc', 'docx'].includes(ext)) {
      setNewCategory('visual');
      setNewType('bacaan');
    } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
      setNewCategory('kinesthetic');
      setNewType('kasus');
    } else if (['mp4', 'webm', 'mov', 'mkv', 'm4v'].includes(ext)) {
      setNewCategory('visual');
      setNewType('video');
    }

    setIsReadingFile(true);
    setFileReadProgress(15);

    const reader = new FileReader();
    reader.onprogress = (ev) => {
      if (ev.lengthComputable) {
        const pct = Math.min(95, Math.round((ev.loaded / ev.total) * 100));
        setFileReadProgress(pct);
      }
    };
    reader.onerror = () => {
      setIsReadingFile(false);
      setFileReadProgress(0);
      setFileUploadError('Gagal membaca berkas dari perangkat. Silakan coba lagi.');
    };
    reader.onload = () => {
      setFileReadProgress(100);
      setUploadedFile({
        name: file.name,
        size: sizeStr,
        type: file.type || (ext === 'mp4' ? 'video/mp4' : 'application/octet-stream'),
        extension: ext,
        dataUrl: reader.result as string,
      });

      if (!newTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setNewTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
      setTimeout(() => {
        setIsReadingFile(false);
      }, 250);
    };
    reader.readAsDataURL(file);
  };

  // Keep modal grade level & teacher filter synced with active class
  useEffect(() => {
    if (activeClass) {
      const detected = detectGradeLevel(activeClass.name, activeClass.phase);
      if (!editingMaterialId) {
        setNewGradeLevel(detected);
      }
      if (!isStudent) {
        setSelectedGradeFilter(detected);
      }
    }
  }, [activeClass?.id, isStudent, editingMaterialId]);

  // Load from Firestore + IndexedDB (including chunked videos/PDF/Word)
  useEffect(() => {
    let cancelled = false;
    loadAllMaterialsWithMedia().then((hydratedMaterials) => {
      if (!cancelled && hydratedMaterials.length > 0) {
        setCustomMaterials(hydratedMaterials);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const mediaTypes = [
    { id: 'teks', label: 'Teks & Dalil', icon: <FileText className="w-4 h-4" /> },
    { id: 'gambar', label: 'Gambar Ilustrasi', icon: <Image className="w-4 h-4" /> },
    { id: 'infografis', label: 'Infografis Ringkas', icon: <PieChart className="w-4 h-4" /> },
    { id: 'video', label: 'Video Penjelasan', icon: <Video className="w-4 h-4" /> },
    { id: 'audio', label: 'Kajian Audio Podcast', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'presentasi', label: 'Slide Interaktif', icon: <Presentation className="w-4 h-4" /> },
    { id: 'kasus', label: 'Contoh Kasus Faktual', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'bacaan', label: 'Fatwa MUI & E-Book', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'interaktif', label: 'Checklist Mandiri', icon: <CheckSquare className="w-4 h-4" /> },
  ];

  // Default materials belong to Kelas X (Fase E - Adab Bersosial Media)
  const defaultWithGrade: MaterialItem[] = LEARNING_MATERIALS.map((m) => ({
    ...m,
    gradeLevel: (m.gradeLevel || 'X') as 'X' | 'XI' | 'XII' | 'all',
  }));

  const allAvailableMaterials = [...defaultWithGrade, ...customMaterials];

  // Filtering based on role and grade level:
  // - Students only see materials for their grade level or 'all'
  // - Teachers can filter by selected grade or view 'all'
  const displayedMaterials = allAvailableMaterials.filter((m) => {
    const itemGrade = m.gradeLevel || 'X';
    if (isStudent) {
      return itemGrade === 'all' || itemGrade === studentGrade;
    }
    if (selectedGradeFilter === 'all') return true;
    return itemGrade === selectedGradeFilter || itemGrade === 'all';
  });

  // Keep activeTab pointing to an available material by exact ID
  useEffect(() => {
    if (displayedMaterials.length > 0) {
      const exists = displayedMaterials.some((m) => m.id === activeTab);
      if (!exists) {
        setActiveTab(displayedMaterials[0].id);
      }
    }
  }, [displayedMaterials, activeTab]);

  const currentMaterial =
    displayedMaterials.find((m) => m.id === activeTab) ||
    displayedMaterials[0] ||
    null;

  const isCustomMaterial = Boolean((currentMaterial as any)?.contentData?.isCustom);

  const openAddModal = (presetGrade?: 'X' | 'XI' | 'XII' | 'all') => {
    if (isStudent) return;
    setEditingMaterialId(null);
    setNewTitle('');
    setNewSubtitle('');
    setNewType('teks');
    setNewCategory('visual');
    setNewSummary('');
    setNewContentText('');
    setNewMediaUrl('');
    setNewGradeLevel(presetGrade || activeClassGrade);
    setUploadedFile(null);
    setFileUploadError(null);
    setIsReadingFile(false);
    setSaveProgress(0);
    setSaveProgressLabel('');
    setShowAddModal(true);
  };

  const openEditModal = (mat: MaterialItem) => {
    if (isStudent) return;
    const cat =
      mat.learningStyleCategory ||
      (mat.contentData as any)?.learningStyleCategory ||
      'visual';
    setEditingMaterialId(mat.id);
    setNewTitle(mat.title || '');
    setNewSubtitle(mat.subtitle || '');
    setNewType(mat.type || 'teks');
    setNewCategory(
      cat === 'auditory' || cat === 'kinesthetic' || cat === 'visual' ? cat : 'visual'
    );
    setNewSummary(mat.summary || '');
    setNewContentText((mat.contentData as any)?.text || '');
    setNewMediaUrl((mat.contentData as any)?.mediaUrl || '');
    setNewGradeLevel((mat.gradeLevel as any) || activeClassGrade);
    setUploadedFile((mat.contentData as any)?.fileAttachment || null);
    setFileUploadError(null);
    setIsReadingFile(false);
    setSaveProgress(0);
    setSaveProgressLabel('');
    setShowAddModal(true);
  };

  const handleAddMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isStudent || !newTitle.trim() || isSavingMaterial || isReadingFile) return;

    setIsSavingMaterial(true);
    setSaveProgress(10);
    setSaveProgressLabel('Mempersiapkan materi & media...');

    const isEditing = Boolean(editingMaterialId);
    const targetId = editingMaterialId || `custom-mat-${Date.now()}`;
    const categoryLabel =
      newCategory === 'auditory'
        ? 'Audio'
        : newCategory === 'kinesthetic'
        ? 'Kinestetik'
        : 'Visual';

    const targetItem: MaterialItem = {
      id: targetId,
      type: newType as any,
      title: newTitle.trim(),
      subtitle:
        newSubtitle.trim() ||
        `Materi PAI Kelas ${newGradeLevel === 'all' ? 'X / XI / XII' : newGradeLevel}`,
      badge: `Kategori: ${categoryLabel}`,
      duration: newCategory === 'auditory' ? '10 Menit Audio' : '10 Menit Baca',
      summary: newSummary.trim() || 'Ringkasan materi pembelajaran PAI.',
      gradeLevel: newGradeLevel,
      learningStyleCategory: newCategory,
      contentData: {
        isCustom: true,
        text: newContentText,
        mediaUrl: newMediaUrl.trim(),
        fileAttachment: uploadedFile || undefined,
        learningStyleCategory: newCategory,
        categoryName: categoryLabel,
        addedAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      },
    };

    try {
      const savedItem = await saveMaterialWithMedia(targetItem, (pct, label) => {
        setSaveProgress(pct);
        setSaveProgressLabel(label);
      });

      const updated = isEditing
        ? customMaterials.map((m) => (m.id === targetId ? savedItem : m))
        : [savedItem, ...customMaterials];

      setCustomMaterials(updated);
      saveMaterialsToLocalCache(updated);

      if (!isStudent && newGradeLevel !== 'all') {
        setSelectedGradeFilter(newGradeLevel);
      }

      setActiveTab(targetId);
      setShowAddModal(false);
      setEditingMaterialId(null);
      setNewTitle('');
      setNewSubtitle('');
      setNewSummary('');
      setNewContentText('');
      setNewMediaUrl('');
      setUploadedFile(null);

      setAddFeedback(
        isEditing
          ? `Materi "${savedItem.title}" berhasil diperbarui & disinkronkan ke akun siswa!`
          : `Materi "${savedItem.title}" (Kategori: ${categoryLabel}) berhasil disimpan ke cloud & langsung tampil di akun siswa (Materi PAI & Aktivitas Pembelajaran tab Gaya ${
              categoryLabel === 'Audio'
                ? 'AUDITORI'
                : categoryLabel === 'Visual'
                ? 'VISUAL'
                : 'KINESTETIK'
            })!`
      );
      setTimeout(() => setAddFeedback(null), 5500);
    } catch (err: any) {
      console.warn('Save material warning:', err);
      // Fallback: still keep locally in IndexedDB + state so current session works
      const updated = isEditing
        ? customMaterials.map((m) => (m.id === targetId ? targetItem : m))
        : [targetItem, ...customMaterials];
      setCustomMaterials(updated);
      saveMaterialsToLocalCache(updated);
      setActiveTab(targetId);
      setShowAddModal(false);
      setEditingMaterialId(null);
      setAddFeedback(
        `Materi "${targetItem.title}" tersimpan secara lokal (sinkronisasi cloud tertunda).`
      );
      setTimeout(() => setAddFeedback(null), 5000);
    } finally {
      setIsSavingMaterial(false);
      setSaveProgress(0);
      setSaveProgressLabel('');
    }
  };

  const handleDeleteCustomMaterial = async (matId: string) => {
    if (isStudent) return;
    const targetMat = customMaterials.find((m) => m.id === matId);
    const updated = customMaterials.filter((m) => m.id !== matId);
    setCustomMaterials(updated);
    saveMaterialsToLocalCache(updated);
    setActiveTab('mat-teks');
    if (targetMat) {
      await deleteMaterialWithMedia(targetMat);
    }
    setAddFeedback('Materi tambahan berhasil dihapus dari database & akun siswa.');
    setTimeout(() => setAddFeedback(null), 4000);
  };

  const toggleChecklistItem = (idx: number) => {
    setChecklistAnswers((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const checklistScore = Object.values(checklistAnswers).filter(Boolean).length * 10;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Toast Feedback */}
      {addFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center space-x-2.5 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{addFeedback}</span>
        </div>
      )}

      {/* Title & Filter Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 text-emerald-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Halaman 4 / 11</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                Multi-Representasi Materi Pembelajaran
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Materi PAI: Multi-Representasi & Terintegrasi
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isStudent
                ? `Materi khusus disesuaikan untuk siswa Kelas ${studentGrade} agar fokus dan tidak tercampur materi jenjang lain.`
                : 'Materi terstruktur per tingkat kelas (X, XI, XII) untuk diferensiasi konten pembelajaran PAI.'}
            </p>
          </div>

          {/* TOMBOL "TAMBAH MATERI" (HANYA TAMPIL PADA AKUN ADMIN / GURU) */}
          {!isStudent && (
            <div className="shrink-0">
              <button
                onClick={() => openAddModal()}
                className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition hover:scale-102 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-200" />
                <span>Tambah Materi</span>
              </button>
            </div>
          )}
        </div>

        {/* GRADE FILTER BAR: GURU VS SISWA */}
        {!isStudent ? (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-slate-700 text-xs font-semibold">
              <Filter className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Filter Tingkat Kelas:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedGradeFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedGradeFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Semua Tingkat ({allAvailableMaterials.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedGradeFilter('X')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedGradeFilter === 'X'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                Kelas X (Fase E)
              </button>
              <button
                type="button"
                onClick={() => setSelectedGradeFilter('XI')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedGradeFilter === 'XI'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-800'
                }`}
              >
                Kelas XI (Fase F)
              </button>
              <button
                type="button"
                onClick={() => setSelectedGradeFilter('XII')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedGradeFilter === 'XII'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-purple-50 hover:text-purple-800'
                }`}
              >
                Kelas XII (Fase F)
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-emerald-900 font-semibold">
              <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Menampilkan Materi Khusus: <strong>Kelas {studentGrade}</strong> ({activeClass?.phase || 'Kurikulum Merdeka'})
              </span>
            </div>
            <span className="text-[11px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
              {displayedMaterials.length} Materi Aktif
            </span>
          </div>
        )}

        {/* TABS SELECTOR DARI MATERI YANG SESUAI FILTER */}
        {displayedMaterials.length > 0 ? (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {displayedMaterials.map((mat) => {
              const isActive = currentMaterial?.id === mat.id;
              const isCustom = Boolean((mat as any)?.contentData?.isCustom);
              const iconObj = mediaTypes.find((t) => t.id === mat.type);

              return (
                <button
                  key={mat.id}
                  onClick={() => setActiveTab(mat.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? isCustom
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-emerald-700 text-white shadow-sm shadow-emerald-900/30'
                      : isCustom
                      ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {isCustom ? (
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  ) : (
                    <span className="shrink-0">{iconObj?.icon || <FileText className="w-4 h-4" />}</span>
                  )}
                  <span className="truncate max-w-[150px]">
                    {isCustom ? mat.title : iconObj?.label || mat.title}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    {mat.gradeLevel === 'all' ? 'Semua' : `Kls ${mat.gradeLevel || 'X'}`}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="border-t border-slate-100 pt-4 text-center py-6 text-slate-500 text-xs">
            Tidak ada materi yang sesuai dengan filter tingkat kelas yang dipilih.
          </div>
        )}
      </div>

      {/* MATERIAL CONTENT CARD ATAU EMPTY STATE */}
      {!currentMaterial ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              Belum Ada Materi untuk {selectedGradeFilter === 'all' ? 'Tingkat Kelas Ini' : `Kelas ${selectedGradeFilter}`}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isStudent
                ? `Guru belum mengunggah materi khusus untuk Kelas ${studentGrade}. Silakan konfirmasi ke guru pengampu Anda.`
                : `Anda dapat menambahkan materi baru khusus untuk Kelas ${selectedGradeFilter} dengan menekan tombol di bawah.`}
            </p>
          </div>
          {!isStudent && (
            <button
              onClick={() =>
                openAddModal(selectedGradeFilter !== 'all' ? selectedGradeFilter : 'X')
              }
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center space-x-1.5 shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Materi Kelas {selectedGradeFilter === 'all' ? 'X' : selectedGradeFilter}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Header of Active Material */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    currentMaterial.gradeLevel === 'XI'
                      ? 'bg-blue-100 text-blue-800'
                      : currentMaterial.gradeLevel === 'XII'
                      ? 'bg-purple-100 text-purple-800'
                      : currentMaterial.gradeLevel === 'all'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {currentMaterial.gradeLevel === 'all'
                    ? 'Semua Tingkat (X, XI, XII)'
                    : `Tingkat: Kelas ${currentMaterial.gradeLevel || 'X'}`}
                </span>
                {currentMaterial.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                    {currentMaterial.badge}
                  </span>
                )}
                {currentMaterial.duration && (
                  <span className="text-xs text-slate-400 font-medium">
                    {currentMaterial.duration}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {currentMaterial.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{currentMaterial.subtitle}</p>
            </div>
          </div>

        {/* TAB 1: TEKS & DALIL */}
        {!isCustomMaterial && currentMaterial.type === 'teks' && currentMaterial.contentData?.surah && (
          <div className="space-y-6">
            {/* Ayat QS. Al-Hujurat: 6 */}
            <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-950">
                  {currentMaterial.contentData.surah.name}
                </span>
                <span className="text-xs bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-semibold">
                  Kewajiban Tabayyun
                </span>
              </div>
              <p className="font-arabic text-2xl sm:text-3xl text-right dir-rtl leading-loose text-slate-900 py-3">
                {currentMaterial.contentData.surah.arabic}
              </p>
              <div className="border-t border-emerald-200/80 pt-3">
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  {currentMaterial.contentData.surah.translation}
                </p>
              </div>
            </div>

            {/* Hadis Menjaga Lisan */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">
                  Hadis Rasulullah SAW tentang Menjaga Lisan
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {currentMaterial.contentData.hadits.source}
                </span>
              </div>
              <p className="font-arabic text-xl sm:text-2xl text-right dir-rtl leading-loose text-slate-900 py-2">
                {currentMaterial.contentData.hadits.arabic}
              </p>
              <div className="border-t border-slate-200 pt-3">
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  {currentMaterial.contentData.hadits.translation}
                </p>
              </div>
            </div>

            {/* 6 Kaidah Komunikasi Al-Qur'an */}
            <div className="space-y-3">
              <h3 className="font-bold text-base text-slate-900">
                6 Kaidah Komunikasi Islami dalam Al-Qur’an (Kamus Karakter Digital)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentMaterial.contentData.kaidah.map((k: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 hover:border-emerald-300 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 text-sm">{k.term}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        {k.surah}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{k.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GAMBAR ILUSTRASI */}
        {!isCustomMaterial && currentMaterial.type === 'gambar' && Array.isArray(currentMaterial.contentData) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentMaterial.contentData.map((img: any, idx: number) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className={`p-6 bg-gradient-to-br ${img.accent} text-white space-y-2`}>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-black/20 rounded">
                    {img.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">{img.title}</h3>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 leading-relaxed">{img.desc}</p>
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    {img.points.map((pt: string, pIdx: number) => (
                      <div key={pIdx} className="flex items-center space-x-2 text-xs text-slate-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: INFOGRAFIS RINGKAS */}
        {!isCustomMaterial && currentMaterial.type === 'infografis' && currentMaterial.contentData?.steps && (
          <div className="space-y-6">
            <div className="bg-emerald-950 text-white p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-emerald-300">
                  Alur Verifikasi Informasi (Fact-Checking Workflow)
                </h3>
                <p className="text-xs text-emerald-200/80 mt-1">
                  6 Langkah Netizen Muslim ketika Menemukan Kabar Bombastis di Medsos
                </p>
              </div>
              <span className="hidden sm:inline text-xs bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full font-mono">
                SOP Tabayyun v2
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentMaterial.contentData.steps.map((st: any) => (
                <div
                  key={st.num}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative overflow-hidden group hover:bg-emerald-50/50 hover:border-emerald-300 transition"
                >
                  <span className="text-3xl font-black text-slate-200 group-hover:text-emerald-200 transition">
                    {st.num}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{st.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VIDEO PENJELASAN */}
        {!isCustomMaterial && currentMaterial.type === 'video' && currentMaterial.contentData?.videoTitle && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl overflow-hidden aspect-video relative flex flex-col items-center justify-center text-white p-6 shadow-xl border border-slate-800">
              <div className="w-16 h-16 rounded-full bg-emerald-500/90 hover:bg-emerald-400 flex items-center justify-center cursor-pointer shadow-lg transition hover:scale-110">
                <Play className="w-7 h-7 text-emerald-950 ml-1" />
              </div>
              <p className="text-base font-bold mt-4 text-center">
                {currentMaterial.contentData.videoTitle}
              </p>
              <p className="text-xs text-emerald-300 mt-1">
                Narasumber: {currentMaterial.contentData.speaker} • Durasi: 12 Menit
              </p>
              <span className="text-[11px] text-slate-400 mt-2 bg-slate-800/80 px-3 py-1 rounded-full">
                Simulasi Pemutar Video Interaktif HD (YouTube Embedded Responsive)
              </span>
            </div>

            {/* Timestamps & Key Takeaways */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase text-slate-600 tracking-wider">
                  Daftar Waktu Pembahasan (Timestamps)
                </h4>
                <div className="space-y-2">
                  {currentMaterial.contentData.timestamps.map((ts: any, i: number) => (
                    <div key={i} className="flex items-center space-x-3 text-xs p-2 rounded-lg bg-white border border-slate-200">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {ts.time}
                      </span>
                      <span className="text-slate-800">{ts.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <h4 className="font-bold text-xs uppercase text-emerald-800 tracking-wider">
                  Kesimpulan Pokok Video (Key Takeaways)
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {currentMaterial.contentData.keyTakeaways.map((take: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{take}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIO PODCAST */}
        {!isCustomMaterial && currentMaterial.type === 'audio' && currentMaterial.contentData?.audioTitle && (
          <div className="space-y-6">
            {/* Audio Player Component */}
            <div className="p-6 rounded-3xl bg-emerald-950 text-white space-y-5 shadow-lg border border-emerald-900">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-900 px-2.5 py-0.5 rounded-full">
                    Kajian Suara Audio PAI
                  </span>
                  <h3 className="font-bold text-lg text-white mt-1">
                    {currentMaterial.contentData.audioTitle}
                  </h3>
                  <p className="text-xs text-emerald-300">
                    Oleh: {currentMaterial.contentData.speaker}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-800 flex items-center justify-center text-emerald-200">
                  <Volume2 className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* Scrubbing Bar */}
              <div className="space-y-2">
                <div className="w-full bg-emerald-900 h-2 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all"
                    style={{ width: `${audioProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-300 font-mono">
                  <span>02:15</span>
                  <span>09:00</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs flex items-center space-x-2 shadow-md transition"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  <span>{isPlayingAudio ? 'Jeda Audio (Pause)' : 'Putar Audio (Play)'}</span>
                </button>
              </div>
            </div>

            {/* Transcript */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Transkrip Lengkap Audio</h4>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-serif italic">
                {currentMaterial.contentData.transcript}
              </p>
            </div>
          </div>
        )}

        {/* TAB 6: PRESENTASI INTERAKTIF */}
        {!isCustomMaterial && currentMaterial.type === 'presentasi' && currentMaterial.contentData?.slides && (
          <div className="space-y-4">
            {/* Slide Viewer */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 min-h-[360px] flex flex-col justify-between shadow-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-emerald-300 border-b border-emerald-900/60 pb-3">
                <span className="font-mono font-bold">
                  Slide {currentSlideIndex + 1} dari {currentMaterial.contentData.slides.length}
                </span>
                <span className="uppercase tracking-wider">Slide Interaktif PAI KELAS X 3 (Fase E)</span>
              </div>

              <div className="py-6 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {currentMaterial.contentData.slides[currentSlideIndex].title}
                </h3>
                <ul className="space-y-3 mt-4">
                  {currentMaterial.contentData.slides[currentSlideIndex].bullets.map(
                    (bullet: string, i: number) => (
                      <li key={i} className="flex items-start space-x-3 text-sm text-emerald-100">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Slide Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-emerald-900/60">
                <button
                  disabled={currentSlideIndex === 0}
                  onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                <div className="flex items-center space-x-1.5">
                  {currentMaterial.contentData.slides.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === currentSlideIndex ? 'bg-emerald-400 w-6' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={currentSlideIndex === currentMaterial.contentData.slides.length - 1}
                  onClick={() =>
                    setCurrentSlideIndex((prev) =>
                      Math.min(currentMaterial.contentData.slides.length - 1, prev + 1)
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: CONTOH KASUS */}
        {!isCustomMaterial && currentMaterial.type === 'kasus' && Array.isArray(currentMaterial.contentData) && (
          <div className="space-y-6">
            {currentMaterial.contentData.map((kasus: any) => (
              <div
                key={kasus.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 hover:border-emerald-300 transition"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900">{kasus.title}</h3>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                    Studi Kasus Siswa
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <strong className="block text-slate-900 mb-1">Kronologi Kasus:</strong>
                  {kasus.scenario}
                </div>

                <div className="space-y-2">
                  <strong className="text-xs text-emerald-900 block">Pertanyaan Analisis:</strong>
                  <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                    {kasus.analysisQuestions.map((q: string, i: number) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-slate-800 leading-relaxed">
                  <strong className="block text-emerald-950 mb-1">Solusi & Tinjauan Syariat Islam:</strong>
                  {kasus.solution}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 8: SUMBER BACAAN / FATWA */}
        {!isCustomMaterial && currentMaterial.type === 'bacaan' && currentMaterial.contentData?.ketentuanHukum && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
              <h3 className="font-bold text-base text-emerald-950 mb-1">
                {currentMaterial.contentData.fatwaTitle}
              </h3>
              <p className="text-xs text-emerald-800">
                Tentang Hukum dan Pedoman Bermuamalah Melalui Media Sosial
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentMaterial.contentData.ketentuanHukum.map((item: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400">Poin {item.poin}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        item.hukum === 'Wajib'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.hukum}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: CHECKLIST INTERAKTIF */}
        {!isCustomMaterial && currentMaterial.type === 'interaktif' && currentMaterial.contentData?.checklistItems && (
          <div className="space-y-6">
            {/* Score Display */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-white">Indeks Kesalehan Digital Anda</h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Centang setiap pernyataan di bawah sesuai kebiasaan aslimu saat menggunakan smartphone.
                </p>
              </div>
              <div className="text-center bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
                <span className="text-3xl font-extrabold text-white">{checklistScore}%</span>
                <p className="text-[10px] text-emerald-200 mt-0.5">
                  {checklistScore >= 80 ? 'Sangat Beradab' : 'Perlu Ditingkatkan'}
                </p>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2.5">
              {currentMaterial.contentData.checklistItems.map((item: string, idx: number) => {
                const isChecked = !!checklistAnswers[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleChecklistItem(idx)}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] bg-slate-200 text-slate-700">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleChecklistItem(idx)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CUSTOM MATERIAL DISPLAY */}
        {isCustomMaterial && (
          <div className="space-y-5 animate-fade-in">
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                  Materi Tambahan Guru
                </span>
                {/* TOMBOL EDIT & HAPUS HANYA UNTUK AKUN ADMIN / GURU */}
                {!isStudent && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(currentMaterial)}
                      className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center space-x-1 border border-blue-200 transition cursor-pointer"
                      title="Edit materi ini"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCustomMaterial(currentMaterial.id)}
                      className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center space-x-1 border border-rose-200 transition cursor-pointer"
                      title="Hapus materi ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">{currentMaterial.title}</h3>
                <p className="text-xs text-slate-600 font-medium">{currentMaterial.subtitle}</p>
              </div>

              {currentMaterial.summary && (
                <div className="p-3.5 bg-white rounded-xl border border-amber-200 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-amber-950 block mb-0.5">Ringkasan Materi:</strong>
                  {currentMaterial.summary}
                </div>
              )}
            </div>

            {/* Content text */}
            {(currentMaterial as any).contentData?.text && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <h4 className="font-bold text-sm text-slate-900">Uraian Materi & Pembahasan:</h4>
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {(currentMaterial as any).contentData.text}
                </div>
              </div>
            )}

            {/* PENAMPIL MEDIA & DOKUMEN MULTI-FORMAT (Video Player, PDF Viewer, MS Word Reader, Audio, Gambar, Tabel) */}
            {((currentMaterial as any).contentData?.fileAttachment ||
              (currentMaterial as any).contentData?.mediaUrl) && (
              <MediaDocumentViewer
                title={currentMaterial.title}
                fileAttachment={(currentMaterial as any).contentData?.fileAttachment}
                mediaUrl={(currentMaterial as any).contentData?.mediaUrl}
              />
            )}

            {/* Media Link / Embedded if provided */}
            {(currentMaterial as any).contentData?.mediaUrl && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-700 min-w-0">
                  <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="shrink-0">Tautan Media Rujukan:</span>
                  <span className="font-mono text-emerald-800 truncate max-w-xs sm:max-w-md">
                    {(currentMaterial as any).contentData.mediaUrl}
                  </span>
                </div>
                <a
                  href={(currentMaterial as any).contentData.mediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition shrink-0"
                >
                  Buka Tautan
                </a>
              </div>
            )}
          </div>
        )}
      </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT MATERI (HANYA GURU / ADMIN) */}
      {showAddModal && !isStudent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-emerald-800">
                {editingMaterialId ? (
                  <Edit3 className="w-5 h-5 text-blue-600" />
                ) : (
                  <PlusCircle className="w-5 h-5 text-emerald-600" />
                )}
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingMaterialId ? 'Edit Materi PAI' : 'Tambah Materi PAI Baru'}
                </h3>
              </div>
              <button
                type="button"
                disabled={isSavingMaterial}
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMaterialId(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition disabled:opacity-40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMaterialSubmit} className="space-y-4 text-xs">
              {/* OPSI TARGET TINGKAT KELAS: X, XI, XII, SEMUA */}
              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
                <label className="font-bold text-emerald-950 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    <span>Target Tingkat Kelas Siswa *</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                    Isolasi Akses Siswa
                  </span>
                </label>
                <select
                  value={newGradeLevel}
                  onChange={(e) => setNewGradeLevel(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                >
                  <option value="X">Kelas X (Fase E - SMA/SMK)</option>
                  <option value="XI">Kelas XI (Fase F - SMA/SMK)</option>
                  <option value="XII">Kelas XII (Fase F - SMA/SMK)</option>
                  <option value="all">Semua Tingkat (X, XI, & XII)</option>
                </select>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  ℹ️ <strong>Proteksi Tingkat:</strong> Siswa Kelas X hanya dapat melihat materi Kelas X/Semua, dan tidak dapat melihat materi Kelas XI. Begitu pula sebaliknya.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Judul Materi PAI *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Menjaga Kehormatan & Membendung Gibah Digital"
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Subjudul / Topik</label>
                  <input
                    type="text"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    placeholder="Contoh: Kajian Hadis Shahih & Etika Siber"
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Format Representasi Media</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  >
                    <option value="teks">Teks & Dalil Syar'i</option>
                    <option value="gambar">Gambar & Ilustrasi</option>
                    <option value="video">Video Penjelasan</option>
                    <option value="audio">Kajian Audio Podcast</option>
                    <option value="infografis">Infografis & Gambar</option>
                    <option value="kasus">Studi Kasus Faktual</option>
                    <option value="bacaan">E-Book & Artikel</option>
                  </select>
                </div>
              </div>

              {/* KATEGORI MATERI GAYA BELAJAR (AUDIO, VISUAL, KINESTETIK) */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-xs text-slate-900 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Kategori Materi (Pilihan Gaya Belajar) *</span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Integrasi Otomatis
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pilih salah satu kategori materi. Sistem akan otomatis menampilkan materi ini di menu <strong>Aktivitas Belajar Berdiferensiasi Gaya Belajar</strong> sesuai gaya belajar yang dipilih:
                </p>

                {/* PILIHAN LIST: *. Audio, *. Visual, *. Kinestetik */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {/* OPSI *. Audio */}
                  <div
                    onClick={() => {
                      setNewCategory('auditory');
                      if (newType === 'teks') setNewType('audio');
                    }}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-2 ${
                      newCategory === 'auditory'
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/30'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          newCategory === 'auditory'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-xs text-slate-900">*. Audio</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Materi tersedia di menu Aktivitas Belajar tab <strong>Gaya AUDITORI</strong>.
                    </p>
                    <div className="flex items-center space-x-1.5 text-[10px] font-bold text-blue-700 pt-1 border-t border-blue-100">
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                          newCategory === 'auditory'
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {newCategory === 'auditory' && '✓'}
                      </span>
                      <span>Kategori Audio</span>
                    </div>
                  </div>

                  {/* OPSI *. Visual */}
                  <div
                    onClick={() => {
                      setNewCategory('visual');
                      if (newType === 'audio') setNewType('teks');
                    }}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-2 ${
                      newCategory === 'visual'
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/30'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          newCategory === 'visual'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-xs text-slate-900">*. Visual</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Materi tersedia di menu Aktivitas Belajar tab <strong>Gaya VISUAL</strong>.
                    </p>
                    <div className="flex items-center space-x-1.5 text-[10px] font-bold text-emerald-700 pt-1 border-t border-emerald-100">
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                          newCategory === 'visual'
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {newCategory === 'visual' && '✓'}
                      </span>
                      <span>Kategori Visual</span>
                    </div>
                  </div>

                  {/* OPSI *. Kinestetik */}
                  <div
                    onClick={() => {
                      setNewCategory('kinesthetic');
                    }}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-2 ${
                      newCategory === 'kinesthetic'
                        ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-amber-300 bg-white hover:bg-amber-50/30'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          newCategory === 'kinesthetic'
                            ? 'bg-amber-600 text-white'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <Footprints className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-xs text-slate-900">*. Kinestetik</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Materi tersedia di menu Aktivitas Belajar tab <strong>Gaya KINESTETIK</strong>.
                    </p>
                    <div className="flex items-center space-x-1.5 text-[10px] font-bold text-amber-700 pt-1 border-t border-amber-100">
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                          newCategory === 'kinesthetic'
                            ? 'border-amber-600 bg-amber-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {newCategory === 'kinesthetic' && '✓'}
                      </span>
                      <span>Kategori Kinestetik</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Ringkasan Materi *</label>
                <textarea
                  rows={2}
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Ringkasan singkat mengenai pesan utama materi ini..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Isi Pembahasan / Teks Materi *</label>
                <textarea
                  rows={4}
                  required
                  value={newContentText}
                  onChange={(e) => setNewContentText(e.target.value)}
                  placeholder="Tuliskan uraian materi, dalil Al-Qur'an/Hadits, atau poin-poin penjelasan di sini..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
              </div>

              {/* UPLOAD BERKAS MATERI PEMBELAJARAN (MULTI-FORMAT) */}
              <div className="space-y-2 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-xs text-emerald-950 flex items-center space-x-1.5">
                    <FileUp className="w-4 h-4 text-emerald-700" />
                    <span>Upload Berkas Video / Word / PDF / Audio (Multi-Format)</span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                    Maks 25 MB
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                  Unggah berkas penunjang langsung dari perangkat: <strong>.mp4, .webm, .docx, .doc, .pdf, .mp3, .wav, .csv, .xlsx, .jpg, .png</strong>, dll.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.mp3,.wav,.m4a,.ogg,.aac,.mp4,.webm,.mov,.mkv,.m4v,.csv,.xlsx,.xls,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx,.pptx"
                  className="hidden"
                  onChange={handleFileUploadChange}
                />

                {fileUploadError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{fileUploadError}</span>
                  </div>
                )}

                {isReadingFile ? (
                  <div className="border-2 border-emerald-400 bg-white rounded-2xl p-4 space-y-2.5 animate-fade-in">
                    <div className="flex items-center justify-center space-x-2 text-emerald-800">
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
                      <span className="text-xs font-bold">
                        Sedang memuat berkas video / dokumen... ({fileReadProgress}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-200"
                        style={{ width: `${fileReadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : !uploadedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 rounded-2xl p-4 text-center cursor-pointer transition bg-white hover:bg-emerald-50/50 flex flex-col items-center justify-center space-y-1.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Klik untuk Memilih Video / MS Word / PDF / Audio
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Video (.mp4, .webm) • Word (.docx) • PDF (.pdf) • Audio (.mp3, .wav) • Gambar & Excel
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                        {uploadedFile.extension}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">{uploadedFile.name}</p>
                        <p className="text-[10px] text-emerald-700 font-semibold">
                          ✓ {uploadedFile.size} • Siap disimpan ke Cloud & Akun Siswa
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0 ml-2">
                      <button
                        type="button"
                        disabled={isSavingMaterial}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer disabled:opacity-40"
                      >
                        Ganti
                      </button>
                      <button
                        type="button"
                        disabled={isSavingMaterial}
                        onClick={() => {
                          setUploadedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer disabled:opacity-40"
                        title="Hapus berkas"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Link Video / Audio / Rujukan Online (Opsional)</label>
                <input
                  type="url"
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  placeholder="https://youtube.com/... atau https://..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
              </div>

              {/* LOADING PROGRESS BAR SAAT UPLOAD VIDEO & SIMPAN KE CLOUD */}
              {isSavingMaterial && (
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                    <span className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
                      <span>{saveProgressLabel || 'Mengunggah materi & video ke database...'}</span>
                    </span>
                    <span className="font-mono">{saveProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-200"
                      style={{ width: `${saveProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSavingMaterial}
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMaterialId(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-40"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingMaterial || isReadingFile}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-500 text-white font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer disabled:cursor-wait"
                >
                  {isSavingMaterial ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengunggah ({saveProgress}%)...</span>
                    </>
                  ) : editingMaterialId ? (
                    <>
                      <Edit3 className="w-4 h-4" />
                      <span>Simpan Perubahan Materi</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Simpan Materi ke Database</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
