<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('instagram_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable(); // Caption/title
            $table->text('caption')->nullable(); // Full caption
            $table->string('instagram_url'); // Original Instagram URL
            $table->json('image_urls'); // Array of image URLs
            $table->decimal('price', 10, 2)->nullable()->default(0); // Price
            $table->string('instagram_id')->nullable(); // Instagram post ID
            $table->string('username')->nullable(); // Instagram username
            $table->integer('likes_count')->nullable()->default(0);
            $table->datetime('posted_at')->nullable(); // When posted on Instagram
            $table->enum('status', ['active', 'sold', 'hidden'])->default('active');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Who added this post
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->unique('instagram_url'); // Prevent duplicate URLs
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instagram_posts');
    }
};
