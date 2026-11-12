import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { User, LearningStyle, SchoolClass } from '../../types';
import {
  Users,
  KeyRound,
  RotateCcw,
  Printer,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Eye,
  Headphones,
  Footprints,
  PieChart as PieIcon,
  Search,
  X,
  Sparkles,
  Check,
  Database,
  Building2,
  FileSpreadsheet,
  Upload,
  Download,
  AlertCircle,
  Info,
  FileUp,
  FileText,
} from 'lucide-react';

interface ManajemenSiswaPageProps {
  students: User[];
  activeClass?: SchoolClass;
  allClasses?: SchoolClass[];
  onSelectClass?: (cls: SchoolClass) => void;
  onResetPassword: (studentId: string) => { studentName: string; username: string; newPass: string };
  onUpdateStudentLearningStyle: (studentId: string, style: LearningStyle) => void;
  onAddStudent: (newStudent: User) => void;
  onAddMultipleStudents?: (newStudents: User[]) => void;
  onDeleteStudent: (studentId: string) => void;
  onNavigateToPrintAccounts: () => void;
  onNavigateToPrintGrades: () => void;
  onNavigateToDatabaseBackup?: () => void;
}

export const ManajemenSiswaPage: React.FC<ManajemenSiswaPageProps> = ({
  students,
  activeClass,
  allClasses = [],
  onSelectClass,
  onResetPassword,
  onUpdateStudentLearningStyle,
  onAddStudent,
  onAddMultipleStudents,
  onDeleteStudent,
  onNavigateToPrintAccounts,
  onNavigateToPrintGrades,
  onNavigateToDatabaseBackup,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStyle, setFilterStyle] = useState<string>('all');
  const [resetModalData, setResetModalData] = useState<{
    studentName: string;
    username: string;
    newPass: string;
  } | null>(null);

  // Quick edit flash notice
  const [styleUpdateNotice, setStyleUpdateNotice] = useState<string | null>(null);

  // Form Tambah Siswa Modal (Satu Siswa)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'Laki-laki' | 'Perempuan'>('Perempuan');
  const [newStudentStyle, setNewStudentStyle] = useState<LearningStyle>('visual');
  const [selectedAddClassId, setSelectedAddClassId] = useState<string>(
    activeClass?.id || (allClasses[0]?.id) || 'cls-x3'
  );

  // Form Tambah Siswa Sekali Banyak (Import Excel)
  const [showImportModal, setShowImportModal] = useState(false);
  const [importClassId, setImportClassId] = useState<string>(
    activeClass?.id || (allClasses[0]?.id) || 'cls-x3'
  );
  const [previewStudents, setPreviewStudents] = useState<User[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pasteTextMode, setPasteTextMode] = useState(false);
  const [rawPasteText, setRawPasteText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selectedAddClassId and importClassId when activeClass changes
  useEffect(() => {
    if (activeClass?.id) {
      setSelectedAddClassId(activeClass.id);
      setImportClassId(activeClass.id);
    }
  }, [activeClass?.id]);

  // Filter students belonging strictly to the active class
  const classStudents = activeClass
    ? students.filter((s) => {
        if (s.classId) {
          return s.classId === activeClass.id;
        }
        if (s.className && activeClass.name) {
          return s.className.trim().toUpperCase() === activeClass.name.trim().toUpperCase();
        }
        return false;
      })
    : students;

  // Distribution calculations
  const totalStudents = classStudents.length;
  const visualCount = classStudents.filter((s) => s.learningStyle === 'visual').length;
  const auditoryCount = classStudents.filter((s) => s.learningStyle === 'auditory').length;
  const kinestheticCount = classStudents.filter((s) => s.learningStyle === 'kinesthetic').length;

  const visualPct = totalStudents ? Math.round((visualCount / totalStudents) * 100) : 0;
  const auditoryPct = totalStudents ? Math.round((auditoryCount / totalStudents) * 100) : 0;
  const kinestheticPct = totalStudents ? Math.round((kinestheticCount / totalStudents) * 100) : 0;

  // Donut chart SVG calculations (circumference = 2 * PI * r)
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.16
  const visualStroke = (visualPct / 100) * circumference;
  const auditoryStroke = (auditoryPct / 100) * circumference;
  const kinestheticStroke = (kinestheticPct / 100) * circumference;

  const handleResetClick = (student: User) => {
    const res = onResetPassword(student.id);
    setResetModalData(res);
  };

  const handleStyleChange = (studentId: string, studentName: string, newStyle: LearningStyle) => {
    onUpdateStudentLearningStyle(studentId, newStyle);
    setStyleUpdateNotice(`Gaya belajar untuk ${studentName} diperbarui ke "${newStyle.toUpperCase()}"`);
    setTimeout(() => setStyleUpdateNotice(null), 3000);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const parts = newStudentName.toLowerCase().trim().split(' ');
    const username = `${parts[0]}.${parts[1] || 'pai'}`;
    const initialPassword = `Siswa#${Math.floor(1000 + Math.random() * 9000)}`;

    const targetClass: SchoolClass | undefined =
      allClasses.find((c) => c.id === selectedAddClassId) ||
      activeClass ||
      (allClasses.length > 0 ? allClasses[0] : undefined);

    const newStudent: User = {
      id: `std-${Date.now()}`,
      name: newStudentName.toUpperCase(),
      username,
      email: `${username}@siswa.mpd-digpai.sch.id`,
      role: 'student',
      gender: newStudentGender,
      initialPassword,
      learningStyle: newStudentStyle,
      classId: targetClass ? targetClass.id : (activeClass ? activeClass.id : 'cls-x3'),
      className: targetClass ? targetClass.name : (activeClass ? activeClass.name : 'KELAS X 3'),
      nisn: `006819${Math.floor(1000 + Math.random() * 9000)}`,
    };

    onAddStudent(newStudent);
    setShowAddModal(false);
    setNewStudentName('');
  };

  // -------------------------------------------------------------
  // FUNGSI TEMPLATE & IMPORT EXCEL SISWA SEKALI BANYAK
  // -------------------------------------------------------------

  // 1. Download Template MS Excel (.xlsx) dengan kolom Gaya Belajar resmi sistem
  const handleDownloadTemplate = () => {
    try {
      const templateData = [
        {
          'No': 1,
          'Nama_Lengkap_Siswa': 'AHMAD FAUZAN',
          'Jenis_Kelamin': 'Laki-laki',
          'NISN': '0068192001',
          'Gaya_Belajar': 'Visual', // Pilihan Sistem: Visual / Auditori / Kinestetik
          'Username': 'ahmad.fauzan',
          'Password': 'Siswa#1234',
        },
        {
          'No': 2,
          'Nama_Lengkap_Siswa': 'AISYAH NURUL AINI',
          'Jenis_Kelamin': 'Perempuan',
          'NISN': '0068192002',
          'Gaya_Belajar': 'Auditori', // Pilihan Sistem: Visual / Auditori / Kinestetik
          'Username': 'aisyah.nurul',
          'Password': 'Siswa#2345',
        },
        {
          'No': 3,
          'Nama_Lengkap_Siswa': 'MUHAMMAD BILAL',
          'Jenis_Kelamin': 'Laki-laki',
          'NISN': '0068192003',
          'Gaya_Belajar': 'Kinestetik', // Pilihan Sistem: Visual / Auditori / Kinestetik
          'Username': 'muhammad.bilal',
          'Password': 'Siswa#3456',
        },
        {
          'No': 4,
          'Nama_Lengkap_Siswa': 'ZAHRA ANGGRAINI',
          'Jenis_Kelamin': 'Perempuan',
          'NISN': '0068192004',
          'Gaya_Belajar': 'Visual',
          'Username': 'zahra.anggra',
          'Password': 'Siswa#4567',
        },
        {
          'No': 5,
          'Nama_Lengkap_Siswa': 'FATHIR RIZKY PRATAMA',
          'Jenis_Kelamin': 'Laki-laki',
          'NISN': '0068192005',
          'Gaya_Belajar': 'Kinestetik',
          'Username': 'fathir.rizky',
          'Password': 'Siswa#5678',
        },
        {
          'No': 6,
          'Nama_Lengkap_Siswa': 'NAURA KHAIRUNNISA',
          'Jenis_Kelamin': 'Perempuan',
          'NISN': '0068192006',
          'Gaya_Belajar': 'Auditori',
          'Username': 'naura.khairun',
          'Password': 'Siswa#6789',
        },
      ];

      // Sheet 1: Template Siswa
      const ws = XLSX.utils.json_to_sheet(templateData);
      ws['!cols'] = [
        { wch: 6 },  // No
        { wch: 28 }, // Nama_Lengkap_Siswa
        { wch: 16 }, // Jenis_Kelamin
        { wch: 16 }, // NISN
        { wch: 22 }, // Gaya_Belajar
        { wch: 20 }, // Username
        { wch: 18 }, // Password
      ];

      // Sheet 2: Panduan Gaya Belajar Sistem MPD-DigPAI
      const guideData = [
        {
          'Pilihan_Gaya_Belajar': 'Visual',
          'Kategori_Representasi_Media': 'Poster & Infografis Digital, Gambar Mind Map, Slide Pembelajaran',
          'Petunjuk_Guru': 'Ketik "Visual" pada kolom Gaya_Belajar. Siswa akan diprioritaskan mengakses representasi visual.',
        },
        {
          'Pilihan_Gaya_Belajar': 'Auditori',
          'Kategori_Representasi_Media': 'Podcast Audio Kajian, Dialog Lisan Islami, Tilawah & Uraian Suara',
          'Petunjuk_Guru': 'Ketik "Auditori" pada kolom Gaya_Belajar. Siswa akan diprioritaskan mengakses podcast dan penjelasan verbal.',
        },
        {
          'Pilihan_Gaya_Belajar': 'Kinestetik',
          'Kategori_Representasi_Media': 'Studi Kasus Faktual, Checklist Mandiri, Simulasi Aksi, Proyek Karya',
          'Petunjuk_Guru': 'Ketik "Kinestetik" pada kolom Gaya_Belajar. Siswa akan diprioritaskan belajar berbasis aksi dan kasus.',
        },
        {
          'Pilihan_Gaya_Belajar': 'Kolom Lainnya',
          'Kategori_Representasi_Media': 'Nama, Jenis Kelamin, NISN, Username, Password',
          'Petunjuk_Guru': 'Username & Password opsional. Jika dikosongkan, sistem secara cerdas membuatkannya otomatis.',
        },
      ];
      const wsGuide = XLSX.utils.json_to_sheet(guideData);
      wsGuide['!cols'] = [{ wch: 22 }, { wch: 45 }, { wch: 65 }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Format_Siswa_MPD');
      XLSX.utils.book_append_sheet(wb, wsGuide, 'Panduan_Gaya_Belajar');

      XLSX.writeFile(wb, 'Template_Import_Siswa_MPD_DigPAI.xlsx');
    } catch (err) {
      console.error('Download template error:', err);
      // Fallback CSV download if XLSX writing is blocked
      downloadCsvFallback();
    }
  };

  const downloadCsvFallback = () => {
    const csvContent =
      'No,Nama_Lengkap_Siswa,Jenis_Kelamin,NISN,Gaya_Belajar,Username,Password\n' +
      '1,AHMAD FAUZAN,Laki-laki,0068192001,Visual,ahmad.fauzan,Siswa#1234\n' +
      '2,AISYAH NURUL AINI,Perempuan,0068192002,Auditori,aisyah.nurul,Siswa#2345\n' +
      '3,MUHAMMAD BILAL,Laki-laki,0068192003,Kinestetik,muhammad.bilal,Siswa#3456\n' +
      '4,ZAHRA ANGGRAINI,Perempuan,0068192004,Visual,zahra.anggra,Siswa#4567\n' +
      '5,FATHIR RIZKY PRATAMA,Laki-laki,0068192005,Kinestetik,fathir.rizky,Siswa#5678\n' +
      '6,NAURA KHAIRUNNISA,Perempuan,0068192006,Auditori,naura.khairun,Siswa#6789\n';

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Template_Import_Siswa_MPD_DigPAI.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 2. Parser baris objek menjadi User[]
  const parseRowsToStudents = (rows: any[]) => {
    const targetClass: SchoolClass | undefined =
      allClasses.find((c) => c.id === importClassId) ||
      activeClass ||
      (allClasses.length > 0 ? allClasses[0] : undefined);

    const targetClassId = targetClass?.id || activeClass?.id || 'cls-x3';
    const targetClassName = targetClass?.name || activeClass?.name || 'KELAS X 3';

    const parsed: User[] = [];

    rows.forEach((row: any, idx: number) => {
      // Temukan nama lengkap
      const rawName =
        row['Nama_Lengkap_Siswa'] ||
        row['Nama Lengkap Siswa'] ||
        row['Nama_Lengkap'] ||
        row['Nama Lengkap'] ||
        row['Nama'] ||
        row['NAMA'] ||
        row['nama'] ||
        row['Nama Siswa'];

      if (!rawName || typeof rawName !== 'string' || !rawName.trim()) {
        return; // Abaikan baris kosong
      }

      const cleanName = rawName.trim().toUpperCase();

      // Temukan gender
      const rawGender = `${
        row['Jenis_Kelamin'] ||
        row['Jenis Kelamin'] ||
        row['Gender'] ||
        row['JK'] ||
        ''
      }`.toLowerCase();
      const gender: 'Laki-laki' | 'Perempuan' =
        rawGender.includes('laki') || rawGender === 'l' ? 'Laki-laki' : 'Perempuan';

      // Temukan Gaya Belajar pilihan sistem (Visual / Auditori / Kinestetik)
      const rawStyle = `${
        row['Gaya_Belajar'] ||
        row['Gaya Belajar'] ||
        row['Gaya_belajar'] ||
        row['Gaya'] ||
        row['Style'] ||
        ''
      }`.toLowerCase();

      let learningStyle: LearningStyle = 'visual';
      if (rawStyle.includes('aud')) {
        learningStyle = 'auditory';
      } else if (rawStyle.includes('kin')) {
        learningStyle = 'kinesthetic';
      } else {
        learningStyle = 'visual';
      }

      // NISN
      const rawNisn =
        row['NISN'] ||
        row['nisn'] ||
        `006819${Math.floor(1000 + Math.random() * 9000)}`;

      // Username
      const parts = cleanName.toLowerCase().split(' ');
      const autoUsername = `${parts[0]}.${parts[1] || 'pai'}`;
      const username = `${row['Username'] || row['username'] || autoUsername}`
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '.');

      // Password
      const password = `${
        row['Password'] ||
        row['password'] ||
        `Siswa#${Math.floor(1000 + Math.random() * 9000)}`
      }`.trim();

      parsed.push({
        id: `std-xl-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
        name: cleanName,
        username,
        email: `${username}@siswa.mpd-digpai.sch.id`,
        role: 'student',
        gender,
        initialPassword: password,
        learningStyle,
        classId: targetClassId,
        className: targetClassName,
        nisn: String(rawNisn).trim(),
      });
    });

    return parsed;
  };

  // 3. Membaca Berkas Excel / CSV
  const handleFileProcess = (file: File) => {
    setImportError(null);
    setImportSuccessMsg(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!json || json.length === 0) {
          setImportError('File Excel/CSV tidak memuat baris data atau lembar kerja kosong.');
          setPreviewStudents([]);
          return;
        }

        const parsed = parseRowsToStudents(json);
        if (parsed.length === 0) {
          setImportError(
            'Tidak ditemukan baris data siswa yang valid pada kolom Nama_Lengkap_Siswa. Silakan gunakan format template resmi yang disediakan.'
          );
          setPreviewStudents([]);
        } else {
          setPreviewStudents(parsed);
        }
      } catch (err: any) {
        console.error('File parsing error:', err);
        setImportError(
          'Gagal membaca berkas Excel. Pastikan file berformat .xlsx, .xls, atau .csv yang valid dan tidak terkunci sandi.'
        );
      }
    };

    reader.onerror = () => {
      setImportError('Gagal membuka file dari perangkat Anda.');
    };

    reader.readAsArrayBuffer(file);
  };

  // 4. Membaca Teks Paste Langsung dari Excel / Spreadsheet
  const handleParsePastedText = () => {
    if (!rawPasteText.trim()) {
      setImportError('Silakan tempel (paste) data dari Excel atau Google Sheets terlebih dahulu.');
      return;
    }

    try {
      // Split baris
      const lines = rawPasteText.trim().split('\n');
      if (lines.length === 0) {
        setImportError('Teks yang ditempel kosong.');
        return;
      }

      // Deteksi separator (tab untuk copy-paste Excel, atau koma/titik koma untuk CSV)
      const firstLine = lines[0];
      const sep = firstLine.includes('\t') ? '\t' : firstLine.includes(';') ? ';' : ',';

      // Parse headers or infer
      const headers = firstLine.split(sep).map((h) => h.trim().replace(/^"|"$/g, ''));
      const rows: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(sep).map((c) => c.trim().replace(/^"|"$/g, ''));
        const obj: any = {};
        headers.forEach((h, idx) => {
          obj[h] = cols[idx] || '';
        });
        rows.push(obj);
      }

      const parsed = parseRowsToStudents(rows);
      if (parsed.length === 0) {
        setImportError('Tidak dapat mengenali format data siswa. Pastikan baris pertama memuat judul kolom seperti Nama_Lengkap_Siswa.');
      } else {
        setPreviewStudents(parsed);
        setImportError(null);
      }
    } catch (err) {
      setImportError('Format teks paste tidak sesuai tabel spreadsheet.');
    }
  };

  // 5. Simpan Siswa Banyak ke Database
  const handleSaveBulkStudents = () => {
    if (previewStudents.length === 0) return;

    const targetClass =
      allClasses.find((c) => c.id === importClassId) ||
      activeClass ||
      (allClasses.length > 0 ? allClasses[0] : undefined);

    const targetClassName = targetClass ? targetClass.name : 'Kelas';

    if (onAddMultipleStudents) {
      onAddMultipleStudents(previewStudents);
    } else {
      previewStudents.forEach((s) => onAddStudent(s));
    }

    setImportSuccessMsg(
      `Alhamdulillah! ${previewStudents.length} siswa berhasil didaftarkan dan disimpan ke database untuk ${targetClassName}.`
    );

    setTimeout(() => {
      setShowImportModal(false);
      setPreviewStudents([]);
      setImportSuccessMsg(null);
      setRawPasteText('');
    }, 2000);
  };

  const filteredStudents = classStudents.filter((s) => {
    const matchName =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nisn && s.nisn.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStyle = filterStyle === 'all' || s.learningStyle === filterStyle;
    return matchName && matchStyle;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* FLASH MODAL RESET PASSWORD */}
      {resetModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 space-y-5 animate-scale-up">
            <div className="flex items-center space-x-3 text-emerald-600">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Notifikasi Reset Kredensial
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-0.5">
                  Password Berhasil Direset!
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Password siswa telah diperbarui di sistem. Berikan kredensial baru berikut kepada peserta didik yang bersangkutan:
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Nama Siswa:</span>
                <strong className="text-slate-900">{resetModalData.studentName}</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Username:</span>
                <strong className="font-mono text-emerald-800">{resetModalData.username}</strong>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
                <span className="text-emerald-800 font-semibold text-xs">Password Baru:</span>
                <strong className="font-mono text-base text-emerald-950 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl">
                  {resetModalData.newPass}
                </strong>
              </div>
            </div>

            <button
              onClick={() => setResetModalData(null)}
              className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
            >
              Tutup & Salin Kredensial
            </button>
          </div>
        </div>
      )}

      {/* QUICK STYLE UPDATE NOTICE */}
      {styleUpdateNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center space-x-2 text-xs font-semibold shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{styleUpdateNotice}</span>
        </div>
      )}

      {/* MODAL TAMBAH SISWA (SATU-SATU) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Tambah Siswa ({activeClass ? activeClass.name : 'Kelas'})</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SHORTCUT MENU IMPORT EXCEL SEKALI BANYAK */}
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-teal-950 font-semibold">
                <FileSpreadsheet className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="leading-tight">Tambah banyak siswa sekaligus?</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowImportModal(true);
                  setPreviewStudents([]);
                  setImportError(null);
                  setImportSuccessMsg(null);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-[11px] shadow-xs transition shrink-0 cursor-pointer"
              >
                Import via Excel
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Contoh: AHMAD FAUZAN"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden uppercase"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Jenis Kelamin</label>
                <select
                  value={newStudentGender}
                  onChange={(e) => setNewStudentGender(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white outline-hidden"
                >
                  <option value="Perempuan">Perempuan</option>
                  <option value="Laki-laki">Laki-laki</option>
                </select>
              </div>

              {/* Opsi Pilih Kelas Tepat Diatas Gaya Belajar Awal */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pilih Kelas / Rombel Siswa</span>
                </label>
                <select
                  value={selectedAddClassId}
                  onChange={(e) => setSelectedAddClassId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden font-bold text-slate-800 cursor-pointer"
                >
                  {(allClasses && allClasses.length > 0
                    ? allClasses
                    : activeClass
                    ? [activeClass]
                    : []
                  ).map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.phase})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">
                  Siswa baru akan otomatis terdaftar dan dikelompokkan ke dalam kelas yang dipilih ini.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Gaya Belajar Awal</label>
                <select
                  value={newStudentStyle}
                  onChange={(e) => setNewStudentStyle(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white outline-hidden"
                >
                  <option value="visual">Visual (Poster & Infografis)</option>
                  <option value="auditory">Auditori (Podcast & Dialog Lisan)</option>
                  <option value="kinesthetic">Kinestetik (Uji Fakta & Simulasi Aksi)</option>
                </select>
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
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL IMPORT SISWA SEKALI BANYAK (MS. EXCEL) */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-800 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Tambah Siswa Sekali Banyak (MS. Excel)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Daftarkan puluhan siswa sekaligus menggunakan format template spreadsheet.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setPreviewStudents([]);
                  setImportError(null);
                  setImportSuccessMsg(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Flash Message Sukses */}
            {importSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center space-x-2.5 animate-fade-in shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{importSuccessMsg}</span>
              </div>
            )}

            {/* Flash Message Error */}
            {importError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center space-x-2.5 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {/* LANGKAH 1: DOWNLOAD TEMPLATE RESMI & PANDUAN GAYA BELAJAR */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-200/80 px-2 py-0.5 rounded">
                    Langkah 1
                  </span>
                  <h4 className="font-extrabold text-xs text-teal-950">
                    Unduh Template Resmi Format MS. Excel
                  </h4>
                  <p className="text-[11px] text-teal-900/80 leading-relaxed">
                    Template ini sudah dilengkapi header baku, rumus, dan kolom <strong>Gaya_Belajar</strong> pilihan sistem.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition shrink-0 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-teal-200" />
                  <span>Download Template MS. Excel</span>
                  <Download className="w-3.5 h-3.5 text-teal-200" />
                </button>
              </div>

              {/* DAFTAR PILIHAN GAYA BELAJAR YANG DISEDIAKAN SISTEM */}
              <div className="bg-white/90 p-3 rounded-xl border border-teal-200 space-y-1.5 text-[11px]">
                <strong className="text-teal-950 flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-700" />
                  <span>Kolom Pilihan Gaya Belajar yang Disediakan Sistem:</span>
                </strong>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="font-bold text-emerald-900 block">1. Visual</span>
                    <span className="text-[10px] text-emerald-700 leading-tight block">
                      Poster, infografis, mind map & slide materi.
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                    <span className="font-bold text-blue-900 block">2. Auditori</span>
                    <span className="text-[10px] text-blue-700 leading-tight block">
                      Kajian podcast audio, tilawah & dialog lisan.
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="font-bold text-amber-900 block">3. Kinestetik</span>
                    <span className="text-[10px] text-amber-700 leading-tight block">
                      Studi kasus nyata, simulasi aksi & proyek.
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 italic mt-1">
                  *Isikan salah satu kata: <strong>Visual</strong>, <strong>Auditori</strong>, atau <strong>Kinestetik</strong> pada kolom <em>Gaya_Belajar</em> di file Excel.
                </p>
              </div>
            </div>

            {/* LANGKAH 2: PILIH KELAS TARGET */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                  Langkah 2
                </span>
                <span>Pilih Kelas / Rombel Target untuk Siswa yang Diimpor</span>
              </label>
              <select
                value={importClassId}
                onChange={(e) => {
                  setImportClassId(e.target.value);
                  // Update class info in preview if already parsed
                  if (previewStudents.length > 0) {
                    const selCls = allClasses.find((c) => c.id === e.target.value);
                    if (selCls) {
                      setPreviewStudents((prev) =>
                        prev.map((s) => ({
                          ...s,
                          classId: selCls.id,
                          className: selCls.name,
                        }))
                      );
                    }
                  }
                }}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden font-bold text-slate-800 cursor-pointer"
              >
                {(allClasses && allClasses.length > 0
                  ? allClasses
                  : activeClass
                  ? [activeClass]
                  : []
                ).map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.phase}) — TA {cls.academicYear}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500">
                Semua siswa di dalam berkas Excel akan otomatis didaftarkan dan dikaitkan ke rombel kelas ini.
              </p>
            </div>

            {/* LANGKAH 3: UNGGAH BERKAS EXCEL ATAU PASTE TEXT */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                    Langkah 3
                  </span>
                  <span>Unggah Berkas Template MS. Excel (.xlsx / .xls / .csv)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setPasteTextMode(!pasteTextMode)}
                  className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline cursor-pointer"
                >
                  {pasteTextMode ? 'Mode Upload Berkas' : 'Mode Paste Teks Spreadsheet'}
                </button>
              </div>

              {!pasteTextMode ? (
                /* DROPZONE INPUT FILE EXCEL */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileProcess(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2.5 ${
                    isDragging
                      ? 'border-teal-600 bg-teal-50/70 scale-101'
                      : 'border-slate-300 hover:border-teal-500 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileProcess(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Klik di sini atau Tarik & Lepaskan Berkas Excel
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Mendukung berkas Microsoft Excel (.xlsx, .xls) dan CSV (.csv)
                    </p>
                  </div>
                </div>
              ) : (
                /* MODE PASTE TEKS LANGSUNG DARI EXCEL */
                <div className="space-y-2">
                  <textarea
                    rows={4}
                    value={rawPasteText}
                    onChange={(e) => setRawPasteText(e.target.value)}
                    placeholder="Salin (Copy) tabel dari Excel termasuk baris judul kolom, lalu tempel (Paste) di kotak ini..."
                    className="w-full p-3 rounded-2xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-hidden bg-slate-50"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleParsePastedText}
                      className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs"
                    >
                      Proses Teks Paste
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PREVIEW HASIL PARSING & KONFIRMASI SIMPAN */}
            {previewStudents.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-3 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-200">
                  <div className="flex items-center space-x-2 text-emerald-950">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-xs">
                        {previewStudents.length} Siswa Terdeteksi & Siap Didaftarkan
                      </h4>
                      <p className="text-[11px] text-emerald-800">
                        Target Kelas:{' '}
                        <strong>
                          {allClasses.find((c) => c.id === importClassId)?.name || 'Kelas Aktif'}
                        </strong>
                      </p>
                    </div>
                  </div>

                  {/* DISTRIBUSI GAYA BELAJAR DI PREVIEW */}
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                      Visual: {previewStudents.filter((s) => s.learningStyle === 'visual').length}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-900">
                      Auditori: {previewStudents.filter((s) => s.learningStyle === 'auditory').length}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      Kinestetik: {previewStudents.filter((s) => s.learningStyle === 'kinesthetic').length}
                    </span>
                  </div>
                </div>

                {/* TABEL PREVIEW DATA */}
                <div className="overflow-x-auto rounded-xl border border-emerald-200 max-h-48 overflow-y-auto bg-white">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-semibold sticky top-0">
                        <th className="p-2 w-8 text-center">No</th>
                        <th className="p-2">Nama Lengkap</th>
                        <th className="p-2">Gender</th>
                        <th className="p-2">Gaya Belajar</th>
                        <th className="p-2">Username</th>
                        <th className="p-2">Password</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {previewStudents.map((s, idx) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-2 text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td className="p-2 font-bold">{s.name}</td>
                          <td className="p-2 text-slate-600">{s.gender}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                s.learningStyle === 'visual'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : s.learningStyle === 'auditory'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {s.learningStyle.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-2 font-mono text-emerald-800">{s.username}</td>
                          <td className="p-2 font-mono text-slate-700">{s.initialPassword}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* TOMBOL SIMPAN MASSAL */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setPreviewStudents([])}
                    className="px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                  >
                    Batal & Pilih Berkas Lain
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBulkStudents}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center space-x-2 shadow-md transition cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan & Daftarkan {previewStudents.length} Siswa Sekaligus</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HEADER UTAMA & TOMBOL CETAK */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
              Panel Guru & Admin • {activeClass ? `${activeClass.name} (${activeClass.phase})` : 'Data Siswa'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Manajemen {classStudents.length} Siswa & Kredensial • {activeClass ? activeClass.name : 'Kelas Aktif'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data siswa, edit profil gaya belajar langsung, reset password, dan cetak dokumen resmi.
          </p>
        </div>

        {/* 2 ACTION BUTTONS CETAK RESMI */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNavigateToPrintAccounts}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Cetak Akun Siswa</span>
          </button>

          <button
            onClick={onNavigateToPrintGrades}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-emerald-200" />
            <span>Cetak Rekap Nilai</span>
          </button>

          {onNavigateToDatabaseBackup && (
            <button
              onClick={onNavigateToDatabaseBackup}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition"
              title="Unduh Database MySQL & JSON"
            >
              <Database className="w-4 h-4 text-amber-200" />
              <span>Unduh Database .SQL</span>
            </button>
          )}
        </div>
      </div>

      {/* BAR PILIH KELAS AKTIF (Sinkron dengan Tombol Header & Seluruh Aplikasi) */}
      {allClasses && allClasses.length > 0 && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">
                Pilih Kelas yang Ingin Ditampilkan:
              </p>
              <p className="text-[11px] text-slate-500">
                Data siswa dan rekap di bawah otomatis hanya menampilkan murid yang terdaftar di kelas aktif terpilih.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {allClasses.map((cls) => {
              const isSelected = activeClass?.id === cls.id;
              const countInClass = students.filter((s) => {
                if (s.classId) return s.classId === cls.id;
                if (s.className && cls.name) return s.className.trim().toUpperCase() === cls.name.trim().toUpperCase();
                return false;
              }).length;

              return (
                <button
                  key={cls.id}
                  onClick={() => onSelectClass && onSelectClass(cls)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-500/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                  title={`Klik untuk menampilkan hanya siswa ${cls.name}`}
                >
                  <span>{cls.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      isSelected
                        ? 'bg-emerald-900 text-emerald-200'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {countInClass} siswa
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STAT CARDS & DIAGRAM DONUT VISUAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Counter Stat Cards (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Total Siswa */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Siswa
              </span>
              <p className="text-3xl font-black text-slate-900 mt-1">{totalStudents}</p>
            </div>
            <div className="pt-2 text-[11px] text-slate-500 font-medium">
              KELAS X 3 • Fase E
            </div>
          </div>

          {/* Visual Stat */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Visual
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded-full">
                  {visualPct}%
                </span>
              </div>
              <p className="text-3xl font-black text-emerald-950 mt-1">{visualCount}</p>
            </div>
            <div className="pt-2 flex items-center space-x-1 text-[11px] text-emerald-700">
              <Eye className="w-3 h-3" />
              <span>Poster & Infografis</span>
            </div>
          </div>

          {/* Auditori Stat */}
          <div className="bg-white p-5 rounded-3xl border border-blue-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                  Auditori
                </span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded-full">
                  {auditoryPct}%
                </span>
              </div>
              <p className="text-3xl font-black text-blue-950 mt-1">{auditoryCount}</p>
            </div>
            <div className="pt-2 flex items-center space-x-1 text-[11px] text-blue-700">
              <Headphones className="w-3 h-3" />
              <span>Podcast & Narasi</span>
            </div>
          </div>

          {/* Kinestetik Stat */}
          <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  Kinestetik
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full">
                  {kinestheticPct}%
                </span>
              </div>
              <p className="text-3xl font-black text-amber-950 mt-1">{kinestheticCount}</p>
            </div>
            <div className="pt-2 flex items-center space-x-1 text-[11px] text-amber-700">
              <Footprints className="w-3 h-3" />
              <span>Uji Fakta & Aksi</span>
            </div>
          </div>
        </div>

        {/* DONUT CHART VISUAL (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            {/* SVG Donut Chart */}
            <svg className="w-28 h-28 -rotate-90 transform" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="text-slate-100"
                strokeWidth="16"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Visual Segment (Emerald) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#10b981"
                strokeWidth="16"
                strokeDasharray={`${visualStroke} ${circumference}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                fill="transparent"
              />
              {/* Auditory Segment (Blue) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#3b82f6"
                strokeWidth="16"
                strokeDasharray={`${auditoryStroke} ${circumference}`}
                strokeDashoffset={`-${visualStroke}`}
                strokeLinecap="round"
                fill="transparent"
              />
              {/* Kinesthetic Segment (Amber) */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#f59e0b"
                strokeWidth="16"
                strokeDasharray={`${kinestheticStroke} ${circumference}`}
                strokeDashoffset={`-${visualStroke + auditoryStroke}`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-base font-black text-slate-900 leading-none block">
                {totalStudents}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">Siswa</span>
            </div>
          </div>

          <div className="flex-1 space-y-1.5 text-[11px]">
            <p className="font-bold text-slate-900 text-xs mb-1">Distribusi Gaya Belajar</p>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Visual</span>
              </span>
              <strong className="text-emerald-800">{visualPct}%</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Auditori</span>
              </span>
              <strong className="text-blue-800">{auditoryPct}%</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Kinestetik</span>
              </span>
              <strong className="text-amber-800">{kinestheticPct}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* TABEL MANAJEMEN SISWA & KREDENSIAL */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Daftar Siswa {activeClass ? activeClass.name : 'Kelas Aktif'} ({classStudents.length} Peserta Didik)
            </h3>
            <p className="text-xs text-slate-400">
              Ubah gaya belajar siswa langsung di tabel & reset password dengan modal transparan
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-hidden focus:border-emerald-500 w-44"
              />
            </div>

            {/* TOMBOL IMPORT EXCEL SEKALI BANYAK */}
            <button
              onClick={() => {
                setShowImportModal(true);
                setPreviewStudents([]);
                setImportError(null);
                setImportSuccessMsg(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition cursor-pointer"
              title="Tambah siswa sekali banyak menggunakan berkas template MS. Excel (.xlsx / .csv)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-teal-200" />
              <span>Import Excel</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Siswa</span>
            </button>
          </div>
        </div>

        {/* Tabel Data Siswa dengan Quick Edit Gaya Belajar */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="p-3.5 w-10 text-center">No</th>
                <th className="p-3.5">Nama Peserta Didik</th>
                <th className="p-3.5">Gender</th>
                <th className="p-3.5">Username</th>
                <th className="p-3.5">Password Tercatat</th>
                <th className="p-3.5">Edit Gaya Belajar Siswa</th>
                <th className="p-3.5 text-center">Aksi Reset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 text-center text-slate-400 font-mono">{idx + 1}</td>
                  <td className="p-3.5 font-bold text-slate-900">{s.name}</td>
                  <td className="p-3.5 text-slate-600">{s.gender}</td>
                  <td className="p-3.5 font-mono text-emerald-800 font-semibold">{s.username}</td>
                  <td className="p-3.5">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-bold border border-slate-200">
                      {s.initialPassword}
                    </span>
                  </td>
                  {/* QUICK EDIT GAYA BELAJAR SISWA */}
                  <td className="p-3.5">
                    <select
                      value={s.learningStyle}
                      onChange={(e) =>
                        handleStyleChange(s.id, s.name, e.target.value as LearningStyle)
                      }
                      className={`text-xs font-bold py-1 px-2 rounded-xl border outline-hidden transition cursor-pointer ${
                        s.learningStyle === 'visual'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : s.learningStyle === 'auditory'
                          ? 'bg-blue-50 text-blue-900 border-blue-300'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}
                      title="Klik untuk mengubah gaya belajar siswa secara langsung"
                    >
                      <option value="visual">🎨 Visual (Poster & Slide)</option>
                      <option value="auditory">🎧 Auditori (Podcast & Lisan)</option>
                      <option value="kinesthetic">🏃 Kinestetik (Uji Fakta & Aksi)</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleResetClick(s)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-[11px] flex items-center space-x-1 mx-auto transition"
                      title="Reset kata sandi siswa ini"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Password</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-500 bg-slate-50/50">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-800 text-sm">
                        {searchQuery
                          ? 'Tidak ada peserta didik yang sesuai pencarian'
                          : `Belum ada peserta didik di ${activeClass ? activeClass.name : 'kelas ini'}`}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {searchQuery
                          ? 'Silakan periksa kembali ejaan nama atau kata kunci filter Anda.'
                          : `Kelas ini dalam keadaan kosong (0 siswa). Anda dapat menambahkan siswa satu per satu atau mengimpor sekaligus banyak melalui template MS. Excel.`}
                      </p>
                      {!searchQuery && (
                        <div className="flex items-center justify-center space-x-2 pt-2">
                          <button
                            onClick={() => {
                              setShowImportModal(true);
                              setPreviewStudents([]);
                              setImportError(null);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition"
                          >
                            <FileSpreadsheet className="w-4 h-4 text-teal-200" />
                            <span>Import via MS. Excel</span>
                          </button>
                          <button
                            onClick={() => setShowAddModal(true)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Siswa Manual</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
