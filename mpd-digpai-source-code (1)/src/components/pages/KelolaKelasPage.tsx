import React, { useState } from 'react';
import { SchoolClass, User } from '../../types';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Users,
  Check,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';

interface KelolaKelasPageProps {
  classes: SchoolClass[];
  activeClass: SchoolClass;
  students: User[];
  onSelectActiveClass: (cls: SchoolClass) => void;
  onAddClass: (newCls: SchoolClass) => void;
  onUpdateClass: (updatedCls: SchoolClass) => void;
  onDeleteClass: (classId: string) => void;
  onNavigateToStudents: () => void;
}

export const KelolaKelasPage: React.FC<KelolaKelasPageProps> = ({
  classes,
  activeClass,
  students,
  onSelectActiveClass,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onNavigateToStudents,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);

  const [classNameInput, setClassNameInput] = useState('');
  const [phaseInput, setPhaseInput] = useState('Fase E');
  const [academicYearInput, setAcademicYearInput] = useState('2025/2026');
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNameInput.trim()) return;

    if (editingClass) {
      const updated: SchoolClass = {
        ...editingClass,
        name: classNameInput.toUpperCase().trim(),
        phase: phaseInput,
        academicYear: academicYearInput,
      };
      onUpdateClass(updated);
      setFlashMessage(`Kelas ${updated.name} berhasil diperbarui!`);
      setEditingClass(null);
    } else {
      const newCls: SchoolClass = {
        id: `cls-${Date.now()}`,
        name: classNameInput.toUpperCase().trim(),
        phase: phaseInput,
        academicYear: academicYearInput,
        teacherName: 'Wandra Arasdi, M.Pd.',
      };
      onAddClass(newCls);
      setFlashMessage(`Kelas ${newCls.name} berhasil ditambahkan!`);
    }

    setShowAddModal(false);
    setClassNameInput('');
    setTimeout(() => setFlashMessage(null), 3000);
  };

  const handleStartEdit = (cls: SchoolClass) => {
    setEditingClass(cls);
    setClassNameInput(cls.name);
    setPhaseInput(cls.phase);
    setAcademicYearInput(cls.academicYear);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
              Manajemen Kelas Dinamis
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Kelola Rombongan Belajar & Kelas PAI
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tambah rombel baru, ubah fase/tingkat, pilih kelas aktif, dan filter data siswa secara dinamis.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingClass(null);
            setClassNameInput('');
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelas Baru</span>
        </button>
      </div>

      {/* FLASH MESSAGE */}
      {flashMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center space-x-2 text-xs font-semibold shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{flashMessage}</span>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT KELAS */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>{editingClass ? 'Edit Nama Kelas' : 'Tambah Kelas Baru'}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Kelas / Rombel</label>
                <input
                  type="text"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  placeholder="Contoh: KELAS X 1 atau KELAS X 2"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden uppercase"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Fase / Jenjang Kurikulum</label>
                <select
                  value={phaseInput}
                  onChange={(e) => setPhaseInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white outline-hidden"
                >
                  <option value="Fase E">Fase E (Kelas X SMA)</option>
                  <option value="Fase F">Fase F (Kelas XI SMA)</option>
                  <option value="Fase F+">Fase F (Kelas XII SMA)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tahun Ajaran</label>
                <input
                  type="text"
                  value={academicYearInput}
                  onChange={(e) => setAcademicYearInput(e.target.value)}
                  placeholder="2025/2026"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs outline-hidden"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 text-xs hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                >
                  {editingClass ? 'Simpan Perubahan' : 'Tambah Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRID DAFTAR KELAS DINAMIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const isActive = cls.id === activeClass.id;
          const classStudentsCount = students.filter(
            (s) => s.classId === cls.id || s.className === cls.name
          ).length;

          return (
            <div
              key={cls.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                isActive
                  ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400/20'
                  : 'bg-white border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {cls.phase}
                  </span>
                  {isActive && (
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Kelas Aktif Web</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-slate-900">{cls.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tahun Ajaran: {cls.academicYear} • Guru: Wandra Arasdi, M.Pd.
                </p>

                <div className="mt-3 flex items-center space-x-2 text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>
                    Terdaftar: <strong>{classStudentsCount} Peserta Didik</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectActiveClass(cls)}
                  disabled={isActive}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-900 cursor-default opacity-80'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  <span>{isActive ? 'Aktif Terpilih' : 'Pilih Sebagai Aktif'}</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleStartEdit(cls)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                    title="Edit Nama Kelas"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {classes.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Hapus kelas ${cls.name}?`)) {
                          onDeleteClass(cls.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                      title="Hapus Kelas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info card */}
      <div className="p-5 rounded-3xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>
            Kelas yang dipilih sebagai <strong>Aktif</strong> akan otomatis menjadi penanda teks di Beranda, Topbar, dan Laporan Rekap Nilai.
          </span>
        </div>
        <button
          onClick={onNavigateToStudents}
          className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1 shrink-0 ml-3"
        >
          <span>Buka Kelola Siswa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
