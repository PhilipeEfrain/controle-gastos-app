# CARD-003: Modelagem de Dados NoSQL Firestore por `userId`

- **Status**: `REFINEMENT`
- **Épico**: Motor de Dados
- **Responsável DEV**: dev_agent (aguardando fechamento de refinamento)
- **Branch**: `feat/CARD-003-data-schema-firestore`

---

## 1. Visão do PM

Estruturar o banco NoSQL Cloud Firestore exatamente conforme detalhado no `Entendimento.md`, permitindo controle quinzenal por ciclos mensais (`ciclos_mensais/{mesAno}`) e controle de tributos anuais (`tributos_e_parcelas`).

---

## 2. Especificação do PO

- **Coleções**:
  1. `users/{userId}`: Perfil básico do usuário.
  2. `users/{userId}/ciclos_mensais/{mesAno}` (ex: `2025-03`):
     - `renda_quinzena_1`: number (referente ao Dia 31)
     - `renda_quinzena_2`: number (referente ao Dia 15)
     - `total_renda`: number
     - `total_gastos`: number
     - `saldo_final`: number
  3. `users/{userId}/ciclos_mensais/{mesAno}/despesas`:
     - `descricao`: string (ex: "Casa - Débito Alt", "Energia Solar")
     - `valor`: number
     - `quinzena`: 1 | 2
     - `status_pagamento`: boolean
     - `codigo_comprovante`: string (ex: "137")
     - `categoria`: string
     - `recorrente`: boolean
  4. `users/{userId}/tributos_e_parcelas`:
     - `titulo`: string (ex: "IPTU 2025", "IPVA 2025 - Licenciamento")
     - `data_vencimento`: timestamp / string YYYY-MM-DD
     - `valor_orcado`: number
     - `valor_pago`: number
     - `status`: "Pendente" | "Pago"

---

## 3. Requisitos de Segurança (SEC)

- [ ] Validação de tipos em camada de serviço TypeScript.
- [ ] Validações de valores numéricos estritamente não-negativos para despesas e tributos orçados.

---

## 4. Especificação de UX/UI

- [ ] Indicadores de sincronização em tempo real (online/offline indicator).
