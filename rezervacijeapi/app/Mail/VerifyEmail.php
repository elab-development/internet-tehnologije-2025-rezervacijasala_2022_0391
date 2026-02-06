<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/*
class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public string $verificationUrl;

   
    public function __construct(User $user, string $verificationUrl)
    {
        $this->user = $user;
        $this->verificationUrl = $verificationUrl;
    }


    public function build()
    {
        return $this->subject('Verifikacija email adresse')->markdown('email.verify-email');
    }


} */
class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $url;

    public function __construct($user, $url)
    {
        $this->user = $user;
        $this->url = $url;
    }

    public function build()
    {
        return $this->subject('Potvrda email adrese')
                    ->html("
                        <h1>Zdravo, {$this->user->ime}!</h1>
                        <p>Kliknite na dugme ispod da biste potvrdili svoj nalog:</p>
                        <a href='{$this->url}' style='background: #db2777; color: white; padding: 10px 20px; border-radius: 10px; text-decoration: none;'>
                            POTVRDI NALOG
                        </a>
                    ");
    }
}
