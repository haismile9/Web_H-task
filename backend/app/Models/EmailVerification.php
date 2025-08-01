<?php

// app/Models/EmailVerification.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailVerification extends Model
{
    protected $fillable = ['email', 'code', 'expires_at'];
    public $timestamps = true;

    protected $casts = [
        'expires_at' => 'datetime',
    ];
}
