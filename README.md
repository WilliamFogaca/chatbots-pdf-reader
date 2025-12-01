# Chatbots para leitura de PDFs

Uma aplicação que permite criar chatbots onde é possível enviar PDFs e fazer perguntas sobre o PDF. As respostas são geradas automaticamente pelo Ollama AI com base nos PDFs enviados.

## 🛠️ Ferramentas de Desenvolvimento

Este projeto foi desenvolvido utilizando:
- **VS Code** como IDE principal
- **GitHub Copilot** para assistência de código com IA

## 📁 Estrutura do Projeto

Este projeto é composto por duas aplicações:

- **[server/](./server/README.md)** - API REST desenvolvida com Node.js, Fastify e PostgreSQL
- **[web/](./web/README.md)** - Interface web desenvolvida com Next.js

> ⚠️ **Importante**: Cada aplicação (`server/` e `web/`) possui suas próprias configurações de Biome.js. Para garantir o funcionamento correto das ferramentas de linting e formatação, **abra cada projeto separadamente no VS Code** (e não a pasta raiz). Isso permite que o Biome utilize as configurações específicas de cada projeto.

## 🚀 Quick Start

1. Clone o repositório:
```bash
git clone https://github.com/WilliamFogaca/chatbots-pdf-reader.git
cd chatbots-pdf-reader
```

2. Siga as instruções de configuração de cada aplicação:
   - [Configuração do Backend](./server/README.md)
   - [Configuração do Frontend](./web/README.md)

## Perguntas
   - [Perguntas do Backend](./server/README.md#perguntas)
   - [Perguntas do Frontend](./web/README.md#perguntas)
