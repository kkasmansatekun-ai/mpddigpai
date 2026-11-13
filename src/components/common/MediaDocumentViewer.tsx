import React, { useState, useEffect, useMemo } from 'react';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import {
  Download,
  ExternalLink,
  FileText,
  FileSpreadsheet,
  Volume2,
  Film,
  Maximize2,
  X,
  Loader2,
  AlertCircle,
  BookOpen,
  File,
  Play,
} from 'lucide-react';
import { Html5VideoPlayer } from './Html5VideoPlayer';

export interface FileAttachmentMeta {
  name: string;
  size: string;
  type: string;
  extension: string;
  dataUrl: string;
  isChunked?: boolean;
  chunkCount?: number;
}

interface MediaDocumentViewerProps {
  title?: string;
  fileAttachment?: FileAttachmentMeta;
  mediaUrl?: string;
  compact?: boolean;
}

// Convert base64 dataUrl to ArrayBuffer
function dataUrlToArrayBuffer(dataUrl: string): ArrayBuffer {
  const base64Index = dataUrl.indexOf(',');
  const base64 = base64Index !== -1 ? dataUrl.slice(base64Index + 1) : dataUrl;
  const binaryStr = atob(base64);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes.buffer;
}

// Convert base64 dataUrl to Blob URL for reliable iframe PDF & large video playback
function useBlobUrl(dataUrl?: string, fallbackMime?: string): string {
  const [blobUrl, setBlobUrl] = useState<string>('');

  useEffect(() => {
    if (!dataUrl || !dataUrl.startsWith('data:')) {
      setBlobUrl(dataUrl || '');
      return;
    }

    let createdUrl = '';
    try {
      const headerMatch = dataUrl.match(/^data:([^;]+);base64,/);
      const mime = headerMatch ? headerMatch[1] : fallbackMime || 'application/octet-stream';
      const buffer = dataUrlToArrayBuffer(dataUrl);
      const blob = new Blob([buffer], { type: mime });
      createdUrl = URL.createObjectURL(blob);
      setBlobUrl(createdUrl);
    } catch (err) {
      console.warn('Blob conversion fallback:', err);
      setBlobUrl(dataUrl);
    }

    return () => {
      if (createdUrl && createdUrl.startsWith('blob:')) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [dataUrl, fallbackMime]);

  return blobUrl;
}

// Extract YouTube embed URL if applicable
function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) return url;
      const v = parsed.searchParams.get('v');
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`;
    }
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    }
  } catch {}
  return null;
}

export const MediaDocumentViewer: React.FC<MediaDocumentViewerProps> = ({
  title,
  fileAttachment,
  mediaUrl,
  compact = false,
}) => {
  const ext = (fileAttachment?.extension || '').toLowerCase();
  const dataUrl = fileAttachment?.dataUrl || '';

  const isVideo = ['mp4', 'webm', 'mov', 'mkv', 'm4v', 'ogg'].includes(ext) && !['ogg'].includes(ext)
    ? true
    : ['mp4', 'webm', 'mov', 'mkv', 'm4v'].includes(ext) ||
      (fileAttachment?.type || '').startsWith('video/');
  const isAudio = ['mp3', 'wav', 'm4a', 'ogg', 'aac'].includes(ext) ||
    (fileAttachment?.type || '').startsWith('audio/');
  const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext) ||
    (fileAttachment?.type || '').startsWith('image/');
  const isPdf = ext === 'pdf' || (fileAttachment?.type || '').includes('pdf');
  const isDocx = ext === 'docx';
  const isLegacyDoc = ext === 'doc';
  const isSpreadsheet = ['xlsx', 'xls', 'csv'].includes(ext);

  const blobUrl = useBlobUrl(
    dataUrl,
    isPdf ? 'application/pdf' : isVideo ? fileAttachment?.type || 'video/mp4' : fileAttachment?.type
  );

  const [docxHtml, setDocxHtml] = useState<string>('');
  const [docxLoading, setDocxLoading] = useState<boolean>(false);
  const [docxError, setDocxError] = useState<string>('');

  const [sheetRows, setSheetRows] = useState<string[][]>([]);
  const [sheetError, setSheetError] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const youtubeEmbedUrl = useMemo(() => getYouTubeEmbedUrl(mediaUrl), [mediaUrl]);
  const isDirectVideoUrl = useMemo(
    () => Boolean(mediaUrl && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(mediaUrl)),
    [mediaUrl]
  );

  // Convert .docx to HTML via mammoth
  useEffect(() => {
    if (!isDocx || !dataUrl) {
      setDocxHtml('');
      return;
    }
    let cancelled = false;
    setDocxLoading(true);
    setDocxError('');

    try {
      const arrayBuffer = dataUrlToArrayBuffer(dataUrl);
      mammoth
        .convertToHtml({ arrayBuffer })
        .then((res) => {
          if (!cancelled) {
            setDocxHtml(res.value || '<p>Dokumen kosong.</p>');
            setDocxLoading(false);
          }
        })
        .catch((err) => {
          if (!cancelled) {
            console.warn('Mammoth DOCX preview error:', err);
            setDocxError('Tidak dapat menampilkan pratinjau dokumen Word secara langsung. Silakan unduh berkas untuk membukanya.');
            setDocxLoading(false);
          }
        });
    } catch (err) {
      if (!cancelled) {
        setDocxError('Format berkas Word tidak valid atau rusak.');
        setDocxLoading(false);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [isDocx, dataUrl]);

  // Parse .xlsx / .xls / .csv preview rows
  useEffect(() => {
    if (!isSpreadsheet || !dataUrl) {
      setSheetRows([]);
      return;
    }
    try {
      const arrayBuffer = dataUrlToArrayBuffer(dataUrl);
      const wb = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheet = wb.SheetNames[0];
      if (firstSheet) {
        const ws = wb.Sheets[firstSheet];
        const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
        setSheetRows(
          rows.slice(0, 25).map((r) => (Array.isArray(r) ? r.map((c) => String(c ?? '')) : []))
        );
      }
    } catch (err) {
      console.warn('Spreadsheet parse error:', err);
      setSheetError('Silakan unduh berkas tabel untuk membukanya di MS Excel.');
    }
  }, [isSpreadsheet, dataUrl]);

  const renderMainMediaContent = (inModal: boolean) => (
    <div className="space-y-3">
      {/* UPLOADED FILE CONTENT */}
      {fileAttachment && (
        <>
          {!dataUrl ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-700 shrink-0" />
              <span>Sedang memuat berkas media dari penyimpanan cloud...</span>
            </div>
          ) : (
            <>
              {/* 1. VIDEO PLAYER (.mp4, .webm, .mov, dll) */}
              {isVideo && (
                <Html5VideoPlayer
                  src={blobUrl || dataUrl}
                  mimeType={fileAttachment.type}
                  title={title || fileAttachment.name}
                  fileName={fileAttachment.name}
                  fileSize={fileAttachment.size}
                  showMetaBar={true}
                />
              )}

              {/* 2. AUDIO PLAYER (.mp3, .wav, .ogg, .m4a) */}
              {isAudio && (
                <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950 flex items-center space-x-1.5">
                      <Volume2 className="w-4 h-4 text-blue-700" />
                      <span>Pemutar Audio Kajian / Podcast PAI:</span>
                    </span>
                    <span className="text-[10px] font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase">
                      {ext || 'audio'}
                    </span>
                  </div>
                  <audio
                    controls
                    className="w-full h-11 rounded-xl outline-hidden"
                    src={blobUrl || dataUrl}
                  />
                </div>
              )}

              {/* 3. IMAGE PREVIEW */}
              {isImage && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white p-2 text-center">
                  <img
                    src={blobUrl || dataUrl}
                    alt={fileAttachment.name}
                    className={`${inModal ? 'max-h-[70vh]' : 'max-h-80'} w-auto max-w-full object-contain mx-auto rounded-xl`}
                  />
                </div>
              )}

              {/* 4. PDF EMBEDDED VIEWER */}
              {isPdf && (
                <div className="rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 space-y-0">
                  <div className="px-4 py-2 bg-slate-800 text-white flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-rose-400" />
                      <span>Penampil Dokumen PDF: {fileAttachment.name}</span>
                    </span>
                    <div className="flex items-center space-x-2">
                      {blobUrl && (
                        <a
                          href={blobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-[11px] font-semibold flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Tab Baru</span>
                        </a>
                      )}
                    </div>
                  </div>
                  {blobUrl ? (
                    <iframe
                      src={blobUrl}
                      title={fileAttachment.name}
                      className={`w-full bg-white ${inModal ? 'h-[72vh]' : compact ? 'h-[380px]' : 'h-[520px]'}`}
                    />
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500">
                      Mempersiapkan penampil PDF...
                    </div>
                  )}
                </div>
              )}

              {/* 5. MS WORD (.docx) EMBEDDED READER */}
              {isDocx && (
                <div className="rounded-2xl overflow-hidden border border-blue-200 bg-white shadow-xs">
                  <div className="px-4 py-2.5 bg-blue-900 text-white flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-blue-300" />
                      <span>Penampil Dokumen MS Word: {fileAttachment.name}</span>
                    </span>
                    <span className="text-[10px] font-mono bg-blue-800 px-2 py-0.5 rounded uppercase">
                      .DOCX Reader
                    </span>
                  </div>
                  <div className={`p-5 sm:p-7 overflow-y-auto bg-white text-slate-800 ${inModal ? 'max-h-[70vh]' : compact ? 'max-h-[360px]' : 'max-h-[480px]'}`}>
                    {docxLoading ? (
                      <div className="flex items-center justify-center space-x-2 py-10 text-xs text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
                        <span>Membaca isi dokumen Microsoft Word...</span>
                      </div>
                    ) : docxError ? (
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>{docxError}</span>
                      </div>
                    ) : (
                      <div
                        className="prose prose-sm max-w-none text-xs sm:text-sm leading-relaxed space-y-2 [&_h1]:text-lg [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:text-sm [&_h3]:font-bold [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_th]:border [&_th]:border-slate-300 [&_th]:p-2 [&_th]:bg-slate-100"
                        dangerouslySetInnerHTML={{ __html: docxHtml }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* 6. LEGACY .DOC INFO */}
              {isLegacyDoc && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2.5 text-blue-950">
                    <FileText className="w-5 h-5 text-blue-700 shrink-0" />
                    <div>
                      <p className="font-bold">Dokumen MS Word (.DOC): {fileAttachment.name}</p>
                      <p className="text-[11px] text-blue-800">
                        Format .doc lama — silakan klik tombol Unduh Berkas untuk membuka di Microsoft Word.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. SPREADSHEET / CSV PREVIEW */}
              {isSpreadsheet && (
                <div className="rounded-2xl overflow-hidden border border-emerald-200 bg-white">
                  <div className="px-4 py-2 bg-emerald-800 text-white flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center space-x-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                      <span>Pratinjau Data Tabel ({ext.toUpperCase()}): {fileAttachment.name}</span>
                    </span>
                  </div>
                  {sheetError ? (
                    <p className="p-4 text-xs text-slate-600">{sheetError}</p>
                  ) : sheetRows.length > 0 ? (
                    <div className="overflow-x-auto max-h-64">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <tbody>
                          {sheetRows.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              className={rIdx === 0 ? 'bg-emerald-50 font-bold text-emerald-950' : 'border-t border-slate-100 hover:bg-slate-50'}
                            >
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-3 py-2 border-r border-slate-100 whitespace-nowrap">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="p-4 text-xs text-slate-500">Tabel siap diunduh.</p>
                  )}
                </div>
              )}

              {/* OTHER DOCUMENT FALLBACK */}
              {!isVideo && !isAudio && !isImage && !isPdf && !isDocx && !isLegacyDoc && !isSpreadsheet && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center space-x-2">
                    <File className="w-4 h-4 text-emerald-700" />
                    <span>Berkas {(ext || 'Lampiran').toUpperCase()} siap diunduh dan dipelajari</span>
                  </span>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* YOUTUBE OR DIRECT VIDEO LINK EMBED */}
      {youtubeEmbedUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-md">
          <div className="px-4 py-2 bg-slate-900 text-white text-xs flex items-center justify-between">
            <span className="font-bold flex items-center space-x-1.5">
              <Play className="w-3.5 h-3.5 text-rose-400" />
              <span>Video Pembelajaran YouTube</span>
            </span>
            <a
              href={mediaUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-emerald-300 hover:underline flex items-center space-x-1"
            >
              <span>Buka YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="aspect-video w-full">
            <iframe
              src={youtubeEmbedUrl}
              title={title || 'Video Pembelajaran'}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {!youtubeEmbedUrl && isDirectVideoUrl && mediaUrl && (
        <Html5VideoPlayer src={mediaUrl} title={title || 'Video Pembelajaran'} showMetaBar={true} />
      )}
    </div>
  );

  if (!fileAttachment && !youtubeEmbedUrl && !isDirectVideoUrl) {
    return null;
  }

  return (
    <>
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        {/* Header Bar with Download & Fullscreen Viewer Trigger */}
        {fileAttachment && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
            <div className="flex items-center space-x-2.5 min-w-0">
              <span className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                {ext || 'FILE'}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{fileAttachment.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {isVideo
                    ? 'Media Video Pembelajaran'
                    : isPdf
                    ? 'Dokumen PDF Pembelajaran'
                    : isDocx || isLegacyDoc
                    ? 'Dokumen Microsoft Word'
                    : isAudio
                    ? 'Audio Kajian / Podcast'
                    : 'Berkas Penunjang Materi'}{' '}
                  • {fileAttachment.size}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {(isVideo || isPdf || isDocx || isImage) && dataUrl && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Buka Penampil Penuh</span>
                </button>
              )}

              {dataUrl && (
                <a
                  href={blobUrl || dataUrl}
                  download={fileAttachment.name}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </a>
              )}
            </div>
          </div>
        )}

        {renderMainMediaContent(false)}
      </div>

      {/* FULLSCREEN MEDIA / WORD / PDF VIEWER MODAL */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in"
        >
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5 min-w-0">
                {isVideo ? (
                  <Film className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold truncate">
                    {title || fileAttachment?.name || 'Penampil Media Pembelajaran'}
                  </h3>
                  <p className="text-[11px] text-slate-300 truncate">
                    {fileAttachment?.name} • {fileAttachment?.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                {fileAttachment && dataUrl && (
                  <a
                    href={blobUrl || dataUrl}
                    download={fileAttachment.name}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Unduh Berkas</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
                  title="Tutup Penampil"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
              {renderMainMediaContent(true)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
