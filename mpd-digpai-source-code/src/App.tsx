import React, { useState, useEffect } from 'react';
import { User, LearningStyle, StudentProgress, SchoolClass } from './types';
import { TEACHER_USER, INITIAL_STUDENTS, INITIAL_PROGRESS_DATA, INITIAL_CLASSES } from './data/studentsData';
import { HeaderTopbar } from './components/HeaderTopbar';
import { Sidebar, PageId } from './components/Sidebar';
import {
  getClassesFromFirestore,
  getStudentsFromFirestore,
  getProgressFromFirestore,
  saveClassToFirestore,
  deleteClassFromFirestore,
  saveStudentToFirestore,
  deleteStudentFromFirestore,
  updateStudentPasswordInFirestore,
  updateStudentLearningStyleInFirestore,
  saveProgressToFirestore,
  seedAllDataToFirestore,
  FirebaseSyncStatus,
} from './services/firebaseService';

// 11 Core Pages, Auth & Specialized Panels
import { LoginPage } from './components/pages/LoginPage';
import { HomePage } from './components/pages/HomePage';
import { PetunjukPage } from './components/pages/PetunjukPage';
import { TujuanPage } from './components/pages/TujuanPage';
import { MateriPage } from './components/pages/MateriPage';
import { SumberBelajarPage } from './components/pages/SumberBelajarPage';
import { AktivitasPage } from './components/pages/AktivitasPage';
import { TugasProdukPage } from './components/pages/TugasProdukPage';
import { DiskusiPage } from './components/pages/DiskusiPage';
import { AsesmenPage } from './components/pages/AsesmenPage';
import { RefleksiPage } from './components/pages/RefleksiPage';
import { PerkembanganPage } from './components/pages/PerkembanganPage';
import { KelolaKelasPage } from './components/pages/KelolaKelasPage';
import { ManajemenSiswaPage } from './components/pages/ManajemenSiswaPage';
import { PrintAccountsView } from './components/pages/PrintAccountsView';
import { PrintGradesView } from './components/pages/PrintGradesView';
import { LaravelArchitecturePage } from './components/pages/LaravelArchitecturePage';
import { DatabaseExportPage } from './components/pages/DatabaseExportPage';

import { Menu, Flame, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Session persistence across page reloads
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('mpd_auth_user');
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('mpd_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return TEACHER_USER;
  });

  // Data persistence with localStorage + Firestore sync
  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem('mpd_classes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_CLASSES;
  });

  const [activeClass, setActiveClass] = useState<SchoolClass>(() => {
    const savedClassId = localStorage.getItem('mpd_active_class_id');
    const savedClasses = localStorage.getItem('mpd_classes');
    if (savedClasses && savedClassId) {
      try {
        const parsed: SchoolClass[] = JSON.parse(savedClasses);
        const found = parsed.find((c) => c.id === savedClassId);
        if (found) return found;
      } catch {}
    }
    return INITIAL_CLASSES[0];
  });

  const [students, setStudents] = useState<User[]>(() => {
    const saved = localStorage.getItem('mpd_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_STUDENTS;
  });

  const [progressList, setProgressList] = useState<StudentProgress[]>(() => {
    const saved = localStorage.getItem('mpd_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_PROGRESS_DATA;
  });

  const [activePage, setActivePage] = useState<PageId>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [firebaseStatus, setFirebaseStatus] = useState<FirebaseSyncStatus>({
    connected: true,
    message: 'Terhubung ke Google Firebase Firestore (mpd-digpai)'
  });
  const [cloudToast, setCloudToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setCloudToast({ message, type });
    setTimeout(() => {
      setCloudToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Load from Firestore on mount & merge with local data
  useEffect(() => {
    let isMounted = true;
    const loadFromCloud = async () => {
      try {
        const [cloudClasses, cloudStudents, cloudProgress] = await Promise.all([
          getClassesFromFirestore(),
          getStudentsFromFirestore(),
          getProgressFromFirestore()
        ]);

        if (isMounted) {
          let hasCloudData = false;
          if (cloudClasses && cloudClasses.length > 0) {
            setClasses((prev) => {
              const classMap = new Map<string, SchoolClass>();
              cloudClasses.forEach((c) => classMap.set(c.id, c));
              // Retain any locally added classes not yet in cloud
              prev.forEach((c) => {
                if (!classMap.has(c.id)) {
                  classMap.set(c.id, c);
                  saveClassToFirestore(c).catch(console.warn);
                }
              });
              const merged = Array.from(classMap.values());
              localStorage.setItem('mpd_classes', JSON.stringify(merged));
              const savedActiveId = localStorage.getItem('mpd_active_class_id');
              const found = merged.find((c) => c.id === savedActiveId);
              setActiveClass(found || merged[0]);
              return merged;
            });
            hasCloudData = true;
          }
          if (cloudStudents && cloudStudents.length > 0) {
            setStudents((prev) => {
              const studentMap = new Map<string, User>();
              cloudStudents.forEach((s) => studentMap.set(s.id, s));
              prev.forEach((s) => {
                if (!studentMap.has(s.id)) {
                  studentMap.set(s.id, s);
                  saveStudentToFirestore(s).catch(console.warn);
                }
              });
              const merged = Array.from(studentMap.values());
              localStorage.setItem('mpd_students', JSON.stringify(merged));
              return merged;
            });
            hasCloudData = true;
          }
          if (cloudProgress && cloudProgress.length > 0) {
            setProgressList(cloudProgress);
            localStorage.setItem('mpd_progress', JSON.stringify(cloudProgress));
            hasCloudData = true;
          }
          setFirebaseStatus({
            connected: true,
            message: 'Terhubung ke Google Firebase Firestore (mpd-digpai)'
          });
          if (hasCloudData) {
            showToast('Data berhasil disinkronkan dari Firebase Firestore', 'success');
          }
        }
      } catch (e: any) {
        console.warn('Firestore fallback to local:', e);
        if (isMounted) {
          setFirebaseStatus({
            connected: false,
            message: 'Menggunakan penyimpanan lokal',
            error: e.message
          });
        }
      }
    };

    loadFromCloud();
    return () => {
      isMounted = false;
    };
  }, []);

  // One-click sync all initial data to Firestore
  const handleSyncAllToFirestore = async () => {
    return await seedAllDataToFirestore(classes, students, progressList);
  };

  // Class selection handler
  const handleSelectClass = (cls: SchoolClass) => {
    setActiveClass(cls);
    localStorage.setItem('mpd_active_class_id', cls.id);
  };

  // All users combined (Teacher + 36 Students)
  const allUsers: User[] = [TEACHER_USER, ...students];

  // Login handler with session storage
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('mpd_auth_user', JSON.stringify(user));
    setActivePage('home');
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('mpd_auth_user');
    setIsAuthenticated(false);
  };

  // Reset password handler
  const handleResetPassword = (studentId: string) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randomPart = '';
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newPass = `Pai#${randomPart}${Math.floor(100 + Math.random() * 900)}`;

    let targetStudentName = '';
    let targetUsername = '';

    setStudents((prev) => {
      const updated = prev.map((s) => {
        if (s.id === studentId) {
          targetStudentName = s.name;
          targetUsername = s.username;
          return {
            ...s,
            initialPassword: newPass,
          };
        }
        return s;
      });
      localStorage.setItem('mpd_students', JSON.stringify(updated));
      return updated;
    });

    // Save to Firestore asynchronously
    updateStudentPasswordInFirestore(studentId, newPass)
      .then(() => showToast(`Sandi akun ${targetStudentName} berhasil disimpan ke Firebase ✓`, 'success'))
      .catch((err) => console.warn('Sync password to Firestore error:', err));

    return {
      studentName: targetStudentName,
      username: targetUsername,
      newPass,
    };
  };

  // Quick edit learning style for a specific student directly from the table
  const handleUpdateStudentLearningStyle = (studentId: string, style: LearningStyle) => {
    setStudents((prev) => {
      const updated = prev.map((s) => (s.id === studentId ? { ...s, learningStyle: style } : s));
      localStorage.setItem('mpd_students', JSON.stringify(updated));
      return updated;
    });
    if (currentUser.id === studentId) {
      setCurrentUser((prev) => ({ ...prev, learningStyle: style }));
    }
    updateStudentLearningStyleInFirestore(studentId, style)
      .then(() => showToast('Gaya belajar siswa berhasil diperbarui di Firebase ✓', 'success'))
      .catch((err) => console.warn('Sync learning style to Firestore error:', err));
  };

  const handleAddStudent = (newStudent: User) => {
    const newProg: StudentProgress = {
      studentId: newStudent.id,
      studentName: newStudent.name,
      diagnostikScore: 80,
      formatifScore: 80,
      tugasScore: 85,
      sumatifScore: 82,
      finalScore: 82,
      grade: 'B+',
      engagementPercent: 75,
      completedMaterialsCount: 5,
      submittedTask: false,
      submittedReflection: false,
      status: 'Tuntas',
    };

    setStudents((prev) => {
      const updated = [newStudent, ...prev];
      localStorage.setItem('mpd_students', JSON.stringify(updated));
      return updated;
    });

    setProgressList((prev) => {
      const updated = [newProg, ...prev];
      localStorage.setItem('mpd_progress', JSON.stringify(updated));
      return updated;
    });

    // Save to Firestore
    Promise.all([saveStudentToFirestore(newStudent), saveProgressToFirestore(newProg)])
      .then(() => showToast(`Siswa ${newStudent.name} berhasil disimpan ke database Firebase ✓`, 'success'))
      .catch((err) => console.warn('Sync student to Firestore error:', err));
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => {
      const updated = prev.filter((s) => s.id !== studentId);
      localStorage.setItem('mpd_students', JSON.stringify(updated));
      return updated;
    });
    setProgressList((prev) => {
      const updated = prev.filter((p) => p.studentId !== studentId);
      localStorage.setItem('mpd_progress', JSON.stringify(updated));
      return updated;
    });

    deleteStudentFromFirestore(studentId)
      .then(() => showToast('Data siswa berhasil dihapus dari database Firebase', 'info'))
      .catch((err) => console.warn('Delete student from Firestore error:', err));
  };

  const handleAddClass = (newCls: SchoolClass) => {
    setClasses((prev) => {
      const updated = [...prev, newCls];
      localStorage.setItem('mpd_classes', JSON.stringify(updated));
      return updated;
    });
    // Immediately select new class as active class!
    setActiveClass(newCls);
    localStorage.setItem('mpd_active_class_id', newCls.id);

    saveClassToFirestore(newCls)
      .then(() => showToast(`Kelas ${newCls.name} berhasil disimpan ke Firebase ✓`, 'success'))
      .catch((err) => console.warn('Save class to Firestore error:', err));
  };

  const handleUpdateClass = (updatedCls: SchoolClass) => {
    setClasses((prev) => {
      const updated = prev.map((c) => (c.id === updatedCls.id ? updatedCls : c));
      localStorage.setItem('mpd_classes', JSON.stringify(updated));
      return updated;
    });
    if (activeClass.id === updatedCls.id) {
      setActiveClass(updatedCls);
      localStorage.setItem('mpd_active_class_id', updatedCls.id);
    }
    saveClassToFirestore(updatedCls)
      .then(() => showToast(`Kelas ${updatedCls.name} berhasil diperbarui di Firebase ✓`, 'success'))
      .catch((err) => console.warn('Update class in Firestore error:', err));
  };

  const handleDeleteClass = (classId: string) => {
    if (classes.length <= 1) return;
    setClasses((prev) => {
      const updated = prev.filter((c) => c.id !== classId);
      localStorage.setItem('mpd_classes', JSON.stringify(updated));
      return updated;
    });
    if (activeClass.id === classId) {
      const remaining = classes.filter((c) => c.id !== classId);
      setActiveClass(remaining[0]);
      localStorage.setItem('mpd_active_class_id', remaining[0].id);
    }
    deleteClassFromFirestore(classId)
      .then(() => showToast('Kelas berhasil dihapus dari database Firebase', 'info'))
      .catch((err) => console.warn('Delete class error:', err));
  };

  const handleUpdateLearningStyle = (style: LearningStyle) => {
    setCurrentUser((prev) => ({ ...prev, learningStyle: style }));
    if (currentUser.role === 'student') {
      setStudents((prev) =>
        prev.map((s) => (s.id === currentUser.id ? { ...s, learningStyle: style } : s))
      );
      updateStudentLearningStyleInFirestore(currentUser.id, style).catch((err) =>
        console.warn('Update learning style in Firestore error:', err)
      );
    }
  };

  const handleSaveSummativeScore = (score: number) => {
    setProgressList((prev) =>
      prev.map((p) => {
        if (p.studentId === currentUser.id) {
          const finalScore = Math.round(
            p.diagnostikScore * 0.15 +
              p.formatifScore * 0.25 +
              p.tugasScore * 0.3 +
              score * 0.3
          );
          let grade: 'A' | 'B+' | 'B' | 'C+' | 'C' = 'B';
          if (finalScore >= 90) grade = 'A';
          else if (finalScore >= 83) grade = 'B+';
          else if (finalScore >= 75) grade = 'B';
          else if (finalScore >= 68) grade = 'C+';
          else grade = 'C';

          const updatedProg: StudentProgress = {
            ...p,
            sumatifScore: score,
            finalScore,
            grade,
            status: finalScore >= 75 ? 'Tuntas' : 'Perlu Bimbingan',
          };

          // Save to Firestore
          saveProgressToFirestore(updatedProg).catch((err) =>
            console.warn('Save summative score to Firestore error:', err)
          );

          return updatedProg;
        }
        return p;
      })
    );
  };

  // If logged out, render the Login Page
  if (!isAuthenticated) {
    return <LoginPage allUsers={allUsers} onLoginSuccess={handleLoginSuccess} />;
  }

  // If in Print Mode, render cleanly without sidebar and topbar
  if (activePage === 'print-accounts') {
    return (
      <PrintAccountsView
        students={students}
        activeClass={activeClass}
        onBack={() => setActivePage('students-management')}
      />
    );
  }

  if (activePage === 'print-grades') {
    return (
      <PrintGradesView
        students={students}
        progressList={progressList}
        activeClass={activeClass}
        onBack={() => setActivePage('students-management')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex antialiased">
      {/* SIDEBAR NAVIGATION (COLLAPSIBLE) */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        currentUser={currentUser}
        activeClass={activeClass}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header Bar Toggle */}
        <div className="no-print lg:hidden bg-emerald-950 text-white px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1.5 rounded-lg bg-emerald-800 text-emerald-100 hover:bg-emerald-700 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-center">
            <span className="font-extrabold text-sm tracking-wide">MPD-DigPAI</span>
            <span className="text-[11px] text-emerald-300 block -mt-0.5">
              Media Pembelajaran Digital PAI
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-[10px] bg-rose-900/60 text-rose-200 px-2 py-1 rounded-md"
          >
            Keluar
          </button>
        </div>

        {/* TOPBAR WIDGET WAKTU SHOLAT & USER SWITCHER */}
        <HeaderTopbar
          currentUser={currentUser}
          allUsers={allUsers}
          activeClass={activeClass}
          allClasses={classes}
          onSelectClass={handleSelectClass}
          onSelectUser={(u) => setCurrentUser(u)}
          onOpenLaravelCode={() => setActivePage('laravel-code')}
          onOpenDatabaseBackup={() => setActivePage('database-backup')}
          onLogout={handleLogout}
          firebaseStatus={firebaseStatus}
          onSyncAllToFirestore={handleSyncAllToFirestore}
        />

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activePage === 'classes-management' && (
            <KelolaKelasPage
              classes={classes}
              activeClass={activeClass}
              students={students}
              onSelectActiveClass={handleSelectClass}
              onAddClass={handleAddClass}
              onUpdateClass={handleUpdateClass}
              onDeleteClass={handleDeleteClass}
              onNavigateToStudents={() => setActivePage('students-management')}
            />
          )}

          {activePage === 'database-backup' && (
            <DatabaseExportPage
              students={students}
              progressList={progressList}
              activeClass={activeClass}
              currentUser={currentUser}
            />
          )}

          {activePage === 'home' && (
            <HomePage
              onNavigate={(p) => setActivePage(p)}
              currentUser={currentUser}
              activeClass={activeClass}
            />
          )}

          {activePage === 'instructions' && <PetunjukPage />}

          {activePage === 'objectives' && <TujuanPage />}

          {activePage === 'materials' && <MateriPage />}

          {activePage === 'resources' && <SumberBelajarPage />}

          {activePage === 'activities' && (
            <AktivitasPage
              currentUser={currentUser}
              onUpdateLearningStyle={handleUpdateLearningStyle}
              onSubmitProductSuccess={() => {
                setActivePage('submissions');
              }}
            />
          )}

          {activePage === 'submissions' && <TugasProdukPage currentUser={currentUser} />}

          {activePage === 'discussions' && <DiskusiPage currentUser={currentUser} />}

          {activePage === 'assessments' && (
            <AsesmenPage
              currentUser={currentUser}
              onSaveSummativeScore={handleSaveSummativeScore}
            />
          )}

          {activePage === 'reflections' && <RefleksiPage currentUser={currentUser} />}

          {activePage === 'progress' && (
            <PerkembanganPage progressList={progressList} currentUser={currentUser} />
          )}

          {activePage === 'students-management' && (
            <ManajemenSiswaPage
              students={students}
              activeClass={activeClass}
              allClasses={classes}
              onSelectClass={handleSelectClass}
              onResetPassword={handleResetPassword}
              onUpdateStudentLearningStyle={handleUpdateStudentLearningStyle}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
              onNavigateToPrintAccounts={() => setActivePage('print-accounts')}
              onNavigateToPrintGrades={() => setActivePage('print-grades')}
              onNavigateToDatabaseBackup={() => setActivePage('database-backup')}
            />
          )}

          {activePage === 'laravel-code' && <LaravelArchitecturePage />}
        </main>
      </div>

      {/* Floating Firebase Cloud Toast Notification */}
      {cloudToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border bg-slate-900/95 backdrop-blur-md text-white border-amber-500/40 animate-fade-in">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
          <span className="text-xs font-medium text-slate-100">{cloudToast.message}</span>
          <button
            onClick={() => setCloudToast(null)}
            className="text-slate-400 hover:text-white text-xs ml-2 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
