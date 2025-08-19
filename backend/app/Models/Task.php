<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'status',
        'priority',
        'deadline',
        'assigned_to',
    ];

    // Quan hệ: Task thuộc về một project
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    // Quan hệ: Task được gán cho 1 user
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Quan hệ: Task có nhiều comment
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function assignedUsers()
    {
        return $this->belongsToMany(User::class, 'task_user');
    }
}
