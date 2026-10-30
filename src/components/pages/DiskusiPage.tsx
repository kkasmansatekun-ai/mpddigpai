import React, { useState } from 'react';
import { INITIAL_DISCUSSIONS } from '../../data/materialsData';
import { DiscussionComment, User } from '../../types';
import {
  MessageSquare,
  Pin,
  Heart,
  Send,
  CornerDownRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface DiskusiPageProps {
  currentUser: User;
}

export const DiskusiPage: React.FC<DiskusiPageProps> = ({ currentUser }) => {
  const [threads, setThreads] = useState<DiscussionComment[]>(INITIAL_DISCUSSIONS);
  const [newComment, setNewComment] = useState('');
  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleLike = (threadId: string, replyId?: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          if (!replyId) {
            return { ...t, likes: t.likes + 1 };
          } else {
            return {
              ...t,
              replies: t.replies?.map((r) =>
                r.id === replyId ? { ...r, likes: r.likes + 1 } : r
              ),
            };
          }
        }
        return t;
      })
    );
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newThread: DiscussionComment = {
      id: `disc-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      avatarColor: currentUser.role === 'teacher' ? 'bg-emerald-700' : 'bg-teal-600',
      content: newComment,
      timestamp: 'Baru saja',
      likes: 0,
      replies: [],
    };

    setThreads([newThread, ...threads]);
    setNewComment('');
  };

  const handlePostReply = (threadId: string) => {
    if (!replyText.trim()) return;

    const newRep: DiscussionComment = {
      id: `rep-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      avatarColor: currentUser.role === 'teacher' ? 'bg-emerald-700' : 'bg-teal-600',
      content: replyText,
      timestamp: 'Baru saja',
      likes: 0,
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            replies: [...(t.replies || []), newRep],
          };
        }
        return t;
      })
    );

    setReplyTargetId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3 text-emerald-700 mb-2">
          <MessageSquare className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Halaman 8 / 11</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Forum Diskusi & Interaksi Belajar PAI
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Ruang dialog santun bertukar gagasan, bertanya kepada guru pengampu, dan mendiskusikan studi kasus etika bermedia sosial.
        </p>
      </div>

      {/* FORM TULIS KOMENTAR BARU */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white ${
              currentUser.role === 'teacher' ? 'bg-emerald-700' : 'bg-teal-600'
            }`}
          >
            {currentUser.name.slice(0, 2)}
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900">{currentUser.name}</p>
            <p className="text-[11px] text-slate-400">
              {currentUser.role === 'teacher' ? 'Guru Pengampu PAI' : 'Peserta Didik'}
            </p>
          </div>
        </div>

        <form onSubmit={handlePostComment} className="space-y-3">
          <textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tuliskan gagasan, pertanyaan, atau refleksi topik adab bersosial media dengan bahasa santun..."
            className="w-full p-4 rounded-2xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs text-slate-800 outline-hidden transition"
            required
          />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Menerapkan prinsip <strong className="text-emerald-800">Qaulan Sadida</strong> & santun.
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirimkan Pendapat</span>
            </button>
          </div>
        </form>
      </div>

      {/* DAFTAR THREAD DISKUSI */}
      <div className="space-y-4">
        {threads.map((thread) => (
          <div
            key={thread.id}
            className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
              thread.isPinned
                ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300/50'
                : 'bg-white border-slate-200'
            }`}
          >
            {/* Header Thread */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white ${thread.avatarColor}`}
                >
                  {thread.authorName.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{thread.authorName}</span>
                    {thread.authorRole === 'teacher' && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 inline mr-0.5" />
                        <span>Guru Pengampu</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{thread.timestamp}</span>
                </div>
              </div>

              {thread.isPinned && (
                <span className="flex items-center space-x-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  <Pin className="w-3.5 h-3.5" />
                  <span>Disematkan Guru</span>
                </span>
              )}
            </div>

            {/* Content */}
            <p className="text-xs text-slate-800 leading-relaxed">{thread.content}</p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <button
                onClick={() => handleLike(thread.id)}
                className="flex items-center space-x-1.5 hover:text-rose-600 transition"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>{thread.likes} Suka</span>
              </button>
              <button
                onClick={() =>
                  setReplyTargetId(replyTargetId === thread.id ? null : thread.id)
                }
                className="flex items-center space-x-1.5 hover:text-emerald-700 transition"
              >
                <CornerDownRight className="w-4 h-4" />
                <span>Balas Komentar</span>
              </button>
            </div>

            {/* Reply Form */}
            {replyTargetId === thread.id && (
              <div className="pl-6 pt-2 space-y-2 border-l-2 border-emerald-400">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Balas tanggapan ${thread.authorName}...`}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setReplyTargetId(null)}
                    className="px-3 py-1.5 rounded-lg text-slate-500 text-xs hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handlePostReply(thread.id)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                  >
                    Kirim Balasan
                  </button>
                </div>
              </div>
            )}

            {/* REPLIES LIST */}
            {thread.replies && thread.replies.length > 0 && (
              <div className="pl-4 sm:pl-8 space-y-3 pt-3 border-t border-slate-100">
                {thread.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[10px] text-white ${reply.avatarColor}`}
                        >
                          {reply.authorName.slice(0, 2)}
                        </div>
                        <span className="font-bold text-xs text-slate-900">{reply.authorName}</span>
                        {reply.authorRole === 'teacher' && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                            Guru
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{reply.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{reply.content}</p>

                    <button
                      onClick={() => handleLike(thread.id, reply.id)}
                      className="flex items-center space-x-1 text-[11px] text-slate-500 hover:text-rose-600 transition"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>{reply.likes}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
