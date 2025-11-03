<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('cms.login');
        }

        if (auth()->user()->userType->permission_level < 3) {
            abort(403, 'Acesso negado. Você não tem permissão para acessar esta área.');
        }

        return $next($request);
    }
}
