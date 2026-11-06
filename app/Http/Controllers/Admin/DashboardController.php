<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => User::count(),
                'admins' => User::where('role', UserRole::Admin)->count(),
                'verifiedUsers' => User::whereNotNull('email_verified_at')->count(),
            ],
            'recentUsers' => User::latest()
                ->limit(5)
                ->get(['id', 'name', 'email', 'role', 'created_at'])
                ->map(fn (User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                    'created_at' => $user->created_at?->toISOString(),
                ]),
        ]);
    }
}
