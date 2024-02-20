FROM node:current-alpine3.19 as builder

COPY . /src
WORKDIR /src
RUN apk update && npm install
RUN npm run build-only --omit=dev

FROM nginx:alpine3.18-slim

LABEL org.opencontainers.image.authors="julian.hahnfeld@computational.bio.uni-giessen.de"
LABEL org.opencontainers.image.url='https://github.com/jhahnfeld/sorfdb-web'
LABEL org.opencontainers.image.documentation='https://github.com/jhahnfeld/sorfdb-web/README.md'
LABEL org.opencontainers.image.title='sORFdb Web Frontend'
LABEL org.opencontainers.image.description='Web frontend for sORFdb'

RUN apk update

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /src/dist /usr/share/nginx/html