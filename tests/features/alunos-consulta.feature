# language: pt
Funcionalidade: Consulta de Alunos
  Como um usuário do sistema
  Eu quero consultar alunos cadastrados
  Para visualizar informações de alunos específicos ou listar todos

  @consulta @listagem
  Cenário: Listar alunos quando nenhum está cadastrado
    Dado que o arquivo de alunos está vazio
    Quando eu solicitar a listagem de alunos
    Então a resposta deve ter status 200
    E o corpo da resposta deve ser uma lista vazia

  @consulta @listagem
  Cenário: Listar alunos quando existem alunos cadastrados
    Dado que o arquivo de alunos contém os seguintes alunos:
      | id                                   | nome          | cpf         | email                   |
      | 550e8400-e29b-41d4-a716-446655440001 | João Silva    | 12345678901 | joao.silva@example.com  |
      | 550e8400-e29b-41d4-a716-446655440002 | Maria Santos  | 98765432101 | maria.santos@example.com |
    Quando eu solicitar a listagem de alunos
    Então a resposta deve ter status 200
    E o corpo da resposta deve conter 2 alunos
    E o primeiro aluno deve ter nome "João Silva"
    E o segundo aluno deve ter nome "Maria Santos"

  @consulta @busca
  Cenário: Buscar aluno por ID com sucesso
    Dado que o arquivo de alunos contém os seguintes alunos:
      | id                                   | nome          | cpf         | email                   |
      | 550e8400-e29b-41d4-a716-446655440001 | João Silva    | 12345678901 | joao.silva@example.com  |
    Quando eu solicitar o aluno com ID "550e8400-e29b-41d4-a716-446655440001"
    Então a resposta deve ter status 200
    E o aluno retornado deve ter nome "João Silva"
    E o aluno retornado deve ter cpf "12345678901"
    E o aluno retornado deve ter email "joao.silva@example.com"

  @consulta @busca
  Cenário: Buscar aluno por ID que não existe
    Dado que o arquivo de alunos está vazio
    Quando eu solicitar o aluno com ID "999e8400-e29b-41d4-a716-446655440999"
    Então a resposta deve ter status 404
    E o corpo da resposta deve conter erro "Aluno não encontrado"

  @consulta @busca @validacao
  Cenário: Buscar aluno com formato de ID inválido
    Dado que o arquivo de alunos está vazio
    Quando eu solicitar o aluno com ID "id-invalido"
    Então a resposta deve ter status 400
    E o corpo da resposta deve conter erro "ID inválido"
