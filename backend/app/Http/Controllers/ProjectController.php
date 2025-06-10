<?php
//Controller/ProjectController.php
namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
        return response()->json(Project::all());
    }


        // 🎯 Chỉ lấy những project mà user này tham gia hoặc sở hữu
        $projects = Project::where('owner_id', $user->id)
            ->orWhereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->get();

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'background_url' => 'nullable|string|max:500', // 🆕 validate ảnh nền
            'collaborator_email' => 'nullable|email|exists:users,email'
        ]);

        DB::beginTransaction();

        try {
            $project = Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'background_url' => $request->background_url, // ✅ Thêm dòng này
            'owner_id' => $user->id,
        ]);


            // 🛡️ Gán chủ sở hữu luôn là leader
            $project->users()->attach($user->id, ['role' => 'leader']);

            // Nếu có email cộng tác viên
            if ($request->collaborator_email) {
                $collaborator = User::where('email', $request->collaborator_email)->first();
                if ($collaborator) {
                    $project->users()->attach($collaborator->id, ['role' => 'member']);
                }
            }

            DB::commit();
            return response()->json($project, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi khi tạo dự án'], 500);
        }
    }

    public function show($id)
{
    $project = Project::with('users')->findOrFail($id);

    return response()->json([
        'id' => $project->id,
        'name' => $project->name,
        'description' => $project->description,
        'background_url' => $project->background_url, // ✅
        'owner_id' => $project->owner_id, // ✅ fix visibility
        'users' => $project->users
    ]);
}


    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $user = Auth::user();

        // 🎯 Chỉ admin hoặc chủ sở hữu mới được sửa
        if ($user->id !== $project->owner_id && $user->role !== 'admin') {
            return response()->json(['message' => 'Không có quyền chỉnh sửa'], 403);
        }

        $project->update($request->only(['name', 'description', 'background_url']));


        return response()->json($project);
    }

   public function destroy(Project $project)
{
    $user = Auth::user();

    if ($user->id !== $project->owner_id && $user->role !== 'admin') {
        return response()->json(['message' => 'Không có quyền xóa'], 403);
    }

    $project->forceDelete(); // ✅ Xoá vĩnh viễn

    return response()->json(['message' => 'Đã xoá vĩnh viễn'], 200);
}
    public function getMembers($id)
    {
        $project = Project::with('users')->findOrFail($id);

        return response()->json($project->users);
    }
    public function removeMember($id, $userId)
    {
        $project = Project::findOrFail($id);
        $currentUser = Auth::user();

        // 🔒 Chỉ chủ sở hữu mới có quyền xoá thành viên
        if ($currentUser->id !== $project->owner_id) {
            return response()->json(['message' => 'Bạn không có quyền xoá thành viên'], 403);
        }

        // Kiểm tra xem người dùng có phải là thành viên của dự án không
        if (!$project->users()->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'Người dùng không phải là thành viên của dự án'], 404);
        }

        $project->users()->detach($userId);

        return response()->json(['message' => 'Thành viên đã được xoá'], 200);
    }


    public function count()
    {
        return response()->json([
            'total' => Project::count()
        ]);
    }
    public function addMember(Request $request, $id)
{
    $request->validate([
        'email' => 'required|email|exists:users,email',
    ]);

    $project = Project::findOrFail($id);
    $currentUser = Auth::user();

    // 🔒 Chỉ chủ sở hữu mới có quyền thêm thành viên
    if ($currentUser->id !== $project->owner_id) {
        return response()->json(['message' => 'Bạn không có quyền thêm thành viên'], 403);
    }

    $user = User::where('email', $request->email)->first();

    if ($project->users()->where('user_id', $user->id)->exists()) {
        return response()->json(['message' => 'Người dùng đã là thành viên'], 200);
    }

    $project->users()->attach($user->id, ['role' => 'member']);

    return response()->json(['message' => 'Thành viên đã được thêm'], 200);
}


}
