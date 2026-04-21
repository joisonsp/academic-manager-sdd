# Contexto do Projeto: Sistema de Gestão Acadêmica

## Propósito
Sistema web para gerenciamento de alunos, turmas e avaliações por metas (MANA, MPA, MA).

## Regras Arquiteturais e Tecnologias
- **Backend:** Node.js e TypeScript.
- **Persistência:** O banco de dados deve ser substituído por leitura e escrita de arquivos `.json` locais (usando `fs/promises`).
- **Frontend:** Aplicação cliente em React 18 com TypeScript.
- **Testes:** Desenvolvimento guiado por testes (TDD). Testes de aceitação devem usar Cucumber.js com sintaxe Gherkin em português (Dado/Quando/Então).

## Regras de Orquestração de Agentes
Todas as tarefas de codificação devem ser roteadas para a pasta `.github/agents/`:
- Tarefas de frontend (React) pertencem ao `@frontend-agent`.
- Tarefas de backend e persistência JSON pertencem ao `@backend-agent`.
- Tarefas de BDD/Gherkin pertencem ao `@test-agent`.