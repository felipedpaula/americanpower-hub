@extends('layouts.site')

@section('title', 'American Power - Inglês para Crianças')
@section('description', 'American Power - Escola de inglês para crianças. Método exclusivo, divertido e eficaz.')

@section('content')
<!-- Hero -->
<section id="home" class="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20 overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-red-500/20"></div>
  <div class="relative max-w-7xl mx-auto px-4">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span class="badge bg-red-500 text-white mb-4">🚀 Curso de inglês para crianças</span>
        <h2 class="text-5xl font-bold mb-6 leading-tight">Desperte o <span class="text-red-400">Poder</span> do Inglês em seu Filho!</h2>
        <p class="text-xl mb-8 text-blue-100">Na American Power, tornamos o aprendizado de inglês uma experiência divertida e eficaz, com a participação ativa dos pais em cada etapa do progresso do seu filho.</p>
        <div class="flex flex-col sm:flex-row gap-4">
          <button class="btn btn-primary text-white" data-scroll="#contact">Comece Agora</button>
          <button class="btn btn-outline" data-scroll="#courses">Conheça Nossas Turmas</button>
        </div>
      </div>
      <div class="relative">
        <div class="relative z-10">
          <img src="{{ asset('assets/img/ampower.png') }}" alt="Crianças aprendendo inglês" class="rounded-2xl shadow-2xl w-full" loading="lazy" />
        </div>
        <div class="absolute -top-6 -right-6 w-24 h-24 bg-red-500 rounded-full flex items-center justify-center z-20">
          <i data-lucide="star" class="w-12 h-12 text-white"></i>
        </div>
      </div>
    </div>
  </div>
</section>

  <!-- About -->
  <section id="about" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-16">
        <span class="badge bg-blue-100 text-blue-600 mb-4">🏫 Nossa História</span>
        <h2 class="text-4xl font-bold text-blue-900 mb-4">20 Anos Transformando Vidas Através do Inglês</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">Desde 2005, a American Power tem sido referência em educação de inglês para crianças em Inhumas e região.</p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h3 class="text-3xl font-bold text-blue-900 mb-6">Nossa Missão</h3>
          <p class="text-lg text-gray-600 mb-6">Transformar o futuro das crianças através do domínio do inglês, desenvolvendo não apenas habilidades linguísticas, mas também confiança, criatividade e um amor duradouro pelo aprendizado.</p>
          <div class="bg-blue-50 p-6 rounded-lg">
            <h4 class="text-blue-900 font-bold mb-2">Nossos Valores</h4>
            <ul class="space-y-2 text-blue-800">
              <li class="flex items-center"><span class="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Excelência no ensino</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Ambiente acolhedor e seguro</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Metodologia inovadora</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>Parceria com famílias</li>
            </ul>
          </div>
        </div>
        <div>
          <img
            src="{{ asset('assets/img/estrutura/jardim-american-power-2.png') }}"
            alt="Jardim da American Power"
            class="rounded-2xl shadow-2xl w-full"
            loading="lazy"
          />
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <div class="text-center">
          <div class="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i data-lucide="users" class="w-10 h-10"></i>
          </div>
          <h3 class="text-2xl font-bold text-blue-900 mb-2">1000+</h3>
          <p class="text-gray-600">Alunos formados com sucesso</p>
        </div>
        <div class="text-center">
          <div class="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i data-lucide="award" class="w-10 h-10"></i>
          </div>
          <h3 class="text-2xl font-bold text-blue-900 mb-2">20 Anos</h3>
          <p class="text-gray-600">De experiência e dedicação</p>
        </div>
        <div class="text-center">
          <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i data-lucide="heart" class="w-10 h-10"></i>
          </div>
          <h3 class="text-2xl font-bold text-blue-900 mb-2">98%</h3>
          <p class="text-gray-600">De satisfação dos pais</p>
        </div>
      </div>

      <div class="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-3xl p-12 text-center">
        <h3 class="text-3xl font-bold mb-4">Junte-se à Nossa Família</h3>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Há 20 anos construindo um futuro de excelência no inglês para as crianças de Inhumas. Venha fazer parte desta história de sucesso!</p>
        <button class="btn btn-primary text-white" data-scroll="#contact">Agende uma Visita</button>
      </div>
    </div>
  </section>

  <!-- Benefits -->
  <section id="benefits" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-16">
        <span class="badge bg-blue-100 text-blue-600 mb-4">⭐ Por que escolher a American Power?</span>
        <h2 class="text-4xl font-bold text-blue-900 mb-4">Benefícios Únicos para seu Filho</h2>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="card text-center hover:shadow-lg transition-shadow">
          <div class="p-8">
            <div class="w-16 h-16 gradient-red rounded-full flex items-center justify-center mx-auto mb-4"><i data-lucide="award" class="w-8 h-8 text-white"></i></div>
            <h3 class="text-xl font-bold text-blue-900 mb-3">Método Exclusivo</h3>
            <p class="text-gray-600">Metodologia própria desenvolvida ao longos dos 20 anos de experiência com escola de inglês</p>
          </div>
        </div>
        <div class="card text-center hover:shadow-lg transition-shadow">
          <div class="p-8">
            <div class="w-16 h-16 gradient-red rounded-full flex items-center justify-center mx-auto mb-4"><i data-lucide="users" class="w-8 h-8 text-white"></i></div>
            <h3 class="text-xl font-bold text-blue-900 mb-3">Turmas Pequenas</h3>
            <p class="text-gray-600">Máximo 8 alunos por turma para atenção personalizada</p>
          </div>
        </div>
        <div class="card text-center hover:shadow-lg transition-shadow">
          <div class="p-8">
            <div class="w-16 h-16 gradient-red rounded-full flex items-center justify-center mx-auto mb-4"><i data-lucide="clock" class="w-8 h-8 text-white"></i></div>
            <h3 class="text-xl font-bold text-blue-900 mb-3">Horários adequados</h3>
            <p class="text-gray-600">Aulas nos períodos da tarde, para não chocar com a escola do aluno</p>
          </div>
        </div>
        <div class="card text-center hover:shadow-lg transition-shadow">
          <div class="p-8">
            <div class="w-16 h-16 gradient-red rounded-full flex items-center justify-center mx-auto mb-4"><i data-lucide="heart" class="w-8 h-8 text-white"></i></div>
            <h3 class="text-xl font-bold text-blue-900 mb-3">Ambiente Acolhedor</h3>
            <p class="text-gray-600">Espaço acolhedor e seguro, pensado especialmente para crianças</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Gallery -->
  <section id="gallery" class="py-20 bg-gradient-to-b from-blue-900/5 via-white to-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="md:flex md:items-end md:justify-between mb-12">
        <div class="max-w-2xl">
          <span class="badge bg-red-100 text-red-600 mb-4">🏫 Nossa Estrutura</span>
          <h2 class="text-4xl font-bold text-blue-900 mb-4">Conheça cada ambiente da American Power</h2>
          <p class="text-lg text-gray-600">Ambientes projetados para estimular a criatividade, fortalecer a segurança emocional e tornar o inglês parte do cotidiano das crianças.</p>
        </div>
      </div>

      <div class="relative" data-gallery>
        <div class="overflow-hidden rounded-3xl shadow-[0_25px_60px_-20px_rgba(15,23,42,0.35)]">
          <div class="flex transition-transform duration-700 ease-out" data-gallery-track>
            <article class="relative min-w-full">
              <img
                src="{{ asset('assets/img/estrutura/fachada-american-power-1.png') }}"
                alt="Fachada moderna da American Power English School"
                class="w-full h-[320px] md:h-[460px] object-cover"
                loading="lazy"
              />
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-950/80 via-blue-950/20 to-transparent p-8">
                <h3 class="text-2xl font-bold text-white mb-2">Fachada da Escola</h3>
                <p class="text-blue-100 max-w-2xl">Bem-vindo à American Power! Nossa estrutura moderna e acolhedora foi projetada especialmente para o aprendizado das crianças.</p>
              </div>
            </article>

            <article class="relative min-w-full">
              <img
                src="{{ asset('assets/img/estrutura/jardim-american-power-2.png') }}"
                alt="Jardim acolhedor da American Power para recreação"
                class="w-full h-[320px] md:h-[460px] object-cover"
                loading="lazy"
              />
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-950/80 via-blue-950/20 to-transparent p-8">
                <h3 class="text-2xl font-bold text-white mb-2">Jardim Kids Zone</h3>
                <p class="text-blue-100 max-w-2xl">Espaço ao ar livre para recreação e espera das crianças.</p>
              </div>
            </article>

            <article class="relative min-w-full">
              <img
                src="{{ asset('assets/img/estrutura/garagem-american-power.png') }}"
                alt="Garagem da American Power com segurança para os alunos"
                class="w-full h-[320px] md:h-[460px] object-cover"
                loading="lazy"
              />
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-950/80 via-blue-950/20 to-transparent p-8">
                <h3 class="text-2xl font-bold text-white mb-2">Garagem Segura</h3>
                <p class="text-blue-100 max-w-2xl">Espaço seguro para os alunos, com monitoramento e acesso controlado.</p>
              </div>
            </article>

            <article class="relative min-w-full">
              <img
                src="{{ asset('assets/img/estrutura/secretaria-americn-power.png') }}"
                alt="Secretaria da American Power com atendimento personalizado"
                class="w-full h-[320px] md:h-[460px] object-cover"
                loading="lazy"
              />
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-950/80 via-blue-950/20 to-transparent p-8">
                <h3 class="text-2xl font-bold text-white mb-2">Secretaria</h3>
                <p class="text-blue-100 max-w-2xl">Atendimento personalizado para pais e alunos, com equipe pronta para ajudar.</p>
              </div>
            </article>

            <article class="relative min-w-full">
              <img
                src="{{ asset('assets/img/estrutura/entrada-teatro-american-power.png') }}"
                alt="Entrada do Teatro da American Power"
                class="w-full h-[320px] md:h-[460px] object-cover"
                loading="lazy"
              />
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-950/80 via-blue-950/20 to-transparent p-8">
                <h3 class="text-2xl font-bold text-white mb-2">Entrada do Teatro</h3>
                <p class="text-blue-100 max-w-2xl">Acesso facilitado ao teatro pela garagem da escola.</p>
              </div>
            </article>

            <article class="relative min-w-full">
              <img
                src="{{ asset('assets/img/estrutura/teatro-american-power-1.png') }}"
                alt="Teatro moderno da American Power para apresentações"
                class="w-full h-[320px] md:h-[460px] object-cover"
                loading="lazy"
              />
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-950/80 via-blue-950/20 to-transparent p-8">
                <h3 class="text-2xl font-bold text-white mb-2">Teatro Multimídia</h3>
                <p class="text-blue-100 max-w-2xl">Poltronas confortáveis para melhor acomodação durante as apresentações.</p>
              </div>
            </article>

            <article class="relative min-w-full">
              <img
                src="{{ asset('assets/img/estrutura/teatro-american-power-2.png') }}"
                alt="Teatro moderno da American Power para apresentações"
                class="w-full h-[320px] md:h-[460px] object-cover"
                loading="lazy"
              />
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-950/80 via-blue-950/20 to-transparent p-8">
                <h3 class="text-2xl font-bold text-white mb-2">Teatro Multimídia</h3>
                <p class="text-blue-100 max-w-2xl">Palco completo com iluminação, som e tela gigante para apresentações, festivais e eventos especiais com as famílias.</p>
              </div>
            </article>

            <article class="relative min-w-full">
              <img
                src="{{ asset('assets/img/estrutura/teatro-american-power-3.png') }}"
                alt="Teatro moderno da American Power para apresentações"
                class="w-full h-[320px] md:h-[460px] object-cover"
                loading="lazy"
              />
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-950/80 via-blue-950/20 to-transparent p-8">
                <h3 class="text-2xl font-bold text-white mb-2">Teatro Multimídia</h3>
                <p class="text-blue-100 max-w-2xl">53 poltronas em 9 fileiras projetadas para melhor visibilidade durante as apresentações.</p>
              </div>
            </article>

             <article class="relative min-w-full">
              <img
                src="{{ asset('assets/img/estrutura/sala-amaerican-power-1.png') }}"
                alt="Sala de aula moderna e equipada da American Power"
                class="w-full h-[320px] md:h-[460px] object-cover"
                loading="lazy"
              />
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-950/80 via-blue-950/20 to-transparent p-8">
                <h3 class="text-2xl font-bold text-white mb-2">Salas de Aula Modernas</h3>
                <p class="text-blue-100 max-w-2xl">Carteiras confortáveis, quadro para escrita, televisão para apresentações, câmeras de segurança e ar condicionado. Tudo isso para proporcionar um ambiente de aprendizado seguro e estimulante.</p>
              </div>
            </article>
          </div>
        </div>

        <button
          type="button"
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-blue-900 transition-colors rounded-full p-3 shadow-lg backdrop-blur"
          data-gallery-prev
          aria-label="Imagem anterior"
        >
          <i data-lucide="chevron-left" class="w-5 h-5"></i>
        </button>
        <button
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white text-blue-900 transition-colors rounded-full p-3 shadow-lg backdrop-blur"
          data-gallery-next
          aria-label="Próxima imagem"
        >
          <i data-lucide="chevron-right" class="w-5 h-5"></i>
        </button>

        <div class="flex justify-center gap-2 mt-8" data-gallery-dots aria-hidden="true"></div>
      </div>
    </div>
  </section>

  <!-- Auditorium -->
  <section id="auditorium" class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-16">
        <span class="badge bg-red-100 text-red-600 mb-4">🎭 Espaço Multimídia para Eventos</span>
        <h2 class="text-4xl font-bold text-blue-900 mb-4">Auditório para apresentações dos alunos para os pais e convidados</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">Contamos com um auditório moderno e totalmente equipado para apresentações, peças teatrais em inglês, festivais e eventos especiais da escola.</p>
      </div>
      <div class="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <img src="{{ asset('assets/img/estrutura/teatro-american-power-3.png') }}" loading="lazy" />
        </div>
        <div>
          <h3 class="text-3xl font-bold text-blue-900 mb-6">Infraestrutura Completa</h3>
          <div class="space-y-4">
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 gradient-red rounded-lg flex items-center justify-center flex-shrink-0"><i data-lucide="users" class="w-6 h-6 text-white"></i></div>
              <div><h4 class="text-lg font-bold text-blue-900 mb-1">Capacidade para 53 pessoas</h4><p class="text-gray-600">Espaço ideal para pequenas apresentações. Acomodações confortáveis para toda a família</p></div>
            </div>
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 gradient-red rounded-lg flex items-center justify-center flex-shrink-0"><i data-lucide="theater" class="w-6 h-6 text-white"></i></div>
              <div><h4 class="text-lg font-bold text-blue-900 mb-1">Palco para apresentações</h4><p class="text-gray-600">Iluminação cênica, sistema de som de alta qualidade e poltronas arquitetadas para melhor visibilidade de todos os espectadores.</p></div>
            </div>
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 gradient-red rounded-lg flex items-center justify-center flex-shrink-0"><i data-lucide="presentation" class="w-6 h-6 text-white"></i></div>
              <div><h4 class="text-lg font-bold text-blue-900 mb-1">Equipamentos multimídia</h4><p class="text-gray-600">Televisão de 60 polegadas 4K, sistema de áudio moderno e equipamentos de apresentação</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Courses -->
  <section id="courses" class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-16">
        <span class="badge bg-red-100 text-red-600 mb-4">📚 Nossos Cursos</span>
        <h2 class="text-4xl font-bold text-blue-900 mb-4">Cursos Especializados por Idade</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">Desenvolvemos metodologias específicas para cada faixa etária, garantindo o melhor aproveitamento e diversão no aprendizado.</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Card 1 -->
        <div class="card group hover:shadow-xl transition-shadow duration-300">
          <div class="p-6">
            <div class="w-full h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg mb-4 flex items-center justify-center"><i data-lucide="book-open" class="w-16 h-16 text-white"></i></div>
            <h3 class="text-blue-900 text-xl font-bold mb-1">Beginner 1</h3>
            <span class="badge bg-gray-200 text-gray-700 mb-4">6 anos</span>
            <p class="text-gray-600 mb-4">Introdução básica ao inglês para crianças de 6 anos</p>
            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Alfabeto e sons</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Vocabulário básico</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Atividades lúdicas</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Jogos interativos</li>
            </ul>
          </div>
        </div>
        <!-- Card 2 -->
        <div class="card group hover:shadow-xl transition-shadow duration-300">
          <div class="p-6">
            <div class="w-full h-32 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg mb-4 flex items-center justify-center"><i data-lucide="book-open" class="w-16 h-16 text-white"></i></div>
            <h3 class="text-blue-900 text-xl font-bold mb-1">Beginner 2</h3>
            <span class="badge bg-gray-200 text-gray-700 mb-4">7 anos</span>
            <p class="text-gray-600 mb-4">Desenvolvimento inicial da fala e compreensão</p>
            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Frases simples</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Vocabulário cotidiano</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Atividades dinâmicas</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Arte em inglês</li>
            </ul>
          </div>
        </div>
        <!-- Card 3 -->
        <div class="card group hover:shadow-xl transition-shadow duration-300">
          <div class="p-6">
            <div class="w-full h-32 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center"><i data-lucide="book-open" class="w-16 h-16 text-white"></i></div>
            <h3 class="text-blue-900 text-xl font-bold mb-1">Beginner 3</h3>
            <span class="badge bg-gray-200 text-gray-700 mb-4">8 anos</span>
            <p class="text-gray-600 mb-4">Aprofundamento da comunicação básica</p>
            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Conversação simples</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Leitura inicial</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Jogos educativos</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Projetos criativos</li>
            </ul>
          </div>
        </div>
        <!-- Card 4 -->
        <div class="card group hover:shadow-xl transition-shadow duration-300">
          <div class="p-6">
            <div class="w-full h-32 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg mb-4 flex items-center justify-center"><i data-lucide="book-open" class="w-16 h-16 text-white"></i></div>
            <h3 class="text-blue-900 text-xl font-bold mb-1">Beginner 4</h3>
            <span class="badge bg-gray-200 text-gray-700 mb-4">9 anos</span>
            <p class="text-gray-600 mb-4">Expansão do vocabulário e gramática básica</p>
            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Gramática introdutória</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Vocabulário avançado</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Atividades interativas</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Apresentações</li>
            </ul>
          </div>
        </div>
        <!-- Card 5 -->
        <div class="card group hover:shadow-xl transition-shadow duration-300">
          <div class="p-6">
            <div class="w-full h-32 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg mb-4 flex items-center justify-center"><i data-lucide="book-open" class="w-16 h-16 text-white"></i></div>
            <h3 class="text-blue-900 text-xl font-bold mb-1">Beginner 5</h3>
            <span class="badge bg-gray-200 text-gray-700 mb-4">10 anos</span>
            <p class="text-gray-600 mb-4">Consolidação dos conhecimentos básicos</p>
            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Revisão de conceitos</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Leitura e escrita</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Projetos em grupo</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Preparação para níveis superiores</li>
            </ul>
          </div>
        </div>
        <!-- Card 6 -->
        <div class="card group hover:shadow-xl transition-shadow duration-300">
          <div class="p-6">
            <div class="w-full h-32 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg mb-4 flex items-center justify-center"><i data-lucide="book-open" class="w-16 h-16 text-white"></i></div>
            <h3 class="text-blue-900 text-xl font-bold mb-1">1A e 1B</h3>
            <span class="badge bg-gray-200 text-gray-700 mb-4">11 anos</span>
            <p class="text-gray-600 mb-4">Transição para níveis intermediários</p>
            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Gramática intermediária</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Conversação fluente</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Leitura compreensiva</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Escrita criativa</li>
            </ul>
          </div>
        </div>
        <!-- Card 7 -->
        <div class="card group hover:shadow-xl transition-shadow duration-300">
          <div class="p-6">
            <div class="w-full h-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg mb-4 flex items-center justify-center"><i data-lucide="book-open" class="w-16 h-16 text-white"></i></div>
            <h3 class="text-blue-900 text-xl font-bold mb-1">2A e 2B</h3>
            <span class="badge bg-gray-200 text-gray-700 mb-4">12 anos</span>
            <p class="text-gray-600 mb-4">Aprofundamento da proficiência</p>
            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Estruturas complexas</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Vocabulário temático</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Debates e discussões</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Projetos avançados</li>
            </ul>
          </div>
        </div>
        <!-- Card 8 -->
        <div class="card group hover:shadow-xl transition-shadow duration-300">
          <div class="p-6">
            <div class="w-full h-32 bg-gradient-to-r from-pink-400 to-rose-500 rounded-lg mb-4 flex items-center justify-center"><i data-lucide="book-open" class="w-16 h-16 text-white"></i></div>
            <h3 class="text-blue-900 text-xl font-bold mb-1">3A e 3B</h3>
            <span class="badge bg-gray-200 text-gray-700 mb-4">13 anos</span>
            <p class="text-gray-600 mb-4">Preparação para fluência avançada</p>
            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Gramática avançada</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Literatura em inglês</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Apresentações formais</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Preparação para exames</li>
            </ul>
          </div>
        </div>
        <!-- Card 9 -->
        <div class="card group hover:shadow-xl transition-shadow duration-300">
          <div class="p-6">
            <div class="w-full h-32 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center"><i data-lucide="book-open" class="w-16 h-16 text-white"></i></div>
            <h3 class="text-blue-900 text-xl font-bold mb-1">Advanced</h3>
            <span class="badge bg-gray-200 text-gray-700 mb-4">14+</span>
            <p class="text-gray-600 mb-4">Domínio avançado da língua inglesa</p>
            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Fluência nativa</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Análise crítica</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Escrita acadêmica</li>
              <li class="flex items-center"><span class="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Certificações internacionais</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section id="contact" class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid lg:grid-cols-1 gap-12 items-stretch">
        <div class="space-y-8">
          <span class="badge bg-red-100 text-red-600">📞 Fale Conosco</span>
          <h2 class="text-4xl font-bold text-blue-900 leading-tight">Estamos prontos para ajudar a construir o inglês dos seus filhos</h2>
          <p class="text-xl text-gray-600">Entre em contato com a equipe da American Power Inhumas e descubra a melhor experiência de aprendizado de inglês da cidade.</p>

          <div class="grid sm:grid-cols-2 gap-6">
            <div class="card bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-transform sm:col-span-2">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center">
                  <i data-lucide="map-pin" class="w-6 h-6"></i>
                </div>
                <div>
                  <div class="text-sm uppercase tracking-wide text-gray-500 font-semibold">Localização</div>
                  <p class="mt-1 text-blue-900 font-medium leading-relaxed">
                    RUA JOSÉ DE ARIMATÉIA E SILVA QD.141 LT.02L<br />
                    R. José de Arimatéia e Silva, 432 - CENTRO<br />
                    Inhumas - GO, 75400-000
                  </p>
                  <a class="mt-3 inline-flex items-center text-sm text-red-600 hover:text-red-700 font-semibold" href="https://maps.google.com/?q=R.+Jos%C3%A9+de+Arimat%C3%A9ia+e+Silva,+432+-+CENTRO,+Inhumas+-+GO,+75400-000" target="_blank" rel="noopener">Ver rota<i data-lucide="arrow-up-right" class="w-4 h-4 ml-1"></i></a>
                </div>
              </div>
              <div class="mt-6 rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                <iframe
                  class="w-full h-64"
                  src="https://maps.google.com/maps?q=R.%20Jos%C3%A9%20de%20Arimat%C3%A9ia%20e%20Silva,%20432%20-%20CENTRO,%20Inhumas%20-%20GO,%2075400-000&output=embed"
                  style="border:0"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div class="card bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-transform">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <i data-lucide="phone" class="w-6 h-6"></i>
                </div>
                <div>
                  <div class="text-sm uppercase tracking-wide text-gray-500 font-semibold">Telefone</div>
                  <a class="mt-1 block text-blue-900 text-lg font-semibold hover:text-red-600 transition-colors" href="tel:+556235142067">(62) 3514-2067</a>
                  <p class="text-sm text-gray-500">Segunda a sexta • 08h às 18h</p>
                </div>
              </div>
            </div>

            <div class="card bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-transform">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
                  <i data-lucide="message-circle" class="w-6 h-6"></i>
                </div>
                <div>
                  <div class="text-sm uppercase tracking-wide text-gray-500 font-semibold">WhatsApp</div>
                  <a class="mt-1 block text-blue-900 text-lg font-semibold hover:text-red-600 transition-colors" href="https://wa.me/5562984061568?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20a%20American%20Power.">(62) 98406-1568</a>
                  <p class="text-sm text-gray-500">Resposta rápida e personalizada</p>
                </div>
              </div>
            </div>

            <div class="card bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-transform">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <i data-lucide="mail" class="w-6 h-6"></i>
                </div>
                <div>
                  <div class="text-sm uppercase tracking-wide text-gray-500 font-semibold">E-mail</div>
                  <a class="mt-1 block text-blue-900 text-lg font-semibold hover:text-red-600 transition-colors break-words" href="mailto:am.power@hotmail.com">am.power@hotmail.com</a>
                  <p class="text-sm text-gray-500">Envie documentos ou agende sua visita</p>
                </div>
              </div>
            </div>

            <div class="card bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-transform">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 rounded-full bg-pink-500/10 text-pink-600 flex items-center justify-center">
                  <i data-lucide="instagram" class="w-6 h-6"></i>
                </div>
                <div>
                  <div class="text-sm uppercase tracking-wide text-gray-500 font-semibold">Instagram</div>
                  <a class="mt-1 block text-blue-900 text-lg font-semibold hover:text-red-600 transition-colors" href="https://www.instagram.com/americanpowerinhumas" target="_blank" rel="noopener">@americanpowerinhumas</a>
                  <p class="text-sm text-gray-500">Acompanhe novidades e eventos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-red-500 text-white p-10 shadow-2xl flex flex-col justify-between">
          <div class="space-y-6">
            <h3 class="text-3xl font-bold leading-snug">Visite a American Power Inhumas</h3>
            <p class="text-blue-100">Nossa equipe está pronta para receber sua família e apresentar o método que transforma o aprendizado de inglês das crianças.</p>
            <div class="grid gap-4">
              <div class="flex items-center space-x-3">
                <i data-lucide="calendar" class="w-5 h-5 text-red-200"></i>
                <span class="text-sm text-red-100">Agende uma visita ou aula demonstrativa</span>
              </div>
              <div class="flex items-center space-x-3">
                <i data-lucide="users" class="w-5 h-5 text-red-200"></i>
                <span class="text-sm text-red-100">Atendimento individual e personalizado</span>
              </div>
            </div>
          </div>
          <div class="pt-10">
            <div class="text-sm uppercase tracking-wide text-red-200 mb-3">Contato imediato</div>
            <a href="https://wa.me/5562984061568?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20a%20American%20Power." class="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold bg-white text-blue-900 hover:bg-blue-100 transition-colors shadow-lg shadow-blue-900/20">
              <i data-lucide="send" class="w-5 h-5 mr-2"></i>Chamar no WhatsApp agora
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
@endsection
