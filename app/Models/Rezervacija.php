<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rezervacija extends Model
{
    protected $fillable = [
        'idKorisnika',
        'idSale',
        'idTipDogadjaja',
        'pocetak',
        'kraj',
        'status',
        
    ];

    protected $casts = [
        'pocetak' => 'datetime',
        'kraj' => 'datetime',
    ];
   
    public function korisnik()
    {
        return $this->belongsTo(User::class, 'idKorisnika');
    }
    public function sala()
    {
        return $this->belongsTo(Sala::class, 'idSale');
    }
    public function tipDogadjaja()
    {
        return $this->belongsTo(TipDogadjaja::class, 'idTipDogadjaja');
    }
}
