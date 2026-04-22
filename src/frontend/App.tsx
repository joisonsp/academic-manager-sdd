// src/frontend/App.tsx  
  
import React from 'react';  
import CriarAlunoForm from './components/CriarAlunoForm.js';  
  
const App: React.FC = () => {  
  return (  
    <div className="min-h-screen bg-gray-100">  
      <CriarAlunoForm />  
    </div>  
  );  
};  
  
export default App; 
