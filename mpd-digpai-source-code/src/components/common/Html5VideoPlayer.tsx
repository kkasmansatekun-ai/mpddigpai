import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize,
  Download,
  AlertCircle,
  ExternalLink,
  Film,
  RefreshCw,
} from 'lucide-react';

interface Html5VideoPlayerProps {
  src: string;
  mimeType?: string;
  title?: string;
  fileName?: string;
  fileSize?: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
  showMetaBar?: boolean;
}

export const Html5VideoPlayer: React.FC<Html5VideoPlayerProps> = ({
  src,
  mimeType,
  title,
  fileName,
  fileSize,
  poster,
  autoPlay = false,
  className = '',
  showMetaBar = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [resolution, setResolution] = useState<{ width: number; height: number } | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Compute clean valid MIME type for HTML5 video source
  const resolveMimeType = (): string => {
    if (mimeType && mimeType.startsWith('video/')) return mimeType;
    const lower = (fileName || src || '').toLowerCase();
    if (lower.endsWith('.webm') || lower.includes('.webm')) return 'video/webm';
    if (lower.endsWith('.ogg') || lower.endsWith('.ogv')) return 'video/ogg';
    if (lower.endsWith('.mov')) return 'video/quicktime';
    if (lower.endsWith('.m4v')) return 'video/x-m4v';
    return 'video/mp4';
  };

  const detectedMime = resolveMimeType();

  // Reset player when src changes
  useEffect(() => {
    setHasError(false);
    setErrorMessage('');
    setIsLoaded(false);
    setCurrentTime(0);
    setDuration(0);
    setResolution(null);

    const videoEl = videoRef.current;
    if (videoEl) {
      try {
        videoEl.load();
        if (autoPlay) {
          const playPromise = videoEl.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsPlaying(true))
              .catch((err) => {
                // Autoplay blocked by browser policy is normal, user can click play
                console.debug('Autoplay not allowed without user gesture:', err);
                setIsPlaying(false);
              });
          }
        }
      } catch (err) {
        console.warn('Video load error', err);
      }
    }
  }, [src, autoPlay]);

  const formatTime = (secs: number): string => {
    if (isNaN(secs) || secs === 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration || 0);
    if (video.videoWidth && video.videoHeight) {
      setResolution({ width: video.videoWidth, height: video.videoHeight });
    }
    setIsLoaded(true);
    setHasError(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleError = () => {
    const video = videoRef.current;
    let detail = 'Format video tidak dapat di-decode oleh browser atau tautan tidak tersedia.';
    if (video?.error) {
      switch (video.error.code) {
        case video.error.MEDIA_ERR_ABORTED:
          detail = 'Pengambilan berkas video dibatalkan oleh pengguna.';
          break;
        case video.error.MEDIA_ERR_NETWORK:
          detail = 'Terjadi gangguan jaringan saat mengunduh berkas video.';
          break;
        case video.error.MEDIA_ERR_DECODE:
          detail = 'Format video atau codec tidak dapat didekode oleh browser.';
          break;
        case video.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          detail = 'Format berkas video atau sumber URL tidak didukung oleh browser ini.';
          break;
      }
    }
    setHasError(true);
    setErrorMessage(detail);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen().catch(() => {});
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage('');
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className={`rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg text-slate-100 flex flex-col ${className}`}>
      {/* Top Header bar with title and MIME badge */}
      {showMetaBar && (
        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 truncate">
            <Film className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-200 truncate">
              {fileName || title || 'Pemutar Video HTML5'}
            </span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            {resolution && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {resolution.width}x{resolution.height}
              </span>
            )}
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 uppercase">
              {detectedMime.replace('video/', '')}
            </span>
            {fileSize && (
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                {fileSize}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Video Container Area */}
      <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden group">
        {!hasError ? (
          <video
            ref={videoRef}
            key={src}
            controls
            playsInline
            preload="metadata"
            poster={poster}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={handleError}
            className="w-full h-full object-contain max-h-[420px] bg-black"
          >
            {/* Primary Source with detected MIME type */}
            <source src={src} type={detectedMime} />
            {/* Secondary fallback source for MP4 codec */}
            {detectedMime !== 'video/mp4' && <source src={src} type="video/mp4" />}
            {/* Browser fallback text */}
            <p className="p-4 text-center text-xs text-slate-400">
              Browser Anda tidak mendukung pemutar video HTML5 bawaan. Silakan unduh berkas untuk menontonnya.
            </p>
          </video>
        ) : (
          /* Error State Fallback UI */
          <div className="p-6 text-center space-y-3 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-200">Gagal Memutar Berkas Video</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {errorMessage || 'Tautan sumber video tidak dapat diakses atau browser memerlukan codec tambahan.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleRetry}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Coba Muat Ulang</span>
              </button>
              <a
                href={src}
                download={fileName || 'video-karya.mp4'}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Berkas</span>
              </a>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition flex items-center space-x-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka di Tab Baru</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Quick Helper Sub-bar below video */}
      {!hasError && (
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={togglePlay}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition flex items-center space-x-1"
              title={isPlaying ? 'Jeda Video' : 'Putar Video'}
            >
              {isPlaying ? <Pause className="w-3 h-3 text-emerald-400" /> : <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-300" />}
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Putar dari awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-400 ml-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={src}
              download={fileName || 'video-karya.mp4'}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition flex items-center space-x-1"
              title="Unduh Berkas Video"
            >
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Unduh</span>
            </a>
            <button
              type="button"
              onClick={handleFullscreen}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Layar Penuh"
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
