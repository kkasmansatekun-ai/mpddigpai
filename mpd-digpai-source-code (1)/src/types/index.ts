export type Role = 'teacher' | 'student';
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic';
export type Gender = 'Laki-laki' | 'Perempuan';

export interface SchoolClass {
  id: string;
  name: string; // e.g. 'KELAS X 3'
  phase: string; // e.g. 'Fase E'
  academicYear: string;
  teacherName?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  gender: Gender;
  initialPassword: string;
  learningStyle: LearningStyle;
  classId?: string;
  className: string;
  nisn?: string;
  avatar?: string;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  diagnostikScore: number;
  formatifScore: number;
  tugasScore: number;
  sumatifScore: number;
  finalScore: number;
  grade: 'A' | 'B+' | 'B' | 'C+' | 'C';
  engagementPercent: number; // 0 - 100
  completedMaterialsCount: number; // out of 9
  submittedTask: boolean;
  submittedReflection: boolean;
  status: 'Tuntas' | 'Dalam Proses' | 'Perlu Bimbingan';
}

export interface PrayerSchedule {
  name: string;
  arabicName: string;
  timeStr: string; // '04:52'
  hours: number;
  minutes: number;
}

export interface MaterialItem {
  id: string;
  type: 'teks' | 'gambar' | 'infografis' | 'video' | 'audio' | 'presentasi' | 'kasus' | 'bacaan' | 'interaktif';
  title: string;
  subtitle: string;
  badge: string;
  duration?: string;
  summary: string;
  contentData: any;
}

export interface ActivityItem {
  id: string;
  style: LearningStyle;
  title: string;
  subtitle: string;
  objective: string;
  instructions: string[];
  mediaUrl?: string;
  actionPrompt: string;
  expectedOutput: string;
  rubric: string[];
}

export interface SubmissionItem {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  category: 'Poster Digital' | 'Video Narasi' | 'Artikel Opini';
  style: LearningStyle;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  description: string;
  submittedAt: string;
  score?: number;
  status: 'Dinilai' | 'Menunggu Penilaian';
  feedback?: string;
}

export interface DiscussionComment {
  id: string;
  authorName: string;
  authorRole: Role;
  avatarColor: string;
  content: string;
  timestamp: string;
  likes: number;
  isPinned?: boolean;
  replies?: DiscussionComment[];
}

export interface AssessmentQuestion {
  id: number;
  category: 'diagnostik' | 'formatif' | 'sumatif';
  question: string;
  dalil?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ReflectionEntry {
  id: string;
  studentName: string;
  understandingLevel: 'Sangat Paham' | 'Paham' | 'Cukup Paham' | 'Masih Bingung';
  biggestChallenge: string;
  mostHelpfulActivity: string;
  actionCommitment: string;
  date: string;
}
