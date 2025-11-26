# ================================
# 🔵 Etapa 1 — Builder
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia somente package.json e lock first
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia tudo
COPY . .

# Build da aplicação Next.js
RUN npm run build


# ================================
# 🔵 Etapa 2 — Runner (produção)
# ================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copia somente o build (otimizado)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Instala somente dependências de produção
RUN npm install --omit=dev

# Porta exposta pelo Next.js
EXPOSE 3000

CMD ["npm", "start"]
