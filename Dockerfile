FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=0 /app/out ./out

EXPOSE 3000

CMD ["serve", "-s", "out", "-l", "3000"]
