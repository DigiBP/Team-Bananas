FROM node:fermium-buster as builder

# copy source code into image, note .dockerignore
WORKDIR /app
COPY ./frontend .

# install dependencies, prune for production
RUN rm -rf ./node_modules/*
RUN npm cache clean --force
RUN npm install
RUN npm run build
RUN npm prune

FROM node:hydrogen-alpine

WORKDIR /app

# copy from build stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.nuxt ./.nuxt
COPY --from=builder /app/node_modules ./node_modules

ENV PORT=3010
ENV HOST=0.0.0.0

EXPOSE 3010

CMD [ "npm", "run", "start" ]
