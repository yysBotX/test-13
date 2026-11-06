<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('admin.dashboard'));

    $response->assertRedirect(route('login'));
});

test('regular users receive a 403 response', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $response->assertForbidden();
});

test('admins can visit the admin dashboard', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertOk();
});

test('unverified admins are redirected to the verification notice', function () {
    $admin = User::factory()->admin()->unverified()->create();

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertRedirect(route('verification.notice'));
});
