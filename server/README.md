# Server - Chatbots PDF Reader

API REST do projeto Chatbots PDF Reader.

## 🚀 Tecnologias

- **Node.js** com TypeScript
- **Fastify** - Framework web rápido e eficiente
- **Drizzle ORM** - ORM TypeScript-first
- **PostgreSQL** com pgvector - Banco de dados com suporte a embeddings vetoriais
- **Ollama** - IA para embedding de PDFs, tradução de texto e geração de respostas
- **LangChain** - Text splitters para processamento de PDFs
- **pdf.js** - Extração de texto de PDFs
- **Zod** - Validação de schemas
- **Biome**/**Ultracite** - Linter e formatter

## 📋 Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- npm, yarn ou pnpm
- Ollama instalado localmente

## ⚙️ Setup e Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

### 3. Instalar Ollama e baixar modelos

Faça download do Ollama em [https://ollama.com/](https://ollama.com/) e adicione os modelos:

```bash
ollama pull llama3.1
ollama pull nomic-embed-text
```

> ⚠️ **Nota:** O modelo [llama3.1](https://ollama.com/library/llama3.1) requer mais recursos de hardware. Se enfrentar problemas de desempenho, considere usar o [llama3.2](https://ollama.com/library/llama3.2), uma versão mais leve, porém com capacidades reduzidas. Neste caso, lembre-se de atualizar as variáveis `TRANSLATION_MODEL` e `ANSWER_QUESTION_MODEL` no arquivo `.env` para `llama3.2`.

### 4. Iniciar o banco de dados

Execute o PostgreSQL com Docker:

```bash
docker-compose up -d
```

### 5. Gerar e executar migrations

```bash
npm run db:generate
npm run db:migrate
```

### 6. (Opcional) Popular o banco com dados de exemplo

```bash
npm run db:seed
```

### 7. Iniciar o servidor

Modo desenvolvimento:

```bash
npm run dev
```

Modo produção:

```bash
npm start
```

O servidor estará rodando em `http://localhost:3333`

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento com watch mode
- `npm start` - Inicia o servidor em modo produção
- `npm run db:generate` - Gera migrations baseadas nas mudanças do schema
- `npm run db:migrate` - Executa as migrations pendentes no banco de dados
- `npm run db:seed` - Popula o banco de dados com dados de exemplo

## 🔧 Padrões de Projeto

- **Type-safe API** - Uso de Zod com Fastify para validação de tipos em runtime
- **Snake case** - Convenção de nomenclatura para colunas do banco de dados (via Drizzle)
- **Repository Pattern** - Schemas do Drizzle organizados por entidade na pasta `db/schema/`
- **Service Layer** - Lógica de negócio isolada em services (AI providers, etc.)

## Perguntas

### Por que escolheu os modelos "llama3.1" e "nomic-embed-text"?

O **llama3.1** é um modelo de linguagem poderoso e versátil, ideal para tradução de textos e geração de respostas contextualizadas. O **nomic-embed-text** é especializado em gerar embeddings de alta qualidade para busca semântica, sendo otimizado para textos em inglês e português.

### Qual estratégia de RAG foi implementado?

A implementação segue o padrão clássico de RAG:

1. **Chunking**: O PDF é dividido em chunks menores usando LangChain text splitters
2. **Embedding**: Gera embeddings vetoriais de cada chunk usando o modelo `nomic-embed-text`
3. **Armazenamento**: Os embeddings são salvos no PostgreSQL com extensão pgvector
4. **Retrieval**: Quando uma pergunta é feita:
   - Gera o embedding da pergunta
   - Faz busca de similaridade vetorial no banco
   - Recupera os chunks mais relevantes
5. **Generation**: Envia os chunks relevantes + pergunta para o LLM (`llama3.1`) gerar a resposta contextualizada

### Arquitetura e decisões técnicas?

**Por que Fastify ao invés de NestJS?**

- ✅ **Performance**: Fastify é um dos frameworks Node.js mais rápidos
- ✅ **Simplicidade**: Ideal para APIs pequenas e médias sem complexidade desnecessária
- ✅ **Overhead mínimo**: Setup rápido e bundle menor
- ✅ **Ecossistema**: Plugins maduros e bem mantidos

NestJS seria overkill para este projeto porque adiciona camadas de abstração desnecessárias para um escopo simples. NestJS é mais adequado para projetos corporativos grandes com múltiplos módulos.

**Por que Drizzle ORM?**

- ✅ **Type-safety total** com TypeScript
- ✅ **SQL-like syntax**: Mantém você próximo ao SQL real, ajudando a não esquecer a linguagem
- ✅ **Leve e performático**: Não adiciona overhead como outros ORMs pesados
- ✅ **Migrations simples**: Fácil gerenciamento com Drizzle Kit
- ✅ **Portabilidade**: Facilita mudança entre bancos de dados

A escolha de um ORM acelera o desenvolvimento e aumenta a manutenibilidade do código.

### Quais melhorias posso fazer com mais tempo?

**1. Autenticação JWT** (Impacto: Alto | Complexidade: Média)
- Implementar endpoints de login e cadastro
- Adicionar autenticação com JWT usando `@fastify/jwt`
- Criar tabela `users` e proteger rotas
- Associar chatbots aos usuários logados

**2. Listagem e Gerenciamento de PDFs** (Impacto: Alto | Complexidade: Baixa)
- Modificar endpoint `GET /chatbots/:id` para incluir lista de PDFs enviados
- Criar endpoint `DELETE /chatbots/:id/files/:fileId` para remover PDFs
- Melhorar visualização dos documentos vinculados

**3. Busca Híbrida (Vetorial + Full-Text)** (Impacto: Alto | Complexidade: Alta)
- Combinar busca vetorial (semântica) com busca Full-Text (palavras-chave)
- Ponderação entre busca semântica (70%) e keyword (30%)
- Melhor captura de termos técnicos específicos
- Adicionar índice GIN no PostgreSQL para otimização
  