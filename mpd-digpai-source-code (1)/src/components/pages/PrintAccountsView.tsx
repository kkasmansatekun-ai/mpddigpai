import React, { useState } from 'react';
import { User, SchoolClass } from '../../types';
import { Printer, ArrowLeft, Grid, Table as TableIcon, Scissors } from 'lucide-react';

interface PrintAccountsViewProps {
  students: User[];
  activeClass?: SchoolClass;
  onBack: () => void;
}

export const PrintAccountsView: React.FC<PrintAccountsViewProps> = ({
  students,
  activeClass,
  onBack,
}) => {
  const [layoutMode, setLayoutMode] = useState<'table' | 'cards'>('cards');

  const handlePrint = () => {
    window.print();
  };

  const currentClassName = activeClass ? `${activeClass.name} (${activeClass.phase})` : 'Kelas Aktif';

  return (
    <div className="bg-white min-h-screen text-black p-4 sm:p-8 animate-fade-in">
      {/* Top action bar (Hidden when printing) */}
      <div className="no-print mb-6 p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-sm">Mode Cetak Akun Siswa</h2>
            <p className="text-xs text-slate-400">
              Format A4 rapi tanpa sidebar/header navigation • Kelas: {currentClassName}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Layout Mode Selector */}
          <div className="flex bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setLayoutMode('cards')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                layoutMode === 'cards'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Kartu Siap Potong</span>
            </button>
            <button
              onClick={() => setLayoutMode('table')}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                layoutMode === 'table'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel Rekap</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen (Ctrl+P)</span>
          </button>
        </div>
      </div>

      {/* DOKUMEN CETAK RESMI (SIAP PRINT) */}
      <div className="max-w-[850px] mx-auto border border-slate-300 p-6 sm:p-8 rounded-xl shadow-xs print:border-none print:p-0 print:shadow-none">
        {/* Kop Surat / Header Dokumen */}
        <div className="text-center border-b-2 border-emerald-900 pb-4 mb-4">
          <h1 className="text-xl font-black text-emerald-950 uppercase tracking-tight">
            Media Pembelajaran Digital Pendidikan Agama Islam (MPD-DigPAI)
          </h1>
          <p className="text-xs font-bold text-slate-800 uppercase mt-0.5 tracking-wider">
            {layoutMode === 'cards'
              ? 'Lembar Kartu Kredensial Siswa (Siap Gunting & Distribusi)'
              : 'Lembar Distribusi Akun & Kredensial Akses Peserta Didik'}
          </p>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Topik: Adab Bersosial Media dalam Islam • Tahun Ajaran 2025/2026
          </p>
        </div>

        {/* Informasi Kelas */}
        <div className="flex justify-between text-xs text-slate-800 mb-4 pb-2 border-b border-slate-200">
          <div>
            <p><strong>Kelas:</strong> {currentClassName}</p>
            <p><strong>Guru Pengampu:</strong> Wandra Arasdi, M.Pd.</p>
          </div>
          <div className="text-right">
            <p><strong>Tanggal Cetak:</strong> 12 Oktober 2026</p>
            <p><strong>Jumlah Siswa:</strong> {students.length} Peserta Didik</p>
          </div>
        </div>

        {/* KONTEN UTAMA: KARTU POTONG ATAU TABEL REKAP */}
        {layoutMode === 'cards' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 print:grid-cols-3 print:gap-2">
            {students.map((s, index) => (
              <div
                key={s.id}
                className="border-2 border-dashed border-slate-400 p-3 rounded-xl bg-slate-50/50 print:bg-white print-break-inside-avoid relative flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b border-slate-300 pb-1.5 mb-2">
                  <div className="flex items-center space-x-1 text-emerald-900 font-black text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>MPD-DigPAI</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">#{index + 1}</span>
                </div>

                <div className="space-y-1 text-[10px]">
                  <div>
                    <span className="text-[8.5px] uppercase font-bold text-slate-400 block">Nama Peserta Didik</span>
                    <strong className="text-slate-900 line-clamp-1 uppercase text-[10.5px]">{s.name}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-1 pt-1">
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <span className="text-[8px] text-slate-400 block">Username</span>
                      <span className="font-mono font-bold text-emerald-900 text-[10px] break-all">{s.username}</span>
                    </div>
                    <div className="bg-white p-1 rounded border border-slate-200">
                      <span className="text-[8px] text-slate-400 block">Password</span>
                      <span className="font-mono font-black text-rose-700 text-[10px]">{s.initialPassword}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[8px] text-slate-500">
                    <span>Gaya: <strong className="capitalize text-slate-700">{s.learningStyle}</strong></span>
                    <span>{currentClassName}</span>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[7.5px] text-slate-400">
                  <span>Gunting & simpan kartu ini</span>
                  <Scissors className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full border-collapse border border-slate-400 text-[10.5px]">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold">
                <th className="border border-slate-400 p-2 text-center w-8">No</th>
                <th className="border border-slate-400 p-2 text-left">Nama Peserta Didik</th>
                <th className="border border-slate-400 p-2 text-center w-16">Gender</th>
                <th className="border border-slate-400 p-2 text-center w-20">Gaya Belajar</th>
                <th className="border border-slate-400 p-2 text-left font-mono">Username</th>
                <th className="border border-slate-400 p-2 text-left font-mono">Password Awal</th>
                <th className="border border-slate-400 p-2 text-center w-20">Paraf Siswa</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => (
                <tr key={s.id} className="print-break-inside-avoid">
                  <td className="border border-slate-400 p-1.5 text-center font-mono">{index + 1}</td>
                  <td className="border border-slate-400 p-1.5 font-bold uppercase">{s.name}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{s.gender}</td>
                  <td className="border border-slate-400 p-1.5 text-center capitalize">{s.learningStyle}</td>
                  <td className="border border-slate-400 p-1.5 font-mono text-emerald-950 font-semibold">{s.username}</td>
                  <td className="border border-slate-400 p-1.5 font-mono font-bold">{s.initialPassword}</td>
                  <td className="border border-slate-400 p-1.5"></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Tanda Tangan Guru */}
        <div className="mt-8 flex justify-end text-xs text-slate-900 print-break-inside-avoid">
          <div className="text-center w-56">
            <p>Guru Pengampu PAI,</p>
            <div className="h-16"></div>
            <p className="font-bold underline text-sm">Wandra Arasdi, M.Pd.</p>
            <p className="text-[10px] text-slate-600">NIP. 19850412 201101 1 008</p>
          </div>
        </div>
      </div>
    </div>
  );
};
