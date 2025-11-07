# American Power Hub

Sistema completo de gestão escolar para a American Power, dividido em três experiências conectadas:

- **Site Institucional** (Blade) – página pública com informações de cursos e contato.
- **CMS Administrativo** (Laravel + Inertia + React) – controle interno de turmas, usuários e dados institucionais.
- **Portal Hub** (Laravel + Inertia + React) – ambiente unificado para administradores, professores e alunos acompanharem turmas, atividades e notas.

---

## 📦 Stack Tecnológica

### Backend
- **Laravel 10.10** executando em **PHP 8.1+** – APIs, autenticação, permissões e renderização Inertia.
- **Inertia.js 2.0** – ponte entre Laravel e React.
- **MySQL 8** – banco relacional com *checks* e *triggers* para controle de notas e vínculos.

### Frontend
- **React 19** com **Vite 5** para build e HMR.
- **Tailwind CSS 4** via `@tailwindcss/postcss`, `tailwind-merge` e `tailwindcss-animate` para estilos utilitários.
- **shadcn/ui** e **Radix UI** (Select) compondo a biblioteca de componentes reutilizáveis.
- **Lucide Icons** e **axios** para ícones e chamadas HTTP.

### Ferramentas de suporte
- **Composer**, **NPM** e **Vite** para gerenciamento de dependências e bundling.
- Alias `@/` configurado em `jsconfig.json` para imports absolutos.

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
   - `UserTypesSeeder` – perfis e níveis de permissão (root → aluno).
   - `UsersSeeder` – usuários de exemplo (atualize o campo `cpf` obrigatório antes de rodar).
   - `TurmasSeeder` – catálogo base de turmas.
   - `AtividadeTiposSeeder` – tipos de atividades (tarefa, trabalho, prova).
   - `SettingsSeeder` – informações institucionais padrão.

   > ⚠️ A coluna `cpf` em `users` é obrigatória; antes de executar `--seed`, informe valores únicos de 11 dígitos nos usuários de exemplo ou cadastre manualmente via interface.

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
│   │   ├── CMS/                    # Login, configurações, turmas e usuários
│   │   └── Hub/                    # Dashboard, turmas, atividades e correções
│   └── Middleware/
│       ├── CheckAdminPermission.php  # Restringe CMS a permission_level ≥ 4
│       ├── CheckPermission.php       # Protege recursos do Hub por nível de acesso
│       └── HubAccess.php             # Bloqueia colaboradores no Hub
├── Models/
│   ├── User.php / UserType.php      # Perfis e relacionamentos
│   ├── Turma.php / TurmaCriada.php  # Catálogo + instâncias com horários e alunos únicos
│   ├── Atividade*.php               # Gestão de atividades, questões e submissões
│   └── Setting.php                  # Dados institucionais da escola
resources/
├── views/site                       # Site institucional em Blade
└── js/
    ├── Layouts/CMSLayout.jsx        # Layout base do CMS com navegação protegida
    ├── Pages/
    │   ├── CMS/*                    # Telas de turmas, usuários e configurações
    │   └── Hub/*                    # Dashboard, turmas, atividades e fluxo de correção
    └── components/ui/*              # Kit shadcn/ui adaptado
```

---

## 🔐 Perfis e permissões

Os tipos de usuário (com `permission_level`) determinam o acesso a cada módulo.

| Tipo           | Nível | Acesso                                                                 |
| -------------- | ----- | ---------------------------------------------------------------------- |
| Root (5)       | Total | CMS completo, Hub completo, configurações institucionais.             |
| Admin (4)      | Elevado | CMS (exceto gestão de Root), Hub completo.                            |
| Professor (3)  | Docente | Hub com turmas próprias, criação/correção de atividades.             |
| Colaborador (2)| Suporte | Login CMS restrito às áreas liberadas; sem acesso ao Hub. |
| Aluno (1)      | Estudante | Hub com turmas matriculadas, envio de atividades e acompanhamento. |

Middlewares dedicados garantem essas regras nos grupos de rotas `/cms` e `/hub`.

---

## 🧭 Principais fluxos

### CMS Administrativo
- **Dashboard protegido** por `check.admin`, disponível para permission level ≥ 4.
- **Turmas**: CRUD completo com status (`em andamento`, `bloqueada`, `encerrada`), vínculo de professor, horário e validação que evita alunos duplicados em diferentes turmas.
- **Usuários**: listagem segmentada (root, admin, professores, colaboradores, alunos), filtros e exclusão com salvaguardas por tipo.
- **Configurações da Escola**: formulário para dados institucionais, canais e modelo de calendário.

### Portal Hub
- **Login dedicado (`/hub/login`)** com middleware `hub.access` evitando acesso de colaboradores.
- **Dashboard contextual** exibe estatísticas para admins, turmas para professores e alunos.
- **Turmas**: professores visualizam suas turmas criadas e alunos veem matrículas ativas.
- **Atividades**:
  - Criação restrita a professores/admin/root com verificação de status da turma.
  - Gestão de questões com limites de nota, *triggers* de consistência e cadastro automático de respostas por aluno.
  - Fluxo de submissão do aluno, correção por professores e atualização automática de notas parciais/total.

---

## 🗄️ Banco de dados

- **users**: inclui campos obrigatórios `cpf`, `status` e opcionais `telefone`, `data_nasc`.
- **turmas_criadas**: registra alunos (JSON), professor, status e horários (`dias_semana`, `inicio`, `fim`).
- **atividade***: conjunto de tabelas para atividades, submissões, questões e respostas, com *constraints* e *triggers* garantindo soma de notas e atualização automática de totais.
- **settings**: dados institucionais centralizados, consumidos pelo CMS.

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

> Atualize os CPFs em `database/seeders/UsersSeeder.php` antes de utilizar essas contas em um banco novo.

---

## 🧰 Troubleshooting

| Problema | Solução |
| -------- | ------- |
| **"SQLSTATE[23000]: Duplicate entry '' for key 'users_cpf_unique'"** | Ajuste os CPFs no `UsersSeeder` para valores únicos de 11 dígitos antes de rodar `migrate --seed`. |
| **"Cannot apply unknown utility class"** | Garanta que `@tailwindcss/postcss` está instalado e referenciado em `postcss.config.js`. |
| **"@routes impresso como texto" / `route is not defined`** | Ziggy não está configurado; utilize URLs diretas (ex.: `post('/cms/login')`). |

---

**American Power** – English School for Kids 🇺🇸
