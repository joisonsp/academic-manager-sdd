// src/backend/config/routes.ts

import { Router } from 'express';
import { AlunoController } from '../controllers/AlunoController.js';
import { TurmaController } from '../controllers/TurmaController.js';
import { NotificacaoController } from '../controllers/NotificacaoController.js';

const router = Router();
const alunoController = new AlunoController();
const turmaController = new TurmaController();
const notificacaoController = new NotificacaoController();

// Rotas de Alunos
router.get('/api/alunos', (req, res) => alunoController.listar(req, res));
router.get('/api/alunos/:id', (req, res) => alunoController.buscarPorId(req, res));
router.post('/api/alunos', (req, res) => alunoController.criar(req, res));
router.put('/api/alunos/:id', (req, res) => alunoController.atualizar(req, res));
router.delete('/api/alunos/:id', (req, res) => alunoController.remover(req, res));

// Rotas de Turmas — CRUD
router.get('/api/turmas', (req, res) => turmaController.listar(req, res));
router.get('/api/turmas/:id', (req, res) => turmaController.buscarPorId(req, res));
router.post('/api/turmas', (req, res) => turmaController.criar(req, res));
router.put('/api/turmas/:id', (req, res) => turmaController.atualizar(req, res));
router.delete('/api/turmas/:id', (req, res) => turmaController.remover(req, res));

// Rotas de Turmas — Matrículas e Avaliações
router.post('/api/turmas/:id/alunos', (req, res) => turmaController.matricularAluno(req, res));
router.put('/api/turmas/:id/avaliacoes', (req, res) => turmaController.registrarAvaliacao(req, res));

// Rotas de Notificações
router.post('/api/notificacoes/processar', (req, res) => notificacaoController.processar(req, res));

export default router;
