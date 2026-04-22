// tests/steps/consulta-alunos.steps.ts

import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import { sharedContext as context } from '../helpers/step-context.ts';

const API_URL = 'http://localhost:3000';
const ALUNOS_FILE = path.join(process.cwd(), 'data', 'alunos.json');

interface Aluno {
    id: string;
    nome: string;
    cpf: string;
    email: string;
    criadoEm: string;
    atualizadoEm: string;
}

// Auxiliar para ler alunos do arquivo
async function lerAlunos(): Promise<Aluno[]> {
    try {
        const conteudo = await fs.readFile(ALUNOS_FILE, 'utf-8');
        const dados = JSON.parse(conteudo);
        return dados.alunos || [];
    } catch {
        return [];
    }
}

// Auxiliar para salvar alunos no arquivo
async function salvarAlunos(alunos: Aluno[]): Promise<void> {
    await fs.writeFile(ALUNOS_FILE, JSON.stringify({ alunos }, null, 2));
}

// Given steps
Given('que o arquivo de alunos está vazio', async function () {
    await salvarAlunos([]);
});

Given('que o arquivo de alunos contém os seguintes alunos:', async function (dataTable: DataTable) {
    const rows = dataTable.hashes();
    const alunos: Aluno[] = rows.map((row) => ({
        id: row.id,
        nome: row.nome,
        cpf: row.cpf,
        email: row.email,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
    }));

    context.listaAlunos = alunos;
    await salvarAlunos(alunos);
});

// When steps
When('eu solicitar a listagem de alunos', async function () {
    try {
        context.response = await axios.get(`${API_URL}/api/alunos`);
    } catch (error: any) {
        context.error = error;
        context.response = error.response;
    }
});

When('eu solicitar o aluno com ID {string}', async function (id: string) {
    context.currentId = id;
    try {
        context.response = await axios.get(`${API_URL}/api/alunos/${id}`);
    } catch (error: any) {
        context.error = error;
        context.response = error.response;
    }
});

// Then steps - Status
Then('a resposta deve ter status {int}', function (statusCode: number) {
    expect(context.response, `Esperado status ${statusCode}, mas recebeu ${context.response?.status}`).to.have.property('status');
    expect(context.response!.status).to.equal(statusCode);
});

// Then steps - Listagem vazia
Then('o corpo da resposta deve ser uma lista vazia', function () {
    expect(context.response!.data, 'Esperado array vazio').to.be.an('array').that.is.empty;
});

// Then steps - Listagem com alunos
Then('o corpo da resposta deve conter {int} alunos', function (quantidade: number) {
    expect(context.response!.data, `Esperado array com ${quantidade} alunos`).to.be.an('array');
    expect(context.response!.data).to.have.lengthOf(quantidade);
});

Then('o primeiro aluno deve ter nome {string}', function (nome: string) {
    expect(context.response!.data[0], 'Primeiro aluno não encontrado').to.exist;
    expect(context.response!.data[0]).to.have.property('nome');
    expect(context.response!.data[0].nome).to.equal(nome);
});

Then('o segundo aluno deve ter nome {string}', function (nome: string) {
    expect(context.response!.data[1], 'Segundo aluno não encontrado').to.exist;
    expect(context.response!.data[1]).to.have.property('nome');
    expect(context.response!.data[1].nome).to.equal(nome);
});

// Then steps - Busca por ID
Then('o aluno retornado deve ter nome {string}', function (nome: string) {
    expect(context.response!.data, 'Aluno não encontrado na resposta').to.exist;
    expect(context.response!.data).to.have.property('nome');
    expect(context.response!.data.nome).to.equal(nome);
});

Then('o aluno retornado deve ter cpf {string}', function (cpf: string) {
    expect(context.response!.data, 'Aluno não encontrado na resposta').to.exist;
    expect(context.response!.data).to.have.property('cpf');
    expect(context.response!.data.cpf).to.equal(cpf);
});

Then('o aluno retornado deve ter email {string}', function (email: string) {
    expect(context.response!.data, 'Aluno não encontrado na resposta').to.exist;
    expect(context.response!.data).to.have.property('email');
    expect(context.response!.data.email).to.equal(email);
});

// Then steps - Erro
Then('o corpo da resposta deve conter erro {string}', function (mensagemErro: string) {
    expect(context.response!.data, 'Resposta sem corpo').to.exist;
    expect(context.response!.data).to.have.property('erro');
    expect(context.response!.data.erro).to.include(mensagemErro);
});
