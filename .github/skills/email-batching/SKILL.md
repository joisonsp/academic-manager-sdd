---
name: email-batching
description: Regras obrigatórias para o envio de e-mails de avaliação agrupados (limite de 1 por dia).
---

# Skill: Email Batching (Notificação de Avaliações)

## Objetivo
Implementar o envio de e-mails para alunos garantindo que NUNCA seja enviado mais de 1 e-mail por dia por aluno, independentemente de quantas notas sejam alteradas.

## Procedimento Técnico (Node.js/TypeScript + JSON)
1. Não utilize `nodemailer.sendMail()` diretamente nas rotas de atualização de notas.
2. Utilize um arquivo `server/data/email_log.json` como fila de processamento.
3. Formato esperado no JSON:
{
  "aluno@email.com": {
    "ultimo_envio": "2026-04-21",
    "alteracoes_pendentes": [
      {"meta": "Requisitos", "conceito": "MPA", "turma": "Programação Web"}
    ]
  }
}
4. A rota de avaliação deve apenas dar "push" no array `alteracoes_pendentes`.
5. O envio real do e-mail deve ocorrer por um job/serviço separado que varre o `email_log.json`, envia o resumo e atualiza o `ultimo_envio`.