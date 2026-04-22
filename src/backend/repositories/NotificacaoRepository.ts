// src/backend/repositories/NotificacaoRepository.ts

import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ItemFila, FilaData } from '../../shared/types/notificacao.types.js';

const FILE_PATH = path.join(process.cwd(), 'data', 'notificacoes.json');

const EMPTY_DATA: FilaData = { fila: [] };

export class NotificacaoRepository {
  private async lerArquivo(): Promise<FilaData> {
    try {
      const conteudo = await fs.readFile(FILE_PATH, 'utf-8');
      return JSON.parse(conteudo) as FilaData;
    } catch {
      return { ...EMPTY_DATA };
    }
  }

  private async salvarArquivo(dados: FilaData): Promise<void> {
    await fs.writeFile(FILE_PATH, JSON.stringify(dados, null, 2), 'utf-8');
  }

  async obterFila(): Promise<ItemFila[]> {
    const dados = await this.lerArquivo();
    return dados.fila ?? [];
  }

  async adicionarNaFila(item: Omit<ItemFila, 'id' | 'criadoEm'>): Promise<void> {
    const dados = await this.lerArquivo();
    dados.fila.push({
      ...item,
      id: uuidv4(),
      criadoEm: new Date().toISOString(),
    });
    await this.salvarArquivo(dados);
  }

  async esvaziarFila(): Promise<void> {
    await this.salvarArquivo({ fila: [] });
  }
}
