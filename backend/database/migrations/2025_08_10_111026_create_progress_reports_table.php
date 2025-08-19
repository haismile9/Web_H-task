<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('progress_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Member được báo cáo
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade'); // Người tạo báo cáo
            $table->string('period'); // 'weekly', 'monthly', 'custom'
            $table->date('start_date');
            $table->date('end_date');
            $table->json('main_tasks'); // Array of main task IDs
            $table->json('support_tasks'); // Array of support task IDs  
            $table->decimal('completion_percentage', 5, 2); // 0.00 - 100.00
            $table->text('notes')->nullable(); // Ghi chú vướng mắc
            $table->text('achievements')->nullable(); // Thành tựu đạt được
            $table->enum('status', ['draft', 'submitted', 'approved'])->default('draft');
            $table->timestamps();
            
            $table->index(['project_id', 'period', 'start_date']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('progress_reports');
    }
};
