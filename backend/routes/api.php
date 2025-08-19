<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\VerifyEmailController;
// use App\Http\Controllers\InstagramPostController;
// use App\Http\Controllers\ShopeeProductController;
use App\Http\Controllers\ProgressReportController;


// 🟢 Public routes (không cần đăng nhập)
// CSRF Cookie route
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 🧪 Test routes (public for testing)


// 📤 Gửi và xác minh mã email (public - trước khi có token)
Route::post('/verify-email', [VerifyEmailController::class, 'verify']);
Route::post('/resend-code', [VerifyEmailController::class, 'resend']);

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

    // 📸 Instagram Posts Management - COMMENTED OUT UNTIL CONTROLLER IS CREATED
    // Route::get('/instagram-posts', [InstagramPostController::class, 'index']);
    // Route::post('/instagram-posts/crawl', [InstagramPostController::class, 'crawl']);
    // Route::get('/instagram-posts/{post}', [InstagramPostController::class, 'show']);
    // Route::put('/instagram-posts/{post}', [InstagramPostController::class, 'update']);
    // Route::delete('/instagram-posts/{post}', [InstagramPostController::class, 'destroy']);

    // 🛒 Shopee Products Management - COMMENTED OUT UNTIL CONTROLLER IS CREATED
    // Route::get('/shopee-products', [ShopeeProductController::class, 'index']);
    // Route::post('/shopee-products/crawl', [ShopeeProductController::class, 'crawl']);
    // Route::get('/shopee-products/{product}', [ShopeeProductController::class, 'show']);
    // Route::put('/shopee-products/{product}', [ShopeeProductController::class, 'update']);
    // Route::delete('/shopee-products/{product}', [ShopeeProductController::class, 'destroy']);

    // 📊 Progress Reports Management
    Route::get('/projects/{projectId}/progress-reports', [ProgressReportController::class, 'index']);
    Route::post('/projects/{projectId}/progress-reports', [ProgressReportController::class, 'store']);
    Route::get('/projects/{projectId}/progress-reports/{reportId}', [ProgressReportController::class, 'show']);
    Route::put('/projects/{projectId}/progress-reports/{reportId}', [ProgressReportController::class, 'update']);
    Route::delete('/projects/{projectId}/progress-reports/{reportId}', [ProgressReportController::class, 'destroy']);
    Route::get('/projects/{projectId}/progress-reports-chart', [ProgressReportController::class, 'getChartData']);
    Route::post('/projects/{projectId}/progress-reports/auto-generate', [ProgressReportController::class, 'autoGenerate']);
    Route::post('/projects/{projectId}/progress-reports/export-chart', [ProgressReportController::class, 'exportChart']);

    // // 🔐 Kiểm tra email đã xác minh (tuỳ backend bạn dùng thêm logic bên trong)
    // Route::get('/verify-email/check', [AuthController::class, 'checkEmailVerified']);
});
