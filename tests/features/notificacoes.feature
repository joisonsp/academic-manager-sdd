# language: pt
Funcionalidade: Processamento de Notificações em Batch
  Como um administrador do sistema
  Eu quero disparar o processamento da fila de notificações de avaliações
  Para que cada aluno receba um único e-mail consolidado com todas as atualizações do dia

  # ==========================================================================
  # Regras de negócio:
  #   - Cada item da fila representa uma avaliação alterada (alunoId, meta, conceito).
  #   - O processamento agrupa por alunoId e gera um envio consolidado por aluno.
  #   - A fila é esvaziada após o processamento.
  #   - A resposta inclui: totalEnvios e a lista de envios com as avaliações agrupadas.
  # ==========================================================================

  @notificacoes @batch
  Cenário: Processar fila com 3 avaliações pendentes do mesmo aluno gera envio consolidado
    Dado que a fila de notificações contém as seguintes pendências:
      | alunoId                              | alunoNome  | alunoEmail            | meta       | conceitoNovo | turmaTopico         |
      | 770e8400-e29b-41d4-a716-446655440001 | João Alves | joao.alves@email.com | Requisitos | MANA         | Introdução à Prog.  |
      | 770e8400-e29b-41d4-a716-446655440001 | João Alves | joao.alves@email.com | Testes     | MPA          | Introdução à Prog.  |
      | 770e8400-e29b-41d4-a716-446655440001 | João Alves | joao.alves@email.com | UI         | MA           | Introdução à Prog.  |
    Quando eu processar as notificações pendentes
    Então a resposta deve ter status 200
    E o total de envios consolidados deve ser 1
    E o primeiro envio deve conter 3 avaliações

  @notificacoes @fila-vazia
  Cenário: Processar fila vazia retorna mensagem de ausência
    Dado que a fila de notificações está vazia
    Quando eu processar as notificações pendentes
    Então a resposta deve ter status 200
    E o corpo da resposta deve conter mensagem "Nenhuma notificacao"
