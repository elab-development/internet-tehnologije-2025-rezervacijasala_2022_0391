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
        $validator = Validator::make($request->all(), [
        'ime' => 'required|string|max:255',
        'prezime' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8',
        'uloga' => 'required|in:administrator,ulogovan,neulogovan', // tvoje uloge,enum
    ]);

        if($validator->fails()){
            return response()->json([
                'message'=>'Validacija nije prosla',
                'errors'=>$validator->errors(),
           ],422 );

        }
        $data = $validator->validated();
        $user = User::create($data);
        return response()->json($user,201);
    }

    /**
     * Display the specified resource.
     */
    //GET
    public function show(User $user_id)
    {
        
        return User::find($user_id);

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
        /** @var User $user */
        $user = User::find($user_id);

        if(!$user){
            return response()->json(['message'=>'User nije pronadjen'],404);
        }

         $validator = Validator::make($request->all(), [
        'ime' => 'sometimes|string|max:255',
        'prezime' => 'sometimes|string|max:255',
        'email' => 'sometimes|string|email|max:255|unique:users,email,'. $user_id,
        'password' => 'sometimes|string|min:8',
        'uloga' => 'sometimes|in:administrator,ulogovan,neulogovan', // tvoje uloge,enum
    ]);

        if($validator->fails()){
            return response()->json([
                'message'=>'Validacija nije prosla',
                'errors'=>$validator->errors(),
           ],422 );
           }
           
           $data = $validator->validated();
        $user->update($data);
        return response()->json($user,200);
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
