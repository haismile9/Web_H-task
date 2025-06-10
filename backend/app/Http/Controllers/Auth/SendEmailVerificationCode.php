<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class SendEmailVerificationCode extends Notification
{
    public string $code;

    public function __construct(string $code)
    {
        $this->code = $code;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('🔐 Xác minh địa chỉ Email của bạn')
            ->greeting('Xin chào ' . $notifiable->name)
            ->line("Mã xác minh của bạn là: **{$this->code}**")
            ->line('Vui lòng nhập mã này để hoàn tất đăng ký.')
            ->line('Cảm ơn bạn đã sử dụng hệ thống!');
    }
}
