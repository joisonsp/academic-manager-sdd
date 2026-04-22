// src/backend/server.ts

import express from 'express';
import routes from './config/routes.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use(routes);

// Start server
const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API rodando em http://localhost:${PORT}`);
});
