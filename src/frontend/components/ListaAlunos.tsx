// src/frontend/components/ListaAlunos.tsx

import React, { useEffect, useState } from 'react';
import { AlunoService } from '../services/alunoService.js';
import type { Aluno } from '../../shared/types/aluno.types.js';

interface ListaAlunosProps {
  refreshKey: number;
  onEditar: (aluno: Aluno) => void;
}

const ListaAlunos: React.FC<ListaAlunosProps> = ({ refreshKey, onEditar }) => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [removendoId, setRemovendoId] = useState<string | null>(null);

  useEffect(() => {
    const carregarAlunos = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const lista = await AlunoService.listar();
        setAlunos(lista);
      } catch (error: any) {
        setErrorMessage(error.message || 'Não foi possível carregar os alunos.');
      } finally {
        setIsLoading(false);
      }
    };

    void carregarAlunos();
  }, [refreshKey]);

  const handleExcluir = async (aluno: Aluno) => {
    if (!window.confirm(`Deseja realmente excluir o aluno "${aluno.nome}"?`)) return;

    setRemovendoId(aluno.id);
    try {
      await AlunoService.remover(aluno.id);
      setAlunos(prev => prev.filter(a => a.id !== aluno.id));
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao excluir aluno.');
    } finally {
      setRemovendoId(null);
    }
  };

  return (
    <section className="max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Lista de Alunos</h2>
          <p className="mt-1 text-sm text-gray-600">
            Veja os alunos cadastrados por nome, CPF e e-mail.
          </p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center text-gray-500">Carregando alunos...</div>
          ) : errorMessage ? (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div>
          ) : alunos.length === 0 ? (
            <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
              Nenhum aluno cadastrado ainda. Cadastre um aluno para ver a tabela aqui.
            </div>
          ) : (
            <div className="-mx-4 overflow-x-auto sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                      CPF
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                      E-mail
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wide text-gray-700 text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {alunos.map((aluno) => (
                    <tr key={aluno.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{aluno.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">{aluno.cpf}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{aluno.email}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEditar(aluno)}
                            className="inline-flex items-center rounded px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 ring-1 ring-inset ring-amber-600/20 hover:bg-amber-100 transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleExcluir(aluno)}
                            disabled={removendoId === aluno.id}
                            className="inline-flex items-center rounded px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 ring-1 ring-inset ring-red-600/20 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {removendoId === aluno.id ? 'Excluindo...' : 'Excluir'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ListaAlunos;
