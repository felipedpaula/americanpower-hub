# American Power Hub

Sistema de gestão para escola de inglês American Power, dividido em 3 áreas independentes:

- **Site Institucional** (Blade) - Home, sobre, cursos, contato
- **CMS Administrativo** (React + Inertia) - Gestão de turmas e usuários (alunos, professores e colaboradores)
- **Portal do Aluno** (React + Inertia) - Área exclusiva do aluno

---

## 🛠️ Stack Tecnológica

### Backend
- **Laravel 10.10** (PHP 8.1+)
- **Inertia.js 2.0** - Bridge Laravel ↔ React
- **MySQL** - Banco de dados

### Frontend
- **React 19** - UI Library
- **Vite 5** - Build tool e dev server
- **Tailwind CSS 4** - Framework CSS (via @tailwindcss/postcss)
- **shadcn/ui** - Componentes UI (Button, Card, Input, Label)
- **Lucide Icons** - Ícones (via CDN)

---

## 📦 Instalação

### 1. Dependências
```bash
composer install
npm install
```

### 2. Configuração do Ambiente
```bash
cp .env.example .env
php artisan key:generate
```

Configure as variáveis de banco de dados no `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=americanpower_hub
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Banco de Dados
```bash
php artisan migrate:fresh --seed
```

**Seeders executados:**
- `UserTypesSeeder` - Tipos de usuários (root, admin, professor, colaborador, aluno)
- `UsersSeeder` - Usuário root padrão (`felipeppdev@gmail.com` / `12345678`)
- `TurmasSeeder` - Turmas padrão (1a, 1b, 2a, 2b, 3a, 3b, advanced)

---

## 🚀 Desenvolvimento

### Servidor Local
```bash
# Terminal 1 - Backend Laravel
php artisan serve
# Acesse: http://localhost:8000

# Terminal 2 - Frontend Vite (HMR)
npm run dev
# Vite rodará em: http://localhost:3000
```

### Docker (se aplicável)
```bash
# Vite configurado para host 0.0.0.0:3000
# HMR via host: americanpower
```

---

## 🗂️ Estrutura do Projeto

### Backend (Laravel)

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   │   └── LoginController.php            # Autenticação CMS
│   │   └── CMS/
│   │       ├── TurmaController.php           # CRUD de turmas (root/admin)
│   │       └── UsuarioController.php         # CRUD de usuários (alunos, profs, colaboradores)
│   └── Middleware/
│       ├── CheckPermission.php               # Middleware de permissões (level >= 3)
│       └── CheckAdminPermission.php          # Restringe módulos a root/admin (level >= 4)
├── Models/
│   ├── User.php                         # Usuário (com user_type_id)
│   ├── UserType.php                     # Tipos de usuários
│   ├── Turma.php                        # Turmas disponíveis
│   └── TurmaCriada.php                  # Turmas instanciadas

database/
├── migrations/
│   ├── 2014_10_11_000000_create_user_types_table.php
│   ├── 2014_10_12_000000_create_users_table.php
│   ├── 2025_11_03_220000_create_turmas_table.php
│   └── 2025_11_03_220100_create_turmas_criadas_table.php
└── seeders/
    ├── UserTypesSeeder.php
    ├── UsersSeeder.php
    └── TurmasSeeder.php

routes/
└── web.php                              # Rotas site + CMS
```

### Frontend (React + Blade)

```
resources/
├── views/
│   ├── layouts/
│   │   └── site.blade.php               # Layout do site institucional
│   ├── site/
│   │   ├── partials/
│   │   │   ├── head.blade.php           # Meta tags, CSS, scripts
│   │   │   ├── header.blade.php         # Header com nav responsivo
│   │   │   └── footer.blade.php         # Footer
│   │   └── home.blade.php               # Página inicial do site
│   └── app.blade.php                    # Template Inertia (CMS/Aluno)
│
├── js/
│   ├── app.jsx                          # Entry point Inertia
│   ├── Pages/
│   │   ├── Auth/
│   │   │   └── Login.jsx                      # Login CMS (shadcn/ui)
│   │   ├── CMS/
│   │   │   └── Usuarios/                     # Páginas do módulo de usuários
│   │   │       ├── Index.jsx                 # Lista por categoria com estatísticas
│   │   │       ├── Create.jsx                # Cadastro com seleção de perfil
│   │   │       └── Edit.jsx                  # Edição com redefinição opcional de senha
│   │   └── Dashboard.jsx                     # Dashboard CMS
│   ├── components/
│   │   └── ui/                          # Componentes shadcn/ui
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── input.jsx
│   │       └── label.jsx
│   └── lib/
│       └── utils.js                     # Helper cn() para classes CSS
│
└── css/
    └── app.css                          # Tailwind + variáveis CSS shadcn

Configurações:
├── vite.config.js                       # Vite + React + Laravel plugin
├── tailwind.config.js                   # Tailwind + cores shadcn
├── postcss.config.js                    # @tailwindcss/postcss
└── jsconfig.json                        # Alias @/* para imports
```

---

## 👥 Módulo de Usuários do CMS

- **Acesso restrito:** protegido pelos middlewares `auth`, `check.permission` (nível ≥ 3) e `check.admin` (nível ≥ 4), permitindo apenas usuários root e admin gerenciarem alunos, professores e colaboradores.
- **Listagem segmentada:** dashboard dedicado com estatísticas totais e filtragem por categoria (alunos, professores, colaboradores) para facilitar a visualização e manutenção.
- **Ações rápidas:** criação, edição e exclusão diretamente da tabela com confirmações e atalhos para registrar novos perfis.
- **Formulários guiados:** telas de criação e edição contam com validações, seleção do tipo de usuário e redefinição opcional de senha, além de cards laterais com orientações.
- **Validação backend:** `UsuarioController` garante que apenas os tipos permitidos sejam manipulados e bloqueia tentativas de acesso a usuários fora do escopo do módulo.

---

## 🗄️ Banco de Dados

### Tabelas Principais

#### `user_types`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint | PK |
| name | string | Nome do tipo (unique) |
| permission_level | int | Nível de permissão (1-5) |

**Níveis de permissão:**
- 5 = root
- 4 = admin
- 3 = professor
- 2 = colaborador
- 1 = aluno

#### `users`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint | PK |
| name | string | Nome do usuário |
| email | string | Email (unique) |
| password | string | Senha (hash) |
| user_type_id | bigint | FK → user_types |
| email_verified_at | timestamp | nullable |

#### `turmas`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint | PK |
| nome | string | Nome da turma (unique) |
| ordem | int | Ordem de exibição |

**Turmas padrão:** 1a, 1b, 2a, 2b, 3a, 3b, advanced

#### `turmas_criadas`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | bigint | PK |
| turma_id | bigint | FK → turmas |
| alunos | json | Array de IDs de alunos |
| professor_id | bigint | FK → users |
| status | enum | 'em andamento', 'bloqueada', 'encerrada' |

---

## 🔐 Sistema de Autenticação e Permissões

### Middleware `CheckPermission`
- Verifica se usuário está autenticado
- Valida `permission_level >= 3` (professor, admin, root)
- Redireciona não autorizados para login

### Middleware `CheckAdminPermission`
- Reforça a checagem para `permission_level >= 4`
- Bloqueia módulos administrativos sensíveis (turmas e usuários) para perfis abaixo de admin
- Em caso de bloqueio, retorna HTTP 403 com mensagem de acesso negado

### Rotas Protegidas
```php
// Acesso público
GET / → Site institucional (Blade)

// CMS - Autenticação
GET /cms → Redireciona para /cms/login ou /cms/dashboard
GET /cms/login → Página de login
POST /cms/login → Processa login

// CMS - Área protegida (permission_level >= 3)
GET /cms/dashboard → Dashboard
POST /cms/logout → Logout

// CMS - Recursos restritos a root/admin (permission_level >= 4)
Route::middleware('check.admin')->group(function () {
    Route::resource('turmas', TurmaController::class);
    Route::resource('usuarios', UsuarioController::class)->except(['show']);
});
```

---

## 🎨 Sistema de Design (shadcn/ui)

### Variáveis CSS
Definidas em `resources/css/app.css`:
- `--background`, `--foreground`
- `--primary`, `--secondary`
- `--muted`, `--accent`
- `--destructive`
- `--border`, `--input`, `--ring`
- `--radius`

### Componentes Disponíveis
- **Button** - Variantes: default, destructive, outline, secondary, ghost, link
- **Card** - Container com header, title, description, content, footer
- **Input** - Input estilizado com ring focus
- **Label** - Label para formulários

### Uso
```jsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

<Button variant="default">Clique</Button>
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
</Card>
```

---

## 📝 Convenções de Código

### React Components
- Usar `/** @jsxImportSource react */` no topo dos arquivos `.jsx`
- Não importar React explicitamente (JSX Transform automático)
- Usar alias `@/` para imports (`@/components/ui/button`)

### Blade Templates
- Site usa layout `layouts.site`
- Partials em `site/partials/`
- Assets via helper `asset()`

### Models
- Relacionamentos definidos (hasMany, belongsTo)
- Casts para JSON (ex: `alunos` em TurmaCriada)
- Fillable declarado

---

## 🚢 Produção

### Build
```bash
npm run build
```

### Otimizações Laravel
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 📌 Credenciais Padrão

**Usuário Root:**
- Email: `felipeppdev@gmail.com`
- Senha: `12345678`
- Tipo: root (permission_level: 5)

---

## 🔧 Troubleshooting

### Erro: "Cannot apply unknown utility class"
- Certifique-se de ter instalado `@tailwindcss/postcss`
- Verifique `postcss.config.js` usa `@tailwindcss/postcss`

### Erro: "@routes impresso como texto"
- Diretiva removida (Ziggy não instalado)
- URLs hardcoded nos componentes React

### Erro: "route is not defined"
- Usar URLs diretos: `post('/cms/login')` em vez de `post(route('cms.login'))`

---

**American Power** - English School for Kids 🇺🇸

