// src/backend/config/routes.ts

import { Router } from 'express';
import { AlunoController } from '../controllers/AlunoController.js';

const router = Router();
const controller = new AlunoController();

router.post('/api/alunos', (req, res) => controller.criar(req, res));

export default router;
