FROM node:fermium-buster as builder

WORKDIR /app

COPY ./frontend .

RUN npm install --unsafe-perm -g node-sass@4.14.0
RUN npm install
RUN npm run build

WORKDIR /app

ENV OPENAI_API_KEY sk-xxx

ENV HOST 0.0.0.0
ENV PORT 3100
EXPOSE 3100

CMD [ "npm", "run", "start" ]
