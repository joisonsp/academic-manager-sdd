---
name: gherkin-testing
description: Padrões exigidos para a escrita de testes de aceitação em BDD usando Gherkin e Cucumber.
---

# Skill: Padrões de BDD com Gherkin

## Objetivo
Garantir que os testes de aceitação sejam escritos em português usando Cucumber/Gherkin antes da implementação (TDD).

## Padrões Exigidos
1. Sempre inicie o arquivo `.feature` com `# language: pt-br`.
2. Os cenários devem focar na regra de negócio e não na interface (ex: não use "Quando eu clico no botão X", use "Quando o professor avalia o aluno com a nota Y").
3. Para o teste da regra de e-mail, garanta o cenário em que múltiplas avaliações no mesmo dia geram apenas um agendamento na fila.