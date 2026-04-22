// src/frontend/App.tsx

import React, { useState } from 'react';
import CriarAlunoForm from './components/CriarAlunoForm.js';
import GerenciarTurmas from './components/GerenciarTurmas.js';
import ListaAlunos from './components/ListaAlunos.js';
import type { Aluno } from '../shared/types/aluno.types.js';
import { NotificacaoService } from './services/notificacaoService.js';

type Aba = 'alunos' | 'turmas';

// ─── Tab bar ──────────────────────────────────────────────────────────────────

interface TabBarProps {
  aba: Aba;
  onChange: (aba: Aba) => void;
}

const TabBar: React.FC<TabBarProps> = ({ aba, onChange }) => {
  const [processando, setProcessando] = useState(false);

  const tabs: { key: Aba; label: string }[] = [
    { key: 'alunos', label: 'Alunos' },
    { key: 'turmas', label: 'Turmas' },
  ];

  const handleProcessarEmails = async (): Promise<void> => {
    setProcessando(true);
    try {
      const resultado = await NotificacaoService.processarBatch();
      if ('totalEnvios' in resultado) {
        window.alert(
          `✅ ${resultado.totalEnvios} e-mail(s) consolidado(s) enviado(s)!\nVerifique o console do backend para os detalhes.`
        );
      } else {
        window.alert('📭 Nenhuma notificação pendente.');
      }
    } catch {
      window.alert('❌ Erro ao processar notificações. Verifique se o servidor está rodando.');
    } finally {
      setProcessando(false);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 h-14">
          <span className="mr-4 text-lg font-bold text-indigo-700 tracking-tight">
            Gestão Acadêmica
          </span>
          <nav className="flex flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onChange(tab.key)}
                className={`px-5 py-2 text-sm font-medium rounded-t-md transition-colors focus:outline-none ${
                  aba === tab.key
                    ? 'text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <button
            onClick={handleProcessarEmails}
            disabled={processando}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {processando ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Processando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Simular Virada do Dia (Processar E-mails)
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  const [aba, setAba] = useState<Aba>('alunos');
  const [refreshKey, setRefreshKey] = useState(0);
  const [alunoParaEditar, setAlunoParaEditar] = useState<Aluno | null>(null);

  const handleAlunoSuccess = (): void => {
    setAlunoParaEditar(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEditar = (aluno: Aluno): void => {
    setAlunoParaEditar(aluno);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelar = (): void => {
    setAlunoParaEditar(null);
  };

  const handleAbaChange = (novaAba: Aba): void => {
    setAlunoParaEditar(null);
    setAba(novaAba);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TabBar aba={aba} onChange={handleAbaChange} />

      {aba === 'alunos' && (
        <main>
          <CriarAlunoForm
            onSuccess={handleAlunoSuccess}
            alunoParaEditar={alunoParaEditar}
            onCancelar={handleCancelar}
          />
          <ListaAlunos refreshKey={refreshKey} onEditar={handleEditar} />
        </main>
      )}

      {aba === 'turmas' && (
        <main>
          <GerenciarTurmas />
        </main>
      )}
    </div>
  );
};

export default App;
