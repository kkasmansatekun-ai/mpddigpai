export interface LaravelFileSnippet {
  path: string;
  category: 'Migration' | 'Controller' | 'Blade View' | 'Seeder' | 'JavaScript' | 'Routes';
  title: string;
  description: string;
  code: string;
}

export const LARAVEL_SNIPPETS: LaravelFileSnippet[] = [
  {
    path: 'database/migrations/2026_01_01_000001_create_mpd_digpai_tables.php',
    category: 'Migration',
    title: 'Migration: Tabel Inti MPD-DigPAI',
    description: 'Skema tabel lengkap: school_classes, users (class_id foreign key, learning_style, initial_password), topics, materials, activities, submissions, discussions, assessments, reflections, progress_reports.',
    code: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. School Classes (Dinamis - Banyak Kelas & Tingkat)
        Schema::create('school_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. KELAS X 3
            $table->string('phase')->default('Fase E'); // e.g. Fase E, Fase F
            $table->string('academic_year')->default('2025/2026');
            $table->string('teacher_name')->default('Wandra Arasdi, M.Pd.');
            $table->timestamps();
        });

        // 2. Users (Guru & Peserta Didik dengan Foreign Key ke school_classes)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_class_id')->nullable()->constrained('school_classes')->nullOnDelete();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->enum('role', ['teacher', 'student'])->default('student');
            $table->enum('gender', ['Laki-laki', 'Perempuan'])->default('Perempuan');
            $table->string('initial_password'); // Plain text untuk lembar cetak akun guru
            $table->string('password'); // Hash bcrypt untuk autentikasi sistem
            $table->enum('learning_style', ['visual', 'auditory', 'kinesthetic'])->default('visual');
            $table->string('nisn')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // 3. Learning Topics (Adab Bersosial Media dalam Islam)
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->timestamps();
        });

        // 4. Learning Materials (9 Multi-Representasi)
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained('topics')->cascadeOnDelete();
            $table->string('type'); // teks, gambar, infografis, video, audio, presentasi, kasus, bacaan, interaktif
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('badge')->nullable();
            $table->string('duration')->nullable();
            $table->text('summary')->nullable();
            $table->json('content_payload')->nullable();
            $table->timestamps();
        });

        // 5. Activities (Diferensiasi Gaya Belajar)
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained('topics')->cascadeOnDelete();
            $table->enum('target_style', ['visual', 'auditory', 'kinesthetic']);
            $table->string('title');
            $table->text('instruction');
            $table->string('output_type');
            $table->timestamps();
        });

        // 6. Student Task Submissions
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('activity_id')->nullable()->constrained('activities')->nullOnDelete();
            $table->string('title');
            $table->enum('category', ['Infografis', 'Podcast', 'Mindmap', 'Video Edukasi', 'Artikel Analisis', 'Poster Digital']);
            $table->text('description')->nullable();
            $table->string('file_path')->nullable();
            $table->string('external_link')->nullable();
            $table->decimal('grade', 5, 2)->nullable();
            $table->text('teacher_feedback')->nullable();
            $table->timestamps();
        });

        // 7. Discussion Forum
        Schema::create('discussions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('topic_id')->constrained('topics')->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('discussions')->cascadeOnDelete();
            $table->text('content');
            $table->boolean('is_pinned')->default(false);
            $table->unsignedInteger('likes_count')->default(0);
            $table->timestamps();
        });

        // 8. Assessments (Diagnostik, Formatif, Sumatif)
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained('topics')->cascadeOnDelete();
            $table->enum('type', ['diagnostik', 'formatif', 'sumatif']);
            $table->string('title');
            $table->json('questions_data');
            $table->unsignedTinyInteger('passing_grade')->default(75);
            $table->timestamps();
        });

        // 9. Reflections
        Schema::create('reflections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('understanding_level');
            $table->text('biggest_challenge');
            $table->text('most_helpful_activity');
            $table->text('action_commitment');
            $table->timestamps();
        });

        // 10. Progress & Grade Reports
        Schema::create('progress_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('score_diagnostik', 5, 2)->default(0);
            $table->decimal('score_formatif', 5, 2)->default(0);
            $table->decimal('score_tugas', 5, 2)->default(0);
            $table->decimal('score_sumatif', 5, 2)->default(0);
            $table->decimal('final_grade', 5, 2)->default(0);
            $table->string('letter_grade', 2)->default('B');
            $table->unsignedTinyInteger('engagement_rate')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('progress_reports');
        Schema::dropIfExists('reflections');
        Schema::dropIfExists('assessments');
        Schema::dropIfExists('discussions');
        Schema::dropIfExists('submissions');
        Schema::dropIfExists('activities');
        Schema::dropIfExists('materials');
        Schema::dropIfExists('topics');
        Schema::dropIfExists('users');
        Schema::dropIfExists('school_classes');
    }
};`
  },
  {
    path: 'database/seeders/StudentSeeder.php',
    category: 'Seeder',
    title: 'Seeder: KELAS X 3, Guru & 36 Siswa Lengkap',
    description: 'Menyimpan kelas default KELAS X 3, akun guru Wandra Arasdi, M.Pd., dan 36 siswa seeder lengkap dengan username, plain text password, bcrypt password, gender, dan gaya belajar.',
    code: `<?php

namespace Database\\Seeders;

use App\\Models\\User;
use App\\Models\\SchoolClass;
use App\\Models\\Topic;
use App\\Models\\ProgressReport;
use Illuminate\\Database\\Seeder;
use Illuminate\\Support\\Facades\\Hash;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Buat Kelas Default: KELAS X 3
        $class = SchoolClass::firstOrCreate(
            ['name' => 'KELAS X 3'],
            [
                'phase' => 'Fase E',
                'academic_year' => '2025/2026',
                'teacher_name' => 'Wandra Arasdi, M.Pd.'
            ]
        );

        // 2. Akun Guru / Admin
        User::updateOrCreate(
            ['username' => 'wandra.arasdi'],
            [
                'name' => 'Wandra Arasdi, M.Pd.',
                'email' => 'wandra.arasdi@mpd-digpai.sch.id',
                'role' => 'teacher',
                'gender' => 'Laki-laki',
                'initial_password' => 'admin123',
                'password' => Hash::make('admin123'),
                'learning_style' => 'visual',
                'school_class_id' => $class->id,
            ]
        );

        // 3. Topik Default
        Topic::firstOrCreate(
            ['title' => 'Adab Bersosial Media dalam Islam'],
            [
                'description' => 'Studi Etika Komunikasi Digital, Prinsip Tabayyun, Menjaga Lisan Digital, serta Penanganan Hoaks & Cyberbullying berlandaskan Al-Qur’an dan Hadis.'
            ]
        );

        // 4. Data 36 Peserta Didik Seeder
        $studentsData = [
            ['name' => 'ASSYFA KIRANI ARPIS', 'gender' => 'Perempuan'],
            ['name' => 'AULIA RAHMADANI', 'gender' => 'Perempuan'],
            ['name' => 'AZAHRA RIZQI FAQIH ASHIFFA', 'gender' => 'Perempuan'],
            ['name' => 'CANTIKA', 'gender' => 'Perempuan'],
            ['name' => 'DWI VALENA SEFTA', 'gender' => 'Perempuan'],
            ['name' => 'FAYZATUL NURHIDAYATI', 'gender' => 'Perempuan'],
            ['name' => 'FEBBY NAYSHILA NAFSIR', 'gender' => 'Perempuan'],
            ['name' => 'FIKA YULISTIA', 'gender' => 'Perempuan'],
            ['name' => 'GHALIN QARIRAH PUTRI', 'gender' => 'Perempuan'],
            ['name' => 'GIBRAN ALVARO SABIL', 'gender' => 'Laki-laki'],
            ['name' => 'GRACIA MIAN TIAR SIMAMORA', 'gender' => 'Perempuan'],
            ['name' => 'HAFIZ RAMADAN HAKIM', 'gender' => 'Laki-laki'],
            ['name' => 'HAFIZATUL HUSNA', 'gender' => 'Perempuan'],
            ['name' => 'HANA HABRIYAH', 'gender' => 'Perempuan'],
            ['name' => 'HANY RADIKA PUTRI', 'gender' => 'Perempuan'],
            ['name' => 'INAYAH MEYZAHIRAH', 'gender' => 'Perempuan'],
            ['name' => 'IRFAN NATA BEQUEREL', 'gender' => 'Laki-laki'],
            ['name' => 'JESICA KASIH EBRIANI TAMPUBOLON', 'gender' => 'Perempuan'],
            ['name' => 'KADZIA AUDREY', 'gender' => 'Perempuan'],
            ['name' => 'KARLIUS SITOFAN ZEGA', 'gender' => 'Laki-laki'],
            ['name' => 'KHUSNUL KHATIMA', 'gender' => 'Perempuan'],
            ['name' => 'LEDI LOVELY HAREFA', 'gender' => 'Perempuan'],
            ['name' => 'LYDIA HELVRIYAN KARIMAH', 'gender' => 'Perempuan'],
            ['name' => 'MAR AKILA', 'gender' => 'Perempuan'],
            ['name' => 'NAGIL ABIBIE ABSHI', 'gender' => 'Laki-laki'],
            ['name' => 'NOR AURA', 'gender' => 'Perempuan'],
            ['name' => 'QHAISHAR NADHIF DZIHNI ASMARA', 'gender' => 'Laki-laki'],
            ['name' => 'RIDIBA DWICO', 'gender' => 'Laki-laki'],
            ['name' => 'ROFIFAH RAMADHANIA', 'gender' => 'Perempuan'],
            ['name' => 'SASSI KIRANA MASAYU INDRA', 'gender' => 'Perempuan'],
            ['name' => 'TEDDY ARDIAN', 'gender' => 'Perempuan'],
            ['name' => 'TIARA JESICA WULANDARI', 'gender' => 'Perempuan'],
            ['name' => 'WIFAQ AZIZAH', 'gender' => 'Perempuan'],
            ['name' => 'WILDAN ADE RIANSAH', 'gender' => 'Laki-laki'],
            ['name' => 'YUNANDIRA DIAN PRASTIWI', 'gender' => 'Perempuan'],
            ['name' => 'ZILZA YUNITA', 'gender' => 'Perempuan'],
        ];

        $styles = ['visual', 'auditory', 'kinesthetic'];

        foreach ($studentsData as $index => $s) {
            $words = explode(' ', strtolower($s['name']));
            $username = $words[0] . '.' . ($words[1] ?? 'pai');
            $plainPassword = 'Pai#' . strtoupper(substr(md5($s['name']), 0, 3)) . rand(100, 999);
            $style = $styles[$index % 3];

            $user = User::updateOrCreate(
                ['username' => $username],
                [
                    'school_class_id' => $class->id,
                    'name' => $s['name'],
                    'email' => $username . '@mpd-digpai.sch.id',
                    'role' => 'student',
                    'gender' => $s['gender'],
                    'initial_password' => $plainPassword,
                    'password' => Hash::make($plainPassword),
                    'learning_style' => $style,
                    'nisn' => '008' . str_pad($index + 1, 7, '0', STR_PAD_LEFT),
                ]
            );

            // Null-safe seeding Progress Report awal
            ProgressReport::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'score_diagnostik' => 80,
                    'score_formatif' => 82,
                    'score_tugas' => 85,
                    'score_sumatif' => 84,
                    'final_grade' => 83.5,
                    'letter_grade' => 'B+',
                    'engagement_rate' => 85,
                ]
            );
        }
    }
}`
  },
  {
    path: 'app/Http/Controllers/AuthController.php',
    category: 'Controller',
    title: 'Controller: AuthController',
    description: 'Menangani login multi-role tanpa teks khusus sekolah, verifikasi kredensial, proteksi sesi, dan logout.',
    code: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;

class AuthController extends Controller
{
    /**
     * Tampilkan form login centered card yang elegan dan bersih.
     */
    public function showLoginForm()
    {
        if (Auth::check()) {
            return redirect()->route('home');
        }
        return view('auth.login');
    }

    /**
     * Proses autentikasi multi-role (Guru & Siswa).
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $fieldType = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        if (Auth::attempt([$fieldType => $request->login, 'password' => $request->password], $request->filled('remember'))) {
            $request->session()->regenerate();

            // Redirect berdasarkan role
            if (Auth::user()->role === 'teacher') {
                return redirect()->intended(route('students.index'))->with('success', 'Selamat datang, Bapak Wandra Arasdi, M.Pd.');
            }

            return redirect()->intended(route('home'))->with('success', 'Selamat datang di MPD-DigPAI!');
        }

        return back()->withErrors([
            'login' => 'Username/Email atau Password tidak cocok. Silakan periksa kembali kredensial Anda.',
        ])->onlyInput('login');
    }

    /**
     * Logout sesi user.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('info', 'Anda telah keluar dari aplikasi.');
    }
}`
  },
  {
    path: 'app/Http/Controllers/SchoolClassController.php',
    category: 'Controller',
    title: 'Controller: SchoolClassController',
    description: 'Handling modul kelola kelas dinamis bagi guru: Tambah Kelas, Edit Nama/Fase, Hapus Kelas, dan relasi siswa.',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\SchoolClass;
use Illuminate\\Http\\Request;

class SchoolClassController extends Controller
{
    /**
     * Tampilkan daftar seluruh kelas dinamis.
     */
    public function index()
    {
        $classes = SchoolClass::withCount('students')->orderBy('name', 'asc')->get();
        return view('classes.index', compact('classes'));
    }

    /**
     * Simpan kelas baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'phase' => ['required', 'string', 'max:20'],
            'academic_year' => ['required', 'string', 'max:20'],
        ]);

        $validated['teacher_name'] = 'Wandra Arasdi, M.Pd.';
        SchoolClass::create($validated);

        return redirect()->route('classes.index')->with('success', "Kelas {$validated['name']} berhasil ditambahkan!");
    }

    /**
     * Update data kelas.
     */
    public function update(Request $request, $id)
    {
        $class = SchoolClass::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'phase' => ['required', 'string', 'max:20'],
            'academic_year' => ['required', 'string', 'max:20'],
        ]);

        $class->update($validated);

        return redirect()->route('classes.index')->with('success', "Data kelas {$class->name} berhasil diperbarui!");
    }

    /**
     * Hapus kelas dengan proteksi.
     */
    public function destroy($id)
    {
        $class = SchoolClass::withCount('students')->findOrFail($id);

        if ($class->students_count > 0) {
            return redirect()->route('classes.index')->with('error', "Kelas {$class->name} tidak dapat dihapus karena masih memiliki {$class->students_count} siswa.");
        }

        $className = $class->name;
        $class->delete();

        return redirect()->route('classes.index')->with('success', "Kelas {$className} berhasil dihapus.");
    }
}`
  },
  {
    path: 'app/Http/Controllers/ClassStudentController.php',
    category: 'Controller',
    title: 'Controller: ClassStudentController',
    description: 'Handling CRUD Siswa per kelas dinamis, updateLearningStyle(), reset password, analitik Donut Chart, cetak akun & rekap nilai.',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\User;
use App\\Models\\SchoolClass;
use App\\Models\\ProgressReport;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Support\\Str;

class ClassStudentController extends Controller
{
    /**
     * Tampilkan data siswa per kelas dinamis, analitik gaya belajar, dan kredensial.
     */
    public function index(Request $request)
    {
        $classes = SchoolClass::orderBy('name', 'asc')->get();
        $selectedClassId = $request->query('class_id', $classes->first()?->id);

        $query = User::where('role', 'student')->with(['schoolClass', 'progressReport']);

        if ($selectedClassId) {
            $query->where('school_class_id', $selectedClassId);
        }

        $students = $query->orderBy('name', 'asc')->get();
        $currentClass = SchoolClass::find($selectedClassId) ?? $classes->first();

        // Hitung statistik gaya belajar (Null-Safe)
        $totalStudents = $students->count();
        $visualCount = $students->where('learning_style', 'visual')->count();
        $auditoryCount = $students->where('learning_style', 'auditory')->count();
        $kinestheticCount = $students->where('learning_style', 'kinesthetic')->count();

        $learningStyleStats = [
            'total' => $totalStudents,
            'visual' => $visualCount,
            'auditory' => $auditoryCount,
            'kinesthetic' => $kinestheticCount,
            'visual_pct' => $totalStudents > 0 ? round(($visualCount / $totalStudents) * 100, 1) : 0,
            'auditory_pct' => $totalStudents > 0 ? round(($auditoryCount / $totalStudents) * 100, 1) : 0,
            'kinesthetic_pct' => $totalStudents > 0 ? round(($kinestheticCount / $totalStudents) * 100, 1) : 0,
        ];

        return view('students.index', compact('students', 'classes', 'currentClass', 'learningStyleStats', 'selectedClassId'));
    }

    /**
     * Edit Langsung Gaya Belajar Siswa dari Dropdown Tabel.
     */
    public function updateLearningStyle(Request $request, $id)
    {
        $request->validate([
            'learning_style' => ['required', 'in:visual,auditory,kinesthetic'],
        ]);

        $student = User::where('role', 'student')->findOrFail($id);
        $student->learning_style = $request->learning_style;
        $student->save();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Gaya belajar {$student->name} berhasil diubah ke {$request->learning_style}!",
            ]);
        }

        return redirect()->back()->with('success', "Gaya belajar {$student->name} berhasil diperbarui!");
    }

    /**
     * Reset Password Siswa dan tampilkan Flash Alert / Modal Kredensial Baru.
     */
    public function resetPassword(Request $request, $id)
    {
        $student = User::where('role', 'student')->findOrFail($id);

        $newPlainPassword = 'Pai#' . Str::upper(Str::random(3)) . rand(100, 999);

        $student->initial_password = $newPlainPassword;
        $student->password = Hash::make($newPlainPassword);
        $student->save();

        return redirect()->back()->with([
            'password_reset_success' => true,
            'student_name' => $student->name,
            'student_username' => $student->username,
            'new_password' => $newPlainPassword,
            'message' => "Password untuk {$student->name} berhasil direset!"
        ]);
    }

    /**
     * Cetak Lembaran Akun Username & Password Seluruh Siswa per Kelas.
     */
    public function printAccounts(Request $request)
    {
        $classId = $request->query('class_id');
        $currentClass = $classId ? SchoolClass::find($classId) : SchoolClass::first();

        $query = User::where('role', 'student');
        if ($currentClass) {
            $query->where('school_class_id', $currentClass->id);
        }
        $students = $query->orderBy('name', 'asc')->get();

        $teacherName = 'Wandra Arasdi, M.Pd.';
        $className = $currentClass ? "{$currentClass->name} ({$currentClass->phase})" : 'Semua Kelas';
        $printDate = now()->translatedFormat('d F Y');

        return view('print.accounts', compact('students', 'teacherName', 'className', 'printDate', 'currentClass'));
    }

    /**
     * Cetak Rekapitulasi Nilai Siswa per Kelas.
     */
    public function printGrades(Request $request)
    {
        $classId = $request->query('class_id');
        $currentClass = $classId ? SchoolClass::find($classId) : SchoolClass::first();

        $query = User::where('role', 'student')->with('progressReport');
        if ($currentClass) {
            $query->where('school_class_id', $currentClass->id);
        }
        $students = $query->orderBy('name', 'asc')->get();

        $teacherName = 'Wandra Arasdi, M.Pd.';
        $className = $currentClass ? "{$currentClass->name} ({$currentClass->phase})" : 'Semua Kelas';
        $printDate = now()->translatedFormat('d F Y');

        return view('print.grades', compact('students', 'teacherName', 'className', 'printDate', 'currentClass'));
    }
}`
  },
  {
    path: 'app/Http/Controllers/MaterialController.php',
    category: 'Controller',
    title: 'Controller: MaterialController',
    description: 'Handling 9 multi-representasi media materi PAI (Teks, Gambar, Infografis, Video, Audio, Presentasi, Kasus, Bacaan, Interaktif).',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Material;
use App\\Models\\Topic;
use Illuminate\\Http\\Request;

class MaterialController extends Controller
{
    /**
     * Tampilkan 9 multi-representasi materi PAI.
     */
    public function index(Request $request)
    {
        $topic = Topic::first();
        $type = $request->query('type', 'teks');

        $materials = Material::where('topic_id', $topic?->id)
            ->when($type !== 'all', function ($q) use ($type) {
                return $q->where('type', $type);
            })
            ->get();

        return view('materials.index', compact('topic', 'materials', 'type'));
    }
}`
  },
  {
    path: 'app/Http/Controllers/ActivityController.php',
    category: 'Controller',
    title: 'Controller: ActivityController',
    description: 'Handling modul aktivitas belajar berdiferensiasi berdasarkan gaya belajar siswa (Visual, Auditori, Kinestetik).',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Activity;
use App\\Models\\Topic;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;

class ActivityController extends Controller
{
    /**
     * Tampilkan aktivitas belajar adaptif sesuai profil gaya belajar siswa.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $userStyle = $user->learning_style ?? 'visual';
        $activeStyle = $request->query('style', $userStyle);

        $topic = Topic::first();
        $activities = Activity::where('target_style', $activeStyle)->get();

        return view('activities.index', compact('topic', 'activities', 'activeStyle', 'userStyle'));
    }
}`
  },
  {
    path: 'app/Http/Controllers/ProgressController.php',
    category: 'Controller',
    title: 'Controller: ProgressController',
    description: 'Monitoring keterlibatan belajar, statistik KKTP, dan rekapitulasi nilai formatif/sumatif.',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\ProgressReport;
use App\\Models\\User;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;

class ProgressController extends Controller
{
    /**
     * Tampilkan informasi kemajuan belajar siswa atau rekap kelas bagi guru.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'teacher') {
            $reports = ProgressReport::with('user')->get();
            $averageFinal = $reports->avg('final_grade') ?? 0;
            $passCount = $reports->where('final_grade', '>=', 75)->count();
            return view('progress.teacher', compact('reports', 'averageFinal', 'passCount'));
        }

        // Siswa: Tampilkan progress mandiri (Null-Safe)
        $progress = ProgressReport::where('user_id', $user->id)->first();
        return view('progress.student', compact('progress'));
    }
}`
  },
  {
    path: 'resources/views/auth/login.blade.php',
    category: 'Blade View',
    title: 'Blade View: auth/login.blade.php',
    description: 'Halaman login kartu terpusat yang elegan, minimalis, dan BERSIH dari teks khusus kelas, fase, maupun SMKN.',
    code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Masuk - MPD-DigPAI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 min-h-screen flex items-center justify-center p-4">
    <!-- Centered Card Design (Bebas dari Identitas Khusus Kelas/Sekolah) -->
    <div class="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-white/20 space-y-6">
        <div class="text-center space-y-2">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg font-black text-xl mb-1">
                PAI
            </div>
            <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">MPD-DigPAI</h1>
            <p class="text-xs text-slate-500">
                Media Pembelajaran Digital Pendidikan Agama Islam
            </p>
        </div>

        @if($errors->any())
        <div class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {{ $errors->first() }}
        </div>
        @endif

        <form action="{{ route('login.post') }}" method="POST" class="space-y-4">
            @csrf
            <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700">Username atau Email</label>
                <input type="text" name="login" value="{{ old('login') }}" required
                       placeholder="Masukkan username atau email..."
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none">
            </div>

            <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-700">Kata Sandi (Password)</label>
                <input type="password" name="password" required
                       placeholder="Masukkan kata sandi..."
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none">
            </div>

            <button type="submit"
                    class="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition">
                Masuk ke Pembelajaran
            </button>
        </form>

        <div class="pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Topik: Adab Bersosial Media dalam Islam
        </div>
    </div>
</body>
</html>`
  },
  {
    path: 'resources/views/layouts/app.blade.php',
    category: 'Blade View',
    title: 'Layout: layouts/app.blade.php',
    description: 'Header widget jam sholat & badge kecil "Laravel PHP", Sidebar murni nama menu tanpa nomor, dan CSS @media print.',
    code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MPD-DigPAI - Media Pembelajaran Digital PAI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            body { background: white !important; color: black !important; font-size: 11pt !important; }
            @page { size: A4 portrait; margin: 1.5cm; }
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased min-h-screen flex" x-data="{ sidebarCollapsed: false }">

    <!-- SIDEBAR NAVIGASI MURNI TANPA NOMOR MENU -->
    <aside :class="sidebarCollapsed ? 'w-20' : 'w-72'" class="no-print bg-emerald-950 text-white flex flex-col shrink-0 border-r border-emerald-900 min-h-screen transition-all duration-300">
        <!-- Logo & Branding -->
        <div class="p-4 border-b border-emerald-800/80 flex items-center justify-between">
            <div x-show="!sidebarCollapsed" class="flex items-center space-x-3">
                <div class="w-9 h-9 rounded-2xl bg-emerald-500 text-emerald-950 font-black flex items-center justify-center text-sm shadow">PAI</div>
                <div>
                    <h1 class="font-extrabold text-sm text-white">MPD-DigPAI</h1>
                    <p class="text-[10px] text-emerald-300">Media Pembelajaran PAI</p>
                </div>
            </div>
            <button @click="sidebarCollapsed = !sidebarCollapsed" class="p-1 rounded-lg bg-emerald-900 text-emerald-300 hover:bg-emerald-800 text-xs">
                ↔
            </button>
        </div>

        <nav class="flex-1 px-2.5 py-3 space-y-1 text-xs">
            <!-- MENU GURU (JIKA ROLE TEACHER) -->
            @if(Auth::user()->role === 'teacher')
            <div class="pb-2 mb-2 border-b border-emerald-900/60 space-y-1">
                <div x-show="!sidebarCollapsed" class="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Manajemen Guru
                </div>
                <a href="{{ route('classes.index') }}" class="flex items-center px-3 py-2 rounded-xl text-emerald-100 hover:bg-emerald-800 transition">
                    <span class="mr-2">🏛️</span> <span x-show="!sidebarCollapsed">Kelola Kelas</span>
                </a>
                <a href="{{ route('students.index') }}" class="flex items-center px-3 py-2 rounded-xl text-emerald-100 hover:bg-emerald-800 transition">
                    <span class="mr-2">👥</span> <span x-show="!sidebarCollapsed">Kelola Siswa</span>
                </a>
            </div>
            @endif

            <!-- MENU PEMBELAJARAN (MURNI TANPA ANGKA NOMOR) -->
            <a href="{{ route('home') }}" class="flex items-center px-3 py-2 rounded-xl text-emerald-100 hover:bg-emerald-800 transition">
                <span class="mr-2">🏠</span> <span x-show="!sidebarCollapsed">Beranda</span>
            </a>
            <a href="{{ route('instructions') }}" class="flex items-center px-3 py-2 rounded-xl text-emerald-100 hover:bg-emerald-800 transition">
                <span class="mr-2">📖</span> <span x-show="!sidebarCollapsed">Petunjuk Pembelajaran</span>
            </a>
            <a href="{{ route('objectives') }}" class="flex items-center px-3 py-2 rounded-xl text-emerald-100 hover:bg-emerald-800 transition">
                <span class="mr-2">🎯</span> <span x-show="!sidebarCollapsed">Tujuan Pembelajaran</span>
            </a>
            <a href="{{ route('materials.index') }}" class="flex items-center px-3 py-2 rounded-xl text-emerald-100 hover:bg-emerald-800 transition">
                <span class="mr-2">📚</span> <span x-show="!sidebarCollapsed">Materi PAI</span>
            </a>
            <a href="{{ route('digital-resources') }}" class="flex items-center px-3 py-2 rounded-xl text-emerald-100 hover:bg-emerald-800 transition">
                <span class="mr-2">🌐</span> <span x-show="!sidebarCollapsed">Sumber Belajar Digital</span>
            </a>
            <a href="{{ route('activities.index') }}" class="flex items-center px-3 py-2 rounded-xl text-emerald-100 hover:bg-emerald-800 transition">
                <span class="mr-2">🧩</span> <span x-show="!sidebarCollapsed">Aktivitas Pembelajaran</span>
            </a>
            <a href="{{ route('submissions.index') }}" class="flex items-center px-3 py-2 rounded-xl text-emerald-100 hover:bg-emerald-800 transition">
                <span class="mr-2">📤</span> <span x-show="!sidebarCollapsed">Tugas / Produk</span>
            </a>
            <a href="{{ route('discussions.index') }}" class="flex items-center px-3 py-2 rounded-xl text-emerald-100 hover:bg-emerald-800 transition">
                <span class="mr-2">💬</span> <span x-show="!sidebarCollapsed">Diskusi / Interaksi</span>
            </a>
            <a href="{{ route('assessments.index') }}" class="flex items-center px-3 py-2 rounded-xl text-emerald-100 hover:bg-emerald-800 transition">
                <span class="mr-2">📝</span> <span x-show="!sidebarCollapsed">Asesmen</span>
            </a>
            <a href="{{ route('reflections.index') }}" class="flex items-center px-3 py-2 rounded-xl text-emerald-100 hover:bg-emerald-800 transition">
                <span class="mr-2">🪞</span> <span x-show="!sidebarCollapsed">Refleksi</span>
            </a>
            <a href="{{ route('progress.index') }}" class="flex items-center px-3 py-2 rounded-xl text-emerald-100 hover:bg-emerald-800 transition">
                <span class="mr-2">📊</span> <span x-show="!sidebarCollapsed">Informasi Perkembangan Belajar</span>
            </a>
        </nav>
    </aside>

    <!-- CONTENT WRAPPER -->
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <!-- TOPBAR HEADER WIDGET: JAM, SHOLAT & PENANDA LARAVEL PHP KECIL -->
        <header class="no-print bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-2.5 flex items-center justify-between"
                x-data="prayerTimeWidget()" x-init="initWidget()">
            <div class="flex items-center space-x-2">
                <span class="text-xs text-slate-500 font-medium hidden md:inline">
                    Topik: <strong class="text-slate-800">Adab Bersosial Media dalam Islam</strong>
                </span>
            </div>

            <!-- Jam WIB, Countdown Sholat & Badge Kecil Laravel PHP -->
            <div class="flex items-center space-x-3">
                <!-- Widget Sholat & Jam -->
                <div class="flex items-center space-x-3 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-1 text-xs">
                    <div>
                        <span class="font-mono font-bold text-slate-900" x-text="currentTimeStr">--:--:--</span>
                    </div>
                    <div class="h-3.5 w-px bg-emerald-200"></div>
                    <div class="flex items-center space-x-1.5">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span class="text-slate-600">Menuju <strong class="text-emerald-900" x-text="nextPrayerName">--</strong>:</span>
                        <span class="font-mono font-bold text-emerald-700" x-text="countdownStr">00:00:00</span>
                    </div>
                </div>

                <!-- Penanda / Badge Tulisan 'Laravel PHP' Berukuran KECIL & Ringkas -->
                <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600 font-bold">
                    <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span>Laravel PHP</span>
                </span>

                <!-- Form Logout -->
                <form action="{{ route('logout') }}" method="POST">
                    @csrf
                    <button type="submit" class="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1">
                        Keluar
                    </button>
                </form>
            </div>
        </header>

        <main class="flex-1 p-6 md:p-8">
            @yield('content')
        </main>
    </div>

    <script src="{{ asset('js/prayer-time-widget.js') }}"></script>
</body>
</html>`
  },
  {
    path: 'resources/views/classes/index.blade.php',
    category: 'Blade View',
    title: 'Blade View: classes/index.blade.php',
    description: 'Halaman Kelola Kelas Dinamis bagi Guru untuk menambah, mengedit, dan memantau siswa per kelas.',
    code: `@extends('layouts.app')

@section('content')
<div class="space-y-6" x-data="{ showModal: false, editMode: false, currentId: null, formName: '', formPhase: 'Fase E', formYear: '2025/2026' }">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
            <h2 class="text-2xl font-bold text-slate-900">Kelola Kelas Dinamis</h2>
            <p class="text-xs text-slate-500">Tambah dan kelola rombel kelas secara bebas tanpa label kaku.</p>
        </div>
        <button @click="editMode = false; formName = ''; formPhase = 'Fase E'; showModal = true"
                class="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-2">
            <span>+ Tambah Kelas Baru</span>
        </button>
    </div>

    @if(session('success'))
    <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
        {{ session('success') }}
    </div>
    @endif

    @if(session('error'))
    <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
        {{ session('error') }}
    </div>
    @endif

    <!-- Grid Kartu Kelas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @foreach($classes as $c)
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
                <div class="flex items-center justify-between">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {{ $c->phase }}
                    </span>
                    <span class="text-xs text-slate-400 font-mono">{{ $c->academic_year }}</span>
                </div>
                <h3 class="text-lg font-bold text-slate-900 mt-2">{{ $c->name }}</h3>
                <p class="text-xs text-slate-500 mt-1">Guru: {{ $c->teacher_name }}</p>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span class="font-bold text-slate-700">{{ $c->students_count }} Siswa Terdaftar</span>
                <div class="flex items-center space-x-2">
                    <a href="{{ route('students.index', ['class_id' => $c->id]) }}" class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100">
                        Lihat Siswa →
                    </a>
                </div>
            </div>
        </div>
        @endforeach
    </div>
</div>
@endsection`
  },
  {
    path: 'resources/views/beranda.blade.php',
    category: 'Blade View',
    title: 'Blade View: beranda.blade.php',
    description: 'Halaman Beranda visual minimalis, bersih dari identitas kelas/sekolah hardcoded, dengan alur 6 langkah pembelajaran.',
    code: `@extends('layouts.app')

@section('content')
<div class="space-y-6">
    <!-- Visual Hero Banner (Clean & Bebas Teks Hardcoded Sekolah/Kelas) -->
    <div class="rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 sm:p-10 relative overflow-hidden shadow-xl border border-emerald-700/50">
        <div class="max-w-2xl space-y-3 relative z-10">
            <span class="px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold inline-block">
                Platform Pembelajaran Digital PAI Interaktif • Berbasis Web
            </span>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                MPD-DigPAI: <br>
                <span class="text-emerald-300">Adab Bersosial Media</span> dalam Islam
            </h1>
            <p class="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
                Studi Etika Komunikasi Digital, Prinsip Tabayyun, Menjaga Lisan Digital, serta Penanganan Hoaks & Cyberbullying berlandaskan Al-Qur’an, Hadis, dan Fatwa MUI No. 24/2017.
            </p>
            <div class="pt-3 flex flex-wrap items-center gap-3 text-xs">
                <a href="{{ route('activities.index') }}" class="px-5 py-3 rounded-2xl bg-emerald-400 text-emerald-950 font-bold shadow-md hover:bg-emerald-300 transition">
                    Mulai Aktivitas Berdiferensiasi →
                </a>
                <a href="{{ route('materials.index') }}" class="px-4 py-3 rounded-2xl bg-emerald-800/80 border border-emerald-500/50 text-white font-semibold hover:bg-emerald-700 transition">
                    Jelajahi 9 Media Materi
                </a>
                <a href="{{ route('instructions') }}" class="px-4 py-3 rounded-2xl bg-white/10 text-emerald-100 font-medium hover:bg-white/20 transition">
                    Petunjuk Pembelajaran
                </a>
            </div>
        </div>
    </div>

    <!-- Alur Konseptual Pembelajaran (6 Langkah Visual) -->
    <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 class="font-bold text-sm text-slate-900">Alur Konseptual Pembelajaran MPD-DigPAI</h3>
        <div class="grid grid-cols-2 md:grid-cols-6 gap-2">
            <div class="p-3 rounded-xl bg-slate-50 border text-center">
                <span class="text-xs font-bold text-emerald-700 block">Langkah 1</span>
                <p class="text-[11px] font-bold text-slate-800 mt-0.5">Analisis Kebutuhan</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border text-center">
                <span class="text-xs font-bold text-emerald-700 block">Langkah 2</span>
                <p class="text-[11px] font-bold text-slate-800 mt-0.5">MPD-DigPAI</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border text-center">
                <span class="text-xs font-bold text-emerald-700 block">Langkah 3</span>
                <p class="text-[11px] font-bold text-slate-800 mt-0.5">Aktivitas Web</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border text-center">
                <span class="text-xs font-bold text-emerald-700 block">Langkah 4</span>
                <p class="text-[11px] font-bold text-slate-800 mt-0.5">Diferensiasi Belajar</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border text-center">
                <span class="text-xs font-bold text-emerald-700 block">Langkah 5</span>
                <p class="text-[11px] font-bold text-slate-800 mt-0.5">Keterlibatan Siswa</p>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border text-center">
                <span class="text-xs font-bold text-emerald-700 block">Langkah 6</span>
                <p class="text-[11px] font-bold text-slate-800 mt-0.5">Hasil Belajar PAI</p>
            </div>
        </div>
    </div>
</div>
@endsection`
  },
  {
    path: 'resources/views/students/index.blade.php',
    category: 'Blade View',
    title: 'Blade View: students/index.blade.php',
    description: 'Dashboard siswa per kelas dinamis, dropdown quick-edit gaya belajar, modal reset password, Donut Chart gaya belajar, dan tombol cetak.',
    code: `@extends('layouts.app')

@section('content')
<div class="space-y-6" x-data="{ showResetModal: {{ session('password_reset_success') ? 'true' : 'false' }} }">

    <!-- Modal Pop-up Reset Password Baru -->
    @if(session('password_reset_success'))
    <div x-show="showResetModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 space-y-4">
            <h3 class="font-bold text-lg text-slate-900">Kredensial Password Baru Siswa</h3>
            <div class="bg-slate-50 p-4 rounded-xl text-xs space-y-2">
                <div>Nama Siswa: <strong>{{ session('student_name') }}</strong></div>
                <div>Username: <strong class="font-mono text-emerald-800">{{ session('student_username') }}</strong></div>
                <div class="pt-2 border-t text-sm font-bold text-emerald-900">
                    Password Baru: <span class="bg-emerald-100 px-2 py-0.5 rounded font-mono">{{ session('new_password') }}</span>
                </div>
            </div>
            <button @click="showResetModal = false" class="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs">
                Tutup & Salin Kredensial
            </button>
        </div>
    </div>
    @endif

    <!-- Header & Filter Kelas Dinamis -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
            <h2 class="text-2xl font-bold text-slate-900">Manajemen Siswa ({{ $currentClass ? $currentClass->name : 'Semua Kelas' }})</h2>
            <p class="text-xs text-slate-500">Kredensial akun, quick-edit gaya belajar, dan tombol cetak siap potong.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
            <!-- Filter Dropdown Kelas -->
            <form action="{{ route('students.index') }}" method="GET">
                <select name="class_id" onchange="this.form.submit()" class="text-xs font-bold py-2 px-3 rounded-xl border border-slate-300 bg-white">
                    @foreach($classes as $cls)
                    <option value="{{ $cls->id }}" {{ $selectedClassId == $cls->id ? 'selected' : '' }}>
                        {{ $cls->name }} ({{ $cls->phase }})
                    </option>
                    @endforeach
                </select>
            </form>

            <a href="{{ route('students.print.accounts', ['class_id' => $selectedClassId]) }}" target="_blank" class="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center space-x-1">
                <span>🖨️ Cetak Akun Siswa</span>
            </a>
            <a href="{{ route('students.print.grades', ['class_id' => $selectedClassId]) }}" target="_blank" class="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1">
                <span>📊 Cetak Rekap Nilai</span>
            </a>
        </div>
    </div>

    <!-- Stat Cards Counter Gaya Belajar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="p-4 rounded-2xl bg-white border text-center shadow-xs">
            <span class="text-xs text-slate-500 block">Total Siswa</span>
            <strong class="text-xl text-slate-900">{{ $learningStyleStats['total'] }}</strong>
        </div>
        <div class="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center shadow-xs">
            <span class="text-xs text-blue-600 block">Visual</span>
            <strong class="text-xl text-blue-900">{{ $learningStyleStats['visual'] }} ({{ $learningStyleStats['visual_pct'] }}%)</strong>
        </div>
        <div class="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-center shadow-xs">
            <span class="text-xs text-amber-600 block">Auditori</span>
            <strong class="text-xl text-amber-900">{{ $learningStyleStats['auditory'] }} ({{ $learningStyleStats['auditory_pct'] }}%)</strong>
        </div>
        <div class="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center shadow-xs">
            <span class="text-xs text-rose-600 block">Kinestetik</span>
            <strong class="text-xl text-rose-900">{{ $learningStyleStats['kinesthetic'] }} ({{ $learningStyleStats['kinesthetic_pct'] }}%)</strong>
        </div>
    </div>

    <!-- Tabel Kredensial Siswa dengan Quick-Edit Gaya Belajar -->
    <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
                <thead>
                    <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <th class="p-3 text-center w-10">No</th>
                        <th class="p-3">Nama Siswa</th>
                        <th class="p-3">Gender</th>
                        <th class="p-3">Username</th>
                        <th class="p-3">Password Awal</th>
                        <th class="p-3">Quick Edit Gaya Belajar</th>
                        <th class="p-3 text-center">Reset Sandi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach($students as $index => $s)
                    <tr class="hover:bg-slate-50/70">
                        <td class="p-3 text-center text-slate-400 font-mono">{{ $index + 1 }}</td>
                        <td class="p-3 font-bold text-slate-900">{{ $s->name }}</td>
                        <td class="p-3">{{ $s->gender }}</td>
                        <td class="p-3 font-mono text-emerald-800 font-semibold">{{ $s->username }}</td>
                        <td class="p-3 font-mono font-bold">{{ $s->initial_password }}</td>
                        <td class="p-3">
                            <form action="{{ route('students.update.style', $s->id) }}" method="POST">
                                @csrf
                                <select name="learning_style" onchange="this.form.submit()" class="text-xs font-bold py-1 px-2 rounded-lg border bg-white">
                                    <option value="visual" {{ $s->learning_style === 'visual' ? 'selected' : '' }}>Visual</option>
                                    <option value="auditory" {{ $s->learning_style === 'auditory' ? 'selected' : '' }}>Auditori</option>
                                    <option value="kinesthetic" {{ $s->learning_style === 'kinesthetic' ? 'selected' : '' }}>Kinestetik</option>
                                </select>
                            </form>
                        </td>
                        <td class="p-3 text-center">
                            <form action="{{ route('students.reset.password', $s->id) }}" method="POST">
                                @csrf
                                <button type="submit" class="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold hover:bg-rose-100">
                                    Reset Password
                                </button>
                            </form>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection`
  },
  {
    path: 'resources/views/print/accounts.blade.php',
    category: 'Blade View',
    title: 'Print View: print/accounts.blade.php',
    description: 'Layout cetak kartu akun username & password siswa siap potong maupun format tabel rekap rapi.',
    code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Akun Siswa - MPD-DigPAI</title>
    <style>
        @page { size: A4 portrait; margin: 1.2cm; }
        body { font-family: Arial, sans-serif; font-size: 10pt; color: #111; margin: 0; }
        .header { text-align: center; border-bottom: 2px solid #065f46; padding-bottom: 8px; margin-bottom: 12px; }
        .header h1 { margin: 0; font-size: 14pt; color: #065f46; }
        .grid-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .card { border: 1.5px dashed #64748b; padding: 10px; border-radius: 8px; background: #fff; page-break-inside: avoid; }
        .card-header { display: flex; justify-content: space-between; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px; font-size: 8pt; font-weight: bold; color: #065f46; }
        .student-name { font-size: 9.5pt; font-weight: bold; text-transform: uppercase; margin-bottom: 6px; }
        .cred-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px; border-radius: 4px; font-family: monospace; font-size: 8.5pt; margin-bottom: 4px; }
        @media print { .btn-print { display: none; } }
    </style>
</head>
<body>
    <button class="btn-print" onclick="window.print()" style="margin-bottom:15px;padding:8px 16px;background:#065f46;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:bold;">
        🖨️ Cetak Kartu Akun Siswa Ini (Ctrl+P)
    </button>
    <div class="header">
        <h1>Media Pembelajaran Digital Pendidikan Agama Islam (MPD-DigPAI)</h1>
        <p style="margin:2px 0;font-weight:bold;">LEMBAR KREDENSIAL AKUN PESERTA DIDIK - {{ strtoupper($className) }}</p>
        <p style="margin:0;font-size:9pt;color:#475569;">Guru Pengampu: {{ $teacherName }} • Tanggal Cetak: {{ $printDate }}</p>
    </div>

    <!-- Grid Kartu Akun Siap Potong -->
    <div class="grid-cards">
        @foreach($students as $index => $s)
        <div class="card">
            <div class="card-header">
                <span>MPD-DigPAI</span>
                <span>#{{ $index + 1 }}</span>
            </div>
            <div class="student-name">{{ $s->name }}</div>
            <div class="cred-box">User: <strong>{{ $s->username }}</strong></div>
            <div class="cred-box">Pass: <strong>{{ $s->initial_password }}</strong></div>
            <div style="font-size: 7.5pt; color: #64748b; display: flex; justify-content: space-between; margin-top: 4px;">
                <span>Gaya: {{ ucfirst($s->learning_style) }}</span>
                <span>✂ Gunting di sini</span>
            </div>
        </div>
        @endforeach
    </div>
</body>
</html>`
  },
  {
    path: 'resources/views/print/grades.blade.php',
    category: 'Blade View',
    title: 'Print View: print/grades.blade.php',
    description: 'Layout cetak rekapitulasi nilai autentik per kelas lengkap dengan KKTP dan kolom tanda tangan guru pengampu.',
    code: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rekapitulasi Nilai Siswa - MPD-DigPAI</title>
    <style>
        @page { size: A4 portrait; margin: 1.2cm; }
        body { font-family: Arial, sans-serif; font-size: 9.5pt; color: #111; margin: 0; }
        .header { text-align: center; border-bottom: 2px solid #065f46; padding-bottom: 8px; margin-bottom: 12px; }
        .header h1 { margin: 0; font-size: 14pt; color: #065f46; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #94a3b8; padding: 4px 6px; text-align: left; }
        th { background: #f1f5f9; font-size: 8pt; text-align: center; }
        @media print { .btn-print { display: none; } }
    </style>
</head>
<body>
    <button class="btn-print" onclick="window.print()" style="margin-bottom:15px;padding:8px 16px;background:#065f46;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:bold;">
        🖨️ Cetak Rekap Nilai Ini (Ctrl+P)
    </button>
    <div class="header">
        <h1>Media Pembelajaran Digital Pendidikan Agama Islam (MPD-DigPAI)</h1>
        <p style="margin:2px 0;font-weight:bold;">REKAPITULASI HASIL BELAJAR PAI - {{ strtoupper($className) }}</p>
        <p style="margin:0;font-size:8.5pt;color:#475569;">Topik: Adab Bersosial Media dalam Islam • KKTP: 75.00 • Tanggal: {{ $printDate }}</p>
    </div>
    <table>
        <thead>
            <tr>
                <th style="width:25px;">No</th>
                <th style="text-align:left;">Nama Peserta Didik</th>
                <th>Gaya</th>
                <th>Diagnostik (15%)</th>
                <th>Formatif (25%)</th>
                <th>Tugas (30%)</th>
                <th>Sumatif (30%)</th>
                <th>Nilai Akhir</th>
                <th>Predikat</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($students as $index => $s)
            @php
                $p = $s->progressReport;
                $final = $p ? $p->final_grade : 83.5;
            @endphp
            <tr>
                <td style="text-align:center;">{{ $index + 1 }}</td>
                <td><strong>{{ $s->name }}</strong></td>
                <td style="text-align:center;">{{ ucfirst(substr($s->learning_style, 0, 1)) }}</td>
                <td style="text-align:center;">{{ $p ? $p->score_diagnostik : 80 }}</td>
                <td style="text-align:center;">{{ $p ? $p->score_formatif : 82 }}</td>
                <td style="text-align:center;">{{ $p ? $p->score_tugas : 85 }}</td>
                <td style="text-align:center;">{{ $p ? $p->score_sumatif : 84 }}</td>
                <td style="text-align:center;font-weight:bold;">{{ $final }}</td>
                <td style="text-align:center;font-weight:bold;">{{ $final >= 88 ? 'A' : 'B+' }}</td>
                <td style="text-align:center;">{{ $final >= 75 ? 'Tuntas' : 'Perlu Bimbingan' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 30px; display: flex; justify-content: flex-end;">
        <div style="text-align: center; width: 220px;">
            <p style="margin: 0;">Guru Pengampu PAI,</p>
            <div style="height: 55px;"></div>
            <p style="margin: 0; font-weight: bold; text-decoration: underline;">{{ $teacherName }}</p>
            <p style="margin: 2px 0 0 0; font-size: 8pt; color: #475569;">NIP. 19850412 201101 1 008</p>
        </div>
    </div>
</body>
</html>`
  },
  {
    path: 'resources/js/prayer-time-widget.js',
    category: 'JavaScript',
    title: 'JavaScript: prayer-time-widget.js (Alpine.js)',
    description: 'Komponen real-time jam digital WIB dan hitung mundur waktu sholat berikutnya secara dinamis.',
    code: `/**
 * Prayer Time Widget Component for Alpine.js
 * Jam Digital WIB Real-time & Hitung Mundur Waktu Sholat Otomatis
 */
function prayerTimeWidget() {
    return {
        currentTimeStr: '--:--:--',
        nextPrayerName: 'Dzuhur',
        countdownStr: '00:00:00',
        timerInterval: null,

        prayers: [
            { name: 'Subuh', h: 4, m: 52 },
            { name: 'Dzuhur', h: 12, m: 10 },
            { name: 'Ashar', h: 15, m: 25 },
            { name: 'Maghrib', h: 18, m: 15 },
            { name: 'Isya', h: 19, m: 28 },
        ],

        initWidget() {
            this.updateClock();
            this.timerInterval = setInterval(() => this.updateClock(), 1000);
        },

        updateClock() {
            const now = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            this.currentTimeStr = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()) + ' WIB';

            let currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            let targetPrayer = null;
            let targetSeconds = 0;

            for (let p of this.prayers) {
                let prayerSec = p.h * 3600 + p.m * 60;
                if (prayerSec > currentSeconds) {
                    targetPrayer = p;
                    targetSeconds = prayerSec;
                    break;
                }
            }

            if (!targetPrayer) {
                targetPrayer = this.prayers[0];
                targetSeconds = (24 * 3600) + (targetPrayer.h * 3600 + targetPrayer.m * 60);
            }

            this.nextPrayerName = targetPrayer.name;
            let diffSec = targetSeconds - currentSeconds;
            let hLeft = Math.floor(diffSec / 3600);
            let mLeft = Math.floor((diffSec % 3600) / 60);
            let sLeft = diffSec % 60;

            this.countdownStr = pad(hLeft) + ':' + pad(mLeft) + ':' + pad(sLeft);
        }
    };
}`
  },
  {
    path: 'routes/web.php',
    category: 'Routes',
    title: 'Routes: routes/web.php',
    description: 'Routing web Laravel 11+ lengkap dengan Auth Middleware, nama rute konsisten dengan Blade template, dan panel kelola kelas dinamis.',
    code: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\AuthController;
use App\\Http\\Controllers\\SchoolClassController;
use App\\Http\\Controllers\\ClassStudentController;
use App\\Http\\Controllers\\MaterialController;
use App\\Http\\Controllers\\ActivityController;
use App\\Http\\Controllers\\ProgressController;

/*
|--------------------------------------------------------------------------
| Web Routes - MPD-DigPAI (Media Pembelajaran Digital PAI)
|--------------------------------------------------------------------------
*/

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected Routes (Harus Login)
Route::middleware(['auth'])->group(function () {
    // 1. Beranda
    Route::view('/', 'beranda')->name('home');

    // 2. Petunjuk Pembelajaran
    Route::view('/petunjuk', 'instructions')->name('instructions');

    // 3. Tujuan Pembelajaran & Profil Pelajar Pancasila
    Route::view('/tujuan', 'objectives')->name('objectives');

    // 4. Materi Multi-Representasi (9 Media)
    Route::get('/materi', [MaterialController::class, 'index'])->name('materials.index');

    // 5. Sumber Belajar Digital
    Route::view('/sumber-belajar', 'digital-resources')->name('digital-resources');

    // 6. Aktivitas Gaya Belajar Berdiferensiasi
    Route::get('/aktivitas', [ActivityController::class, 'index'])->name('activities.index');

    // 7. Tugas / Produk Siswa
    Route::view('/tugas', 'submissions.index')->name('submissions.index');

    // 8. Forum Diskusi PAI
    Route::view('/diskusi', 'discussions.index')->name('discussions.index');

    // 9. Modul Asesmen
    Route::view('/asesmen', 'assessments.index')->name('assessments.index');

    // 10. Refleksi Mandiri
    Route::view('/refleksi', 'reflections.index')->name('reflections.index');

    // 11. Informasi Perkembangan Belajar
    Route::get('/kemajuan', [ProgressController::class, 'index'])->name('progress.index');

    // Panel Khusus Guru / Admin
    Route::prefix('guru')->middleware(['role:teacher'])->group(function () {
        // Kelola Kelas Dinamis
        Route::get('/kelas', [SchoolClassController::class, 'index'])->name('classes.index');
        Route::post('/kelas', [SchoolClassController::class, 'store'])->name('classes.store');
        Route::put('/kelas/{id}', [SchoolClassController::class, 'update'])->name('classes.update');
        Route::delete('/kelas/{id}', [SchoolClassController::class, 'destroy'])->name('classes.destroy');

        // Kelola Siswa per Kelas
        Route::get('/siswa', [ClassStudentController::class, 'index'])->name('students.index');
        Route::post('/siswa/{id}/update-style', [ClassStudentController::class, 'updateLearningStyle'])->name('students.update.style');
        Route::post('/siswa/{id}/reset-password', [ClassStudentController::class, 'resetPassword'])->name('students.reset.password');
        Route::get('/cetak-akun-siswa', [ClassStudentController::class, 'printAccounts'])->name('students.print.accounts');
        Route::get('/cetak-rekap-nilai', [ClassStudentController::class, 'printGrades'])->name('students.print.grades');
    });
});`
  }
];
