# 🎓 Sistema de Gestão Acadêmica

Um sistema Full-Stack construído com Node.js e React para o gerenciamento de alunos, turmas e matrizes de avaliação baseadas em metas. 

Este projeto foi desenvolvido utilizando a metodologia **TDD (Test-Driven Development)** guiada por **BDD (Behavior-Driven Development)** com Cucumber, garantindo que todas as regras de negócio fossem validadas antes da implementação final.

## ✨ Funcionalidades (Requisitos Atendidos)

1. **Gestão de Alunos:** CRUD completo (Inclusão, Consulta, Alteração e Remoção) de alunos, contendo Nome, CPF e E-mail.
2. **Gestão de Turmas:** CRUD de turmas, armazenando Tópico (ex: Introdução à Programação), Ano e Semestre.
3. **Matriz de Avaliações:** Interface matricial para atribuir conceitos aos alunos matriculados em turmas por metas específicas (ex: Requisitos, Testes).
   * **Conceitos suportados:** `MANA` (Meta Ainda Não Atingida), `MPA` (Meta Parcialmente Atingida) e `MA` (Meta Atingida).
4. **Persistência em JSON:** Armazenamento de dados baseado em arquivos locais (`alunos.json`, `turmas.json`, `notificacoes.json`) garantindo leveza e portabilidade para o ambiente de testes.
5. **Notificações em Batch (Mock):** Fila de processamento que agrupa múltiplas alterações de notas de um aluno durante o dia e envia um único e-mail consolidado (via console/log) ao simular a virada do dia.

## 🛠️ Tecnologias Utilizadas

### Backend
* **Node.js & Express:** Servidor HTTP RESTful.
* **TypeScript:** Tipagem estrita para maior segurança.
* **fs/promises:** Módulo nativo do Node.js para persistência de dados em arquivos `.json`.
* **CORS:** Integração segura com o frontend.

### Frontend
* **React:** Biblioteca para construção da interface de usuário.
* **Vite:** Empacotador e servidor de desenvolvimento ultra-rápido.
* **Tailwind CSS:** Estilização utilitária para componentes responsivos e limpos.
* **Axios:** Cliente HTTP para comunicação com a API.

### Qualidade e Testes
* **Cucumber:** Framework de testes automatizados baseados em comportamento (Gherkin).
* **Chai:** Biblioteca de asserções lógicas para validação dos retornos da API.
* **TSX:** Execução e compilação de TypeScript em tempo real.

## 🚀 Como Executar o Projeto

### Pré-requisitos
Certifique-se de ter o **Node.js** (versão 20 ou superior) instalado na sua máquina.

### Instalação
Clone o repositório e instale as dependências na raiz do projeto:
```bash
npm install
```

# Executando os Servidores

Para rodar a aplicação localmente, você precisará de dois terminais:

**Terminal 1 (Backend - Porta 3000):**

```bash
npm run dev
```

**Terminal 2 (Frontend - Porta 5173):**

```bash
npm run dev:frontend
```

Após iniciar ambos, acesse `http://localhost:5173/` no seu navegador.

---

## Como Rodar os Testes Automatizados

O projeto conta com uma suíte de testes E2E/Integração focada nas rotas da API. Você pode rodar todos os testes de uma vez ou por módulos:

**Rodar todos os cenários:**

```bash
npm run test
```

**Rotas de Criação de Alunos:**

```bash
npm run test:creation
```

**Rotas de Consulta de Alunos:**

```bash
npm run test:consultation
```

**Rotas de Atualização/Exclusão:**

```bash
npm run test:update-delete
```

**Turmas e Matriz de Notas:**

```bash
npm run test:turmas
```

**Sistema de Notificações Batch:**

```bash
npm run test:notificacoes
```

---

## Estrutura do Projeto

```
/
├── data/                  # Arquivos JSON de persistência de dados
├── src/
│   ├── backend/           # API Express (Controllers, Services, Repositories, Routes)
│   ├── frontend/          # App React (Componentes, Views, Services de integração)
│   └── shared/            # Interfaces/Tipos TypeScript compartilhados
├── tests/
│   ├── features/          # Cenários BDD escritos em Gherkin (.feature)
│   ├── helpers/           # Clientes HTTP auxiliares para os testes
│   └── steps/             # Implementação dos passos (Chai Assertions)
├── package.json           # Dependências e Scripts
├── tsconfig.json          # Configuração do TypeScript
└── vite.config.ts         # Configuração do Bundler Web
```
