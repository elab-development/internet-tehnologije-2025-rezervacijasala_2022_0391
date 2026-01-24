<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Karakteristika extends Model
{
    use HasFactory;
    protected $table='karakteristike';
    protected $fillable = [
        'naziv'
        
    ];

    public function sale()
{
    return $this->belongsToMany(Sala::class, 'sala_karakteristika', 'idKarakteristika', 'idSale');
}
}
