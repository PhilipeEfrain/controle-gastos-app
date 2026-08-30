# CARD-001: Setup da Estrutura Base do Projeto (React Native + Expo Web & App)

- **Status**: `DONE`
- **Épico**: Fundação do Projeto
- **Responsável DEV**: dev_agent
- **Branch**: `feat/CARD-001-setup-stack-base`
- **Repositório**: `https://github.com/PhilipeEfrain/controle-gastos-app.git`

---

## 1. Visão do PM
Estabelecer a base tecnológica da aplicação utilizando **React Native com Expo** configurado para compilar e rodar perfeitamente em **Web** (navegadores) e **Mobile Android**, com TypeScript, NativeWind (Tailwind CSS) e suporte a testes com Jest.

---

## 2. Especificação do PO (Product Owner)
- **User Story**: Como usuário, quero abrir o aplicativo de controle de gastos quinzenais tanto no navegador do meu computador quanto instalá-lo no meu smartphone Android com a mesma fluidez.
- **Critérios de Aceite**:
  - [x] Projeto inicializado com Expo com suporte a TypeScript.
  - [x] Suporte configurado para Web (`@expo/metro-runtime` e `react-native-web`).
  - [x] Configuração do **NativeWind v2** (Tailwind CSS) para estilização multiplataforma.
  - [x] Configuração do Jest e `@testing-library/react-native` para testes automatizados.
  - [x] Estrutura modular de pastas (`src/components/`, `src/screens/`, `src/hooks/`, `src/services/`, `src/utils/`, `src/types/`).

---

## 3. Requisitos de Segurança (SEC)
- [x] Configurar `.gitignore` para bloquear credenciais e chaves privadas (`.env`, `*.keystore`, `google-services.json`).
- [x] Configurar `expo-secure-store` e suporte a variáveis de ambiente com `EXPO_PUBLIC_`.

---

## 4. Especificação de UX/UI
- [x] Design System base com NativeWind:
  - Suporte a Dark Mode e Light Mode.
  - Tipografia consistente e paleta financeira:
    - 🟢 Entrada/Superávit: `#10B981` (emerald-500)
    - 🔴 Saída/Déficit: `#EF4444` (red-500)
- [x] Suporte a Safe Area Insets (`react-native-safe-area-context`).

---

## 5. Protocolo DEV (Prevenção de Duplicação)
- [x] Consultar `.agents/ARCHITECTURE_MAP.md` antes de criar novos componentes.
- [x] Registrar novos componentes base (`AppCard`, `AppButton`, `BalanceBadge`, `DeficitAlertBanner`, `FortnightCard`) no mapa.

---

## 6. Gates de Validação Pós-Dev
- [x] **QA**: Execução com sucesso do comando de build Web (`npx expo export -p web`) e testes unitários (`npm test` 100% aprovados).
- [x] **SEC**: Varredura de segurança em arquivos e dependências (`.gitignore` validado).
- [x] **UX**: Validação da renderização na Web (`max-w-4xl`) e em dimensões mobile.

