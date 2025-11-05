<?php

use App\Http\Controllers\CMS\AuthController as CMSAuthController;
use App\Http\Controllers\CMS\SettingController;
use App\Http\Controllers\CMS\TurmaController;
use App\Http\Controllers\CMS\UsuarioController;
use App\Http\Controllers\Hub\AuthController as HubAuthController;
use App\Http\Controllers\Hub\HubController;
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

    Route::get('/login', [CMSAuthController::class, 'showLoginForm'])->name('login')->middleware('guest');
    Route::post('/login', [CMSAuthController::class, 'login'])->name('login.store')->middleware('guest');

    Route::middleware(['auth', 'check.admin'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');
        Route::post('/logout', [CMSAuthController::class, 'logout'])->name('logout');

        Route::get('/configuracoes', [SettingController::class, 'edit'])->name('settings.edit');
        Route::put('/configuracoes', [SettingController::class, 'update'])->name('settings.update');

        // Turmas e Usuários - Apenas Root e Admin (permission_level >= 4)
        Route::middleware('check.admin')->group(function () {
            Route::resource('turmas', TurmaController::class);
            Route::resource('usuarios', UsuarioController::class)->except(['show']);
        });
    });
});

// Hub (Inertia)
Route::prefix('hub')->name('hub.')->group(function () {
    Route::get('/', function () {
        if (auth()->check()) {
            // Verifica se o usuário tem permissão para acessar o Hub
            // Apenas 'colaborador' não tem acesso
            $blockedTypes = ['colaborador'];
            if (!in_array(auth()->user()->userType->name, $blockedTypes)) {
                return redirect()->route('hub.dashboard');
            } else {
                // Usuário logado mas sem permissão - fazer logout
                auth()->logout();
                return redirect()->route('hub.login')->with('error', 'Você não tem permissão para acessar o Hub.');
            }
        }
        return redirect()->route('hub.login');
    })->name('index');

    Route::get('/login', [HubAuthController::class, 'showLogin'])->name('login')->middleware('guest');
    Route::post('/login', [HubAuthController::class, 'login'])->name('login.store')->middleware('guest');

    Route::middleware(['auth', 'hub.access'])->group(function () {
        Route::get('/dashboard', [HubController::class, 'dashboard'])->name('dashboard');
        Route::post('/logout', [HubAuthController::class, 'logout'])->name('logout');
        Route::get('/resources', [HubController::class, 'getAvailableResources'])->name('resources');
    });
});
