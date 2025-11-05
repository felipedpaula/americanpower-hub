<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HubAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verifica se o usuário está autenticado
        if (!auth()->check()) {
            return redirect()->route('hub.login');
        }

        $user = auth()->user();
        
        // Tipos permitidos no Hub: todos exceto 'colaborador'
        $blockedTypes = ['colaborador'];
        
        if (in_array($user->userType->name, $blockedTypes)) {
            abort(403, 'Acesso negado ao Hub. Seu tipo de usuário não tem permissão.');
        }

        return $next($request);
    }
}
