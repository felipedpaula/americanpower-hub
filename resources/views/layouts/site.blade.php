<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  @include('site.partials.head')
  @stack('styles')
</head>
<body class="min-h-screen bg-white text-slate-900 scroll-smooth">
  
  @include('site.partials.header')

  <main>
    @yield('content')
  </main>

  @include('site.partials.footer')

  <!-- Back to top -->
  <a href="#top" class="fixed right-4 bottom-4 bg-red-500 text-white w-11 h-11 rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-2 transition" id="backToTop" aria-label="Voltar ao topo">↑</a>

  <!-- Ícones Lucide -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="{{ asset('assets/js/main.js') }}"></script>
  @stack('scripts')
</body>
</html>
