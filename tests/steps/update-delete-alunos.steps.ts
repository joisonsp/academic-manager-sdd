// tests/steps/update-delete-alunos.steps.ts

import { When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import axios from 'axios';
import type { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:3000';

interface StepContext {
    response?: AxiosResponse<any>;
    error?: any;
}

const context: StepContext = {};

When('eu atualizar o aluno com ID {string} com os dados:', async function (id: string, dataTable: DataTable) {
    const dados = dataTable.hashes()[0];
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


Then('o corpo da resposta deve conter mensagem {string}', function (mensagem: string) {
    expect(context.response).to.exist;
    expect(context.response!.data, 'Resposta sem corpo').to.exist;
    expect(context.response!.data).to.have.property('mensagem');
    expect(context.response!.data.mensagem).to.equal(mensagem);
});