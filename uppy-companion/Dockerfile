FROM node:12-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . ./

# RUN npm run gcp-build

CMD [ "node", "index.js" ]

