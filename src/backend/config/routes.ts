// src/backend/config/routes.ts

import { Router } from 'express';
import { AlunoController } from '../controllers/AlunoController.js';

const router = Router();
const controller = new AlunoController();

router.get('/api/alunos', (req, res) => controller.listar(req, res));
router.get('/api/alunos/:id', (req, res) => controller.buscarPorId(req, res));
router.post('/api/alunos', (req, res) => controller.criar(req, res));

export default router;
