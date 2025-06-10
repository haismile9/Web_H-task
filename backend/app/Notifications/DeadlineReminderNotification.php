<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Task;

class DeadlineReminderNotification extends Notification
{
    use Queueable;

    public Task $task;

    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('🔔 Nhắc nhở deadline công việc')
            ->greeting('Xin chào ' . $notifiable->name)
            ->line('Công việc "' . $this->task->title . '" sắp đến hạn vào ngày: ' . $this->task->deadline)
            ->action('Xem chi tiết', url('/tasks/' . $this->task->id))
            ->line('Vui lòng hoàn thành đúng hạn nhé!');
    }
}
