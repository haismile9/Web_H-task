<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstagramPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'caption',
        'instagram_url',
        'image_urls',
        'price',
        'instagram_id',
        'username',
        'likes_count',
        'posted_at',
        'status',
        'user_id',
    ];

    protected $casts = [
        'image_urls' => 'array',
        'price' => 'decimal:2',
        'likes_count' => 'integer',
        'posted_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getFirstImageAttribute(): ?string
    {
        return $this->image_urls[0] ?? null;
    }

    public function getImageCountAttribute(): int
    {
        return count($this->image_urls ?? []);
    }
}
