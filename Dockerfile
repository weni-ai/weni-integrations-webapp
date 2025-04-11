ARG NODE_VERSION="18.14.0"
ARG BASE_VERSION="alpine3.17"
ARG OLD_IMAGE="integrations-webapp:latest"
ARG KEEP_DAYS=60

FROM node:${NODE_VERSION}-${BASE_VERSION} AS builder

WORKDIR /app

# Add build arguments for env variables
ARG VITE_APP_API_BASE_URL
ARG VITE_APP_WHATSAPP_FACEBOOK_APP_ID
ARG VITE_APP_FACEBOOK_APP_ID
ARG VITE_APP_PARENT_IFRAME_DOMAIN
ARG VITE_APP_FLOWS_IFRAME_URL
ARG VITE_APP_WHATSAPP_FACEBOOK_APP_CONFIG_ID
ARG VITE_APP_USE_SENTRY
ARG VITE_APP_SENTRY_DSN
ARG VITE_APP_GOOGLE_CLOUD_ID
ARG VITE_APP_GOOGLE_REDIRECT_URI

# Set them as environment variables
ENV VITE_APP_API_BASE_URL=${VITE_APP_API_BASE_URL}
ENV VITE_APP_WHATSAPP_FACEBOOK_APP_ID=${VITE_APP_WHATSAPP_FACEBOOK_APP_ID}
ENV VITE_APP_FACEBOOK_APP_ID=${VITE_APP_FACEBOOK_APP_ID}
ENV VITE_APP_PARENT_IFRAME_DOMAIN=${VITE_APP_PARENT_IFRAME_DOMAIN}
ENV VITE_APP_FLOWS_IFRAME_URL=${VITE_APP_FLOWS_IFRAME_URL}
ENV VITE_APP_WHATSAPP_FACEBOOK_APP_CONFIG_ID=${VITE_APP_WHATSAPP_FACEBOOK_APP_CONFIG_ID}
ENV VITE_APP_USE_SENTRY=${VITE_APP_USE_SENTRY}
ENV VITE_APP_SENTRY_DSN=${VITE_APP_SENTRY_DSN}
ENV VITE_APP_GOOGLE_CLOUD_ID=${VITE_APP_GOOGLE_CLOUD_ID}
ENV VITE_APP_GOOGLE_REDIRECT_URI=${VITE_APP_GOOGLE_REDIRECT_URI}

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
