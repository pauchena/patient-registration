<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PatientRegisteredNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome! Your Registration is Complete')
            ->greeting('Hello ' . $notifiable->full_name . '!')
            ->line('Thank you for registering with us.')
            ->line('Your patient registration has been successfully completed.')
            ->line('We will contact you if we need any additional information.')
            ->line('Thank you for choosing our services!');
    }
}
