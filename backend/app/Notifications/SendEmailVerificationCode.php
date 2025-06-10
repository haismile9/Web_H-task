<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class SendEmailVerificationCode extends Notification
{
    public $code;

    public function __construct($code)
    {
        $this->code = $code;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Mã xác nhận đăng ký QLCV')
            ->line("Mã xác nhận của bạn là: {$this->code}")
            ->line('Mã sẽ hết hạn sau 10 phút.');
    }
}
