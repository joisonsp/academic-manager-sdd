# language: pt
Funcionalidade: Gerenciamento de Turmas e Avaliações
  Como um administrador do sistema
  Eu quero criar turmas, matricular alunos e registrar avaliações por Meta
  Para manter o controle acadêmico e acompanhar o desempenho dos alunos

  # ==========================================================================
  # CRUD DE TURMAS
  # ==========================================================================

  @turmas @criacao
  Cenário: Criar turma com sucesso
    Quando eu criar uma nova turma com os dados:
      | topico                   | ano  | semestre |
      | Introdução à Programação | 2024 | 1        |
    Então a resposta deve ter status 201
    E a turma retornada deve ter topico "Introdução à Programação"
    E a turma retornada deve ter ano 2024
    E a turma retornada deve ter semestre 1
    E a turma retornada deve ter lista de alunos vazia

  @turmas @listagem
  Cenário: Listar turmas cadastradas
    Dado que existem as seguintes turmas cadastradas:
      | id                                   | topico              | ano  | semestre |
      | aaf1b400-e29b-41d4-a716-446655440001 | Algoritmos          | 2024 | 1        |
      | aaf1b400-e29b-41d4-a716-446655440002 | Estruturas de Dados | 2024 | 2        |
    Quando eu solicitar a listagem de turmas
    Então a resposta deve ter status 200
    E o corpo da resposta deve conter 2 turmas

  @turmas @busca
  Cenário: Buscar turma existente por ID
    Dado que existem as seguintes turmas cadastradas:
      | id                                   | topico         | ano  | semestre |
      | aaf1b400-e29b-41d4-a716-446655440003 | Banco de Dados | 2024 | 1        |
    Quando eu solicitar a turma com ID "aaf1b400-e29b-41d4-a716-446655440003"
    Então a resposta deve ter status 200
    E a turma retornada deve ter topico "Banco de Dados"

  @turmas @busca
  Cenário: Buscar turma com ID inexistente retorna 404
    Dado que não existem turmas cadastradas
    Quando eu solicitar a turma com ID "aaf1b400-e29b-41d4-a716-446655440099"
    Então a resposta deve ter status 404
    E o corpo da resposta deve conter erro "Turma não encontrada"

  @turmas @atualizacao
  Cenário: Atualizar turma com sucesso
    Dado que existem as seguintes turmas cadastradas:
      | id                                   | topico      | ano  | semestre |
      | aaf1b400-e29b-41d4-a716-446655440004 | Redes I     | 2024 | 1        |
    Quando eu atualizar a turma com ID "aaf1b400-e29b-41d4-a716-446655440004" com os dados:
      | topico   | ano  | semestre |
      | Redes II | 2024 | 2        |
    Então a resposta deve ter status 200
    E a turma retornada deve ter topico "Redes II"
    E a turma retornada deve ter semestre 2

  @turmas @exclusao
  Cenário: Remover turma com sucesso
    Dado que existem as seguintes turmas cadastradas:
      | id                                   | topico         | ano  | semestre |
      | aaf1b400-e29b-41d4-a716-446655440005 | Engenharia Web | 2024 | 1        |
    Quando eu remover a turma com ID "aaf1b400-e29b-41d4-a716-446655440005"
    Então a resposta deve ter status 200
    E o corpo da resposta deve conter mensagem "Turma removida com sucesso"

  @turmas @exclusao
  Cenário: Remover turma com ID inexistente retorna 404
    Dado que não existem turmas cadastradas
    Quando eu remover a turma com ID "aaf1b400-e29b-41d4-a716-446655440098"
    Então a resposta deve ter status 404
    E o corpo da resposta deve conter erro "Turma não encontrada"

  @turmas @validacao
  Cenário: Rejeitar criação de turma sem tópico
    Quando eu criar uma nova turma com os dados:
      | topico | ano  | semestre |
      |        | 2024 | 1        |
    Então a resposta deve ter status 400
    E o corpo da resposta deve conter erro "Tópico é obrigatório"

  @turmas @validacao
  Cenário: Rejeitar criação de turma sem ano
    Quando eu criar uma nova turma com os dados:
      | topico              | ano | semestre |
      | Introdução ao Linux |     | 1        |
    Então a resposta deve ter status 400
    E o corpo da resposta deve conter erro "Ano é obrigatório"

  # ==========================================================================
  # MATRÍCULAS E AVALIAÇÕES
  # ==========================================================================

  @turmas @avaliacao @criacao
  Cenário: Matricular aluno e registrar avaliação com conceito MANA com sucesso
    Dado que existe uma turma com ID "aaf1b400-e29b-41d4-a716-446655440010" e sem alunos
    E que existe um aluno com ID "660e8400-e29b-41d4-a716-446655440010" no arquivo de alunos
    Quando eu matricular o aluno "660e8400-e29b-41d4-a716-446655440010" na turma "aaf1b400-e29b-41d4-a716-446655440010"
    E eu registrar avaliação do aluno "660e8400-e29b-41d4-a716-446655440010" na turma "aaf1b400-e29b-41d4-a716-446655440010" com os dados:
      | meta       | conceito |
      | Requisitos | MANA     |
    Então a resposta deve ter status 200
    E a avaliação retornada deve ter conceito "MANA"

  @turmas @avaliacao
  Cenário: Registrar avaliação com conceito MPA com sucesso
    Dado que existe uma turma com ID "aaf1b400-e29b-41d4-a716-446655440011" com aluno "660e8400-e29b-41d4-a716-446655440011" já matriculado
    Quando eu registrar avaliação do aluno "660e8400-e29b-41d4-a716-446655440011" na turma "aaf1b400-e29b-41d4-a716-446655440011" com os dados:
      | meta   | conceito |
      | Testes | MPA      |
    Então a resposta deve ter status 200
    E a avaliação retornada deve ter conceito "MPA"

  @turmas @avaliacao
  Cenário: Registrar avaliação com conceito MA com sucesso
    Dado que existe uma turma com ID "aaf1b400-e29b-41d4-a716-446655440012" com aluno "660e8400-e29b-41d4-a716-446655440012" já matriculado
    Quando eu registrar avaliação do aluno "660e8400-e29b-41d4-a716-446655440012" na turma "aaf1b400-e29b-41d4-a716-446655440012" com os dados:
      | meta       | conceito |
      | Requisitos | MA       |
    Então a resposta deve ter status 200
    E a avaliação retornada deve ter conceito "MA"

  @turmas @avaliacao @validacao
  Cenário: Rejeitar avaliação com conceito inválido
    Dado que existe uma turma com ID "aaf1b400-e29b-41d4-a716-446655440013" com aluno "660e8400-e29b-41d4-a716-446655440013" já matriculado
    Quando eu registrar avaliação do aluno "660e8400-e29b-41d4-a716-446655440013" na turma "aaf1b400-e29b-41d4-a716-446655440013" com os dados:
      | meta       | conceito |
      | Requisitos | F        |
    Então a resposta deve ter status 400
    E o corpo da resposta deve conter erro "Conceito inválido"

  @turmas @avaliacao @validacao
  Cenário: Rejeitar avaliação de aluno não matriculado na turma
    Dado que existe uma turma com ID "aaf1b400-e29b-41d4-a716-446655440014" e sem alunos
    Quando eu registrar avaliação do aluno "660e8400-e29b-41d4-a716-446655440014" na turma "aaf1b400-e29b-41d4-a716-446655440014" com os dados:
      | meta       | conceito |
      | Requisitos | MANA     |
    Então a resposta deve ter status 404
    E o corpo da resposta deve conter erro "Aluno não matriculado"
