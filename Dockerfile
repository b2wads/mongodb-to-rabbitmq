FROM node:14.15.0-alpine

WORKDIR /var/app

COPY . .

RUN npm ci

CMD ["npm", "start"]
