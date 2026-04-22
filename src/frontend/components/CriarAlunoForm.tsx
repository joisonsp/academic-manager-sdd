// src/frontend/components/CriarAlunoForm.tsx

import React, { useEffect, useState } from 'react';
import { CriarAlunoDTO, Aluno } from '../../shared/types/aluno.types.js';
import { AlunoService } from '../services/alunoService.js';

interface CriarAlunoFormProps {
  onSuccess: () => void;
  alunoParaEditar?: Aluno | null;
  onCancelar?: () => void;
}

const CriarAlunoForm: React.FC<CriarAlunoFormProps> = ({
  onSuccess,
  alunoParaEditar,
  onCancelar,
}) => {
  const [formData, setFormData] = useState<CriarAlunoDTO>({
    nome: '',
    cpf: '',
    email: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const modoEdicao = !!alunoParaEditar;

  useEffect(() => {
    if (alunoParaEditar) {
      setFormData({
        nome: alunoParaEditar.nome,
        cpf: alunoParaEditar.cpf,
        email: alunoParaEditar.email,
      });
      setSuccessMessage('');
      setErrorMessage('');
    } else {
      setFormData({ nome: '', cpf: '', email: '' });
      setSuccessMessage('');
      setErrorMessage('');
    }
  }, [alunoParaEditar]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      if (modoEdicao && alunoParaEditar) {
        await AlunoService.atualizar(alunoParaEditar.id, formData);
        setSuccessMessage('Aluno atualizado com sucesso!');
      } else {
        await AlunoService.criar(formData);
        setSuccessMessage('Aluno criado com sucesso!');
        setFormData({ nome: '', cpf: '', email: '' });
      }
      onSuccess();
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelar = () => {
    setFormData({ nome: '', cpf: '', email: '' });
    setSuccessMessage('');
    setErrorMessage('');
    onCancelar?.();
  };

  return (
    <div
      className={`max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md transition-all ${
        modoEdicao ? 'ring-2 ring-amber-400' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {modoEdicao ? 'Editar Aluno' : 'Criar Aluno'}
        </h2>
        {modoEdicao && (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            Editando
          </span>
        )}
      </div>

      {successMessage && (
        <div
          className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded"
          data-testid="success-message"
        >
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div
          className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
          data-testid="error-message"
        >
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
            E-mail
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

        <div className={`flex gap-3 ${modoEdicao ? '' : ''}`}>
          {modoEdicao && (
            <button
              type="button"
              onClick={handleCancelar}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              modoEdicao
                ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
            data-testid="submit-button"
          >
            {isSubmitting
              ? modoEdicao ? 'Atualizando...' : 'Criando...'
              : modoEdicao ? 'Atualizar Aluno' : 'Criar Aluno'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CriarAlunoForm;
