// tests/steps/update-delete-alunos.steps.ts

import { When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import axios from 'axios';
import type { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:3000';

interface Aluno {
    id: string;
    nome: string;
    cpf: string;
    email: string;
    criadoEm: string;
    atualizadoEm: string;
}

interface StepContext {
    response?: AxiosResponse<any>;
    error?: any;
}

const context: StepContext = {};

When('eu atualizar o aluno com ID {string} com os dados:', async function (id: string, dataTable: DataTable) {
    const dados = dataTable.rowsHash();
    try {
        context.response = await axios.put(`${API_URL}/api/alunos/${id}`, dados);
    } catch (error: any) {
        context.error = error;
        context.response = error.response;
    }
});

When('eu remover o aluno com ID {string}', async function (id: string) {
    try {
        context.response = await axios.delete(`${API_URL}/api/alunos/${id}`);
    } catch (error: any) {
        context.error = error;
        context.response = error.response;
    }
});

Then('a resposta deve ter status {int}', function (statusCode: number) {
    expect(context.response, `Esperado status ${statusCode}, mas recebeu ${context.response?.status}`).to.have.property('status');
    expect(context.response!.status).to.equal(statusCode);
});

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

Then('o corpo da resposta deve conter erro {string}', function (mensagemErro: string) {
    expect(context.response!.data, 'Resposta sem corpo').to.exist;
    expect(context.response!.data).to.have.property('erro');
    expect(context.response!.data.erro).to.include(mensagemErro);
});

Then('o corpo da resposta deve conter mensagem {string}', function (mensagem: string) {
    expect(context.response!.data, 'Resposta sem corpo').to.exist;
    expect(context.response!.data).to.have.property('mensagem');
    expect(context.response!.data.mensagem).to.equal(mensagem);
});
