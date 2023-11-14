FROM node:16-bullseye-slim

RUN mkdir -p /app
WORKDIR /app

COPY package* ./
RUN npm ci

COPY . .

CMD ["node", "app.js"]

