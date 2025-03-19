ARG NODE_VERSION="18.14.0"
ARG BASE_VERSION="alpine3.17"
ARG OLD_IMAGE="integrations-webapp:latest"
ARG KEEP_DAYS=60

FROM node:${NODE_VERSION}-${BASE_VERSION} AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY package.json yarn.lock ./
RUN yarn install

COPY . ./

RUN yarn build

FROM ${OLD_IMAGE} AS old_css

FROM nginxinc/nginx-unprivileged:1.25
ARG OLD_IMAGE=${OLD_IMAGE}
ARG KEEP_DAYS=${KEEP_DAYS}

COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx docker/headers /usr/share/nginx/html/headers
COPY --chown=nginx:nginx docker/file_handler.sh /
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html/integrations/
COPY --from=old_css --chown=nginx:nginx /usr/share/nginx/html/integrations/assets/all.tx[t] /usr/share/nginx/html/integrations/assets/*.css /usr/share/nginx/html/integrations/assets/

COPY docker-entrypoint.sh /

RUN cd /usr/share/nginx/html/integrations/ \
    && /file_handler.sh css

COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html/integrations/

RUN mv /usr/share/nginx/html/integrations/index.html /usr/share/nginx/html/integrations/index.html.tmpl \
    && cd /usr/share/nginx/html/integrations/ \
    && ln -s /tmp/index.html
    
EXPOSE 8080
ENTRYPOINT ["bash","/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
