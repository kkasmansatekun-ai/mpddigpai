import React, { useState } from 'react';
import { LARAVEL_SNIPPETS, LaravelFileSnippet } from '../../data/laravelCodeSnippets';
import {
  Code2,
  Copy,
  Check,
  FileCode,
  FolderTree,
  Download,
  Terminal,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const LaravelArchitecturePage: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState<LaravelFileSnippet>(LARAVEL_SNIPPETS[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', 'Migration', 'Seeder', 'Controller', 'Blade View', 'JavaScript', 'Routes'];

  const filteredSnippets = activeFilter === 'All'
    ? LARAVEL_SNIPPETS
    : LARAVEL_SNIPPETS.filter((s) => s.category === activeFilter);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedSnippet.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = selectedSnippet.path.split('/').pop() || 'laravel_code.php';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 text-amber-700 mb-2">
          <Code2 className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Arsitektur Backend</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md">
            PHP Laravel 11+ Framework
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Arsitektur Kode Lengkap PHP Laravel (MPD-DigPAI)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Seluruh berkas arsitektur backend Laravel (Migration, Controller, Seeder 36 Siswa, Blade Views, Widget Alpine.js, dan Routes) siap digunakan dalam lingkungan produksi Laravel.
        </p>

        {/* Filter Categories */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeFilter === cat
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* CODE EXPLORER SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Tree List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-bold text-slate-700">
            <span className="flex items-center space-x-1.5">
              <FolderTree className="w-4 h-4 text-emerald-600" />
              <span>Daftar File Laravel ({filteredSnippets.length})</span>
            </span>
            <span className="text-[10px] text-slate-400">Pilih untuk melihat</span>
          </div>

          <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
            {filteredSnippets.map((snippet) => {
              const isSelected = selectedSnippet.path === snippet.path;
              return (
                <button
                  key={snippet.path}
                  onClick={() => setSelectedSnippet(snippet)}
                  className={`w-full text-left p-3 rounded-2xl transition border ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300/40'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.2 rounded ${
                        snippet.category === 'Migration'
                          ? 'bg-purple-100 text-purple-800'
                          : snippet.category === 'Controller'
                          ? 'bg-blue-100 text-blue-800'
                          : snippet.category === 'Blade View'
                          ? 'bg-rose-100 text-rose-800'
                          : snippet.category === 'Seeder'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {snippet.category}
                    </span>
                  </div>
                  <p className="font-mono text-xs font-bold text-slate-900 truncate">
                    {snippet.path.split('/').pop()}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                    {snippet.path}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl p-6 text-white shadow-xl border border-slate-800 flex flex-col justify-between space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800">
                {selectedSnippet.category}
              </span>
              <h3 className="font-mono font-bold text-sm text-slate-100 mt-1">
                {selectedSnippet.path}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedSnippet.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-1.5 border border-slate-700 transition"
                title="Salin kode ke papan klip"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-1.5 transition"
                title="Unduh file kode ini"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File</span>
              </button>
            </div>
          </div>

          {/* Syntax Code Body */}
          <div className="bg-slate-900 rounded-2xl p-4 overflow-x-auto max-h-[500px] font-mono text-xs text-slate-200 border border-slate-800 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
            <pre>
              <code>{selectedSnippet.code}</code>
            </pre>
          </div>

          {/* Terminal Hint */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-[11px]">
                php artisan migrate --seed (Untuk mengeksekusi di Laravel lokal)
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Kompatibel PHP 8.2+ / Laravel 11</span>
          </div>
        </div>
      </div>
    </div>
  );
};
