<footer class="bg-blue-900 text-white py-12">
  <div class="max-w-7xl mx-auto px-4">
    <div class="grid md:grid-cols-3 gap-8">
      <div>
        <div class="flex items-center space-x-2 mb-4">
          <div class="w-10 h-10 gradient-red rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">AP</span>
          </div>
          <div>
            <h3 class="text-xl font-bold">American Power</h3>
            <p class="text-sm text-blue-200">English School for Kids</p>
          </div>
        </div>
        <p class="text-blue-200 mb-4">Transformando o futuro das crianças através do inglês, com metodologia exclusiva e ambiente acolhedor.</p>
      </div>
      
      <div>
        <h4 class="font-bold mb-4">Links Rápidos</h4>
        <div class="space-y-2 text-blue-200">
          <div><a href="{{ route('site.home') }}#home" class="hover:text-white transition-colors">Início</a></div>
          <div><a href="{{ route('site.home') }}#about" class="hover:text-white transition-colors">Sobre</a></div>
          <div><a href="{{ route('site.home') }}#gallery" class="hover:text-white transition-colors">Estrutura</a></div>
          <div><a href="{{ route('site.home') }}#courses" class="hover:text-white transition-colors">Cursos</a></div>
          <div><a href="{{ route('site.home') }}#auditorium" class="hover:text-white transition-colors">Auditório</a></div>
          <div><a href="{{ route('site.home') }}#contact" class="hover:text-white transition-colors">Contato</a></div>
        </div>
      </div>
      
      <div>
        <h4 class="font-bold mb-4">Horário de Funcionamento</h4>
        <div class="space-y-2 text-blue-200">
          <div>Segunda a Quinta: 14h às 19h</div>
          <div>Sexta: Fechado</div>
          <div>Sábado: Fechado</div>
          <div>Domingo: Fechado</div>
        </div>
      </div>
    </div>
    
    <div class="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200 text-sm">
      &copy; <span id="year"></span> American Power English School. Todos os direitos reservados.
    </div>
  </div>
</footer>
