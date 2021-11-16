FROM node:16

WORKDIR /node/app

COPY package.json ./

RUN npm install

COPY ./ ./

CMD ["node", "./bin/www.js"]

EXPOSE 5000