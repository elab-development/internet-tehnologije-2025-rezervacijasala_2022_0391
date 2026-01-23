<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sala extends Model
{
    protected $fillable = [
        'naziv',
        'kapacitet',
        'opis',
        'lokacija'
    ];

    /*protected $casts = [

    ] */
   public function rezervacije()
    {
        return $this->hasMany(Rezervacija::class, 'idSale');
    }

    public function karakteristike()
    {
        return $this->belongsToMany(Karakteristika::class, 'sala_karakteristika', 'idSale', 'idKarakteristika');
        //sala_karakteristika je ime tabele u bazi(znaci nazovi ovako ili promeni ovde nzaiv)
    }

    public function dozvoljeniTipoviDogadjaja()
    {
        return $this->belongsToMany(TipDogadjaja::class, 'sala_tip_dogadjaja', 'idSale', 'idTipDogadjaja');
        //isto vazi i ovde
    }
  
}
