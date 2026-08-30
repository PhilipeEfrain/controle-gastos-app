# CARD-004: Motor de Cálculo Financeiro Quinzenal e Balanço Global

- **Status**: `BACKLOG`
- **Épico**: Motor de Cálculo
- **Responsável DEV**: dev_agent
- **Branch**: `feat/CARD-004-financial-calculation-engine`

---

## 1. Visão do PM

Garantir que todos os cálculos matemáticos financeiros do aplicativo sejam 100% precisos, tratando frações, arredondamentos e balanceamento automático entre as duas quinzenas do mês.

---

## 2. Especificação do PO

- **Regras Matemáticas**:
  1. **Saldo Quinzena 1 (Dia 31)**:
     $$\text{Saldo Q1} = \text{Renda Q1} - \sum \text{Despesas Q1}$$
  2. **Saldo Quinzena 2 (Dia 15)**:
     $$\text{Saldo Q2} = \text{Renda Q2} - \sum \text{Despesas Q2}$$
  3. **Saldo Geral do Mês**:
     $$\text{Saldo Total} = (\text{Renda Q1} + \text{Renda Q2}) - (\sum \text{Despesas Q1} + \sum \text{Despesas Q2})$$
  4. **Balanço Global de Cobertura**:
     - Se `Saldo Q1 > 0` e `Saldo Q2 < 0`, calcular se o superávit da Q1 cobre o déficit da Q2.
     - Se `Saldo Total < 0`, emitir status de Alerta Vermelho de Déficit Acumulado.

---

## 3. Requisitos de Segurança (SEC)

- [ ] Prevenção de overflow e erros de precisão de ponto flutuante em JavaScript/TypeScript (usar precisão decimal segura).

---

## 4. Especificação de UX/UI

- [ ] Formatação padronizada em Real Brasileiro (`Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`).

---

## 5. Critérios de QA

- [ ] 100% de cobertura de testes unitários para a função de cálculo com casos reais do `Entendimento.md` (Ex: Renda R$ 4.977,79, Gastos R$ 5.242,40, Saldo -R$ 264,61).
