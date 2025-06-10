<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function index($taskId)
    {
        return Comment::where('task_id', $taskId)->with('user')->latest()->get();
    }

    public function store(Request $request, $taskId)
    {
        $request->validate([
            'content' => 'required|string'
        ]);

        $comment = Comment::create([
            'task_id' => $taskId,
            'user_id' => Auth::id(),
            'content' => $request->content,
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        $user = Auth::user();

        if ($user->id !== $comment->user_id && $user->role !== 'admin') {
            return response()->json(['message' => 'Không có quyền xóa bình luận này'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Đã xóa bình luận']);
    }
    public function count()
{
    return response()->json([
        'count' => \App\Models\Comment::count()
    ]);
}

}
