# CARD-002: Autenticação Firebase & Regras de Segurança Firestore

- **Status**: `REFINEMENT`
- **Épico**: Fundação e Segurança
- **Responsável DEV**: dev_agent (aguardando fechamento de refinamento)
- **Branch**: `feat/CARD-002-firebase-auth-security-rules`

---

## 1. Visão do PM

Permitir que o usuário realize login seguro via Google Sign-In ou E-mail/Senha, garantindo que suas informações financeiras sejam privadas e inatingíveis por outros usuários.

---

## 2. Especificação do PO

- **Critérios de Aceite**:
  - [ ] Login com Google Sign-In com 1 clique.
  - [ ] Cadastro e login com E-mail e Senha.
  - [ ] Recuperação de senha via e-mail.
  - [ ] Criação automática do documento de usuário em `users/{userId}` no primeiro acesso.
  - [ ] Persistência de sessão segura e logout intuitivo.

---

## 3. Requisitos de Segurança (SEC)

- [ ] Regras do Firestore (`firestore.rules`) com validação estrita:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{userId}/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
  ```
- [ ] Validação de schema no Firestore e inputs sanitizados contra injection.

---

## 4. Especificação de UX/UI

- [ ] Tela de boas-vindas e login minimalista com botão Google padronizado.
- [ ] Formulário de E-mail/Senha com validação em tempo real e feedback claro de erro (ex: senha curta, e-mail inválido).
