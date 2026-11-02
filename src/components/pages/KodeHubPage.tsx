import React, { useState, useEffect } from 'react';
import {
  Code2,
  Database,
  Flame,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Server,
  Cloud,
  Layers,
  Terminal,
  ShieldCheck,
  FileCode,
  Download,
} from 'lucide-react';
import { User, StudentProgress, SchoolClass } from '../../types';
import { LaravelArchitecturePage } from './LaravelArchitecturePage';
import { DatabaseExportPage } from './DatabaseExportPage';
import { testFirestoreConnection } from '../../services/firebaseService';

export type KodeTabId = 'laravel' | 'database_sql' | 'firebase';

interface KodeHubPageProps {
  initialTab?: KodeTabId;
  students: User[];
  progressList: StudentProgress[];
  activeClass: SchoolClass;
  currentUser: User;
  classes: SchoolClass[];
  firebaseStatus: { connected: boolean; message: string; error?: string };
  onSyncAllToFirestore: () => Promise<{ success: boolean; count: number; error?: string }>;
}

export const KodeHubPage: React.FC<KodeHubPageProps> = ({
  initialTab = 'laravel',
  students,
  progressList,
  activeClass,
  currentUser,
  classes,
  firebaseStatus,
  onSyncAllToFirestore,
}) => {
  const [activeTab, setActiveTab] = useState<KodeTabId>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  const firebaseConfigText = `// Your web app's Firebase configuration (mpd-digpai)
const firebaseConfig = {
  apiKey: "AIzaSyCHHuFKwzvPXCDc-dTanIB0yim-MrV4-uY",
  authDomain: "mpd-digpai.firebaseapp.com",
  projectId: "mpd-digpai",
  storageBucket: "mpd-digpai.firebasestorage.app",
  messagingSenderId: "741425404742",
  appId: "1:741425404742:web:1dfc240b4d30faa3942347"
};`;

  const firestoreRulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // MPD-DigPAI Security Rules
    match /classes/{classId} {
      allow read, write: if true;
    }
    match /students/{studentId} {
      allow read, write: if true;
    }
    match /student_progress/{progressId} {
      allow read, write: if true;
    }
    match /submissions/{subId} {
      allow read, write: if true;
    }
    match /learning_materials/{matId} {
      allow read, write: if true;
    }
    match /learning_resources/{resId} {
      allow read, write: if true;
    }
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testFirestoreConnection();
      if (res.connected) {
        setTestResult({
          success: true,
          message: 'Berhasil terhubung ke database Firestore (mpd-digpai). Koneksi realtime aktif!',
        });
      } else {
        setTestResult({
          success: false,
          message: res.error || 'Gagal tersambung. Periksa izin koneksi Firebase.',
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e.message || 'Koneksi Firestore gagal.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await onSyncAllToFirestore();
      if (res.success) {
        setSyncFeedback(`Alhamdulillah! Berhasil menyinkronkan ${res.count} dokumen (kelas, siswa & nilai) ke database Firestore.`);
      } else {
        setSyncFeedback(`Gagal sinkronisasi: ${res.error || 'Periksa aturan Firestore'}`);
      }
    } catch (e: any) {
      setSyncFeedback(`Error: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(firebaseConfigText);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const handleCopyRules = () => {
    navigator.clipboard.writeText(firestoreRulesText);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in pb-12">
      {/* HEADER UTAMA MENU KODE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 text-amber-700 mb-1.5">
              <Code2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Arsitektur & Pusat Kode Terpadu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Menu Kode & Manajemen Database
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Akses cepat arsitektur Laravel PHP, skema Database .SQL (MySQL/phpMyAdmin), serta kontrol database Google Cloud Firebase Firestore.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>3 Platform Terintegrasi</span>
            </span>

            <a
              href="/mpd-digpai-source-code.zip"
              download="mpd-digpai-source-code.zip"
              className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition hover:scale-102 cursor-pointer"
              title="Download seluruh source code aplikasi dalam format .ZIP untuk diupload ke repository GitHub"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download ZIP GitHub</span>
            </a>
          </div>
        </div>

        {/* 3 TOMBOL UTAMA DIMENU KODE: LARAVEL PHP, DATABASE .SQL, FIREBASE : MPD-DIGPAI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 border-t border-slate-100 pt-5">
          {/* Tombol 1: Laravel PHP */}
          <button
            onClick={() => setActiveTab('laravel')}
            className={`p-4 rounded-2xl border text-left transition flex items-center justify-between group cursor-pointer ${
              activeTab === 'laravel'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                  activeTab === 'laravel' ? 'bg-amber-600 text-white' : 'bg-red-100 text-red-700'
                }`}
              >
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm leading-tight">Laravel PHP</p>
                <p
                  className={`text-[11px] mt-0.5 ${
                    activeTab === 'laravel' ? 'text-amber-100' : 'text-slate-500'
                  }`}
                >
                  12 File MVC, Migrations & Views
                </p>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'laravel' ? 'bg-white text-amber-900' : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              PHP 11+
            </span>
          </button>

          {/* Tombol 2: Database .SQL */}
          <button
            onClick={() => setActiveTab('database_sql')}
            className={`p-4 rounded-2xl border text-left transition flex items-center justify-between group cursor-pointer ${
              activeTab === 'database_sql'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/20'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                  activeTab === 'database_sql' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                <Database className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm leading-tight">Database .SQL</p>
                <p
                  className={`text-[11px] mt-0.5 ${
                    activeTab === 'database_sql' ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                >
                  MySQL DDL & Export phpMyAdmin
                </p>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'database_sql'
                  ? 'bg-white text-emerald-900'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              .SQL / CSV
            </span>
          </button>

          {/* Tombol 3: Firebase : mpd-digpai */}
          <button
            onClick={() => setActiveTab('firebase')}
            className={`p-4 rounded-2xl border text-left transition flex items-center justify-between group cursor-pointer ${
              activeTab === 'firebase'
                ? 'bg-slate-900 text-white border-slate-950 shadow-md shadow-slate-900/30'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                  activeTab === 'firebase' ? 'bg-amber-500 text-slate-950' : 'bg-amber-100 text-amber-800'
                }`}
              >
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm leading-tight">Firebase : mpd-digpai</p>
                <p
                  className={`text-[11px] mt-0.5 ${
                    activeTab === 'firebase' ? 'text-amber-200' : 'text-slate-500'
                  }`}
                >
                  Cloud Firestore Realtime Sync
                </p>
              </div>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center space-x-1 ${
                activeTab === 'firebase'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online</span>
            </span>
          </button>
        </div>
      </div>

      {/* KONTEN AKTIF SESUAI PILIHAN TOMBOL */}
      {activeTab === 'laravel' && (
        <div className="animate-fade-in">
          <LaravelArchitecturePage />
        </div>
      )}

      {activeTab === 'database_sql' && (
        <div className="animate-fade-in">
          <DatabaseExportPage
            students={students}
            progressList={progressList}
            activeClass={activeClass}
            currentUser={currentUser}
          />
        </div>
      )}

      {activeTab === 'firebase' && (
        <div className="animate-fade-in space-y-6">
          {/* Panel Status & Kontrol Firebase */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
                    <span>Google Cloud Firebase Firestore</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ID: mpd-digpai
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Penyimpanan basis data cloud tanpa server (serverless) dengan sinkronisasi realtime dan persistensi offline.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center space-x-1.5 transition disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Menguji...' : 'Uji Koneksi Firestore'}</span>
                </button>

                <button
                  onClick={handleSyncAll}
                  disabled={isSyncing}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Semua Data'}</span>
                </button>
              </div>
            </div>

            {/* Test Result Feedback */}
            {testResult && (
              <div
                className={`p-4 rounded-2xl text-xs font-semibold flex items-center space-x-3 animate-fade-in ${
                  testResult.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border border-rose-200 text-rose-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testResult.message}</span>
              </div>
            )}

            {syncFeedback && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center space-x-3 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{syncFeedback}</span>
              </div>
            )}

            {/* Statistik Koleksi Dokumen Firestore */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Koleksi: classes</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{classes.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Rombel Kelas Terdaftar</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Koleksi: students</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{students.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Akun & Profil Siswa</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Koleksi: student_progress</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{progressList.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Rekap Nilai & Tuntas</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Status Sinkronisasi</p>
                <p className="text-sm font-black text-emerald-700 mt-2 flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Aktif Realtime</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Firestore SDK Web v11</p>
              </div>
            </div>

            {/* Konfigurasi SDK & Kode Inisialisasi */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-amber-600" />
                  <span>Konfigurasi Firebase Web Client (`src/lib/firebase.ts`)</span>
                </h3>
                <button
                  onClick={handleCopyConfig}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                >
                  {copiedConfig ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedConfig ? 'Tersalin' : 'Salin Config'}</span>
                </button>
              </div>
              <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
                <pre>{firebaseConfigText}</pre>
              </div>
            </div>

            {/* Aturan Firestore Security Rules */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Aturan Keamanan Cloud Firestore (`firestore.rules`)</span>
                </h3>
                <button
                  onClick={handleCopyRules}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                >
                  {copiedRules ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRules ? 'Tersalin' : 'Salin Rules'}</span>
                </button>
              </div>
              <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
                <pre>{firestoreRulesText}</pre>
              </div>
            </div>

            {/* Tombol Eksternal ke Firebase Console */}
            <div className="pt-2 flex justify-end">
              <a
                href="https://console.firebase.google.com/project/mpd-digpai/firestore"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition"
              >
                <span>Buka Firebase Console Proyek: mpd-digpai</span>
                <ExternalLink className="w-4 h-4 text-amber-700" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
