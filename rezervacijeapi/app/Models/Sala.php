<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sala extends Model
{
    use HasFactory;
    protected $table='sale';
    protected $fillable = [
        'naziv',
        'kapacitet',
        'opis',
        'lokacija',
        'slike'
    ];

    /*protected $casts = [

    ] */
   public function rezervacije()
    {
        return $this->hasMany(Rezervacija::class, 'idSale');
    }

    public function karakteristike()
    {
        return $this->belongsToMany(Karakteristika::class, 'karakteristika_sala', 'idSale', 'idKarakteristika');
      
    }

    public function tipovi_dogadjaja()
    {
        return $this->belongsToMany(TipDogadjaja::class, 'sala_tip_dogadjaja', 'idSale', 'idTipDogadjaja');
        
    }
  
}
