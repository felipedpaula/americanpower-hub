# American Power Hub

Sistema completo de gestão escolar para a American Power, dividido em três experiências conectadas:

- **Site Institucional** (Blade) – página pública com informações de cursos e contato.
- **CMS Administrativo** (Laravel + Inertia + React) – controle interno de turmas, usuários e dados institucionais.
- **Portal Hub** (Laravel + Inertia + React) – ambiente unificado para administradores, professores e alunos acompanharem turmas, atividades e notas.

---

## 📦 Stack Tecnológica

### Backend
- **Laravel 10.10** executando em **PHP 8.1+** – APIs, autenticação, permissões e renderização Inertia.【F:composer.json†L8-L20】【F:app/Http/Controllers/Hub/AtividadeController.php†L1-L356】
- **Inertia.js 2.0** – ponte entre Laravel e React.【F:composer.json†L12-L12】
- **MySQL 8** – banco relacional com *checks* e *triggers* para controle de notas e vínculos.【F:database/migrations/2025_11_03_220300_create_atividade_tables.php†L1-L205】

### Frontend
- **React 19** com **Vite 5** para build e HMR.【F:package.json†L9-L23】
- **Tailwind CSS 4** via `@tailwindcss/postcss`, `tailwind-merge` e `tailwindcss-animate` para estilos utilitários.【F:package.json†L15-L24】
- **shadcn/ui** e **Radix UI** (Select) compondo a biblioteca de componentes reutilizáveis.【F:resources/js/components/ui/button.jsx†L1-L37】【F:package.json†L15-L19】
- **Lucide Icons** e **axios** para ícones e chamadas HTTP.【F:resources/js/Pages/CMS/Usuarios/Index.jsx†L1-L159】【F:package.json†L13-L24】

### Ferramentas de suporte
- **Composer**, **NPM** e **Vite** para gerenciamento de dependências e bundling.
- Alias `@/` configurado em `jsconfig.json` para imports absolutos.【F:jsconfig.json†L1-L8】

---

## ✅ Pré-requisitos

| Ferramenta | Versão recomendada |
| ---------- | ------------------ |
| PHP        | 8.1 ou superior |
| Composer   | 2.x |
| Node.js    | 20.x |
| NPM        | 10.x |
| MySQL      | 8.x |

> 💡 Caso utilize Docker/Sail, adapte os comandos abaixo para o ambiente containerizado.

---

## ⚙️ Configuração inicial

1. **Clonar e instalar dependências**
   ```bash
   git clone <repo>
   cd americanpower-hub
   composer install
   npm install
   ```
2. **Configurar o `.env`**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   Ajuste pelo menos as variáveis de banco de dados:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=americanpower_hub
   DB_USERNAME=root
   DB_PASSWORD=secret
   ```
3. **Migrar e popular o banco**
   ```bash
   php artisan migrate --seed
   ```
   O seed executa:
   - `UserTypesSeeder` – perfis e níveis de permissão (root → aluno).【F:database/seeders/UserTypesSeeder.php†L1-L22】
   - `UsersSeeder` – usuários de exemplo (atualize o campo `cpf` obrigatório antes de rodar).【F:database/seeders/UsersSeeder.php†L15-L76】【F:database/migrations/2014_10_12_000000_create_users_table.php†L13-L31】
   - `TurmasSeeder` – catálogo base de turmas.【F:database/seeders/TurmasSeeder.php†L14-L26】
   - `AtividadeTiposSeeder` – tipos de atividades (tarefa, trabalho, prova).【F:database/seeders/AtividadeTiposSeeder.php†L14-L21】
   - `SettingsSeeder` – informações institucionais padrão.【F:database/seeders/SettingsSeeder.php†L12-L29】

   > ⚠️ A coluna `cpf` em `users` é obrigatória; antes de executar `--seed`, informe valores únicos de 11 dígitos nos usuários de exemplo ou cadastre manualmente via interface.【F:database/migrations/2014_10_12_000000_create_users_table.php†L13-L31】【F:database/seeders/UsersSeeder.php†L15-L76】

---

## 🚀 Execução em desenvolvimento

Use dois terminais:

```bash
# Terminal 1 – API Laravel
php artisan serve        # http://localhost:8000

# Terminal 2 – Frontend Vite
npm run dev              # http://localhost:3000 (HMR)
```

> Para acesso externo (Docker/WSL), execute `npm run dev -- --host` e exponha a porta 3000.

Build de produção e otimizações Laravel:

```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🗂️ Estrutura principal

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── CMS/                    # Login, configurações, turmas e usuários【F:app/Http/Controllers/CMS/TurmaController.php†L1-L226】【F:app/Http/Controllers/CMS/UsuarioController.php†L1-L238】
│   │   └── Hub/                    # Dashboard, turmas, atividades e correções【F:app/Http/Controllers/Hub/HubController.php†L1-L102】【F:app/Http/Controllers/Hub/AtividadeController.php†L1-L356】
│   └── Middleware/
│       ├── CheckAdminPermission.php  # Restringe CMS a permission_level ≥ 4【F:app/Http/Middleware/CheckAdminPermission.php†L1-L28】
│       ├── CheckPermission.php       # Protege recursos do Hub por nível de acesso【F:app/Http/Middleware/CheckPermission.php†L1-L28】
│       └── HubAccess.php             # Bloqueia colaboradores no Hub【F:app/Http/Middleware/HubAccess.php†L1-L34】
├── Models/
│   ├── User.php / UserType.php      # Perfis e relacionamentos【F:app/Models/User.php†L1-L61】【F:app/Models/UserType.php†L1-L18】
│   ├── Turma.php / TurmaCriada.php  # Catálogo + instâncias com horários e alunos únicos【F:app/Models/TurmaCriada.php†L1-L58】
│   ├── Atividade*.php               # Gestão de atividades, questões e submissões【F:app/Models/Atividade.php†L1-L97】
│   └── Setting.php                  # Dados institucionais da escola【F:app/Models/Setting.php†L1-L28】
resources/
├── views/site                       # Site institucional em Blade
└── js/
    ├── Layouts/CMSLayout.jsx        # Layout base do CMS com navegação protegida
    ├── Pages/
    │   ├── CMS/*                    # Telas de turmas, usuários e configurações【F:resources/js/Pages/CMS/Turmas/Index.jsx†L1-L200】
    │   └── Hub/*                    # Dashboard, turmas, atividades e fluxo de correção【F:resources/js/Pages/Hub/Atividades/Show.jsx†L1-L200】
    └── components/ui/*              # Kit shadcn/ui adaptado
```

---

## 🔐 Perfis e permissões

Os tipos de usuário (com `permission_level`) determinam o acesso a cada módulo.【F:database/seeders/UserTypesSeeder.php†L14-L19】

| Tipo           | Nível | Acesso                                                                 |
| -------------- | ----- | ---------------------------------------------------------------------- |
| Root (5)       | Total | CMS completo, Hub completo, configurações institucionais.             |
| Admin (4)      | Elevado | CMS (exceto gestão de Root), Hub completo.                            |
| Professor (3)  | Docente | Hub com turmas próprias, criação/correção de atividades.             |
| Colaborador (2)| Suporte | Login CMS restrito às áreas liberadas; sem acesso ao Hub.【F:app/Http/Middleware/HubAccess.php†L9-L34】 |
| Aluno (1)      | Estudante | Hub com turmas matriculadas, envio de atividades e acompanhamento. |

Middlewares dedicados garantem essas regras nos grupos de rotas `/cms` e `/hub`.【F:routes/web.php†L17-L116】

---

## 🧭 Principais fluxos

### CMS Administrativo
- **Dashboard protegido** por `check.admin`, disponível para permission level ≥ 4.【F:routes/web.php†L26-L57】
- **Turmas**: CRUD completo com status (`em andamento`, `bloqueada`, `encerrada`), vínculo de professor, horário e validação que evita alunos duplicados em diferentes turmas.【F:app/Http/Controllers/CMS/TurmaController.php†L14-L225】
- **Usuários**: listagem segmentada (root, admin, professores, colaboradores, alunos), filtros e exclusão com salvaguardas por tipo.【F:app/Http/Controllers/CMS/UsuarioController.php†L19-L238】【F:resources/js/Pages/CMS/Usuarios/Index.jsx†L1-L159】
- **Configurações da Escola**: formulário para dados institucionais, canais e modelo de calendário.【F:app/Http/Controllers/CMS/SettingController.php†L13-L72】

### Portal Hub
- **Login dedicado (`/hub/login`)** com middleware `hub.access` evitando acesso de colaboradores.【F:routes/web.php†L59-L116】【F:app/Http/Middleware/HubAccess.php†L9-L34】
- **Dashboard contextual** exibe estatísticas para admins, turmas para professores e alunos.【F:app/Http/Controllers/Hub/HubController.php†L11-L53】
- **Turmas**: professores visualizam suas turmas criadas e alunos veem matrículas ativas.【F:app/Http/Controllers/Hub/HubController.php†L37-L52】
- **Atividades**:
  - Criação restrita a professores/admin/root com verificação de status da turma.【F:app/Http/Controllers/Hub/AtividadeController.php†L60-L207】
  - Gestão de questões com limites de nota, *triggers* de consistência e cadastro automático de respostas por aluno.【F:database/migrations/2025_11_03_220300_create_atividade_tables.php†L18-L205】【F:app/Http/Controllers/Hub/AtividadeController.php†L297-L415】
  - Fluxo de submissão do aluno, correção por professores e atualização automática de notas parciais/total.【F:app/Http/Controllers/Hub/AtividadeController.php†L420-L603】

---

## 🗄️ Banco de dados

- **users**: inclui campos obrigatórios `cpf`, `status` e opcionais `telefone`, `data_nasc`.【F:database/migrations/2014_10_12_000000_create_users_table.php†L13-L31】
- **turmas_criadas**: registra alunos (JSON), professor, status e horários (`dias_semana`, `inicio`, `fim`).【F:database/migrations/2025_11_03_220400_add_schedule_fields_to_turmas_criadas_table.php†L12-L26】
- **atividade***: conjunto de tabelas para atividades, submissões, questões e respostas, com *constraints* e *triggers* garantindo soma de notas e atualização automática de totais.【F:database/migrations/2025_11_03_220300_create_atividade_tables.php†L18-L205】
- **settings**: dados institucionais centralizados, consumidos pelo CMS.【F:database/migrations/2025_11_03_220200_create_settings_table.php†L12-L32】

---

## 🧪 Testes

Os *stubs* padrão do Laravel estão prontos em `tests/Feature` e `tests/Unit`. Rode:

```bash
php artisan test
```

---

## 🔑 Credenciais seed de exemplo

| Perfil | E-mail | Senha |
| ------ | ------ | ----- |
| Root   | `felipeppdev@gmail.com` | `12345678` |
| Admin  | `admin@americanpower.com` | `12345678` |
| Professores | `joao@americanpower.com`, `maria@americanpower.com` | `12345678` |
| Alunos | `pedro@aluno.com`, `ana@aluno.com`, `lucas@aluno.com`, `julia@aluno.com` | `12345678` |

> Atualize os CPFs em `database/seeders/UsersSeeder.php` antes de utilizar essas contas em um banco novo.【F:database/seeders/UsersSeeder.php†L15-L76】

---

## 🧰 Troubleshooting

| Problema | Solução |
| -------- | ------- |
| **"SQLSTATE[23000]: Duplicate entry '' for key 'users_cpf_unique'"** | Ajuste os CPFs no `UsersSeeder` para valores únicos de 11 dígitos antes de rodar `migrate --seed`.【F:database/seeders/UsersSeeder.php†L15-L76】 |
| **"Cannot apply unknown utility class"** | Garanta que `@tailwindcss/postcss` está instalado e referenciado em `postcss.config.js`. |
| **"@routes impresso como texto" / `route is not defined`** | Ziggy não está configurado; utilize URLs diretas (ex.: `post('/cms/login')`).【F:resources/js/Pages/Auth/Login.jsx†L1-L98】 |

---

**American Power** – English School for Kids 🇺🇸
