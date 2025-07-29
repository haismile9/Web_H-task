<?php
// \Http\Controllers\AuthController.php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use App\Models\EmailVerification;
use App\Notifications\SendEmailVerificationCode;
use App\Http\Controllers\Controller;


class AuthController extends Controller
{
    public function register(Request $request)
{
    // Debug: Log request data
    \Log::info('Register request data: ', $request->all());
    
    $request->validate([
        'name' => 'required|string|max:100',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|confirmed|min:6',
    ]);

    // 🔁 Xóa code cũ
    EmailVerification::where('email', $request->email)->delete();

    // 📦 Tạo mã xác minh
    $code = rand(100000, 999999);
    EmailVerification::create([
        'email' => $request->email,
        'name' => $request->name,
        'password' => Hash::make($request->password),
        'code' => $code,
        'expires_at' => now()->addMinutes(10),
    ]);

    // 📤 Gửi mã qua email
    $notifiable = new \Illuminate\Notifications\AnonymousNotifiable;
    $notifiable->route('mail', $request->email)
        ->notify(new \App\Notifications\SendEmailVerificationCode($code));

    return response()->json(['message' => 'Mã xác minh đã được gửi']);
}


    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Sai email hoặc mật khẩu'], 422);
    }

    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
    ]);
}

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
    public function refreshToken(Request $request)
    {
        $user = $request->user();
        $newToken = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $newToken,
            'user' => $user,
        ]);
    }
    /**
     * Xử lý đăng xuất người dùng
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Đăng xuất thành công']);
    }

    public function updateProfile(Request $request)
{
    $request->validate(['name' => 'required|string|max:100']);
    $user = $request->user();
    $user->update(['name' => $request->name]);

    return response()->json([
        'message' => 'Cập nhật tên thành công',
        'user' => $user
    ]);
}
public function sendVerificationCode(Request $request)
{
    $request->validate(['email' => 'required|email|unique:users,email']);

    $code = rand(100000, 999999);
    EmailVerification::updateOrCreate(
        ['email' => $request->email],
        ['code' => $code, 'expires_at' => now()->addMinutes(10)]
    );

    $notifiable = new class($request->email) {
        public $email;
        public function __construct($email) { $this->email = $email; }
        public function routeNotificationForMail() { return $this->email; }
    };

    $notifiable->notify(new SendEmailVerificationCode($code));

    return response()->json(['message' => 'Đã gửi mã xác nhận đến email']);
}

public function verifyCode(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'code' => 'required',
    ]);

    $record = EmailVerification::where('email', $request->email)
        ->where('code', $request->code)
        ->where('expires_at', '>', now())
        ->first();

    if (!$record) {
        return response()->json(['message' => 'Mã không hợp lệ hoặc đã hết hạn'], 422);
    }

    return response()->json(['message' => 'Xác nhận thành công']);
}
public function verifyEmail(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'code' => 'required|string|size:6',
    ]);

    $user = User::where('email', $request->email)
                ->where('email_verification_code', strtoupper($request->code))
                ->first();

    if (!$user) {
        return response()->json(['message' => 'Mã xác minh không hợp lệ'], 422);
    }

    if (!$user->email_verified_at) {
    return response()->json(['message' => 'Tài khoản chưa xác minh email'], 403);
    }
    // Cập nhật trạng thái xác minh email
    if ($user->email_verified_at) {
        return response()->json(['message' => 'Email đã được xác minh trước đó'], 422);
    }

    $user->email_verified_at = now();
    $user->email_verification_code = null;
    $user->save();

    return response()->json(['message' => 'Xác minh email thành công']);
}


}
