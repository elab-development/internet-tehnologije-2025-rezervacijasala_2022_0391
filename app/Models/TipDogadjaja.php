<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipDogadjaja extends Model
{
    protected $table = 'tipovidogadjaja';
    protected $fillable = [
        'naziv'
    ];

    public function rezervacije()
    {
        return $this->hasMany(Rezervacija::class, 'idTipDogadjaja');
    }

    public function sale()
    {
        // Povezuje TipDogadjaja sa Salom preko pivot tabele
        return $this->belongsToMany(Sala::class, 'sala_tip_dogadjaja', 'idTipDogadjaja', 'idSale');
    }
}
