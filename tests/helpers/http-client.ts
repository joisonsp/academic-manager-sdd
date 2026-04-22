// tests/helpers/http-client.ts

/**
 * Cliente HTTP para testes do Cucumber
 * Como a API ainda não existe (TDD - Red Phase), este cliente
 * fará requisições que esperadas falhar (503/conexão recusada)
 */

export interface HttpResponse<T = any> {
  status: number;
  body: T;
}

export class HttpClient {
  private baseUrl: string = 'http://localhost:3000';

  /**
   * POST /api/alunos
   */
  async criarAluno(dados: any): Promise<HttpResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/alunos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      const body = await response.json();
      return {
        status: response.status,
        body,
      };
    } catch (erro) {
      // Esperado falhar na fase RED (API não existe)
      return {
        status: 503,
        body: { erro: 'Serviço indisponível' },
      };
    }
  }

  /**
   * GET /api/alunos
   */
  async listarAlunos(): Promise<HttpResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/alunos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const body = await response.json();
      return {
        status: response.status,
        body,
      };
    } catch (erro) {
      return {
        status: 503,
        body: { erro: 'Serviço indisponível' },
      };
    }
  }

  /**
   * GET /api/alunos/:id
   */
  async obterAluno(id: string): Promise<HttpResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/alunos/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const body = await response.json();
      return {
        status: response.status,
        body,
      };
    } catch (erro) {
      return {
        status: 503,
        body: { erro: 'Serviço indisponível' },
      };
    }
  }

  /**
   * PUT /api/alunos/:id
   */
  async atualizarAluno(id: string, dados: any): Promise<HttpResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/alunos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      const body = await response.json();
      return {
        status: response.status,
        body,
      };
    } catch (erro) {
      return {
        status: 503,
        body: { erro: 'Serviço indisponível' },
      };
    }
  }

  /**
   * DELETE /api/alunos/:id
   */
  async removerAluno(id: string): Promise<HttpResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/alunos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const body = response.status === 204 ? {} : await response.json();
      return {
        status: response.status,
        body,
      };
    } catch (erro) {
      return {
        status: 503,
        body: { erro: 'Serviço indisponível' },
      };
    }
  }
}

export const httpClient = new HttpClient();
