FROM nginx:alpine
# Config por defecto del sitio
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Archivos estáticos de la app
COPY . /usr/share/nginx/html
EXPOSE 80
