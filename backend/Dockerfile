FROM node:18-alpine
WORKDIR /app

# Dependencias primero (capas cacheables)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm i --omit=dev

# Código fuente
COPY src ./src

EXPOSE 3000
CMD ["node", "src/index.js"]
