FROM node:10-alpine

WORKDIR /app

RUN mkdir ./core

COPY ./package.json .
COPY ./packages/core/package.json ./packages/core/

RUN npm install -g npm
RUN npm i -g yarn
RUN yarn install

COPY ./packages/core ./packages/core
COPY ./packages/core/prod.env ./packages/core/.env

WORKDIR /app/packages/common

RUN yarn install
RUN yarn build

WORKDIR /app/packages/core

RUN yarn install
RUN yarn build

EXPOSE 5002

CMD ["yarn", "start"]
