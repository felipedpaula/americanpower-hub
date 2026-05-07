<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        $this->renderable(function (NotFoundHttpException $e, Request $request) {
            if ($request->expectsJson()) {
                return null;
            }

            if ($request->is('cms') || $request->is('cms/*')) {
                return Inertia::render('Error', [
                    'status' => 404,
                    'context' => 'cms',
                ])->toResponse($request)->setStatusCode(404);
            }

            if ($request->is('hub') || $request->is('hub/*')) {
                return Inertia::render('Error', [
                    'status' => 404,
                    'context' => 'hub',
                ])->toResponse($request)->setStatusCode(404);
            }

            return response()->view('errors.404', [], 404);
        });
    }
}
