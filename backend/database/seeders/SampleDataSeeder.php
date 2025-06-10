<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        // 🧑‍💼 Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // 👤 Member
        $member = User::firstOrCreate(
            ['email' => 'member@example.com'],
            [
                'name' => 'Member User',
                'password' => Hash::make('password'),
                'role' => 'member',
            ]
        );

        // 👑 Owner
        $owner = User::firstOrCreate(
            ['email' => 'owner@example.com'],
            [
                'name' => 'Owner User',
                'password' => Hash::make('password'),
                'role' => 'owner',
            ]
        );

        // 📁 Project cho Admin
        $project = Project::firstOrCreate(
            ['name' => 'Dự án thử nghiệm'],
            [
                'description' => 'Dự án để test gửi mail',
                'owner_id' => $admin->id,
            ]
        );

        // 📁 Project cho Owner
        $projectOwned = Project::firstOrCreate(
            ['name' => 'Dự án của Owner'],
            [
                'description' => 'Project do owner quản lý',
                'owner_id' => $owner->id,
            ]
        );

        // 🔗 Gắn member vào project admin
        if (!$project->users()->where('user_id', $member->id)->exists()) {
            $project->users()->attach($member->id, ['role' => 'member']);
        }

        // 🔗 Gắn owner vào project của họ
        if (!$projectOwned->users()->where('user_id', $owner->id)->exists()) {
            $projectOwned->users()->attach($owner->id, ['role' => 'owner']);
        }

        // 🔗 Gắn admin vào project của admin
        if (!$project->users()->where('user_id', $admin->id)->exists()) {
            $project->users()->attach($admin->id, ['role' => 'admin']);
        }

        // ✅ TASKS cho project admin
        Task::firstOrCreate(
            ['title' => '📧 Gửi email test deadline'],
            [
                'description' => 'Task test mail deadline gửi về Gmail',
                'status' => 'pending',
                'deadline' => Carbon::tomorrow(),
                'project_id' => $project->id,
                'assigned_to' => $member->id,
            ]
        );

        Task::firstOrCreate(
            ['title' => 'Task của Admin'],
            [
                'description' => 'Task này do admin tạo',
                'status' => 'pending',
                'deadline' => Carbon::tomorrow()->addDays(3),
                'project_id' => $project->id,
                'assigned_to' => $admin->id,
            ]
        );

        Task::firstOrCreate(
            ['title' => 'Task của Member'],
            [
                'description' => 'Task này do member tạo',
                'status' => 'pending',
                'deadline' => Carbon::tomorrow()->addDays(4),
                'project_id' => $project->id,
                'assigned_to' => $member->id,
            ]
        );

        Task::firstOrCreate(
            ['title' => 'Task không có người được giao'],
            [
                'description' => 'Task này không có người được giao',
                'status' => 'pending',
                'deadline' => Carbon::tomorrow()->addDays(5),
                'project_id' => $project->id,
                'assigned_to' => null,
            ]
        );

        Task::firstOrCreate(
            ['title' => 'Task quá hạn'],
            [
                'description' => 'Task này đã quá hạn',
                'status' => 'pending',
                'deadline' => Carbon::yesterday(),
                'project_id' => $project->id,
                'assigned_to' => $member->id,
            ]
        );

        // ✅ TASK cho project owner
        Task::firstOrCreate(
            ['title' => 'Task của Owner'],
            [
                'description' => 'Task này do owner tạo',
                'status' => 'pending',
                'deadline' => Carbon::tomorrow()->addDays(2),
                'project_id' => $projectOwned->id,
                'assigned_to' => $owner->id,
            ]
        );
    }
}
