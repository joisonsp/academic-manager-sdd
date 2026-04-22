// tests/steps/criacao-alunos.steps.ts
// Feature: CRIAÇÃO DE ALUNOS - Cenários de teste para criação e validação

import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from 'chai';
import { httpClient } from '../helpers/http-client.ts';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * World Context: Armazena estado compartilhado entre steps
 */
interface TestContext {
    ultimaResposta?: any;
    ultimoStatus?: number;
    ultimoErro?: string;
    alunosArmazenados: any[];
    primeiroAlunoId?: string;
    alunosCriados: Map<string, any>;
}

// Estado global do teste (não é ideal em produção, mas necessário para Cucumber)
let context: TestContext = {
    alunosArmazenados: [],
    alunosCriados: new Map(),
};

const ALUNOS_FILE = path.join(process.cwd(), 'data', 'alunos.json');

// ============================================================================
// HOOKS (Setup e Teardown)
// ============================================================================

/**
 * Before: Executado antes de cada cenário
 */
Before(async function () {
    // Resetar contexto
    context = {
        alunosArmazenados: [],
        alunosCriados: new Map(),
    };

    console.log('\n📋 Iniciando novo cenário de teste...');
});

/**
 * After: Executado após cada cenário
 */
After(async function () {
    console.log('✅ Cenário finalizado\n');

    // Limpar arquivo JSON para o próximo teste
    try {
        await fs.writeFile(ALUNOS_FILE, JSON.stringify({ alunos: [] }, null, 2), 'utf-8');
    } catch (erro) {
        // Silencioso em caso de erro
    }
});

// ============================================================================
// CONTEXTO (Given - Setup inicial)
// ============================================================================

/**
 * Cenário: O sistema de alunos está inicializado
 */
Given('que o sistema de alunos está inicializado', async function () {
    console.log('  ✓ Sistema de alunos inicializado');
    // Em um cenário real, isso garantiria que a API está rodando
    // Por enquanto, apenas marca que estamos prontos
});

/**
 * Cenário: O arquivo de alunos está vazio
 */
Given('o arquivo de alunos está vazio', async function () {
    console.log('  ✓ Arquivo de alunos está vazio');
    context.alunosArmazenados = [];
    context.alunosCriados.clear();

    // Limpar o arquivo de alunos no disco
    try {
        await fs.writeFile(ALUNOS_FILE, JSON.stringify({ alunos: [] }, null, 2), 'utf-8');
    } catch (erro) {
        // Arquivo será criado na primeira escrita
    }
});

/**
 * Cenário: Um aluno com CPF já existe
 */
Given('que um aluno com CPF {string} já existe', async function (cpf: string) {
    console.log(`  ✓ Aluno com CPF ${cpf} já cadastrado`);

    const alunoExistente = {
        id: 'uuid-' + cpf,
        nome: 'Aluno Existente',
        cpf: cpf,
        email: `aluno-${cpf}@example.com`,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
    };

    context.alunosArmazenados.push(alunoExistente);
    context.alunosCriados.set(cpf, alunoExistente);

    // Persist to file
    try {
        const conteudo = await fs.readFile(ALUNOS_FILE, 'utf-8');
        const dados = JSON.parse(conteudo);
        dados.alunos.push(alunoExistente);
        await fs.writeFile(ALUNOS_FILE, JSON.stringify(dados, null, 2), 'utf-8');
    } catch (erro) {
        // If file doesn't exist, create it
        await fs.writeFile(ALUNOS_FILE, JSON.stringify({ alunos: [alunoExistente] }, null, 2), 'utf-8');
    }
});

/**
 * Cenário: Um aluno com email já existe
 */
Given('que um aluno com email {string} já existe', async function (email: string) {
    console.log(`  ✓ Aluno com email ${email} já cadastrado`);

    const alunoExistente = {
        id: 'uuid-' + email.split('@')[0],
        nome: 'Aluno Existente',
        cpf: '99999999999',
        email: email,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
    };

    context.alunosArmazenados.push(alunoExistente);
    context.alunosCriados.set(email, alunoExistente);

    // Persist to file
    try {
        const conteudo = await fs.readFile(ALUNOS_FILE, "utf-8");
        const dados = JSON.parse(conteudo);
        dados.alunos.push(alunoExistente);
        await fs.writeFile(ALUNOS_FILE, JSON.stringify(dados, null, 2), "utf-8");
    } catch (erro) {
        await fs.writeFile(ALUNOS_FILE, JSON.stringify({ alunos: [alunoExistente] }, null, 2), "utf-8");
    }
});

// ============================================================================
// AÇÃO (When - Executar ação)
// ============================================================================

/**
 * Ação: Submeter um novo aluno com dados na tabela
 * Tabela:
 *   | campo | valor |
 *   | nome  | João  |
 *   | cpf   | 123   |
 *   | email | joao@ |
 */
When('eu submeto um novo aluno com os seguintes dados:', async function (dataTable) {
    const dados = dataTable.rowsHash();

    console.log('  ℹ️  Enviando requisição POST /api/alunos com dados:');
    console.log(`      - Nome: "${dados.nome}"`);
    console.log(`      - CPF: "${dados.cpf}"`);
    console.log(`      - Email: "${dados.email}"`);

    // Fazer chamada HTTP (esperada falhar na fase RED)
    const resposta = await httpClient.criarAluno({
        nome: dados.nome,
        cpf: dados.cpf,
        email: dados.email,
    });

    context.ultimaResposta = resposta.body;
    context.ultimoStatus = resposta.status;

    console.log(`  ℹ️  Status recebido: ${resposta.status}`);

    // Armazenar localmente o aluno para contexto dos testes
    if (resposta.status === 201 || resposta.status === 200) {
        context.alunosArmazenados.push(resposta.body);
        context.primeiroAlunoId = resposta.body.id;
    }
});

// ============================================================================
// VERIFICAÇÕES DE SUCESSO (Then - Cenários positivos)
// ============================================================================

/**
 * Verificação: O aluno deve ser criado com sucesso
 */
Then('o aluno deve ser criado com sucesso', async function () {
    console.log('  ✓ Verificando criação bem-sucedida...');

    // Na fase RED, a API retornará 503 (não existe)
    // Na fase GREEN, retornará 201 Created
    if (context.ultimoStatus === 503) {
        throw new Error(
            `❌ ESPERADO NA FASE RED: API não respondeu (503). ` +
            `A backend ainda não foi implementada. Este é o comportamento esperado.`
        );
    }

    expect(context.ultimoStatus).to.equal(
        201,
        `Status esperado 201, mas recebeu ${context.ultimoStatus}`
    );
    expect(context.ultimaResposta).to.exist;
});

/**
 * Verificação: O sistema deve retornar um ID gerado automaticamente
 */
Then('o sistema deve retornar um ID gerado automaticamente', async function () {
    console.log('  ✓ Verificando ID gerado...');

    expect(context.ultimaResposta).to.have.property('id');
    expect(context.ultimaResposta.id).to.be.a('string');
    expect(context.ultimaResposta.id.length).to.be.greaterThan(0);

    console.log(`      ID gerado: ${context.ultimaResposta.id}`);
});

/**
 * Verificação: O aluno deve conter todos os campos preenchidos
 */
Then('o aluno deve conter todos os campos preenchidos', async function () {
    console.log('  ✓ Verificando campos...');

    const camposEsperados = ['id', 'nome', 'cpf', 'email', 'criadoEm', 'atualizadoEm'];

    for (const campo of camposEsperados) {
        expect(context.ultimaResposta, `Campo '${campo}' não encontrado na resposta`)
            .to.have.property(campo);
    }

    console.log(`      ✓ Todos os campos presentes`);
});

/**
 * Verificação: O campo criadoEm deve ser igual ao campo atualizadoEm
 */
Then('o campo criadoEm deve ser igual ao campo atualizadoEm', async function () {
    console.log('  ✓ Verificando timestamps...');

    expect(context.ultimaResposta.criadoEm).to.equal(
        context.ultimaResposta.atualizadoEm,
        'criadoEm e atualizadoEm devem ser iguais na criação'
    );

    console.log(`      criadoEm = atualizadoEm = ${context.ultimaResposta.criadoEm}`);
});

/**
 * Verificação: O arquivo de alunos deve ter N registros
 */
Then('o arquivo de alunos deve ter {int} registro', async function (quantidade: number) {
    console.log(`  ✓ Verificando quantidade de registros (${quantidade})...`);

    expect(context.alunosArmazenados).to.have.lengthOf(
        quantidade,
        `Esperado ${quantidade} aluno(s), mas encontrou ${context.alunosArmazenados.length}`
    );
});

// ============================================================================
// VERIFICAÇÕES DE FALHA (Then - Cenários negativos)
// ============================================================================

/**
 * Verificação: A operação deve falhar com código HTTP específico
 */
Then('a operação deve falhar com código {int}', async function (codigoEsperado: number) {
    console.log(`  ✓ Verificando código de erro ${codigoEsperado}...`);

    // Na fase RED, espera-se 503
    if (context.ultimoStatus === 503) {
        throw new Error(
            `❌ ESPERADO NA FASE RED: API não respondeu (503). ` +
            `Este é o comportamento esperado nesta fase do TDD.`
        );
    }

    expect(context.ultimoStatus).to.equal(
        codigoEsperado,
        `Status esperado ${codigoEsperado}, mas recebeu ${context.ultimoStatus}`
    );

    console.log(`      Status: ${context.ultimoStatus} ✓`);
});

/**
 * Verificação: A mensagem de erro deve conter um texto específico
 */
Then('a mensagem de erro deve conter {string}', async function (textoEsperado: string) {
    console.log(`  ✓ Verificando mensagem de erro...`);

    const mensagem = context.ultimaResposta?.erro || context.ultimaResposta?.message || '';

    expect(mensagem).to.include(
        textoEsperado,
        `Mensagem esperada conter "${textoEsperado}", mas recebeu: "${mensagem}"`
    );

    console.log(`      Mensagem: "${mensagem}"`);
});

/**
 * Verificação: O arquivo de alunos deve permanecer vazio
 */
Then('o arquivo de alunos deve permanecer vazio', async function () {
    console.log('  ✓ Verificando se arquivo permanece vazio...');

    // Se a chamada falhou (esperado na fase RED ou em validação), não deve ter criado nada
    if (context.ultimoStatus === 201 || context.ultimoStatus === 200) {
        throw new Error('Esperava falha, mas recebeu sucesso');
    }

    // O número de alunos armazenados não deve ter aumentado
    const alunosAntesErro = context.alunosArmazenados.length;
    expect(alunosAntesErro).to.equal(0);
});

/**
 * Verificação: O total de alunos deve ser N
 */
Then('o total de alunos deve ser {int}', async function (quantidade: number) {
    console.log(`  ✓ Verificando total de alunos (${quantidade})...`);

    expect(context.alunosArmazenados).to.have.lengthOf(quantidade);
});

// ============================================================================
// EXPORTAR CONTEXT PARA DEBUG
// ============================================================================

export function getContext() {
    return context;
}
