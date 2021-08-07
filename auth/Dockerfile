FROM node:14.17.0-alpine

WORKDIR /app

COPY package.json .

RUN npm install --only=prod

COPY . .

CMD ["npm", "start"]