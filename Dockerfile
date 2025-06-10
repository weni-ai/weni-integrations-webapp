ARG NODE_VERSION="18.14.0"
ARG BASE_VERSION="alpine3.17"
ARG OLD_IMAGE="integrations-webapp:latest"
ARG KEEP_DAYS=60

FROM node:${NODE_VERSION}-${BASE_VERSION} AS builder

WORKDIR /app

# Add build arguments for env variables
ARG API_BASE_URL
ARG WHATSAPP_FACEBOOK_APP_ID
ARG FACEBOOK_APP_ID
ARG PARENT_IFRAME_DOMAIN
ARG FLOWS_IFRAME_URL
ARG WHATSAPP_FACEBOOK_APP_CONFIG_ID
ARG USE_SENTRY
ARG SENTRY_DSN
ARG GOOGLE_CLOUD_ID
ARG GOOGLE_REDIRECT_URI
ARG PUBLIC_PATH_URL

# Set them as environment variables
ENV API_BASE_URL=${API_BASE_URL}
ENV WHATSAPP_FACEBOOK_APP_ID=${WHATSAPP_FACEBOOK_APP_ID}
ENV FACEBOOK_APP_ID=${FACEBOOK_APP_ID}
ENV PARENT_IFRAME_DOMAIN=${PARENT_IFRAME_DOMAIN}
ENV FLOWS_IFRAME_URL=${FLOWS_IFRAME_URL}
ENV WHATSAPP_FACEBOOK_APP_CONFIG_ID=${WHATSAPP_FACEBOOK_APP_CONFIG_ID}
ENV USE_SENTRY=${USE_SENTRY}
ENV SENTRY_DSN=${SENTRY_DSN}
ENV GOOGLE_CLOUD_ID=${GOOGLE_CLOUD_ID}
ENV GOOGLE_REDIRECT_URI=${GOOGLE_REDIRECT_URI}
ENV PUBLIC_PATH_URL=${PUBLIC_PATH_URL}

RUN apk add --no-cache git

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

RUN npm run build

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
