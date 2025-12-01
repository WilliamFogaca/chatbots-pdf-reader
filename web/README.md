# Web - Chatbots PDF Reader

Interface web do projeto Chatbots PDF Reader.

## 🚀 Tecnologias

- **Next.js 16** com React 19 e TypeScript
- **TanStack Query** - Gerenciamento de estado assíncrono
- **Tailwind CSS 4** - Estilização
- **shadcn/ui** - Componentes de UI (Radix UI + Tailwind)
- **Lucide React** - Ícones
- **React Hook Form** + **Zod** - Formulários e validação
- **dayjs** - Datas
- **@hookform/resolvers** - Integração de validação
- **Biome**/**Ultracite** - Linter e formatter

## 📋 Pré-requisitos

- Node.js 20+
- npm, yarn ou pnpm
- Backend rodando em `http://localhost:3333`

## ⚙️ Setup e Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento Next.js
- `npm run build` - Gera build de produção
- `npm run start` - Inicia o servidor de produção (serve o build gerado)

## 🔧 Padrões de Projeto

- **Component composition** - Componentes reutilizáveis com shadcn/ui
- **Query invalidation** - Gerenciamento automático de cache com TanStack Query
- **Hooks para requisições** - Separação dos hooks de acesso à API REST na pasta `http/`
- **Formulários tipados** - Uso de React Hook Form + Zod para validação
- **App Router** - Uso do App Router do Next.js para roteamento

## Perguntas

### Arquitetura e decisões técnicas?

**Por que Next.js 16 com App Router?**

- ✅ **App Router**: Uso da arquitetura mais moderna do Next.js com Server Components e melhor performance
- ✅ **React 19**: Aproveitamento dos recursos mais recentes do React
- ✅ **Renderização híbrida**: Possibilidade de usar SSR, SSG e CSR conforme necessário

**Por que TanStack Query (React Query)?**

- ✅ **Gerenciamento de estado**: Simplifica o gerenciamento de estado assíncrono
- ✅ **Cache inteligente**: Sistema automático de cache e invalidação de queries
- ✅ **Developer Experience**: Reduz boilerplate e facilita lidar com loading/error states
- ✅ **Otimizações**: Refetch automático, retry, deduplicação de requisições

**Por que shadcn/ui?**

- ✅ **Componentes customizáveis**: Você possui o código dos componentes (copy/paste)
- ✅ **Design system consistente**: Baseado em Radix UI + Tailwind CSS
- ✅ **Produtividade**: Acelera o desenvolvimento sem sacrificar flexibilidade
- ✅ **Type-safe**: Totalmente tipado com TypeScript
- ✅ **Acessibilidade**: Componentes acessíveis por padrão via Radix UI

### Quais melhorias posso fazer com mais tempo?

**1. Sistema de Login e Cadastro** (Impacto: Alto | Complexidade: Média)
- Implementar páginas de login e cadastro
- Integrar com endpoints de autenticação do backend
- Gerenciar tokens JWT no localStorage ou cookies
- Adicionar proteção de rotas e redirecionamentos

**2. Visualização e Gerenciamento de PDFs** (Impacto: Alto | Complexidade: Baixa)
- Exibir lista de PDFs enviados em cada chatbot
- Adicionar botão para remover PDFs individualmente
- Mostrar metadados dos arquivos (nome, tamanho, data de upload)
- Melhorar feedback visual do upload

**3. Busca e Filtro de Chatbots** (Impacto: Médio | Complexidade: Baixa)
- Adicionar campo de busca na listagem de chatbots
- Implementar filtro por título do chatbot
- Adicionar debounce para otimizar performance
- Opcionalmente: filtros por data de criação ou quantidade de PDFs

**4. Testes End-to-End (E2E)** (Impacto: Alto | Complexidade: Média)
- Implementar testes E2E com **Playwright**
- Testar fluxos completos: criar chatbot → upload PDF → fazer perguntas
- Cobrir casos de sucesso e erro
- Integrar com CI/CD para rodar testes automaticamente
