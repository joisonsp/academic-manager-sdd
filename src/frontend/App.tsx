// src/frontend/App.tsx  
  
import React, { useState } from 'react';
import CriarAlunoForm from './components/CriarAlunoForm.js';
import ListaAlunos from './components/ListaAlunos.js';

const App: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAlunoCriado = (): void => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CriarAlunoForm onSuccess={handleAlunoCriado} />
        <ListaAlunos refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default App; 
