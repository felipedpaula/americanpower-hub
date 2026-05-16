# Prompt para agente de desenvolvimento

Implemente/refatore a feature de Atividades no sistema da escola de inglês.

Já existe uma estrutura inicial de atividades no projeto, incluindo tabelas como `atividade`, `atividade_aluno`, `questoes_atividade`, `questoes_atividade_aluno` e `atividade_tipos`.

Você pode alterar, refatorar ou substituir o que for necessário, mas deve respeitar o padrão atual do projeto:

- Laravel
- migrations
- models Eloquent
- nomes de tabelas em português
- tabelas já existentes como `users`, `turmas`, `turmas_criadas`, `atividade` e `atividade_aluno`

Não criar uma arquitetura complexa. A implementação deve ser simples, funcional e compatível com o padrão atual do sistema.

## Objetivo da feature

O professor deve conseguir criar uma atividade diretamente para uma turma criada.

Todos os alunos dessa turma devem entregar a atividade.

Uma atividade pode conter vários blocos ordenados de diferentes tipos, por exemplo:

1. Um texto para traduzir
2. Um exercício de completar lacunas
3. Perguntas abertas
4. Questões de alternativas

A atividade deve ter:

- prazo de entrega com data e horário
- nota máxima definida pelo professor
- nota final manual para cada aluno

A atividade não deve ter neste momento:

- tentativas
- correção automática
- correção por bloco
- gabarito
- rubrica
- versionamento
- anexos
- áudio
- speaking
- listening

O único controle de entrega será:

- pendente
- entregue

A nota final do aluno será preenchida manualmente pelo professor depois da entrega.

## Estrutura de dados esperada

### Tabela: atividade

Representa a atividade criada pelo professor para uma turma criada.

A tabela já existe, mas deve ser ajustada para o novo modelo.

Campos esperados:

- id
- turma_criada_id
- professor_id
- titulo
- descricao nullable
- instrucoes nullable
- nota_max decimal(8,2)
- data_entrega datetime nullable
- created_at
- updated_at

Observações importantes:

- A atividade deve apontar para `turmas_criadas`, não apenas para `turmas`, porque `turmas_criadas` representa a turma real com professor e alunos vinculados.
- Se hoje existir `turma_id` em `atividade` apontando para `turmas`, refatorar para `turma_criada_id` apontando para `turmas_criadas`.
- Se já houver código usando `turma_id`, ajustar o código relacionado.
- Remover ou deixar de usar `tipo_id`, porque a atividade agora pode conter vários tipos de blocos.
- Manter `nota_max`, pois a atividade terá uma nota máxima.
- Alterar `data_entrega` de `date` para `datetime`, pois o professor deve definir data e horário do prazo.
- Não usar `atividade_tipos` como tipo direto da atividade. O tipo agora pertence ao bloco.

Relacionamentos esperados:

- Atividade belongsTo TurmaCriada
- Atividade belongsTo Professor/User
- Atividade hasMany AtividadeBloco
- Atividade hasMany AtividadeAluno

Validações:

- turma_criada_id obrigatório
- professor_id obrigatório
- titulo obrigatório
- nota_max obrigatório
- nota_max deve ser maior ou igual a 0
- data_entrega nullable, mas quando informado deve ser datetime válido

### Tabela: atividade_blocos

Criar tabela `atividade_blocos`.

Representa os blocos internos da atividade.

Campos esperados:

- id
- atividade_id
- tipo
- ordem
- titulo nullable
- conteudo json
- created_at
- updated_at

Tipos permitidos no campo `tipo`:

- traducao
- complete
- pergunta_resposta
- alternativa

Relacionamentos:

- AtividadeBloco belongsTo Atividade
- AtividadeBloco hasMany AtividadeResposta

Índices:

- unique(atividade_id, ordem)

Exemplo de `conteudo` para tradução:

{
  "texto": "Eu gosto de estudar inglês."
}

Exemplo de `conteudo` para complete:

{
  "texto": "I ____ English every day."
}

Exemplo de `conteudo` para perguntas abertas:

{
  "perguntas": [
    "Why do you study English?",
    "How often do you practice?"
  ]
}

Exemplo de `conteudo` para alternativas:

{
  "perguntas": [
    {
      "pergunta": "Choose the correct sentence:",
      "opcoes": [
        "She go to school.",
        "She goes to school.",
        "She going to school."
      ]
    }
  ]
}

Validações:

- atividade_id obrigatório
- tipo obrigatório
- tipo deve estar entre: traducao, complete, pergunta_resposta, alternativa
- ordem obrigatório
- conteudo obrigatório
- titulo nullable

### Tabela: atividade_aluno

Representa a atividade atribuída a um aluno e o status de entrega dele.

A tabela já existe, mas deve ser ajustada para este fluxo simples.

Campos esperados:

- id
- atividade_id
- aluno_id
- status
- data_submissao nullable
- nota_total decimal(8,2) nullable
- created_at
- updated_at

Status permitidos:

- pendente
- entregue

Relacionamentos:

- AtividadeAluno belongsTo Atividade
- AtividadeAluno belongsTo Aluno/User
- AtividadeAluno hasMany AtividadeResposta

Índices:

- unique(atividade_id, aluno_id)

Regras:

- Ao criar uma atividade para uma turma criada, buscar todos os alunos vinculados à turma e criar automaticamente um registro em `atividade_aluno` para cada aluno.
- Cada registro deve iniciar com `status = pendente`.
- Cada registro deve iniciar com `data_submissao = null`.
- Cada registro deve iniciar com `nota_total = null`.
- Quando o aluno entregar a atividade, atualizar `status = entregue` e `data_submissao = now()`.
- A nota final será preenchida manualmente pelo professor em `nota_total`.
- Não calcular nota automaticamente.
- Não somar nota por bloco.
- Não usar trigger para cálculo de nota.

Observações sobre a estrutura antiga:

- Remover ou deixar de usar `data_correcao`, porque não haverá fluxo de correção.
- Remover ou deixar de usar `comentario_professor`, salvo se já existir tela ou regra pronta para comentário final simples.
- Se mantiver `comentario_professor`, ele deve ser apenas um comentário geral da atividade, não uma correção por bloco.
- Alterar a constraint/check de status para permitir apenas `pendente` e `entregue`.
- Remover os status antigos `enviado`, `corrigido` e `ausente`, caso não sejam mais usados.

Validações:

- atividade_id obrigatório
- aluno_id obrigatório
- status obrigatório
- status deve estar entre: pendente, entregue
- nota_total nullable
- nota_total deve ser maior ou igual a 0 quando preenchida
- nota_total não pode ser maior que `atividade.nota_max`

### Tabela: atividade_respostas

Criar tabela `atividade_respostas`.

Representa as respostas do aluno para cada bloco da atividade.

Campos esperados:

- id
- atividade_aluno_id
- atividade_bloco_id
- resposta json
- created_at
- updated_at

Relacionamentos:

- AtividadeResposta belongsTo AtividadeAluno
- AtividadeResposta belongsTo AtividadeBloco

Índices:

- unique(atividade_aluno_id, atividade_bloco_id)

Exemplo de `resposta` para tradução:

{
  "texto": "I like studying English."
}

Exemplo de `resposta` para complete:

{
  "texto": "study"
}

Exemplo de `resposta` para perguntas abertas:

{
  "respostas": [
    {
      "pergunta_index": 0,
      "resposta": "Because I need English for work."
    },
    {
      "pergunta_index": 1,
      "resposta": "I practice every day."
    }
  ]
}

Exemplo de `resposta` para alternativas:

{
  "respostas": [
    {
      "pergunta_index": 0,
      "opcao_selecionada_index": 1
    }
  ]
}

Validações:

- atividade_aluno_id obrigatório
- atividade_bloco_id obrigatório
- resposta obrigatório
- não permitir duplicidade de resposta para o mesmo `atividade_aluno_id` e `atividade_bloco_id`
- garantir que `atividade_bloco_id` pertence à mesma atividade vinculada ao registro de `atividade_aluno`

## Tabelas antigas a revisar

### atividade_tipos

A tabela `atividade_tipos` pode ser removida ou deixar de ser usada nesta feature.

Motivo:

- O tipo deixou de pertencer à atividade.
- O tipo agora pertence ao bloco da atividade.

### questoes_atividade

A tabela `questoes_atividade` pode ser removida ou substituída por `atividade_blocos`.

Motivo:

- A nova atividade não é composta apenas por questões simples.
- Ela é composta por blocos de diferentes tipos.

### questoes_atividade_aluno

A tabela `questoes_atividade_aluno` pode ser removida ou substituída por `atividade_respostas`.

Motivo:

- As respostas agora pertencem a um bloco da atividade e a uma entrega do aluno.

### Triggers antigas

Remover as triggers antigas relacionadas a cálculo de nota por questão, como:

- trigger que impede soma de valores das questões exceder a nota máxima
- trigger que recalcula `nota_total` automaticamente com base em questões
- trigger de insert/update/delete em `questoes_atividade_aluno`

Motivo:

- Não haverá nota por questão ou por bloco.
- A nota final será manual, diretamente em `atividade_aluno.nota_total`.

## Fluxo funcional esperado

### Professor criando atividade

O professor deve informar:

- turma criada
- título
- descrição opcional
- instruções opcionais
- nota máxima
- prazo de entrega com data e horário
- blocos da atividade

Cada bloco deve conter:

- tipo
- ordem
- título opcional
- conteúdo json conforme o tipo

Ao salvar:

1. Criar registro em `atividade`.
2. Criar registros em `atividade_blocos`.
3. Buscar alunos da turma criada.
4. Criar um registro em `atividade_aluno` para cada aluno da turma com:
   - status = pendente
   - data_submissao = null
   - nota_total = null

### Professor listando atividades

O professor deve conseguir:

- listar atividades criadas por ele
- visualizar turma vinculada
- visualizar prazo de entrega
- visualizar nota máxima
- visualizar quantidade de alunos pendentes
- visualizar quantidade de alunos que entregaram

### Professor visualizando atividade

O professor deve conseguir visualizar:

- dados gerais da atividade
- blocos da atividade ordenados por `ordem`
- alunos vinculados
- status de cada aluno
- data de submissão de cada aluno
- nota final de cada aluno, quando preenchida

### Professor atribuindo nota final

O professor deve conseguir definir ou alterar a nota final de um aluno na atividade.

Regra:

- A nota deve ser gravada em `atividade_aluno.nota_total`.
- A nota não pode ser menor que 0.
- A nota não pode ser maior que `atividade.nota_max`.
- Não alterar o status para `corrigido`.
- Não criar fluxo de correção por bloco.

### Professor editando atividade

Permitir editar atividade enquanto nenhum aluno tiver entregue.

Pode editar:

- título
- descrição
- instruções
- nota máxima
- data_entrega
- blocos da atividade

Se pelo menos um aluno já tiver `status = entregue`, bloquear edição estrutural da atividade.

Edição estrutural inclui:

- alterar blocos
- remover blocos
- alterar tipos
- alterar conteúdo dos blocos
- alterar ordem dos blocos

### Aluno listando atividades

O aluno deve conseguir:

- listar atividades da sua turma
- ver título
- prazo de entrega
- status: pendente ou entregue
- nota máxima
- nota final, se já tiver sido preenchida pelo professor

### Aluno respondendo atividade

O aluno deve conseguir:

- abrir uma atividade pendente
- visualizar blocos ordenados por `ordem`
- responder cada bloco
- enviar as respostas

Ao enviar:

1. Criar ou atualizar registros em `atividade_respostas`.
2. Atualizar `atividade_aluno.status = entregue`.
3. Atualizar `atividade_aluno.data_submissao = now()`.

Após entregue:

- Não permitir alteração das respostas neste primeiro momento.
- Não permitir reenvio da atividade.
- Não criar múltiplas tentativas.

## Regras de permissão

Garantir que:

- aluno só visualiza atividades vinculadas a ele em `atividade_aluno`
- aluno só responde atividade vinculada a ele
- aluno não responde atividade de outra turma
- professor só gerencia atividades das turmas permitidas a ele
- professor só lança nota em atividades que ele pode gerenciar

## Models esperados

Criar ou ajustar os models:

- Atividade
- AtividadeBloco
- AtividadeAluno
- AtividadeResposta

Relacionamentos esperados:

Atividade:

- belongsTo TurmaCriada
- belongsTo Professor/User
- hasMany AtividadeBloco
- hasMany AtividadeAluno

AtividadeBloco:

- belongsTo Atividade
- hasMany AtividadeResposta

AtividadeAluno:

- belongsTo Atividade
- belongsTo Aluno/User
- hasMany AtividadeResposta

AtividadeResposta:

- belongsTo AtividadeAluno
- belongsTo AtividadeBloco

## Constantes ou enums

Criar constantes ou enums simples para status e tipos, conforme padrão do projeto.

Tipos de bloco:

- traducao
- complete
- pergunta_resposta
- alternativa

Status da atividade do aluno:

- pendente
- entregue

## Resultado esperado

Entregar a feature funcional com:

- migrations ajustadas
- remoção/refatoração das tabelas antigas que não fazem mais sentido
- remoção das triggers antigas de nota por questão
- models
- relacionamentos
- validações
- controllers/services conforme padrão atual do projeto
- telas/componentes ou endpoints necessários
- fluxo de criação pelo professor
- fluxo de resposta pelo aluno
- listagem de entregas por atividade
- lançamento manual da nota final pelo professor
- prazo de entrega com datetime

## Escopo fora desta implementação

Não implementar agora:

- tentativas
- correção automática
- correção manual por bloco
- gabarito
- rubrica
- versionamento
- anexos
- áudio
- speaking
- listening
- nota por bloco
- nota por questão
- cálculo automático de nota
- triggers de cálculo de nota

Priorize uma implementação simples, legível e sem engenharia excessiva.