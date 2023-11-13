FROM node:16-bullseye-slim

RUN mkdir -p /app
WORKDIR /app

COPY package* ./
RUN npm ci

COPY app.js ./

CMD ["node", "app.js"]

