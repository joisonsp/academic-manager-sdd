## Mapa de Configuração do Experimento: Spec-Driven Development

Este documento resume a infraestrutura montada para o desenvolvimento do sistema de gestão acadêmica utilizando agentes de IA, TDD e o framework OpenSpec.

## Arquitetura de IA e Ferramentas

A configuração utiliza uma abordagem de múltiplos agentes especializados (personas) e pacotes de conhecimento modular (skills), garantindo que o contexto da conversa permaneça limpo e as instruções sejam precisas.

## Diretório .github/agents/ (As Personas)

Este diretório contém os "cérebros" especializados do projeto. Cada arquivo define quem o agente é e quais são seus limites.

- backend-agent.md: Especialista em Node.js e TypeScript. Focado em manter a persistência em JSON e seguir rigorosamente o ciclo Red-Green-Refactor do TDD.

- frontend-agent.md: Especialista em React 18 e UI. Garante que os componentes sejam funcionais, tipados e possuam tags data-testid para facilitar os testes de integração.

- test-agent.md: O engenheiro de QA. É o responsável por iniciar cada funcionalidade escrevendo os cenários Gherkin e garantindo que o TDD seja seguido.

## Diretório .github/skills/
Aqui reside o conhecimento técnico específico que não é óbvio para a IA.

- email-batching/SKILL.md: Contém a lógica de agregação de e-mails. Define que o sistema deve usar uma fila (email_log.json) para nunca enviar mais de um e-mail diário por aluno.

- gherkin-testing/SKILL.md: Padroniza a escrita de testes em português e a estrutura dos arquivos .feature para o Cucumber.

- openspec-*: Conjunto de habilidades injetadas pelo framework OpenSpec para gerenciar o ciclo de vida das especificações (propor, aplicar, arquivar).

## Diretório openspec/
Este é o motor do Spec-Driven Development. Ele garante que o "pensamento" seja estruturado antes da escrita de qualquer código.

- project.md: O "Cérebro" global. Define a stack (Node/React/JSON) e as regras de orquestração que obrigam o Copilot a ler as Skills antes de agir.

- config.yaml: Configurações técnicas do framework OpenSpec.

- changes/: Local onde as propostas de novas funcionalidades (proposal.md) e os deltas de requisitos (spec.md) serão armazenados para sua revisão.

## Fluxo de Trabalho Integrado
- Planejamento (OpenSpec): é solicita uma funcionalidade via /opsx-propose. O agente lê o project.md e as skills para criar um plano de design.

- Revisão Humana: é validado se a proposta atende aos requisitos do experimento e se os cenários Gherkin estão corretos.

- Execução (TDD + Agentes): Com o plano aprovado, é usado o /opsx-apply e chamado os agentes especialistas (@test-agent, @backend-agent) para implementar o código funcional com base nos testes.