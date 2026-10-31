import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SchoolClass, User, StudentProgress, LearningStyle } from '../types';

export interface FirebaseSyncStatus {
  connected: boolean;
  message: string;
  error?: string;
}

// Collections in Firestore
const CLASSES_COLLECTION = 'classes';
const STUDENTS_COLLECTION = 'students';
const PROGRESS_COLLECTION = 'student_progress';

// Helper to check connection
export async function testFirestoreConnection(): Promise<FirebaseSyncStatus> {
  try {
    const colRef = collection(db, '_connection_test');
    await getDocs(colRef);
    return { connected: true, message: 'Terhubung ke Firebase Firestore (mpd-digpai)' };
  } catch (err: any) {
    console.warn('Firebase connection check:', err);
    return {
      connected: false,
      message: 'Belum dapat terhubung ke Firestore',
      error: err.message || String(err)
    };
  }
}

// 1. CLASSES
export async function getClassesFromFirestore(): Promise<SchoolClass[] | null> {
  try {
    const querySnapshot = await getDocs(collection(db, CLASSES_COLLECTION));
    if (querySnapshot.empty) return null;
    const list: SchoolClass[] = [];
    querySnapshot.forEach((d) => {
      list.push(d.data() as SchoolClass);
    });
    return list;
  } catch (error) {
    console.warn('Gagal memuat kelas dari Firestore:', error);
    return null;
  }
}

export async function saveClassToFirestore(cls: SchoolClass): Promise<void> {
  try {
    await setDoc(doc(db, CLASSES_COLLECTION, cls.id), cls);
  } catch (error) {
    console.error('Gagal menyimpan kelas ke Firestore:', error);
    throw error;
  }
}

export async function deleteClassFromFirestore(classId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CLASSES_COLLECTION, classId));
  } catch (error) {
    console.error('Gagal menghapus kelas dari Firestore:', error);
    throw error;
  }
}

// 2. STUDENTS
export async function getStudentsFromFirestore(): Promise<User[] | null> {
  try {
    const querySnapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
    if (querySnapshot.empty) return null;
    const list: User[] = [];
    querySnapshot.forEach((d) => {
      list.push(d.data() as User);
    });
    return list;
  } catch (error) {
    console.warn('Gagal memuat siswa dari Firestore:', error);
    return null;
  }
}

export async function saveStudentToFirestore(student: User): Promise<void> {
  try {
    await setDoc(doc(db, STUDENTS_COLLECTION, student.id), student);
  } catch (error) {
    console.error('Gagal menyimpan siswa ke Firestore:', error);
    throw error;
  }
}

export async function deleteStudentFromFirestore(studentId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, STUDENTS_COLLECTION, studentId));
  } catch (error) {
    console.error('Gagal menghapus siswa dari Firestore:', error);
    throw error;
  }
}

export async function updateStudentPasswordInFirestore(studentId: string, newPassword: string): Promise<void> {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
    await updateDoc(studentRef, { initialPassword: newPassword });
  } catch (error) {
    console.error('Gagal update password di Firestore:', error);
    throw error;
  }
}

export async function updateStudentLearningStyleInFirestore(studentId: string, style: LearningStyle): Promise<void> {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
    await updateDoc(studentRef, { learningStyle: style });
  } catch (error) {
    console.error('Gagal update learning style di Firestore:', error);
  }
}

// 3. PROGRESS
export async function getProgressFromFirestore(): Promise<StudentProgress[] | null> {
  try {
    const querySnapshot = await getDocs(collection(db, PROGRESS_COLLECTION));
    if (querySnapshot.empty) return null;
    const list: StudentProgress[] = [];
    querySnapshot.forEach((d) => {
      list.push(d.data() as StudentProgress);
    });
    return list;
  } catch (error) {
    console.warn('Gagal memuat progres dari Firestore:', error);
    return null;
  }
}

export async function saveProgressToFirestore(progress: StudentProgress): Promise<void> {
  try {
    await setDoc(doc(db, PROGRESS_COLLECTION, progress.studentId), progress);
  } catch (error) {
    console.error('Gagal menyimpan nilai/progres ke Firestore:', error);
  }
}

// 4. SEED INITIAL DATA TO FIRESTORE (One-Click Migration)
export async function seedAllDataToFirestore(
  classes: SchoolClass[],
  students: User[],
  progressList: StudentProgress[]
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    let count = 0;
    // Save classes
    for (const c of classes) {
      await setDoc(doc(db, CLASSES_COLLECTION, c.id), c);
      count++;
    }
    // Save students
    for (const s of students) {
      await setDoc(doc(db, STUDENTS_COLLECTION, s.id), s);
      count++;
    }
    // Save progress
    for (const p of progressList) {
      await setDoc(doc(db, PROGRESS_COLLECTION, p.studentId), p);
      count++;
    }
    return { success: true, count };
  } catch (error: any) {
    console.error('Error saat seed data ke Firestore:', error);
    return {
      success: false,
      count: 0,
      error: error.message || 'Periksa aturan Security Rules di Firebase Console'
    };
  }
}
