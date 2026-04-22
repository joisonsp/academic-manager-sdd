// src/frontend/App.tsx

import React, { useState } from 'react';
import CriarAlunoForm from './components/CriarAlunoForm.js';
import GerenciarTurmas from './components/GerenciarTurmas.js';
import ListaAlunos from './components/ListaAlunos.js';
import type { Aluno } from '../shared/types/aluno.types.js';

type Aba = 'alunos' | 'turmas';

// ─── Tab bar ──────────────────────────────────────────────────────────────────

interface TabBarProps {
  aba: Aba;
  onChange: (aba: Aba) => void;
}

const TabBar: React.FC<TabBarProps> = ({ aba, onChange }) => {
  const tabs: { key: Aba; label: string }[] = [
    { key: 'alunos', label: 'Alunos' },
    { key: 'turmas', label: 'Turmas' },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 h-14">
          <span className="mr-4 text-lg font-bold text-indigo-700 tracking-tight">
            Gestão Acadêmica
          </span>
          <nav className="flex">
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
