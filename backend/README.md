# AIQueFome

Plataforma para comércio de alimentos com recursos de IA, desenvolvida com NestJS, Fastify, Prisma 7, MongoDB e TypeScript.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **Fastify** - HTTP server
- **Prisma 6** - ORM
- **MongoDB** - Banco de dados
- **TypeScript** - Linguagem
- **Zod** - Validação de schemas
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas

## 📋 Pré-requisitos

- Node.js 18+ ou Bun
- MongoDB instalado e rodando
- npm, yarn, pnpm ou bun

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
# ou
bun install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="..."
JWT_SECRET="..."
JWT_EXPIRES_IN="..."
PORT=...
NODE_ENV=development
```

4. Gere o cliente Prisma:

```bash
npm run prisma:generate
# ou
bun run prisma:generate
```

5. Sincronize o banco de dados (opcional, para desenvolvimento):

```bash
npm run prisma:push
# ou
bun run prisma:push
```

## 🏃 Executando a aplicação

```bash
# Desenvolvimento
npm run start:dev
# ou
bun run start:dev

# Produção
npm run build
npm run start:prod
```

A aplicação estará rodando em `http://localhost:3000`

## 🗄️ Banco de Dados

O Prisma está configurado para usar MongoDB. Para visualizar e gerenciar os dados:

```bash
npm run prisma:studio
# ou
bun run prisma:studio
```

## 📝 Scripts Disponíveis

- `npm run build` - Compila o projeto
- `npm run start:dev` - Inicia em modo desenvolvimento
- `npm run start:prod` - Inicia em modo produção
- `npm run prisma:generate` - Gera o cliente Prisma
- `npm run prisma:push` - Sincroniza o schema com o banco (desenvolvimento)
- `npm run prisma:studio` - Abre o Prisma Studio

## 🔒 Segurança

- Senhas são hasheadas com bcrypt (10 rounds)
- JWT tokens para autenticação
- Validação de dados com Zod
- Mensagens de erro em português
- Guards para proteção de rotas

## 🛠️ Estrutura do Projeto

```
src/
├── auth/                    # Módulo de autenticação
│   ├── decorators/          # Decorators (CurrentUser)
│   ├── dto/                 # DTOs com validação Zod
│   ├── guards/              # Guards de autenticação
│   ├── strategies/          # Estratégias Passport
│   ├── auth.controller.ts   # Controller de autenticação
│   ├── auth.service.ts      # Serviço de autenticação
│   └── auth.module.ts       # Módulo de autenticação
├── common/                  # Código compartilhado
│   └── filters/             # Filtros de exceção
├── prisma/                  # Módulo Prisma
│   ├── prisma.service.ts    # Serviço Prisma
│   └── prisma.module.ts     # Módulo Prisma
├── app.module.ts            # Módulo principal
└── main.ts                  # Arquivo de inicialização
prisma/
└── schema.prisma            # Schema do Prisma
```

## ⚠️ Problemas Comuns com Prisma 7

Consulte o arquivo [PRISMA_SETUP.md](./PRISMA_SETUP.md) para soluções de problemas comuns relacionados ao Prisma 7 e MongoDB.

**Dica importante**: Sempre execute `npm run prisma:generate` após alterar o `schema.prisma`.

## 📄 Licença

MIT
