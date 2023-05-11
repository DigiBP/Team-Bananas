FROM node:fermium-buster as builder

WORKDIR /app

COPY ./automation .

RUN npm install
RUN npm run build

WORKDIR /app

ENV HOST 0.0.0.0
ENV PORT 3200
EXPOSE 3200

CMD [ "npm", "run", "start" ]
