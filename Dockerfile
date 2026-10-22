FROM node:24-alpine

ENV NODE_ENV=production

WORKDIR /app

# Primero solo los manifiestos, para aprovechar la caché de capas
# cuando no cambian las dependencias
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# Los ficheros quedan de root y solo de lectura para el proceso
USER node

EXPOSE 8001

CMD ["node", "index.js"]
