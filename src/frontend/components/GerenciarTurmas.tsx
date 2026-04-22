// src/frontend/components/GerenciarTurmas.tsx

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Aluno } from '../../shared/types/aluno.types.js';
import type { Conceito, Turma } from '../../shared/types/turma.types.js';
import { AlunoService } from '../services/alunoService.js';
import { TurmaService } from '../services/turmaService.js';

// ─── Constantes ───────────────────────────────────────────────────────────────

const METAS: string[] = ['Requisitos', 'Testes', 'UI'];

type SaveStatus = 'saving' | 'saved' | 'error';

// ─── Helpers de estilo ────────────────────────────────────────────────────────

function conceitoSelectClass(conceito: string): string {
  const base =
    'block w-full rounded border px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-2 transition-colors';
  if (conceito === 'MANA') return `${base} bg-green-50 border-green-300 text-green-800 focus:ring-green-400`;
  if (conceito === 'MPA')  return `${base} bg-yellow-50 border-yellow-300 text-yellow-800 focus:ring-yellow-400`;
  if (conceito === 'MA')   return `${base} bg-blue-50 border-blue-300 text-blue-800 focus:ring-blue-400`;
  return `${base} bg-gray-50 border-gray-300 text-gray-500 focus:ring-gray-400`;
}

// ─── Sub-componente: AvaliacaoCell ────────────────────────────────────────────

interface AvaliacaoCellProps {
  turmaId: string;
  alunoId: string;
  meta: string;
  conceitoInicial: Conceito | '';
  onSaved: (alunoId: string, meta: string, conceito: Conceito) => void;
}

const AvaliacaoCell: React.FC<AvaliacaoCellProps> = ({
  turmaId,
  alunoId,
  meta,
  conceitoInicial,
  onSaved,
}) => {
  const [conceito, setConceito] = useState<Conceito | ''>(conceitoInicial);
  const [status, setStatus] = useState<SaveStatus | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setConceito(conceitoInicial);
  }, [conceitoInicial]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novo = e.target.value as Conceito;
    if (!novo) return;

    setConceito(novo);
    setStatus('saving');

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    try {
      await TurmaService.registrarAvaliacao(turmaId, {
        alunoId,
        meta,
        conceito: novo,
      });
      setStatus('saved');
      onSaved(alunoId, meta, novo);
      timeoutRef.current = setTimeout(() => setStatus(null), 1500);
    } catch {
      setConceito(conceitoInicial);
      setStatus('error');
      timeoutRef.current = setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 min-w-[84px]">
      <select
        value={conceito}
        onChange={handleChange}
        disabled={status === 'saving'}
        className={conceitoSelectClass(conceito)}
      >
        {!conceito && (
          <option value="" disabled>
            —
          </option>
        )}
        <option value="MANA">MANA</option>
        <option value="MPA">MPA</option>
        <option value="MA">MA</option>
      </select>
      {status === 'saving' && (
        <span className="text-[10px] text-gray-400 animate-pulse">Salvando…</span>
      )}
      {status === 'saved' && (
        <span className="text-[10px] text-green-600 font-medium">✓ Salvo</span>
      )}
      {status === 'error' && (
        <span className="text-[10px] text-red-500 font-medium">✗ Erro</span>
      )}
    </div>
  );
};

// ─── Sub-componente: TabelaAvaliacoes ─────────────────────────────────────────

interface TabelaAvaliacoesProps {
  turma: Turma;
  alunos: Aluno[];
  onAvaliacaoSalva: (alunoId: string, meta: string, conceito: Conceito) => void;
}

const TabelaAvaliacoes: React.FC<TabelaAvaliacoesProps> = ({
  turma,
  alunos,
  onAvaliacaoSalva,
}) => {
  const alunoMap = new Map(alunos.map((a) => [a.id, a]));

  if (turma.alunos.length === 0) {
    return (
      <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
        Nenhum aluno matriculado. Matricule alunos para registrar avaliações.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left font-semibold text-gray-700 border border-gray-200 min-w-[160px]">
              Aluno
            </th>
            {METAS.map((meta) => (
              <th
                key={meta}
                className="px-4 py-2 text-center font-semibold text-gray-700 border border-gray-200"
              >
                {meta}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {turma.alunos.map((alunoMatriculado) => {
            const aluno = alunoMap.get(alunoMatriculado.alunoId);
            const nomeAluno = aluno?.nome ?? `ID: ${alunoMatriculado.alunoId.slice(0, 8)}…`;

            return (
              <tr key={alunoMatriculado.alunoId} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 font-medium border border-gray-200 whitespace-nowrap">
                  {nomeAluno}
                </td>
                {METAS.map((meta) => {
                  const avAtual = alunoMatriculado.avaliacoes.find(
                    (av) => av.meta === meta
                  );
                  return (
                    <td
                      key={meta}
                      className="px-3 py-2 text-center border border-gray-200"
                    >
                      <AvaliacaoCell
                        turmaId={turma.id}
                        alunoId={alunoMatriculado.alunoId}
                        meta={meta}
                        conceitoInicial={avAtual?.conceito ?? ''}
                        onSaved={onAvaliacaoSalva}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ─── Sub-componente: PainelMatricula ──────────────────────────────────────────

interface PainelMatriculaProps {
  turma: Turma;
  alunos: Aluno[];
  onMatriculado: (turmaAtualizada: Turma) => void;
}

const PainelMatricula: React.FC<PainelMatriculaProps> = ({
  turma,
  alunos,
  onMatriculado,
}) => {
  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [matriculando, setMatriculando] = useState(false);
  const [erro, setErro] = useState('');

  const matriculadosIds = new Set(turma.alunos.map((a) => a.alunoId));
  const disponiveis = alunos.filter((a) => !matriculadosIds.has(a.id));

  const handleMatricular = async () => {
    if (!alunoSelecionado) return;
    setMatriculando(true);
    setErro('');
    try {
      const turmaAtualizada = await TurmaService.matricularAluno(turma.id, alunoSelecionado);
      onMatriculado(turmaAtualizada);
      setAlunoSelecionado('');
    } catch (e: any) {
      setErro(e.message || 'Erro ao matricular aluno.');
    } finally {
      setMatriculando(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-semibold text-gray-700">Matricular Aluno</h4>
      {disponiveis.length === 0 ? (
        <p className="text-xs text-gray-500 italic">
          {alunos.length === 0
            ? 'Nenhum aluno cadastrado no sistema.'
            : 'Todos os alunos já estão matriculados.'}
        </p>
      ) : (
        <div className="flex items-center gap-2">
          <select
            value={alunoSelecionado}
            onChange={(e) => setAlunoSelecionado(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Selecione um aluno…</option>
            {disponiveis.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
          <button
            onClick={handleMatricular}
            disabled={!alunoSelecionado || matriculando}
            className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {matriculando ? 'Matriculando…' : 'Matricular'}
          </button>
        </div>
      )}
      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  );
};

// ─── Componente principal: GerenciarTurmas ────────────────────────────────────

const GerenciarTurmas: React.FC = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [turmaAbertaId, setTurmaAbertaId] = useState<string | null>(null);

  // Form de criação
  const [form, setForm] = useState({
    topico: '',
    ano: new Date().getFullYear(),
    semestre: 1,
  });
  const [criando, setCriando] = useState(false);
  const [formErro, setFormErro] = useState('');
  const [formSucesso, setFormSucesso] = useState('');

  // Carregamento inicial
  const carregar = useCallback(async () => {
    setIsLoading(true);
    setErro('');
    try {
      const [listaTurmas, listaAlunos] = await Promise.all([
        TurmaService.listar(),
        AlunoService.listar(),
      ]);
      setTurmas(listaTurmas);
      setAlunos(listaAlunos);
    } catch (e: any) {
      setErro(e.message || 'Não foi possível carregar os dados.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  // Submit do form de criação
  const handleCriar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCriando(true);
    setFormErro('');
    setFormSucesso('');
    try {
      const nova = await TurmaService.criar({
        topico: form.topico,
        ano: form.ano,
        semestre: form.semestre,
      });
      setTurmas((prev) => [nova, ...prev]);
      setForm({ topico: '', ano: new Date().getFullYear(), semestre: 1 });
      setFormSucesso(`Turma "${nova.topico}" criada com sucesso!`);
    } catch (e: any) {
      setFormErro(e.message || 'Erro ao criar turma.');
    } finally {
      setCriando(false);
    }
  };

  // Excluir turma
  const handleExcluir = async (turma: Turma) => {
    if (!window.confirm(`Deseja realmente excluir a turma "${turma.topico}"?`)) return;
    try {
      await TurmaService.remover(turma.id);
      setTurmas((prev) => prev.filter((t) => t.id !== turma.id));
      if (turmaAbertaId === turma.id) setTurmaAbertaId(null);
    } catch (e: any) {
      setErro(e.message || 'Erro ao excluir turma.');
    }
  };

  // Matrícula feita → atualiza turma local
  const handleMatriculado = (turmaAtualizada: Turma) => {
    setTurmas((prev) =>
      prev.map((t) => (t.id === turmaAtualizada.id ? turmaAtualizada : t))
    );
  };

  // Avaliação salva → atualiza conceito no estado local
  const handleAvaliacaoSalva = (
    turmaId: string,
    alunoId: string,
    meta: string,
    conceito: Conceito
  ) => {
    setTurmas((prev) =>
      prev.map((t) => {
        if (t.id !== turmaId) return t;
        return {
          ...t,
          alunos: t.alunos.map((a) => {
            if (a.alunoId !== alunoId) return a;
            const idx = a.avaliacoes.findIndex((av) => av.meta === meta);
            const novas = [...a.avaliacoes];
            if (idx >= 0) {
              novas[idx] = { meta, conceito };
            } else {
              novas.push({ meta, conceito });
            }
            return { ...a, avaliacoes: novas };
          }),
        };
      })
    );
  };

  const turmaAberta = turmas.find((t) => t.id === turmaAbertaId) ?? null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Form de Criação ───────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Nova Turma</h2>

        {formSucesso && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
            {formSucesso}
          </div>
        )}
        {formErro && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {formErro}
          </div>
        )}

        <form onSubmit={handleCriar} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tópico
            </label>
            <input
              type="text"
              value={form.topico}
              onChange={(e) => setForm((f) => ({ ...f, topico: e.target.value }))}
              placeholder="Ex: Introdução à Programação"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ano
            </label>
            <input
              type="number"
              value={form.ano}
              onChange={(e) => setForm((f) => ({ ...f, ano: Number(e.target.value) }))}
              min={2000}
              max={2100}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semestre
            </label>
            <select
              value={form.semestre}
              onChange={(e) => setForm((f) => ({ ...f, semestre: Number(e.target.value) }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value={1}>1º Semestre</option>
              <option value={2}>2º Semestre</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={criando}
            className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {criando ? 'Criando…' : 'Criar Turma'}
          </button>
        </form>
      </div>

      {/* ── Lista de Turmas ───────────────────────────────────────────── */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Turmas Cadastradas</h2>
          <p className="mt-1 text-sm text-gray-600">
            Clique em uma turma para expandir e gerenciar avaliações.
          </p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center text-gray-500 py-8">Carregando turmas…</div>
          ) : erro ? (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{erro}</div>
          ) : turmas.length === 0 ? (
            <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
              Nenhuma turma cadastrada ainda. Crie uma turma acima.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {turmas.map((turma) => {
                const aberta = turmaAbertaId === turma.id;
                return (
                  <div key={turma.id}>
                    {/* Cabeçalho da turma (clicável) */}
                    <div
                      className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-50 px-2 rounded-md transition-colors"
                      onClick={() =>
                        setTurmaAbertaId((prev) => (prev === turma.id ? null : turma.id))
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm transition-transform ${
                            aberta ? 'rotate-90' : ''
                          }`}
                        >
                          ▶
                        </span>
                        <div>
                          <p className="font-semibold text-gray-900">{turma.topico}</p>
                          <p className="text-xs text-gray-500">
                            {turma.ano} · {turma.semestre}º Semestre ·{' '}
                            <span className="font-medium text-indigo-600">
                              {turma.alunos.length} aluno
                              {turma.alunos.length !== 1 ? 's' : ''}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExcluir(turma);
                        }}
                        className="inline-flex items-center rounded px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 ring-1 ring-inset ring-red-600/20 hover:bg-red-100 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>

                    {/* Painel expandido */}
                    {aberta && turmaAberta && (
                      <div className="mx-2 mb-4 rounded-lg border border-indigo-100 bg-indigo-50/40 p-5 space-y-5">
                        {/* Matricular aluno */}
                        <PainelMatricula
                          turma={turmaAberta}
                          alunos={alunos}
                          onMatriculado={handleMatriculado}
                        />

                        {/* Separador */}
                        <div className="border-t border-indigo-100" />

                        {/* Tabela de avaliações */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Tabela de Avaliações
                            <span className="ml-2 text-xs font-normal text-gray-400">
                              (as notas são salvas automaticamente ao selecionar)
                            </span>
                          </h4>
                          <TabelaAvaliacoes
                            turma={turmaAberta}
                            alunos={alunos}
                            onAvaliacaoSalva={(alunoId, meta, conceito) =>
                              handleAvaliacaoSalva(turma.id, alunoId, meta, conceito)
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GerenciarTurmas;
