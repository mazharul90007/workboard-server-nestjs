FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000


CMD [ "node", "dist/src/main" ]