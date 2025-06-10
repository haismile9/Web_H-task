<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\Task;
use App\Notifications\DeadlineReminderNotification;
use Carbon\Carbon;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        $schedule->call(function () {
            $tasks = Task::whereDate('deadline', Carbon::tomorrow())
                ->whereNotNull('assigned_to')
                ->with('assignedUser')
                ->get();

            foreach ($tasks as $task) {
                if ($task->assignedUser) {
                    $task->assignedUser->notify(new DeadlineReminderNotification($task));
                }
            }
        })->dailyAt('08:00');
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}
