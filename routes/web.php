<?php

use App\Http\Controllers\CMS\AuthController as CMSAuthController;
use App\Http\Controllers\CMS\SettingController;
use App\Http\Controllers\CMS\TurmaController;
use App\Http\Controllers\CMS\UsuarioController;
use App\Http\Controllers\Hub\AtividadeController;
use App\Http\Controllers\Hub\AuthController as HubAuthController;
use App\Http\Controllers\Hub\HubController;
use App\Http\Controllers\Hub\TurmaController as HubTurmaController;
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

        Route::get('/turmas', [HubTurmaController::class, 'index'])->name('turmas.index');
        Route::get('/turmas/{id}', [HubTurmaController::class, 'show'])->name('turmas.show');

        // Rotas de Atividades
        Route::prefix('atividades')->name('atividades.')->group(function () {
            // Rotas acessíveis por todos os usuários autenticados do hub
            Route::get('/', [AtividadeController::class, 'index'])->name('index');

            // Rotas para criação e edição (professores, admin, root)
            Route::middleware('check.permission')->group(function () {
                Route::get('/create', [AtividadeController::class, 'create'])->name('create');
                Route::post('/', [AtividadeController::class, 'store'])->name('store');
                Route::get('/{id}/edit', [AtividadeController::class, 'edit'])->name('edit');
                Route::put('/{id}', [AtividadeController::class, 'update'])->name('update');
                Route::delete('/{id}', [AtividadeController::class, 'destroy'])->name('destroy');

                // Gestão de questões
                Route::get('/{id}/questoes/create', [AtividadeController::class, 'createQuestao'])->name('questoes.create');
                Route::post('/{id}/questoes', [AtividadeController::class, 'addQuestao'])->name('questoes.store');
                Route::put('/{id}/questoes/{questaoId}', [AtividadeController::class, 'updateQuestao'])->name('questoes.update');
                Route::delete('/{id}/questoes/{questaoId}', [AtividadeController::class, 'destroyQuestao'])->name('questoes.destroy');

                // Correção
                Route::get('/{id}/submissoes', [AtividadeController::class, 'submissoes'])->name('submissoes');
                Route::get('/{id}/submissoes/{alunoId}', [AtividadeController::class, 'visualizarSubmissao'])->name('submissoes.show');
                Route::put('/{id}/submissoes/{alunoId}/questoes/{questaoId}', [AtividadeController::class, 'corrigirQuestao'])->name('submissoes.corrigir');
                Route::post('/{id}/submissoes/{alunoId}/finalizar', [AtividadeController::class, 'finalizarCorrecao'])->name('submissoes.finalizar');
            });

            // Rotas gerais (precisam estar depois de rotas específicas)
            Route::get('/{id}', [AtividadeController::class, 'show'])->name('show');

            // Rotas para alunos
            Route::post('/{id}/questoes/{questaoId}/responder', [AtividadeController::class, 'responderQuestao'])->name('questoes.responder');
            Route::post('/{id}/submeter', [AtividadeController::class, 'submeter'])->name('submeter');
        });
    });
});
