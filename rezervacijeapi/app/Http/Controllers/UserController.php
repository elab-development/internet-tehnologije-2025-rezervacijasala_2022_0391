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
        /*
        $users = User::all();
        return $users;*/
        $users = User::withCount(['rezervacije as otkazane_count' => function ($query) {
        $query->where('status', 'otkazana');
    }])->get();

    //  Mapiramo podatke tako da 'email' postane 'korisnickoIme' za frontend
    $mappedUsers = $users->map(function ($user) {
        return [
            'id' => $user->id,
            'ime' => $user->ime,
            'prezime' => $user->prezime,
            'korisnickoIme' => $user->email, //most između baze i frontenda
            'uloga' => $user->uloga,
            'banovan' => $user->banovan,
            'otkazane_count' => $user->otkazane_count ?? 0,
        ];
    });

    return response()->json($mappedUsers);
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
	    'banovan' => 'required|boolean'
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

            //NE VRACA GRESKU user nije pronadjen?
        }
           $user->delete();
           return response()->json(['message'=>'User je obrisan'],200);
    }

     public function ban($id) 
{
    $user = User::findOrFail($id);
    $user->update(['banovan' => true]);

    $user->rezervacije()
         ->whereIn('status', ['na_cekanju', 'potvrdjena'])
         ->update(['status' => 'otkazana']);

    return response()->json([
        'message' => "Korisnik {$user->name} je uspešno banovan i njegove rezervacije su otkazane."
    ]);
}
    /*public function unban($id) 
    {
        try{
        $user = User::findOrFail($id);
        if (!$user) {
            return response()->json(['message' => 'Korisnik nije pronadjen'], 404);
        }
        $user->update(['banovan' => false]);

        return response()->json([
            'message' => "Korisnik {$user->ime} je ponovo aktiviran."
        ]);
    }catch(\Exception $e){
        return response()->json([
            'error' => 'Backend Error',
            'details' => $e->getMessage()
        ], 500);
    }}*/
    public function unban($id) 
{
    // Koristimo \App\Models\User da budemo sigurni u putanju
    $user = \App\Models\User::find($id);

    if (!$user) {
        return response()->json(['message' => 'Korisnik nije pronađen'], 404);
    }

    // DIREKTNO upisujemo u bazu i spasavamo
    $user->banovan = 0; // 0 je siguran način za "false" u bazi
    $user->save();

    return response()->json([
        'message' => "Korisnik {$user->ime} je uspešno aktiviran.",
        'banovan' => $user->banovan // Vraćamo novi status da frontend vidi
    ], 200);
}
}
