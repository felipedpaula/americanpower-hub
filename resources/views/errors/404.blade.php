@extends('layouts.site')

@section('title', 'Página não encontrada | American Power')
@section('description', 'A página que você tentou acessar não foi encontrada.')

@section('content')
<section class="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.28),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_28%)]"></div>
  <div class="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
    <div class="grid gap-10 items-center lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <span class="badge bg-red-500/90 text-white mb-5">Erro 404</span>
        <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Esta página saiu da rota,
          <span class="text-red-300">mas o inglês do seu filho continua no caminho certo.</span>
        </h1>
        <p class="text-lg md:text-xl text-blue-100 max-w-2xl mb-8">
          O endereço acessado não existe ou foi movido. Você pode voltar para a página inicial ou falar com a equipe da American Power para encontrar o que precisa.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 mb-10">
          <a href="{{ route('site.home') }}" class="btn btn-primary text-white">Voltar para o início</a>
          <a href="{{ route('site.home') }}#contact" class="btn btn-outline">Ir para contato</a>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <a
            href="{{ route('site.home') }}#courses"
            class="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/15"
          >
            <p class="text-sm uppercase tracking-[0.22em] text-blue-200 mb-2">Cursos</p>
            <p class="text-lg font-semibold">Conheça as turmas disponíveis</p>
          </a>

          <a
            href="{{ route('site.home') }}#gallery"
            class="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/15"
          >
            <p class="text-sm uppercase tracking-[0.22em] text-blue-200 mb-2">Estrutura</p>
            <p class="text-lg font-semibold">Veja os ambientes da escola</p>
          </a>
        </div>
      </div>

      <div class="relative">
        <div class="absolute -inset-6 rounded-[2rem] bg-red-500/20 blur-3xl"></div>
        <div class="relative rounded-[2rem] border border-white/10 bg-white/10 p-6 md:p-8 shadow-2xl backdrop-blur-sm">
          <div class="flex items-start justify-between gap-4 mb-8">
            <div>
              <p class="text-sm uppercase tracking-[0.28em] text-blue-200 mb-2">American Power</p>
              <p class="text-2xl md:text-3xl font-semibold">Página não encontrada</p>
            </div>
            <span class="text-6xl md:text-7xl font-black text-white/90 leading-none">404</span>
          </div>

          <div class="rounded-3xl overflow-hidden border border-white/10 mb-6">
            <img
              src="{{ asset('assets/img/ampower.png') }}"
              alt="American Power English School"
              class="w-full h-64 object-cover"
            />
          </div>

          <div class="space-y-3 text-blue-100">
            <p class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              Endereço inválido ou desatualizado.
            </p>
            <p class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              Navegue pelo menu para encontrar a seção correta.
            </p>
            <p class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              Se preferir, fale com a escola pela área de contato.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
@endsection
