FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development
ENV WATCHPACK_POLLING=false
ENV CHOKIDAR_USEPOLLING=false

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--turbo"]
