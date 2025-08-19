<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProgressReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'user_id',
        'created_by',
        'period',
        'start_date',
        'end_date',
        'main_tasks',
        'support_tasks',
        'completion_percentage',
        'notes',
        'achievements',
        'status',
    ];

    /**
     * The attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'main_tasks' => 'array',
            'support_tasks' => 'array',
            'completion_percentage' => 'decimal:2',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    // Relationships
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getMainTasksDetails()
    {
        return Task::whereIn('id', $this->main_tasks ?? [])->get();
    }

    public function getSupportTasksDetails()
    {
        return Task::whereIn('id', $this->support_tasks ?? [])->get();
    }

    // Scopes
    public function scopeForProject($query, $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeInPeriod($query, $startDate, $endDate)
    {
        return $query->whereBetween('start_date', [$startDate, $endDate])
                     ->orWhereBetween('end_date', [$startDate, $endDate]);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }
}
