@component('mail::message')
# Zdravo, {{ $user->ime }}

Hvala što ste se registrovali na našu aplikaciju.

Molimo Vas da verifikujete svoju email adresu klikom na dugme ispod:

@component('mail::button', ['url' => $verificationUrl])
Verifikuj email
@endcomponent

Ako niste kreirali ovaj nalog, slobodno ignorišite ovu poruku.

Hvala<br>
{{ config('app.name') }}
@endcomponent
