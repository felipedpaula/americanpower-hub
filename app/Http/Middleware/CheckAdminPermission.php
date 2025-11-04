<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminPermission
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

        if (auth()->user()->userType->permission_level < 4) {
            abort(403, 'Acesso negado. Apenas administradores podem acessar esta área.');
        }

        return $next($request);
    }
}
