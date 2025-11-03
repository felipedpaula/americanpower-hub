<?php

use App\Http\Controllers\Auth\LoginController;
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
            return redirect()->route('cms.dashboard');
        }
        return redirect()->route('cms.login');
    })->name('index');

    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login')->middleware('guest');
    Route::post('/login', [LoginController::class, 'login'])->name('login.store')->middleware('guest');

    Route::middleware(['auth', 'check.permission'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard');
        })->name('dashboard');
        Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
    });
});
