<?php

use App\Enums\UserRole;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('regular users receive a 403 response when listing users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('admin.users.index'));

    $response->assertForbidden();
});

test('admins can list users', function () {
    $admin = User::factory()->admin()->create();
    User::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get(route('admin.users.index'));

    $response->assertOk();
});

test('admins can search users by name or email', function () {
    $admin = User::factory()->admin()->create();
    User::factory()->create(['name' => 'Findable Person', 'email' => 'findable@example.com']);
    User::factory()->create(['name' => 'Hidden Person', 'email' => 'hidden@example.com']);

    $response = $this->actingAs($admin)->get(route('admin.users.index', ['search' => 'Findable']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->where('filters.search', 'Findable')
        ->has('users.data', 1)
        ->where('users.data.0.name', 'Findable Person')
    );
});

test('regular users receive a 403 response when updating a role', function () {
    $user = User::factory()->create();
    $target = User::factory()->create();

    $response = $this->actingAs($user)->patch(route('admin.users.update', $target), [
        'role' => UserRole::Admin->value,
    ]);

    $response->assertForbidden();
    expect($target->refresh()->role)->toBe(UserRole::User);
});

test('admins can promote a regular user to admin', function () {
    $admin = User::factory()->admin()->create();
    $target = User::factory()->create();

    $response = $this->actingAs($admin)->patch(route('admin.users.update', $target), [
        'role' => UserRole::Admin->value,
    ]);

    $response->assertRedirect();
    expect($target->refresh()->role)->toBe(UserRole::Admin);
});

test('admins can demote another admin to regular user', function () {
    $admin = User::factory()->admin()->create();
    $target = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->patch(route('admin.users.update', $target), [
        'role' => UserRole::User->value,
    ]);

    $response->assertRedirect();
    expect($target->refresh()->role)->toBe(UserRole::User);
});

test('admins cannot change their own role', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->patch(route('admin.users.update', $admin), [
        'role' => UserRole::User->value,
    ]);

    $response->assertStatus(422);
    expect($admin->refresh()->role)->toBe(UserRole::Admin);
});

test('an invalid role is rejected', function () {
    $admin = User::factory()->admin()->create();
    $target = User::factory()->create();

    $response = $this->actingAs($admin)->patch(route('admin.users.update', $target), [
        'role' => 'superadmin',
    ]);

    $response->assertSessionHasErrors('role');
    expect($target->refresh()->role)->toBe(UserRole::User);
});
