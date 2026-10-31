import { User, StudentProgress, LearningStyle, SchoolClass } from '../types';

export const INITIAL_CLASSES: SchoolClass[] = [
  {
    id: 'cls-x3',
    name: 'KELAS X 3',
    phase: 'Fase E',
    academicYear: '2025/2026',
    teacherName: 'Wandra Arasdi, M.Pd.',
  },
  {
    id: 'cls-x1',
    name: 'KELAS X 1',
    phase: 'Fase E',
    academicYear: '2025/2026',
    teacherName: 'Wandra Arasdi, M.Pd.',
  },
  {
    id: 'cls-x2',
    name: 'KELAS X 2',
    phase: 'Fase E',
    academicYear: '2025/2026',
    teacherName: 'Wandra Arasdi, M.Pd.',
  },
  {
    id: 'cls-xi1',
    name: 'KELAS XI 1',
    phase: 'Fase F',
    academicYear: '2025/2026',
    teacherName: 'Wandra Arasdi, M.Pd.',
  },
];

export const TEACHER_USER: User = {
  id: 'teacher-1',
  name: 'Wandra Arasdi, M.Pd.',
  username: 'wandra.arasdi',
  email: 'wandra.arasdi@mpd-digpai.sch.id',
  role: 'teacher',
  gender: 'Laki-laki',
  initialPassword: 'admin123',
  learningStyle: 'visual',
  classId: 'cls-x3',
  className: 'KELAS X 3',
};

// 36 Peserta Didik KELAS X 3
export const INITIAL_STUDENTS_RAW: {
  id: string;
  name: string;
  username: string;
  gender: 'Laki-laki' | 'Perempuan';
  initialPassword: string;
  learningStyle: LearningStyle;
  nisn: string;
}[] = [
  { id: 'std-01', name: 'ASSYFA KIRANI ARPIS', username: 'assyfa.kirani', gender: 'Perempuan', initialPassword: 'Siswa#7381', learningStyle: 'visual', nisn: '0068192001' },
  { id: 'std-02', name: 'AULIA RAHMADANI', username: 'aulia.rahmadani', gender: 'Perempuan', initialPassword: 'Siswa#9284', learningStyle: 'auditory', nisn: '0068192002' },
  { id: 'std-03', name: 'AZAHRA RIZQI FAQIH ASHIFFA', username: 'azahra.rizqi', gender: 'Perempuan', initialPassword: 'Siswa#1942', learningStyle: 'kinesthetic', nisn: '0068192003' },
  { id: 'std-04', name: 'CANTIKA', username: 'cantika.pai', gender: 'Perempuan', initialPassword: 'Siswa#5521', learningStyle: 'visual', nisn: '0068192004' },
  { id: 'std-05', name: 'DWI VALENA SEFTA', username: 'dwi.valena', gender: 'Perempuan', initialPassword: 'Siswa#8341', learningStyle: 'auditory', nisn: '0068192005' },
  { id: 'std-06', name: 'FAYZATUL NURHIDAYATI', username: 'fayzatul.nur', gender: 'Perempuan', initialPassword: 'Siswa#4190', learningStyle: 'visual', nisn: '0068192006' },
  { id: 'std-07', name: 'FEBBY NAYSHILA NAFSIR', username: 'febby.nayshila', gender: 'Perempuan', initialPassword: 'Siswa#6218', learningStyle: 'kinesthetic', nisn: '0068192007' },
  { id: 'std-08', name: 'FIKA YULISTIA', username: 'fika.yulistia', gender: 'Perempuan', initialPassword: 'Siswa#3892', learningStyle: 'visual', nisn: '0068192008' },
  { id: 'std-09', name: 'GHALIN QARIRAH PUTRI', username: 'ghalin.qarirah', gender: 'Perempuan', initialPassword: 'Siswa#7123', learningStyle: 'auditory', nisn: '0068192009' },
  { id: 'std-10', name: 'GIBRAN ALVARO SABIL', username: 'gibran.alvaro', gender: 'Laki-laki', initialPassword: 'Siswa#9932', learningStyle: 'kinesthetic', nisn: '0068192010' },
  { id: 'std-11', name: 'GRACIA MIAN TIAR SIMAMORA', username: 'gracia.mian', gender: 'Perempuan', initialPassword: 'Siswa#4412', learningStyle: 'visual', nisn: '0068192011' },
  { id: 'std-12', name: 'HAFIZ RAMADAN HAKIM', username: 'hafiz.ramadan', gender: 'Laki-laki', initialPassword: 'Siswa#8201', learningStyle: 'auditory', nisn: '0068192012' },
  { id: 'std-13', name: 'HAFIZATUL HUSNA', username: 'hafizatul.husna', gender: 'Perempuan', initialPassword: 'Siswa#2371', learningStyle: 'visual', nisn: '0068192013' },
  { id: 'std-14', name: 'HANA HABRIYAH', username: 'hana.habriyah', gender: 'Perempuan', initialPassword: 'Siswa#6509', learningStyle: 'kinesthetic', nisn: '0068192014' },
  { id: 'std-15', name: 'HANY RADIKA PUTRI', username: 'hany.radika', gender: 'Perempuan', initialPassword: 'Siswa#3182', learningStyle: 'visual', nisn: '0068192015' },
  { id: 'std-16', name: 'INAYAH MEYZAHIRAH', username: 'inayah.meyzahira', gender: 'Perempuan', initialPassword: 'Siswa#7829', learningStyle: 'auditory', nisn: '0068192016' },
  { id: 'std-17', name: 'IRFAN NATA BEQUEREL', username: 'irfan.nata', gender: 'Laki-laki', initialPassword: 'Siswa#1129', learningStyle: 'kinesthetic', nisn: '0068192017' },
  { id: 'std-18', name: 'JESICA KASIH EBRIANI TAMPUBOLON', username: 'jesica.kasih', gender: 'Perempuan', initialPassword: 'Siswa#9031', learningStyle: 'visual', nisn: '0068192018' },
  { id: 'std-19', name: 'KADZIA AUDREY', username: 'kadzia.audrey', gender: 'Perempuan', initialPassword: 'Siswa#5402', learningStyle: 'auditory', nisn: '0068192019' },
  { id: 'std-20', name: 'KARLIUS SITOFAN ZEGA', username: 'karlius.sitofan', gender: 'Laki-laki', initialPassword: 'Siswa#8721', learningStyle: 'kinesthetic', nisn: '0068192020' },
  { id: 'std-21', name: 'KHUSNUL KHATIMA', username: 'khusnul.khatima', gender: 'Perempuan', initialPassword: 'Siswa#3391', learningStyle: 'visual', nisn: '0068192021' },
  { id: 'std-22', name: 'LEDI LOVELY HAREFA', username: 'ledi.lovely', gender: 'Perempuan', initialPassword: 'Siswa#4819', learningStyle: 'auditory', nisn: '0068192022' },
  { id: 'std-23', name: 'LYDIA HELVRIYAN KARIMAH', username: 'lydia.helvriyan', gender: 'Perempuan', initialPassword: 'Siswa#6290', learningStyle: 'visual', nisn: '0068192023' },
  { id: 'std-24', name: 'MAR AKILA', username: 'mar.akila', gender: 'Perempuan', initialPassword: 'Siswa#7418', learningStyle: 'kinesthetic', nisn: '0068192024' },
  { id: 'std-25', name: 'NAGIL ABIBIE ABSHI', username: 'nagil.abibie', gender: 'Laki-laki', initialPassword: 'Siswa#8820', learningStyle: 'visual', nisn: '0068192025' },
  { id: 'std-26', name: 'NOR AURA', username: 'nor.aura', gender: 'Perempuan', initialPassword: 'Siswa#1938', learningStyle: 'auditory', nisn: '0068192026' },
  { id: 'std-27', name: 'QHAISHAR NADHIF DZIHNI ASMARA', username: 'qhaishar.nadhif', gender: 'Laki-laki', initialPassword: 'Siswa#9521', learningStyle: 'kinesthetic', nisn: '0068192027' },
  { id: 'std-28', name: 'RIDIBA DWICO', username: 'ridiba.dwico', gender: 'Laki-laki', initialPassword: 'Siswa#2209', learningStyle: 'visual', nisn: '0068192028' },
  { id: 'std-29', name: 'ROFIFAH RAMADHANIA', username: 'rofifah.ramadhania', gender: 'Perempuan', initialPassword: 'Siswa#7718', learningStyle: 'auditory', nisn: '0068192029' },
  { id: 'std-30', name: 'SASSI KIRANA MASAYU INDRA', username: 'sassi.kirana', gender: 'Perempuan', initialPassword: 'Siswa#3901', learningStyle: 'visual', nisn: '0068192030' },
  { id: 'std-31', name: 'TEDDY ARDIAN', username: 'teddy.ardian', gender: 'Perempuan', initialPassword: 'Siswa#6482', learningStyle: 'kinesthetic', nisn: '0068192031' },
  { id: 'std-32', name: 'TIARA JESICA WULANDARI', username: 'tiara.jesica', gender: 'Perempuan', initialPassword: 'Siswa#8193', learningStyle: 'visual', nisn: '0068192032' },
  { id: 'std-33', name: 'WIFAQ AZIZAH', username: 'wifaq.azizah', gender: 'Perempuan', initialPassword: 'Siswa#4029', learningStyle: 'auditory', nisn: '0068192033' },
  { id: 'std-34', name: 'WILDAN ADE RIANSAH', username: 'wildan.ade', gender: 'Laki-laki', initialPassword: 'Siswa#5731', learningStyle: 'kinesthetic', nisn: '0068192034' },
  { id: 'std-35', name: 'YUNANDIRA DIAN PRASTIWI', username: 'yunandira.dian', gender: 'Perempuan', initialPassword: 'Siswa#2940', learningStyle: 'visual', nisn: '0068192035' },
  { id: 'std-36', name: 'ZILZA YUNITA', username: 'zilza.yunita', gender: 'Perempuan', initialPassword: 'Siswa#7611', learningStyle: 'visual', nisn: '0068192036' },
];

export const INITIAL_STUDENTS: User[] = INITIAL_STUDENTS_RAW.map((s) => ({
  id: s.id,
  name: s.name,
  username: s.username,
  email: `${s.username}@siswa.mpd-digpai.sch.id`,
  role: 'student',
  gender: s.gender,
  initialPassword: s.initialPassword,
  learningStyle: s.learningStyle,
  classId: 'cls-x3',
  className: 'KELAS X 3',
  nisn: s.nisn,
}));

// Precomputed grades and progress metrics for the 36 students
export const INITIAL_PROGRESS_DATA: StudentProgress[] = INITIAL_STUDENTS.map((s, idx) => {
  const dScore = 75 + ((idx * 7) % 25);
  const fScore = 78 + ((idx * 11) % 22);
  const tScore = 80 + ((idx * 13) % 20);
  const sScore = 76 + ((idx * 9) % 24);
  const finalScore = Math.round((dScore * 0.15) + (fScore * 0.25) + (tScore * 0.3) + (sScore * 0.3));

  let grade: 'A' | 'B+' | 'B' | 'C+' | 'C' = 'B';
  if (finalScore >= 90) grade = 'A';
  else if (finalScore >= 83) grade = 'B+';
  else if (finalScore >= 75) grade = 'B';
  else if (finalScore >= 68) grade = 'C+';
  else grade = 'C';

  const engagement = Math.min(100, Math.max(65, 70 + ((idx * 17) % 31)));
  const completedMats = Math.min(9, Math.max(5, 6 + (idx % 4)));

  return {
    studentId: s.id,
    studentName: s.name,
    diagnostikScore: dScore,
    formatifScore: fScore,
    tugasScore: tScore,
    sumatifScore: sScore,
    finalScore,
    grade,
    engagementPercent: engagement,
    completedMaterialsCount: completedMats,
    submittedTask: idx % 6 !== 0,
    submittedReflection: idx % 5 !== 0,
    status: finalScore >= 75 ? 'Tuntas' : 'Perlu Bimbingan',
  };
});
