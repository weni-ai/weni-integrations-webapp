FROM node:14.17.4-alpine3.14 as builder

WORKDIR /app

RUN apk add --no-cache git

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

RUN yarn build

FROM nginxinc/nginx-unprivileged:1.25

COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html/integrations/
COPY docker-entrypoint.sh /

EXPOSE 8080
ENTRYPOINT ["bash","/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
