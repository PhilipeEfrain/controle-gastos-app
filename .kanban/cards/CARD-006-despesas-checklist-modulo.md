# CARD-006: Módulo de Lançamento de Gastos e Comprovantes

- **Status**: `BACKLOG`
- **Épico**: Despesas
- **Responsável DEV**: dev_agent
- **Branch**: `feat/CARD-006-despesas-checklist-modulo`

---

## 1. Visão do PM

Permitir a gestão interativa das contas de cada quinzena com checkboxes de pagamento, associação de comprovantes e cadastro de despesas pontuais ou recorrentes.

---

## 2. Especificação do PO

- **Funcionalidades**:
  - Lista de despesas separadas por Quinzena 1 e Quinzena 2.
  - Checkbox interativo para marcar/desmarcar despesa como paga em tempo real no Firestore.
  - Campo numérico para registrar o `codigo_comprovante` (ex: "137") ao dar baixa na conta.
  - Cadastro rápido de novas despesas (descrição, valor, categoria, quinzena, recorrência).
  - Filtro por categoria (Moradia, Cartão, Veículo, Serviços, Outros).

---

## 3. Especificação de UX/UI

- Microinteração de sucesso com feedback tátil/visual ao marcar como pago.
- Modal limpo para inserção de comprovante e cadastro rápido.
