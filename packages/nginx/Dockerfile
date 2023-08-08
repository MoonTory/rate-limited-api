FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY ./packages/nginx/nginx.conf /etc/nginx

EXPOSE 80
