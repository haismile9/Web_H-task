<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'start_time',
        'end_time',
        'location',
        'type',
        'status',
        'created_by'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    /**
     * The participants that belong to the meeting.
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'meeting_participants')
                    ->withTimestamps();
    }

    /**
     * The user who created the meeting.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Check if the meeting is today
     */
    public function getIsTodayAttribute(): bool
    {
        return $this->start_time->isToday();
    }

    /**
     * Check if the meeting is ongoing
     */
    public function getIsOngoingAttribute(): bool
    {
        $now = now();
        return $now->between($this->start_time, $this->end_time) && $this->status === 'in_progress';
    }

    /**
     * Check if the meeting is upcoming
     */
    public function getIsUpcomingAttribute(): bool
    {
        return $this->start_time->isFuture() && $this->status === 'scheduled';
    }

    /**
     * Get the meeting duration
     */
    public function getDurationAttribute(): string
    {
        $duration = $this->end_time->diff($this->start_time);
        return $duration->format('%h:%i');
    }

    /**
     * Get formatted time range
     */
    public function getFormattedTimeAttribute(): string
    {
        return $this->start_time->format('H:i') . ' - ' . $this->end_time->format('H:i');
    }
}
