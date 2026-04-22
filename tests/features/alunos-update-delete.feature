# language: pt
Funcionalidade: Atualização e Remoção de Alunos
  Como um administrador do sistema
  Eu quero atualizar e remover alunos por ID
  Para manter o cadastro de alunos consistente

  @update @put
  Cenário: Alterar aluno com sucesso
    Dado que o arquivo de alunos contém os seguintes alunos:
      | id                                   | nome         | cpf         | email                   |
      | 550e8400-e29b-41d4-a716-446655440010 | Ana Pereira  | 11122233344 | ana.pereira@example.com |
    Quando eu atualizar o aluno com ID "550e8400-e29b-41d4-a716-446655440010" com os dados:
      | nome          | cpf         | email                    |
      | Ana Maria     | 11122233344 | ana.maria@example.com    |
    Então a resposta deve ter status 200
    E o aluno retornado deve ter nome "Ana Maria"
    E o aluno retornado deve ter cpf "11122233344"
    E o aluno retornado deve ter email "ana.maria@example.com"

  @update @put
  Cenário: Alterar aluno com ID que não existe
    Dado que o arquivo de alunos está vazio
    Quando eu atualizar o aluno com ID "550e8400-e29b-41d4-a716-446655440011" com os dados:
      | nome       | cpf         | email                  |
      | Bruno Lima | 22233344455 | bruno.lima@example.com |
    Então a resposta deve ter status 404
    E o corpo da resposta deve conter erro "Aluno não encontrado"

  @update @put
  Cenário: Alterar aluno com CPF duplicado na edição
    Dado que o arquivo de alunos contém os seguintes alunos:
      | id                                   | nome          | cpf         | email                   |
      | 550e8400-e29b-41d4-a716-446655440012 | Carla Souza   | 33344455566 | carla.souza@example.com |
      | 550e8400-e29b-41d4-a716-446655440013 | Diego Rocha   | 44455566677 | diego.rocha@example.com |
    Quando eu atualizar o aluno com ID "550e8400-e29b-41d4-a716-446655440012" com os dados:
      | nome          | cpf         | email                    |
      | Carla Souza   | 44455566677 | carla.novo@example.com  |
    Então a resposta deve ter status 409
    E o corpo da resposta deve conter erro "CPF já cadastrado"

  @delete
  Cenário: Remover aluno com sucesso
    Dado que o arquivo de alunos contém os seguintes alunos:
      | id                                   | nome        | cpf         | email                   |
      | 550e8400-e29b-41d4-a716-446655440020 | Eduardo Nunes | 55566677788 | eduardo.nunes@example.com |
    Quando eu remover o aluno com ID "550e8400-e29b-41d4-a716-446655440020"
    Então a resposta deve ter status 200
    E o corpo da resposta deve conter mensagem "Aluno removido com sucesso"

  @delete
  Cenário: Remover aluno com ID que não existe
    Dado que o arquivo de alunos está vazio
    Quando eu remover o aluno com ID "550e8400-e29b-41d4-a716-446655440022"
    Então a resposta deve ter status 404
    E o corpo da resposta deve conter erro "Aluno não encontrado"
