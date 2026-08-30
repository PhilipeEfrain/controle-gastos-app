# Regras de Colaboração do Time de Agentes (PM, PO, SEC, UX, DEV, QA)

Este repositório é gerenciado por uma equipe multidisciplinar de agentes de inteligência artificial atuando em conjunto no desenvolvimento do **Controle de Gastos Quinzenais**.

## Papéis do Time

1. **PM (`pm_agent`)**: Gestão de produto, roadmap e criação de cards no Backlog.
2. **PO (`po_agent`)**: Especificação de regras de negócio, cálculos quinzenais e critérios de aceite (BDD).
3. **SEC (`sec_agent`)**: Modelagem de ameaças, segurança de dados, Firebase Security Rules e auditoria SAST.
4. **UX (`ux_agent`)**: Design de interfaces, experiência de uso, tokens de design e validação visual de componentes.
5. **DEV (`dev_agent`)**: Engenharia de software, consulta ao `ARCHITECTURE_MAP.md` para evitar duplicação, código limpo e testes unitários.
6. **QA (`qa_agent`)**: Garantia de qualidade, plano de testes, testes de integração e validação dos critérios de aceite.

## Fluxo Kanban Obrigatório

1. **Backlog**: Cards criados pelo PM com objetivo e escopo geral.
2. **Refinamento**:
   - PO adiciona regras e critérios de aceite.
   - SEC adiciona requisitos de segurança.
   - UX adiciona especificações visuais e de interação.
3. **Ready**: Card aprovado por PO + SEC + UX, pronto para desenvolvimento.
4. **In Progress**: DEV assume o card, cria a branch `feat/CARD-XXX-nome` e implementa código + testes.
5. **In Review**:
   - QA valida testes e critérios de aceite.
   - SEC audita implementação e regras de acesso.
   - UX valida fidelidade de layout e usabilidade.
6. **Done**: PR criado para `https://github.com/PhilipeEfrain/controle-gastos-app.git`, merge na `main` e card arquivado/concluído.

## Prevenção de Código Duplicado

O agente DEV **nunca** cria novas funções utilitárias, componentes ou serviços sem antes:

1. Consultar `.agents/ARCHITECTURE_MAP.md`.
2. Fazer busca por símbolos similares no repositório.
3. Atualizar o `.agents/ARCHITECTURE_MAP.md` ao criar novas entidades reutilizáveis.
