import React, { useState } from 'react';
import {
  Database,
  Download,
  Copy,
  Check,
  FileSpreadsheet,
  FileCode,
  FileJson,
  Server,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { User, StudentProgress, SchoolClass } from '../../types';

interface DatabaseExportPageProps {
  students: User[];
  progressList: StudentProgress[];
  activeClass: SchoolClass;
  currentUser: User;
}

export const DatabaseExportPage: React.FC<DatabaseExportPageProps> = ({
  students,
  progressList,
  activeClass,
  currentUser,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'downloads' | 'sql_preview' | 'guide'>('downloads');
  const [sqlSearch, setSqlSearch] = useState('');

  // Generate CSV for Students' Accounts
  const handleDownloadAccountsCsv = () => {
    const headers = ['No', 'ID', 'Nama Lengkap', 'NISN', 'Kelas', 'Gaya Belajar', 'Username', 'Password Awal', 'Email'];
    const rows = students.map((s, idx) => [
      idx + 1,
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      s.nisn || '-',
      s.className || activeClass.name,
      s.learningStyle,
      s.username,
      s.initialPassword,
      s.email,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadBlob(csvContent, `daftar_akun_${activeClass.name.toLowerCase().replace(/\s+/g, '_')}.csv`, 'text/csv;charset=utf-8;');
  };

  // Generate CSV for Student Grades & Progress
  const handleDownloadGradesCsv = () => {
    const headers = [
      'No',
      'ID Siswa',
      'Nama Siswa',
      'Kelas',
      'Nilai Diagnostik (15%)',
      'Nilai Formatif (25%)',
      'Nilai Tugas/Produk (30%)',
      'Nilai Sumatif (30%)',
      'Nilai Akhir (NA)',
      'Predikat',
      'Keaktifan (%)',
      'Status Ketuntasan',
    ];

    const rows = progressList.map((p, idx) => [
      idx + 1,
      p.studentId,
      `"${p.studentName.replace(/"/g, '""')}"`,
      activeClass.name,
      p.diagnostikScore,
      p.formatifScore,
      p.tugasScore,
      p.sumatifScore,
      p.finalScore,
      p.grade,
      `${p.engagementPercent}%`,
      p.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadBlob(csvContent, `rekap_nilai_${activeClass.name.toLowerCase().replace(/\s+/g, '_')}.csv`, 'text/csv;charset=utf-8;');
  };

  // Direct download for public/mpd_digpai_database.sql
  const handleDownloadSqlFile = () => {
    const link = document.createElement('a');
    link.href = '/mpd_digpai_database.sql';
    link.download = 'mpd_digpai_database.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Direct download for public/mpd_digpai_data.json
  const handleDownloadJsonFile = () => {
    const link = document.createElement('a');
    link.href = '/mpd_digpai_data.json';
    link.download = 'mpd_digpai_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Direct download for full project source code ZIP
  const handleDownloadSourceCodeZip = () => {
    const link = document.createElement('a');
    link.href = '/mpd-digpai-source-code.zip';
    link.download = 'mpd-digpai-source-code.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper download blob
  const downloadBlob = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sampleSqlSnippet = `-- =====================================================================
-- MPD-DigPAI (Media Pembelajaran Digital Pendidikan Agama Islam)
-- Database Dump for MySQL / MariaDB / phpMyAdmin
-- Compatible with: InfinityFree, cPanel, Rumahweb, XAMPP, Laragon
-- Total: 4 Kelas, 1 Guru Pengampu, 36 Siswa, 9 Media Berdiferensiasi
-- =====================================================================

CREATE TABLE IF NOT EXISTS \`school_classes\` (
  \`id\` varchar(32) NOT NULL,
  \`name\` varchar(100) NOT NULL,
  \`phase\` varchar(50) NOT NULL DEFAULT 'Fase E',
  \`academic_year\` varchar(50) NOT NULL DEFAULT '2025/2026',
  \`teacher_name\` varchar(150) NOT NULL DEFAULT 'Wandra Arasdi, M.Pd.',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` varchar(64) NOT NULL,
  \`class_id\` varchar(32) DEFAULT NULL,
  \`name\` varchar(150) NOT NULL,
  \`username\` varchar(100) NOT NULL,
  \`email\` varchar(150) NOT NULL,
  \`role\` enum('teacher','student') NOT NULL DEFAULT 'student',
  \`gender\` enum('Laki-laki','Perempuan') NOT NULL DEFAULT 'Perempuan',
  \`initial_password\` varchar(100) NOT NULL,
  \`learning_style\` enum('visual','auditory','kinesthetic') NOT NULL DEFAULT 'visual',
  \`nisn\` varchar(50) DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`users_username_unique\` (\`username\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS \`student_progress\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`student_id\` varchar(64) NOT NULL,
  \`student_name\` varchar(150) NOT NULL,
  \`diagnostik_score\` int(11) NOT NULL DEFAULT 80,
  \`formatif_score\` int(11) NOT NULL DEFAULT 82,
  \`tugas_score\` int(11) NOT NULL DEFAULT 85,
  \`sumatif_score\` int(11) NOT NULL DEFAULT 84,
  \`final_score\` int(11) NOT NULL DEFAULT 83,
  \`grade\` enum('A','B+','B','C+','C') NOT NULL DEFAULT 'B',
  \`status\` enum('Tuntas','Perlu Bimbingan') NOT NULL DEFAULT 'Tuntas',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sampleSqlSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-emerald-700/50">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 border border-emerald-400/30">
              <Database className="w-3.5 h-3.5 text-emerald-300" />
              <span>Pusat Unduh Database & Data Cadangan (Backup)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Database MPD-DigPAI Siap Download
            </h1>
            <p className="text-sm text-emerald-100/90 max-w-2xl">
              Aplikasi ini menyediakan berkas database lengkap berformat <strong>.SQL</strong> (kompatibel phpMyAdmin, InfinityFree, cPanel, XAMPP), berkas <strong>.JSON</strong>, serta lembar nilai dan akun <strong>.CSV</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadSourceCodeZip}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-bold text-sm shadow-md hover:from-emerald-300 hover:to-teal-200 transition flex items-center justify-center space-x-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Source Code (.ZIP)</span>
            </button>
            <button
              onClick={handleDownloadSqlFile}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-sm shadow-md hover:from-amber-300 hover:to-amber-400 transition flex items-center justify-center space-x-2 shrink-0"
            >
              <Database className="w-4 h-4" />
              <span>Download .SQL Database</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-2 mt-6 pt-4 border-t border-emerald-800/80">
          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'downloads'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Pilihan File Download & Source Code</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'guide'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Panduan Import phpMyAdmin / InfinityFree</span>
          </button>
          <button
            onClick={() => setActiveTab('sql_preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'sql_preview'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Pratinjau Kode SQL</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DOWNLOAD CARDS */}
      {activeTab === 'downloads' && (
        <div className="space-y-6">
          {/* Featured Card: Source Code ZIP Proyek */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white border-2 border-indigo-500/30 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 border border-indigo-400/30">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Paket Source Code Lengkap (Siap Upload GitHub & Vercel)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Download Berkas Proyek MPD-DigPAI (.ZIP)
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Berisi seluruh kode sumber aplikasi lengkap (folder <code>src/</code>, <code>public/</code>, <code>index.html</code>, <code>package.json</code>, dan <code>vercel.json</code>). Anda tinggal ekstrak atau langsung upload file-file di dalamnya ke GitHub untuk dideploy ke Vercel.
              </p>
            </div>

            <button
              onClick={handleDownloadSourceCodeZip}
              className="px-6 py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download mpd-digpai-source-code.zip</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: MySQL .SQL File */}
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/20 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Format .SQL (Utama)
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Database MySQL / MariaDB Dump (.SQL)
              </h2>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Berkas skrip SQL siap import di <strong>phpMyAdmin InfinityFree</strong>, cPanel Rumahweb, atau localhost XAMPP. Berisi struktur tabel dan data seeder: 4 kelas, akun guru Wandra Arasdi, dan 36 siswa lengkap.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Nama File: <code className="text-emerald-700 font-mono">mpd_digpai_database.sql</code></span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Encoding: <span className="font-semibold">utf8mb4 (Unicode Universal)</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kompatibilitas: MySQL 5.7+, MySQL 8.0+, MariaDB 10+</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadSqlFile}
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download File mpd_digpai_database.sql</span>
            </button>
          </div>

          {/* Card 2: JSON Dataset */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-500/20 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FileJson className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                  Format .JSON
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Dataset Struktur & Schema (.JSON)
              </h2>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Cadangan data dalam format JSON standar. Cocok untuk integrasi API backend Node.js, Python, Laravel REST API, atau NoSQL database.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Nama File: <code className="text-amber-700 font-mono">mpd_digpai_data.json</code></span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Struktur: Hierarki Array Objek Siswa, Kelas & Guru</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Mudah diparse dengan JavaScript / PHP / Python</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadJsonFile}
              className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download File mpd_digpai_data.json</span>
            </button>
          </div>

          {/* Card 3: Rekap Nilai Siswa CSV */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-teal-100 text-teal-800">
                  Excel / CSV
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Rekap Nilai Siswa ({activeClass.name})
              </h2>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Ekspor nilai diagnostik (15%), formatif (25%), tugas portofolio (30%), sumatif (30%), nilai akhir, predikat, dan ketuntasan 36 siswa.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Buka langsung di Microsoft Excel, Google Sheets, atau LibreOffice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Data real-time sesuai perubahan nilai terbaru di sistem</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadGradesCsv}
              className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Rekap Nilai (.CSV)</span>
            </button>
          </div>

          {/* Card 4: Daftar Akun & Password Siswa CSV */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Server className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
                  Excel / CSV
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Daftar Akun & Password Siswa ({activeClass.name})
              </h2>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Ekspor daftar 36 siswa lengkap dengan username, password awal, NISN, dan gaya belajar untuk didistribusikan kepada peserta didik.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Data sensitif akun siswa untuk guru pengampu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Termasuk password acak aman format <code className="text-indigo-600 font-mono">Siswa#XXXX</code></span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadAccountsCsv}
              className="w-full py-3 px-4 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Daftar Akun (.CSV)</span>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* TAB 2: PANDUAN IMPORT PHPMYADMIN / INFINITYFREE */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 text-emerald-800">
              <Server className="w-6 h-6" />
              <h2 className="text-xl font-extrabold text-slate-900">
                Langkah Cepat Import Database ke phpMyAdmin (InfinityFree / cPanel)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50/60 border border-emerald-200/80 p-5 rounded-2xl space-y-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="font-bold text-sm text-emerald-950">Unduh Berkas .SQL</h3>
                <p className="text-xs text-slate-600">
                  Klik tombol <strong>Download File mpd_digpai_database.sql</strong> di tab sebelumnya. Simpan di komputer Anda.
                </p>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200/80 p-5 rounded-2xl space-y-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  2
                </div>
                <h3 className="font-bold text-sm text-emerald-950">Buka phpMyAdmin Hosting</h3>
                <p className="text-xs text-slate-600">
                  Masuk ke control panel InfinityFree atau cPanel Rumahweb, cari menu <strong>MySQL Databases</strong> lalu klik <strong>phpMyAdmin</strong>.
                </p>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200/80 p-5 rounded-2xl space-y-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  3
                </div>
                <h3 className="font-bold text-sm text-emerald-950">Klik Import & Kirim</h3>
                <p className="text-xs text-slate-600">
                  Pilih database Anda, klik tab <strong>Import</strong> di bagian atas, pilih file <code className="text-emerald-700">mpd_digpai_database.sql</code>, lalu klik tombol <strong>Go / Kirim</strong>.
                </p>
              </div>
            </div>

            {/* Note box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-3">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Tips untuk Hosting Gratis InfinityFree:</p>
                <p className="mt-0.5 text-amber-800">
                  Di InfinityFree, Anda perlu membuat database terlebih dahulu di menu <em>MySQL Databases</em> (misal nama database: <code className="bg-amber-100 px-1 rounded font-mono">if0_xxxxxx_digpai</code>). Setelah dibuat, klik tombol <strong>phpMyAdmin</strong> di sebelah database tersebut, lalu lakukan import.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SQL CODE PREVIEW */}
      {activeTab === 'sql_preview' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Cuplikan Skrip SQL (mpd_digpai_database.sql)</h2>
              <p className="text-xs text-slate-500">
                Struktur tabel `school_classes`, `users`, `topics`, `materials`, `student_progress`, dan `student_submissions`.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={copySqlToClipboard}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Tersalin!' : 'Salin SQL'}</span>
              </button>
              <button
                onClick={handleDownloadSqlFile}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File .SQL</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-96 leading-relaxed border border-slate-800">
            <pre>{sampleSqlSnippet}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
