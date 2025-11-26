# 🎮 MyGameList — Frontend Development

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Next.js](https://img.shields.io/badge/Next.js-Latest-blue)
![React](https://img.shields.io/badge/React-Latest-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Visão Geral

**MyGameList** é uma aplicação web que permite aos usuários **avaliar jogos** através de um sistema de **Upvote/Downvote**, gerando um **ranking dinâmico** dos títulos mais populares.

> 🔸 Este repositório contém **apenas o código do Frontend** da aplicação.

O foco deste módulo é entregar uma interface **rápida, reativa e intuitiva**, consumindo a API do Backend (a ser desenvolvida) para exibir rankings, gerenciar contas e processar votos em tempo real.

---

## 🧩 Objetivo do Frontend

- Construir uma interface moderna, fluida e modular.
- Integrar com a API REST do backend (em desenvolvimento).
- Gerenciar autenticação, perfis e preferências do usuário.
- Exibir listas de jogos com sistema de votação dinâmico.
- Garantir compatibilidade total entre desktop e mobile.

---

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia | Versão | Observações |
| :--- | :--- | :---: | :--- |
| **Framework** | [Next.js](https://nextjs.org/) | Latest | Utiliza **Pages Router** com suporte a SSR. |
| **Biblioteca UI** | [React](https://react.dev/) | Latest | Base para todos os componentes e hooks. |
| **Estilização** | [SASS (SCSS)](https://sass-lang.com/) | Latest | Estilos modulares e reutilizáveis com variáveis e mixins. |
| **Linguagem** | JavaScript (ES6+) | — | Desenvolvimento em JavaScript puro (sem TypeScript). |

---

## 📁 Estrutura de Diretórios

A estrutura inicial segue uma arquitetura **baseada em componentes**, separando responsabilidades de páginas, UI e estilos globais.

```bash
mygamelist-frontend/
├── src/
│   ├── components/        # Componentes reutilizáveis (Layout, UI, Forms)
│   ├── pages/             # Rotas da aplicação (Login, Cadastro, Home, etc.)
│   │   ├── _app.js        # Ponto de entrada da aplicação (importação global de estilos)
│   │   ├── index.js       # Tela inicial (Top 5 Jogos)
│   │   ├── login.js       # Tela de autenticação
│   │   └── signup.js      # Tela de cadastro
│   └── styles/
│       ├── globals.scss   # Estilos globais (reset, base)
│       └── _variables.scss# Variáveis e mixins (cores, tipografia)
├── public/                # Assets estáticos (imagens, ícones, etc.)
├── package.json           # Dependências e scripts
└── next.config.js         # Configuração do Next.js
```

---

## 🖥️ Telas Planejadas

| Tela | Rota | Descrição | Status |
| :--- | :--- | :--- | :---: |
| **Home** | `/` | Exibe o Top 5 jogos mais votados. | 🧱 Setup Inicial |
| **Login** | `/login` | Autenticação de usuários existentes. | 🧱 Setup Inicial |
| **Cadastro** | `/signup` | Criação de novas contas de usuário. | 🧱 Setup Inicial |
| **Listagem** | `/games` | Lista completa de jogos para votação. | 🕓 Planejada |
| **Perfil** | `/profile/settings` | Configurações e detalhes do perfil. | 🕓 Planejada |

---

## ⚙️ Como Executar Localmente

Siga os passos abaixo para rodar o projeto em ambiente de desenvolvimento:

### 1. Pré-requisitos
Certifique-se de ter instalado:
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**

### 2. Clonar o Repositório
```bash
git clone [URL_DO_SEU_REPOSITORIO]
cd mygamelist-frontend
```

### 3. Instalar Dependências
```bash
# Usando npm
npm install

# ou usando yarn
yarn install
```

### 4. Iniciar o Servidor de Desenvolvimento
```bash
# Usando npm
npm run dev

# ou usando yarn
yarn dev
```

> O projeto estará disponível em: **http://localhost:3000**

---

> 💡 **Padrão sugerido de branches:**  
> - `feat/` → novas funcionalidades  
> - `fix/` → correções de bugs  
> - `refactor/` → melhorias de código  
> - `docs/` → alterações na documentação  

---

## 📜 Licença

Este projeto está licenciado sob a **MIT License** — consulte o arquivo `LICENSE` para mais detalhes.

---

##👥 Equipe

- Scrum Master: Laís
- SRE: Italo
- QA: Karina
- Dev Back-end: Ruan
- Dev Front-end: Roberto

