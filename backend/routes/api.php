<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MeetingController;
use App\Http\Controllers\Auth\VerifyEmailController;


// 🟢 Public routes (không cần đăng nhập)
Route::get('/sanctum/csrf-cookie', fn () => response()->json(['csrf' => true]));
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 📤 Gửi và xác minh mã email (public - trước khi có token)
Route::post('/verify-email', [VerifyEmailController::class, 'verify']);
Route::post('/resend-code', [VerifyEmailController::class, 'resend']);

// 🔐 Password reset routes (public)
Route::post('/password/reset/send-code', [AuthController::class, 'sendPasswordResetCode']);
Route::post('/password/reset/verify-code', [AuthController::class, 'verifyPasswordResetCode']);
Route::post('/password/reset', [AuthController::class, 'resetPassword']);

// 🟡 Routes yêu cầu đăng nhập
Route::middleware('auth:sanctum')->group(function () {
    // 🔐 Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // 📦 Project
    Route::apiResource('projects', ProjectController::class);
    Route::post('/projects/{id}/members', [ProjectController::class, 'addMember']);
    Route::delete('/projects/{id}/members/{userId}', [ProjectController::class, 'removeMember']);
    Route::get('/projects/{id}/members', [ProjectController::class, 'getMembers']);

    // 📦 Task
    Route::get('/projects/{projectId}/tasks', [TaskController::class, 'index']);
    Route::post('/projects/{projectId}/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{id}', [TaskController::class, 'show']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
    Route::get('/my-tasks', [TaskController::class, 'myTasks']);
    
    // 📱 Mobile API endpoints
    Route::get('/mobile/today-tasks', [TaskController::class, 'todayTasks']);
    Route::get('/mobile/task-statistics', [TaskController::class, 'statistics']);
    Route::put('/mobile/tasks/{id}/status', [TaskController::class, 'updateStatus']);

    // 📅 Meeting routes
    Route::apiResource('meetings', MeetingController::class);
    Route::get('/mobile/today-meetings', [MeetingController::class, 'todayMeetings']);
    Route::get('/mobile/meeting-statistics', [MeetingController::class, 'statistics']);
    Route::put('/mobile/meetings/{id}/status', [MeetingController::class, 'updateStatus']);

    // 📦 Comment
    Route::get('/tasks/{taskId}/comments', [CommentController::class, 'index']);
    Route::post('/tasks/{taskId}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    // 📊 Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/tasks', [TaskController::class, 'dashboard']);

    // 🧠 Roles
    Route::middleware('role:admin')->get('/admin-only', fn () => 'Chào admin!');
    Route::middleware('role:admin,leader')->get('/manage-projects', fn () => 'Chào quản lý!');
    // Route::middleware('role:member')->get('/my-tasks', fn () => 'Chào thành viên!');

    // ⏰ Deadline
    Route::get('/tasks/{taskId}/reminder', [TaskController::class, 'sendDeadlineReminder']);

    // 👤 User profile
    Route::get('/user', fn (Request $request) => $request->user());
    Route::get('/account', fn (Request $req) => $req->user());
    Route::put('/account', [AuthController::class, 'updateProfile']);

    // 📊 Statistics
    Route::get('/projects/count', [ProjectController::class, 'count']);
    Route::get('/tasks/count', [TaskController::class, 'count']);
    Route::get('/comments/count', [CommentController::class, 'count']);

    // 🧾 Admin: thêm user
    Route::post('/users', [AuthController::class, 'store']);
    Route::get('/users/all', [AuthController::class, 'index']);

    // // 🔐 Kiểm tra email đã xác minh (tuỳ backend bạn dùng thêm logic bên trong)
    // Route::get('/verify-email/check', [AuthController::class, 'checkEmailVerified']);
});
