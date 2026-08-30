# CARD-005: Dashboard Web e Android com Cards Quinzenais

- **Status**: `BACKLOG`
- **Épico**: Dashboard & UI
- **Responsável DEV**: dev_agent
- **Branch**: `feat/CARD-005-dashboard-quinzenal`

---

## 1. Visão do PM

Oferecer ao usuário uma visão clara, imediata e intuitiva da sua saúde financeira mensal, destacando imediatamente a situação de cada quinzena e o saldo global.

---

## 2. Especificação do PO

- **Cards de Resumo do Mês**:
  - Renda Total (ex: R$ 4.977,79)
  - Total de Despesas (ex: R$ 5.242,40)
  - Saldo Geral (ex: -R$ 264,61) com badge de alerta se negativo.
- **Visão Dividida por Quinzena**:
  - **Quinzena 1 (Dia 31)**: Entrada, Saídas, Saldo Restante (Verde se positivo).
  - **Quinzena 2 (Dia 15)**: Entrada, Saídas, Saldo Restante (Destaque visual se deficitário).
- Seletor de mês/ano para navegação histórica.

---

## 3. Especificação de UX/UI

- Layout responsivo adaptado para Web e Android.
- Gráfico/Cards com destaque para métricas críticas.
