<?php

namespace App\Http\Controllers;

use App\Mail\VerifyEmail;
use App\Models\User;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use SebastianBergmann\FileIterator\Facade;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'ime' =>'required|string|max:255',
            'prezime'=>'required|string|max:255',
            'email'=>'required|string|email|max:255|unique:users,email',
            'password'=>'required|string|min:6|confirmed',//password_confirmation
        ]);

        if($validator->fails()){
            return response()->json([
                'message'=>'Validacija nije prosla',
                'errors'=>$validator->errors(),
            ],422);
        }

        $data = $validator->validated();

        $user = User::create([
            'ime'=>$data['ime'],
            'prezime'=>$data['prezime'],
            'email'=>$data['email'],
            'password'=>$data['password'],
        ]);
        # necemo da koristimo token, jer ne zelimo da cim se registrovao bude prijvaljen
        # korisnik prvo treba da verifikuje svojj mejl
        // $token = $user->createToken('api_token')->plainTextToken;

        // logika za slanje verifikacionog mejla

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id]
        );
        
        Mail::to($user->email)->send(new VerifyEmail($user, $url));


        return response()->json([
            'message'=>'Registracija uspesna',
            'user'=>$user,
            // 'token'=>$token,
        ],201);
    }

        //POST/api/login
        public function login(Request $request)
        {
            $validator = Validator::make($request->all(),[
                'email'=>'required|string|email',
                'password'=>'required|string',
            ]);

            if($validator->fails()){
            return response()->json([
                'message'=>'Validacija nije prosla',
                'errors'=>$validator->errors(),
            ],422);
        }

        if(!FacadesAuth::attempt($validator->validated())){
             return response()->json([
                'message'=>'pogresan email ili lozinka',
             ],401);
        }

        $user = FacadesAuth::user();
        if($user->email_verified_at == null){
            return response()->json([
                'message' => 'Niste verifikovali email, ne možete da se prijavite.'
            ],200);
        }

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'message'=>'uspesno ste prijavljeni',
            'user'=>$user,
            'token'=>$token,
        ],200);


        }
        //POST /api/logout
        public function logout(Request $request)
        { /** @var \App\Models\User $user */

            $user = $request->user();

            //brisemo samo trenutni token
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message'=>'uspesno ste odjavljeni',
            ],200);
        }

        //GET /api/me
        public function me(Request $request)
        {
            return response()->json($request->user());
        }


        public function verifyEmail(Request $request, $id)
        {
            if(! $request->hasValidSignature()){
                return response()->json([
                    'message' => 'Link za verifikaciju je nevažeći ili je istekao.'
                ], 401);
            }

            $user = User::findOrFail($id);

            if($user->email_verified_at){
                return response()->json([
                    'message' => 'Email je već verifikovan.'
                ],200);
            }

            $user->email_verified_at = now();
            $user->save();

            return response()->json([
                    'message' => 'Email je uspesno verifikovan.'
                ],200);

        }

    }    







