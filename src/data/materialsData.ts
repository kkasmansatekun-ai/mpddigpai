import { MaterialItem, ActivityItem, DiscussionComment, AssessmentQuestion } from '../types';

export const LEARNING_MATERIALS: MaterialItem[] = [
  {
    id: 'mat-teks',
    type: 'teks',
    title: 'Prinsip Tabayyun & Dalil Syar’i Etika Digital',
    subtitle: 'Kajian Teks Al-Qur’an, Hadis Shahih & 6 Kaidah Komunikasi Islam',
    badge: 'Teks & Dalil',
    duration: '15 Menit Baca',
    summary: 'Mendalami teks QS. Al-Hujurat: 6, QS. Al-Isra: 36, serta kaidah Qaulan Sadida dalam berinteraksi di ruang siber.',
    contentData: {
      surah: {
        name: 'QS. Al-Hujurat [49] : 6',
        arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِنْ جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا أَنْ تُصِيبُوا قَوْمًا بِجَهَالَةٍ فَتُصْبِحُوا عَلَىٰ مَا فَعَلْتُمْ نَادِمِينَ',
        translation: '“Wahai orang-orang yang beriman! Jika seseorang yang fasik datang kepadamu membawa suatu berita, maka telitilah kebenarannya (tabayyun), agar kamu tidak mencelakakan suatu kaum karena kebodohan (kecerobohan), yang akhirnya kamu menyesali perbuatanmu itu.”',
      },
      hadits: {
        source: 'HR. Bukhari no. 6018 & Muslim no. 47',
        arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
        translation: '“Barangsiapa beriman kepada Allah dan hari akhir, hendaklah ia berkata yang baik atau diam.”',
      },
      kaidah: [
        { term: 'Qaulan Sadida', surah: 'QS. An-Nisa: 9', meaning: 'Perkataan yang benar, jujur, akurat, dan tidak manipulatif.' },
        { term: 'Qaulan Baligha', surah: 'QS. An-Nisa: 63', meaning: 'Perkataan yang lugas, komunikatif, dan menyentuh nurani pembaca.' },
        { term: 'Qaulan Ma’rufa', surah: 'QS. Al-Baqarah: 235', meaning: 'Perkataan yang santun, pantas, serta sesuai norma masyarakat.' },
        { term: 'Qaulan Karima', surah: 'QS. Al-Isra: 23', meaning: 'Perkataan mulia yang menghormati harkat dan martabat lawan bicara.' },
        { term: 'Qaulan Layyina', surah: 'QS. Thaha: 44', meaning: 'Perkataan yang lemah lembut, menghindari provokasi dan ujaran kebencian.' },
        { term: 'Qaulan Maysura', surah: 'QS. Al-Isra: 28', meaning: 'Perkataan yang menyenangkan hati, membangkitkan harapan, dan tidak kasar.' },
      ],
    },
  },
  {
    id: 'mat-gambar',
    type: 'gambar',
    title: 'Galeri Ilustrasi Visual: Etika Jari & Adab Layar',
    subtitle: 'Representasi Visual Perilaku Positif vs Destruktif di Media Sosial',
    badge: 'Gambar & Ilustrasi',
    duration: '8 Menit Eksplorasi',
    summary: 'Visualisasi etika digital, metafora hisab jejak maya, dan filter 3 lapis sebelum menekan tombol bagikan.',
    contentData: [
      {
        title: 'Filter Tiga Lapis Sebelum Posting',
        tag: 'Prinsip Pencegahan',
        desc: 'Apakah informasi ini Benar? Bermanfaat? Mendesak/Penting? Jika tidak memenuhi ketiganya, tahan jemarimu.',
        accent: 'from-emerald-500 to-teal-600',
        points: ['Uji Kebenaran (Fact Check)', 'Uji Manfaat (No Sia-sia)', 'Uji Keamanan Hati (No Riya/Ghibah)']
      },
      {
        title: 'Jejak Digital Adalah Rekaman Malaikat',
        tag: 'Kesiapan Hisab',
        desc: 'Setiap ketukan keyboard, like, share, dan retweet tersimpan abadi di server dunia dan kitab hisab akhirat (QS. Qaf: 18).',
        accent: 'from-amber-500 to-emerald-600',
        points: ['Tercatat oleh Raqib & Atid', 'Bisa menjadi amal jariyah kebaikan', 'Waspada dosa jariyah keburukan']
      },
      {
        title: 'Menolak Cyberbullying & Body Shaming',
        tag: 'Ukhuwah Digital',
        desc: 'Islam melarang merendahkan sesama (QS. Al-Hujurat: 11). Menjaga kehormatan saudara muslim adalah kewajiban mutlak.',
        accent: 'from-rose-500 to-emerald-700',
        points: ['Jangan ikut merundung / doxxing', 'Laporkan konten intimidasi', 'Kirimkan kalimat penghibur / empati']
      }
    ]
  },
  {
    id: 'mat-infografis',
    type: 'infografis',
    title: 'Infografis Ringkas: Panduan Bermedsos Sesuai Syariat',
    subtitle: 'SOP Netizen Muslim dalam Menghadapi Kabar Viral & Provokasi',
    badge: 'Infografis Interaktif',
    duration: '10 Menit Baca',
    summary: 'Diagram alur langkah verifikasi pesan berantai WhatsApp, Twitter/X, Instagram, dan TikTok.',
    contentData: {
      steps: [
        { num: '01', title: 'Tahan Emosi & Jangan Buru-buru Forward', desc: 'Bila menjumpai judul bombastis (clickbait), tenang dan istighfar sejenak.' },
        { num: '02', title: 'Cek Kredibilitas Sumber Primer', desc: 'Apakah berasal dari instansi resmi atau portal terverifikasi Dewan Pers?' },
        { num: '03', title: 'Periksa Tanggal & Konteks Peristiwa', desc: 'Seringkali video lawas didaur ulang untuk memantik kegaduhan isu SARA.' },
        { num: '04', title: 'Lakukan Reverse Image Search', desc: 'Periksa keaslian foto dengan Google Lens atau Fact-Check Kemenkominfo/TurnBackHoax.' },
        { num: '05', title: 'Konsultasikan pada Ahli / Guru PAI', desc: 'Jika menyangkut dalil agama atau fatwa, tanyakan pada guru terpercaya.' },
        { num: '06', title: 'Klarifikasi Santun Tanpa Menghakimi', desc: 'Jika menemukan teman membagikan hoaks, ingatkan via jalur pribadi (DM/Japri).' }
      ]
    }
  },
  {
    id: 'mat-video',
    type: 'video',
    title: 'Video Pembelajaran: Hukum & Bahaya Hoaks di Era Digital',
    subtitle: 'Bedah Fatwa MUI No. 24/2017 & Ancaman Dosa Jariyah Fitnah Digital',
    badge: 'Video Edukasi',
    duration: '12 Menit Tonton',
    summary: 'Kajian interaktif mendalam mengupas dampak psikologis hoaks, ancaman pidana UU ITE, serta tinjauan fiqih muamalah.',
    contentData: {
      videoTitle: 'Adab dan Etika Bermedia Sosial Perspektif PAI Kelas X (KELAS X 3 - Fase E)',
      speaker: 'Wandra Arasdi, M.Pd.',
      videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', // simulated embed placeholder with full fallbacks
      timestamps: [
        { time: '00:00', title: 'Pembuka: Realitas Kehidupan Remaja di Algoritma Medsos' },
        { time: '02:45', title: 'Konsep Tabayyun & Kisah Al-Ifki (Fitnah Aisyah RA)' },
        { time: '06:10', title: '5 Bahaya Fatal Fitnah & Cyberbullying bagi Korban' },
        { time: '09:20', title: 'Panduan Praktis: Menjadikan Medsos Ladang Syiar Kebaikan' },
      ],
      keyTakeaways: [
        'Hukum memproduksi dan menyebarkan konten palsu adalah HARAM mutlak.',
        'Ketiadaan tatap muka di dunia maya tidak menggugurkan hisab dosa atas lisan dan jari jemari.',
        'Medsos hendaknya diisi dengan konten edukatif, menyebarkan nilai toleransi, dan inspirasi amal shaleh.'
      ]
    }
  },
  {
    id: 'mat-audio',
    type: 'audio',
    title: 'Kajian Suara (Audio): Menjaga Lisan Digital & Hati Nurani',
    subtitle: 'Podcast Inspirasi Ruhani Bersama Guru PAI Wandra Arasdi, M.Pd.',
    badge: 'Audio / Podcast',
    duration: '9 Menit Dengarkan',
    summary: 'Rekaman audio reflektif yang mengasah kepekaan spiritual siswa saat berselancar di dunia maya.',
    contentData: {
      audioTitle: 'Podcast Seri 04: Menahan Jemari, Menyelamatkan Negeri',
      speaker: 'Wandra Arasdi, M.Pd. (Guru PAI)',
      transcript: `Assalamu’alaikum Warahmatullahi Wabarakatuh.
Anak-anakku yang dirahmati Allah, dunia maya kini telah menjadi perpanjangan ruang hidup kita. Dari bangun tidur hingga hendak terlelap, gawai genggam tak pernah lepas dari tangan.
Namun ingatlah, Allah Subhanahu wa Ta’ala mengingatkan kita dalam Surah Al-Isra ayat 36:
"Sesungguhnya pendengaran, penglihatan, dan hati nurani, semuanya itu akan diminta pertanggungjawabannya di hadapan Allah."

Dahulu, para ulama berhati-hati dalam berucap satu kata. Hari ini, sebuah status singkat atau komentar sarkasme dapat dibaca ribuan pasang mata dalam hitungan detik. Jika yang disebarkan fitnah, maka ribuan orang menjadi saksi fitnah tersebut.
Marilah kita bertekad: Jadikan setiap ketukan jemari kita saksi pembela kita di hadapan Allah kelak. Jangan jadikan gawai kita jalan menuju kemaksiatan digital.
Wassalamu’alaikum Warahmatullahi Wabarakatuh.`
    }
  },
  {
    id: 'mat-presentasi',
    type: 'presentasi',
    title: 'Slide Presentasi Interaktif: Etika Komunikasi Siber PAI',
    subtitle: 'Slide Deck Pembelajaran 6 Bagian Siap Diskusi Kelas',
    badge: 'Slide Interaktif',
    duration: '6 Slide Presentasi',
    summary: 'Navigasi interaktif slide ringkasan materi untuk presentasi tatap muka maupun belajar mandiri.',
    contentData: {
      slides: [
        {
          num: 1,
          title: 'Tantangan Moral di Era Digital Society 5.0',
          bullets: [
            'Arus informasi yang sangat deras (Information Overload)',
            'Algoritma media sosial yang memprioritaskan sensasi & polarisasi',
            'Penurunan empati sosial akibat anonimitas (Online Disinhibition Effect)',
            'Urgensi nilai keimanan sebagai kompas moral bermedia sosial'
          ]
        },
        {
          num: 2,
          title: 'Prinsip Tabayyun: Sikap Kritis Seorang Mukmin',
          bullets: [
            'Tabayyun bermakna mencari kejelasan fakta sebelum menyimpulkan',
            'Al-Qur’an mengajarkan kita untuk tidak langsung mempercayai kabar fasik',
            'Kisah fitnah Al-Ifki membuktikan bahaya gosip yang tidak diverifikasi',
            'Langkah Tabayyun: Konfirmasi pelaku, cek sumber, uji dampak kemaslahatan'
          ]
        },
        {
          num: 3,
          title: 'Kaidah Komunikasi Islami di Ruang Digital',
          bullets: [
            'Qaulan Sadida: Mengetik data valid, tanpa hoaks atau distorsi fakta',
            'Qaulan Baligha: Memilih diksi tepat sasaran dan mudah dipahami',
            'Qaulan Karima: Menghormati pendapat yang berbeda tanpa mencaci',
            'Qaulan Layyina: Menyampaikan kritik secara beradab dan santun'
          ]
        },
        {
          num: 4,
          title: 'Dosa-Dosa Digital yang Kerap Diabaikan',
          bullets: [
            'Ghibah Digital: Menggunjing aib orang lain lewat story atau chat grup',
            'Namīmah Digital: Mengadu domba dengan tangkapan layar (screenshot)',
            'Cyberbullying: Menghina fisik (body shaming) dan memprovokasi massa (cancel culture)',
            'Dosa Jariyah: Menyebarkan konten maksiat yang terus ditonton orang lain'
          ]
        },
        {
          num: 5,
          title: 'Fatwa MUI No. 24 Tahun 2017',
          bullets: [
            'Mengharamkan setiap muslim menyebarkan hoaks, fitnah, dan namimah',
            'Mengharamkan mencari-cari kesalahan orang lain (tajassus)',
            'Mengharamkan memproduksi atau memfasilitasi ujaran kebencian',
            'Mewajibkan konten kreator muslim menyebarkan pesan perdamaian & kebajikan'
          ]
        },
        {
          num: 6,
          title: 'Komitmen Muslim Berkarakter di Dunia Maya',
          bullets: [
            'Niatkan bersosial media untuk silaturahmi dan menuntut ilmu',
            'Saring sebelum sharing: Pikirkan hisab akhirat sebelum menekan tombol kirim',
            'Hadirkan konten kreatif bernilai dakwah dan inspirasi kebaikan',
            'Doakan kebaikan bagi sesama dan hindari debat kusir di kolom komentar'
          ]
        }
      ]
    }
  },
  {
    id: 'mat-kasus',
    type: 'kasus',
    title: 'Studi Kasus Kontekstual: Analisis Masalah di Kalangan Remaja',
    subtitle: '3 Kasus Nyata: Hoaks Bencana, Perundungan Siber & Akun Menfess',
    badge: 'Studi Kasus',
    duration: '20 Menit Analisis',
    summary: 'Latihan berpikir kritis dan analitis mengkaji fenomena hoaks dan cyberbullying dari kacamata syariat dan hukum positif.',
    contentData: [
      {
        id: 'case-1',
        title: 'Kasus 1: Viralitas Donasi Palsu di Grup WhatsApp Kelas',
        scenario: 'Sebuah broadcast pesan berantai menyebarkan nomor rekening pribadi untuk donasi darurat operasi teman sekelas yang mengalami kecelakaan fatal. Tanpa mengecek kebenaran ke wali kelas, 15 siswa langsung mentransfer uang dan mem-forward ke grup keluarga. Ternyata teman tersebut dalam kondisi sehat dan nomor rekening tersebut milik sindikat penipuan online.',
        analysisQuestions: [
          'Prinsip syar’i apakah yang dilanggar oleh para siswa yang langsung mem-forward pesan tersebut?',
          'Bagaimana seharusnya alur tabayyun yang benar dijalankan sebelum membagikan permohonan donasi?',
          'Bagaimana etika mengingatkan anggota grup yang terlanjur menyebarkan pesan tersebut?'
        ],
        solution: 'Penyebaran pesan tanpa verifikasi melanggar perintah QS. Al-Hujurat ayat 6. Alur tabayyun: hubungi wali kelas atau orang tua siswa bersangkutan terlebih dahulu. Mengingatkan teman harus dengan Qaulan Layyina (secara pribadi/japri) agar tidak mempermalukannya di depan publik.'
      },
      {
        id: 'case-2',
        title: 'Kasus 2: Komentar Sarkas & Cyberbullying Terhadap Siswa Berprestasi',
        scenario: 'Rizki berhasil menjuarai lomba tahfidz tingkat kota. Ketika fotonya diunggah di akun media sosial OSIS, beberapa akun anonim berkomentar sinis: "Paling menang karena kenal juri", dan mencemooh penampilannya. Komentar tersebut memicu puluhan komentar negatif lainnya hingga Rizki merasa depresi dan enggan masuk sekolah.',
        analysisQuestions: [
          'Bagaimana pandangan Islam terhadap tindakan hasad (dengki) dan mencemooh kehormatan sesama mukmin?',
          'Apakah status akun anonim dapat menghindarkan seseorang dari hisab hisab Allah dan hukum UU ITE?',
          'Apa peran kita sebagai saksi digital ketika melihat perundungan berlangsung di media sosial?'
        ],
        solution: 'Tindakan ini tergolong perbuatan zalim dan hasad yang memakan kebaikan sebagaimana api membakar kayu kering (HR. Abu Dawud). Anonimitas hanya menipu manusia, namun di sisi Allah semua jari jemari bersaksi (QS. Yasin: 65). Sebagai saksi, kita wajib menolong yang dizalimi dengan kontra-narasi positif, memberi semangat pada korban, dan melaporkan akun perundung.'
      },
      {
        id: 'case-3',
        title: 'Kasus 3: Fitnah Akun Menfess & Penyebaran Tangkapan Layar Obrolan Pribadi',
        scenario: 'Sebuah tangkapan layar (screenshot) obrolan privat curhat diunggah ke akun confession (menfess) sekolah tanpa izin, memicu spekulasi liar dan fitnah yang merusak nama baik seorang siswi. Pihak yang mengunggah merasa tidak bersalah karena nama akun telah disensor samar-samar.',
        analysisQuestions: [
          'Apakah menyebarkan obrolan rahasia orang lain termasuk pengkhianatan amanah dalam Islam?',
          'Bagaimana tinjauan dosa namīmah (adu domba) dan ifki (kebohongan besar) dalam kasus ini?',
          'Apa langkah restorative justice syar’i yang harus ditempuh oleh pelaku?'
        ],
        solution: 'Menyebarkan rahasia orang lain adalah bentuk khianat terhadap amanah pergaulan. Dalam hadis: "Majelis-majelis itu dengan amanah" (HR. Abu Dawud). Pelaku wajib bertaubat nasuha, menghapus postingan, meminta maaf langsung kepada korban, dan melakukan rehabilitasi nama baik di kanal yang sama.'
      }
    ]
  },
  {
    id: 'mat-bacaan',
    type: 'bacaan',
    title: 'Sumber Bacaan Digital & Fatwa MUI No. 24/2017',
    subtitle: 'Naskah Lengkap Hukum dan Pedoman Bermuamalah Melalui Media Sosial',
    badge: 'E-Book & Fatwa',
    duration: '15 Menit Baca',
    summary: 'Rangkuman resmi fatwa MUI, landasan hukum positif UU ITE pasal 27-28, serta e-modul fikih komunikasi.',
    contentData: {
      fatwaTitle: 'Fatwa Majelis Ulama Indonesia No. 24 Tahun 2017',
      ketentuanHukum: [
        { poin: '1', hukum: 'Haram', desc: 'Melakukan ghibah, fitnah, namimah, dan penyebaran permusuhan.' },
        { poin: '2', hukum: 'Haram', desc: 'Melakukan bullying, ujaran kebencian (hate speech), dan permusuhan atas dasar suku, agama, ras, atau antar golongan.' },
        { poin: '3', hukum: 'Haram', desc: 'Menyebarkan hoax serta informasi bohong meskipun dengan tujuan baik, seperti informasi tentang kematian orang yang masih hidup.' },
        { poin: '4', hukum: 'Haram', desc: 'Menyebarkan materi pornografi, kemaksiatan, dan segala hal yang terlarang secara syar’i.' },
        { poin: '5', hukum: 'Haram', desc: 'Menyebarkan konten yang benar tetapi tidak sesuai dengan tempat atau waktunya (menimbulkan fitnah baru).' },
        { poin: '6', hukum: 'Wajib', desc: 'Bagi setiap muslim untuk melakukan tabayyun (klarifikasi) sebelum mempercayai dan menyebarkan berita.' }
      ]
    }
  },
  {
    id: 'mat-interaktif',
    type: 'interaktif',
    title: 'Aktivitas Interaktif: Checklist & Kuis Singkat Etika Digital',
    subtitle: 'Alat Evaluasi Mandiri Sikap Bermedia Sosial dengan Feedback Instan',
    badge: 'Checklist Mandiri',
    duration: '5 Menit Check',
    summary: '10 parameter checklist etika bermedsos harian untuk mengukur indeks kesalehan digital siswa.',
    contentData: {
      checklistItems: [
        'Saya selalu membaca artikel hingga tuntas sebelum menekan tombol bagikan (share).',
        'Saya memastikan kebenaran sumber berita sebelum mempercayainya.',
        'Saya tidak pernah mengunggah aib teman di story media sosial saya.',
        'Saya menggunakan bahasa yang santun saat berkomentar di akun publik.',
        'Saya tidak pernah ikut merundung atau mencaci orang lain di kolom komentar.',
        'Saya menghormati perbedaan pendapat tanpa menyerang pribadi lawan bicara.',
        'Saya membatasi waktu layar (screen time) agar sholat 5 waktu tetap terjaga tepat waktu.',
        'Saya menghapus atau tidak meneruskan pesan broadcast yang bernada ancaman/menakut-nakuti.',
        'Saya aktif membagikan konten yang bernilai ilmu, motivasi kebaikan, dan sedekah informasi.',
        'Saya meyakini bahwa Raqib dan Atid mencatat setiap ketikan jemari saya di smartphone.'
      ]
    }
  }
];

export const ACTIVITIES_DATA: ActivityItem[] = [
  {
    id: 'act-visual',
    style: 'visual',
    title: 'Aktivitas Gaya Belajar VISUAL: Desain Infografis & Mind Mapping Syar’i',
    subtitle: 'Analisis Visual Kampanye Etika Digital & Perancangan Poster Dakwah Digital',
    objective: 'Peserta didik mampu memetakan 6 prinsip komunikasi Islam ke dalam bentuk bagan konsep visual atau poster edukasi anti-hoaks.',
    instructions: [
      'Amati bagan infografis perbedaan Qaulan Sadida vs Ujaran Kebencian pada modul materi.',
      'Rancang satu buah infografis sederhana (menggunakan Canva atau gambar manual) bertema "Saring Sebelum Sharing: Panduan Netizen Shalih".',
      'Cantumkan minimal 1 dalil Al-Qur’an (QS. Al-Hujurat: 6 atau QS. Al-Isra: 36) beserta artinya.',
      'Gunakan kombinasi warna yang kontras, tipografi yang terbaca, dan ilustrasi yang santun.',
      'Unggah hasil karya poster digital dalam format JPG/PNG atau PDF ke menu Halaman Tugas.'
    ],
    actionPrompt: 'Tuangkan ide visualmu: Apa pesan utama poster yang akan kamu buat dan alasan pemilihan elemen visualnya?',
    expectedOutput: 'File Desain Poster / Infografis Digital (Resolusi tinggi, komunikatif, bermuatan nilai syariat)',
    rubric: [
      'Kesesuaian dengan dalil Al-Qur’an (25 poin)',
      'Kerapian komposisi & estetika visual (25 poin)',
      'Kejelasan pesan anti-hoaks & cyberbullying (30 poin)',
      'Orisinalitas karya (20 poin)'
    ]
  },
  {
    id: 'act-auditory',
    style: 'auditory',
    title: 'Aktivitas Gaya Belajar AUDITORI: Podcast Narasi & Simulasi Diskusi Lisan',
    subtitle: 'Perekaman Suara Edukasi "Menjaga Lisan di Era Digital" & Analisis Dialog',
    objective: 'Peserta didik mampu mengartikulasikan pesan moral tabayyun melalui intonasi suara, argumentasi lisan, dan dialog reflektif.',
    instructions: [
      'Dengarkan rekaman audio podcast kajian suara Pak Wandra Arasdi, M.Pd. pada materi audio.',
      'Buat rekaman suara (Voice Note / Mini Podcast berdurasi 2-3 menit) dengan topik: "Pesan untuk Sahabat: Mengapa Kita Harus Diam Jika Tidak Bisa Berkata Baik?".',
      'Gunakan intonasi yang hangat, artikulasi yang jelas, dan sertakan kutipan hadis Bukhari-Muslim tentang berkata baik atau diam.',
      'Kamu dapat berkolaborasi dengan satu teman untuk model tanya-jawab interaktif.',
      'Unggah tautan audio / file rekaman MP3 ke modul pengumpulan tugas.'
    ],
    actionPrompt: 'Tuliskan rancangan pembukaan (hook) narasi lisanmu agar pendengar langsung tergugah untuk menjaga lisannya!',
    expectedOutput: 'File Audio Podcast / Voice Note (Durasi 2-3 menit, jernih, persuasif, bernada dakwah santun)',
    rubric: [
      'Kejelasan lafal dalil dan terjemahan (25 poin)',
      'Intonasi dan daya bujuk persuasif (25 poin)',
      'Kedalaman pesan moral anti-ghibah digital (30 poin)',
      'Kualitas audio dan minim kebisingan (20 poin)'
    ]
  },
  {
    id: 'act-kinesthetic',
    style: 'kinesthetic',
    title: 'Aktivitas Gaya Belajar KINESTETIK: Simulasi Aksi Tabayyun & Roleplay Kasus',
    subtitle: 'Praktik Langsung Uji Fakta (Fact-Checking Drill) & Roleplay Penanganan Perundungan',
    objective: 'Peserta didik mampu mendemonstrasikan tindakan nyata verifikasi berita hoaks menggunakan alat periksa fakta digital dan menyimulasikan pendampingan korban perundungan.',
    instructions: [
      'Pilih salah satu dari 3 studi kasus kontekstual pada materi kasus.',
      'Buka gawai/laptopmu dan lakukan simulasi verifikasi: cari tahu kebenaran klaim menggunakan Google Fact Check Tools atau website resmi TurnBackHoax.id.',
      'Dokumentasikan langkah-langkah pencarianmu dalam bentuk tabel alur tindakan: (1) Temuan kecurigaan, (2) Alat yang digunakan, (3) Bukti sanggahan, (4) Kesimpulan akhir.',
      'Tuliskan naskah tindakan nyata: Kalimat apa persisnya yang akan kamu ketik untuk menenangkan korban dan menegur pelaku secara santun di ruang privat?',
      'Unggah laporan portofolio aksi kinestetikmu ke menu pengumpulan tugas.'
    ],
    actionPrompt: 'Ceritakan pengalamanmu saat mencoba mencari kebenaran berita palsu: Apa tantangan terbesar dalam membedakan fakta dan rekayasa?',
    expectedOutput: 'Laporan Aksi Portofolio Fact-Checking & Skenario Roleplay Solutif',
    rubric: [
      'Kecermatan alur langkah verifikasi fakta (30 poin)',
      'Penerapan etika syar’i dalam menegur pelaku (30 poin)',
      'Ketepatan pemilihan alat periksa fakta (20 poin)',
      'Refleksi aksi nyata di lingkungan sekolah (20 poin)'
    ]
  }
];

export const INITIAL_DISCUSSIONS: DiscussionComment[] = [
  {
    id: 'disc-1',
    authorName: 'Wandra Arasdi, M.Pd.',
    authorRole: 'teacher',
    avatarColor: 'bg-emerald-600',
    content: 'Assalamu’alaikum anak-anakku semua. Selamat datang di forum diskusi MPD-DigPAI. Silakan renungkan pertanyaan pemantik ini: "Jika jemari kita kelak di akhirat akan bersaksi atas setiap ketikan keyboard (QS. Yasin: 65), bagaimana seharusnya kita menyikapi godaan ikut berkomentar julid di media sosial saat melihat topik viral?" Mari diskusikan dengan santun dan berbobot.',
    timestamp: 'Kemarin, 08:30 WIB',
    likes: 24,
    isPinned: true,
    replies: [
      {
        id: 'disc-1-rep-1',
        authorName: 'ASSYFA KIRANI ARPIS',
        authorRole: 'student',
        avatarColor: 'bg-teal-600',
        content: 'Wa’alaikumsalam Pak Wandra. Menurut saya, ketika melihat konten viral yang memancing emosi, langkah pertama adalah menerapkan kaidah "Kaf an asy-syar" (menahan diri dari keburukan). Lebih baik saya menutup aplikasi dan beristighfar daripada memupuk dosa jariyah lewat komentar yang belum tentu saya ketahui kebenarannya.',
        timestamp: 'Kemarin, 09:15 WIB',
        likes: 12,
      },
      {
        id: 'disc-1-rep-2',
        authorName: 'HAFIZ RAMADAN HAKIM',
        authorRole: 'student',
        avatarColor: 'bg-blue-600',
        content: 'Betul kata Assyfa. Apalagi banyak akun sengaja membuat konten provokatif hanya demi engagement dan iklan. Jika kita ikut berkomentar, secara tidak langsung kita membantu algoritma menyebarkan konten buruk tersebut.',
        timestamp: 'Kemarin, 10:02 WIB',
        likes: 9,
      }
    ]
  },
  {
    id: 'disc-2',
    authorName: 'GIBRAN ALVARO SABIL',
    authorRole: 'student',
    avatarColor: 'bg-indigo-600',
    content: 'Izin bertanya kepada Pak Wandra dan teman-teman: Bagaimana jika yang menyebarkan berita belum jelas adalah orang tua atau keluarga di grup WhatsApp keluarga? Bagaimana cara menegur yang sopan tanpa membuat mereka tersinggung?',
    timestamp: 'Hari ini, 07:15 WIB',
    likes: 15,
    replies: [
      {
        id: 'disc-2-rep-1',
        authorName: 'Wandra Arasdi, M.Pd.',
        authorRole: 'teacher',
        avatarColor: 'bg-emerald-600',
        content: 'Pertanyaan luar biasa dari ananda Gibran. Kaidah dalam QS. Al-Isra ayat 23 mengajarkan kita untuk berbicara kepada orang tua dengan "Qaulan Karima" (perkataan mulia). Caranya: Jangan tegur di grup besar! Kirimkan pesan pribadi (japri) dengan bahasa santun, diawali permohonan maaf, lalu sertakan link verifikasi dari situs resmi. Katakan: "Bunda/Ayah, izin berbagi info klarifikasi dari portal resmi agar keluarga kita tidak keliru..." Ini menjaga kehormatan orang tua.',
        timestamp: 'Hari ini, 07:45 WIB',
        likes: 19,
      }
    ]
  }
];

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Asesmen Diagnostik (Awal)
  {
    id: 1,
    category: 'diagnostik',
    question: 'Ketika menerima sebuah berita heboh di grup obrolan yang belum dipastikan kebenarannya, sikap pertama seorang muslim yang beradab adalah...',
    options: [
      'Langsung meneruskan ke semua grup agar orang lain waspada',
      'Mencari tahu siapa yang pertama kali membuat postingan lalu mencelanya',
      'Melakukan tabayyun (memeriksa keabsahan fakta) dan menahan diri untuk tidak membagikannya',
      'Menghapus aplikasi media sosial secara permanen'
    ],
    correctIndex: 2,
    explanation: 'Sikap utama muslim saat menerima kabar adalah tabayyun (klarifikasi fakta) sesuai perintah QS. Al-Hujurat ayat 6, serta tidak menyebarkannya sebelum terbukti kebenarannya.'
  },
  {
    id: 2,
    category: 'diagnostik',
    question: 'Surah dalam Al-Qur’an yang menegaskan bahwa seluruh pendengaran, penglihatan, dan hati nurani manusia akan dimintai pertanggungjawaban di hadapan Allah adalah...',
    options: [
      'QS. Al-Baqarah ayat 183',
      'QS. Al-Isra ayat 36',
      'QS. An-Nur ayat 12',
      'QS. Al-Ma’un ayat 1-7'
    ],
    correctIndex: 1,
    explanation: 'QS. Al-Isra ayat 36: "Dan janganlah kamu mengikuti apa yang kamu tidak mempunyai pengetahuan tentangnya. Sesungguhnya pendengaran, penglihatan, dan hati nurani, semua itu akan diminta pertanggungjawabannya."'
  },
  {
    id: 3,
    category: 'diagnostik',
    question: 'Istilah Al-Qur’an untuk cara komunikasi yang berkata benar, jujur, dan berbobot tanpa manipulasi adalah...',
    options: [
      'Qaulan Sadida',
      'Qaulan Maysura',
      'Qaulan Layyina',
      'Qaulan Karima'
    ],
    correctIndex: 0,
    explanation: 'Qaulan Sadida bermakna perkataan yang benar, lurus, dan jujur (QS. An-Nisa: 9 & QS. Al-Ahzab: 70).'
  },
  // Asesmen Formatif
  {
    id: 4,
    category: 'formatif',
    question: 'Fatwa Majelis Ulama Indonesia yang secara komprehensif mengatur Hukum dan Pedoman Bermuamalah Melalui Media Sosial diterbitkan pada tahun 2017 dengan nomor...',
    options: [
      'Fatwa MUI No. 12 Tahun 2017',
      'Fatwa MUI No. 24 Tahun 2017',
      'Fatwa MUI No. 33 Tahun 2017',
      'Fatwa MUI No. 56 Tahun 2017'
    ],
    correctIndex: 1,
    explanation: 'Fatwa MUI No. 24 Tahun 2017 memuat pedoman syariah bermuamalah di medsos, mengharamkan hoaks, ghibah digital, namimah, dan ujaran kebencian.'
  },
  {
    id: 5,
    category: 'formatif',
    question: 'Seseorang yang terus membagikan tangkapan layar (screenshot) obrolan pribadi dengan maksud agar dua pihak saling membenci dan bermusuhan termasuk perbuatan dosa...',
    options: [
      'Riya’ digital',
      'Namīmah (Adu Domba)',
      'Takabur',
      'Ujub'
    ],
    correctIndex: 1,
    explanation: 'Namimah adalah mengadu domba atau menyebarkan rahasia/omongan untuk merusak hubungan sesama. Rasulullah SAW bersabda: "Tidak akan masuk surga orang yang suka mengadu domba" (HR. Muslim).'
  },
  // Asesmen Sumatif
  {
    id: 6,
    category: 'sumatif',
    question: 'Perhatikan firman Allah berikut: “يَا أَيُّهَا الَّذِينَ آمَنُوا إِنْ جَاءَكُمْ فَاسِقٌ بِنَبَإٍ فَتَبَيَّنُوا...” Nilai karakter utama yang dipelajari dari ayat tersebut dalam kehidupan siber adalah...',
    options: [
      'Toleransi terhadap perbedaan suku bangsa',
      'Sikap kritis dan verifikasi (tabayyun) terhadap arus informasi',
      'Kewajiban bersedekah harta secara online',
      'Menuntut ilmu sains dan teknologi modern'
    ],
    correctIndex: 1,
    explanation: 'Ayat tersebut (QS. Al-Hujurat: 6) menanamkan nilai tabayyun, yakni keharusan memverifikasi dan memeriksa kebenaran setiap informasi sebelum dipercayai dan disebarkan.'
  },
  {
    id: 7,
    category: 'sumatif',
    question: 'Dampak paling berbahaya dari "Dosa Jariyah Digital" yang membedakannya dengan dosa lisan konvensional adalah...',
    options: [
      'Hanya ditanggung oleh pembuat konten awal saja',
      'Dapat terhapus otomatis setelah 24 jam di story media sosial',
      'Jejak digitalnya dapat terus diakses, disebarkan orang lain, dan dosanya mengalir meskipun pelakunya telah meninggal dunia',
      'Hanya berdampak pada kesehatan fisik pelakunya'
    ],
    correctIndex: 2,
    explanation: 'Konten buruk yang diunggah di internet berpotensi menjadi dosa jariyah karena rekaman digital dapat abadi dan terus menyesatkan orang lain sepanjang masa.'
  },
  {
    id: 8,
    category: 'sumatif',
    question: 'Ketika seorang siswa menjadi korban cyberbullying (perundungan siber), tindakan yang paling sesuai dengan ajaran Islam dan etika hukum siber adalah...',
    options: [
      'Membalas dengan kata-kata yang lebih kotor di kolom komentar',
      'Menyimpan bukti tangkapan layar, memblokir pelaku, dan melaporkan kepada pihak berwenang / guru BK / PAI',
      'Menyebarkan identitas pribadi keluarga pelaku agar dihakimi massa',
      'Menutup diri dan tidak mau lagi berinteraksi dengan siapa pun'
    ],
    correctIndex: 1,
    explanation: 'Islam melarang membalas kezaliman dengan kezaliman serupa. Bukti harus didokumentasikan untuk perlindungan hukum, memblokir agar terhindar dari racun mental, dan melaporkan secara adil.'
  },
  {
    id: 9,
    category: 'sumatif',
    question: 'Berdasarkan kaidah "Ad-Dhararu Yuzal" (kemudharatan harus dihilangkan), apa hukum membagikan video kecelakaan atau musibah yang memperlihatkan aurat dan luka korban secara eksplisit?',
    options: [
      'Sunnah karena memberikan informasi penting kepada masyarakat',
      'Mubah jika dibagikan dengan niat mengingatkan kematian',
      'Haram karena merendahkan martabat jenazah/korban dan melukai perasaan keluarga',
      'Makruh saja asalkan ditambahi teks doa'
    ],
    correctIndex: 2,
    explanation: 'Menyebarkan video luka/jenazah melanggar kehormatan manusia dan menimbulkan trauma serta merusak aurat. Hal tersebut dilarang dalam syariat Islam.'
  },
  {
    id: 10,
    category: 'sumatif',
    question: 'Prinsip komunikasi "Qaulan Layyina" yang diperintahkan Allah kepada Nabi Musa AS saat mendakwahi Fir’aun mengajarkan kita di media sosial untuk...',
    options: [
      'Selalu menggunakan huruf kapital agar terkesan tegas',
      'Menyampaikan kritik atau nasehat dengan kelembutan tanpa merendahkan martabat orang lain',
      'Membuat lelucon sindiran sarkasme agar orang tersadar',
      'Menghindari komunikasi dengan orang yang berbeda paham'
    ],
    correctIndex: 1,
    explanation: 'Qaulan Layyina (QS. Thaha: 44) bermakna perkataan yang lemah lembut. Bahkan kepada Fir’aun yang mengaku tuhan pun Allah memerintahkan nabi-Nya berbicara dengan santun, apalagi kepada sesama manusia.'
  }
];
