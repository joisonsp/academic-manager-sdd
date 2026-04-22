# language: pt-br

Funcionalidade: Gerenciamento de Alunos - CRUD Completo
  Como gerenciador do sistema de gestão acadêmica
  Desejo gerenciar o cadastro de alunos
  Para manter os dados de estudantes atualizados e íntegros

  Contexto:
    Dado que o sistema de alunos está inicializado
    E o arquivo de alunos está vazio

  # ============================================================================
  # CRIAÇÃO DE ALUNOS
  # ============================================================================

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

  Cenário: Rejeitar criação com CPF vazio
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor              |
      | nome  | Maria Santos       |
      | cpf   |                    |
      | email | maria@example.com  |
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "CPF é obrigatório"
    E o arquivo de alunos deve permanecer vazio

  Cenário: Rejeitar criação com CPF de 10 dígitos
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor              |
      | nome  | Pedro Costa        |
      | cpf   | 1234567890         |
      | email | pedro@example.com  |
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "CPF deve conter 11 dígitos"

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

  Cenário: Rejeitar criação com e-mail vazio
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor         |
      | nome  | Ana Silva     |
      | cpf   | 11111111111   |
      | email |               |
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "E-mail é obrigatório"

  Cenário: Rejeitar criação com e-mail em formato inválido
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor          |
      | nome  | Carlos Mendes  |
      | cpf   | 22222222222    |
      | email | email-invalido |
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "E-mail inválido"

  Cenário: Rejeitar criação com e-mail duplicado
    Dado que um aluno com email "joao@example.com" já existe
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor             |
      | nome  | João Silva II     |
      | cpf   | 33333333333       |
      | email | joao@example.com  |
    Então a operação deve falhar com código 409
    E a mensagem de erro deve conter "E-mail já cadastrado"

  Cenário: Rejeitar criação com nome vazio
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor            |
      | nome  |                  |
      | cpf   | 44444444444      |
      | email | teste@example.com |
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "Nome é obrigatório"

  Cenário: Rejeitar criação com nome muito curto
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor             |
      | nome  | AB                |
      | cpf   | 55555555555       |
      | email | ab@example.com    |
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "Nome deve ter no mínimo 3 caracteres"

  Cenário: Rejeitar criação com múltiplos campos inválidos
    Quando eu submeto um novo aluno com os seguintes dados:
      | campo | valor        |
      | nome  |              |
      | cpf   | 123          |
      | email | invalido     |
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "Nome é obrigatório"

  # ============================================================================
  # LISTAGEM DE ALUNOS
  # ============================================================================

  Cenário: Listar alunos quando nenhum está cadastrado
    Quando eu solicito a listagem de todos os alunos
    Então a operação deve retornar uma lista vazia
    E o status deve ser 200

  Cenário: Listar um aluno cadastrado
    Dado que um aluno com os seguintes dados foi cadastrado:
      | nome  | João Silva       |
      | cpf   | 12345678901      |
      | email | joao@example.com |
    Quando eu solicito a listagem de todos os alunos
    Então o sistema deve retornar 1 aluno
    E o aluno deve ter o nome "João Silva"
    E o aluno deve ter o CPF "12345678901"
    E o aluno deve ter o email "joao@example.com"

  Cenário: Listar múltiplos alunos cadastrados
    Dado que os seguintes alunos foram cadastrados:
      | nome           | cpf         | email              |
      | João Silva     | 12345678901 | joao@example.com   |
      | Maria Santos   | 98765432109 | maria@example.com  |
      | Pedro Oliveira | 55555555555 | pedro@example.com  |
    Quando eu solicito a listagem de todos os alunos
    Então o sistema deve retornar 3 alunos
    E cada aluno deve conter os campos: id, nome, cpf, email, criadoEm, atualizadoEm
    E o primeiro aluno deve ter o nome "João Silva"
    E o segundo aluno deve ter o nome "Maria Santos"
    E o terceiro aluno deve ter o nome "Pedro Oliveira"

  # ============================================================================
  # BUSCA DE ALUNO POR ID
  # ============================================================================

  Cenário: Buscar aluno existente pelo ID
    Dado que um aluno com os seguintes dados foi cadastrado:
      | nome  | João Silva       |
      | cpf   | 12345678901      |
      | email | joao@example.com |
    Quando eu busco o aluno pelo ID cadastrado
    Então o sistema deve retornar os dados completos do aluno
    E o aluno retornado deve ter o nome "João Silva"
    E o status deve ser 200

  Cenário: Falha ao buscar aluno inexistente
    Quando eu busco um aluno com ID inexistente
    Então a operação deve falhar com código 404
    E a mensagem de erro deve conter "Aluno não encontrado"

  # ============================================================================
  # ATUALIZAÇÃO DE ALUNOS
  # ============================================================================

  Cenário: Atualizar nome do aluno com sucesso
    Dado que um aluno com os seguintes dados foi cadastrado:
      | nome  | João Silva       |
      | cpf   | 12345678901      |
      | email | joao@example.com |
    Quando eu atualizo o aluno alterando o nome para "João da Silva"
    Então a operação deve ser bem-sucedida
    E o aluno deve ter o nome atualizado "João da Silva"
    E o CPF deve permanecer "12345678901"
    E o email deve permanecer "joao@example.com"
    E o campo atualizadoEm deve ser mais recente que criadoEm
    E o campo criadoEm deve permanecer inalterado

  Cenário: Atualizar e-mail do aluno com sucesso
    Dado que um aluno com os seguintes dados foi cadastrado:
      | nome  | João Silva       |
      | cpf   | 12345678901      |
      | email | joao@example.com |
    Quando eu atualizo o aluno alterando o email para "joao.silva@example.com"
    Então a operação deve ser bem-sucedida
    E o aluno deve ter o email atualizado "joao.silva@example.com"
    E o nome deve permanecer "João Silva"
    E o CPF deve permanecer "12345678901"

  Cenário: Rejeitar atualização com CPF duplicado
    Dado que os seguintes alunos foram cadastrados:
      | nome         | cpf         | email             |
      | João Silva   | 12345678901 | joao@example.com  |
      | Maria Santos | 98765432109 | maria@example.com |
    Quando eu atualizo o primeiro aluno tentando usar o CPF "98765432109"
    Então a operação deve falhar com código 409
    E a mensagem de erro deve conter "CPF já cadastrado"
    E o aluno deve manter seus dados originais

  Cenário: Rejeitar atualização com e-mail duplicado
    Dado que os seguintes alunos foram cadastrados:
      | nome         | cpf         | email             |
      | João Silva   | 12345678901 | joao@example.com  |
      | Maria Santos | 98765432109 | maria@example.com |
    Quando eu atualizo o primeiro aluno tentando usar o email "maria@example.com"
    Então a operação deve falhar com código 409
    E a mensagem de erro deve conter "E-mail já cadastrado"
    E o aluno deve manter seus dados originais

  Cenário: Rejeitar atualização com e-mail em formato inválido
    Dado que um aluno com os seguintes dados foi cadastrado:
      | nome  | João Silva       |
      | cpf   | 12345678901      |
      | email | joao@example.com |
    Quando eu atualizo o aluno com email inválido "invalido@"
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "E-mail inválido"
    E o aluno deve manter seus dados originais

  Cenário: Rejeitar atualização com nome vazio
    Dado que um aluno com os seguintes dados foi cadastrado:
      | nome  | João Silva       |
      | cpf   | 12345678901      |
      | email | joao@example.com |
    Quando eu atualizo o aluno com nome vazio ""
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "Nome é obrigatório"
    E o aluno deve manter seus dados originais

  Cenário: Rejeitar atualização com nome muito curto
    Dado que um aluno com os seguintes dados foi cadastrado:
      | nome  | João Silva       |
      | cpf   | 12345678901      |
      | email | joao@example.com |
    Quando eu atualizo o aluno com nome "AB"
    Então a operação deve falhar com código 400
    E a mensagem de erro deve conter "Nome deve ter no mínimo 3 caracteres"

  Cenário: Falha ao atualizar aluno inexistente
    Quando eu tento atualizar um aluno com ID inexistente
    Então a operação deve falhar com código 404
    E a mensagem de erro deve conter "Aluno não encontrado"

  Cenário: Atualizar todos os campos do aluno simultaneamente
    Dado que um aluno com os seguintes dados foi cadastrado:
      | nome  | João Silva       |
      | cpf   | 12345678901      |
      | email | joao@example.com |
    Quando eu atualizo o aluno com os seguintes dados:
      | nome  | João da Silva Junior |
      | cpf   | 12345678901          |
      | email | joao.silva.jr@ex.com |
    Então a operação deve ser bem-sucedida
    E o aluno deve ter todos os campos atualizados corretamente
    E o ID deve permanecer inalterado

  # ============================================================================
  # REMOÇÃO DE ALUNOS
  # ============================================================================

  Cenário: Remover aluno existente com sucesso
    Dado que um aluno com os seguintes dados foi cadastrado:
      | nome  | João Silva       |
      | cpf   | 12345678901      |
      | email | joao@example.com |
    Quando eu removo o aluno cadastrado
    Então a operação deve ser bem-sucedida
    E o status deve ser 204
    E o arquivo de alunos deve estar vazio
    E uma busca posterior pelo mesmo aluno deve falhar

  Cenário: Remover um aluno entre múltiplos
    Dado que os seguintes alunos foram cadastrados:
      | nome           | cpf         | email              |
      | João Silva     | 12345678901 | joao@example.com   |
      | Maria Santos   | 98765432109 | maria@example.com  |
      | Pedro Oliveira | 55555555555 | pedro@example.com  |
    Quando eu removo o aluno "João Silva"
    Então a operação deve ser bem-sucedida
    E o total de alunos deve ser 2
    E o aluno "Maria Santos" deve continuar cadastrado
    E o aluno "Pedro Oliveira" deve continuar cadastrado
    E o aluno "João Silva" não deve existir mais

  Cenário: Falha ao remover aluno inexistente
    Dado que o arquivo de alunos contém 2 alunos
    Quando eu tento remover um aluno com ID inexistente
    Então a operação deve falhar com código 404
    E a mensagem de erro deve conter "Aluno não encontrado"
    E o total de alunos deve permanecer 2

  Cenário: Remover último aluno cadastrado
    Dado que um aluno com os seguintes dados foi cadastrado:
      | nome  | João Silva       |
      | cpf   | 12345678901      |
      | email | joao@example.com |
    Quando eu removo o aluno cadastrado
    Então a operação deve ser bem-sucedida
    E a listagem de alunos deve estar vazia

  # ============================================================================
  # INTEGRIDADE DE DADOS
  # ============================================================================

  Cenário: ID não muda após atualização
    Dado que um aluno com os seguintes dados foi cadastrado:
      | nome  | João Silva       |
      | cpf   | 12345678901      |
      | email | joao@example.com |
    E seu ID é armazenado
    Quando eu atualizo o aluno
    Então o ID deve permanecer exatamente o mesmo

  Cenário: Timestamps são gerados automaticamente
    Quando eu crio um aluno com os seguintes dados:
      | nome  | João Silva       |
      | cpf   | 12345678901      |
      | email | joao@example.com |
    Então o campo criadoEm deve estar preenchido com uma data ISO8601
    E o campo atualizadoEm deve estar preenchido com uma data ISO8601
    E ambos devem ser iguais

  Cenário: Persistência dos dados após operação
    Dado que um aluno foi cadastrado
    Quando eu realizo uma nova leitura do arquivo de alunos
    Então os dados devem persistir corretamente
    E o arquivo data/alunos.json deve estar bem formatado

  Cenário: Isolamento entre operações concorrentes
    Dado que múltiplos alunos serão criados simultaneamente
    Quando eu crio 5 alunos em operações rápidas
    Então todos os 5 alunos devem ser criados com sucesso
    E nenhum aluno deve ser perdido
    E não deve haver duplicação de IDs
