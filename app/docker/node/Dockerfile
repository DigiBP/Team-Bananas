FROM node:fermium-buster as builder

# copy source code into image, note .dockerignore
WORKDIR /app
COPY ./frontend .

# install dependencies
RUN npm install --unsafe-perm -g node-sass@4.14.0
RUN npm install
RUN npm run build

ENV PORT=3010
ENV HOST=0.0.0.0

EXPOSE 3010

CMD [ "npm", "run", "start" ]