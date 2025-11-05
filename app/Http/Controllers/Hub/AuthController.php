<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Exibe a página de login do Hub
     */
    public function showLogin()
    {
        return Inertia::render('Hub/Login');
    }

    /**
     * Processa o login no Hub
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            $user = Auth::user();
            $userType = $user->userType->name;

            // Verifica se o usuário tem permissão para acessar o Hub
            // Apenas 'colaborador' não tem acesso
            $blockedTypes = ['colaborador'];
            
            if (in_array($userType, $blockedTypes)) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return back()->withErrors([
                    'email' => 'Seu tipo de usuário não tem acesso ao Hub.',
                ]);
            }

            return redirect()->intended(route('hub.dashboard'));
        }

        return back()->withErrors([
            'email' => 'As credenciais fornecidas não correspondem aos nossos registros.',
        ])->onlyInput('email');
    }

    /**
     * Processa o logout do Hub
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('hub.login');
    }
}
