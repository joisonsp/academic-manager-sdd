// src/frontend/App.tsx

import React, { useState } from 'react';
import CriarAlunoForm from './components/CriarAlunoForm.js';
import ListaAlunos from './components/ListaAlunos.js';
import type { Aluno } from '../shared/types/aluno.types.js';

const App: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [alunoParaEditar, setAlunoParaEditar] = useState<Aluno | null>(null);

  const handleSuccess = (): void => {
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CriarAlunoForm
          onSuccess={handleSuccess}
          alunoParaEditar={alunoParaEditar}
          onCancelar={handleCancelar}
        />
        <ListaAlunos refreshKey={refreshKey} onEditar={handleEditar} />
      </div>
    </div>
  );
};

export default App;
