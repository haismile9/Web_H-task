<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TaskDeadlineReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $task;
    public function __construct($task)
    {
        $this->task = $task;
    }

    public function build()
    {
        return $this->subject("⏰ Nhắc nhở deadline task: {$this->task->title}")
                    ->view('emails.task_deadline_reminder');
    }
}
