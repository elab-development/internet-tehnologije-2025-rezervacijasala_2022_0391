<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    //GET
    public function index()
    {
        //
        $users = User::all();
        return $users;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    //POST
    public function store(Request $request)
    {
       
    }

    /**
     * Display the specified resource.
     */
    //GET
    public function show(User $user_id)
    {
        

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    //PUT
    public function update(Request $request, $user_id)
    {
    }

    /**
     * Remove the specified resource from storage.
     */
    //DELETE
    public function destroy($user_id)
    {
        /** @var User $user */
        $user = User::find($user_id);
        if(!$user){
            return response()->json(['message'=>'User nije pronadjen'],404);

        }
           $user->delete();
           return response()->json(['message'=>'User je obrisan'],200);
    }
}
