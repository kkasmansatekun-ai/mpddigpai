import React from 'react';
import { StudentProgress, User, SchoolClass } from '../../types';
import { Printer, ArrowLeft } from 'lucide-react';

interface PrintGradesViewProps {
  students: User[];
  progressList: StudentProgress[];
  activeClass?: SchoolClass;
  onBack: () => void;
}

export const PrintGradesView: React.FC<PrintGradesViewProps> = ({
  students,
  progressList,
  activeClass,
  onBack,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const currentClassName = activeClass ? `${activeClass.name} (${activeClass.phase})` : 'Kelas Aktif';

  return (
    <div className="bg-white min-h-screen text-black p-4 sm:p-8 animate-fade-in">
      {/* Top action bar (Hidden when printing) */}
      <div className="no-print mb-6 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-sm">Mode Pratinjau Cetak: Rekapitulasi Nilai Siswa</h2>
            <p className="text-xs text-slate-400">
              Format A4 Portrait siap cetak resmi tanpa sidebar/header navigation
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md transition"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Dokumen Sekarang (Print)</span>
        </button>
      </div>

      {/* DOKUMEN CETAK RESMI (SIAP PRINT) */}
      <div className="max-w-[850px] mx-auto border border-slate-300 p-8 rounded-xl shadow-xs print:border-none print:p-0 print:shadow-none">
        {/* Kop Surat / Header Dokumen */}
        <div className="text-center border-b-2 border-emerald-900 pb-4 mb-4">
          <h1 className="text-xl font-black text-emerald-950 uppercase tracking-tight">
            Media Pembelajaran Digital Pendidikan Agama Islam (MPD-DigPAI)
          </h1>
          <p className="text-xs font-bold text-slate-800 uppercase mt-0.5 tracking-wider">
            Rekapitulasi Hasil Belajar Peserta Didik (Nilai Asesmen Autentik)
          </p>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Materi: Adab Bersosial Media dalam Islam • Semester Ganjil Tahun Ajaran 2025/2026
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
            <p><strong>KKTP (Kriteria Ketuntasan):</strong> 75.00</p>
          </div>
        </div>

        {/* Tabel Rekapitulasi Nilai */}
        <table className="w-full border-collapse border border-slate-400 text-[10px]">
          <thead>
            <tr className="bg-slate-100 text-slate-900 font-bold">
              <th className="border border-slate-400 p-1.5 text-center w-8">No</th>
              <th className="border border-slate-400 p-1.5 text-left">Nama Peserta Didik</th>
              <th className="border border-slate-400 p-1.5 text-center w-12">Gaya</th>
              <th className="border border-slate-400 p-1.5 text-center w-16">Diagnostik (15%)</th>
              <th className="border border-slate-400 p-1.5 text-center w-16">Formatif (25%)</th>
              <th className="border border-slate-400 p-1.5 text-center w-16">Tugas (30%)</th>
              <th className="border border-slate-400 p-1.5 text-center w-16">Sumatif (30%)</th>
              <th className="border border-slate-400 p-1.5 text-center w-16 font-black bg-emerald-50">Nilai Akhir</th>
              <th className="border border-slate-400 p-1.5 text-center w-12">Predikat</th>
              <th className="border border-slate-400 p-1.5 text-center w-20">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => {
              const p = progressList.find((prog) => prog.studentId === s.id) || {
                diagnostikScore: 80,
                formatifScore: 82,
                tugasScore: 85,
                sumatifScore: 84,
                finalScore: 83,
                grade: 'B+',
                status: 'Tuntas',
              };

              return (
                <tr key={s.id} className="print-break-inside-avoid">
                  <td className="border border-slate-400 p-1 text-center font-mono">{index + 1}</td>
                  <td className="border border-slate-400 p-1 font-bold uppercase">{s.name}</td>
                  <td className="border border-slate-400 p-1 text-center capitalize">{s.learningStyle.slice(0, 3)}</td>
                  <td className="border border-slate-400 p-1 text-center">{p.diagnostikScore}</td>
                  <td className="border border-slate-400 p-1 text-center">{p.formatifScore}</td>
                  <td className="border border-slate-400 p-1 text-center">{p.tugasScore}</td>
                  <td className="border border-slate-400 p-1 text-center">{p.sumatifScore}</td>
                  <td className="border border-slate-400 p-1 text-center font-black bg-emerald-50/50">
                    {p.finalScore}
                  </td>
                  <td className="border border-slate-400 p-1 text-center font-bold">{p.grade}</td>
                  <td className="border border-slate-400 p-1 text-center font-semibold">
                    {p.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

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
