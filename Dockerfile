FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env ./

RUN npm run build

ENV NODE_ENV=production

EXPOSE 8000

CMD ["node", "dist/server.js"]
