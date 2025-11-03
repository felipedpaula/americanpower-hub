<header class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40" id="top">
  <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
    <a href="{{ route('site.home') }}" class="flex items-center space-x-2">
      <img src="{{ asset('assets/img/logo-american-power.png') }}" alt="American Power Logo" class="h-15 w-auto" />
    </a>
    
    <nav class="hidden md:flex items-center space-x-8 font-medium" aria-label="Principal">
      <a href="{{ route('site.home') }}#home" class="text-blue-900 hover:text-red-500 transition-colors">Início</a>
      <a href="{{ route('site.home') }}#about" class="text-blue-900 hover:text-red-500 transition-colors">Sobre</a>
      <a href="{{ route('site.home') }}#gallery" class="text-blue-900 hover:text-red-500 transition-colors">Estrutura</a>
      <a href="{{ route('site.home') }}#courses" class="text-blue-900 hover:text-red-500 transition-colors">Cursos</a>
      <a href="{{ route('site.home') }}#auditorium" class="text-blue-900 hover:text-red-500 transition-colors">Auditório</a>
      <a href="{{ route('site.home') }}#contact" class="text-blue-900 hover:text-red-500 transition-colors">Contato</a>
    </nav>
    
    <button class="btn btn-primary hidden md:inline-flex" data-scroll="#contact">Agendar Aula</button>
    
    <!-- Mobile Menu Toggle -->
    <button id="navToggle" class="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300" aria-expanded="false" aria-controls="mobileMenu" aria-label="Abrir menu">
      <span class="sr-only">Menu</span>
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </div>
  
  <!-- Mobile Menu -->
  <div id="mobileMenu" data-hidden="true" class="md:hidden">
    <button type="button" id="closeMobileMenu" aria-label="Fechar menu" class="ml-auto mb-4 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:text-red-500 hover:border-red-400 transition-colors">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M6 18L18 6"/>
      </svg>
    </button>
    <a class="block py-2" href="{{ route('site.home') }}#home">Início</a>
    <a class="block py-2" href="{{ route('site.home') }}#about">Sobre</a>
    <a class="block py-2" href="{{ route('site.home') }}#gallery">Estrutura</a>
    <a class="block py-2" href="{{ route('site.home') }}#courses">Cursos</a>
    <a class="block py-2" href="{{ route('site.home') }}#auditorium">Auditório</a>
    <a class="block py-2" href="{{ route('site.home') }}#contact">Contato</a>
    <button class="btn btn-primary w-full" data-scroll="#contact">Agendar Aula</button>
  </div>
</header>
