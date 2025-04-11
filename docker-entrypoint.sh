#!/bin/sh
export JSON_STRING=''
sed "s|//CONFIGURATIONS_PLACEHOLDER|${JSON_STRING}|" /usr/share/nginx/html/integrations/index.html.tmpl > /tmp/index.html

exec "$@"