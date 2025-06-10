<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'user_id',
        'content',
    ];

    // Quan hệ: mỗi comment thuộc về 1 user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Quan hệ: mỗi comment thuộc về 1 task
    public function task()
    {
        return $this->belongsTo(Task::class);
    }
    public function count()
{
    return response()->json(['count' => Comment::count()]);
}
    public function scopeCount($query)
    {
        return $query->count();
    }
    public function scopeWithUser($query)
    {
        return $query->with('user');
    }
    public function scopeWithTask($query)
    {
        return $query->with('task');
    }
    public function scopeLatestFirst($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
    public function scopeForTask($query, $taskId)
    {
        return $query->where('task_id', $taskId);
    }
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
    public function scopeWithUserAndTask($query)
    {
        return $query->with(['user', 'task']);
    }
    public function scopeWithUserAndTaskLatestFirst($query)
    {
        return $query->with(['user', 'task'])->orderBy('created_at', 'desc');
    }   
    public function scopeWithUserAndTaskCount($query)
    {
        return $query->with(['user', 'task'])->count();
    }
    public function scopeWithUserAndTaskLatestFirstCount($query)
    {
        return $query->with(['user', 'task'])->orderBy('created_at', 'desc')->count();
}
}