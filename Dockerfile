FROM nginx:alpine
ARG SITE
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ${SITE}/ /usr/share/nginx/html/
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
