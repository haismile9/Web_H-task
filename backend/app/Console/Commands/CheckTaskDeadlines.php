<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Task;
use App\Models\User;
use App\Mail\TaskDeadlineReminderMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class CheckTaskDeadlines extends Command
{
    protected $signature = 'check:task-deadlines';
    protected $description = 'Gửi mail nhắc nhở các task gần đến deadline hoặc trễ deadline';

    public function handle()
    {
        $now = Carbon::now();
        $soon = $now->copy()->addDays(1); // Lọc task sắp đến hạn (trong 1 ngày tới)

        $tasks = Task::whereNotNull('deadline')
            ->where('status', '!=', 'done')
            ->whereBetween('deadline', [$now, $soon])
            ->get();

        foreach ($tasks as $task) {
            if (!$task->assigned_to) continue;

            $user = \App\Models\User::find($task->assigned_to);
            if ($user && $user->email) {
                Mail::to($user->email)->send(new TaskDeadlineReminderMail($task));
                $this->info("📧 Gửi mail nhắc: " . $user->email . " - Task: " . $task->title);
            }
        }

        $this->info('✅ Quét xong deadline.');
    }
}
