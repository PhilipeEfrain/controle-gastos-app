Com base na análise da sua planilha, o seu aplicativo será um **Gerenciador Financeiro Pessoal focado em Orçamento Quinzenal e Controle de Tributos/Contas Recorrentes**.

A estrutura da tabela indica que você organiza seu orçamento de forma **quinzenal** (dividido entre pagamentos do **Dia 31** e do **Dia 15**) e mantém um controle separado para **impostos/taxas anuais parceladas** (como IPTU, IPVA, Licenciamento e Bombeiros).-----### 1\. Arquitetura de Dados no Firebase (Cloud Firestore)Para estruturar essas informações no **Firebase**, a melhor abordagem NoSQL seria vincular todos os dados ao ID do usuário autenticado (`userId`).#### Coleções Principais:1. **`users/{userId}`**

      * Guardará as informações do usuário (nome, e-mail, foto, preferências).

2.  **`users/{userId}/ciclos_mensais/{mesAno}`** (Exemplo de ID do documento: `2025-03`)
    - **`renda_quinzena_1`**: R$ 2.588,51 _(Referente ao Dia 31)_
    - **`renda_quinzena_2`**: R$ 2.389,28 _(Referente ao Dia 15)_
    - **`total_renda`**: R$ 4.977,79
    - **`total_gastos`**: R$ 5.242,40
    - **`saldo_final`**: -R$ 264,61

3.  **`users/{userId}/ciclos_mensais/{mesAno}/despesas`** (Subcoleção de lançamentos)
    - Cada item possui:
    - `descricao`: ex: "Casa - Débito Alt", "Cartão", "Energia Solar", "Fies"
    - `valor`: ex: 1200.00
    - `quinzena`: 1 (Dia 31) ou 2 (Dia 15)
    - `status_pagamento`: `true` / `false`
    - `codigo_comprovante`: ex: "137" _(código numérico usado na planilha para identificar a conta/comprovante de pagamento)_
    - `categoria`: Moradia, Cartão de Crédito, Veículo, Serviços, etc.

4.  **`users/{userId}/tributos_e_parcelas`** (Coleção de tributos/contas de longo prazo)
    - `titulo`: ex: "IPTU 2025", "IPVA 2025 - Licenciamento", "Bombeiros"
    - `data_vencimento`: ex: `2025-04-10`
    - `valor_orcado`: ex: R$ 92,25
    - `valor_pago`: ex: R$ 136,95
    - `status`: "Pendente" ou "Pago"-----### 2\. Estrutura e Funcionalidades do Aplicativo (Web & Android)#### A. Autenticação (Firebase Auth) \* Tela de Login/Cadastro com e-mail/senha ou Google Sign-In.

- Segurança de dados garantida por **Firebase Security Rules** (cada usuário acessa estritamente seus próprios dados).#### B. Dashboard Principal (Visão Geral do Mês) \* **Cards de Resumo:**
  - **Renda Total:** R$ 4.977,79
  - **Total de Despesas:** R$ 5.242,40
  - **Saldo Geral:** -R$ 264,61 _(com alerta visual indicando saldo negativo)_
- **Visão Dividida por Quinzena:**
  - **Quinzena 1 (Dia 31):** Entrada R$ 2.588,51 | Saídas R$ 2.059,19 | **Saldo Restante:** R$ 529,32
  - **Quinzena 2 (Dia 15):** Entrada R$ 2.389,28 | Saídas R$ 3.183,21 | **Saldo Restante:** -R$ 793,93 _(Destaque para indicar déficit na 2ª quinzena)_#### C. Módulo de Lançamento de Gastos Quinzenais * Lista interativa por quinzena com caixa de seleção (*checkbox\*) para marcar despesas como pagas.
- Ao marcar como pago, o app permite registrar o código/comprovante de pagamento (como o código `137` anotado na tabela).
- Opção para adicionar despesas pontuais ou recorrentes (ex: _Internet R$ 150,00_, _Mãe R$ 250,00_, _Energia R$ 90,70_).#### D. Módulo de Tributos e Impostos Anuais (IPTU / IPVA) \* Controle dedicado para contas parceladas e impostos sazonais com data fixa de vencimento.
- Comparativo entre **Valor Previsto** x **Valor Pago** (por exemplo, na tabela o licenciamento do IPVA previa R$ 92,25 e o pagamento registrado foi de R$ 136,95).#### E. Notificações e Alertas (Firebase Cloud Messaging) \* Lembretes push no Android e notificações na Web para contas próximas da data de vencimento (ex: vencimento em 10/04/2025).-----### 3\. Regras de Negócio e Cálculos Automáticos do App1. **Cálculo de Saldo Quinzenal:**  
  $$\\text{Saldo Restante Quinzena} = \\text{Renda Quinzena} - \\sum \\text{Despesas da Quinzena}$$

2.  **Cálculo de Balanceamento Global:**  
    Calcula se o saldo positivo da Quinzena 1 cobre o déficit da Quinzena 2, alertando o usuário caso o saldo acumulado feche no vermelho (como o saldo atual de -R$ 264,61).
3.  **Status do Pagamento:**  
    Alteração em tempo real do status da conta no Firebase Cloud Firestore, atualizando a interface web e mobile instantaneamente.
