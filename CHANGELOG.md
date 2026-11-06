# Changelog

Semua perubahan penting pada proyek ini didokumentasikan di file ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/), dan proyek ini menggunakan [Semantic Versioning](https://semver.org/lang/id/).

## [1.0.0] - 2026-11-06

Rilis awal proyek.

### Added

- **Aplikasi dasar Laravel 13 + Inertia v3 + React** (starter kit `laravel/react-starter-kit`) dengan:
  - Autentikasi via Laravel Fortify: login, registrasi, lupa/reset password, verifikasi email, konfirmasi password, two-factor authentication (2FA), dan passkeys.
  - Halaman pengaturan: profil, keamanan (password & 2FA), dan tampilan (appearance).
  - Halaman dashboard untuk user terautentikasi.
  - Vite, Tailwind CSS v4, komponen UI berbasis Radix UI (shadcn-style), Wayfinder untuk route TypeScript yang type-safe.
- **Sistem role admin**:
  - Enum `App\Enums\UserRole` (`admin` / `user`) dengan cast otomatis di model `User` dan helper `isAdmin()`.
  - Kolom `role` pada tabel `users` (default `user`) via migration `2026_11_06_162801_add_role_to_users_table`.
  - Middleware `EnsureUserIsAdmin` (alias `admin`) — area `/admin/*` hanya bisa diakses role admin (selain itu 403), dikombinasikan dengan middleware `auth` dan `verified`.
  - Route admin di `routes/admin.php`:
    - `GET /admin` (`admin.dashboard`) — dashboard admin: statistik total user, jumlah admin, user terverifikasi, dan 5 user terbaru.
    - `GET /admin/users` (`admin.users.index`) — daftar user dengan pencarian nama/email, paginate 10 per halaman.
    - `PATCH /admin/users/{user}` (`admin.users.update`) — ubah role user (promote/demote).
  - Controller `Admin\DashboardController` dan `Admin\UserController`; validasi role via form request `Admin\UpdateUserRoleRequest` (`Rule::enum`).
  - Admin **tidak dapat mengubah role akunnya sendiri** (422), dan atribut `role` tidak masuk `$fillable` (anti mass-assignment).
  - Halaman React baru `resources/js/pages/admin/dashboard.tsx` dan `resources/js/pages/admin/users/index.tsx` (tabel user: search, badge verified, dropdown role, pagination, penanda "You").
  - Sidebar menampilkan grup **Admin** (Admin Dashboard, User Management) hanya untuk user dengan role admin.
  - Factory `UserFactory::admin()` state; seeder membuat `admin@example.com` (admin) dan `test@example.com` (user biasa).
  - Test fitur `tests/Feature/Admin/` (12 test): redirect guest ke login, 403 untuk non-admin, 200 untuk admin, redirect user belum terverifikasi, akses/pencarian/paginate daftar user, promote & demote role, proteksi role akun sendiri, dan penolakan role tidak valid.
- **Tooling & kualitas kode**: Pest (feature test), PHPStan/Larastan, Laravel Pint, workflow CI GitHub Actions (`.github/workflows/tests.yml`), dependabot.
- **Laravel Boost** untuk tooling agent (post-update script `boost:update`).

### Changed

- `NavMain` sekarang menerima prop `label` (default `Platform`) agar bisa dipakai untuk grup sidebar tambahan ("Admin").
- Tipe `User` di frontend (`resources/js/types/auth.ts`) menambahkan field `role: 'admin' | 'user'`.


