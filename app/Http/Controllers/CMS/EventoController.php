<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\EventoEscola;
use App\Models\EventoExterno;
use App\Models\TurmaCriada;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventoController extends Controller
{
    public function index()
    {
        $eventosEscola = EventoEscola::with(['turma.turma', 'turma.professor'])
            ->orderByDesc('data_hora')
            ->get()
            ->map(function (EventoEscola $evento) {
                return [
                    'id' => $evento->id,
                    'titulo' => $evento->titulo,
                    'descricao' => $evento->descricao,
                    'conteudo' => $evento->conteudo,
                    'data_hora' => optional($evento->data_hora)->format('d/m/Y H:i'),
                    'turma' => $evento->turma ? [
                        'id' => $evento->turma->id,
                        'nome' => optional($evento->turma->turma)->nome,
                        'professor' => optional($evento->turma->professor)->name,
                    ] : null,
                    'created_at' => optional($evento->created_at)->format('d/m/Y H:i'),
                ];
            });

        $eventosExternos = EventoExterno::orderByDesc('data_hora')
            ->get()
            ->map(function (EventoExterno $evento) {
                return [
                    'id' => $evento->id,
                    'titulo' => $evento->titulo,
                    'descricao' => $evento->descricao,
                    'conteudo' => $evento->conteudo,
                    'data_hora' => optional($evento->data_hora)->format('d/m/Y H:i'),
                    'responsavel' => $evento->responsavel,
                    'img_destaque' => $evento->img_destaque,
                    'created_at' => optional($evento->created_at)->format('d/m/Y H:i'),
                ];
            });

        return Inertia::render('CMS/Eventos/Index', [
            'eventosEscola' => $eventosEscola,
            'eventosExternos' => $eventosExternos,
        ]);
    }

    public function createEscola()
    {
        $turmas = TurmaCriada::with(['turma', 'professor'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function (TurmaCriada $turma) {
                return [
                    'id' => $turma->id,
                    'nome' => optional($turma->turma)->nome ?? 'Turma #' . $turma->id,
                    'professor' => optional($turma->professor)->name,
                ];
            });

        return Inertia::render('CMS/Eventos/CreateEscola', [
            'turmas' => $turmas,
        ]);
    }

    public function storeEscola(Request $request)
    {
        $validated = $request->validate([
            'id_turma' => 'required|exists:turmas_criadas,id',
            'data_hora' => 'required|date',
            'titulo' => 'required|string|max:255',
            'descricao' => 'nullable|string|max:1000',
            'conteudo' => 'nullable|string',
        ]);

        EventoEscola::create($validated);

        return redirect()
            ->route('cms.eventos.index')
            ->with('success', 'Evento da escola criado com sucesso!');
    }

    public function createExterno()
    {
        return Inertia::render('CMS/Eventos/CreateExterno');
    }

    public function storeExterno(Request $request)
    {
        $validated = $request->validate([
            'data_hora' => 'required|date',
            'titulo' => 'required|string|max:255',
            'descricao' => 'nullable|string|max:1000',
            'conteudo' => 'nullable|string',
            'responsavel' => 'required|string|max:255',
            'img_destaque' => 'nullable|string|max:255',
        ]);

        EventoExterno::create($validated);

        return redirect()
            ->route('cms.eventos.index')
            ->with('success', 'Evento externo criado com sucesso!');
    }
}
