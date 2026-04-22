# language: pt

Funcionalidade: Gerenciamento de Alunos - Criação
  Como gerenciador do sistema de gestão acadêmica
  Desejo criar novos alunos
  Para manter o cadastro atualizado

  Contexto:
    Dado que o sistema de alunos está inicializado
    E o arquivo de alunos está vazio

  # ============================================================================
  # CRIAÇÃO DE ALUNOS - CENÁRIOS (9 total: 1 sucesso + 8 falhas)
  # ============================================================================

  @criacao @sucesso
  Cenário: Criar aluno com dados válidos completos
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor              |
      | nome  | João Silva         |
      | cpf   | 12345678901        |
      | email | joao@example.com   |
    Então o aluno deve ser criado com sucesso
    E o sistema deve retornar um ID gerado automaticamente
    E o aluno deve conter todos os campos preenchidos
    E o campo criadoEm deve ser igual ao campo atualizadoEm
    E o arquivo de alunos deve ter 1 registro

  @criacao @validacao-cpf
  Cenário: Rejeitar criação com CPF vazio
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor              |
      | nome  | Maria Santos       |
      | cpf   |                    |
      | email | maria@example.com  |
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "CPF é obrigatório"
    E o arquivo de alunos deve permanecer vazio

  @criacao @validacao-cpf
  Cenário: Rejeitar criação com CPF de 10 dígitos
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor              |
      | nome  | Pedro Costa        |
      | cpf   | 1234567890         |
      | email | pedro@example.com  |
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "CPF deve conter 11 dígitos"

  @criacao @validacao-cpf
  Cenário: Rejeitar criação com CPF duplicado
    Dado que um aluno com CPF "12345678901" já existe
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor              |
      | nome  | Outro João         |
      | cpf   | 12345678901        |
      | email | outro@example.com  |
    Então a operação deve falhar com código 409
    E a mensagem de erro deve conter "CPF já cadastrado"
    E o total de alunos deve ser 1

  @criacao @validacao-email
  Cenário: Rejeitar criação com e-mail vazio
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor         |
      | nome  | Ana Silva     |
      | cpf   | 11111111111   |
      | email |               |
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "E-mail é obrigatório"

  @criacao @validacao-email
  Cenário: Rejeitar criação com e-mail em formato inválido
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor          |
      | nome  | Carlos Mendes  |
      | cpf   | 22222222222    |
      | email | email-invalido |
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "E-mail inválido"

  @criacao @validacao-email
  Cenário: Rejeitar criação com e-mail duplicado
    Dado que um aluno com email "joao@example.com" já existe
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor             |
      | nome  | João Silva II     |
      | cpf   | 33333333333       |
      | email | joao@example.com  |
    Então a operação deve falhar com código 409
    E a mensagem de erro deve conter "E-mail já cadastrado"

  @criacao @validacao-nome
  Cenário: Rejeitar criação com nome vazio
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor            |
      | nome  |                  |
      | cpf   | 44444444444      |
      | email | teste@example.com |
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "Nome é obrigatório"

  @criacao @validacao-nome
  Cenário: Rejeitar criação com nome muito curto
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor             |
      | nome  | AB                |
      | cpf   | 55555555555       |
      | email | ab@example.com    |
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "Nome deve ter no mínimo 3 caracteres"

  @criacao @validacao-multiplos
  Cenário: Rejeitar criação com múltiplos campos inválidos
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor        |
      | nome  |              |
      | cpf   | 123          |
      | email | invalido     |
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "Nome é obrigatório"
