// tests/steps/turmas-avaliacoes.steps.ts

import { Before, After, Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import { sharedContext as context, resetSharedContext } from '../helpers/step-context.ts';

const API_URL = 'http://localhost:3000';
const TURMAS_FILE = path.join(process.cwd(), 'data', 'turmas.json');
const ALUNOS_FILE = path.join(process.cwd(), 'data', 'alunos.json');

// ============================================================================
// Tipos locais
// ============================================================================

interface Avaliacao {
    meta: string;
    conceito: string;
}

interface AlunoMatriculado {
    alunoId: string;
    avaliacoes: Avaliacao[];
}

interface Turma {
    id: string;
    topico: string;
    ano: number;
    semestre: number;
    alunos: AlunoMatriculado[];
}

// ============================================================================
// Auxiliares de persistência
// ============================================================================

async function salvarTurmas(turmas: Turma[]): Promise<void> {
    await fs.writeFile(TURMAS_FILE, JSON.stringify({ turmas }, null, 2), 'utf-8');
}

async function lerAlunos(): Promise<any[]> {
    try {
        const conteudo = await fs.readFile(ALUNOS_FILE, 'utf-8');
        return JSON.parse(conteudo).alunos || [];
    } catch {
        return [];
    }
}

// ============================================================================
// Hooks
// ============================================================================

Before({ tags: '@turmas' }, async function () {
    resetSharedContext();
});

After({ tags: '@turmas' }, async function () {
    try {
        await salvarTurmas([]);
    } catch {
        // silencioso
    }
});

// ============================================================================
// Given — preparação de estado
// ============================================================================

Given('que não existem turmas cadastradas', async function () {
    await salvarTurmas([]);
});

Given('que existem as seguintes turmas cadastradas:', async function (dataTable: DataTable) {
    const rows = dataTable.hashes();
    const turmas: Turma[] = rows.map((row) => ({
        id: row.id,
        topico: row.topico,
        ano: parseInt(row.ano, 10),
        semestre: parseInt(row.semestre, 10),
        alunos: [],
    }));
    await salvarTurmas(turmas);
});

Given('que existe uma turma com ID {string} e sem alunos', async function (turmaId: string) {
    await salvarTurmas([
        {
            id: turmaId,
            topico: 'Turma de Teste',
            ano: 2024,
            semestre: 1,
            alunos: [],
        },
    ]);
});

Given(
    'que existe uma turma com ID {string} com aluno {string} já matriculado',
    async function (turmaId: string, alunoId: string) {
        await salvarTurmas([
            {
                id: turmaId,
                topico: 'Turma de Teste',
                ano: 2024,
                semestre: 1,
                alunos: [{ alunoId, avaliacoes: [] }],
            },
        ]);
    }
);

Given(
    'que existe um aluno com ID {string} no arquivo de alunos',
    async function (alunoId: string) {
        const novoAluno = {
            id: alunoId,
            nome: 'Aluno de Teste',
            cpf: '10000000001',
            email: `aluno-${alunoId.slice(0, 8)}@example.com`,
            criadoEm: new Date().toISOString(),
            atualizadoEm: new Date().toISOString(),
        };

        const alunosExistentes = await lerAlunos();
        const jaExiste = alunosExistentes.some((a: any) => a.id === alunoId);

        if (!jaExiste) {
            alunosExistentes.push(novoAluno);
        }

        await fs.writeFile(
            ALUNOS_FILE,
            JSON.stringify({ alunos: alunosExistentes }, null, 2),
            'utf-8'
        );
    }
);

// ============================================================================
// When — ações HTTP
// ============================================================================

When('eu criar uma nova turma com os dados:', async function (dataTable: DataTable) {
    const dados = dataTable.hashes()[0];
    const payload: Record<string, any> = {};

    if (dados.topico !== undefined) payload.topico = dados.topico;
    if (dados.ano) payload.ano = parseInt(dados.ano, 10);
    if (dados.semestre) payload.semestre = parseInt(dados.semestre, 10);

    try {
        context.response = await axios.post(`${API_URL}/api/turmas`, payload);
    } catch (error: any) {
        context.error = error;
        context.response = error.response;
    }
});

When('eu solicitar a listagem de turmas', async function () {
    try {
        context.response = await axios.get(`${API_URL}/api/turmas`);
    } catch (error: any) {
        context.error = error;
        context.response = error.response;
    }
});

When('eu solicitar a turma com ID {string}', async function (id: string) {
    try {
        context.response = await axios.get(`${API_URL}/api/turmas/${id}`);
    } catch (error: any) {
        context.error = error;
        context.response = error.response;
    }
});

When(
    'eu atualizar a turma com ID {string} com os dados:',
    async function (id: string, dataTable: DataTable) {
        const dados = dataTable.hashes()[0];
        const payload: Record<string, any> = {};

        if (dados.topico !== undefined) payload.topico = dados.topico;
        if (dados.ano) payload.ano = parseInt(dados.ano, 10);
        if (dados.semestre) payload.semestre = parseInt(dados.semestre, 10);

        try {
            context.response = await axios.put(`${API_URL}/api/turmas/${id}`, payload);
        } catch (error: any) {
            context.error = error;
            context.response = error.response;
        }
    }
);

When('eu remover a turma com ID {string}', async function (id: string) {
    try {
        context.response = await axios.delete(`${API_URL}/api/turmas/${id}`);
    } catch (error: any) {
        context.error = error;
        context.response = error.response;
    }
});

When(
    'eu matricular o aluno {string} na turma {string}',
    async function (alunoId: string, turmaId: string) {
        try {
            context.response = await axios.post(
                `${API_URL}/api/turmas/${turmaId}/alunos`,
                { alunoId }
            );
        } catch (error: any) {
            context.error = error;
            context.response = error.response;
        }
    }
);

When(
    'eu registrar avaliação do aluno {string} na turma {string} com os dados:',
    async function (alunoId: string, turmaId: string, dataTable: DataTable) {
        const dados = dataTable.hashes()[0];
        const payload = {
            alunoId,
            meta: dados.meta,
            conceito: dados.conceito,
        };
        try {
            context.response = await axios.put(
                `${API_URL}/api/turmas/${turmaId}/avaliacoes`,
                payload
            );
        } catch (error: any) {
            context.error = error;
            context.response = error.response;
        }
    }
);

// ============================================================================
// Then — verificações
// ============================================================================

Then('a turma retornada deve ter topico {string}', function (topico: string) {
    expect(context.response!.data, 'Turma não encontrada na resposta').to.exist;
    expect(context.response!.data).to.have.property('topico');
    expect(context.response!.data.topico).to.equal(topico);
});

Then('a turma retornada deve ter ano {int}', function (ano: number) {
    expect(context.response!.data, 'Turma não encontrada na resposta').to.exist;
    expect(context.response!.data).to.have.property('ano');
    expect(context.response!.data.ano).to.equal(ano);
});

Then('a turma retornada deve ter semestre {int}', function (semestre: number) {
    expect(context.response!.data, 'Turma não encontrada na resposta').to.exist;
    expect(context.response!.data).to.have.property('semestre');
    expect(context.response!.data.semestre).to.equal(semestre);
});

Then('a turma retornada deve ter lista de alunos vazia', function () {
    expect(context.response!.data, 'Turma não encontrada na resposta').to.exist;
    expect(context.response!.data).to.have.property('alunos');
    expect(context.response!.data.alunos).to.be.an('array').that.is.empty;
});

Then('o corpo da resposta deve conter {int} turmas', function (quantidade: number) {
    expect(context.response!.data, `Esperado array com ${quantidade} turmas`).to.be.an('array');
    expect(context.response!.data).to.have.lengthOf(quantidade);
});

Then('a avaliação retornada deve ter conceito {string}', function (conceito: string) {
    expect(context.response!.data, 'Resposta sem corpo').to.exist;
    expect(context.response!.data).to.have.property('conceito');
    expect(context.response!.data.conceito).to.equal(conceito);
});
