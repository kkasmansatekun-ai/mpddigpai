-- =====================================================================
-- MPD-DigPAI (Media Pembelajaran Digital Pendidikan Agama Islam)
-- Database Dump for MySQL / MariaDB / phpMyAdmin
-- Compatible with: InfinityFree, cPanel, Rumahweb, XAMPP, Laragon, Cloud SQL
-- Generated for: SMA / SMK Fase E & F (Kelas X 3)
-- Guru Pengampu: Wandra Arasdi, M.Pd.
-- =====================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Table structure for table `school_classes`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `school_classes` (
  `id` varchar(32) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phase` varchar(50) NOT NULL DEFAULT 'Fase E',
  `academic_year` varchar(50) NOT NULL DEFAULT '2025/2026',
  `teacher_name` varchar(150) NOT NULL DEFAULT 'Wandra Arasdi, M.Pd.',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping data for table `school_classes`
-- --------------------------------------------------------

INSERT INTO `school_classes` (`id`, `name`, `phase`, `academic_year`, `teacher_name`) VALUES
('cls-x1', 'KELAS X 1', 'Fase E', '2025/2026', 'Wandra Arasdi, M.Pd.'),
('cls-x2', 'KELAS X 2', 'Fase E', '2025/2026', 'Wandra Arasdi, M.Pd.'),
('cls-x3', 'KELAS X 3', 'Fase E', '2025/2026', 'Wandra Arasdi, M.Pd.'),
('cls-xi1', 'KELAS XI 1', 'Fase F', '2025/2026', 'Wandra Arasdi, M.Pd.')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(64) NOT NULL,
  `class_id` varchar(32) DEFAULT NULL,
  `class_name` varchar(100) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `role` enum('teacher','student') NOT NULL DEFAULT 'student',
  `gender` enum('Laki-laki','Perempuan') NOT NULL DEFAULT 'Perempuan',
  `initial_password` varchar(100) NOT NULL,
  `learning_style` enum('visual','auditory','kinesthetic') NOT NULL DEFAULT 'visual',
  `nisn` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  KEY `users_class_id_fk` (`class_id`),
  CONSTRAINT `fk_users_class` FOREIGN KEY (`class_id`) REFERENCES `school_classes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping data for table `users` (Teacher + 36 Students)
-- --------------------------------------------------------

INSERT INTO `users` (`id`, `class_id`, `class_name`, `name`, `username`, `email`, `role`, `gender`, `initial_password`, `learning_style`, `nisn`) VALUES
('teacher-1', 'cls-x3', 'KELAS X 3', 'Wandra Arasdi, M.Pd.', 'wandra.arasdi', 'wandra.arasdi@mpd-digpai.sch.id', 'teacher', 'Laki-laki', 'admin123', 'visual', '198402152010011005'),
('std-01', 'cls-x3', 'KELAS X 3', 'ASSYFA KIRANI ARPIS', 'assyfa.kirani', 'assyfa.kirani@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#7381', 'visual', '0068192001'),
('std-02', 'cls-x3', 'KELAS X 3', 'AULIA RAHMADANI', 'aulia.rahmadani', 'aulia.rahmadani@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#9284', 'auditory', '0068192002'),
('std-03', 'cls-x3', 'KELAS X 3', 'AZAHRA RIZQI FAQIH ASHIFFA', 'azahra.rizqi', 'azahra.rizqi@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#1942', 'kinesthetic', '0068192003'),
('std-04', 'cls-x3', 'KELAS X 3', 'CANTIKA', 'cantika.pai', 'cantika.pai@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#5521', 'visual', '0068192004'),
('std-05', 'cls-x3', 'KELAS X 3', 'DWI VALENA SEFTA', 'dwi.valena', 'dwi.valena@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#8341', 'auditory', '0068192005'),
('std-06', 'cls-x3', 'KELAS X 3', 'FAYZATUL NURHIDAYATI', 'fayzatul.nur', 'fayzatul.nur@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#4190', 'visual', '0068192006'),
('std-07', 'cls-x3', 'KELAS X 3', 'FEBBY NAYSHILA NAFSIR', 'febby.nayshila', 'febby.nayshila@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#6218', 'kinesthetic', '0068192007'),
('std-08', 'cls-x3', 'KELAS X 3', 'FIKA YULISTIA', 'fika.yulistia', 'fika.yulistia@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#3892', 'visual', '0068192008'),
('std-09', 'cls-x3', 'KELAS X 3', 'GHALIN QARIRAH PUTRI', 'ghalin.qarirah', 'ghalin.qarirah@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#7123', 'auditory', '0068192009'),
('std-10', 'cls-x3', 'KELAS X 3', 'GIBRAN ALVARO SABIL', 'gibran.alvaro', 'gibran.alvaro@siswa.mpd-digpai.sch.id', 'student', 'Laki-laki', 'Siswa#9932', 'kinesthetic', '0068192010'),
('std-11', 'cls-x3', 'KELAS X 3', 'GRACIA MIAN TIAR SIMAMORA', 'gracia.mian', 'gracia.mian@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#4412', 'visual', '0068192011'),
('std-12', 'cls-x3', 'KELAS X 3', 'HAFIZ RAMADAN HAKIM', 'hafiz.ramadan', 'hafiz.ramadan@siswa.mpd-digpai.sch.id', 'student', 'Laki-laki', 'Siswa#8201', 'auditory', '0068192012'),
('std-13', 'cls-x3', 'KELAS X 3', 'HAFIZATUL HUSNA', 'hafizatul.husna', 'hafizatul.husna@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#2371', 'visual', '0068192013'),
('std-14', 'cls-x3', 'KELAS X 3', 'HANA HABRIYAH', 'hana.habriyah', 'hana.habriyah@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#6509', 'kinesthetic', '0068192014'),
('std-15', 'cls-x3', 'KELAS X 3', 'HANY RADIKA PUTRI', 'hany.radika', 'hany.radika@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#3182', 'visual', '0068192015'),
('std-16', 'cls-x3', 'KELAS X 3', 'INAYAH MEYZAHIRAH', 'inayah.meyzahira', 'inayah.meyzahira@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#7829', 'auditory', '0068192016'),
('std-17', 'cls-x3', 'KELAS X 3', 'IRFAN NATA BEQUEREL', 'irfan.nata', 'irfan.nata@siswa.mpd-digpai.sch.id', 'student', 'Laki-laki', 'Siswa#1129', 'kinesthetic', '0068192017'),
('std-18', 'cls-x3', 'KELAS X 3', 'JESICA KASIH EBRIANI TAMPUBOLON', 'jesica.kasih', 'jesica.kasih@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#9031', 'visual', '0068192018'),
('std-19', 'cls-x3', 'KELAS X 3', 'KADZIA AUDREY', 'kadzia.audrey', 'kadzia.audrey@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#5402', 'auditory', '0068192019'),
('std-20', 'cls-x3', 'KELAS X 3', 'KARLIUS SITOFAN ZEGA', 'karlius.sitofan', 'karlius.sitofan@siswa.mpd-digpai.sch.id', 'student', 'Laki-laki', 'Siswa#8721', 'kinesthetic', '0068192020'),
('std-21', 'cls-x3', 'KELAS X 3', 'KHUSNUL KHATIMA', 'khusnul.khatima', 'khusnul.khatima@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#3391', 'visual', '0068192021'),
('std-22', 'cls-x3', 'KELAS X 3', 'LEDI LOVELY HAREFA', 'ledi.lovely', 'ledi.lovely@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#4819', 'auditory', '0068192022'),
('std-23', 'cls-x3', 'KELAS X 3', 'LYDIA HELVRIYAN KARIMAH', 'lydia.helvriyan', 'lydia.helvriyan@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#6290', 'visual', '0068192023'),
('std-24', 'cls-x3', 'KELAS X 3', 'MAR AKILA', 'mar.akila', 'mar.akila@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#7418', 'kinesthetic', '0068192024'),
('std-25', 'cls-x3', 'KELAS X 3', 'NAGIL ABIBIE ABSHI', 'nagil.abibie', 'nagil.abibie@siswa.mpd-digpai.sch.id', 'student', 'Laki-laki', 'Siswa#8820', 'visual', '0068192025'),
('std-26', 'cls-x3', 'KELAS X 3', 'NOR AURA', 'nor.aura', 'nor.aura@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#1938', 'auditory', '0068192026'),
('std-27', 'cls-x3', 'KELAS X 3', 'QHAISHAR NADHIF DZIHNI ASMARA', 'qhaishar.nadhif', 'qhaishar.nadhif@siswa.mpd-digpai.sch.id', 'student', 'Laki-laki', 'Siswa#9521', 'kinesthetic', '0068192027'),
('std-28', 'cls-x3', 'KELAS X 3', 'RIDIBA DWICO', 'ridiba.dwico', 'ridiba.dwico@siswa.mpd-digpai.sch.id', 'student', 'Laki-laki', 'Siswa#2209', 'visual', '0068192028'),
('std-29', 'cls-x3', 'KELAS X 3', 'ROFIFAH RAMADHANIA', 'rofifah.ramadhania', 'rofifah.ramadhania@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#7718', 'auditory', '0068192029'),
('std-30', 'cls-x3', 'KELAS X 3', 'SASSI KIRANA MASAYU INDRA', 'sassi.kirana', 'sassi.kirana@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#3901', 'visual', '0068192030'),
('std-31', 'cls-x3', 'KELAS X 3', 'TEDDY ARDIAN', 'teddy.ardian', 'teddy.ardian@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#6482', 'kinesthetic', '0068192031'),
('std-32', 'cls-x3', 'KELAS X 3', 'TIARA JESICA WULANDARI', 'tiara.jesica', 'tiara.jesica@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#8193', 'visual', '0068192032'),
('std-33', 'cls-x3', 'KELAS X 3', 'WIFAQ AZIZAH', 'wifaq.azizah', 'wifaq.azizah@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#4029', 'auditory', '0068192033'),
('std-34', 'cls-x3', 'KELAS X 3', 'WILDAN ADE RIANSAH', 'wildan.ade', 'wildan.ade@siswa.mpd-digpai.sch.id', 'student', 'Laki-laki', 'Siswa#5731', 'kinesthetic', '0068192034'),
('std-35', 'cls-x3', 'KELAS X 3', 'YUNANDIRA DIAN PRASTIWI', 'yunandira.dian', 'yunandira.dian@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#2940', 'visual', '0068192035'),
('std-36', 'cls-x3', 'KELAS X 3', 'ZILZA YUNITA', 'zilza.yunita', 'zilza.yunita@siswa.mpd-digpai.sch.id', 'student', 'Perempuan', 'Siswa#7611', 'visual', '0068192036')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `initial_password`=VALUES(`initial_password`), `learning_style`=VALUES(`learning_style`);

-- --------------------------------------------------------
-- Table structure for table `topics`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `topics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(30) NOT NULL,
  `title` varchar(200) NOT NULL,
  `dalil_quran` text DEFAULT NULL,
  `dalil_arti` text DEFAULT NULL,
  `summary` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping data for table `topics`
-- --------------------------------------------------------

INSERT INTO `topics` (`id`, `code`, `title`, `dalil_quran`, `dalil_arti`, `summary`) VALUES
(1, 'TOPIC-01', 'Hakikat & Filosofi Media Sosial dalam Perspektif Islam', 'QS. Al-Hujurat: 6', 'Wahai orang-orang yang beriman! Jika seseorang yang fasik datang kepadamu membawa suatu berita, maka telitilah kebenarannya (tabayyun)...', 'Media sosial merupakan amanah teknologi yang wajib diiringi kesadaran muraqabah (pengawasan Allah)'),
(2, 'TOPIC-02', 'Prinsip Tabayyun & Anti Hoaks Digital', 'QS. Al-Isra: 36', 'Dan janganlah kamu mengikuti sesuatu yang tidak kamu ketahui. Sesungguhnya pendengaran, penglihatan, dan hati nurani, semua itu akan diminta pertanggungjawabannya.', 'Verifikasi sumber primer sebelum mempercayai atau membagikan postingan (Zero-Trust to unverified claims)'),
(3, 'TOPIC-03', 'Adab Komunikasi Islami (Qaulan Sadida, Baligha, Karima)', 'QS. Al-Ahzab: 70', 'Wahai orang-orang yang beriman! Bertakwalah kamu kepada Allah dan ucapkanlah perkataan yang benar (qaulan sadida).', 'Membiasakan etika berkomentar yang santun, bebas ujaran kebencian, gibah, namimah, dan sarkasme')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- --------------------------------------------------------
-- Table structure for table `materials`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `materials` (
  `id` varchar(50) NOT NULL,
  `topic_id` int(11) DEFAULT 1,
  `title` varchar(200) NOT NULL,
  `learning_style` enum('visual','auditory','kinesthetic','all') NOT NULL DEFAULT 'all',
  `media_type` enum('infographic','video','audio_podcast','interactive_simulation','article') NOT NULL,
  `duration_min` int(11) DEFAULT 10,
  `content_summary` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping data for table `materials` (9 Media Pembelajaran Berdiferensiasi)
-- --------------------------------------------------------

INSERT INTO `materials` (`id`, `topic_id`, `title`, `learning_style`, `media_type`, `duration_min`, `content_summary`) VALUES
('mat-v1', 1, 'Infografik Anatomi Tabayyun & Digital Filter', 'visual', 'infographic', 8, 'Infografis visual panduan 5 langkah saring sebelum sharing'),
('mat-v2', 2, 'Peta Konsep 6 Prinsip Qaulan dalam Islam', 'visual', 'infographic', 10, 'Diagram relasi qaulan sadida, baligha, karima, layyina, maisura, maysura'),
('mat-v3', 3, 'Motion Slide: Jejak Digital di Akhirat', 'visual', 'video', 12, 'Animasi ilustratif pertanggungjawaban tiap like, share, dan comment'),
('mat-a1', 1, 'Podcast Suara Hikmah: Menjaga Jempol di Medsos', 'auditory', 'audio_podcast', 15, 'Audio kajian tematik bersama praktisi dan ustadz seputar adab WhatsApp & Instagram'),
('mat-a2', 2, 'Murottal & Tadabbur QS. Al-Hujurat 6 & 12', 'auditory', 'audio_podcast', 12, 'Tilawah tartil dilengkapi intonasi tafsir terjemahan bahasa Indonesia'),
('mat-a3', 3, 'Diskusi Naratif: Bahaya Dosa Jariyah Cyber-Bullying', 'auditory', 'audio_podcast', 14, 'Wawancara audio studi kasus dampak psikologis korban komentar jahat'),
('mat-k1', 1, 'Simulasi Interaktif Detektif Tabayyun Berita Medsos', 'kinesthetic', 'interactive_simulation', 20, 'Studi kasus interaktif memilih opsi aksi klarifikasi berita viral'),
('mat-k2', 2, 'Roleplay Laboratorium Cerdas Bermedsos', 'kinesthetic', 'interactive_simulation', 25, 'Praktik membuat konten edukatif kampanye anti-hoaks di platform kelas'),
('mat-k3', 3, 'Studi Kasus Gamifikasi Dilema Etika Online', 'kinesthetic', 'interactive_simulation', 20, 'Skenario bercabang pengambilan keputusan saat terjadi fitnah di grup kelas')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- --------------------------------------------------------
-- Table structure for table `student_progress`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `student_progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` varchar(64) NOT NULL,
  `student_name` varchar(150) NOT NULL,
  `diagnostik_score` int(11) NOT NULL DEFAULT 80,
  `formatif_score` int(11) NOT NULL DEFAULT 82,
  `tugas_score` int(11) NOT NULL DEFAULT 85,
  `sumatif_score` int(11) NOT NULL DEFAULT 84,
  `final_score` int(11) NOT NULL DEFAULT 83,
  `grade` enum('A','B+','B','C+','C') NOT NULL DEFAULT 'B',
  `engagement_percent` int(11) NOT NULL DEFAULT 85,
  `completed_materials_count` int(11) NOT NULL DEFAULT 7,
  `submitted_task` tinyint(1) NOT NULL DEFAULT 1,
  `submitted_reflection` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('Tuntas','Perlu Bimbingan') NOT NULL DEFAULT 'Tuntas',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_student_progress_id` (`student_id`),
  CONSTRAINT `fk_progress_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping data for table `student_progress` (36 Siswa Nilai & Progres)
-- --------------------------------------------------------

INSERT INTO `student_progress` (`student_id`, `student_name`, `diagnostik_score`, `formatif_score`, `tugas_score`, `sumatif_score`, `final_score`, `grade`, `engagement_percent`, `completed_materials_count`, `submitted_task`, `submitted_reflection`, `status`) VALUES
('std-01', 'ASSYFA KIRANI ARPIS', 75, 78, 80, 76, 78, 'B', 70, 6, 0, 0, 'Tuntas'),
('std-02', 'AULIA RAHMADANI', 82, 89, 93, 85, 88, 'B+', 87, 7, 1, 1, 'Tuntas'),
('std-03', 'AZAHRA RIZQI FAQIH ASHIFFA', 89, 78, 86, 94, 86, 'B+', 73, 8, 1, 1, 'Tuntas'),
('std-04', 'CANTIKA', 96, 89, 99, 79, 90, 'A', 90, 9, 1, 1, 'Tuntas'),
('std-05', 'DWI VALENA SEFTA', 78, 78, 92, 88, 85, 'B+', 76, 6, 1, 1, 'Tuntas'),
('std-06', 'FAYZATUL NURHIDAYATI', 85, 89, 85, 77, 83, 'B+', 93, 7, 1, 0, 'Tuntas'),
('std-07', 'FEBBY NAYSHILA NAFSIR', 92, 78, 78, 86, 82, 'B', 79, 8, 0, 1, 'Tuntas'),
('std-08', 'FIKA YULISTIA', 99, 89, 91, 95, 93, 'A', 96, 9, 1, 1, 'Tuntas'),
('std-09', 'GHALIN QARIRAH PUTRI', 81, 78, 84, 80, 81, 'B', 82, 6, 1, 1, 'Tuntas'),
('std-10', 'GIBRAN ALVARO SABIL', 88, 89, 97, 89, 91, 'A', 99, 7, 1, 1, 'Tuntas'),
('std-11', 'GRACIA MIAN TIAR SIMAMORA', 95, 78, 90, 78, 84, 'B+', 85, 8, 1, 0, 'Tuntas'),
('std-12', 'HAFIZ RAMADAN HAKIM', 77, 89, 83, 87, 85, 'B+', 71, 9, 1, 1, 'Tuntas'),
('std-13', 'HAFIZATUL HUSNA', 84, 78, 96, 96, 89, 'B+', 88, 6, 0, 1, 'Tuntas'),
('std-14', 'HANA HABRIYAH', 91, 89, 89, 81, 87, 'B+', 74, 7, 1, 1, 'Tuntas'),
('std-15', 'HANY RADIKA PUTRI', 98, 78, 82, 90, 86, 'B+', 91, 8, 1, 1, 'Tuntas'),
('std-16', 'INAYAH MEYZAHIRAH', 80, 89, 95, 75, 85, 'B+', 77, 9, 1, 0, 'Tuntas'),
('std-17', 'IRFAN NATA BEQUEREL', 87, 78, 88, 84, 84, 'B+', 94, 6, 1, 1, 'Tuntas'),
('std-18', 'JESICA KASIH EBRIANI TAMPUBOLON', 94, 89, 81, 93, 89, 'B+', 80, 7, 1, 1, 'Tuntas'),
('std-19', 'KADZIA AUDREY', 76, 78, 94, 78, 83, 'B+', 97, 8, 0, 1, 'Tuntas'),
('std-20', 'KARLIUS SITOFAN ZEGA', 83, 89, 87, 87, 87, 'B+', 83, 9, 1, 1, 'Tuntas'),
('std-21', 'KHUSNUL KHATIMA', 90, 78, 80, 96, 86, 'B+', 69, 6, 1, 0, 'Tuntas'),
('std-22', 'LEDI LOVELY HAREFA', 97, 89, 93, 81, 89, 'B+', 86, 7, 1, 1, 'Tuntas'),
('std-23', 'LYDIA HELVRIYAN KARIMAH', 79, 78, 86, 90, 84, 'B+', 72, 8, 1, 1, 'Tuntas'),
('std-24', 'MAR AKILA', 86, 89, 99, 75, 87, 'B+', 89, 9, 1, 1, 'Tuntas'),
('std-25', 'NAGIL ABIBIE ABSHI', 93, 78, 92, 84, 86, 'B+', 75, 6, 0, 1, 'Tuntas'),
('std-26', 'NOR AURA', 75, 89, 85, 93, 87, 'B+', 92, 7, 1, 0, 'Tuntas'),
('std-27', 'QHAISHAR NADHIF DZIHNI ASMARA', 82, 78, 78, 78, 79, 'B', 78, 8, 1, 1, 'Tuntas'),
('std-28', 'RIDIBA DWICO', 89, 89, 91, 87, 89, 'B+', 95, 9, 1, 1, 'Tuntas'),
('std-29', 'ROFIFAH RAMADHANIA', 96, 78, 84, 96, 88, 'B+', 81, 6, 1, 1, 'Tuntas'),
('std-30', 'SASSI KIRANA MASAYU INDRA', 78, 89, 97, 81, 87, 'B+', 98, 7, 1, 0, 'Tuntas'),
('std-31', 'TEDDY ARDIAN', 85, 78, 90, 90, 86, 'B+', 84, 8, 0, 1, 'Tuntas'),
('std-32', 'TIARA JESICA WULANDARI', 92, 89, 83, 75, 84, 'B+', 70, 9, 1, 1, 'Tuntas'),
('std-33', 'WIFAQ AZIZAH', 99, 78, 96, 84, 88, 'B+', 87, 6, 1, 1, 'Tuntas'),
('std-34', 'WILDAN ADE RIANSAH', 81, 89, 89, 93, 89, 'B+', 73, 7, 1, 1, 'Tuntas'),
('std-35', 'YUNANDIRA DIAN PRASTIWI', 88, 78, 82, 78, 81, 'B', 90, 8, 1, 0, 'Tuntas'),
('std-36', 'ZILZA YUNITA', 95, 89, 95, 87, 91, 'A', 76, 9, 1, 1, 'Tuntas')
ON DUPLICATE KEY UPDATE `final_score`=VALUES(`final_score`), `grade`=VALUES(`grade`);

-- --------------------------------------------------------
-- Table structure for table `student_submissions`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `student_submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` varchar(64) NOT NULL,
  `class_id` varchar(32) DEFAULT 'cls-x3',
  `title` varchar(255) NOT NULL,
  `product_type` enum('Infografis Canva','Video Pendek TikTok/Reels','Audio Podcast Edukasi','Artikel Analisis Kasus','Slide Presentasi') NOT NULL,
  `file_url` text NOT NULL,
  `notes` text DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `teacher_feedback` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `submissions_student_fk` (`student_id`),
  CONSTRAINT `fk_submissions_student` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping sample data for table `student_submissions`
-- --------------------------------------------------------

INSERT INTO `student_submissions` (`student_id`, `class_id`, `title`, `product_type`, `file_url`, `notes`, `score`, `teacher_feedback`) VALUES
('std-04', 'cls-x3', 'Poster Infografis 5 Langkah Tabayyun di WhatsApp Grup', 'Infografis Canva', 'https://example.com/portofolio/std-04/infografis-tabayyun.png', 'Dibuat dengan Canva Pro palet islami hijau toska', 95, 'Kombinasi warna dan dalil Al-Qur\'an sangat tepat. Pertahankan!'),
('std-08', 'cls-x3', 'Video Edukasi Adab Menegur Teman Tanpa Menghina', 'Video Pendek TikTok/Reels', 'https://example.com/portofolio/std-08/video-adab-teguran.mp4', 'Format vertikal 9:16 durasi 60 detik', 94, 'Narasi persuasif dan etika penyampaian sangat santun.'),
('std-10', 'cls-x3', 'Mini Podcast: Mengapa Hoaks Cepat Menyebar Menurut Psikologi & Islam', 'Audio Podcast Edukasi', 'https://example.com/portofolio/std-10/podcast-hoaks.mp3', 'Direkam dengan mic lavalier suara jernih', 92, 'Analisis dalil QS. Al-Hujurat ayat 6 sangat mendalam.')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
