# Mapa de Arquitetura - React Native com Expo (App & Web)

> **ATENÇÃO DEV**: Antes de criar qualquer novo componente, hook, função utilitária ou serviço, verifique este catálogo para reutilizar o que já foi desenvolvido. Ao criar um novo artefato reutilizável, registre-o aqui imediatamente.
> **Stack Oficial**: React Native, Expo SDK, TypeScript, NativeWind (Tailwind CSS), Firebase JS SDK, Jest + React Native Testing Library.

---

## 1. Utilitários e Helpers (`src/utils/`)

| Nome | Arquivo | Descrição | Parâmetros / Retorno |
| :--- | :--- | :--- | :--- |
| `formatBRL` | `src/utils/formatters.ts` | Formata números para moeda brasileira (`R$ 1.234,56`). | `(value: number): string` |
| `parseBRL` | `src/utils/formatters.ts` | Converte string formatada em BRL de volta para número float. | `(formatted: string): number` |
| `calculateFortnightBalance` | `src/utils/calculations.ts` | Calcula o saldo da quinzena (Renda - Soma de Despesas). | `(income: number, expenses: Expense[]): number` |
| `calculateGlobalBalance` | `src/utils/calculations.ts` | Calcula balanço global do mês e identifica déficit entre quinzenas. | `(q1: FortnightData, q2: FortnightData): MonthBalanceSummary` |
| `getFortnightFromDay` | `src/utils/date.ts` | Identifica se a data pertence à Quinzena 1 (Dia 31/1º período) ou Quinzena 2 (Dia 15). | `(date: Date): 1 \| 2` |

---

## 2. Modelos e Tipos TypeScript (`src/types/`)

| Tipo / Interface | Arquivo | Descrição |
| :--- | :--- | :--- |
| `UserProfile` | `src/types/user.ts` | Modelo de dados do usuário autenticado no Firebase. |
| `MonthlyCycle` | `src/types/finance.ts` | Modelo de ciclo mensal com renda Q1/Q2, totais e saldos. |
| `Expense` | `src/types/finance.ts` | Modelo de despesa (valor, quinzena, status_pagamento, codigo_comprovante, categoria, recorrente). |
| `AnnualTax` | `src/types/finance.ts` | Modelo de tributo/parcelamento anual (IPTU, IPVA, valor_orcado, valor_pago, vencimento). |

---

## 3. Serviços e Acesso a Dados Firebase (`src/services/`)

| Serviço / Função | Arquivo | Descrição |
| :--- | :--- | :--- |
| `firebaseConfig` | `src/services/firebaseConfig.ts` | Inicialização universal do Firebase (Web + React Native AsyncStorage). |
| `authService` | `src/services/auth.ts` | Login com Google, E-mail/Senha, Logout e `onAuthStateChanged`. |
| `monthlyCycleService` | `src/services/monthlyCycle.ts` | CRUD e listeners em tempo real para `users/{userId}/ciclos_mensais/{mesAno}`. |
| `expenseService` | `src/services/expenses.ts` | CRUD e alternância do status de pagamento com comprovante em `despesas`. |
| `taxService` | `src/services/taxes.ts` | CRUD e acompanhamento de tributos em `users/{userId}/tributos_e_parcelas`. |

---

## 4. Componentes UI React Native / NativeWind (`src/components/`)

| Componente | Arquivo | Descrição |
| :--- | :--- | :--- |
| `AppCard` | `src/components/ui/AppCard.tsx` | Contêiner padrão em `View` com suporte a Tailwind e bordas arredondadas. |
| `BalanceBadge` | `src/components/ui/BalanceBadge.tsx` | Badge colorido automático (Verde = positivo / Vermelho = negativo). |
| `DeficitAlertBanner` | `src/components/ui/DeficitAlertBanner.tsx` | Banner de alerta destacado quando há déficit na 2ª quinzena ou saldo global negativo. |
| `FortnightCard` | `src/components/finance/FortnightCard.tsx` | Card de resumo da Quinzena (Entrada, Saídas, Saldo Restante). |
| `ExpenseItemRow` | `src/components/finance/ExpenseItemRow.tsx` | Linha de despesa com checkbox interativo, valor, categoria e modal de código de comprovante. |
| `TaxComparisonCard` | `src/components/finance/TaxComparisonCard.tsx` | Card comparativo de tributos (Previsto vs Pago vs Vencimento). |
| `AuthScreen` | `src/screens/AuthScreen.tsx` | Tela de autenticação responsiva com abas Login e Cadastro e validação de erros. |

---

## 5. Hooks Customizados (`src/hooks/`)

| Hook | Arquivo | Descrição |
| :--- | :--- | :--- |
| `useAuth` | `src/hooks/useAuth.tsx` | Fornece usuário autenticado, estado de loading e funções de login/logout. |
| `useMonthlyCycle` | `src/hooks/useMonthlyCycle.ts` | Escuta e sincroniza o ciclo mensal e despesas do mês selecionado em tempo real. |
| `useTaxes` | `src/hooks/useTaxes.ts` | Escuta os tributos e parcelas cadastrados para o usuário. |
| `useResponsive` | `src/hooks/useResponsive.ts` | Auxilia na diferenciação de breakpoints entre Web Desktop, Tablet e Mobile. |

---

## 6. Segurança e Regras de Acesso

| Artefato | Arquivo | Descrição |
| :--- | :--- | :--- |
| `Firestore Security Rules` | `firestore.rules` | Regras com isolamento de leitura e escrita estrita por `request.auth.uid == userId`. |
