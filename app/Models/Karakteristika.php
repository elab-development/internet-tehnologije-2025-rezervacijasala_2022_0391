<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Karakteristika extends Model
{
    protected $table='karakteristike';
    protected $fillable = [
        'naziv'
        
    ];

    public function sale()
{
    return $this->belongsToMany(Sala::class, 'sala_karakteristika', 'idKarakteristika', 'idSale');
}
}
