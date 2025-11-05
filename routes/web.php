<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CMS\TurmaController;
use App\Http\Controllers\CMS\UsuarioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Site (Blade)
Route::get('/', function () {
    return view('site.home');
})->name('site.home');

// CMS (Inertia)
Route::prefix('cms')->name('cms.')->group(function () {
    Route::get('/', function () {
        if (auth()->check()) {
            // Verifica se o usuário tem permissão para acessar o CMS
            if (auth()->user()->userType->permission_level >= 4) {
                return redirect()->route('cms.dashboard');
            } else {
                // Usuário logado mas sem permissão - fazer logout
                auth()->logout();
                return redirect()->route('cms.login')->with('error', 'Você não tem permissão para acessar o CMS.');
            }
        }
        return redirect()->route('cms.login');
    })->name('index');

    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login')->middleware('guest');
    Route::post('/login', [LoginController::class, 'login'])->name('login.store')->middleware('guest');

    Route::middleware(['auth', 'check.admin'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');
        Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

        // Turmas e Usuários - Apenas Root e Admin (permission_level >= 4)
        Route::middleware('check.admin')->group(function () {
            Route::resource('turmas', TurmaController::class);
            Route::resource('usuarios', UsuarioController::class)->except(['show']);
        });
    });
});
