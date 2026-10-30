import React, { useState } from 'react';
import { User, LearningStyle, StudentProgress, SchoolClass } from './types';
import { TEACHER_USER, INITIAL_STUDENTS, INITIAL_PROGRESS_DATA, INITIAL_CLASSES } from './data/studentsData';
import { HeaderTopbar } from './components/HeaderTopbar';
import { Sidebar, PageId } from './components/Sidebar';

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

import { Menu } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User>(TEACHER_USER);
  const [classes, setClasses] = useState<SchoolClass[]>(INITIAL_CLASSES);
  const [activeClass, setActiveClass] = useState<SchoolClass>(INITIAL_CLASSES[0]);
  const [students, setStudents] = useState<User[]>(INITIAL_STUDENTS);
  const [progressList, setProgressList] = useState<StudentProgress[]>(INITIAL_PROGRESS_DATA);
  const [activePage, setActivePage] = useState<PageId>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // All users combined (Teacher + 36 Students)
  const allUsers: User[] = [TEACHER_USER, ...students];

  // Login handler
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActivePage('home');
  };

  // Logout handler
  const handleLogout = () => {
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

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          targetStudentName = s.name;
          targetUsername = s.username;
          return {
            ...s,
            initialPassword: newPass,
          };
        }
        return s;
      })
    );

    return {
      studentName: targetStudentName,
      username: targetUsername,
      newPass,
    };
  };

  // Quick edit learning style for a specific student directly from the table
  const handleUpdateStudentLearningStyle = (studentId: string, style: LearningStyle) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, learningStyle: style } : s))
    );
    if (currentUser.id === studentId) {
      setCurrentUser((prev) => ({ ...prev, learningStyle: style }));
    }
  };

  const handleAddStudent = (newStudent: User) => {
    setStudents((prev) => [newStudent, ...prev]);
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
    setProgressList((prev) => [newProg, ...prev]);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setProgressList((prev) => prev.filter((p) => p.studentId !== studentId));
  };

  const handleAddClass = (newCls: SchoolClass) => {
    setClasses((prev) => [...prev, newCls]);
  };

  const handleUpdateClass = (updatedCls: SchoolClass) => {
    setClasses((prev) => prev.map((c) => (c.id === updatedCls.id ? updatedCls : c)));
    if (activeClass.id === updatedCls.id) {
      setActiveClass(updatedCls);
    }
  };

  const handleDeleteClass = (classId: string) => {
    if (classes.length <= 1) return;
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    if (activeClass.id === classId) {
      const remaining = classes.filter((c) => c.id !== classId);
      setActiveClass(remaining[0]);
    }
  };

  const handleUpdateLearningStyle = (style: LearningStyle) => {
    setCurrentUser((prev) => ({ ...prev, learningStyle: style }));
    if (currentUser.role === 'student') {
      setStudents((prev) =>
        prev.map((s) => (s.id === currentUser.id ? { ...s, learningStyle: style } : s))
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

          return {
            ...p,
            sumatifScore: score,
            finalScore,
            grade,
            status: finalScore >= 75 ? 'Tuntas' : 'Perlu Bimbingan',
          };
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
          onSelectClass={(cls) => setActiveClass(cls)}
          onSelectUser={(u) => setCurrentUser(u)}
          onOpenLaravelCode={() => setActivePage('laravel-code')}
          onOpenDatabaseBackup={() => setActivePage('database-backup')}
        />

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activePage === 'classes-management' && (
            <KelolaKelasPage
              classes={classes}
              activeClass={activeClass}
              students={students}
              onSelectActiveClass={(cls) => setActiveClass(cls)}
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
    </div>
  );
}
