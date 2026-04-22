// src/frontend/components/CriarAlunoForm.tsx  
  
import React, { useState } from 'react';  
import { CriarAlunoDTO } from '../../shared/types/aluno.types.js';  
import { AlunoService } from '../services/alunoService.js'; 
  
const CriarAlunoForm: React.FC = () => {  
  const [formData, setFormData] = useState<CriarAlunoDTO>({  
    nome: '',  
    cpf: '',  
    email: '',  
  });  
  
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [successMessage, setSuccessMessage] = useState('');  
  const [errorMessage, setErrorMessage] = useState(''); 
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    const { name, value } = e.target;  
    setFormData(prev => ({  
      ...prev,  
      [name]: value,  
    }));  
  }; 
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await AlunoService.criar(formData);
      setSuccessMessage('Aluno criado com sucesso!');
      setFormData({ nome: '', cpf: '', email: '' });
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Criar Aluno</h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded" data-testid="success-message">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded" data-testid="error-message">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            data-testid="nome-input"
          />
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            data-testid="cpf-input"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            data-testid="email-input"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="submit-button"
        >
          {isSubmitting ? 'Criando...' : 'Criar Aluno'}
        </button>
      </form>
    </div>
  );
};

export default CriarAlunoForm; 
