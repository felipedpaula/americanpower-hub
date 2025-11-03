# American Power Hub

Sistema de gestão para escola de inglês dividido em 3 áreas:
- **Site Institucional** (Blade) - Home, sobre, contato
- **CMS Administrativo** (React + Inertia) - Gestão de conteúdo e alunos
- **Portal do Aluno** (React + Inertia) - Área do aluno

## Stack

- Laravel 10 + PHP 8.1+
- React 19 + Inertia.js
- Vite 5
- Tailwind CSS

## Instalação

```bash
# Dependências
composer install
npm install

# Ambiente
cp .env.example .env
php artisan key:generate

# Banco de dados
php artisan migrate
```

## Desenvolvimento

```bash
# Terminal 1 - Backend
php artisan serve

# Terminal 2 - Frontend
npm run dev
```

Acesse: `http://localhost:8000`

## Estrutura

```
resources/
├── views/
│   ├── layouts/
│   │   └── site.blade.php       # Layout do site
│   ├── site/
│   │   ├── partials/            # Header, footer, head
│   │   └── home.blade.php       # Páginas do site
│   └── app.blade.php            # Template Inertia (CMS/Aluno)
├── js/
│   ├── app.jsx                  # Entry Inertia
│   └── Pages/                   # Componentes React
└── css/
    └── app.css
```

## Rotas

- `/` - Site institucional

## Produção

```bash
npm run build
```

---

**American Power** - English School for Kids

