<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class SendPasswordResetCode extends Notification
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
            ->subject('Mã reset mật khẩu H-task')
            ->line("Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.")
            ->line("Mã reset mật khẩu của bạn là: {$this->code}")
            ->line('Mã này sẽ hết hạn sau 10 phút.')
            ->line('Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.');
    }
}
