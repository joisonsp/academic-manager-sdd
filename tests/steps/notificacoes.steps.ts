// tests/steps/notificacoes.steps.ts

import { Before, After, Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import { sharedContext as context, resetSharedContext } from '../helpers/step-context.ts';

const API_URL = 'http://localhost:3000';
const NOTIFICACOES_FILE = path.join(process.cwd(), 'data', 'notificacoes.json');

// ============================================================================
// Tipos locais
// ============================================================================

interface ItemFila {
    id: string;
    alunoId: string;
    alunoNome: string;
    alunoEmail: string;
    meta: string;
    conceitoNovo: string;
    turmaTopico: string;
    criadoEm: string;
}

interface FilaData {
    fila: ItemFila[];
}

// ============================================================================
// Auxiliares de persistência
// ============================================================================

async function salvarFila(fila: ItemFila[]): Promise<void> {
    const dados: FilaData = { fila };
    await fs.writeFile(NOTIFICACOES_FILE, JSON.stringify(dados, null, 2), 'utf-8');
}

// ============================================================================
// Hooks — isolados à tag @notificacoes
// ============================================================================

Before({ tags: '@notificacoes' }, async function () {
    resetSharedContext();
});

After({ tags: '@notificacoes' }, async function () {
    try {
        await salvarFila([]);
    } catch {
        // silencioso — arquivo pode não existir ainda na fase RED
    }
});

// ============================================================================
// Given — preparação do estado da fila
// ============================================================================

Given('que a fila de notificações contém as seguintes pendências:', async function (dataTable: DataTable) {
    const rows = dataTable.hashes();
    const fila: ItemFila[] = rows.map((row, index) => ({
        id: `notif-${index + 1}`,
        alunoId: row.alunoId,
        alunoNome: row.alunoNome,
        alunoEmail: row.alunoEmail,
        meta: row.meta,
        conceitoNovo: row.conceitoNovo,
        turmaTopico: row.turmaTopico,
        criadoEm: new Date().toISOString(),
    }));
    await salvarFila(fila);
});

Given('que a fila de notificações está vazia', async function () {
    await salvarFila([]);
});

// ============================================================================
// When — ação HTTP
// ============================================================================

When('eu processar as notificações pendentes', async function () {
    try {
        context.response = await axios.post(`${API_URL}/api/notificacoes/processar`);
    } catch (error: any) {
        context.error = error;
        context.response = error.response;
    }
});

// ============================================================================
// Then — verificações específicas de batch
// ============================================================================

Then('o total de envios consolidados deve ser {int}', function (total: number) {
    expect(context.response!.data, 'Resposta sem corpo').to.exist;
    expect(context.response!.data).to.have.property('totalEnvios');
    expect(context.response!.data.totalEnvios).to.equal(total);
});

Then('o primeiro envio deve conter {int} avaliações', function (quantidade: number) {
    expect(context.response!.data, 'Resposta sem corpo').to.exist;
    expect(context.response!.data).to.have.property('envios');
    expect(
        context.response!.data.envios,
        'Lista de envios não encontrada ou vazia'
    ).to.be.an('array').that.is.not.empty;
    expect(
        context.response!.data.envios[0],
        'Primeiro envio não encontrado'
    ).to.have.property('avaliacoes');
    expect(
        context.response!.data.envios[0].avaliacoes,
        `Esperado ${quantidade} avaliações no primeiro envio`
    ).to.be.an('array').with.lengthOf(quantidade);
});
